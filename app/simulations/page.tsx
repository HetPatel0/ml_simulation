// app/simulations/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
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
  category:
    | "regression"
    | "classification"
    | "clustering"
    | "testing"
    | "other";
}

const CATEGORY_TITLES: Record<Simulation["category"], string> = {
  regression: "Regression",
  classification: "Classification",
  clustering: "Clustering",
  testing: "Testing",
  other: "Advanced & Experimental",
};

const simulations: Simulation[] = [
  {
    id: "gradient-descent",
    title: "Gradient Descent",
    description:
      "Visualize how gradient descent optimization algorithm finds the minimum of a function",
    image: "/images/regression/gradient-descent.png",
    badge: "Regression",
    category: "regression",
  },
  {
    id: "least-squares",
    title: "Least Squares",
    description:
      "Interactive demonstration of the least squares method for linear regression",
    image: "/images/regression/least-squares.png",
    badge: "Regression",
    category: "regression",
  },
  {
    id: "linear-regression",
    title: "Linear Regression Interactive",
    description:
      "Build intuition for linear regression with interactive data points",
    image: "/images/regression/linear-regression.png",
    badge: "Regression",
    category: "regression",
  },
  {
    id: "polynomial-regression",
    title: "Polynomial Regression",
    description: "Explore how polynomial features can fit non-linear patterns",
    image: "/images/regression/polynomial-regression.png",
    badge: "Regression",
    category: "regression",
  },
  {
    id: "logistic-regression",
    title: "Logistic Regression",
    description: "Understanding binary classification with logistic regression",
    image: "/images/classification/logistic-regression.png",
    badge: "Classification",
    category: "classification",
  },
  {
    id: "logistic-function",
    title: "Logistic Function Visualizer",
    description: "Visualize the sigmoid function and decision boundaries",
    image: "/images/classification/logistic-function.png",
    badge: "Classification",
    category: "classification",
  },
  {
    id: "logistic-training",
    title: "Logistic Training Simulation",
    description: "Step-by-step training process of logistic regression",
    image: "/images/classification/logistic-training.png",
    badge: "Classification",
    category: "classification",
  },
  {
    id: "kernel-trick",
    title: "Kernel Trick Visualizer",
    description: "See how kernel methods transform data into higher dimensions",
    image: "/images/other/kernel-trick.png",
    badge: "Advanced",
    category: "other",
  },
  {
    id: "svr-visualizer",
    title: "Support Vector Regression",
    description: "Understand SVR with epsilon tubes and support vectors",
    image: "/images/regression/svr.png",
    badge: "Regression",
    category: "regression",
  },
];

export default function SimulationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  /* ⌘K / CtrlK focus + Esc clear */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }

      if (e.key === "Escape") {
        setSearchQuery("");
        searchInputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const query = searchQuery.trim().toLowerCase();

  const filteredSimulations = simulations.filter(
    (sim) =>
      sim.title.toLowerCase().includes(query) ||
      sim.description.toLowerCase().includes(query) ||
      sim.category.toLowerCase().includes(query),
  );

  const groupedSimulations = filteredSimulations.reduce<
    Record<Simulation["category"], Simulation[]>
  >(
    (acc, sim) => {
      acc[sim.category].push(sim);
      return acc;
    },
    {
      regression: [],
      classification: [],
      clustering: [],
      testing: [],
      other: [],
    },
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">ML Simulations</h1>
        <p className="text-muted-foreground text-lg">
          Interactive visualizations to understand machine learning algorithms
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-10">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

        <Input
          ref={searchInputRef}
          type="text"
          placeholder="Search simulations… (⌘+K)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10 border-2"
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

      {/* Sections */}
      <div className="space-y-16">
        {(Object.keys(CATEGORY_TITLES) as Simulation["category"][]).map(
          (category) => {
            const sims = groupedSimulations[category];
            if (sims.length === 0) return null;

            return (
              <section key={category} className="space-y-6">
                <h2 className="text-2xl font-semibold tracking-tight">
                  {CATEGORY_TITLES[category]}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sims.map((sim) => (
                    <LearningCard
                      key={sim.id}
                      title={sim.title}
                      description={sim.description}
                      href={`/simulations/${sim.id}`}
                      image={sim.image}
                      badge={sim.badge}
                      variant="simulation"
                    />
                  ))}
                </div>
              </section>
            );
          },
        )}
      </div>

      {filteredSimulations.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No simulations found matching &quot;{searchQuery}&quot;
        </div>
      )}
    </div>
  );
}
