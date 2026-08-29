"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { SimulationErrorBoundary } from "@/components/simulations/simulation-error-boundary";

const SimulationLoader = () => (
  <div
    role="status"
    aria-label="Loading simulation"
    className="flex min-h-[420px] w-full items-center justify-center"
  >
    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
  </div>
);

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
