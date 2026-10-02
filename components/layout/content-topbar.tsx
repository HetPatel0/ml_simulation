"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArticleShare } from "@/components/articles/layout/article-share";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type ContentTopBarProps = {
  /** Text handed to the Share popup. Required when showShare. */
  shareTitle?: string;
  /** Centered heading below the bar (sim pages). Omit for bar-only. */
  title?: ReactNode;
  subtitle?: ReactNode;
  /** Where Back goes when there is no history. */
  fallbackHref: string;
  showShare?: boolean;
  className?: string;
};

/**
 * Shared Back (+ optional Share) bar behind sim, article and cheatsheet
 * pages. SimHeader adds the centered title; ArtHeader drops Share.
 */
export function ContentTopBar({
  shareTitle,
  title,
  subtitle,
  fallbackHref,
  showShare = true,
  className,
}: ContentTopBarProps) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  };

  return (
    <header className={cn("w-full", className)}>
      <div className="flex items-center justify-center overflow-x-clip border-b py-5">
        <div className="relative flex w-full max-w-6xl items-center px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="group absolute left-7 gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <ArrowLeft className="transition-transform group-hover:-translate-x-1" />
            Back
          </Button>

          <div className="mx-auto h-6" />

          {showShare && (
            <div className="absolute right-7">
              <ArticleShare title={shareTitle ?? ""} align="right" />
            </div>
          )}
        </div>
      </div>
      {title && (
        <div className="mt-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-base text-muted-foreground sm:text-lg">
              {subtitle}
            </p>
          )}
        </div>
      )}
    </header>
  );
}
