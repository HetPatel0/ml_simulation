"use client";

import GradientDescent from "@/components/simulations/GradientDescent";
import KernelTrickVisualizer from "@/components/simulations/KernelTrickVisualizer";
import LeastSquares from "@/components/simulations/LeastSquares";
import LinearRegressionInteractive from "@/components/simulations/LinearRegressionInteractive";
import LogisticFunctionVisualizer from "@/components/simulations/LogisticFunctionVisualizer";
import LogisticRegression from "@/components/simulations/LogisticRegression";
import LogisticTrainingSim from "@/components/simulations/LogisticTrainingSim";
import PolynomialRegression from "@/components/simulations/PolynomialRegression";
import SVRKernelLiftSimulation from "@/components/simulations/SvrKernelLift";
import SVRVisualizer from "@/components/simulations/SVRVisualizer";

const simulationComponents: Record<string, React.ComponentType> = {
  "gradient-descent": GradientDescent,
  "least-squares": LeastSquares,
  "linear-regression": LinearRegressionInteractive,
  "polynomial-regression": PolynomialRegression,
  "logistic-regression": LogisticRegression,
  "logistic-function": LogisticFunctionVisualizer,
  "logistic-training": LogisticTrainingSim,
  "kernel-trick": KernelTrickVisualizer,
  "svr-visualizer": SVRVisualizer,
  "svr-kernel-lift": SVRKernelLiftSimulation,
};

export default function SimulationClient({ slug }: { slug: string }) {
  const SimulationComponent = simulationComponents[slug];

  if (!SimulationComponent) {
    return null;
  }

  return <SimulationComponent />;
}
