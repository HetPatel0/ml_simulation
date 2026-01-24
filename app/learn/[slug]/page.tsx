"use client";

import { use } from "react";
import { notFound } from "next/navigation";

import GradientDescentArticle from "@/components/articles/GradientDescentArticle";
import KernelTrickArticle from "@/components/articles/KernelTrickArticle";
import LeastSquaresArticle from "@/components/articles/LeastSquaresArticle";
import LinearRegressionArticle from "@/components/articles/LinearRegressionArticle";
import LogisticRegressionArticle from "@/components/articles/LogisticRegressionArticle";
import PolynomialRegressionArticle from "@/components/articles/PolynomialRegressionArticle";
import SVRArticle from "@/components/articles/SVRArticle";

const articleComponents: Record<string, React.ComponentType> = {
  "gradient-descent": GradientDescentArticle,
  "least-squares": LeastSquaresArticle,
  "linear-regression": LinearRegressionArticle,
  "polynomial-regression": PolynomialRegressionArticle,
  "logistic-regression": LogisticRegressionArticle,
  "kernel-trick": KernelTrickArticle,
  svr: SVRArticle,
};

export default function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const ArticleComponent = articleComponents[slug];

  if (!ArticleComponent) {
    notFound();
  }

  return (
    <article className="min-h-screen">
      <ArticleComponent />
    </article>
  );
}
