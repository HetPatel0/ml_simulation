import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { simulationMetadata, siteConfig } from "@/lib/metadata";
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
    openGraph: {
      title: `${meta.title} | ML Simulations`,
      description: meta.description,
      type: "website",
      url: `${siteConfig.url}/simulations/${slug}`,
      images: [
        {
          url: meta.image,
          width: 1200,
          height: 630,
          alt: meta.title,
        },
      ],
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

export default async function SimulationPage({ params }: Props) {
  const { slug } = await params;

  if (!validSlugs.includes(slug)) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <SimulationClient slug={slug} />
    </div>
  );
}
