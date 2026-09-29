"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  Link2,
  Linkedin,
  Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";

/** Brand glyphs lucide doesn't ship: X logo + WhatsApp mark. */
function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

type ArticleShareProps = {
  title: string;
  className?: string;
};

/**
 * Share button with a Facebook-reaction-style popup: a compact bar above
 * the button, one column per target — icon on top, label underneath.
 * Order: Copy, X, LinkedIn, WhatsApp.
 */
export function ArticleShare({ title, className }: ArticleShareProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // SSR-safe page URL — canonical path only, never the TOC #topic hash.
  const pageUrl = () =>
    window.location.origin + window.location.pathname;

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open ]);

  const handleCopy = async () => {
    const url = pageUrl();
    try {
      await navigator.clipboard.writeText(url);
    } catch {
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

  const items: {
    key: string;
    label: string;
    icon: React.ReactNode;
    onSelect: () => void;
  }[] = [
    {
      key: "copy",
      label: copied ? "Copied!" : "Copy",
      icon:
        copied === true ? (
          <Check className="h-5 w-5 text-emerald-500" />
        ) : (
          <Link2 className="h-5 w-5 text-primary" />
        ),
      onSelect: () => void handleCopy(),
    },
    {
      key: "x",
      label: "Post",
      icon: <XIcon className="h-5 w-5 text-primary" />,
      onSelect: () =>
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl())}&text=${encodeURIComponent(title)}`,
          "_blank",
          "noopener",
        ),
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      icon: <Linkedin className="h-5 w-5 text-primary" />,
      onSelect: () =>
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl())}`,
          "_blank",
          "noopener",
        ),
    },
    {
      key: "whatsapp",
      label: "WhatsApp",
      icon: <WhatsAppIcon className="h-5 w-5 text-primary" />,
      onSelect: () =>
        window.open(
          `https://wa.me/?text=${encodeURIComponent(`${title} ${pageUrl()}`)}`,
          "_blank",
          "noopener",
        ),
    },
  ];

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Share: ${title}`}
        title="Share"
        className={cn(
          "inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm font-medium shadow-xs transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          open
            ? "border-primary/50 bg-primary/10 text-primary"
            : "border-border bg-card text-foreground hover:border-primary/50 hover:text-primary",
        )}
      >
        <Share2 className="h-4 w-4 text-primary" />
        Share
      </button>

      {/* Reaction bar — below the button, opening toward the right */}
      <div
        role="menu"
        aria-label="Share options"
        className={cn(
          "absolute top-full left-0 z-50 mt-2 flex max-w-[calc(100vw-2rem)] items-stretch gap-1 rounded-2xl border border-border bg-card/95 p-2 shadow-xl backdrop-blur transition-all duration-200",
          open
            ? "visible scale-100 opacity-100"
            : "invisible scale-90 opacity-0 pointer-events-none",
        )}
      >
        {items.map((item, i) => (
          <button
            key={item.key}
            type="button"
            role="menuitem"
            tabIndex={open ? 0 : -1}
            aria-label={item.key === "copy" ? "Copy link" : `Share on ${item.label === "Post" ? "X" : item.label}`}
            onClick={() => {
              item.onSelect();
              if (item.key !== "copy") setOpen(false);
            }}
            style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
            className={cn(
              "flex w-[4.25rem] cursor-pointer flex-col items-center gap-1.5 rounded-xl px-1 py-2.5 transition-all duration-150",
              "hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              open ? "scale-100 opacity-100" : "scale-75 opacity-0",
            )}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 transition-transform duration-150 hover:scale-110">
              {item.icon}
            </span>
            <span className="text-[10px] font-semibold leading-none text-muted-foreground">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
