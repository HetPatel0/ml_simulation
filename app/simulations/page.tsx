// app/simulations/page.tsx — server shell (SEO + static header),
// interactive search/filter lives in the client island below.
import type { Metadata } from "next";
import { Play } from "lucide-react";
import {
  SimulationBrowser,
  type Simulation,
} from "@/components/listings/simulation-browser";

export const metadata: Metadata = {
  title: "ML Simulations",
  description:
    "Interactive visualizations to understand machine learning algorithms",
  alternates: { canonical: "/simulations" },
};

const simulations: Simulation[] = [
  {
    id: "gradient-descent",
    title: "Gradient Descent",
    description:
      "Visualize how gradient descent optimization algorithm finds the minimum of a function",
    image: "/images/regression/gradient-descent.webp",
    badge: "Regression",
    category: "regression",
  },
  {
    id: "least-squares",
    title: "Least Squares",
    description:
      "Interactive demonstration of the least squares method for linear regression",
    image: "/images/regression/least-squares.webp",
    badge: "Regression",
    category: "regression",
  },
  {
    id: "linear-regression",
    title: "Linear Regression Interactive",
    description:
      "Build intuition for linear regression with interactive data points",
    image: "/images/regression/linear-regression.webp",
    badge: "Regression",
    category: "regression",
  },
  {
    id: "polynomial-regression",
    title: "Polynomial Regression",
    description: "Explore how polynomial features can fit non-linear patterns",
    image: "/images/regression/polynomial-regression.webp",
    badge: "Regression",
    category: "regression",
  },
  {
    id: "logistic-regression",
    title: "Logistic Regression",
    description: "Understanding binary classification with logistic regression",
    image: "/images/classification/logistic-regression.webp",
    badge: "Classification",
    category: "classification",
  },
  {
    id: "logistic-function",
    title: "Logistic Function Visualizer",
    description: "Visualize the sigmoid function and decision boundaries",
    image: "/images/classification/logistic-function.webp",
    badge: "Classification",
    category: "classification",
  },
  {
    id: "logistic-training",
    title: "Logistic Training Simulation",
    description: "Step-by-step training process of logistic regression",
    image: "/images/classification/logistic-training.webp",
    badge: "Classification",
    category: "classification",
  },
  {
    id: "k-nearest-neighbors",
    title: "K-Nearest Neighbors Playground",
    description: "Click anywhere and watch the k closest points vote on its label",
    image: "/images/classification/knn-sim.webp",
    badge: "Classification",
    category: "classification",
  },
  {
    id: "decision-trees",
    title: "Decision Tree Playground",
    description: "Watch one tree grow split by split, then feel overfitting",
    image: "/images/classification/decision-tree-v2.webp",
    badge: "Classification",
    category: "classification",
  },
  {
    id: "naive-bayes",
    title: "Naive Bayes Detective",
    description: "Stack word clues and watch posterior odds move",
    image: "/images/classification/ham-or-spam.webp",
    badge: "Classification",
    category: "classification",
  },
  {
    id: "naive-bayes-gaussian",
    title: "Gaussian Naive Bayes",
    description: "Drag class blobs and watch the boundary follow the math",
    image: "/images/classification/gaussian-naive-bayes.webp",
    badge: "Classification",
    category: "classification",
  },
  {
    id: "kernel-trick",
    title: "Kernel Trick Visualizer",
    description: "See how kernel methods transform data into higher dimensions",
    image: "/images/other/kernel-trick.webp",
    badge: "Advanced",
    category: "other",
  },
  {
    id: "svr-visualizer",
    title: "Support Vector Regression",
    description: "Understand SVR with epsilon tubes and support vectors",
    image: "/images/regression/svr.webp",
    badge: "Regression",
    category: "regression",
  },
  {
    id: "svr-kernel-lift",
    title: "SVR Kernel Lift",
    description:
      "See how SVR lifts non-linear regression data into a space where a flat plane can fit.",
    image: "/images/regression/svr-kernel-lift.webp",
    badge: "Kernel Geometry",
    category: "regression",
  },
];

export default function SimulationsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Play className="h-5 w-5" />
          </div>
          <h1 className="text-4xl font-bold">ML Simulations</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Interactive visualizations to understand machine learning algorithms
        </p>
      </div>

      <SimulationBrowser simulations={simulations} />
    </div>
  );
}
