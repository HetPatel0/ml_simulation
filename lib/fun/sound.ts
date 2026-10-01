"use client";

/**
 * Tiny WebAudio synth for quiz + egg sounds. No audio assets.
 * Setting persisted in localStorage, default ON.
 */

export const SOUND_KEY = "ml-fun:sound";

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

export function playCorrect() {
  tone(660, 0, 0.09);
  tone(880, 0.08, 0.12);
}

export function playWrong() {
  tone(160, 0, 0.2, "sawtooth", 0.06);
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
