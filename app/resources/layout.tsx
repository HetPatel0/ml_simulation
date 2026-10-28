import type { Metadata } from "next";
import { siteConfig } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "A structured machine learning learning path: intuition, mathematics, APIs, coding, deep learning, and production resources.",
  alternates: { canonical: "/resources" },
  openGraph: {
    title: "Machine Learning Resources | ML Simulations",
    description: "Curated playlists, mathematics, APIs, coding references, deep learning, and model comparison guides.",
    type: "website",
    url: `${siteConfig.url}/resources`,
    images: [{ url: "/resources/twitter-image.png", width: 1731, height: 909 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/resources/twitter-image.png"],
  },
};

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
