/**
 * Single import surface for site content.
 *
 * Prefer `@/lib/content` over deep imports so call sites don't track
 * which registry file owns which map:
 *
 *   import { articleMetadata, cheatsheets, quizzes } from "@/lib/content";
 *
 * Note: `lib/article-audio.ts` keeps its two-map shape (`articleAudio`,
 * `articleSubtitles`) because `scripts/generate-article-audio.mjs` parses
 * that file as text. Don't restructure it without updating the script.
 */
export * from "./metadata";
export * from "./cheatsheets";
export * from "./quizzes";
export * from "./article-audio";
export * from "./dynamic-content";
