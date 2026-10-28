"use client";

import { useEffect, useRef } from "react";

type LenisWindow = Window & {
  __lenis?: { scrollTo: (target: number, options?: { immediate?: boolean }) => void };
};

const ANCHOR_OFFSET = 208;

function scrollToPosition(top: number) {
  (window as LenisWindow).__lenis?.scrollTo(top, { immediate: true });
  window.scrollTo(0, top);
}

function scrollToHash(hash: string) {
  const element = document.getElementById(hash);
  if (!element) return;
  scrollToPosition(element.getBoundingClientRect().top + window.scrollY - ANCHOR_OFFSET);
}

export function PhaseScrollReset({
  moduleId,
  anchor,
}: {
  moduleId: string;
  anchor?: string;
}) {
  const previous = useRef({ moduleId, anchor });

  useEffect(() => {
    const changed =
      previous.current.moduleId !== moduleId || previous.current.anchor !== anchor;
    previous.current = { moduleId, anchor };
    const hash = window.location.hash.replace(/^#/, "");
    const target =
      hash === "topics" && anchor
        ? `${anchor}-topics`
        : hash || anchor;

    if (target) {
      const timer = window.setTimeout(() => scrollToHash(target), 50);
      return () => window.clearTimeout(timer);
    }
    if (changed) scrollToPosition(0);
  }, [anchor, moduleId]);

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (hash) scrollToHash(hash === "topics" && anchor ? `${anchor}-topics` : hash);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [anchor]);

  return null;
}
