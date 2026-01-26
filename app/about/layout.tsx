import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about ML Simulations - a free platform for learning machine learning through interactive visualizations. No signup required.",
  openGraph: {
    title: "About | ML Simulations",
    description:
      "A free platform for learning machine learning through interactive visualizations.",
    type: "website",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
