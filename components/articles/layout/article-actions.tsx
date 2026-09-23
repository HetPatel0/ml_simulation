"use client";

import { Separator } from "@/components/ui/separator";
import { ArticleListen } from "./article-listen";
import { ArticleShare } from "./article-share";

/** Action row under the article subtitle: Share first, then Listen. */
export function ArticleActions({ title }: { title: string }) {
  return (
    <div className="space-y-4 pt-1">
      <div className="flex flex-wrap items-center gap-2.5">
        <ArticleShare title={title} />
        <ArticleListen title={title} />
      </div>
      <Separator />
    </div>
  );
}
