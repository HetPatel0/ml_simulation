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
  "first-project": "/audio/articles/first-project.mp3",
  "good-vs-bad-models": "/audio/articles/good-vs-bad-models.mp3",
  "gradient-descent": "/audio/articles/gradient-descent.mp3",
  "k-nearest-neighbors": "/audio/articles/k-nearest-neighbors.mp3",
  "kernel-trick": "/audio/articles/kernel-trick.mp3",
  "least-squares": "/audio/articles/least-squares.mp3",
  "linear-regression": "/audio/articles/linear-regression.mp3",
  "logistic-regression": "/audio/articles/logistic-regression.mp3",
  "naive-bayes": "/audio/articles/naive-bayes.mp3",
  "polynomial-regression": "/audio/articles/polynomial-regression.mp3",
  "svr": "/audio/articles/svr.mp3",
  "what-is-ml": "/audio/articles/what-is-ml.mp3",
};

/**
 * Word-for-word caption tracks, emitted by the generator alongside audio
 * (one cue per TTS chunk with measured boundaries). `null` = no captions
 * yet — regenerate that slug's audio to produce them; timings only exist
 * at synthesis time and can't be backfilled.
 */
export const articleSubtitles: Record<string, string | null> = {
  "decision-trees": "/audio/articles/decision-trees.vtt",
  "first-project": "/audio/articles/first-project.vtt",
  "good-vs-bad-models": "/audio/articles/good-vs-bad-models.vtt",
  "gradient-descent": "/audio/articles/gradient-descent.vtt",
  "k-nearest-neighbors": "/audio/articles/k-nearest-neighbors.vtt",
  "kernel-trick": "/audio/articles/kernel-trick.vtt",
  "least-squares": "/audio/articles/least-squares.vtt",
  "linear-regression": "/audio/articles/linear-regression.vtt",
  "logistic-regression": "/audio/articles/logistic-regression.vtt",
  "naive-bayes": "/audio/articles/naive-bayes.vtt",
  "polynomial-regression": "/audio/articles/polynomial-regression.vtt",
  "svr": "/audio/articles/svr.vtt",
  "what-is-ml": "/audio/articles/what-is-ml.vtt",
};
