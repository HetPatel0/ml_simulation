"use client";

import dynamic from "next/dynamic";
import { SimulationSkeleton } from "@/components/ui/loading-skeleton";
import { SimulationErrorBoundary } from "@/components/simulations/simulation-error-boundary";

const SimulationLoader = () => <SimulationSkeleton />;

const dynamicSimulation = (importer: () => Promise<{ default: React.ComponentType }>) =>
  dynamic(importer, { ssr: false, loading: SimulationLoader });

const simulationComponents: Record<string, React.ComponentType> = {
  "gradient-descent": dynamicSimulation(
    () => import("@/components/simulations/GradientDescent"),
  ),
  "least-squares": dynamicSimulation(
    () => import("@/components/simulations/LeastSquares"),
  ),
  "linear-regression": dynamicSimulation(
    () => import("@/components/simulations/LinearRegressionInteractive"),
  ),
  "polynomial-regression": dynamicSimulation(
    () => import("@/components/simulations/PolynomialRegression"),
  ),
  "logistic-regression": dynamicSimulation(
    () => import("@/components/simulations/LogisticRegression"),
  ),
  "logistic-function": dynamicSimulation(
    () => import("@/components/simulations/LogisticFunctionVisualizer"),
  ),
  "logistic-training": dynamicSimulation(
    () => import("@/components/simulations/LogisticTrainingSim"),
  ),
  "kernel-trick": dynamicSimulation(
    () => import("@/components/simulations/KernelTrickVisualizer"),
  ),
  "k-nearest-neighbors": dynamicSimulation(
    () => import("@/components/simulations/KNearestNeighbors"),
  ),
  "decision-trees": dynamicSimulation(
    () => import("@/components/simulations/DecisionTree"),
  ),
  "naive-bayes": dynamicSimulation(
    () => import("@/components/simulations/NaiveBayes"),
  ),
  "naive-bayes-gaussian": dynamicSimulation(
    () => import("@/components/simulations/NaiveBayesGaussian"),
  ),
  "svr-visualizer": dynamicSimulation(
    () => import("@/components/simulations/SVRVisualizer"),
  ),
  "svr-kernel-lift": dynamicSimulation(
    () => import("@/components/simulations/SvrKernelLift"),
  ),
};

export default function SimulationClient({ slug }: { slug: string }) {
  const SimulationComponent = simulationComponents[slug];

  if (!SimulationComponent) {
    return null;
  }

  return (
    <SimulationErrorBoundary>
      <SimulationComponent />
    </SimulationErrorBoundary>
  );
}
