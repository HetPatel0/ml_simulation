"use client";

/**
 * Tiny WebAudio synth for quiz + egg sounds. No audio assets.
 * Setting persisted in localStorage, default ON.
 */

const SOUND_KEY = "ml-fun:sound";

export function getSoundEnabled(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return localStorage.getItem(SOUND_KEY) !== "off";
  } catch {
    return true;
  }
}

export function setSoundEnabled(on: boolean) {
  try {
    localStorage.setItem(SOUND_KEY, on ? "on" : "off");
  } catch {
    /* private mode */
  }
}

let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!getSoundEnabled()) return null;
  try {
    if (!ctx) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(
  freq: number,
  startAt: number,
  dur = 0.12,
  type: OscillatorType = "sine",
  vol = 0.08,
  slideTo?: number,
) {
  const ac = audio();
  if (!ac) return;
  try {
    const t0 = ac.currentTime + startAt;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(vol, t0 + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(ac.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  } catch {
    /* ignore */
  }
}

function buzz(pattern: number | number[]) {
  if (typeof window === "undefined" || !getSoundEnabled()) return;
  try {
    navigator.vibrate?.(pattern);
  } catch {
    /* ignore */
  }
}

export function playCorrect() {
  // Dopamine hit: fast ascending major arpeggio (C–E–G–C) with a
  // bright octave shimmer on top. Triangle cuts through; louder + denser
  // than the old two-sine blip so a right answer feels rewarding.
  buzz(25);
  tone(523.25, 0, 0.14, "triangle", 0.14);
  tone(659.25, 0.06, 0.14, "triangle", 0.14);
  tone(783.99, 0.12, 0.16, "triangle", 0.15);
  tone(1046.5, 0.18, 0.26, "triangle", 0.15);
  tone(1318.5, 0.24, 0.2, "sine", 0.08);
  tone(1568.0, 0.3, 0.24, "sine", 0.07);
}

export function playWrong() {
  // Gentle "try again" nudge: two soft descending sine tones.
  // No buzz, no harsh edge — a miss should feel encouraging, not punishing.
  buzz(40);
  tone(329.63, 0, 0.12, "sine", 0.11);
  tone(261.63, 0.1, 0.18, "sine", 0.11);
}

export function playFail() {
  // All answers wrong: low, slow, sympathetic resolution — acknowledges
  // the miss and invites a retake instead of rubbing it in.
  buzz([60, 50, 60]);
  tone(220, 0, 0.16, "sine", 0.1);
  tone(174.61, 0.14, 0.16, "sine", 0.1);
  tone(146.83, 0.28, 0.3, "sine", 0.1);
}

export function playThemeSwitch(toDark: boolean) {
  // Single soft blip — subtle by design, pitch hints the direction.
  // Call AFTER setTheme: first-toggle AudioContext init must never
  // block the visual flip.
  tone(toDark ? 392.0 : 523.25, 0, 0.06, "sine", 0.05);
}

export function playWin() {
  tone(523.25, 0, 0.12);
  tone(659.25, 0.1, 0.12);
  tone(783.99, 0.2, 0.18);
}

export function playPerfect() {
  tone(523.25, 0, 0.12);
  tone(659.25, 0.1, 0.12);
  tone(783.99, 0.2, 0.12);
  tone(1046.5, 0.3, 0.28);
  tone(1318.5, 0.42, 0.3, "sine", 0.05);
}

export function playBoo() {
  tone(400, 0, 0.35, "sine", 0.09, 90);
}

export function playPop() {
  tone(520, 0, 0.07, "triangle", 0.07, 780);
}
