"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

interface CodeBlockProps {
  code: string;
  language?: "python" | "bash" | "javascript" | "typescript" | "text";
  title?: string;
  showLineNumbers?: boolean;
  className?: string;
}

const languageLabels: Record<string, string> = {
  python: "Python",
  bash: "Bash",
  javascript: "JavaScript",
  typescript: "TypeScript",
  text: "Text",
};

const languageColors: Record<string, string> = {
  python: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
  bash: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  javascript: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
  typescript: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  text: "bg-stone-500/10 text-stone-600 dark:text-stone-400 border-stone-500/20",
};

export function CodeBlock({
  code,
  language = "python",
  title,
  showLineNumbers = true,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const { resolvedTheme } = useTheme();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isDark = resolvedTheme === "dark";

  return (
    <div
      className={cn(
        "relative my-6 rounded-xl overflow-hidden border shadow-sm",
        isDark
          ? "border-border/50 bg-card"
          : "border-border bg-card",
        className
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex items-center justify-between px-4 py-2.5 border-b",
          isDark
            ? "border-border/50 bg-muted/30"
            : "border-border bg-muted/50"
        )}
      >
        <div className="flex items-center gap-3">
          <Terminal className={cn(
            "h-4 w-4",
            isDark ? "text-muted-foreground" : "text-muted-foreground"
          )} />
          {title && (
            <span className="text-sm font-medium text-foreground">
              {title}
            </span>
          )}
          <span
            className={cn(
              "text-xs px-2 py-0.5 rounded-md font-mono border",
              languageColors[language] || languageColors.text
            )}
          >
            {languageLabels[language] || language}
          </span>
        </div>

        <button
          onClick={handleCopy}
          disabled={copied}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
            copied
              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 cursor-default"
              : "bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"
          )}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={language}
          style={isDark ? oneDark : oneLight}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            padding: "1rem",
            background: "transparent",
            fontSize: "0.875rem",
            lineHeight: "1.6",
          }}
          lineNumberStyle={{
            minWidth: "2.5em",
            paddingRight: "1em",
            color: isDark ? "hsl(var(--muted-foreground) / 0.5)" : "hsl(var(--muted-foreground) / 0.6)",
            userSelect: "none",
          }}
        >
          {code.trim()}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
