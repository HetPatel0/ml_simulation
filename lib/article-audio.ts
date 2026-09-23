/**
 * Pre-generated narration audio for articles.
 *
 * Files live in `public/audio/articles/<slug>.mp3` and are produced by
 * `scripts/generate-article-audio.mjs` (neural on-device TTS, committed once —
 * zero compute cost for visitors).
 *
 * A `null` value means the article has no audio file yet: the Listen button
 * is hidden for that article until audio is generated. See README section
 * "Article audio (Listen button)" for how to add audio to an article.
 */
export const articleAudio: Record<string, string | null> = {
  "decision-trees": "/audio/articles/decision-trees.mp3",
  "gradient-descent": "/audio/articles/gradient-descent.mp3",
  "k-nearest-neighbors": "/audio/articles/k-nearest-neighbors.mp3",
  "kernel-trick": "/audio/articles/kernel-trick.mp3",
  "least-squares": "/audio/articles/least-squares.mp3",
  "linear-regression": "/audio/articles/linear-regression.mp3",
  "logistic-regression": "/audio/articles/logistic-regression.mp3",
  "naive-bayes": "/audio/articles/naive-bayes.mp3",
  "polynomial-regression": "/audio/articles/polynomial-regression.mp3",
  "svr": "/audio/articles/svr.mp3",
};
