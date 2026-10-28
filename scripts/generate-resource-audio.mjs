#!/usr/bin/env node
/** Generate the comprehensive, one-file-per-phase resource narrations. */

import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT = path.join(ROOT, "public", "audio", "resources");
const MODEL_ID = "onnx-community/Kokoro-82M-v1.0-ONNX";
const VOICE = process.env.RESOURCE_AUDIO_VOICE ?? "af_heart";

const resourcesContent = readFileSync(path.join(ROOT, "lib", "resources.ts"), "utf8");

function extractModules() {
  const modules = [];
  const moduleRegex = /\{\s*id:\s*"([^"]+)",[\s\S]*?kicker:\s*"([^"]+)",[\s\S]*?title:\s*"([^"]+)",[\s\S]*?summary:\s*"([^"]+)",[\s\S]*?intro:\s*"([\s\S]*?)",[\s\S]*?outcome:\s*"([\s\S]*?)"/g;
  let m;
  while ((m = moduleRegex.exec(resourcesContent)) !== null) {
    modules.push({
      id: m[1],
      kicker: m[2],
      title: m[3],
      summary: m[4],
      intro: m[5].replace(/\s+/g, " ").trim(),
      outcome: m[6].replace(/\s+/g, " ").trim(),
    });
  }
  return modules;
}

/** Split the rawSteps array into individual step-object strings using brace matching. */
function splitStepObjects(content) {
  const startIdx = content.indexOf("const rawSteps");
  const eqIdx = content.indexOf("=", startIdx);
  const arrayStart = content.indexOf("[", eqIdx);
  const blocks = [];
  let depth = 0;
  let blockStart = -1;
  let arrayDepth = 0;
  for (let i = arrayStart; i < content.length; i++) {
    const ch = content[i];
    if (ch === "[") {
      if (arrayDepth === 0 && depth === 0) arrayDepth = 1;
      else arrayDepth++;
    } else if (ch === "]") {
      arrayDepth--;
      if (arrayDepth === 0) break; // end of the rawSteps array
    } else if (ch === "{") {
      if (depth === 0) blockStart = i;
      depth++;
    } else if (ch === "}") {
      depth--;
      if (depth === 0 && blockStart !== -1) {
        blocks.push(content.slice(blockStart, i + 1));
        blockStart = -1;
      }
    }
  }
  return blocks;
}

function extractStringArray(block, key) {
  const re = new RegExp(key + ":\\s*\\[([\\s\\S]*?)\\]", "m");
  const m = block.match(re);
  if (!m) return [];
  const items = [];
  const itemRe = /"([^"]*)"/g;
  let im;
  while ((im = itemRe.exec(m[1])) !== null) items.push(im[1]);
  return items;
}

function extractScalar(block, key) {
  // Handle nested object keys like "video.label" by searching inside the block.
  if (key.includes(".")) {
    const [objKey, prop] = key.split(".");
    const objRe = new RegExp(objKey + ":\\s*\\{([\\s\\S]*?)\\}", "m");
    const om = block.match(objRe);
    if (!om) return "";
    const propRe = new RegExp("\\b" + prop + ":\\s*" + "([\\s\\S]*?)" + "(?:,|\\n\\s*\\})", "m");
    const pm = om[1].match(propRe);
    if (!pm) return "";
    let val = pm[1].trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    return val.replace(/\s+/g, " ").trim();
  }
  const re = new RegExp(key + ":\\s*" + "([\\s\\S]*?)" + "(?:,|\\n\\s*\\})", "m");
  const m = block.match(re);
  if (!m) return "";
  let val = m[1].trim();
  if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
  return val.replace(/\s+/g, " ").trim();
}

function extractSteps() {
  const blocks = splitStepObjects(resourcesContent);
  const steps = [];
  for (const block of blocks) {
    const idMatch = block.match(/\bid:\s*"([^"]+)"/);
    const moduleMatch = block.match(/\bmodule:\s*"([^"]+)"/);
    const titleMatch = block.match(/\btitle:\s*"([^"]+)"/);
    const summaryMatch = block.match(/\bsummary:\s*"([\s\S]*?)"/);
    if (!idMatch || !moduleMatch || !titleMatch) continue;
    steps.push({
      id: idMatch[1],
      module: moduleMatch[1],
      title: titleMatch[1].replace(/\s+/g, " ").trim(),
      summary: (summaryMatch ? summaryMatch[1] : "").replace(/\s+/g, " ").trim(),
      question: extractScalar(block, "question"),
      intro: extractStringArray(block, "intro"),
      practice: extractScalar(block, "practice"),
      pitfalls: extractStringArray(block, "pitfalls"),
      checklist: extractStringArray(block, "checklist"),
      learn: extractStringArray(block, "learn"),
      video: extractScalar(block, "video.label"),
      time: extractScalar(block, "time"),
    });
  }
  return steps;
}

const modules = extractModules();
const steps = extractSteps();
const narrations = {};
const vttTexts = {};
for (const mod of modules) {
  const modSteps = steps.filter((s) => s.module === mod.id);
  // Concise narration targeting ~17-30s at the TTS speaking rate.
  // Includes the phase intro, every step's title + summary + key learn items,
  // and the phase outcome. The full description, practice, pitfalls, and
  // video titles live in the VTT subtitle file (vttTexts) below.
  let text = `${mod.kicker}, ${mod.title}. ${mod.intro} `;
  if (modSteps.length > 0) {
    text += `This phase has ${modSteps.length} lessons. `;
    for (let i = 0; i < modSteps.length; i++) {
      const step = modSteps[i];
      text += `Lesson ${i + 1}: ${step.title}. ${step.summary} `;
      if (step.learn && step.learn.length > 0) {
        text += "You will learn: " + step.learn.slice(0, 2).join(", ") + ". ";
      }
    }
  }
  text += `${mod.outcome} Work through each lesson at your own pace.`;
  narrations[mod.id] = text.replace(/\s+/g, " ").trim();

  // Full phase description for the VTT subtitle file.
  let full = `${mod.kicker}, ${mod.title}. ${mod.intro} `;
  if (modSteps.length > 0) {
    full += `This phase has ${modSteps.length} lessons. `;
    for (let i = 0; i < modSteps.length; i++) {
      const step = modSteps[i];
      full += `Lesson ${i + 1}: ${step.title}. ${step.summary} `;
      if (step.question) full += `The question for this lesson: ${step.question}. `;
      if (step.intro && step.intro.length > 0) full += step.intro.join(" ") + " ";
      if (step.learn && step.learn.length > 0) full += "You will learn: " + step.learn.join(", ") + ". ";
      if (step.practice) full += `Practice: ${step.practice}. `;
      if (step.pitfalls && step.pitfalls.length > 0) full += "Watch out for: " + step.pitfalls.join(", ") + ". ";
      if (step.checklist && step.checklist.length > 0) full += "You are ready when: " + step.checklist.join(", ") + ". ";
      if (step.video) full += `Recommended video: ${step.video}. `;
    }
  }
  full += `${mod.outcome} Take your time with each lesson and practice the examples.`;
  vttTexts[mod.id] = full.replace(/\s+/g, " ").trim();
}

function writeWav(filePath, samples, sampleRate) {
  const buffer = Buffer.alloc(44 + samples.length * 2);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + samples.length * 2, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(samples.length * 2, 40);
  for (let index = 0; index < samples.length; index += 1) {
    buffer.writeInt16LE(Math.round(Math.max(-1, Math.min(1, samples[index])) * 32767), 44 + index * 2);
  }
  writeFileSync(filePath, buffer);
}

const { KokoroTTS } = await import("kokoro-js");
mkdirSync(OUTPUT, { recursive: true });
console.log(`Loading Kokoro voice ${VOICE}...`);
const tts = await KokoroTTS.from_pretrained(MODEL_ID, { dtype: "q8", device: "cpu" });

for (const [phase, text] of Object.entries(narrations)) {
  process.stdout.write(`${phase} (${text.split(" ").length} words)... `);
  const raw = await tts.generate(text, { voice: VOICE });
  const wav = path.join(OUTPUT, `${phase}.wav`);
  const mp3 = path.join(OUTPUT, `${phase}.mp3`);
  writeWav(wav, raw.audio, raw.sampling_rate);
  execFileSync("ffmpeg", ["-y", "-v", "error", "-i", wav, "-codec:a", "libmp3lame", "-b:a", "32k", "-ac", "1", "-preset", "fast", "-tune", "fastdecode", mp3]);
  unlinkSync(wav);
  const vtt = path.join(OUTPUT, `${phase}.vtt`);
  writeFileSync(vtt, `WEBVTT\n\n00:00:00.000 --> 99:59:59.999\n${vttTexts[phase]}\n`);
  console.log("done");
}
