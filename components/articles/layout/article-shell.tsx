"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  collectToc,
  scrollToSection,
  useActiveSection,
  type TocItem,
} from "./use-active-section";
import { ArticleTocDesktop, ArticleTocMobile } from "./article-toc";

/**
 * OpenAI-style article shell: left sticky topic rail + centered article column.
 * The 3-column grid keeps the article centered in the viewport — the TOC
 * never pushes it aside. Right column is an empty spacer for symmetry.
 */
export function ArticleShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [toc, setToc] = useState<TocItem[]>([]);
  const activeId = useActiveSection(toc.map((t) => t.id));

  useEffect(() => {
    const root = contentRef.current;
    if (!root) return;

    // Deep-link support: ids are assigned client-side, so handle initial
    // hash once the real headings exist (not while the skeleton shows).
    let hashHandled = false;
    const handleHash = (items: TocItem[]) => {
      if (hashHandled || !window.location.hash) return;
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (items.some((t) => t.id === id)) {
        hashHandled = true;
        requestAnimationFrame(() => scrollToSection(id));
      }
    };

    const collect = () => {
      const items = collectToc(root);
      handleHash(items);
      setToc((prev) => {
        if (
          prev.length === items.length &&
          prev.every((p, i) => p.id === items[i].id && p.title === items[i].title)
        ) {
          return prev;
        }
        return items;
      });
    };

    collect();
    // Article bodies arrive asynchronously (per-slug dynamic import), so a
    // collect-on-mount alone runs while the skeleton is showing and the TOC
    // stays empty until the next reload. Re-collect when DOM lands instead.
    const observer = new MutationObserver(collect);
    observer.observe(root, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [children]);

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-7xl px-4 sm:px-6",
        "lg:grid lg:grid-cols-[240px_minmax(0,44rem)_240px] lg:justify-center lg:gap-8",
        className,
      )}
    >
      {/* Left sticky topic rail (desktop only) */}
      <aside className="hidden lg:block" aria-hidden={toc.length < 3}>
        <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto py-10">
          <ArticleTocDesktop items={toc} activeId={activeId} />
        </div>
      </aside>

      {/* Centered article column */}
      <div className="mx-auto w-full min-w-0 max-w-[44rem]">
        <ArticleTocMobile items={toc} activeId={activeId} className="mb-6 mt-6" />
        <div
          ref={contentRef}
          className="[&_h2]:scroll-mt-32 [&_h3]:scroll-mt-32"
        >
          {children}
        </div>
      </div>

      {/* Right spacer keeps the article optically centered */}
      <div className="hidden lg:block" aria-hidden="true" />
    </div>
  );
}
