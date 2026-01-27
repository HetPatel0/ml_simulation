"use client";

import { ArticlePost } from "./article-post";
import {
  CodeBlock,
  MathBlock,
  CalloutBox,
  AhaBox,
  SimulationLink,
} from "./components";

const manualCalculation = `import numpy as np

# Let's solve least squares from scratch!
# Data: 3 points
X = np.array([1, 2, 3])
y = np.array([2.1, 3.9, 6.2])  # y ≈ 2x (with some noise)

# Step 1: Calculate means
x_mean = np.mean(X)  # = 2
y_mean = np.mean(y)  # = 4.067

# Step 2: Calculate slope (m)
# m = Σ(x - x̄)(y - ȳ) / Σ(x - x̄)²
numerator = np.sum((X - x_mean) * (y - y_mean))
denominator = np.sum((X - x_mean) ** 2)
m = numerator / denominator

print(f"Slope calculation:")
print(f"  numerator = {numerator:.2f}")
print(f"  denominator = {denominator:.2f}")
print(f"  m = {m:.3f}")

# Step 3: Calculate intercept (b)
b = y_mean - m * x_mean

print(f"\\nIntercept: b = {b:.3f}")
print(f"\\nResult: y = {m:.3f}x + {b:.3f}")

# Verify with sklearn
from sklearn.linear_model import LinearRegression
model = LinearRegression()
model.fit(X.reshape(-1, 1), y)
print(f"\\nsklearn says: y = {model.coef_[0]:.3f}x + {model.intercept_:.3f}")`;

const matrixSolution = `import numpy as np

# The Matrix Approach (Normal Equations)
# β = (X^T X)^(-1) X^T y

# Data
X_raw = np.array([1, 2, 3, 4, 5])
y = np.array([2.1, 4.0, 5.8, 8.1, 9.9])

# Add column of 1s for intercept
X = np.column_stack([np.ones(len(X_raw)), X_raw])
print("Design matrix X:")
print(X)

# Step by step
print("\\nStep 1: X^T X")
XtX = X.T @ X
print(XtX)

print("\\nStep 2: (X^T X)^(-1)")
XtX_inv = np.linalg.inv(XtX)
print(XtX_inv)

print("\\nStep 3: X^T y")
Xty = X.T @ y
print(Xty)

print("\\nStep 4: β = (X^T X)^(-1) X^T y")
beta = XtX_inv @ Xty
print(f"β = {beta}")
print(f"\\nResult: y = {beta[1]:.3f}x + {beta[0]:.3f}")

# Verify
from sklearn.linear_model import LinearRegression
model = LinearRegression()
model.fit(X_raw.reshape(-1,1), y)
print(f"sklearn: y = {model.coef_[0]:.3f}x + {model.intercept_:.3f}")`;

const whySquared = `import numpy as np

# Why do we SQUARE the errors?

errors = np.array([-3, 2, -1, 2, 0])  # Some predictions are above, some below

# Method 1: Sum of errors (BAD!)
sum_errors = np.sum(errors)
print(f"Sum of errors: {sum_errors}")
print("Problem: Positive and negative cancel out! We could have huge errors but sum = 0")

# Method 2: Sum of absolute errors (OK)
sum_abs = np.sum(np.abs(errors))
print(f"\\nSum of |errors|: {sum_abs}")
print("Problem: No closed-form solution, harder to optimize")

# Method 3: Sum of squared errors (GOOD!)
sum_squared = np.sum(errors ** 2)
print(f"\\nSum of errors²: {sum_squared}")
print("Advantages:")
print("  1. All positive (no canceling)")
print("  2. Bigger errors penalized MORE (3² = 9, but 2² = 4)")
print("  3. Differentiable everywhere (good for optimization)")
print("  4. Has a beautiful closed-form solution!")`;

const multipleRegression = `import numpy as np
from sklearn.linear_model import LinearRegression

# Multiple regression: y = b₀ + b₁x₁ + b₂x₂ + ...

# Example: House price = f(sqft, bedrooms, age)
X = np.array([
    [1400, 3, 10],  # 1400 sqft, 3 bed, 10 years old
    [1600, 3, 15],
    [1700, 2, 5],
    [1875, 4, 8],
    [1100, 2, 20],
    [1550, 3, 12],
])
y = np.array([245000, 312000, 279000, 308000, 199000, 219000])

# Fit the model
model = LinearRegression()
model.fit(X, y)

# The model learned weights for each feature
print("Coefficients (in dollars):")
print(f"  sqft:     {model.coef_[0]:,.0f} per sqft")
print(f"  bedrooms: {model.coef_[1]:,.0f} per bedroom")
print(f"  age:      {model.coef_[2]:,.0f} per year (negative = older = cheaper)")
print(f"  intercept: {model.intercept_:,.0f}")

# Predict a new house
new_house = [[1500, 3, 8]]
price = model.predict(new_house)
print(f"\\nPredicted price for 1500sqft, 3bed, 8yr: {price[0]:,.0f}")`;

export default function LeastSquaresArticle() {
  return (
    <ArticlePost
      title="Least Squares: The 200-Year-Old Formula Running Your Models"
      author="Het Bhuva"
      description="Every time you fit a line to data, this elegant 200-year-old formula is doing the heavy lifting behind the scenes."
      image={{
        src: "/article/regression/least-squares.png",
        alt: "Least Squares Visualization",
      }}
    >
      <h2>What is Least Squares?</h2>
      <p>
        Least squares is the mathematical method for finding the &quot;best&quot; line through
        your data. &quot;Best&quot; means the line that minimizes the sum of squared differences
        between your predictions and the actual values.
      </p>
      <p>
        It&apos;s not just any method - it&apos;s THE method that powers linear regression,
        polynomial regression, and many other models.
      </p>

      <CalloutBox type="note" title="Historical Fun Fact">
        <p>
          Carl Friedrich Gauss invented least squares in 1795... at age 18!
          He used it to predict the orbit of the asteroid Ceres. When Ceres
          reappeared exactly where Gauss predicted, he became instantly famous.
          What were you doing at 18?
        </p>
      </CalloutBox>

      <h2>How Does It Actually Work?</h2>

      <h3>Step 1: Make Predictions</h3>
      <p>
        For each data point, calculate what your line predicts:
      </p>
      <MathBlock formula="\hat{y}_i = mx_i + b" />

      <h3>Step 2: Calculate Errors (Residuals)</h3>
      <p>
        The error for each point is the difference between actual and predicted:
      </p>
      <MathBlock formula="e_i = y_i - \hat{y}_i" />

      <h3>Step 3: Square the Errors</h3>
      <p>
        Squaring makes all errors positive and penalizes big errors more:
      </p>
      <MathBlock formula="e_i^2 = (y_i - \hat{y}_i)^2" />

      <h3>Step 4: Sum Them Up</h3>
      <p>
        Total error is the sum of all squared errors:
      </p>
      <MathBlock formula="SSE = \sum_{i=1}^{n}(y_i - \hat{y}_i)^2" />

      <h3>Step 5: Find the Minimum</h3>
      <p>
        Find the values of m and b that minimize this sum. Calculus gives us
        exact formulas!
      </p>

      <AhaBox>
        <p>
          Unlike gradient descent (which iterates to find the answer), least squares
          has a <strong>closed-form solution</strong> - a formula that directly computes
          the optimal m and b in one shot. No iterations, no guessing, just pure math!
        </p>
      </AhaBox>

      <h2>Why Squared Errors?</h2>
      <p>
        Why not just add up the errors? Or use absolute values? Great question!
      </p>
      <CodeBlock code={whySquared} language="python" title="Why Squaring Works" />

      <h2>The Magic Formulas</h2>

      <h3>For Simple Linear Regression (One Feature)</h3>
      <MathBlock formula="m = \frac{\sum_{i=1}^{n}(x_i - \bar{x})(y_i - \bar{y})}{\sum_{i=1}^{n}(x_i - \bar{x})^2}" />
      <MathBlock formula="b = \bar{y} - m\bar{x}" />

      <h3>For Multiple Features (Matrix Form)</h3>
      <p>
        When you have multiple features, the formula becomes beautifully compact:
      </p>
      <MathBlock formula="\boldsymbol{\beta} = (\mathbf{X}^T\mathbf{X})^{-1}\mathbf{X}^T\mathbf{y}" />
      <p>
        This gives you ALL the optimal coefficients in one matrix operation!
      </p>

      <CalloutBox type="tip" title="Intuition">
        <p>
          The slope formula asks: &quot;When X goes up, does Y tend to go up or down?&quot;
          It&apos;s measuring how X and Y move together (covariance) relative to how
          much X varies on its own (variance).
        </p>
      </CalloutBox>

      <h2>Worked Examples</h2>

      <h3>Manual Calculation</h3>
      <CodeBlock code={manualCalculation} language="python" title="Step-by-Step Least Squares" />

      <h3>Matrix Solution</h3>
      <CodeBlock code={matrixSolution} language="python" title="The Normal Equations" />

      <h3>Multiple Regression</h3>
      <CodeBlock code={multipleRegression} language="python" title="Multiple Features" />

      <h2>The Geometry (Optional But Cool)</h2>
      <p>
        If you take linear algebra, you&apos;ll learn that least squares has a beautiful
        geometric interpretation:
      </p>
      <ul>
        <li>Your target y is a vector in n-dimensional space</li>
        <li>Your predictions ŷ must lie in the &quot;column space&quot; of X</li>
        <li>Least squares finds the point in that space closest to y</li>
        <li>The residual vector (y - ŷ) is perpendicular to the column space</li>
      </ul>
      <p>
        This is why the formula involves X^T X - it&apos;s creating a projection matrix!
      </p>

      <h2>Where You&apos;ll Actually Use This</h2>
      <p>
        Least squares is the engine behind:
      </p>
      <ul>
        <li>
          <strong>Linear Regression:</strong> Every sklearn LinearRegression uses this
        </li>
        <li>
          <strong>Polynomial Regression:</strong> Same method, just with polynomial features
        </li>
        <li>
          <strong>Curve Fitting:</strong> scipy.optimize.curve_fit uses least squares
        </li>
        <li>
          <strong>Signal Processing:</strong> Noise reduction, trend extraction
        </li>
        <li>
          <strong>Computer Vision:</strong> Camera calibration, image stitching
        </li>
      </ul>

      <CalloutBox type="example" title="GPS Uses This">
        <p>
          Your phone&apos;s GPS uses least squares to estimate your position. It receives
          signals from multiple satellites with timing errors, and least squares finds
          the position that best fits all the noisy measurements.
        </p>
      </CalloutBox>

      <h2>Level Up: From Good to Great</h2>

      <h3>When Least Squares Struggles</h3>
      <ul>
        <li>
          <strong>Outliers:</strong> Squaring means one outlier can dominate.
          Try robust regression (Huber, RANSAC).
        </li>
        <li>
          <strong>Multicollinearity:</strong> When features are correlated,
          X^T X becomes nearly singular. Try Ridge regression.
        </li>
        <li>
          <strong>Too many features:</strong> Overfitting risk. Try Lasso (L1)
          for automatic feature selection.
        </li>
      </ul>

      <CalloutBox type="warning" title="Numerical Stability">
        <p>
          Never compute (X^T X)^(-1) directly in production code!
          It&apos;s numerically unstable. Use QR decomposition or sklearn instead.
          This is why we have libraries.
        </p>
      </CalloutBox>

      <h3>Alternatives to Know</h3>
      <ul>
        <li>
          <strong>Ridge Regression:</strong> Adds L2 penalty to prevent overfitting
        </li>
        <li>
          <strong>Lasso:</strong> Adds L1 penalty, can zero out features
        </li>
        <li>
          <strong>Gradient Descent:</strong> For huge datasets where matrix inversion is too slow
        </li>
      </ul>

      <h2>Now Go Play With It!</h2>
      <p>
        See least squares in action! Add points and watch the line adjust to
        minimize squared errors:
      </p>
      <SimulationLink
        simulationSlug="least-squares"
        description="Click to add points and watch the best-fit line update instantly"
      />

      <CalloutBox type="tip" title="Experiment">
        <p>
          Try adding an outlier (a point far from the others) and watch how much
          it pulls the line! That&apos;s because squaring the error makes big mistakes
          REALLY expensive. This is both a feature and a bug of least squares.
        </p>
      </CalloutBox>
    </ArticlePost>
  );
}
