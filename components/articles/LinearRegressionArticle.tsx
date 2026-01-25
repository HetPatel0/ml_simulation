import { ArticlePost } from "./article-post";

export default function LinearRegressionArticle() {
  return (
    <ArticlePost
      title="Linear Regression"
      author="Keval"
      description="Understand the fundamentals of linear regression, the simplest and most widely used statistical technique for predictive modeling."
      image={{
        src: "/article/regression/linear-regression.png",
        alt: "Linear Regression Visualization",
      }}
    >
      <h2>Introduction</h2>
      <p>
        Linear regression is a fundamental algorithm that models the relationship between
        a dependent variable and one or more independent variables by fitting a linear equation.
      </p>

      <h2>The Linear Model</h2>
      <p>
        The model assumes a linear relationship: y = mx + b, where m is the slope
        and b is the y-intercept. For multiple features, this extends to y = w₁x₁ + w₂x₂ + ... + b.
      </p>

      <h3>Finding the Best Fit</h3>
      <p>
        The goal is to find the line that minimizes the sum of squared differences
        between predicted and actual values. This is known as the least squares method.
      </p>

      <h2>Assumptions</h2>
      <ul>
        <li><strong>Linearity:</strong> The relationship between variables is linear</li>
        <li><strong>Independence:</strong> Observations are independent of each other</li>
        <li><strong>Homoscedasticity:</strong> Constant variance of residuals</li>
        <li><strong>Normality:</strong> Residuals are normally distributed</li>
      </ul>

      <h2>Applications</h2>
      <p>
        Linear regression is used in forecasting, trend analysis, and understanding
        relationships between variables across many fields.
      </p>
    </ArticlePost>
  );
}
