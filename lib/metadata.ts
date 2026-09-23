export const siteConfig = {
  name: "ML Simulations",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://mlsimulations.com",
  ogImage: "/og/home.jpg",
  description:
    "Interactive machine learning simulations designed to help students understand concepts through hands-on experimentation.",
};

export const simulationMetadata: Record<
  string,
  { title: string; description: string; image: string }
> = {
  "gradient-descent": {
    title: "Gradient Descent Visualization",
    description:
      "Visualize how gradient descent optimization finds the minimum of a function. Adjust learning rate and see convergence in real-time.",
    image: "/og/gradient-descent.jpg",
  },
  "least-squares": {
    title: "Least Squares Method",
    description:
      "Interactive demonstration of ordinary least squares regression. Add data points and see the best-fit line minimize squared errors.",
    image: "/og/least-squares.jpg",
  },
  "linear-regression": {
    title: "Linear Regression Interactive",
    description:
      "Build intuition for linear regression with interactive data points. Add, remove, and see how the regression line changes.",
    image: "/og/linear-regression.jpg",
  },
  "polynomial-regression": {
    title: "Polynomial Regression",
    description:
      "Explore polynomial curve fitting with adjustable degree. Drag control points and see how higher-degree polynomials fit data.",
    image: "/og/polynomial-regression.jpg",
  },
  "logistic-regression": {
    title: "Logistic Regression",
    description:
      "Understand binary classification with logistic regression. Visualize probability predictions and decision boundaries.",
    image: "/og/logistic-regression.jpg",
  },
  "logistic-function": {
    title: "Logistic Function Visualizer",
    description:
      "Explore the sigmoid function shape. Adjust weight and bias parameters to see how they affect the logistic curve.",
    image: "/og/sim-logistic-function.jpg",
  },
  "logistic-training": {
    title: "Logistic Training Simulation",
    description:
      "Watch logistic regression learn in real-time with stochastic gradient descent. See loss curves and weight updates.",
    image: "/og/sim-logistic-training.jpg",
  },
  "kernel-trick": {
    title: "Kernel Trick Visualizer",
    description:
      "See how kernel methods transform non-linearly separable data into higher dimensions where it becomes separable.",
    image: "/og/kernel-trick.jpg",
  },
  "svr-visualizer": {
    title: "Support Vector Regression",
    description:
      "Understand SVR with epsilon tubes and support vectors. Interactive visualization of margin and kernel effects.",
    image: "/og/svr.jpg",
  },
  "svr-kernel-lift": {
    title: "SVR Kernel Lift",
    description:
      "An interactive visualization showing how Support Vector Regression lifts curved data into higher-dimensional space to enable linear regression.",
    image: "/og/sim-svr-kernel-lift.jpg",
  },
};

export const articleMetadata: Record<
  string,
  { title: string; description: string; image: string; author: string }
> = {
  "gradient-descent": {
    title: "Understanding Gradient Descent",
    description:
      "Learn how gradient descent optimizes models by minimizing loss functions. Visual explanations of learning rate, convergence, and local minima.",
    image: "/og/gradient-descent.jpg",
    author: "Keval Kansagra",
  },
  "least-squares": {
    title: "Least Squares Method Explained",
    description:
      "Understand the mathematical foundation of ordinary least squares regression and how it finds the best-fit line.",
    image: "/og/least-squares.jpg",
    author: "Het Bhuva",
  },
  "linear-regression": {
    title: "Linear Regression Explained",
    description:
      "A comprehensive guide to linear regression, the foundational statistical technique for predictive modeling.",
    image: "/og/linear-regression.jpg",
    author: "Keval Kansagra",
  },
  "polynomial-regression": {
    title: "Polynomial Regression Guide",
    description:
      "Learn how polynomial features allow regression models to fit non-linear patterns. Understand overfitting and model complexity.",
    image: "/og/polynomial-regression.jpg",
    author: "Keval Kansagra",
  },
  "logistic-regression": {
    title: "Logistic Regression Fundamentals",
    description:
      "Visual guide to binary classification with logistic regression. Understand sigmoid functions and decision boundaries.",
    image: "/og/logistic-regression.jpg",
    author: "Keval Kansagra",
  },
  "decision-trees": {
    title: "Decision Trees Explained",
    description:
      "Learn how decision trees split data into pure branches using Gini impurity, entropy, pruning, and simple rules.",
    image: "/og/decision-trees.jpg",
    author: "Codex",
  },
  "k-nearest-neighbors": {
    title: "K-Nearest Neighbors Guide",
    description:
      "Understand KNN classification with distance metrics, voting, scaling, and practical tips for choosing k.",
    image: "/og/k-nearest-neighbors.jpg",
    author: "Codex",
  },
  "naive-bayes": {
    title: "Naive Bayes Classification",
    description:
      "Fast probabilistic classification with Bayes' theorem, smoothing, priors, and practical text examples.",
    image: "/og/naive-bayes.jpg",
    author: "Codex",
  },
  "kernel-trick": {
    title: "Kernel Methods Explained",
    description:
      "Discover how kernel tricks transform data into higher-dimensional spaces. Learn about RBF, polynomial, and linear kernels.",
    image: "/og/kernel-trick.jpg",
    author: "Het Bhuva",
  },
  svr: {
    title: "Support Vector Regression",
    description:
      "Comprehensive guide to SVR including epsilon tubes, margins, and support vectors. Learn kernel-based regression.",
    image: "/og/svr.jpg",
    author: "Het Bhuva",
  },
};

// Maps articles to their related simulations
export const articleSimulationMap: Record<string, string[]> = {
  "linear-regression": ["linear-regression", "least-squares"],
  "gradient-descent": ["gradient-descent"],
  "polynomial-regression": ["polynomial-regression"],
  "logistic-regression": ["logistic-regression", "logistic-function", "logistic-training"],
  "decision-trees": [],
  "k-nearest-neighbors": [],
  "naive-bayes": [],
  svr: ["svr-visualizer", "svr-kernel-lift"],
  "kernel-trick": ["kernel-trick"],
  "least-squares": ["least-squares"],
};
