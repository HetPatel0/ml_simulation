"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  GraduationCap,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import type { QuizQuestion } from "@/lib/quizzes";

const STORAGE_PREFIX = "ml-quiz:";

/**
 * Stepper quiz: one question at a time (1/4 → 4/4) with Back / Next,
 * instant right/wrong feedback + explanation, score screen at end.
 * Progress persists in localStorage only (no backend).
 */
export function QuizBlock({
  slug,
  questions,
  title = "Check your understanding",
}: {
  slug: string;
  questions: QuizQuestion[];
  title?: string;
}) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const raw = localStorage.getItem(`${STORAGE_PREFIX}${slug}`);
      return raw ? (JSON.parse(raw) as Record<string, number>) : {};
    } catch {
      return {};
    }
  });
  const [finished, setFinished] = useState(false);

  const total = questions.length;
  const q = questions[Math.min(index, total - 1)];

  const score = useMemo(
    () => questions.filter((item) => answers[item.id] === item.answerIndex).length,
    [questions, answers],
  );

  if (!total || !q) return null;

  const pick = answers[q.id];
  const revealed = pick !== undefined;
  const isCorrect = revealed && pick === q.answerIndex;

  const persist = (next: Record<string, number>) => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${slug}`, JSON.stringify(next));
    } catch {
      /* private mode — in-memory only */
    }
  };

  const choose = (oi: number) => {
    if (revealed) return; // lock after first pick so explanation stays honest
    const next = { ...answers, [q.id]: oi };
    setAnswers(next);
    persist(next);
  };

  const reset = () => {
    setAnswers({});
    setIndex(0);
    setFinished(false);
    try {
      localStorage.removeItem(`${STORAGE_PREFIX}${slug}`);
    } catch {
      /* ignore */
    }
  };

  if (finished) {
    return (
      <section
        aria-labelledby={`quiz-${slug}`}
        className="my-10 rounded-xl border border-border bg-muted/20 p-5 text-center sm:p-8"
      >
        <GraduationCap className="mx-auto h-8 w-8 text-primary" aria-hidden="true" />
        <h2 id={`quiz-${slug}`} className="mt-2 text-2xl font-semibold tracking-tight">
          Score {score}/{total}
        </h2>
        <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground" aria-live="polite">
          {score === total
            ? "Perfect — you nailed every concept."
            : score >= Math.ceil(total * 0.7)
              ? "Solid. Review the ones you missed with Back, or retake fresh."
              : "Worth a re-read — scroll up, then retake."}
        </p>
        <div className="mx-auto mt-4 grid max-w-md gap-2 text-left">
          {questions.map((item, i) => {
            const ok = answers[item.id] === item.answerIndex;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setIndex(i);
                  setFinished(false);
                }}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:border-primary/50"
              >
                {ok ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                ) : (
                  <XCircle className="h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
                )}
                <span className="truncate">
                  Q{i + 1}: {item.question}
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Button variant="outline" onClick={reset}>
            <RotateCcw className="mr-2 h-4 w-4" /> Retake
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-labelledby={`quiz-${slug}`}
      className="my-10 rounded-xl border border-border bg-muted/20 p-5 sm:p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2 id={`quiz-${slug}`} className="text-xl font-semibold tracking-tight">
            {title}
          </h2>
        </div>
        <p className="shrink-0 rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground" aria-live="polite">
          {index + 1}/{total}
        </p>
      </div>

      {/* Progress dots */}
      <div className="mt-3 flex gap-1.5" aria-hidden="true">
        {questions.map((item, i) => {
          const a = answers[item.id];
          return (
            <div
              key={item.id}
              className={cn(
                "h-1.5 flex-1 rounded-full",
                i < index || (i === index && revealed)
                  ? a === item.answerIndex
                    ? "bg-emerald-500"
                    : "bg-red-500"
                  : i === index
                    ? "bg-primary"
                    : a !== undefined
                      ? "bg-primary/40"
                      : "bg-border",
              )}
            />
          );
        })}
      </div>

      <div key={q.id} className="mt-5">
        <p className="text-base font-medium">
          <span className="mr-2 text-muted-foreground">{index + 1}.</span>
          {q.question}
        </p>
        <div className="mt-3 grid gap-2" role="radiogroup" aria-label={q.question}>
          {q.options.map((opt, oi) => {
            const active = pick === oi;
            const correctOpt = oi === q.answerIndex;
            return (
              <button
                key={oi}
                type="button"
                role="radio"
                aria-checked={active}
                disabled={revealed}
                onClick={() => choose(oi)}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                    !revealed
                      ? "cursor-pointer"
                      : "cursor-default",
                  !revealed && !active && "border-border hover:border-primary/50",
                  !revealed && active && "border-primary bg-primary/10",
                  revealed && correctOpt && "border-emerald-500 bg-emerald-500/10",
                  revealed && active && !correctOpt && "border-red-500 bg-red-500/10",
                  revealed && !active && !correctOpt && "opacity-70",
                )}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {revealed && (
          <div
            className={cn(
              "mt-3 flex items-start gap-2 rounded-lg p-3 text-sm",
              isCorrect ? "bg-emerald-500/10" : "bg-red-500/10",
            )}
            aria-live="polite"
          >
            {isCorrect ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
            ) : (
              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
            )}
            <div>
              <p className="font-medium">
                {isCorrect ? "Right." : "Not quite — the right answer is highlighted."}
              </p>
              <p className="mt-0.5 text-foreground/80">{q.explanation}</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        {index < total - 1 ? (
          <Button size="sm" onClick={() => setIndex((i) => i + 1)} disabled={!revealed}>
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button size="sm" onClick={() => setFinished(true)} disabled={!revealed}>
            See score ({Object.keys(answers).length}/{total} answered)
          </Button>
        )}
      </div>
    </section>
  );
}
