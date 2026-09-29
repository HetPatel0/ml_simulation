"use client";

import { useEffect, useRef } from "react";
// KaTeX CSS stays static (small, render-blocking by design to avoid FOUC);
// the ~200KB JS parser loads lazily so non-math pages never pay for it.
import "katex/dist/katex.min.css";
import { cn } from "@/lib/utils";

interface MathBlockProps {
  formula: string;
  display?: "block" | "inline";
  className?: string;
}

export function MathBlock({
  formula,
  display = "block",
  className,
}: MathBlockProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let cancelled = false;
    // Dynamic import code-splits KaTeX out of the article bundle.
    import("katex").then(({ default: katex }) => {
      if (cancelled || !containerRef.current) return;
      try {
        katex.render(formula, containerRef.current, {
          displayMode: display === "block",
          throwOnError: false,
          errorColor: "#ef4444",
          trust: true,
        });
      } catch (error) {
        console.error("KaTeX rendering error:", error);
        if (containerRef.current) {
          containerRef.current.textContent = formula;
        }
      }
    });
    return () => {
      cancelled = true;
    };
  }, [formula, display]);

  if (display === "inline") {
    return (
      <span
        ref={containerRef}
        className={cn("inline-block align-middle mx-1", className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "my-6 overflow-x-auto rounded-xl border border-border/60 bg-muted/30 py-5 text-center",
        className
      )}
    >
      <span ref={containerRef} className="text-lg" />
    </div>
  );
}

// Convenience component for inline math
export function InlineMath({
  formula,
  className,
}: {
  formula: string;
  className?: string;
}) {
  return <MathBlock formula={formula} display="inline" className={className} />;
}
