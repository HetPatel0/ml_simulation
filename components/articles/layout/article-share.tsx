"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ArticleShareProps = {
  title: string;
  className?: string;
};

/** Single Share button — copies the article link. SSR-safe (window only in handler). */
export function ArticleShare({ title, className }: ArticleShareProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    // Canonical page URL only — never include the #topic hash that the
    // table-of-contents scroll-spy writes while reading.
    const url = window.location.origin + window.location.pathname;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Fallback for non-secure contexts.
      const ta = document.createElement("textarea");
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Link copied!" : `Share: copy link to ${title}`}
      title={copied ? "Copied!" : "Copy link"}
      className={cn(
        "inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm font-medium shadow-xs transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        copied
          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          : "border-border bg-card text-foreground hover:border-primary/50 hover:text-primary",
        className,
      )}
    >
      {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4 text-primary" />}
      {copied ? "Copied!" : "Share"}
    </button>
  );
}
