"use client";

import dynamic from "next/dynamic";
import { ArticleSkeleton } from "@/components/ui/loading-skeleton";

const ArticleLoader = () => <ArticleSkeleton />;

const dynamicArticle = (importer: () => Promise<{ default: React.ComponentType }>) =>
  dynamic(importer, { loading: ArticleLoader });

// Per-slug dynamic imports: each article (~12-13KB) loads only when its
// route is visited, instead of bundling all 10 into every learn page.
const articleComponents: Record<string, React.ComponentType> = {
  "gradient-descent": dynamicArticle(
    () => import("@/components/articles/content/regression/GradientDescentArticle"),
  ),
  "least-squares": dynamicArticle(
    () => import("@/components/articles/content/regression/LeastSquaresArticle"),
  ),
  "linear-regression": dynamicArticle(
    () => import("@/components/articles/content/regression/LinearRegressionArticle"),
  ),
  "polynomial-regression": dynamicArticle(
    () =>
      import("@/components/articles/content/regression/PolynomialRegressionArticle"),
  ),
  "logistic-regression": dynamicArticle(
    () =>
      import("@/components/articles/content/classification/LogisticRegressionArticle"),
  ),
  "decision-trees": dynamicArticle(
    () => import("@/components/articles/content/classification/DecisionTreeArticle"),
  ),
  "k-nearest-neighbors": dynamicArticle(
    () =>
      import("@/components/articles/content/classification/KNearestNeighborsArticle"),
  ),
  "naive-bayes": dynamicArticle(
    () => import("@/components/articles/content/classification/NaiveBayesArticle"),
  ),
  "kernel-trick": dynamicArticle(
    () => import("@/components/articles/content/advanced/KernelTrickArticle"),
  ),
  svr: dynamicArticle(
    () => import("@/components/articles/content/regression/SVRArticle"),
  ),
  "what-is-ml": dynamicArticle(
    () => import("@/components/articles/content/beginner/WhatIsMlArticle"),
  ),
  "first-project": dynamicArticle(
    () => import("@/components/articles/content/beginner/FirstProjectArticle"),
  ),
  "good-vs-bad-models": dynamicArticle(
    () => import("@/components/articles/content/beginner/GoodVsBadModelsArticle"),
  ),
};

export default function ArticleClient({ slug }: { slug: string }) {
  const ArticleComponent = articleComponents[slug];

  if (!ArticleComponent) {
    return null;
  }

  return <ArticleComponent />;
}
