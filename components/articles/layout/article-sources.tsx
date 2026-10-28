import { ExternalSourceLink } from "./external-source-link";
import type { ArticleSource } from "@/lib/article-sources";

export function ArticleSources({ sources }: { sources: ArticleSource[] }) {
  if (sources.length === 0) return null;

  return (
    <section className="mt-12 pb-10" aria-labelledby="article-sources">
      <h2 id="article-sources" className="mb-2 text-xl font-semibold tracking-tight sm:text-2xl">
        Sources
      </h2>
      <ul className="list-disc space-y-2 pl-6 text-sm">
        {sources.map((source) => (
          <li key={source.url}>
            <ExternalSourceLink href={source.url}>{source.label}</ExternalSourceLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
