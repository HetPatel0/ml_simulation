import { ArticlePost } from "./article-post";

export default function LeastSquaresArticle() {
  return (
    <ArticlePost
      title="Least Squares Method"
      author="Keval"
      description="Learn about the least squares method, the mathematical foundation for finding the best-fitting line in regression analysis."
    >
      <h2>Introduction</h2>
      <p>
        The method of least squares is a standard approach to find the best fit
        for a set of data by minimizing the sum of squared residuals.
      </p>

      <h2>What Are Residuals?</h2>
      <p>
        A residual is the difference between an observed value and the predicted value.
        Squaring these differences ensures all values are positive and penalizes larger errors more.
      </p>

      <h3>The Objective</h3>
      <p>
        Minimize: Σ(yᵢ - ŷᵢ)² where yᵢ is the actual value and ŷᵢ is the predicted value.
        This gives us the line that best represents the overall trend in the data.
      </p>

      <h2>Solving Least Squares</h2>
      <ul>
        <li><strong>Normal Equations:</strong> Direct closed-form solution</li>
        <li><strong>Gradient Descent:</strong> Iterative optimization approach</li>
        <li><strong>QR Decomposition:</strong> Numerically stable method</li>
      </ul>

      <h2>Why Squared Errors?</h2>
      <p>
        Squared errors are differentiable, give more weight to outliers, and result
        in a convex optimization problem with a unique solution.
      </p>
    </ArticlePost>
  );
}
