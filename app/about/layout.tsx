import type { Metadata } from "next";
import { siteConfig } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about ML Simulations - a free platform for learning machine learning through interactive visualizations. No signup required.",
  openGraph: {
    title: "About | ML Simulations",
    description:
      "A free platform for learning machine learning through interactive visualizations.",
    type: "website",
    url: `${siteConfig.url}/about`,
    images: [
      {
        url: `${siteConfig.url}/og/home.jpg`,
        width: 1200,
        height: 630,
        alt: "About ML Simulations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [`${siteConfig.url}/og/home.jpg`],
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
