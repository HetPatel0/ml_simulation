"use client";

import { useMemo, useState } from "react";
import { Mail, MailOpen, ShieldAlert, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { CalloutBox } from "@/components/articles/components/CalloutBox";
import { MathBlock } from "@/components/articles/components/MathBlock";
import { cn } from "@/lib/utils";
import SimHeader from "./sim-header";

type Clue = { word: string; spam: number; ham: number; note?: string };
const N = 100; // pseudo-counts per class

const CLUES: Clue[] = [
  { word: "free", spam: 70, ham: 5 },
  { word: "win", spam: 60, ham: 1 },
  { word: "cash", spam: 50, ham: 2 },
  { word: "prize", spam: 40, ham: 1 },
  { word: "lottery", spam: 0, ham: 0, note: "never seen — the zero trap" },
  { word: "meeting", spam: 2, ham: 40 },
  { word: "budget", spam: 3, ham: 35 },
  { word: "lunch", spam: 1, ham: 30 },
  { word: "free!!!", spam: 70, ham: 5, note: "same counts as “free” — correlated" },
];

const smooth = (c: number, alpha: number) => (c + alpha) / (N + 2 * alpha);

/** Spam detective: stack word clues and watch posterior odds move. */
export default function NaiveBayes() {
  const [active, setActive] = useState<string[]>(["free", "win"]);
  const [priorSpam, setPriorSpam] = useState(40);
  const [alpha, setAlpha] = useState(1);

  const toggle = (w: string) =>
    setActive((a) => (a.includes(w) ? a.filter((x) => x !== w) : [...a, w]));

  const calc = useMemo(() => {
    const prior = priorSpam / 100;
    const rows = active.map((w) => {
      const c = CLUES.find((x) => x.word === w)!;
      return { word: w, ps: smooth(c.spam, alpha), ph: smooth(c.ham, alpha) };
    });
    let spamScore = prior;
    let hamScore = 1 - prior;
    let zeroed: string | null = null;
    for (const r of rows) {
      spamScore *= r.ps;
      hamScore *= r.ph;
      if ((r.ps === 0 || r.ph === 0) && !zeroed) zeroed = r.word;
    }
    const total = spamScore + hamScore;
    const pSpam = total === 0 ? 0.5 : spamScore / total;
    return { rows, pSpam, pHam: 1 - pSpam, zeroed };
  }, [active, priorSpam, alpha]);

  const verdictSpam = calc.pSpam >= 0.5;
  const correlated = active.includes("free") && active.includes("free!!!");

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 mb-10">
      <SimHeader
        title="Naive Bayes Detective"
        subtitle="Stack word clues and watch the odds move."
      />

      <div className="flex flex-col gap-6 lg:flex-row">
        <Card className="flex-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Message clues</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {CLUES.map((c) => {
                const on = active.includes(c.word);
                return (
                  <button
                    key={c.word}
                    type="button"
                    onClick={() => toggle(c.word)}
                    aria-pressed={on}
                    title={
                      c.note ??
                      `P(${c.word}|spam)=${c.spam}%, P(${c.word}|ham)=${c.ham}%`
                    }
                    className={cn(
                      "cursor-pointer rounded-full border px-4 py-2 text-sm font-semibold transition-all",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      on
                        ? "border-primary bg-primary text-primary-foreground shadow-sm active:scale-95"
                        : "border-border bg-muted/40 text-muted-foreground hover:border-primary/50 hover:text-foreground active:scale-95",
                    )}
                  >
                    {c.word}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              Toggle words in and out of the suspect message. Hover a chip for
              its training counts.
            </p>

            {/* Email-styled preview of the suspect message */}
            <div className="overflow-hidden rounded-xl border border-border/60">
              <div className="flex items-center gap-2 border-b border-border/60 bg-muted/40 px-4 py-2">
                {active.length === 0 ? (
                  <Mail className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <MailOpen className="h-4 w-4 text-primary" />
                )}
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Suspect message
                </span>
              </div>
              <p className="min-h-10 px-4 py-3 text-sm leading-relaxed" aria-live="polite">
                {active.length === 0 ? (
                  <span className="text-muted-foreground">
                    Empty inbox — toggle a word chip above.
                  </span>
                ) : (
                  <>
                    <span className="text-muted-foreground">Subject: </span>
                    <span className="font-medium">
                      {active.join(" · ")}
                    </span>
                  </>
                )}
              </p>
            </div>

            {/* Posterior bars */}
            <div className="space-y-3" aria-live="polite">
              {(
                [
                  { label: "SPAM", p: calc.pSpam, cls: "bg-red-500" },
                  { label: "HAM", p: calc.pHam, cls: "bg-blue-600" },
                ] as const
              ).map((b) => (
                <div key={b.label} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold">{b.label}</span>
                    <span className="font-bold tabular-nums">
                      {(b.p * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-muted">
                    <div
                      className={cn(b.cls, "h-full rounded-full transition-all duration-300")}
                      style={{ width: `${b.p * 100}%` }}
                    />
                  </div>
                </div>
              ))}
              <div
                className={cn(
                  "flex items-center justify-center gap-2 rounded-xl border px-4 py-3 font-bold",
                  verdictSpam
                    ? "border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400"
                    : "border-blue-600/50 bg-blue-600/10 text-blue-600 dark:text-blue-400",
                )}
              >
                {verdictSpam ? (
                  <ShieldAlert className="h-5 w-5" />
                ) : (
                  <ShieldCheck className="h-5 w-5" />
                )}
                Verdict: {verdictSpam ? "SPAM" : "HAM"}
              </div>
            </div>

            {calc.zeroed && (
              <div className="rounded-xl border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm">
                <strong>Zero trap:</strong> “{calc.zeroed}” has a zero
                likelihood at α={alpha} — one zero wiped out the whole product.
                Raise alpha to smooth it.
              </div>
            )}
            {correlated && (
              <div className="rounded-xl border border-amber-500/50 bg-amber-500/10 px-4 py-3 text-sm">
                <strong>Double counting:</strong> “free” and “free!!!” share
                counts — the model counts the same evidence twice. That is the
                independence assumption breaking.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="w-full lg:w-80">
          <CardHeader className="pb-3">
            <CardTitle>Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Prior P(spam)</span>
                <span className="font-bold text-primary tabular-nums">{priorSpam}%</span>
              </div>
              <Slider
                value={[priorSpam]}
                min={5}
                max={95}
                step={1}
                onValueChange={([v]) => setPriorSpam(v)}
                aria-label="Prior probability of spam"
              />
              <p className="text-xs text-muted-foreground">
                Belief before any clue — the anchor
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Smoothing α</span>
                <span className="font-bold text-primary tabular-nums">{alpha.toFixed(1)}</span>
              </div>
              <Slider
                value={[alpha]}
                min={0}
                max={5}
                step={0.5}
                onValueChange={([v]) => setAlpha(v)}
                aria-label="Additive smoothing strength"
              />
              <p className="text-xs text-muted-foreground">
                α=0: unseen words nuke the product · higher α protects but oversmooths
              </p>
            </div>

            <div className="space-y-1.5 rounded-md bg-muted/50 p-3 font-mono text-xs">
              <p className="text-muted-foreground">score = prior × Π likelihoods</p>
              <p className="break-all leading-relaxed">
                spam: {(priorSpam / 100).toFixed(2)}
                {calc.rows.map((r) => ` × ${r.ps.toFixed(3)}`)}
              </p>
              <p className="break-all leading-relaxed">
                ham: {(1 - priorSpam / 100).toFixed(2)}
                {calc.rows.map((r) => ` × ${r.ph.toFixed(3)}`)}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setActive(["free", "win"])}
              >
                Spam mail
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setActive(["meeting", "budget"])}
              >
                Work mail
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-lg bg-muted/50 px-3 py-2 text-center">
        <MathBlock
          display="inline"
          formula="P(y \mid x_1, \ldots, x_n) \propto P(y) \prod_{j=1}^{n} P(x_j \mid y)"
        />
      </div>

      <CalloutBox type="tip" title="What to try">
        <p>
          Toggle “lottery” with α=0 and watch a single zero decide everything —
          then raise α and watch it recover. Turn on both “free” and “free!!!”
          to feel double counting. Drag the prior to 5%: even strong clues
          struggle against a skeptical anchor.
        </p>
      </CalloutBox>

    </div>
  );
}
