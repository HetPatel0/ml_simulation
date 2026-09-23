import type { Metadata } from "next";
import { siteConfig } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "ML Articles & Tutorials",
  description:
    "In-depth articles explaining machine learning concepts. Visual guides to gradient descent, regression, logistic regression, decision trees, KNN, Naive Bayes, SVR, and kernel methods.",
  openGraph: {
    title: "ML Articles & Tutorials | ML Simulations",
    description:
      "In-depth articles explaining machine learning concepts with visual guides.",
    type: "website",
    url: `${siteConfig.url}/learn`,
    images: [
      {
        url: `${siteConfig.url}/og/home.jpg`,
        width: 1200,
        height: 630,
        alt: "ML Simulations articles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [`${siteConfig.url}/og/home.jpg`],
  },
};

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
