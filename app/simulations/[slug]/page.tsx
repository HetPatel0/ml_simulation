import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { simulationMetadata, siteConfig } from "@/lib/metadata";
import { ServerRetryBoundary } from "@/components/feedback/server-retry-boundary";
import SimulationClient from "./simulation-client";

const validSlugs = Object.keys(simulationMetadata);

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const meta = simulationMetadata[slug];

  if (!meta) {
    return {
      title: "Simulation Not Found",
    };
  }

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `/simulations/${slug}` },
    openGraph: {
      title: `${meta.title} | ML Simulations`,
      description: meta.description,
      type: "website",
      url: `${siteConfig.url}/simulations/${slug}`,
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

export default async function SimulationPage({ params }: Props) {
  const { slug } = await params;

  if (!validSlugs.includes(slug)) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <ServerRetryBoundary title="This simulation failed to load.">
        <SimulationClient slug={slug} />
      </ServerRetryBoundary>
    </div>
  );
}
