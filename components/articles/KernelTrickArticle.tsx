import { ArticlePost } from "./article-post";

export default function KernelTrickArticle() {
  return (
    <ArticlePost
      title="Kernel Methods"
      author="Keval"
      description="Discover the kernel trick, a powerful technique that enables algorithms to operate in high-dimensional feature spaces without explicit computation."
      image={{
        src: "/article/other/kernel-trick.png",
        alt: "Kernel Trick Visualization",
      }}
    >
      <h2>Introduction</h2>
      <p>
        The kernel trick allows algorithms to learn non-linear patterns by implicitly
        mapping data to higher-dimensional spaces where linear separation is possible.
      </p>

      <h2>Why Kernels?</h2>
      <p>
        Some data is not linearly separable in its original space. By transforming
        it to a higher dimension, we can find a linear boundary that separates classes.
      </p>

      <h3>The Trick</h3>
      <p>
        Instead of explicitly computing the transformation, kernels compute the dot
        product directly in the high-dimensional space, making it computationally efficient.
      </p>

      <h2>Common Kernels</h2>
      <ul>
        <li><strong>Linear:</strong> K(x, y) = x · y (no transformation)</li>
        <li><strong>Polynomial:</strong> K(x, y) = (x · y + c)^d</li>
        <li><strong>RBF (Gaussian):</strong> K(x, y) = exp(-γ||x - y||²)</li>
        <li><strong>Sigmoid:</strong> K(x, y) = tanh(αx · y + c)</li>
      </ul>

      <h2>Applications</h2>
      <p>
        Kernels are used in SVMs, kernel PCA, Gaussian processes, and many other
        algorithms that benefit from non-linear transformations.
      </p>
    </ArticlePost>
  );
}
