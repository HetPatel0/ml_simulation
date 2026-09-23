"use client";

import { useState } from "react";
import { ChevronDown, ListTree } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  scrollToSection,
  type TocItem,
} from "./use-active-section";

type ArticleTocProps = {
  items: TocItem[];
  activeId: string | null;
  className?: string;
};

function TocLinks({
  items,
  activeId,
  variant,
  onNavigate,
}: ArticleTocProps & { variant: "desktop" | "mobile"; onNavigate?: () => void }) {
  const desktop = variant === "desktop";
  return (
    <ul className="space-y-0.5">
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={isActive ? "true" : undefined}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(item.id);
                // Keep URL hash in sync without jumping (Lenis-friendly).
                window.history.replaceState(null, "", `#${item.id}`);
                onNavigate?.();
              }}
              className={cn(
                "block py-1.5 text-sm leading-snug transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                desktop
                  ? cn(
                      "rounded-none border-l-2 pr-3 pl-4",
                      isActive
                        ? "border-primary bg-primary/5 font-medium text-primary"
                        : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
                    )
                  : cn(
                      "rounded-none px-3",
                      isActive
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                    ),
              )}
            >
              {item.title}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

/** Desktop sticky rail. Parent controls sticky positioning. */
export function ArticleTocDesktop({ items, activeId, className }: ArticleTocProps) {
  if (items.length < 3) return null;
  return (
    <nav aria-label="On this page" className={className}>
      <p className="mb-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        On this page
      </p>
      <TocLinks items={items} activeId={activeId} variant="desktop" />
    </nav>
  );
}

/** Mobile floating TOC: sticky bar under the navbar + dropdown overlay (does not push content). */
export function ArticleTocMobile({ items, activeId, className }: ArticleTocProps) {
  const [open, setOpen] = useState(false);
  if (items.length < 3) return null;

  const activeItem = items.find((i) => i.id === activeId);

  return (
    <div className={cn("sticky top-17 z-30 lg:hidden", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 rounded-xl border border-border bg-card/95 px-4 py-3 text-sm font-medium text-foreground shadow-md backdrop-blur focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <ListTree className="h-4 w-4 shrink-0 text-primary" />
        <span className="flex-1 truncate text-left">
          {activeItem ? activeItem.title : "On this page"}
        </span>
        <span className="shrink-0 text-xs text-muted-foreground">
          {items.length} topics
        </span>
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 transition-transform", open && "rotate-180")}
        />
      </button>
      {open && (
        <nav
          aria-label="On this page"
          className="absolute inset-x-0 top-full mt-2 max-h-80 overflow-y-auto rounded-xl border border-border bg-card/95 p-2 shadow-lg backdrop-blur"
        >
          <TocLinks
            items={items}
            activeId={activeId}
            variant="mobile"
            onNavigate={() => setOpen(false)}
          />
        </nav>
      )}
    </div>
  );
}
