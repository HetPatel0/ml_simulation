"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import GradientDescent from "@/components/simulations/GradientDescent";
import KernelTrickVisualizer from "@/components/simulations/KernelTrickVisualizer";
import LeastSquares from "@/components/simulations/LeastSquares";
import LinearRegressionInteractive from "@/components/simulations/LinearRegressionInteractive";
import LogisticFunctionVisualizer from "@/components/simulations/LogisticFunctionVisualizer";
import LogisticRegression from "@/components/simulations/LogisticRegression";
import LogisticTrainingSim from "@/components/simulations/LogisticTrainingSim";
import PolynomialRegression from "@/components/simulations/PolynomialRegression";
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
};

export default function SimulationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const SimulationComponent = simulationComponents[slug];

  if (!SimulationComponent) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <SimulationComponent />
    </div>
  );
}

// components/simulations/SimHeader.tsx
interface SimHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function SimHeader({ title, description, children }: SimHeaderProps) {
  return (
    <div className="px-4 py-6 md:px-6 md:py-8 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
        {description && (
          <p className="text-muted-foreground text-base md:text-lg mb-4">
            {description}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}
