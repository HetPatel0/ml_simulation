"use client";

import { dynamicMap, ContentFromMap } from "@/lib/dynamic-content";
import { ArticleSkeleton } from "@/components/ui/loading-skeleton";
import { QuizBlock } from "@/components/articles/components/QuizBlock";
import { quizzes } from "@/lib/quizzes";

const ArticleLoader = () => <ArticleSkeleton />;

// Per-slug dynamic imports: each article (~12-13KB) loads only when its
// route is visited, instead of bundling all into every learn page.
// The quiz is appended INSIDE the resolved chunk, so "Check your
// understanding" only appears once the article body has loaded
// (never floating above the skeleton).
const articleComponents = dynamicMap(
  {
    "gradient-descent": () =>
      import("@/components/articles/content/regression/GradientDescentArticle"),
    "least-squares": () =>
      import("@/components/articles/content/regression/LeastSquaresArticle"),
    "linear-regression": () =>
      import("@/components/articles/content/regression/LinearRegressionArticle"),
    "polynomial-regression": () =>
      import("@/components/articles/content/regression/PolynomialRegressionArticle"),
    "logistic-regression": () =>
      import(
        "@/components/articles/content/classification/LogisticRegressionArticle"
      ),
    "decision-trees": () =>
      import("@/components/articles/content/classification/DecisionTreeArticle"),
    "k-nearest-neighbors": () =>
      import(
        "@/components/articles/content/classification/KNearestNeighborsArticle"
      ),
    "naive-bayes": () =>
      import("@/components/articles/content/classification/NaiveBayesArticle"),
    "kernel-trick": () =>
      import("@/components/articles/content/advanced/KernelTrickArticle"),
    svr: () => import("@/components/articles/content/regression/SVRArticle"),
    "what-is-ml": () =>
      import("@/components/articles/content/beginner/WhatIsMlArticle"),
    "first-project": () =>
      import("@/components/articles/content/beginner/FirstProjectArticle"),
    "good-vs-bad-models": () =>
      import("@/components/articles/content/beginner/GoodVsBadModelsArticle"),
  },
  {
    loading: ArticleLoader,
    decorate: (Body, slug) => {
      const questions = quizzes[slug] ?? [];
      return () => (
        <>
          <Body />
          {questions.length > 0 && (
            <QuizBlock slug={slug} questions={questions} />
          )}
        </>
      );
    },
  },
);

export default function ArticleClient({ slug }: { slug: string }) {
  return <ContentFromMap map={articleComponents} slug={slug} />;
}
