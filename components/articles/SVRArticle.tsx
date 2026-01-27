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

const svrParams = [
  {
    name: "kernel",
    type: "str",
    default: "'rbf'",
    description: "Kernel type: 'linear', 'poly', 'rbf', 'sigmoid'",
    impact: "RBF is flexible and works most of the time. Start there.",
  },
  {
    name: "C",
    type: "float",
    default: "1.0",
    description: "Regularization parameter (penalty for errors)",
    impact: "Higher C = angrier about errors = tighter fit. Lower C = more chill.",
  },
  {
    name: "epsilon",
    type: "float",
    default: "0.1",
    description: "Width of the epsilon-insensitive tube",
    impact: "Larger epsilon = more tolerance for errors = simpler model.",
  },
  {
    name: "gamma",
    type: "str/float",
    default: "'scale'",
    description: "Kernel coefficient for RBF, poly, sigmoid",
    impact: "Higher gamma = more wiggly. 'scale' usually works well.",
  },
  {
    name: "degree",
    type: "int",
    default: "3",
    description: "Degree of polynomial kernel",
    impact: "Only matters if kernel='poly'. Higher = more complex curves.",
  },
];

const basicSVRExample = `import numpy as np
from sklearn.svm import SVR
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score

# Generate some noisy sine wave data
np.random.seed(42)
X = np.linspace(0, 10, 100).reshape(-1, 1)
y = np.sin(X.ravel()) + np.random.randn(100) * 0.2  # sine + noise

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# IMPORTANT: SVR needs scaled data!
scaler_X = StandardScaler()
scaler_y = StandardScaler()

X_train_scaled = scaler_X.fit_transform(X_train)
X_test_scaled = scaler_X.transform(X_test)
y_train_scaled = scaler_y.fit_transform(y_train.reshape(-1, 1)).ravel()

# Create SVR with RBF kernel
svr = SVR(
    kernel='rbf',
    C=100,          # How much we hate errors
    epsilon=0.1,    # Tolerance zone width
    gamma='scale'   # RBF kernel spread
)

svr.fit(X_train_scaled, y_train_scaled)

# Predict and transform back
y_pred_scaled = svr.predict(X_test_scaled)
y_pred = scaler_y.inverse_transform(y_pred_scaled.reshape(-1, 1)).ravel()

print(f"R² Score: {r2_score(y_test, y_pred):.3f}")
print(f"RMSE: {np.sqrt(mean_squared_error(y_test, y_pred)):.3f}")
print(f"Support vectors: {svr.n_support_} (out of {len(X_train)} training points)")`;

const kernelComparison = `import numpy as np
from sklearn.svm import SVR
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import r2_score

# Generate quadratic data with noise
np.random.seed(42)
X = np.linspace(-3, 3, 100).reshape(-1, 1)
y = 0.5 * X.ravel()**2 + np.random.randn(100) * 0.5

# Scale
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Try different kernels
kernels = ['linear', 'poly', 'rbf']
for kernel in kernels:
    svr = SVR(kernel=kernel, C=100, epsilon=0.1)
    svr.fit(X_scaled, y)
    score = r2_score(y, svr.predict(X_scaled))
    n_sv = len(svr.support_)
    print(f"{kernel:8s}: R² = {score:.3f}, Support vectors: {n_sv}")

# Output:
# linear  : R² = 0.xxx, Support vectors: xx  ← Can't fit curves!
# poly    : R² = 0.xxx, Support vectors: xx  ← Decent for polynomial data
# rbf     : R² = 0.xxx, Support vectors: xx  ← Usually the best choice`;

const tuningExample = `from sklearn.svm import SVR
from sklearn.model_selection import GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
import numpy as np

# Your data here
X = np.random.randn(200, 2)
y = X[:, 0]**2 + X[:, 1] + np.random.randn(200) * 0.1

# Create pipeline (scaling + SVR)
pipeline = Pipeline([
    ('scaler', StandardScaler()),
    ('svr', SVR())
])

# Parameter grid to search
param_grid = {
    'svr__kernel': ['rbf', 'poly'],
    'svr__C': [0.1, 1, 10, 100],
    'svr__epsilon': [0.01, 0.1, 0.2],
    'svr__gamma': ['scale', 'auto', 0.1, 1]
}

# Grid search with cross-validation
grid_search = GridSearchCV(
    pipeline,
    param_grid,
    cv=5,
    scoring='r2',
    n_jobs=-1,
    verbose=1
)

grid_search.fit(X, y)

print(f"Best R²: {grid_search.best_score_:.3f}")
print(f"Best params: {grid_search.best_params_}")`;

export default function SVRArticle() {
  return (
    <ArticlePost
      title="Support Vector Regression: The Epsilon Tube of Chill"
      author="Het Bhuva"
      description="What if your regression model could ignore small errors and only freak out about the big ones? Enter SVR."
      image={{
        src: "/article/regression/svr.png",
        alt: "Support Vector Regression Visualization",
      }}
    >
      <h2>What is Support Vector Regression?</h2>
      <p>
        Most regression models try to minimize ALL errors. SVR takes a different approach:
        it creates a &quot;tube&quot; around the prediction line and says &quot;errors inside this tube?
        I don&apos;t care. Only penalize me for the points that fall outside.&quot;
      </p>
      <p>
        This makes SVR robust to noise and gives it a unique superpower: it only uses
        the most important data points (support vectors) to make predictions.
      </p>

      <AhaBox>
        <p>
          The name &quot;support vector&quot; makes sense when you visualize it: imagine the
          epsilon tube is a tent, and the support vectors are the poles holding it up.
          Only the points at the edges matter - everything inside is just along for the ride!
        </p>
      </AhaBox>

      <h2>How Does It Actually Work?</h2>

      <h3>Step 1: Draw the Prediction Line</h3>
      <p>
        Start with a regression function that predicts y given x.
      </p>

      <h3>Step 2: Create the Epsilon Tube</h3>
      <p>
        Draw a &quot;buffer zone&quot; of width ε (epsilon) above and below the line.
        This is your tolerance zone.
      </p>

      <h3>Step 3: Find the Support Vectors</h3>
      <p>
        Points INSIDE the tube? No penalty. Points OUTSIDE the tube? They become
        &quot;support vectors&quot; and contribute to the loss function.
      </p>

      <h3>Step 4: Optimize</h3>
      <p>
        Find the line (and its orientation) that minimizes errors while keeping
        the tube as flat as possible.
      </p>

      <h2>The Math (Actually Pretty Elegant)</h2>

      <h3>The Epsilon-Insensitive Loss</h3>
      <p>
        For each point, the loss is:
      </p>
      <MathBlock formula="L_\epsilon(y, f(x)) = \begin{cases} 0 & \text{if } |y - f(x)| \leq \epsilon \\ |y - f(x)| - \epsilon & \text{otherwise} \end{cases}" />

      <p>
        In plain English:
      </p>
      <ul>
        <li>Error ≤ ε? Loss = 0 (&quot;Close enough, no penalty&quot;)</li>
        <li>Error &gt; ε? Loss = how far outside the tube you are</li>
      </ul>

      <h3>The Optimization Objective</h3>
      <MathBlock formula="\text{minimize } \frac{1}{2}||w||^2 + C\sum_{i=1}^{n}(\xi_i + \xi_i^*)" />
      <p>
        Where w is the weight vector (we want it small for a flat line),
        and ξ (xi) are the slack variables for points outside the tube.
      </p>

      <CalloutBox type="tip" title="C and Epsilon Trade-off">
        <p>
          <strong>High C:</strong> &quot;I HATE errors!&quot; - Tighter fit, might overfit<br />
          <strong>Low C:</strong> &quot;Errors happen, whatever&quot; - Simpler model, might underfit<br /><br />
          <strong>Large ε:</strong> &quot;I&apos;m very tolerant&quot; - Fewer support vectors, simpler<br />
          <strong>Small ε:</strong> &quot;I want precision!&quot; - More support vectors, tighter fit
        </p>
      </CalloutBox>

      <h2>The Kernel Trick in SVR</h2>
      <p>
        SVR can fit curves (not just straight lines) using the kernel trick!
        Different kernels let you fit different shapes:
      </p>
      <ul>
        <li><strong>Linear:</strong> Straight lines only</li>
        <li><strong>Polynomial:</strong> Polynomial curves (degree controls complexity)</li>
        <li><strong>RBF (Gaussian):</strong> Flexible, can fit almost anything</li>
      </ul>

      <CodeBlock code={kernelComparison} language="python" title="Kernel Comparison" />

      <h2>The Knobs and Dials You Can Tweak</h2>
      <ParameterTable parameters={svrParams} />

      <CalloutBox type="warning" title="SVR Needs Scaled Data!">
        <p>
          SVR is VERY sensitive to feature scales. If you forget to scale your data,
          you&apos;ll get terrible results. Always use StandardScaler or similar before
          training. This isn&apos;t optional!
        </p>
      </CalloutBox>

      <h2>Where You&apos;ll Actually Use This</h2>
      <ul>
        <li>
          <strong>Time series forecasting:</strong> Stock prices, weather, where small
          daily fluctuations shouldn&apos;t affect the model
        </li>
        <li>
          <strong>Noisy data:</strong> When your measurements have inherent noise
          and you want to find the underlying trend
        </li>
        <li>
          <strong>Small datasets:</strong> SVR works well with limited data
          (unlike neural networks)
        </li>
        <li>
          <strong>Non-linear relationships:</strong> When you need to fit curves
          but don&apos;t want to guess the polynomial degree
        </li>
      </ul>

      <CalloutBox type="example" title="Predicting Stock Volatility">
        <p>
          Financial analysts use SVR to predict stock price movements. The epsilon
          tube naturally handles the daily noise in stock prices, focusing only
          on significant movements.
        </p>
      </CalloutBox>

      <h2>Let&apos;s Build Something</h2>
      <CodeBlock code={basicSVRExample} language="python" title="SVR for Sine Wave Prediction" />

      <h3>Hyperparameter Tuning</h3>
      <p>
        SVR has several important parameters. Grid search is your friend:
      </p>
      <CodeBlock code={tuningExample} language="python" title="Grid Search for Best Parameters" />

      <h2>Level Up: From Good to Great</h2>

      <h3>Common Gotchas</h3>
      <ul>
        <li>
          <strong>Terrible predictions?</strong> Did you scale your data? (Probably not)
        </li>
        <li>
          <strong>Training takes forever?</strong> SVR doesn&apos;t scale well to large datasets.
          Try LinearSVR for big data.
        </li>
        <li>
          <strong>Too many support vectors?</strong> Increase epsilon or decrease C.
        </li>
      </ul>

      <CalloutBox type="tip" title="When to Use SVR vs Other Regression">
        <p>
          <strong>Use SVR when:</strong> You have noise, small-medium data, non-linear patterns<br />
          <strong>Use Linear Regression when:</strong> Simple linear relationships, interpretability needed<br />
          <strong>Use Random Forest when:</strong> Large datasets, many features, speed matters
        </p>
      </CalloutBox>

      <h2>Now Go Play With It!</h2>
      <p>
        See the epsilon tube in action! Adjust the parameters and watch how
        the model changes:
      </p>
      <SimulationLink
        simulationSlug="svr-visualizer"
        description="Experiment with C, epsilon, and kernel type to see their effects"
      />
      <SimulationLink
        simulationSlug="svr-kernel-lift"
        description="Visualize how kernels lift data into higher dimensions"
      />
    </ArticlePost>
  );
}
