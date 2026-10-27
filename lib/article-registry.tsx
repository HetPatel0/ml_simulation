import type { ComponentType } from "react";
import GradientDescentArticle from "@/components/articles/content/regression/GradientDescentArticle";
import LeastSquaresArticle from "@/components/articles/content/regression/LeastSquaresArticle";
import LinearRegressionArticle from "@/components/articles/content/regression/LinearRegressionArticle";
import PolynomialRegressionArticle from "@/components/articles/content/regression/PolynomialRegressionArticle";
import LogisticRegressionArticle from "@/components/articles/content/classification/LogisticRegressionArticle";
import DecisionTreeArticle from "@/components/articles/content/classification/DecisionTreeArticle";
import KNearestNeighborsArticle from "@/components/articles/content/classification/KNearestNeighborsArticle";
import NaiveBayesArticle from "@/components/articles/content/classification/NaiveBayesArticle";
import KernelTrickArticle from "@/components/articles/content/advanced/KernelTrickArticle";
import SVRArticle from "@/components/articles/content/regression/SVRArticle";
import WhatIsMlArticle from "@/components/articles/content/beginner/WhatIsMlArticle";
import FirstProjectArticle from "@/components/articles/content/beginner/FirstProjectArticle";
import GoodVsBadModelsArticle from "@/components/articles/content/beginner/GoodVsBadModelsArticle";

/**
 * Server-only slug → article map. Importing the bodies here keeps their JSX
 * on the server; the client only hydrates the interactive islands inside
 * them (copy button, image lightbox, share/listen, quiz).
 */
export const articleComponents = {
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
  "what-is-ml": WhatIsMlArticle,
  "first-project": FirstProjectArticle,
  "good-vs-bad-models": GoodVsBadModelsArticle,
} satisfies Record<string, ComponentType>;

export type ArticleSlug = keyof typeof articleComponents;
