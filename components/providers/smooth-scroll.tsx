"use client";

import { useEffect } from "react";
import type Lenis from "lenis";

/**
 * Lazy Lenis host. The 21 KB library is imported after the page is idle, so
 * it never blocks the hero or article first paint. Desktop + no-reduced-motion
 * only; touch devices keep native scrolling.
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    if (reduceMotion.matches || window.innerWidth < 768) return;

    let lenis: Lenis | null = null;
    let rafId = 0;
    let cancelled = false;

    const raf = (time: number) => {
      lenis?.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    const start = async () => {
      if (cancelled || lenis) return;
      const { default: LenisCtor } = await import("lenis");
      if (cancelled) return;

      lenis = new LenisCtor({
        duration: 1.2,
        smoothWheel: true,
        allowNestedScroll: true,
        anchors: true,
      });
      rafId = requestAnimationFrame(raf);
    };

    const requestIdle = window.requestIdleCallback?.bind(window);
    const cancelIdle = window.cancelIdleCallback?.bind(window);
    const idle = requestIdle
      ? requestIdle(() => void start(), { timeout: 1800 })
      : window.setTimeout(() => void start(), 1200);

    const onVisibility = () => {
      if (!lenis) return;
      cancelAnimationFrame(rafId);
      if (!document.hidden) rafId = requestAnimationFrame(raf);
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisibility);
      if (cancelIdle) {
        cancelIdle(idle);
      } else {
        window.clearTimeout(idle);
      }
      cancelAnimationFrame(rafId);
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  return null;
}
