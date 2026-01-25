import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { articleMetadata, siteConfig } from "@/lib/metadata";
import ArticleClient from "./article-client";

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
      images: [
        {
          url: meta.image,
          width: 1200,
          height: 630,
          alt: meta.title,
        },
      ],
      authors: [meta.author],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [meta.image],
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
      <ArticleClient slug={slug} />
    </article>
  );
}
