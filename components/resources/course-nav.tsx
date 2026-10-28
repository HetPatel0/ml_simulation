"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ChevronDown, Search } from "lucide-react";
import { ArticleShare } from "@/components/articles/layout/article-share";
import { cn } from "@/lib/utils";
import { useResourceProgress } from "./lesson-progress";

export type PhaseOption = {
  id: string;
  kicker: string;
  title: string;
  summary: string;
  stepIds: string[];
  stepTitles: string[];
  href: string;
};

export function CourseNav({
  phases,
  currentId,
  shareTitle,
  sharePath,
}: {
  phases: PhaseOption[];
  currentId: string;
  shareTitle: string;
  sharePath: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [currentStepId, setCurrentStepId] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const currentPhase =
    phases.find((phase) => phase.id === currentId) ?? phases[0];

  useEffect(() => {
    const ids = currentPhase?.stepIds ?? [];
    if (ids.length === 0) {
      setCurrentStepId(null);
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const threshold = 230;
      let next: string | null = null;
      for (const id of ids) {
        const element = document.getElementById(id);
        if (!element) continue;
        if (element.getBoundingClientRect().top <= threshold) next = id;
        else break;
      }
      setCurrentStepId((previous) => (previous === next ? previous : next));
    };
    const onScroll = () => {
      if (frame === 0) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [currentPhase]);

  const currentStepIndex =
    currentStepId && currentPhase
      ? currentPhase.stepIds.indexOf(currentStepId)
      : -1;
  const currentStepTitle =
    currentStepIndex >= 0 ? currentPhase.stepTitles[currentStepIndex] : null;

  const allIds = useMemo(() => phases.flatMap((phase) => phase.stepIds), [phases]);
  const completed = useResourceProgress(allIds);
  const doneSet = useMemo(() => new Set(completed), [completed]);
  const doneCount = completed.length;
  const percent = allIds.length === 0 ? 0 : Math.round((doneCount / allIds.length) * 100);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return phases;
    return phases.filter((phase) => {
      const haystack = [
        phase.kicker,
        phase.title,
        phase.summary,
        ...phase.stepTitles,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [phases, query]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  const openMenu = () => {
    const index = filtered.findIndex((phase) => phase.id === currentId);
    setActive(index >= 0 ? index : 0);
    setOpen(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  useEffect(() => {
    if (!open) return;
    const list = listRef.current;
    const option = list?.querySelector<HTMLElement>(
      `#phase-option-${filtered[active]?.id ?? currentId}`,
    );
    if (!list || !option) return;
    const listRect = list.getBoundingClientRect();
    const optionRect = option.getBoundingClientRect();
    if (optionRect.top < listRect.top) {
      list.scrollTop -= listRect.top - optionRect.top;
    } else if (optionRect.bottom > listRect.bottom) {
      list.scrollTop += optionRect.bottom - listRect.bottom;
    }
  }, [active, currentId, filtered, open]);

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  const choose = (phase: PhaseOption) => {
    setOpen(false);
    setQuery("");
    router.push(phase.href);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActive((index) => Math.min(index + 1, Math.max(filtered.length - 1, 0)));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setActive((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter" && open && filtered[active]) {
      event.preventDefault();
      choose(filtered[active]);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className="sticky top-16 z-30 -mx-4 px-3 pb-2 sm:-mx-2 sm:px-0">
      <div className="rounded-2xl border border-border/80 bg-background/95 p-2.5 shadow-lg backdrop-blur-md sm:p-3">
        <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <button
              type="button"
              aria-label={open ? "Close phase menu" : "Choose a course phase"}
              aria-expanded={open}
              aria-controls="phase-options"
              onClick={() => {
                if (open) {
                  setOpen(false);
                  return;
                }
                openMenu();
              }}
              className="flex h-10 w-full cursor-pointer items-center gap-2 rounded-full border border-border bg-muted/60 px-3 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                {currentPhase?.kicker}
              </span>
              <span className="min-w-0 truncate">{currentPhase?.title}</span>
              <span className="text-muted-foreground/50" aria-hidden="true">
                /
              </span>
              <span className="min-w-0 flex-1 truncate text-muted-foreground" aria-live="polite">
                {currentStepTitle ?? "Phase overview"}
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                  open && "rotate-180",
                )}
                aria-hidden="true"
              />
            </button>

            {open && (
              <div
                id="phase-options"
                data-lenis-prevent
                className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-40 rounded-xl border border-border bg-popover p-1.5 pr-1 shadow-xl"
              >
                <div className="relative mb-1.5 pr-0.5">
                  <label htmlFor="phase-search" className="sr-only">
                    Search phases and lessons
                  </label>
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <input
                    ref={inputRef}
                    id="phase-search"
                    type="text"
                    role="combobox"
                    aria-expanded={open}
                    aria-controls="phase-options"
                    aria-autocomplete="list"
                    aria-activedescendant={
                      filtered[active] ? `phase-option-${filtered[active].id}` : undefined
                    }
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value);
                      setOpen(true);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Search phases or lessons…"
                    className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <div
                  ref={listRef}
                  role="listbox"
                  aria-label="Course phases"
                  className="max-h-[min(20rem,calc(100dvh-12rem))] touch-pan-y overflow-y-auto overscroll-contain pr-0.5 [scrollbar-gutter:stable]"
                >
                  {filtered.length === 0 ? (
                    <p className="px-3 py-6 text-sm text-muted-foreground">
                      No phase or lesson matches “{query.trim()}”.
                    </p>
                  ) : (
                    filtered.map((phase, index) => {
                      const phaseDone = phase.stepIds.filter((id) => doneSet.has(id)).length;
                      const complete =
                        phase.stepIds.length > 0 && phaseDone === phase.stepIds.length;
                      return (
                        <button
                          key={phase.id}
                          id={`phase-option-${phase.id}`}
                          type="button"
                          role="option"
                          aria-selected={phase.id === currentId}
                          onMouseEnter={() => setActive(index)}
                          onClick={() => choose(phase)}
                          className={cn(
                            "flex w-full cursor-pointer items-start gap-3 rounded-lg px-3 py-2.5 text-left",
                            index === active && "bg-muted",
                            phase.id === currentId &&
                              "bg-primary/10 ring-1 ring-inset ring-primary/30",
                          )}
                        >
                          <span className="mt-0.5 flex h-7 w-11 shrink-0 items-center justify-center rounded-md border border-border bg-background font-mono text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                            {phase.kicker.replace("Phase ", "P")}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-medium">{phase.title}</span>
                            <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                              {phaseDone}/{phase.stepIds.length} lessons done
                              {phase.id === currentId && (
                                <span className="font-medium text-primary"> · Current</span>
                              )}
                            </span>
                          </span>
                          {complete ? (
                            <ArrowRight
                              className="mt-1 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                              aria-label="Phase completed"
                            />
                          ) : (
                            <span className="mt-0.5 shrink-0 text-[11px] text-muted-foreground">
                              {phaseDone}/{phase.stepIds.length}
                            </span>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2.5 lg:w-52">
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2 text-xs">
                <span className="truncate text-muted-foreground">Course progress</span>
                <span className="font-medium">
                  {doneCount}/{allIds.length}
                </span>
              </div>
              <div
                className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-border"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={allIds.length}
                aria-valuenow={doneCount}
                aria-label="Course lessons completed"
              >
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
            <ArticleShare title={shareTitle} path={sharePath} align="right" />
        </div>
      </div>
    </div>
  </div>
);
}