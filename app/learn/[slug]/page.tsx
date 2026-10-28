import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { articleMetadata, siteConfig } from "@/lib/content";
import { articleComponents, type ArticleSlug } from "@/lib/article-registry";
import { ArticleShell } from "@/components/articles/layout/article-shell";
import { ServerRetryBoundary } from "@/components/feedback/server-retry-boundary";
import { BreadcrumbJsonLd } from "@/components/articles/layout/article-breadcrumb";
import { BackToTop } from "@/components/layout/overlays/back-to-top";
import { QuizBlock } from "@/components/articles/components/QuizBlock";
import { quizzes } from "@/lib/quizzes";
import { articleSources } from "@/lib/article-sources";
import { ArticleSources } from "@/components/articles/layout/article-sources";
import { ArticleNavigation } from "@/components/articles/layout/article-navigation";


const validSlugs = Object.keys(articleMetadata);

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const meta = articleMetadata[slug];

  if (!meta) {
    return {
      title: "Article Not Found",
    };
  }

  return {
    title: meta.title,
    description: meta.description,
    authors: [{ name: meta.author }],
    alternates: { canonical: `/learn/${slug}` },
    openGraph: {
      title: `${meta.title} | ML Simulations`,
      description: meta.description,
      type: "article",
      url: `${siteConfig.url}/learn/${slug}`,
      authors: [meta.author],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
  };
}

export function generateStaticParams() {
  return validSlugs.map((slug) => ({ slug }));
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  if (!validSlugs.includes(slug)) {
    notFound();
  }

  const meta = articleMetadata[slug];
  const Article = articleComponents[slug as ArticleSlug];
  if (!Article) notFound();
  const questions = quizzes[slug] ?? [];
  const articleIndex = validSlugs.indexOf(slug);
  const previousSlug = articleIndex > 0 ? validSlugs[articleIndex - 1] : undefined;
  const nextSlug = articleIndex < validSlugs.length - 1 ? validSlugs[articleIndex + 1] : undefined;

  const quizJsonLd = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: `${meta.title} — self-check quiz`,
    about: meta.description,
    url: `${siteConfig.url}/learn/${slug}#quiz-${slug}`,
  };

  return (
    <article className="min-h-screen">
      <BreadcrumbJsonLd
        siteUrl={siteConfig.url}
        items={[
          { label: "Home", href: "/" },
          { label: "Learn", href: "/learn" },
          { label: meta.title, href: `/learn/${slug}` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(quizJsonLd) }}
      />
      <ArticleShell>
        <ServerRetryBoundary title="This article failed to load.">
          <Article />
          {questions.length > 0 && (
            <QuizBlock slug={slug} questions={questions} />
          )}
          <ArticleSources sources={articleSources[slug] ?? []} />
          <ArticleNavigation
            previous={previousSlug ? { slug: previousSlug, title: articleMetadata[previousSlug].title } : undefined}
            next={nextSlug ? { slug: nextSlug, title: articleMetadata[nextSlug].title } : undefined}
          />
        </ServerRetryBoundary>
      </ArticleShell>
      <BackToTop />
    </article>
  );
}
