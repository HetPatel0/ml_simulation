import type { Metadata } from "next";
import { siteConfig } from "@/lib/metadata";


export const metadata: Metadata = {
  title: "Interactive ML Simulations",
  description:
    "Browse all interactive machine learning simulations. Learn gradient descent, regression, classification, and more through visual experimentation.",
  openGraph: {
    title: "Interactive ML Simulations | ML Simulations",
    description:
      "Browse all interactive machine learning simulations. Learn through visual experimentation.",
    type: "website",
    url: `${siteConfig.url}/simulations`,
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function SimulationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
