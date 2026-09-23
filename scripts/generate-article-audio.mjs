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
  const src = readFileSync(MANIFEST, "utf8");
  return [...src.matchAll(/^  "([^"]+)":/gm)].map((m) => m[1]);
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

/** Prose-only text in document order: title + h2/h3/p/li. Code/math excluded. */
function extractText(html) {
  const parts = [];
  let title = "";
  const re = /<(h1|h2|h3|p|li)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const tag = m[1].toLowerCase();
    const text = decodeEntities(m[2].replace(/<[^>]+>/g, " "))
      .replace(/\s+/g, " ")
      .trim();
    if (text.length <= 2 || /^(copy|copied!)$/i.test(text)) continue;
    if (tag === "h1") {
      if (!title) title = text;
      continue;
    }
    parts.push(text);
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
  try {
    const res = await fetch(`http://127.0.0.1:${port}/learn/linear-regression`, {
      redirect: "manual",
    });
    return res.status === 200;
  } catch {
    return false;
  }
}

async function ensureServer(port) {
  if (await serverUp(port)) return null;
  if (!existsSync(path.join(ROOT, ".next"))) {
    throw new Error("No production build found. Run `bun run build` (or `pnpm build`) first.");
  }
  console.log(`Starting production server on :${port} ...`);
  const child = spawn("bun", ["run", "start", "--", "--port", String(port)], {
    cwd: ROOT,
    stdio: "ignore",
  });
  child.on("error", () => {});
  const deadline = Date.now() + 45000;
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 1000));
    if (await serverUp(port)) return child;
    if (child.exitCode !== null) break;
  }
  // Fallback: try npx next start (non-bun environments).
  try {
    child.kill();
  } catch {}
  const child2 = spawn("npx", ["next", "start", "--port", String(port)], {
    cwd: ROOT,
    stdio: "ignore",
    shell: process.platform === "win32",
  });
  const deadline2 = Date.now() + 45000;
  while (Date.now() < deadline2) {
    await new Promise((r) => setTimeout(r, 1000));
    if (await serverUp(port)) return child2;
    if (child2.exitCode !== null) break;
  }
  try {
    child2.kill();
  } catch {}
  throw new Error(`Could not start a server on :${port}. Start one manually and re-run with --port.`);
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

function updateManifest(slug, publicPath) {
  let src = readFileSync(MANIFEST, "utf8");
  const lineRe = new RegExp(`^([ \\t]*"${slug}":).*$`, "m");
  if (!lineRe.test(src)) throw new Error(`Slug "${slug}" missing from ${MANIFEST}`);
  src = src.replace(lineRe, `$1 "${publicPath}",`);
  writeFileSync(MANIFEST, src);
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
      const mins = (total / sr / 60).toFixed(1);
      console.log(`  saved ${publicPath} (${mins} min audio)`);
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
