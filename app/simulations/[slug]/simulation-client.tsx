"use client";

import { dynamicMap, ContentFromMap } from "@/lib/dynamic-content";
import { SimulationSkeleton } from "@/components/ui/loading-skeleton";
import { SimulationErrorBoundary } from "@/components/simulations/simulation-error-boundary";

const SimulationLoader = () => <SimulationSkeleton />;

const simulationComponents = dynamicMap(
  {
    "gradient-descent": () =>
      import("@/components/simulations/GradientDescent"),
    "least-squares": () => import("@/components/simulations/LeastSquares"),
    "linear-regression": () =>
      import("@/components/simulations/LinearRegressionInteractive"),
    "polynomial-regression": () =>
      import("@/components/simulations/PolynomialRegression"),
    "logistic-regression": () =>
      import("@/components/simulations/LogisticRegression"),
    "logistic-function": () =>
      import("@/components/simulations/LogisticFunctionVisualizer"),
    "logistic-training": () =>
      import("@/components/simulations/LogisticTrainingSim"),
    "kernel-trick": () =>
      import("@/components/simulations/KernelTrickVisualizer"),
    "k-nearest-neighbors": () =>
      import("@/components/simulations/KNearestNeighbors"),
    "decision-trees": () => import("@/components/simulations/DecisionTree"),
    "naive-bayes": () => import("@/components/simulations/NaiveBayes"),
    "naive-bayes-gaussian": () =>
      import("@/components/simulations/NaiveBayesGaussian"),
    "svr-visualizer": () => import("@/components/simulations/SVRVisualizer"),
    "svr-kernel-lift": () => import("@/components/simulations/SvrKernelLift"),
  },
  { ssr: false, loading: SimulationLoader },
);

export default function SimulationClient({ slug }: { slug: string }) {
  return (
    <SimulationErrorBoundary>
      <ContentFromMap map={simulationComponents} slug={slug} />
    </SimulationErrorBoundary>
  );
}
