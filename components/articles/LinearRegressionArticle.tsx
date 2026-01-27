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

const sklearnParams = [
  {
    name: "fit_intercept",
    type: "bool",
    default: "True",
    description: "Calculate the intercept (b) for the model",
    impact: "Set False if your data is already centered around zero",
  },
  {
    name: "copy_X",
    type: "bool",
    default: "True",
    description: "Make a copy of X before fitting",
    impact: "Set False to save memory on huge datasets (but careful - X gets modified!)",
  },
  {
    name: "n_jobs",
    type: "int",
    default: "None",
    description: "Number of CPU cores to use for computation",
    impact: "Only matters for multi-target regression. -1 = use all cores",
  },
  {
    name: "positive",
    type: "bool",
    default: "False",
    description: "Force coefficients to be positive",
    impact: "Useful when negative relationships don't make sense (e.g., price vs. size)",
  },
];

const basicExample = `import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split

# The eternal struggle: less sleep = more coffee
sleep_hours = np.array([8, 6, 4, 7, 5, 3, 9, 2]).reshape(-1, 1)
coffees = np.array([1, 2, 4, 2, 3, 5, 1, 6])

# Split the data (always do this!)
X_train, X_test, y_train, y_test = train_test_split(
    sleep_hours, coffees, test_size=0.25, random_state=42
)

# Create and train the model - it's literally 2 lines
model = LinearRegression()
model.fit(X_train, y_train)

# What did the model learn?
print(f"Slope (m): {model.coef_[0]:.2f}")      # How much coffee changes per hour of sleep
print(f"Intercept (b): {model.intercept_:.2f}") # Coffee when sleep = 0 (yikes)
print(f"R² Score: {model.score(X_test, y_test):.2f}")  # How good is the fit?

# Make a prediction: what if I sleep 5.5 hours?
prediction = model.predict([[5.5]])
print(f"Predicted coffees for 5.5h sleep: {prediction[0]:.1f}")`;

const fullPipelineExample = `import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, r2_score

# Real-world example: Predicting house prices
# Features: square feet, bedrooms, age
data = {
    'sqft': [1400, 1600, 1700, 1875, 1100, 1550, 2350, 2450],
    'bedrooms': [3, 3, 2, 4, 2, 3, 4, 4],
    'age': [10, 15, 5, 8, 20, 12, 3, 5],
    'price': [245000, 312000, 279000, 308000, 199000, 219000, 405000, 324000]
}
df = pd.DataFrame(data)

# Prepare features and target
X = df[['sqft', 'bedrooms', 'age']]
y = df['price']

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42
)

# Scale features (good practice, though not strictly necessary for linear regression)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train model
model = LinearRegression()
model.fit(X_train_scaled, y_train)

# Evaluate
y_pred = model.predict(X_test_scaled)
print(f"R² Score: {r2_score(y_test, y_pred):.3f}")
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
print(f"RMSE: {rmse:,.0f}")

# Interpret coefficients (which features matter most?)
for feature, coef in zip(X.columns, model.coef_):
    print(f"{feature}: {coef:,.0f} per unit increase")`;

export default function LinearRegressionArticle() {
  return (
    <ArticlePost
      title="Linear Regression: Your First ML Superpower"
      author="Keval Kansagra"
      description="What if I told you that with just one line, you can predict house prices, exam scores, or how many tacos you'll eat based on your hunger level?"
      image={{
        src: "/article/regression/linear-regression.png",
        alt: "Linear Regression Visualization",
      }}
    >
      <h2>What is Linear Regression?</h2>
      <p>
        Think of linear regression as drawing the &quot;line of best fit&quot; through a scatter
        plot of your life decisions. Got data points scattered all over? Linear regression
        finds the straight line that gets as close as possible to all of them.
      </p>
      <p>
        It&apos;s the &quot;Hello World&quot; of machine learning - simple, powerful, and the foundation
        for understanding more complex algorithms. If you only learn one ML algorithm,
        make it this one.
      </p>

      <CalloutBox type="note" title="Fun Fact">
        <p>
          Linear regression was invented by Francis Galton in the 1880s to study how
          children&apos;s heights relate to their parents&apos;. He called it &quot;regression to the mean&quot;
          because tall parents tended to have slightly shorter children. The name stuck!
        </p>
      </CalloutBox>

      <h2>How Does It Actually Work?</h2>
      <p>
        Here&apos;s the process broken down into steps that actually make sense:
      </p>

      <h3>Step 1: Start with Data</h3>
      <p>
        You have pairs of (X, Y) values. X is what you know (hours studied),
        Y is what you want to predict (exam score).
      </p>

      <h3>Step 2: Assume a Linear Relationship</h3>
      <p>
        We bet that the relationship follows a straight line:
      </p>
      <MathBlock formula="y = mx + b" />
      <p>
        Where <strong>m</strong> is the slope (how steep the line is) and <strong>b</strong> is
        the y-intercept (where the line crosses the y-axis).
      </p>

      <h3>Step 3: Make Predictions</h3>
      <p>
        For each X value, calculate what Y would be using your current m and b guesses.
        These are your predictions (ŷ, pronounced &quot;y-hat&quot;).
      </p>

      <h3>Step 4: Measure How Wrong You Are</h3>
      <p>
        Compare each prediction to the actual value. The difference is called a &quot;residual&quot;
        or error. We square these errors (to make them all positive) and add them up.
      </p>
      <MathBlock formula="\text{Total Error} = \sum_{i=1}^{n}(y_i - \hat{y}_i)^2" />

      <h3>Step 5: Find the Best Line</h3>
      <p>
        Adjust m and b to make that total error as small as possible. This is the
        &quot;least squares&quot; method - we&apos;re minimizing squared errors.
      </p>

      <AhaBox>
        <p>
          Here&apos;s the cool part: there&apos;s a formula that directly computes the perfect
          m and b without any guessing! No iterations, no trial and error - just pure math
          giving us the optimal answer in one shot.
        </p>
      </AhaBox>

      <h2>The Math (Don&apos;t Skip This - It&apos;s Actually Cool)</h2>
      <p>
        For simple linear regression (one feature), the formulas for the optimal slope
        and intercept are:
      </p>
      <MathBlock formula="m = \frac{\sum(x_i - \bar{x})(y_i - \bar{y})}{\sum(x_i - \bar{x})^2}" />
      <MathBlock formula="b = \bar{y} - m\bar{x}" />
      <p>
        Where x̄ and ȳ are the means (averages) of X and Y.
      </p>

      <CalloutBox type="tip" title="Intuition Check">
        <p>
          The slope formula is basically asking: &quot;When X goes up, does Y go up too?&quot;
          If they move together, slope is positive. If X goes up while Y goes down,
          slope is negative.
        </p>
      </CalloutBox>

      <h3>Worked Example with Real Numbers</h3>
      <CodeBlock
        code={`# Data: (hours studied, exam score)
# (1, 2), (2, 4), (3, 5), (4, 4), (5, 5)

# Step 1: Calculate means
X = [1, 2, 3, 4, 5]
Y = [2, 4, 5, 4, 5]
X_mean = 3.0  # (1+2+3+4+5)/5
Y_mean = 4.0  # (2+4+5+4+5)/5

# Step 2: Calculate slope (m)
# numerator = sum of (x - x_mean) * (y - y_mean)
# = (1-3)(2-4) + (2-3)(4-4) + (3-3)(5-4) + (4-3)(4-4) + (5-3)(5-4)
# = (-2)(-2) + (-1)(0) + (0)(1) + (1)(0) + (2)(1)
# = 4 + 0 + 0 + 0 + 2 = 6

# denominator = sum of (x - x_mean)²
# = (-2)² + (-1)² + 0² + 1² + 2² = 4 + 1 + 0 + 1 + 4 = 10

m = 6 / 10  # = 0.6

# Step 3: Calculate intercept (b)
b = Y_mean - m * X_mean  # = 4 - 0.6 * 3 = 2.2

# Result: y = 0.6x + 2.2
# Prediction for x=6: y = 0.6(6) + 2.2 = 5.8`}
        language="python"
        title="Manual Calculation"
      />

      <h2>Is This the Right Tool for the Job?</h2>
      <p>Use linear regression when:</p>
      <ul>
        <li>
          <strong>The relationship looks linear</strong> - Plot your data first!
          If it looks like a curve, you might want polynomial regression instead.
        </li>
        <li>
          <strong>You need interpretable results</strong> - The coefficients tell you
          exactly how much Y changes when X changes by 1 unit.
        </li>
        <li>
          <strong>As a baseline model</strong> - Always try linear regression first.
          If it works well enough, why complicate things?
        </li>
        <li>
          <strong>For continuous predictions</strong> - Predicting numbers, not categories.
        </li>
      </ul>

      <CalloutBox type="warning" title="Rookie Mistake">
        <p>
          If your data looks like a banana, don&apos;t try to fit a ruler through it!
          Linear regression assumes linearity. Forcing it on curved data will give
          you terrible predictions and misleading coefficients.
        </p>
      </CalloutBox>

      <h2>The Knobs and Dials You Can Tweak</h2>
      <p>
        sklearn&apos;s <code>LinearRegression</code> is refreshingly simple - not many
        hyperparameters to tune. Here&apos;s what you can adjust:
      </p>
      <ParameterTable parameters={sklearnParams} />

      <h2>Where You&apos;ll Actually Use This</h2>

      <h3>Real-World Scenarios</h3>
      <ul>
        <li>
          <strong>Predicting house prices:</strong> Square footage, bedrooms, location → price
        </li>
        <li>
          <strong>Estimating salaries:</strong> Years of experience, education level → salary
        </li>
        <li>
          <strong>Forecasting sales:</strong> Advertising spend, season, price → units sold
        </li>
        <li>
          <strong>Medical dosing:</strong> Patient weight, age → medication dosage
        </li>
      </ul>

      <CalloutBox type="example" title="Netflix Uses This">
        <p>
          When Netflix predicts how long you&apos;ll watch a show, they might use linear
          regression as part of their system - combining factors like time of day,
          your watch history, and episode length.
        </p>
      </CalloutBox>

      <h2>Let&apos;s Build Something</h2>
      <p>
        Here&apos;s a simple example predicting coffee consumption based on sleep (we&apos;ve
        all been there):
      </p>
      <CodeBlock code={basicExample} language="python" title="Coffee vs. Sleep Predictor" />

      <h3>Full Pipeline: House Price Prediction</h3>
      <p>
        Here&apos;s a more realistic example with multiple features and proper evaluation:
      </p>
      <CodeBlock code={fullPipelineExample} language="python" title="House Price Predictor" />

      <h2>Level Up: From Good to Great</h2>

      <h3>Common Gotchas and How to Fix Them</h3>
      <ul>
        <li>
          <strong>Poor R² score?</strong> Try adding polynomial features or interaction
          terms. Maybe the relationship isn&apos;t purely linear.
        </li>
        <li>
          <strong>Coefficients seem wrong?</strong> Check for multicollinearity
          (features that are highly correlated with each other).
        </li>
        <li>
          <strong>Predictions way off for new data?</strong> You might be overfitting.
          Try regularization (Ridge or Lasso regression).
        </li>
      </ul>

      <CalloutBox type="tip" title="Pro Tip">
        <p>
          Always scale your features when using multiple variables with different units!
          A coefficient for &quot;square feet&quot; (thousands) vs &quot;bedrooms&quot; (single digits)
          will be misleading otherwise. Use <code>StandardScaler</code>.
        </p>
      </CalloutBox>

      <h3>When to Level Up to Something Else</h3>
      <ul>
        <li><strong>Curved relationships?</strong> → Polynomial Regression</li>
        <li><strong>Too many features?</strong> → Ridge/Lasso Regression</li>
        <li><strong>Outliers destroying your fit?</strong> → RANSAC or Huber Regression</li>
        <li><strong>Predicting categories?</strong> → Logistic Regression</li>
      </ul>

      <h2>Now Go Play With It!</h2>
      <p>
        The best way to understand linear regression is to see it in action.
        Add some points, watch the line adjust, and get a feel for how it works:
      </p>
      <SimulationLink
        simulationSlug="linear-regression"
        description="Click to add points and watch the regression line update in real-time"
      />
      <SimulationLink
        simulationSlug="least-squares"
        description="See how the least squares method minimizes errors visually"
      />
    </ArticlePost>
  );
}
