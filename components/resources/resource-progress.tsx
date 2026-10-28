"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "ml-simulations:resource-progress";

export function ResourceProgress({ steps }: { steps: string[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const saved = Number(window.localStorage.getItem(STORAGE_KEY));
    if (Number.isInteger(saved) && saved >= 0 && saved < steps.length) setCurrent(saved);
  }, [steps.length]);

  const move = (next: number) => {
    const bounded = Math.max(0, Math.min(next, steps.length - 1));
    setCurrent(bounded);
    window.localStorage.setItem(STORAGE_KEY, String(bounded));
  };

  return <div className="rounded-xl border border-border bg-card p-5 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-medium uppercase tracking-wider text-primary">Saved progress</p><p className="mt-1 font-medium">Step {current + 1} of {steps.length}: {steps[current]}</p></div><span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"><Check size={14} /> Saved in this browser</span></div><div className="mt-4 h-2 overflow-hidden rounded-full bg-muted" aria-label={`${current + 1} of ${steps.length} steps complete`} role="progressbar" aria-valuemin={1} aria-valuemax={steps.length} aria-valuenow={current + 1}><div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${((current + 1) / steps.length) * 100}%` }} /></div><div className="mt-4 flex justify-between gap-3"><Button variant="outline" size="sm" onClick={() => move(current - 1)} disabled={current === 0}><ArrowLeft size={15} /> Previous</Button><Button size="sm" onClick={() => move(current + 1)} disabled={current === steps.length - 1}>Next <ArrowRight size={15} /></Button></div></div>;
}
