"use client";

import { useEffect, useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { celebratePass } from "@/lib/fun/celebrate";

const COOKIE = "ml-simulations:resource-progress";
const EVENT = "ml-resource-progress";

export type ResourceProgress = {
  completed: string[];
  quizAnswers?: Record<string, number>;
};

export function readResourceProgress(): ResourceProgress {
  if (typeof document === "undefined") return { completed: [] };
  const prefix = `${COOKIE}=`;
  const row = document.cookie
    .split("; ")
    .find((part) => part.startsWith(prefix));
  if (!row) return { completed: [] };

  try {
    const raw = decodeURIComponent(row.slice(prefix.length));
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return { completed: [] };

    const value = parsed as { completed?: unknown; quizAnswers?: unknown };
    const completed = Array.isArray(value.completed)
      ? value.completed
          .filter((item): item is string => typeof item === "string")
          .map((item) => item.split(":")[0])
          .filter(Boolean)
      : [];

    const quizAnswers =
      value.quizAnswers && typeof value.quizAnswers === "object"
        ? (value.quizAnswers as Record<string, number>)
        : undefined;

    return { completed: [...new Set(completed)], quizAnswers };
  } catch {
    return { completed: [] };
  }
}

export function writeResourceProgress(value: ResourceProgress) {
  const next = {
    completed: [...new Set(value.completed)],
    ...(value.quizAnswers ? { quizAnswers: value.quizAnswers } : {}),
  };
  document.cookie = `${COOKIE}=${encodeURIComponent(JSON.stringify(next))};max-age=31536000;path=/;samesite=lax`;
}

export function notifyResourceProgress() {
  window.dispatchEvent(new Event(EVENT));
}

export function useResourceProgress(ids?: string[]) {
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => {
      const valid = ids ? new Set(ids) : null;
      const next = readResourceProgress().completed;
      setCompleted(valid ? next.filter((id) => valid.has(id)) : next);
    };
    sync();
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, [ids]);

  return completed;
}

export function LessonProgress({ ids, title = "Your progress" }: { ids: string[]; title?: string }) {
  const completed = useResourceProgress(ids);
  const total = ids.length;
  const done = completed.length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  const reset = () => {
    const current = readResourceProgress();
    writeResourceProgress({ completed: [], quizAnswers: current.quizAnswers });
    notifyResourceProgress();
  };

  return (
    <div className="my-6 rounded-xl border border-border/70 bg-muted/25 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{done}</span> of {total}
        </p>
      </div>

      <div
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-border"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={done}
        aria-label="Lessons completed"
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          {done === total && total > 0
            ? "Phase complete. Take the quiz or move to the next phase."
            : "Saved in this browser. No account, no email, no guilt."}
        </p>
        {done > 0 && (
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            <RotateCcw className="h-3 w-3" aria-hidden="true" />
            Reset
          </button>
        )}
      </div>
    </div>
  );
}

export function StepDone({ id }: { id: string }) {
  const completed = useResourceProgress();
  const done = completed.includes(id);

  const toggle = () => {
    const current = readResourceProgress();
    const wasDone = current.completed.includes(id);
    const next = wasDone
      ? current.completed.filter((item) => item !== id)
      : [...current.completed, id];

    writeResourceProgress({ ...current, completed: next });
    if (!wasDone) void celebratePass();
    notifyResourceProgress();
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={done}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        done
          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/15 dark:text-emerald-300"
          : "border-border text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      <Check className="h-3.5 w-3.5" aria-hidden="true" />
      {done ? "Done" : "Mark done"}
    </button>
  );
}
