import { ArticlePost } from "./article-post";

export default function SVRArticle() {
  return (
    <ArticlePost
      title="Support Vector Regression"
      author="Keval"
      description="Learn about Support Vector Regression (SVR), a powerful technique that uses support vector machines for regression tasks."
      image={{
        src: "/article/regression/svr.png",
        alt: "Support Vector Regression Visualization",
      }}
    >
      <h2>Introduction</h2>
      <p>
        Support Vector Regression applies the principles of Support Vector Machines
        to regression problems, using an epsilon-insensitive loss function.
      </p>

      <h2>The Epsilon Tube</h2>
      <p>
        SVR fits a tube of width ε around the data. Points inside the tube incur no loss,
        while points outside are penalized based on their distance from the tube.
      </p>

      <h3>Support Vectors</h3>
      <p>
        Only the data points on or outside the epsilon tube boundary affect the model.
        These are called support vectors and define the regression function.
      </p>

      <h2>Key Parameters</h2>
      <ul>
        <li><strong>Epsilon (ε):</strong> Width of the insensitive tube</li>
        <li><strong>C:</strong> Regularization parameter controlling the trade-off</li>
        <li><strong>Kernel:</strong> Function to transform data (linear, RBF, polynomial)</li>
      </ul>

      <h2>Advantages</h2>
      <p>
        SVR is effective in high-dimensional spaces, robust to outliers within the tube,
        and can model non-linear relationships using kernel functions.
      </p>
    </ArticlePost>
  );
}
