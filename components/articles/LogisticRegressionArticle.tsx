import { ArticlePost } from "./article-post";

export default function LogisticRegressionArticle() {
  return (
    <ArticlePost
      title="Logistic Regression"
      author="Keval"
      description="Understand logistic regression, the go-to algorithm for binary classification problems in machine learning."
      image={{
        src: "/article/classification/logistic-regression.png",
        alt: "Logistic Regression Visualization",
      }}
    >
      <h2>Introduction</h2>
      <p>
        Despite its name, logistic regression is a classification algorithm used to
        predict the probability that an instance belongs to a particular class.
      </p>

      <h2>The Sigmoid Function</h2>
      <p>
        Logistic regression uses the sigmoid function to map any input to a value
        between 0 and 1: σ(z) = 1 / (1 + e^(-z)). This output represents a probability.
      </p>

      <h3>Decision Boundary</h3>
      <p>
        A threshold (typically 0.5) is used to convert probabilities into class predictions.
        The decision boundary is where the probability equals the threshold.
      </p>

      <h2>Cost Function</h2>
      <ul>
        <li><strong>Log Loss:</strong> Penalizes confident wrong predictions heavily</li>
        <li><strong>Convex:</strong> Guaranteed to find the global minimum</li>
        <li><strong>Optimized:</strong> Using gradient descent or other methods</li>
      </ul>

      <h2>Applications</h2>
      <p>
        Logistic regression is widely used in spam detection, disease diagnosis,
        credit scoring, and any binary classification task.
      </p>
    </ArticlePost>
  );
}
