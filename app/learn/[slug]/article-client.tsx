"use client";

import GradientDescentArticle from "@/components/articles/content/regression/GradientDescentArticle";
import KernelTrickArticle from "@/components/articles/content/advanced/KernelTrickArticle";
import KNearestNeighborsArticle from "@/components/articles/content/classification/KNearestNeighborsArticle";
import LeastSquaresArticle from "@/components/articles/content/regression/LeastSquaresArticle";
import LinearRegressionArticle from "@/components/articles/content/regression/LinearRegressionArticle";
import LogisticRegressionArticle from "@/components/articles/content/classification/LogisticRegressionArticle";
import NaiveBayesArticle from "@/components/articles/content/classification/NaiveBayesArticle";
import PolynomialRegressionArticle from "@/components/articles/content/regression/PolynomialRegressionArticle";
import SVRArticle from "@/components/articles/content/regression/SVRArticle";
import DecisionTreeArticle from "@/components/articles/content/classification/DecisionTreeArticle";

const articleComponents: Record<string, React.ComponentType> = {
  "gradient-descent": GradientDescentArticle,
  "least-squares": LeastSquaresArticle,
  "linear-regression": LinearRegressionArticle,
  "polynomial-regression": PolynomialRegressionArticle,
  "logistic-regression": LogisticRegressionArticle,
  "decision-trees": DecisionTreeArticle,
  "k-nearest-neighbors": KNearestNeighborsArticle,
  "naive-bayes": NaiveBayesArticle,
  "kernel-trick": KernelTrickArticle,
  svr: SVRArticle,
};

export default function ArticleClient({ slug }: { slug: string }) {
  const ArticleComponent = articleComponents[slug];

  if (!ArticleComponent) {
    return null;
  }

  return <ArticleComponent />;
}
