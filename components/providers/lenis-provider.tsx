"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function LenisProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;
    // Skip smooth-scroll on small screens: native scroll is faster and
    // avoids fighting bottom nav / keyboard.
    if (window.innerWidth < 768) return;

    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      // Handle anchor links natively so TOC / skip-link jumps stay smooth
      // without the removed CSS `scroll-behavior: smooth` fighting the rAF loop.
      allowNestedScroll:true,
      anchors: true,
    });

    // Exposed for anchor navigation (e.g. article TOC scroll-spy links).
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else {
        rafId = requestAnimationFrame(raf);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("visibilitychange", onVisibility);
      if ((window as unknown as { __lenis?: Lenis }).__lenis === lenis) {
        delete (window as unknown as { __lenis?: Lenis }).__lenis;
      }
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
