import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { articleMetadata, siteConfig } from "@/lib/metadata";
import ArticleClient from "./article-client";
import { ArticleShell } from "@/components/articles/layout/article-shell";
import { BackToTop } from "@/components/layout/back-to-top";


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

  return (
    <article className="min-h-screen">
      <ArticleShell>
        <ArticleClient slug={slug} />
      </ArticleShell>
      <BackToTop />
    </article>
  );
}
