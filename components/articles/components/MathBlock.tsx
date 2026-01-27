"use client";

import { useEffect, useRef } from "react";
import katex from "katex";
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
    if (containerRef.current) {
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
    }
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
        "my-6 py-4 overflow-x-auto text-center",
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
