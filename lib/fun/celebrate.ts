"use client";

/**
 * Confetti wrapper — lazy-loads canvas-confetti so quiz listing
 * and article bundles stay lean. No-op when user prefers
 * reduced motion.
 */

const COLORS = ["#2563eb", "#7c3aed", "#16a34a", "#f59e0b", "#ffffff"];

function reducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

async function getConfetti() {
  if (reducedMotion()) return null;
  try {
    const m = await import("canvas-confetti");
    return m.default;
  } catch {
    return null;
  }
}

export async function celebratePerfect() {
  const confetti = await getConfetti();
  if (!confetti) return;
  try {
    await confetti({
      particleCount: 130,
      spread: 90,
      origin: { y: 0.6 },
      colors: COLORS,
      disableForReducedMotion: true,
    });
    setTimeout(() => {
      void confetti({
        particleCount: 60,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.7 },
        colors: COLORS,
        disableForReducedMotion: true,
      });
      void confetti({
        particleCount: 60,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.7 },
        colors: COLORS,
        disableForReducedMotion: true,
      });
    }, 250);
  } catch {
    /* ignore */
  }
}

export async function celebratePass() {
  const confetti = await getConfetti();
  if (!confetti) return;
  try {
    await confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.65 },
      colors: COLORS,
      disableForReducedMotion: true,
    });
  } catch {
    /* ignore */
  }
}

export async function celebrateEggRain() {
  const confetti = await getConfetti();
  if (!confetti) return;
  try {
    const end = Date.now() + 1200;
    const frame = () => {
      void confetti({ particleCount: 4, angle: 60, spread: 60, origin: { x: 0 }, colors: COLORS });
      void confetti({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1 }, colors: COLORS });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  } catch {
    /* ignore */
  }
}
