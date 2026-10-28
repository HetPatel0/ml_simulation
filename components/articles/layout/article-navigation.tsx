import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

type ArticleLink = { slug: string; title: string };

export function ArticleNavigation({
  previous,
  next,
}: {
  previous?: ArticleLink;
  next?: ArticleLink;
}) {
  return (
    <nav
      aria-label="Article navigation"
      className="mt-10 grid gap-3 border-t border-border pt-6 pb-12 sm:grid-cols-2 sm:pb-16"
    >
      {previous ? (
        <Link
          href={`/learn/${previous.slug}`}
          className="group rounded-lg border border-border p-4 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="flex items-center gap-2 text-xs text-muted-foreground">
            <ArrowLeft size={14} aria-hidden="true" />
            Previous article
          </span>
          <span className="mt-1 block font-medium group-hover:underline">{previous.title}</span>
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}

      {next && (
        <Link
          href={`/learn/${next.slug}`}
          className="group rounded-lg border border-border p-4 text-left transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:text-right"
        >
          <span className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
            Next article
            <ArrowRight size={14} aria-hidden="true" />
          </span>
          <span className="mt-1 block font-medium group-hover:underline">{next.title}</span>
        </Link>
      )}
    </nav>
  );
}
