"use client";

import dynamic from "next/dynamic";
import { ArticleSkeleton } from "@/components/ui/loading-skeleton";
import { QuizBlock } from "@/components/articles/components/QuizBlock";
import { quizzes } from "@/lib/quizzes";

const ArticleLoader = () => <ArticleSkeleton />;

// Dynamic import that appends the quiz INSIDE the resolved chunk, so
// "Check your understanding" only appears once the article body has loaded
// (never floating above the skeleton).
const dynamicArticleWithQuiz = (
  slug: string,
  importer: () => Promise<{ default: React.ComponentType }>,
) =>
  dynamic(
    () =>
      importer().then((mod) => {
        const Body = mod.default;
        const questions = quizzes[slug] ?? [];
        return {
          default: () => (
            <>
              <Body />
              {questions.length > 0 && <QuizBlock slug={slug} questions={questions} />}
            </>
          ),
        };
      }),
    { loading: ArticleLoader },
  );

// Per-slug dynamic imports: each article (~12-13KB) loads only when its
// route is visited, instead of bundling all 10 into every learn page.
const articleComponents: Record<string, React.ComponentType> = {
  "gradient-descent": dynamicArticleWithQuiz("gradient-descent",
    () => import("@/components/articles/content/regression/GradientDescentArticle"),
  ),
  "least-squares": dynamicArticleWithQuiz("least-squares",
    () => import("@/components/articles/content/regression/LeastSquaresArticle"),
  ),
  "linear-regression": dynamicArticleWithQuiz("linear-regression",
    () => import("@/components/articles/content/regression/LinearRegressionArticle"),
  ),
  "polynomial-regression": dynamicArticleWithQuiz("polynomial-regression",
    () =>
      import("@/components/articles/content/regression/PolynomialRegressionArticle"),
  ),
  "logistic-regression": dynamicArticleWithQuiz("logistic-regression",
    () =>
      import("@/components/articles/content/classification/LogisticRegressionArticle"),
  ),
  "decision-trees": dynamicArticleWithQuiz("decision-trees",
    () => import("@/components/articles/content/classification/DecisionTreeArticle"),
  ),
  "k-nearest-neighbors": dynamicArticleWithQuiz("k-nearest-neighbors",
    () =>
      import("@/components/articles/content/classification/KNearestNeighborsArticle"),
  ),
  "naive-bayes": dynamicArticleWithQuiz("naive-bayes",
    () => import("@/components/articles/content/classification/NaiveBayesArticle"),
  ),
  "kernel-trick": dynamicArticleWithQuiz("kernel-trick",
    () => import("@/components/articles/content/advanced/KernelTrickArticle"),
  ),
  svr: dynamicArticleWithQuiz("svr",
    () => import("@/components/articles/content/regression/SVRArticle"),
  ),
  "what-is-ml": dynamicArticleWithQuiz("what-is-ml",
    () => import("@/components/articles/content/beginner/WhatIsMlArticle"),
  ),
  "first-project": dynamicArticleWithQuiz("first-project",
    () => import("@/components/articles/content/beginner/FirstProjectArticle"),
  ),
  "good-vs-bad-models": dynamicArticleWithQuiz("good-vs-bad-models",
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
