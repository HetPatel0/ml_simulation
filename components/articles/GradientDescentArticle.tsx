import { ArticlePost } from "./article-post";

export default function GradientDescentArticle() {
  return (
    <ArticlePost
      title="Gradient Descent"
      author="Keval"
      description="Learn how gradient descent optimization algorithm finds the minimum of a function by iteratively moving in the direction of steepest descent."
      image={{
        src: "/article/regression/gradient-descent.png",
        alt: "Gradient Descent Visualization",
      }}
    >
      <h2>Introduction</h2>
      <p>
        Gradient descent is one of the most popular optimization algorithms in machine learning.
        It is used to minimize the cost function by iteratively updating parameters in the
        direction of the negative gradient.
      </p>

      <h2>How It Works</h2>
      <p>
        The algorithm starts with initial parameter values and repeatedly adjusts them to
        reduce the cost function. The size of each step is determined by the learning rate.
      </p>

      <h3>The Update Rule</h3>
      <p>
        At each iteration, parameters are updated using the formula:
        θ = θ - α × ∇J(θ), where α is the learning rate and ∇J(θ) is the gradient.
      </p>

      <h2>Types of Gradient Descent</h2>
      <ul>
        <li><strong>Batch Gradient Descent:</strong> Uses the entire dataset for each update</li>
        <li><strong>Stochastic Gradient Descent:</strong> Uses one sample at a time</li>
        <li><strong>Mini-batch Gradient Descent:</strong> Uses a subset of samples</li>
      </ul>

      <h2>Key Considerations</h2>
      <p>
        Choosing the right learning rate is crucial. Too large and the algorithm may overshoot;
        too small and convergence will be slow.
      </p>
    </ArticlePost>
  );
}
