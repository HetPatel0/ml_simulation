import type { Metadata } from "next";
import { siteConfig } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Model Comparison",
  description: "Compare machine learning model families, subtypes, parameters, use cases, alternatives, and practical tips.",
  alternates: { canonical: "/model-comparison" },
  openGraph: {
    title: "Model Comparison | ML Simulations",
    description: "A practical guide to choosing machine learning models.",
    type: "website",
    url: `${siteConfig.url}/model-comparison`,
    images: [{ url: "/model-comparison/twitter-image.png", width: 1731, height: 909 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/model-comparison/twitter-image.png"],
  },
};

export default function ModelComparisonLayout({ children }: { children: React.ReactNode }) { return children; }
