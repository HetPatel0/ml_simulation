import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ML Articles & Tutorials",
  description:
    "In-depth articles explaining machine learning concepts. Visual guides to gradient descent, linear regression, logistic regression, SVR, and kernel methods.",
  openGraph: {
    title: "ML Articles & Tutorials | ML Simulations",
    description:
      "In-depth articles explaining machine learning concepts with visual guides.",
    type: "website",
  },
};

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
