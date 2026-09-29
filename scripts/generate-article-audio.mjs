#!/usr/bin/env node
/*
 * Pre-generates narration audio for learn articles.
 *
 * Why pre-generated? Synthesizing in the visitor's browser costs them a
 * ~300MB model download plus minutes of WASM inference. Generating once here
 * and committing small .mp3 files means the site's Listen player is a plain
 * <audio> tag: zero runtime compute.
 *
 * Usage:
 *   node scripts/generate-article-audio.mjs --list
 *       Print a sorted inventory of all articles (words, minutes, audio status).
 *
 *   node scripts/generate-article-audio.mjs --slug linear-regression
 *       Generate audio for one article.
 *
 *   node scripts/generate-article-audio.mjs --all
 *       Generate audio for every article missing it.
 *
 * Options:
 *   --port <n>     Production server port (default 4173). The script starts
 *                  `next start` itself if nothing listens there (run
 *                  `bun run build` / `pnpm build` first).
 *   --voice <id>   Kokoro voice (default af_heart).
 *   --keep-wav     Keep the intermediate .wav next to the .mp3.
 *
 * Requirements: ffmpeg on PATH (for .mp3; otherwise .wav is kept and used).
 * The Kokoro model (~300MB) auto-downloads to the HF cache on first run.
 */

import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST = path.join(ROOT, "lib", "article-audio.ts");
const METADATA = path.join(ROOT, "lib", "metadata.ts");
const AUDIO_DIR = path.join(ROOT, "public", "audio", "articles");
const MODEL_ID = "onnx-community/Kokoro-82M-v1.0-ONNX";
const CHUNK_TARGET = 600;
const WORDS_PER_MINUTE = 150;

const args = process.argv.slice(2);
const getArg = (name, fallback = null) => {
  const i = args.indexOf(name);
  return i >= 0 && i + 1 < args.length ? args[i + 1] : fallback;
};
const PORT = parseInt(getArg("--port", "4173"), 10);
const VOICE = getArg("--voice", "af_heart");
const KEEP_WAV = args.includes("--keep-wav");
const ONLY_SLUG = getArg("--slug", null);
const GENERATE_ALL = args.includes("--all");
const LIST_ONLY = args.includes("--list");

function readSlugs() {
  // Canonical route list is articleMetadata in lib/metadata.ts (drives
  // generateStaticParams). The audio manifest only knows slugs it has seen,
  // so new articles would otherwise be invisible ("nothing to do" bug).
  try {
    const src = readFileSync(METADATA, "utf8");
    const start = src.indexOf("export const articleMetadata");
    if (start >= 0) {
      let end = src.indexOf("articleSimulationMap", start);
      if (end < 0) end = src.length;
      const block = src.slice(start, end);
      const slugs = [
        ...block.matchAll(/^  (?:"([^"]+)"|([A-Za-z0-9_-]+))\s*:\s*\{/gm),
      ].map((m) => m[1] ?? m[2]);
      if (slugs.length > 0) return [...new Set(slugs)];
    }
  } catch {}
  // Fallback: slugs already present in the audio manifest.
  const src = readFileSync(MANIFEST, "utf8");
  // Only the articleAudio block — articleSubtitles repeats the same keys.
  const head = src.split("articleSubtitles")[0];
  return [...head.matchAll(/^  "([^"]+)":/gm)].map((m) => m[1]);
}

function decodeEntities(s) {
  return s
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(parseInt(n, 10)))
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

/** UI chrome strings that must never be narrated (player buttons, TOC). */
const UI_DENY = /^(copy|copied!|share|listen|on this page|\d+ topics)$/i;

/**
 * Scope scraping to the article itself. The full page HTML also contains
 * navbar / footer / player-chrome prose — narrating that is the
 * "voice says Share… Listen…" bug. We take only: first h1 (article title),
 * the header lede paragraph, and the balanced <div data-article-body> block.
 */
function extractArticleSection(html) {
  const h1 = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  const desc = html.match(/<p class="text-lg[^"]*"[^>]*>([\s\S]*?)<\/p>/);
  let body = "";
  const mi = html.indexOf("data-article-body");
  if (mi >= 0) {
    const openStart = html.lastIndexOf("<div", mi);
    let depth = 0;
    let i = openStart;
    while (i < html.length) {
      const ot = html.indexOf("<", i);
      if (ot < 0) break;
      const ct = html.indexOf(">", ot);
      if (ct < 0) break;
      const tag = html.slice(ot + 1, ct).trim();
      if (/^div[\s>]/.test(tag) && !tag.endsWith("/")) depth++;
      else if (/^\/div\b/.test(tag)) {
        depth--;
        if (depth === 0) {
          body = html.slice(openStart, ct + 1);
          break;
        }
      }
      i = ct + 1;
    }
  }
  return { h1: h1?.[1] ?? "", desc: desc?.[1] ?? "", body };
}

/** Prose-only text in document order: title + h2/h3/p/li. Code/math excluded. */
function extractText(html) {
  const { h1, desc, body } = extractArticleSection(html);
  const parts = [];
  const title = decodeEntities(h1.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
  const re = /<(h2|h3|p|li)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  for (const src of [desc, body]) {
    re.lastIndex = 0; // /g regexes carry position across input strings
    let m;
    while ((m = re.exec(src)) !== null) {
      const text = decodeEntities(m[2].replace(/<[^>]+>/g, " "))
        .replace(/\s+/g, " ")
        .trim();
      if (text.length <= 2 || UI_DENY.test(text)) continue;
      parts.push(text);
    }
  }
  return { title, body: parts.join("\n") };
}

function chunkText(text, target = CHUNK_TARGET) {
  const sentences = text
    .split(/(?<=[.!?;:])\s+|\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const chunks = [];
  let current = "";
  for (const s of sentences) {
    if (current && current.length + s.length + 1 > target) {
      chunks.push(current);
      current = s;
    } else {
      current = current ? `${current} ${s}` : s;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

async function serverUp(port) {
  for (const probe of ["/learn/linear-regression", "/"]) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}${probe}`, {
        redirect: "manual",
      });
      if (res.status === 200) return true;
    } catch {
      // try next probe
    }
  }
  return false;
}

function nextBinary() {
  const local = path.join(ROOT, "node_modules", ".bin", "next");
  if (existsSync(local)) return { cmd: local, via: "local" };
  return { cmd: "npx", via: "npx", prefix: ["next"] };
}

async function ensureServer(port) {
  if (await serverUp(port)) return null;
  if (!existsSync(path.join(ROOT, ".next", "BUILD_ID"))) {
    throw new Error(
      "No production build found (.next/BUILD_ID missing — .next/ holds dev artifacts only). " +
        "Run `bun run build` (or `pnpm build`) first, then re-run this script.",
    );
  }
  const { cmd, prefix = [] } = nextBinary();
  const serverArgs = [...prefix, "start", "-p", String(port)];
  console.log(`Starting production server: ${cmd} ${serverArgs.join(" ")} ...`);
  const child = spawn(cmd, serverArgs, {
    cwd: ROOT,
    stdio: ["ignore", "pipe", "pipe"],
  });
  let spawnError = null;
  child.on("error", (err) => {
    spawnError = err;
  });
  const logTail = [];
  const keep = (chunk) => {
    for (const line of String(chunk).split("\n")) {
      if (!line.trim()) continue;
      logTail.push(line);
      if (logTail.length > 20) logTail.shift();
    }
  };
  child.stdout?.on("data", keep);
  child.stderr?.on("data", keep);
  const deadline = Date.now() + 45000;
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 1000));
    if (await serverUp(port)) return child;
    if (spawnError) break;
    if (child.exitCode !== null) break;
  }
  try {
    child.kill();
  } catch {}
  const detail = spawnError
    ? `spawn failed: ${spawnError.message}`
    : logTail.length
      ? `server output:\n  ${logTail.join("\n  ")}`
      : `exited with code ${child.exitCode}`;
  throw new Error(
    `Could not start a server on :${port} (${cmd} ${serverArgs.join(" ")}). ${detail}\n` +
      `If a dev server is already running, re-run with its port: --port 3000.`,
  );
}

async function fetchArticle(slug, port) {
  const res = await fetch(`http://127.0.0.1:${port}/learn/${slug}`);
  if (!res.ok) throw new Error(`GET /learn/${slug} -> ${res.status}`);
  return extractText(await res.text());
}

function writeWav(filePath, samples, sampleRate) {
  const n = samples.length;
  const buf = Buffer.alloc(44 + n * 2);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + n * 2, 4);
  buf.write("WAVE", 8);
  buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20); // PCM
  buf.writeUInt16LE(1, 22); // mono
  buf.writeUInt32LE(sampleRate, 24);
  buf.writeUInt32LE(sampleRate * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) {
    const v = Math.max(-1, Math.min(1, samples[i]));
    buf.writeInt16LE(Math.round(v * 32767), 44 + i * 2);
  }
  writeFileSync(filePath, buf);
}

function fmtVttTime(sec) {
  const ms = Math.max(0, Math.round(sec * 1000));
  const h = String(Math.floor(ms / 3600000)).padStart(2, "0");
  const m = String(Math.floor((ms % 3600000) / 60000)).padStart(2, "0");
  const s = String(Math.floor((ms % 60000) / 1000)).padStart(2, "0");
  const r = String(ms % 1000).padStart(3, "0");
  return `${h}:${m}:${s}.${r}`;
}

/**
 * One cue per TTS chunk with measured boundaries — chunk durations come
 * from the synthesized sample counts, so cues stay in sync with the audio.
 */
function writeVtt(vttPath, chunks, durations) {
  const out = ["WEBVTT", ""];
  let t = 0;
  for (let i = 0; i < chunks.length; i++) {
    const start = t;
    t += durations[i];
    const text = chunks[i].replace(/-->/g, "->");
    out.push(`${fmtVttTime(start)} --> ${fmtVttTime(t)}`, text, "");
  }
  writeFileSync(vttPath, out.join("\n"), "utf8");
}

function hasMp3Encoder() {
  try {
    const out = execFileSync("ffmpeg", ["-hide_banner", "-encoders"], { encoding: "utf8" });
    return out.includes("libmp3lame");
  } catch {
    return false;
  }
}

function toMp3(wavPath, mp3Path) {
  execFileSync(
    "ffmpeg",
    ["-y", "-v", "error", "-i", wavPath, "-codec:a", "libmp3lame", "-b:a", "64k", "-ac", "1", mp3Path],
    { stdio: "inherit" },
  );
}

/** Insert `  "slug": value,` into a TS map block, keeping keys sorted. */
function upsertMapEntry(block, slug, value) {
  const lineRe = new RegExp(`^([ \\t]*"${slug}":).*$`, "m");
  if (lineRe.test(block)) return block.replace(lineRe, `$1 ${value},`);
  const lines = block.split("\n");
  const closeIdx = lines.lastIndexOf("};");
  const entry = `  "${slug}": ${value},`;
  if (closeIdx < 0) return `${block.replace(/\s+$/, "")}\n${entry}\n`;
  const keys = lines
    .slice(0, closeIdx)
    .map((l) => l.match(/^\s*"([^"]+)":/)?.[1])
    .filter(Boolean);
  let at = lines.findIndex((l) => /^\s*"[^"]+":/.test(l) && l.match(/^\s*"([^"]+)":/)[1] > slug);
  if (at < 0 || at > closeIdx) at = closeIdx;
  lines.splice(at, 0, entry);
  void keys;
  return lines.join("\n");
}

function updateManifest(slug, publicPath) {
  const src = readFileSync(MANIFEST, "utf8");
  const marker = "articleSubtitles";
  const at = src.indexOf(marker);
  if (at < 0) throw new Error(`${MANIFEST} has no articleSubtitles map`);
  const head = src.slice(0, at);
  const tail = src.slice(at);
  writeFileSync(MANIFEST, upsertMapEntry(head, slug, `"${publicPath}"`) + tail);
}

/** Same-line update, but scoped to the articleSubtitles block (slugs repeat). */
function updateSubtitle(slug, vttPath) {
  const src = readFileSync(MANIFEST, "utf8");
  const marker = "articleSubtitles";
  const at = src.indexOf(marker);
  if (at < 0) throw new Error(`${MANIFEST} has no articleSubtitles map`);
  const head = src.slice(0, at);
  const tail = src.slice(at);
  writeFileSync(MANIFEST, head + upsertMapEntry(tail, slug, `"${vttPath}"`));
}

async function main() {
  const slugs = readSlugs();
  mkdirSync(AUDIO_DIR, { recursive: true });

  const serverChild = await ensureServer(PORT);
  try {
    // Sorted inventory: shortest article first (cheapest to synthesize).
    const inventory = [];
    for (const slug of slugs) {
      const { title, body } = await fetchArticle(slug, PORT);
      const text = title ? `${title}\n${body}` : body;
      const words = text.split(/\s+/).filter(Boolean).length;
      const audioMp3 = path.join(AUDIO_DIR, `${slug}.mp3`);
      const audioWav = path.join(AUDIO_DIR, `${slug}.wav`);
      const hasAudio = existsSync(audioMp3) || existsSync(audioWav);
      inventory.push({ slug, title, words, hasAudio });
    }
    inventory.sort((a, b) => a.words - b.words);

    console.log("\nArticles (sorted by length):");
    console.log("slug".padEnd(24) + "words".padStart(7) + "  ~min".padStart(6) + "  audio");
    for (const item of inventory) {
      const mins = (item.words / WORDS_PER_MINUTE).toFixed(1);
      console.log(
        item.slug.padEnd(24) +
          String(item.words).padStart(7) +
          mins.padStart(6) +
          `  ${item.hasAudio ? "yes" : "no"}`,
      );
    }

    if (LIST_ONLY) return;

    let targets = inventory;
    if (ONLY_SLUG) {
      targets = inventory.filter((i) => i.slug === ONLY_SLUG);
      if (targets.length === 0) throw new Error(`Unknown slug "${ONLY_SLUG}"`);
    } else if (!GENERATE_ALL) {
      throw new Error("Pass --slug <slug>, --all, or --list.");
    } else {
      targets = inventory.filter((i) => !i.hasAudio);
      if (targets.length === 0) {
        console.log("\nAll articles already have audio. Nothing to do.");
        return;
      }
    }

    let KokoroTTS;
    try {
      ({ KokoroTTS } = await import("kokoro-js"));
    } catch {
      throw new Error(
        "The 'kokoro-js' package is not installed (it is intentionally NOT a project " +
          "dependency, because its onnxruntime postinstall downloads large native binaries).\n" +
          "Install it only on the machine that generates audio:\n" +
          "  pnpm add -D kokoro-js   (or: bun add --dev kokoro-js)\n" +
          "then re-run this script. Remove it afterwards if you want to keep installs lean.",
      );
    }
    console.log(`\nLoading Kokoro voice "${VOICE}" (first run downloads ~300MB) ...`);
    const tts = await KokoroTTS.from_pretrained(MODEL_ID, {
      dtype: "q8",
      device: "cpu",
      progress_callback: (p) => {
        if (p?.status === "progress") console.log(`  ${p.file} ${Math.round(p.progress)}%`);
      },
    });

    const canMp3 = hasMp3Encoder();
    if (!canMp3) console.log("No libmp3lame encoder found — keeping .wav files.");

    for (const item of targets) {
      const { title, body } = await fetchArticle(item.slug, PORT);
      const chunks = chunkText(title ? `${title}\n${body}` : body);
      console.log(`\n[${item.slug}] ${chunks.length} chunks, ~${item.words} words ...`);
      const pieces = [];
      let sr = 24000;
      for (let i = 0; i < chunks.length; i++) {
        process.stdout.write(`\r  chunk ${i + 1}/${chunks.length}`);
        const raw = await tts.generate(chunks[i], { voice: VOICE });
        sr = raw.sampling_rate;
        pieces.push(raw.audio);
      }
      process.stdout.write("\n");
      const total = pieces.reduce((n, p) => n + p.length, 0);
      const pcm = new Float32Array(total);
      let off = 0;
      for (const p of pieces) {
        pcm.set(p, off);
        off += p.length;
      }
      const wavPath = path.join(AUDIO_DIR, `${item.slug}.wav`);
      writeWav(wavPath, pcm, sr);
      let publicPath = `/audio/articles/${item.slug}.wav`;
      if (canMp3 && !KEEP_WAV) {
        const mp3Path = path.join(AUDIO_DIR, `${item.slug}.mp3`);
        toMp3(wavPath, mp3Path);
        unlinkSync(wavPath);
        publicPath = `/audio/articles/${item.slug}.mp3`;
      }
      updateManifest(item.slug, publicPath);
      // Subtitles: measured per-chunk durations keep cues in sync.
      const durations = pieces.map((p) => p.length / sr);
      const vttPath = path.join(AUDIO_DIR, `${item.slug}.vtt`);
      writeVtt(vttPath, chunks, durations);
      updateSubtitle(item.slug, `/audio/articles/${item.slug}.vtt`);
      const mins = (total / sr / 60).toFixed(1);
      console.log(`  saved ${publicPath} + .vtt (${mins} min audio)`);
    }
    console.log("\nDone. Manifest updated: lib/article-audio.ts");
  } finally {
    if (serverChild) {
      serverChild.kill();
    }
  }
}

main().catch((err) => {
  console.error(`\nError: ${err.message}`);
  process.exit(1);
});
