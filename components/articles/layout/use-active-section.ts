"use client";

import { useEffect, useState } from "react";

export type TocItem = {
  id: string;
  title: string;
};

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

/**
 * Scans an article container for main-topic (h2) headings, assigns stable
 * unique ids, and returns TOC items in document order. Safe to call repeatedly.
 */
export function collectToc(root: HTMLElement): TocItem[] {
  const headings = root.querySelectorAll("h2");
  const used = new Set<string>();
  const items: TocItem[] = [];

  headings.forEach((el) => {
    const htmlEl = el as HTMLElement;
    const title = (htmlEl.textContent ?? "").trim();
    if (!title) return;

    let id = htmlEl.id || slugify(title) || "section";
    let candidate = id;
    let n = 2;
    while (used.has(candidate)) {
      candidate = `${id}-${n++}`;
    }
    id = candidate;
    used.add(id);
    htmlEl.id = id;

    items.push({ id, title });
  });

  return items;
}

/**
 * Tracks which heading id is currently in view using IntersectionObserver.
 * Works with Lenis smooth scroll since it observes geometry, not scroll events.
 */
export function useActiveSection(ids: string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (ids.length === 0) return;
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    // OpenAI-style: the section whose top has crossed ~25% from viewport top wins.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
          );
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -70% 0px",
        threshold: 0,
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids.join("|")]); // eslint-disable-line react-hooks/exhaustive-deps

  return activeId;
}

/** Smooth-scrolls to a heading, preferring Lenis when available. */
export function scrollToSection(id: string) {
  const lenis = (window as unknown as { __lenis?: { scrollTo: (t: string, o?: object) => void } }).__lenis;
  if (lenis) {
    lenis.scrollTo(`#${id}`, { offset: -110, duration: 1.1 });
    return;
  }
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}
