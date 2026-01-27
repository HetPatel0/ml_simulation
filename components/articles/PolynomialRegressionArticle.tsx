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

const polyParams = [
  {
    name: "degree",
    type: "int",
    default: "2",
    description: "The degree of polynomial features to generate",
    impact: "Higher = more flexible curves, but watch out for overfitting!",
  },
  {
    name: "include_bias",
    type: "bool",
    default: "True",
    description: "Include a bias column (all ones)",
    impact: "Usually set False if LinearRegression handles the intercept",
  },
  {
    name: "interaction_only",
    type: "bool",
    default: "False",
    description: "Only produce interaction features (x₁*x₂) without powers",
    impact: "Useful when you only care about how features interact",
  },
],

basicPolyExample = `import numpy as np
import matplotlib.pyplot as plt
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.pipeline import Pipeline

# Generate some curvy data (sin wave with noise)
np.random.seed(42)
X = np.linspace(0, 4, 50).reshape(-1, 1)
y = np.sin(X.ravel() * 1.5) + np.random.randn(50) * 0.2

# Create polynomial regression pipeline
# The secret: we're just transforming features, then using linear regression!
poly_model = Pipeline([
    ('poly_features', PolynomialFeatures(degree=4)),
    ('linear_reg', LinearRegression())
])

poly_model.fit(X, y)

# Make predictions
X_plot = np.linspace(0, 4, 100).reshape(-1, 1)
y_pred = poly_model.predict(X_plot)

print(f"R² Score: {poly_model.score(X, y):.3f}")
print(f"Coefficients: {poly_model.named_steps['linear_reg'].coef_}")`;

const overfittingDemo = `import numpy as np
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score

# Generate data: simple quadratic with noise
np.random.seed(42)
X = np.linspace(-3, 3, 30).reshape(-1, 1)
y = 0.5 * X.ravel()**2 + np.random.randn(30) * 0.5  # y = 0.5x² + noise

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Try different degrees and watch what happens
for degree in [1, 2, 5, 15]:
    poly = PolynomialFeatures(degree=degree)
    X_train_poly = poly.fit_transform(X_train)
    X_test_poly = poly.transform(X_test)

    model = LinearRegression()
    model.fit(X_train_poly, y_train)

    train_score = r2_score(y_train, model.predict(X_train_poly))
    test_score = r2_score(y_test, model.predict(X_test_poly))

    print(f"Degree {degree:2d}: Train R² = {train_score:.3f}, Test R² = {test_score:.3f}")

# Output shows:
# Degree  1: Train R² = 0.xxx, Test R² = 0.xxx  ← Underfitting
# Degree  2: Train R² = 0.xxx, Test R² = 0.xxx  ← Just right!
# Degree  5: Train R² = 0.xxx, Test R² = 0.xxx  ← Starting to overfit
# Degree 15: Train R² = 0.xxx, Test R² = 0.xxx  ← Overfitting disaster!`;

const featureTransformExample = `import numpy as np
from sklearn.preprocessing import PolynomialFeatures

# Original data: just one feature
X = np.array([[1], [2], [3], [4]])
print("Original X:")
print(X)

# Transform to degree 2
poly = PolynomialFeatures(degree=2, include_bias=False)
X_poly = poly.fit_transform(X)

print("\\nAfter polynomial transformation (degree=2):")
print(X_poly)
print(f"Feature names: {poly.get_feature_names_out()}")

# What happened?
# x=1 → [1, 1]   (x, x²)
# x=2 → [2, 4]   (x, x²)
# x=3 → [3, 9]   (x, x²)
# x=4 → [4, 16]  (x, x²)

# Now LinearRegression can find: y = a*x + b*x² + c
# which is a CURVE even though we're using LINEAR regression!`;

export default function PolynomialRegressionArticle() {
  return (
    <ArticlePost
      title="Polynomial Regression: When Straight Lines Aren't Enough"
      author="Keval Kansagra"
      description='Linear regression said "I can only draw straight lines." Polynomial regression said "Hold my beer."'
      image={{
        src: "/article/regression/polynomial-regression.png",
        alt: "Polynomial Regression Visualization",
      }}
    >
      <h2>What is Polynomial Regression?</h2>
      <p>
        Sometimes life isn&apos;t linear. The relationship between coffee consumed and
        productivity isn&apos;t a straight line - it&apos;s more like a curve that goes up,
        peaks, and then crashes down (we&apos;ve all been there).
      </p>
      <p>
        Polynomial regression lets you fit curves instead of straight lines by adding
        powers of your features (x², x³, etc.) to the model.
      </p>

      <AhaBox>
        <p>
          Here&apos;s the mind-bending secret: polynomial regression IS linear regression!
          We just transform our features first (add x², x³, etc.) and then apply
          regular old linear regression. The &quot;polynomial&quot; part is just feature engineering.
        </p>
      </AhaBox>

      <h2>How Does It Actually Work?</h2>

      <h3>Step 1: Transform Your Features</h3>
      <p>
        Take your original feature X and create new features: X², X³, X⁴, etc.
      </p>
      <CodeBlock code={featureTransformExample} language="python" title="Feature Transformation" />

      <h3>Step 2: Apply Linear Regression</h3>
      <p>
        Now run linear regression on these transformed features. The result is a curve!
      </p>
      <MathBlock formula="y = \beta_0 + \beta_1 x + \beta_2 x^2 + \beta_3 x^3 + \cdots + \beta_n x^n" />

      <h3>Step 3: The Model Finds the Coefficients</h3>
      <p>
        Linear regression finds the best values for β₀, β₁, β₂, etc. that minimize
        the squared errors - same as always!
      </p>

      <CalloutBox type="tip" title="Pro Tip">
        <p>
          Use sklearn&apos;s <code>Pipeline</code> to chain PolynomialFeatures and
          LinearRegression together. It keeps everything clean and prevents data leakage
          during cross-validation.
        </p>
      </CalloutBox>

      <h2>The Math (It&apos;s Simpler Than You Think)</h2>
      <p>
        Compare the equations:
      </p>
      <p><strong>Linear:</strong></p>
      <MathBlock formula="y = mx + b" />
      <p><strong>Quadratic (degree 2):</strong></p>
      <MathBlock formula="y = ax^2 + bx + c" />
      <p><strong>Cubic (degree 3):</strong></p>
      <MathBlock formula="y = ax^3 + bx^2 + cx + d" />
      <p>
        Each additional degree adds one more &quot;bend&quot; to the curve. Degree 1 = straight line.
        Degree 2 = one bend (parabola). Degree 3 = two bends (S-curve). And so on.
      </p>

      <h2>The Overfitting Trap</h2>
      <p>
        Here&apos;s where things get dangerous. Higher degree = more flexible curve.
        But too flexible and your model starts fitting the noise instead of the signal.
      </p>

      <CalloutBox type="warning" title="The Classic Blunder">
        <p>
          Cranking up the degree is like turning up the autotune - a little helps,
          but too much and it sounds ridiculous. Degree 15 on 20 data points?
          You&apos;ll get a squiggly mess that memorizes every point but predicts terribly.
        </p>
      </CalloutBox>

      <CodeBlock code={overfittingDemo} language="python" title="Overfitting Demo" />

      <h3>The Goldilocks Problem</h3>
      <ul>
        <li>
          <strong>Degree too low (underfitting):</strong> Model can&apos;t capture the curve.
          Both training AND test errors are high.
        </li>
        <li>
          <strong>Degree just right:</strong> Model captures the true pattern.
          Training and test errors are both low.
        </li>
        <li>
          <strong>Degree too high (overfitting):</strong> Model memorizes training data
          but fails on new data. Training error is tiny, test error is huge!
        </li>
      </ul>

      <h2>The Knobs and Dials You Can Tweak</h2>
      <ParameterTable parameters={polyParams} />

      <h2>Where You&apos;ll Actually Use This</h2>
      <ul>
        <li>
          <strong>Growth curves:</strong> Population, bacteria, or revenue that follows
          exponential-ish patterns
        </li>
        <li>
          <strong>Physical phenomena:</strong> Projectile motion, temperature changes
        </li>
        <li>
          <strong>Seasonal trends:</strong> Sales data with periodic patterns
        </li>
        <li>
          <strong>Dose-response curves:</strong> Medical and biological applications
        </li>
      </ul>

      <CalloutBox type="example" title="Real Talk: COVID Modeling">
        <p>
          During the pandemic, epidemiologists used polynomial regression (among other
          techniques) to model case growth. Linear models couldn&apos;t capture the
          exponential rises and eventual plateaus.
        </p>
      </CalloutBox>

      <h2>Let&apos;s Build Something</h2>
      <CodeBlock code={basicPolyExample} language="python" title="Polynomial Regression Pipeline" />

      <h2>Level Up: From Good to Great</h2>

      <h3>How to Choose the Right Degree</h3>
      <ul>
        <li>
          <strong>Use cross-validation:</strong> Try degrees 1-10 and pick the one
          with the best validation score
        </li>
        <li>
          <strong>Plot learning curves:</strong> If training error keeps dropping but
          validation error rises, you&apos;re overfitting
        </li>
        <li>
          <strong>Apply regularization:</strong> Ridge regression (L2) can prevent
          polynomial coefficients from exploding
        </li>
      </ul>

      <CalloutBox type="tip" title="Rule of Thumb">
        <p>
          Start with degree 2 or 3. Only go higher if you have a LOT of data and
          cross-validation actually shows improvement. Degree 10+ is almost never
          the right answer.
        </p>
      </CalloutBox>

      <h2>Now Go Play With It!</h2>
      <p>
        The best way to understand polynomial regression is to see the curve change
        as you adjust the degree. Drag points around and watch what happens!
      </p>
      <SimulationLink
        simulationSlug="polynomial-regression"
        description="Adjust the degree and watch the curve go from underfitting to overfitting"
      />

      <CalloutBox type="tip" title="Challenge">
        <p>
          In the simulation, try setting degree = (number of points - 1). What happens?
          The curve will pass through EVERY point perfectly - but is that a good thing?
        </p>
      </CalloutBox>
    </ArticlePost>
  );
}
