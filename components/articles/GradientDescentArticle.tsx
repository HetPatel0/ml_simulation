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

const sgdParams = [
  {
    name: "learning_rate",
    type: "float",
    default: "0.01",
    description: "Step size for each iteration",
    impact: "Too high = overshoot and diverge. Too low = takes forever to converge.",
  },
  {
    name: "max_iter",
    type: "int",
    default: "1000",
    description: "Maximum number of iterations",
    impact: "Increase if not converging. But watch for overfitting!",
  },
  {
    name: "tol",
    type: "float",
    default: "1e-3",
    description: "Stopping tolerance for convergence",
    impact: "Lower = more precision, but longer training time",
  },
  {
    name: "eta0",
    type: "float",
    default: "0.01",
    description: "Initial learning rate for some schedules",
    impact: "Starting point for adaptive learning rate methods",
  },
];

const manualGDExample = `import numpy as np

# Let's find the minimum of f(x) = x² (spoiler: it's x=0)
def f(x):
    return x ** 2

def gradient(x):
    return 2 * x  # derivative of x² is 2x

# Gradient Descent from scratch
x = 4.0              # Start somewhere random
learning_rate = 0.1  # Step size
history = [x]        # Track our journey

for i in range(20):
    grad = gradient(x)                    # Which way is downhill?
    x = x - learning_rate * grad          # Take a step
    history.append(x)
    print(f"Step {i+1}: x = {x:.4f}, f(x) = {f(x):.6f}, gradient = {grad:.4f}")

print(f"\\nFinal answer: x = {x:.6f}")
print(f"True minimum: x = 0")`;

const sklearnSGDExample = `import numpy as np
from sklearn.linear_model import SGDRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split

# Generate some data
np.random.seed(42)
X = np.random.randn(1000, 5)  # 1000 samples, 5 features
true_weights = np.array([2.0, -1.5, 0.5, 1.0, -0.5])
y = X @ true_weights + np.random.randn(1000) * 0.5  # Add noise

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# IMPORTANT: Always scale features for SGD!
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Create and train SGD regressor
model = SGDRegressor(
    loss='squared_error',      # Use MSE loss (like regular linear regression)
    learning_rate='optimal',   # Adaptive learning rate
    max_iter=1000,
    tol=1e-3,
    random_state=42
)

model.fit(X_train_scaled, y_train)

print(f"R² Score: {model.score(X_test_scaled, y_test):.4f}")
print(f"Learned weights: {model.coef_}")
print(f"True weights: {true_weights}")
print(f"Iterations: {model.n_iter_}")`;

const learningRateComparison = `import numpy as np

def gradient_descent_demo(learning_rate, start_x=4.0, steps=20):
    """See how different learning rates affect convergence"""
    x = start_x
    f = lambda x: x ** 2
    grad = lambda x: 2 * x

    print(f"Learning rate: {learning_rate}")
    for i in range(steps):
        x = x - learning_rate * grad(x)
        if abs(x) > 1000:  # Diverged!
            print(f"  Step {i+1}: DIVERGED! x = {x:.2f}")
            return
    print(f"  Final x: {x:.6f}\\n")

# Try different learning rates
gradient_descent_demo(0.01)   # Too slow - barely moves
gradient_descent_demo(0.1)    # Just right - converges nicely
gradient_descent_demo(0.5)    # Aggressive - bounces around but converges
gradient_descent_demo(1.0)    # On the edge - oscillates forever
gradient_descent_demo(1.1)    # Too high - EXPLODES!`;

export default function GradientDescentArticle() {
  return (
    <ArticlePost
      title="Gradient Descent: The Engine Behind Machine Learning"
      author="Keval Kansagra"
      description="Imagine you're blindfolded on a mountain and need to find the lowest valley. Your only superpower? You can feel which way is downhill."
      image={{
        src: "/article/regression/gradient-descent.png",
        alt: "Gradient Descent Visualization",
      }}
    >
      <h2>What is Gradient Descent?</h2>
      <p>
        Picture this: you&apos;re dropped blindfolded on a hilly landscape. Your goal is to
        find the lowest point. What do you do? You feel the ground with your feet,
        figure out which direction goes downhill, and take a step that way. Repeat
        until you can&apos;t go any lower.
      </p>
      <p>
        That&apos;s gradient descent in a nutshell - it&apos;s how machine learning models
        &quot;learn&quot; by iteratively adjusting their parameters to minimize errors.
      </p>

      <CalloutBox type="note" title="Fun Fact">
        <p>
          Gradient descent was first proposed by Cauchy in 1847! It took over 150 years
          for computers to become powerful enough to make it the backbone of modern AI.
        </p>
      </CalloutBox>

      <h2>How Does It Actually Work?</h2>
      <p>
        Let&apos;s break down the algorithm step by step:
      </p>

      <h3>Step 1: Start Somewhere Random</h3>
      <p>
        Initialize your parameters (weights) with random values. You have to start
        somewhere, and random is as good as anything when you don&apos;t know the answer.
      </p>

      <h3>Step 2: Calculate the Cost</h3>
      <p>
        How wrong are your current predictions? The cost function (like Mean Squared Error)
        gives you a single number representing your total wrongness.
      </p>

      <h3>Step 3: Find the Slope (Gradient)</h3>
      <p>
        The gradient tells you which direction is &quot;downhill.&quot; Mathematically,
        it&apos;s the derivative of the cost function with respect to each parameter.
      </p>
      <MathBlock formula="\nabla J(\theta) = \frac{\partial J}{\partial \theta}" />

      <h3>Step 4: Take a Step Downhill</h3>
      <p>
        Update your parameters by moving in the opposite direction of the gradient:
      </p>
      <MathBlock formula="\theta_{new} = \theta_{old} - \alpha \cdot \nabla J(\theta)" />
      <p>
        Where α (alpha) is the <strong>learning rate</strong> - how big of a step you take.
      </p>

      <h3>Step 5: Repeat Until You&apos;re Happy</h3>
      <p>
        Keep iterating until the cost stops decreasing (convergence) or you hit your
        maximum number of iterations.
      </p>

      <AhaBox>
        <p>
          The gradient always points UPHILL (toward increasing values). That&apos;s why we
          SUBTRACT it - we want to go downhill to minimize the cost!
        </p>
      </AhaBox>

      <h2>The Math (Don&apos;t Skip This - It&apos;s Actually Cool)</h2>
      <p>
        Let&apos;s work through a concrete example. We want to minimize f(x) = x²
        (a simple parabola - the minimum is obviously at x=0, but let&apos;s pretend we don&apos;t know that).
      </p>

      <h3>The Derivative</h3>
      <p>
        The derivative of x² is 2x. This tells us the slope at any point:
      </p>
      <ul>
        <li>At x=4: gradient = 2(4) = 8 → steep uphill to the right</li>
        <li>At x=1: gradient = 2(1) = 2 → gentle uphill to the right</li>
        <li>At x=0: gradient = 2(0) = 0 → flat! We found the minimum!</li>
        <li>At x=-2: gradient = 2(-2) = -4 → uphill to the left</li>
      </ul>

      <h3>Worked Example with Numbers</h3>
      <CodeBlock
        code={`# Goal: minimize f(x) = x²
# Start: x = 4, learning_rate = 0.1
# Gradient: f'(x) = 2x

Step 1: gradient = 2(4) = 8
        x = 4 - 0.1(8) = 3.2

Step 2: gradient = 2(3.2) = 6.4
        x = 3.2 - 0.1(6.4) = 2.56

Step 3: gradient = 2(2.56) = 5.12
        x = 2.56 - 0.1(5.12) = 2.048

Step 4: gradient = 2(2.048) = 4.096
        x = 2.048 - 0.1(4.096) = 1.6384

# ... keeps going ...

Step 20: x ≈ 0.0115
Step 50: x ≈ 0.00003

# Eventually converges to x = 0 (the minimum!)`}
        language="python"
        title="Manual Calculation"
      />

      <h2>The Learning Rate: Most Important Hyperparameter</h2>
      <p>
        The learning rate (α) is like your step size when walking down that hill:
      </p>

      <CalloutBox type="warning" title="Learning Rate Disasters">
        <p>
          <strong>Too high:</strong> You&apos;ll overshoot the valley and end up on the other
          side, then overshoot again, bouncing back and forth until you fly off to infinity.
          <br /><br />
          <strong>Too low:</strong> You&apos;ll inch along so slowly that you&apos;ll run out of
          patience (or compute budget) before reaching the minimum.
        </p>
      </CalloutBox>

      <CodeBlock
        code={learningRateComparison}
        language="python"
        title="Learning Rate Comparison"
      />

      <h2>Types of Gradient Descent</h2>
      <p>
        When training on large datasets, computing the gradient on ALL data points
        is expensive. Here are three variants:
      </p>

      <h3>1. Batch Gradient Descent</h3>
      <p>
        Uses the ENTIRE dataset for each update. Accurate but slow and memory-hungry.
      </p>
      <MathBlock formula="\theta = \theta - \alpha \cdot \frac{1}{m}\sum_{i=1}^{m}\nabla J_i(\theta)" />

      <h3>2. Stochastic Gradient Descent (SGD)</h3>
      <p>
        Uses ONE random sample at a time. Fast and uses little memory, but noisy.
        The randomness can actually help escape local minima!
      </p>

      <h3>3. Mini-batch Gradient Descent</h3>
      <p>
        The Goldilocks approach - uses a small batch (typically 32-256 samples).
        Best of both worlds: reasonably accurate and reasonably fast.
      </p>

      <CalloutBox type="tip" title="Pro Tip">
        <p>
          In practice, almost everyone uses mini-batch gradient descent.
          A batch size of 32 is a common starting point.
        </p>
      </CalloutBox>

      <h2>The Knobs and Dials You Can Tweak</h2>
      <p>
        Here are the key parameters for sklearn&apos;s SGDRegressor:
      </p>
      <ParameterTable parameters={sgdParams} />

      <h2>Where You&apos;ll Actually Use This</h2>
      <p>
        Gradient descent is the optimization engine behind almost everything in ML:
      </p>
      <ul>
        <li><strong>Neural Networks:</strong> Backpropagation IS gradient descent</li>
        <li><strong>Large-scale regression:</strong> When data doesn&apos;t fit in memory</li>
        <li><strong>Online learning:</strong> When data arrives in streams</li>
        <li><strong>Deep learning:</strong> Adam, RMSprop are fancy versions of GD</li>
      </ul>

      <CalloutBox type="example" title="ChatGPT Uses This">
        <p>
          When training GPT models, OpenAI uses a variant called Adam optimizer
          (Adaptive Moment estimation) - which is essentially gradient descent
          with some clever tricks to adapt the learning rate automatically.
        </p>
      </CalloutBox>

      <h2>Let&apos;s Build Something</h2>
      <p>
        First, let&apos;s implement gradient descent from scratch to really understand it:
      </p>
      <CodeBlock code={manualGDExample} language="python" title="Gradient Descent from Scratch" />

      <h3>Using sklearn&apos;s SGDRegressor</h3>
      <p>
        In practice, you&apos;ll use sklearn&apos;s implementation. Here&apos;s how:
      </p>
      <CodeBlock code={sklearnSGDExample} language="python" title="SGDRegressor in Practice" />

      <h2>Level Up: From Good to Great</h2>

      <h3>Common Gotchas and How to Fix Them</h3>
      <ul>
        <li>
          <strong>Loss exploding to infinity?</strong> Learning rate is too high.
          Try reducing it by a factor of 10.
        </li>
        <li>
          <strong>Loss barely moving?</strong> Learning rate might be too low,
          OR you forgot to scale your features (SGD hates unscaled data!).
        </li>
        <li>
          <strong>Stuck in local minimum?</strong> Try adding momentum or switching
          to Adam optimizer.
        </li>
      </ul>

      <CalloutBox type="warning" title="Critical: Always Scale Your Features!">
        <p>
          Gradient descent is VERY sensitive to feature scales. If one feature
          ranges 0-1 and another 0-1000000, the gradients will be all over the place.
          Always use StandardScaler or similar before training.
        </p>
      </CalloutBox>

      <h3>Advanced Optimizers to Know</h3>
      <ul>
        <li>
          <strong>Momentum:</strong> Remembers previous gradients, like a ball
          rolling downhill
        </li>
        <li>
          <strong>RMSprop:</strong> Adapts learning rate per-parameter
        </li>
        <li>
          <strong>Adam:</strong> Combines momentum + RMSprop (most popular today)
        </li>
      </ul>

      <h2>Now Go Play With It!</h2>
      <p>
        The best way to understand gradient descent is to watch it in action.
        Try different learning rates and see what happens:
      </p>
      <SimulationLink
        simulationSlug="gradient-descent"
        description="Adjust the learning rate and watch the algorithm find the minimum in real-time"
      />

      <CalloutBox type="tip" title="Challenge">
        <p>
          Before clicking into the simulation, predict: what happens when you set
          the learning rate to 1.0 or higher? Then go test your hypothesis!
        </p>
      </CalloutBox>
    </ArticlePost>
  );
}
