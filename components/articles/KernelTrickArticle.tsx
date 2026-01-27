"use client";

import { ArticlePost } from "./article-post";
import {
  CodeBlock,
  MathBlock,
  CalloutBox,
  AhaBox,
  SimulationLink,
  ParameterTable,
} from "./components";

const kernelParams = [
  {
    name: "kernel",
    type: "str",
    default: "'rbf'",
    description: "Kernel type: 'linear', 'poly', 'rbf', 'sigmoid', 'precomputed'",
    impact: "RBF is the swiss army knife - flexible and usually works. Start there.",
  },
  {
    name: "gamma",
    type: "str/float",
    default: "'scale'",
    description: "Kernel coefficient for rbf, poly, sigmoid",
    impact: "Higher gamma = each point has smaller influence = more complex boundary",
  },
  {
    name: "degree",
    type: "int",
    default: "3",
    description: "Degree for polynomial kernel",
    impact: "Higher degree = can model more complex curves (but risk overfitting)",
  },
  {
    name: "coef0",
    type: "float",
    default: "0.0",
    description: "Independent term in poly and sigmoid kernels",
    impact: "Shifts the kernel - experiment to see the effect",
  },
];

const donutProblem = `import numpy as np
import matplotlib.pyplot as plt
from sklearn.svm import SVC
from sklearn.datasets import make_circles

# Generate the classic "donut" problem
# Inner circle = class 0, Outer ring = class 1
X, y = make_circles(n_samples=200, factor=0.3, noise=0.1, random_state=42)

print("The donut problem: inner circle vs outer ring")
print(f"Shape: {X.shape}")
print(f"Classes: {np.unique(y)}")

# Try to separate with a LINEAR classifier
linear_svc = SVC(kernel='linear')
linear_svc.fit(X, y)
linear_acc = linear_svc.score(X, y)
print(f"\\nLinear SVM accuracy: {linear_acc:.2%}")
# Spoiler: it's terrible! ~50% (random guessing)

# Now use RBF kernel
rbf_svc = SVC(kernel='rbf', gamma='scale')
rbf_svc.fit(X, y)
rbf_acc = rbf_svc.score(X, y)
print(f"RBF kernel SVM accuracy: {rbf_acc:.2%}")
# Much better! Near 100%`;

const kernelMath = `import numpy as np

# Three common kernels and what they compute

def linear_kernel(x1, x2):
    """Just the dot product - no transformation"""
    return np.dot(x1, x2)

def polynomial_kernel(x1, x2, degree=3, coef0=1):
    """Maps to polynomial feature space"""
    return (np.dot(x1, x2) + coef0) ** degree

def rbf_kernel(x1, x2, gamma=0.5):
    """Maps to INFINITE dimensional space! (Gaussian)"""
    distance_sq = np.sum((x1 - x2) ** 2)
    return np.exp(-gamma * distance_sq)

# Example with two 2D points
x1 = np.array([1, 2])
x2 = np.array([3, 4])

print("Kernel values between [1,2] and [3,4]:")
print(f"Linear:     {linear_kernel(x1, x2):.4f}")
print(f"Polynomial: {polynomial_kernel(x1, x2):.4f}")
print(f"RBF:        {rbf_kernel(x1, x2):.4f}")

# The magic: these values are the same as dot products
# in the transformed space - without ever computing the transformation!`;

const practicalExample = `import numpy as np
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import classification_report

# Generate XOR-like data (not linearly separable)
np.random.seed(42)
n_samples = 200

# Create 4 clusters in XOR pattern
X1 = np.random.randn(n_samples//4, 2) + np.array([1, 1])
X2 = np.random.randn(n_samples//4, 2) + np.array([-1, -1])
X3 = np.random.randn(n_samples//4, 2) + np.array([1, -1])
X4 = np.random.randn(n_samples//4, 2) + np.array([-1, 1])

X = np.vstack([X1, X2, X3, X4])
y = np.array([0]*(n_samples//4) + [0]*(n_samples//4) +
             [1]*(n_samples//4) + [1]*(n_samples//4))

# Split and scale
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Compare kernels
kernels = ['linear', 'poly', 'rbf']
for kernel in kernels:
    svc = SVC(kernel=kernel)
    svc.fit(X_train_scaled, y_train)
    acc = svc.score(X_test_scaled, y_test)
    print(f"{kernel:8s} kernel: {acc:.2%} accuracy")

# Tune RBF kernel
param_grid = {
    'C': [0.1, 1, 10, 100],
    'gamma': ['scale', 'auto', 0.1, 1, 10]
}

grid_search = GridSearchCV(SVC(kernel='rbf'), param_grid, cv=5)
grid_search.fit(X_train_scaled, y_train)

print(f"\\nBest RBF params: {grid_search.best_params_}")
print(f"Best cross-val score: {grid_search.best_score_:.2%}")`;

export default function KernelTrickArticle() {
  return (
    <ArticlePost
      title="The Kernel Trick: Mathematical Teleportation"
      author="Het Bhuva"
      description="What if you could solve impossible problems by pretending they exist in a different dimension? No, this isn't Inception - it's the kernel trick."
      image={{
        src: "/article/other/kernel-trick.png",
        alt: "Kernel Trick Visualization",
      }}
    >
      <h2>What is the Kernel Trick?</h2>
      <p>
        Some data is impossible to separate with a straight line. Imagine a bullseye:
        inner circle is class A, outer ring is class B. No matter how you draw a line,
        you can&apos;t separate them.
      </p>
      <p>
        The kernel trick says: &quot;What if we LIFT the data into a higher dimension where
        a flat plane CAN separate them?&quot; And here&apos;s the magic - we never actually
        compute that transformation. We use a mathematical shortcut instead.
      </p>

      <AhaBox>
        <p>
          The &quot;trick&quot; is that we can compute dot products in the high-dimensional space
          WITHOUT ever actually going there. It&apos;s like calculating the distance between
          two cities by looking at a map instead of actually traveling there.
        </p>
      </AhaBox>

      <h2>The Classic Problem: Donuts</h2>
      <CodeBlock code={donutProblem} language="python" title="The Donut Problem" />

      <h3>Why Linear Fails</h3>
      <p>
        A straight line can only divide the plane into two regions. When one class is
        SURROUNDED by another (like a donut), no line can separate them.
      </p>

      <h3>The Solution: Go Up!</h3>
      <p>
        What if we add a new dimension: z = x² + y² (distance from center)?
      </p>
      <ul>
        <li>Inner circle points have small z (they&apos;re close to center)</li>
        <li>Outer ring points have large z (they&apos;re far from center)</li>
        <li>Now a flat plane at some z = threshold perfectly separates them!</li>
      </ul>

      <h2>How Does It Actually Work?</h2>

      <h3>Step 1: The Problem</h3>
      <p>
        Data isn&apos;t linearly separable in the original space.
      </p>

      <h3>Step 2: Transform to Higher Dimensions</h3>
      <p>
        Map each point x to a new space using a function φ(x):
      </p>
      <MathBlock formula="\phi: \mathbb{R}^n \rightarrow \mathbb{R}^m \text{ where } m \gg n" />

      <h3>Step 3: Find Linear Separator in High Dimensions</h3>
      <p>
        In the high-dimensional space, use a linear classifier (hyperplane).
      </p>

      <h3>Step 4: The Trick!</h3>
      <p>
        Instead of computing φ(x), use a kernel function K that directly computes
        the dot product in the transformed space:
      </p>
      <MathBlock formula="K(x_1, x_2) = \phi(x_1) \cdot \phi(x_2)" />

      <CalloutBox type="tip" title="Why This Matters">
        <p>
          For some kernels (like RBF), the transformed space is INFINITE dimensional.
          We can&apos;t actually compute φ(x) - there would be infinite features!
          But we CAN compute the kernel function, which gives us the same answer.
        </p>
      </CalloutBox>

      <h2>Common Kernels Explained</h2>

      <h3>Linear Kernel</h3>
      <MathBlock formula="K(x_1, x_2) = x_1 \cdot x_2" />
      <p>No transformation at all. Just the regular dot product. Use this for linearly separable data.</p>

      <h3>Polynomial Kernel</h3>
      <MathBlock formula="K(x_1, x_2) = (x_1 \cdot x_2 + c)^d" />
      <p>
        Creates polynomial features. Degree d controls complexity. For example, degree 2
        adds features like x₁², x₂², x₁x₂.
      </p>

      <h3>RBF (Gaussian) Kernel</h3>
      <MathBlock formula="K(x_1, x_2) = \exp(-\gamma ||x_1 - x_2||^2)" />
      <p>
        The most popular kernel. Maps to infinite dimensions! Gamma controls the
        &quot;reach&quot; of each training point.
      </p>

      <CalloutBox type="note" title="Mind-Blowing Fact">
        <p>
          The RBF kernel corresponds to an INFINITE dimensional feature space.
          We&apos;re effectively computing dot products in infinite dimensions using
          just a simple exponential formula. That&apos;s the real magic!
        </p>
      </CalloutBox>

      <CodeBlock code={kernelMath} language="python" title="Kernel Computations" />

      <h2>The Knobs and Dials You Can Tweak</h2>
      <ParameterTable parameters={kernelParams} />

      <h3>Gamma: The Most Important RBF Parameter</h3>
      <ul>
        <li>
          <strong>High gamma:</strong> Each point has a small sphere of influence.
          Decision boundary becomes very complex (might overfit).
        </li>
        <li>
          <strong>Low gamma:</strong> Each point influences a large area.
          Decision boundary is smoother (might underfit).
        </li>
        <li>
          <strong>&apos;scale&apos; (default):</strong> Uses 1 / (n_features × variance).
          Usually a good starting point.
        </li>
      </ul>

      <h2>Where You&apos;ll Actually Use This</h2>
      <ul>
        <li>
          <strong>SVM Classification:</strong> The most common use - non-linear classification
        </li>
        <li>
          <strong>Kernel PCA:</strong> Non-linear dimensionality reduction
        </li>
        <li>
          <strong>Gaussian Processes:</strong> For probabilistic regression and classification
        </li>
        <li>
          <strong>Image recognition:</strong> Comparing image features with RBF kernels
        </li>
      </ul>

      <CalloutBox type="example" title="Face Recognition">
        <p>
          Early face recognition systems used RBF kernel SVMs. The kernel helped
          capture complex relationships between pixel values that simple linear
          classifiers couldn&apos;t see.
        </p>
      </CalloutBox>

      <h2>Let&apos;s Build Something</h2>
      <CodeBlock code={practicalExample} language="python" title="XOR Classification with Kernels" />

      <h2>Level Up: From Good to Great</h2>

      <h3>Choosing the Right Kernel</h3>
      <ul>
        <li>
          <strong>Start with RBF</strong> - It&apos;s flexible and works in most cases
        </li>
        <li>
          <strong>Try linear first</strong> - If it works, you don&apos;t need the complexity
        </li>
        <li>
          <strong>Polynomial</strong> - When you suspect polynomial relationships
        </li>
        <li>
          <strong>Custom kernels</strong> - For domain-specific similarity measures
        </li>
      </ul>

      <CalloutBox type="warning" title="The Gamma Trap">
        <p>
          High gamma makes RBF kernels memorize training data instead of learning patterns.
          Your training accuracy will be 100% but test accuracy will tank.
          Always validate with held-out data!
        </p>
      </CalloutBox>

      <h3>When Kernels Struggle</h3>
      <ul>
        <li>
          <strong>Large datasets:</strong> Kernel methods don&apos;t scale well (O(n²) or O(n³))
        </li>
        <li>
          <strong>High-dimensional sparse data:</strong> Text, for example - linear often works fine
        </li>
        <li>
          <strong>Deep patterns:</strong> Neural networks might capture hierarchical features better
        </li>
      </ul>

      <h2>Now Go Play With It!</h2>
      <p>
        See the kernel trick in action! Watch data transform from inseparable
        chaos to beautifully separated classes:
      </p>
      <SimulationLink
        simulationSlug="kernel-trick"
        description="See data lift from 2D to 3D and watch a plane separate the classes"
      />

      <CalloutBox type="tip" title="Visualization Challenge">
        <p>
          In the simulation, pay attention to how the inner circle becomes &quot;low&quot;
          and the outer ring becomes &quot;high&quot; when you apply the transformation.
          That&apos;s the kernel trick making the impossible possible!
        </p>
      </CalloutBox>
    </ArticlePost>
  );
}
