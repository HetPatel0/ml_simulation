import katex from "katex";
import "katex/dist/katex.min.css";
import { cn } from "@/lib/utils";

interface MathBlockProps {
  formula: string;
  display?: "block" | "inline";
  className?: string;
}

/**
 * Server-rendered KaTeX. The formula HTML ships with the article, so there
 * is no parser chunk, no layout shift, and math works without JS.
 */
export function MathBlock({
  formula,
  display = "block",
  className,
}: MathBlockProps) {
  let html = "";
  try {
    html = katex.renderToString(formula, {
      displayMode: display === "block",
      throwOnError: false,
      errorColor: "#ef4444",
      trust: true,
    });
  } catch (error) {
    console.error("KaTeX rendering error:", error);
  }

  if (display === "inline") {
    return (
      <span className={cn("mx-1 inline-block align-middle", className)}>
        {html ? (
          <span dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          formula
        )}
      </span>
    );
  }

  return (
    <div
      className={cn(
        "my-6 overflow-x-auto rounded-xl border border-border/60 bg-muted/30 py-5 text-center",
        className,
      )}
    >
      {html ? (
        <span
          className="text-lg"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <span className="text-lg">{formula}</span>
      )}
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
