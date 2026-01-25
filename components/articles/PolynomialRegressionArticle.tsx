import { ArticlePost } from "./article-post";

export default function PolynomialRegressionArticle() {
  return (
    <ArticlePost
      title="Polynomial Regression"
      author="Keval"
      description="Explore how polynomial regression extends linear regression to capture non-linear relationships in your data."
      image={{
        src: "/article/regression/polynomial-regression.png",
        alt: "Polynomial Regression Visualization",
      }}
    >
      <h2>Introduction</h2>
      <p>
        Polynomial regression is an extension of linear regression that allows us to
        model non-linear relationships by adding polynomial terms to the equation.
      </p>

      <h2>The Polynomial Model</h2>
      <p>
        Instead of fitting a straight line, we fit a curve: y = w₀ + w₁x + w₂x² + w₃x³ + ...
        The degree of the polynomial determines the complexity of the curve.
      </p>

      <h3>Choosing the Degree</h3>
      <p>
        Higher degree polynomials can fit more complex patterns but risk overfitting.
        Cross-validation helps find the optimal degree for your data.
      </p>

      <h2>Overfitting vs Underfitting</h2>
      <ul>
        <li><strong>Underfitting:</strong> Model too simple to capture the pattern</li>
        <li><strong>Good fit:</strong> Model captures the underlying trend</li>
        <li><strong>Overfitting:</strong> Model fits noise instead of signal</li>
      </ul>

      <h2>When to Use</h2>
      <p>
        Use polynomial regression when you observe a curved relationship in your data
        that cannot be captured by a simple linear model.
      </p>
    </ArticlePost>
  );
}
