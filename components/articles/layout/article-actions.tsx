"use client";

import { ArticleShare } from "./article-share";

/** Action row under the article subtitle. */
export function ArticleActions({ title }: { title: string }) {
  return (
    <div className="flex flex-wrap items-center gap-2.5">
      <ArticleShare title={title} />
    </div>
  );
}
