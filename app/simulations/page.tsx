// app/simulations/page.tsx
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Search, X } from "lucide-react";
import { LearningCard } from "@/components/learning-card";

interface Simulation {
  id: string;
  title: string;
  description: string;
  image: string;
  badge: string;
  category: "regression" | "classification" | "clustering" | "other";
}

const simulations: Simulation[] = [
  {
    id: "gradient-descent",
    title: "Gradient Descent",
    description:
      "Visualize how gradient descent optimization algorithm finds the minimum of a function",
    image: "/images/gradient-descent.jpg", // Add your images
    badge: "Regression",
    category: "regression",
  },
  {
    id: "least-squares",
    title: "Least Squares",
    description:
      "Interactive demonstration of the least squares method for linear regression",
    image: "/images/least-squares.jpg",
    badge: "Regression",
    category: "regression",
  },
  {
    id: "linear-regression",
    title: "Linear Regression Interactive",
    description:
      "Build intuition for linear regression with interactive data points",
    image: "/images/linear-regression.jpg",
    badge: "Regression",
    category: "regression",
  },
  {
    id: "polynomial-regression",
    title: "Polynomial Regression",
    description: "Explore how polynomial features can fit non-linear patterns",
    image: "/images/polynomial-regression.jpg",
    badge: "Regression",
    category: "regression",
  },
  {
    id: "logistic-regression",
    title: "Logistic Regression",
    description: "Understanding binary classification with logistic regression",
    image: "/images/logistic-regression.jpg",
    badge: "Classification",
    category: "classification",
  },
  {
    id: "logistic-function",
    title: "Logistic Function Visualizer",
    description: "Visualize the sigmoid function and decision boundaries",
    image: "/images/logistic-function.jpg",
    badge: "Classification",
    category: "classification",
  },
  {
    id: "logistic-training",
    title: "Logistic Training Simulation",
    description: "Step-by-step training process of logistic regression",
    image: "/images/logistic-training.jpg",
    badge: "Classification",
    category: "classification",
  },
  {
    id: "kernel-trick",
    title: "Kernel Trick Visualizer",
    description: "See how kernel methods transform data into higher dimensions",
    image: "/images/kernel-trick.jpg",
    badge: "Advanced",
    category: "other",
  },
  {
    id: "svr-visualizer",
    title: "Support Vector Regression",
    description: "Understand SVR with epsilon tubes and support vectors",
    image: "/images/svr.jpg",
    badge: "Regression",
    category: "regression",
  },
];

export default function SimulationsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSimulations = simulations.filter(
    (sim) =>
      sim.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sim.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sim.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">ML Simulations</h1>
        <p className="text-muted-foreground text-lg">
          Interactive visualizations to understand machine learning algorithms
        </p>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

        <Input
          type="text"
          placeholder="Search simulations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10"
        />

        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchQuery("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSimulations.map((sim) => (
          <LearningCard
            key={sim.id}
            title={sim.title}
            description={sim.description}
            href={`/simulations/${sim.id}`}
            image={sim.image}
            badge={sim.badge}
          />
        ))}
      </div>

      {filteredSimulations.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No simulations found matching &quot;{searchQuery}&quot;
        </div>
      )}
    </div>
  );
}
