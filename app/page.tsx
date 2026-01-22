"use client";

import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import { LearningCard } from "@/components/learning-card";
import {
  Brain02Icon,
  Target01Icon,
  WaterfallUp01Icon,
} from "@hugeicons/core-free-icons";

export const learningCards = [
  {
    title: "Support Vector Regression",
    description:
      "Understand ε-insensitive loss, margins, kernels, and support vectors visually.",
    href: "/simulations/svr",
    image: "/images/svr.jpg",
    badge: "Simulation",
  },
  {
    title: "Gradient Descent",
    description:
      "See how optimization works step-by-step on real loss surfaces.",
    href: "/simulations/gradient-descent",
    image: "/images/gradient.jpg",
    badge: "Simulation",
  },
  {
    title: "Polynomial Regression",
    description: "Visualize overfitting, underfitting, and model complexity.",
    href: "/simulations/polynomial-regression",
    image: "/images/polynomial.jpg",
    badge: "Simulation",
  },
  {
    title: "Bias vs Variance",
    description: "Develop intuition about generalization and model trade-offs.",
    href: "/blog/bias-variance",
    image: "/images/bias-variance.jpg",
    badge: "Concept",
  },
  {
    title: "Kernels Explained",
    description: "Learn how kernels transform data into higher dimensions.",
    href: "/blog/kernels",
    image: "/images/kernel.jpg",
    badge: "Concept",
  },
  {
    title: "Loss Functions",
    description: "Why different models use different loss functions.",
    href: "/blog/loss-functions",
    image: "/images/loss.jpg",
    badge: "Concept",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      <section className="px-6 lg:px-12 py-28">
        <div className="mx-auto max-w-6xl flex flex-col gap-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Learn Machine Learning
            <span className="block text-primary">Visually & Intuitively</span>
          </h1>

          <p className="mx-auto max-w-3xl text-muted-foreground text-lg md:text-xl">
            ML Simulations helps students understand complex machine learning
            concepts through <strong>interactive visualizations</strong>, not
            just equations and code.
          </p>

          <div className="flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/simulations">Explore Simulations</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/blog">Read Concepts</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ================= WHY IT HELPS ================= */}
      <section className="px-6 lg:px-12 py-20 bg-muted/30">
        <div className="mx-auto max-w-6xl grid gap-8 md:grid-cols-3">
          {/* Feature 1 */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <HugeiconsIcon icon={WaterfallUp01Icon} className="h-5 w-5" />
              </span>

              <h3 className="text-lg font-semibold">Visual Intuition</h3>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              See how models learn, converge, and fail — instead of guessing
              from formulas.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <HugeiconsIcon icon={Brain02Icon} className="h-5 w-5" />
              </span>

              <h3 className="text-lg font-semibold">Concept First</h3>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Build strong mental models before diving into implementation
              details.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <HugeiconsIcon icon={Target01Icon} className="h-5 w-5" />
              </span>

              <h3 className="text-lg font-semibold">Student-Focused</h3>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Designed for learners preparing for exams, interviews, and real ML
              work.
            </p>
          </div>
        </div>
      </section>

      {/* ================= LEARNING CARDS ================= */}
      <section className="px-6 lg:px-12 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-10 text-center">
            Learn by Exploring
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {learningCards.map((card) => (
              <LearningCard key={card.href} {...card} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
