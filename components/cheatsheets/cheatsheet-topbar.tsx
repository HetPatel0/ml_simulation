"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArticleShare } from "@/components/articles/layout/article-share";

/**
 * Sim-style top bar (Back left, Share right) without the centered title —
 * the title lives in the shell below, formatted like Learn article pages.
 * Parent controls width (max-w-5xl, like sims) so the border-b matches.
 */
export function CheatsheetTopBar({ title }: { title: string }) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/cheatsheets");
    }
  };

  return (
    // overflow-x-clip: the absolutely-positioned share popup must never
    // widen the page on mid/small screens, even while open.
    <div className="flex items-center justify-center overflow-x-clip border-b py-5">
      <div className="relative flex w-full max-w-6xl items-center px-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="group absolute left-7 gap-2 cursor-pointer"
        >
          <ArrowLeft className="transition-transform group-hover:-translate-x-1" />
          Back
        </Button>

        <div className="mx-auto h-6" />

        <div className="absolute right-7">
          <ArticleShare title={title} align="right" />
        </div>
      </div>
    </div>
  );
}
