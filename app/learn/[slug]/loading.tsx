import { ArticleShell } from "@/components/articles/layout/article-shell";
import { ArticleSkeleton } from "@/components/ui/loading-skeleton";

export default function ArticleLoading() {
  return (
    <article className="min-h-screen">
      <ArticleShell>
        <ArticleSkeleton />
      </ArticleShell>
    </article>
  );
}
