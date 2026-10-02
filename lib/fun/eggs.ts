"use client";

import { useEffect } from "react";

/** Local-only egg discovery — persisted so hunters keep trophies. */
const EGGS_KEY = "ml-fun:eggs";

export const EGG_IDS = {
  konami: "konami",
  logoParty: "logo-party",
  ghostBoo: "ghost-boo",
} as const;

function getFoundEggs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(EGGS_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function markFound(id: string): boolean {
  try {
    const found = getFoundEggs();
    if (found.includes(id)) return false;
    localStorage.setItem(EGGS_KEY, JSON.stringify([...found, id]));
    return true;
  } catch {
    return true; // private mode — still celebrate, just don't persist
  }
}

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

/** Fires cb on Konami entry. Ignores keystrokes inside form fields. */
export function useKonamiCode(cb: () => void) {
  useEffect(() => {
    let pos = 0;
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        target?.isContentEditable
      ) {
        return;
      }
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      pos = key === KONAMI[pos] ? pos + 1 : key === KONAMI[0] ? 1 : 0;
      if (pos === KONAMI.length) {
        pos = 0;
        cb();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [cb]);
}
