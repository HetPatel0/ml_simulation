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

const logisticParams = [
  {
    name: "C",
    type: "float",
    default: "1.0",
    description: "Inverse of regularization strength (smaller = more regularization)",
    impact: "Confusing! Higher C = LESS regularization. Yes, everyone gets this backwards.",
  },
  {
    name: "penalty",
    type: "str",
    default: "'l2'",
    description: "Regularization type: 'l1', 'l2', 'elasticnet', or 'none'",
    impact: "L1 can zero out features (feature selection). L2 shrinks them.",
  },
  {
    name: "solver",
    type: "str",
    default: "'lbfgs'",
    description: "Optimization algorithm",
    impact: "lbfgs is great for small datasets. saga handles L1 and large data.",
  },
  {
    name: "max_iter",
    type: "int",
    default: "100",
    description: "Maximum iterations for solver",
    impact: "Increase if you get convergence warnings",
  },
  {
    name: "class_weight",
    type: "dict/str",
    default: "None",
    description: "Weight for each class or 'balanced' to auto-adjust",
    impact: "Use 'balanced' for imbalanced datasets (e.g., 95% vs 5% classes)",
  },
];

const basicExample = `import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, confusion_matrix

# Example: Will the student pass based on study hours?
study_hours = np.array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).reshape(-1, 1)
passed = np.array([0, 0, 0, 0, 1, 0, 1, 1, 1, 1])  # 0 = fail, 1 = pass

# Create and train the model
model = LogisticRegression()
model.fit(study_hours, passed)

# What did it learn?
print(f"Weight (w): {model.coef_[0][0]:.3f}")
print(f"Bias (b): {model.intercept_[0]:.3f}")

# Predict probabilities for new students
new_students = np.array([[4.5], [6], [8]])
probs = model.predict_proba(new_students)[:, 1]  # Probability of passing

for hours, prob in zip([4.5, 6, 8], probs):
    print(f"Study {hours}h → {prob*100:.1f}% chance of passing")`;

const realWorldExample = `import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, roc_auc_score

# Spam detection example (simplified)
# Features: word count, exclamation marks, caps ratio, links count
data = {
    'word_count': [50, 120, 30, 200, 45, 80, 150, 25, 90, 180],
    'exclamations': [0, 5, 0, 8, 1, 2, 10, 0, 1, 12],
    'caps_ratio': [0.02, 0.15, 0.01, 0.25, 0.03, 0.05, 0.30, 0.01, 0.04, 0.35],
    'links': [1, 5, 0, 8, 0, 2, 7, 0, 1, 10],
    'is_spam': [0, 1, 0, 1, 0, 0, 1, 0, 0, 1]  # Target
}
df = pd.DataFrame(data)

X = df.drop('is_spam', axis=1)
y = df['is_spam']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# Scale features (important for logistic regression!)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train model
model = LogisticRegression(random_state=42)
model.fit(X_train_scaled, y_train)

# Evaluate
y_pred = model.predict(X_test_scaled)
y_prob = model.predict_proba(X_test_scaled)[:, 1]

print("Classification Report:")
print(classification_report(y_test, y_pred))
print(f"ROC-AUC Score: {roc_auc_score(y_test, y_prob):.3f}")

# Which features matter most?
for feature, coef in zip(X.columns, model.coef_[0]):
    direction = "↑ spam" if coef > 0 else "↓ spam"
    print(f"{feature}: {coef:.3f} ({direction})")`;

const sigmoidExplanation = `# The sigmoid function in action
import numpy as np

def sigmoid(z):
    """Squish any number into 0-1 range"""
    return 1 / (1 + np.exp(-z))

# See how it works:
z_values = [-10, -5, -2, 0, 2, 5, 10]

for z in z_values:
    prob = sigmoid(z)
    print(f"z = {z:3d} → probability = {prob:.4f}")

# Output:
# z = -10 → probability = 0.0000  (definitely class 0)
# z =  -5 → probability = 0.0067  (almost certainly class 0)
# z =  -2 → probability = 0.1192  (probably class 0)
# z =   0 → probability = 0.5000  (on the fence!)
# z =   2 → probability = 0.8808  (probably class 1)
# z =   5 → probability = 0.9933  (almost certainly class 1)
# z =  10 → probability = 1.0000  (definitely class 1)`;

export default function LogisticRegressionArticle() {
  return (
    <ArticlePost
      title="Logistic Regression: The Classification Ninja"
      author="Keval Kansagra"
      description='Despite having "regression" in its name, this algorithm is secretly a classification superstar. Time to unmask the imposter!'
      image={{
        src: "/article/classification/logistic-regression.png",
        alt: "Logistic Regression Visualization",
      }}
    >
      <h2>What is Logistic Regression?</h2>
      <p>
        Confusing name alert! Despite being called &quot;regression,&quot; logistic regression
        is actually used for <strong>classification</strong> - predicting which category
        something belongs to.
      </p>
      <p>
        Think: Will this email be spam? Will the customer churn? Will the student pass?
        These are yes/no questions, and logistic regression answers them with probabilities.
      </p>

      <CalloutBox type="note" title="Why the Name?">
        <p>
          It&apos;s called &quot;regression&quot; because it predicts a continuous value (probability
          between 0 and 1). We then threshold that probability to make a classification.
          Blame the statisticians who named it in the 1800s!
        </p>
      </CalloutBox>

      <h2>How Does It Actually Work?</h2>

      <h3>Step 1: Calculate a Linear Score</h3>
      <p>
        Just like linear regression, we compute a weighted sum:
      </p>
      <MathBlock formula="z = w_1 x_1 + w_2 x_2 + \cdots + w_n x_n + b" />
      <p>
        This z can be any number from -∞ to +∞. Not great for probabilities yet...
      </p>

      <h3>Step 2: Squish Through the Sigmoid</h3>
      <p>
        Here&apos;s where the magic happens. The sigmoid function takes ANY number and
        squishes it into the range 0-1:
      </p>
      <MathBlock formula="\sigma(z) = \frac{1}{1 + e^{-z}}" />

      <CodeBlock code={sigmoidExplanation} language="python" title="Sigmoid in Action" />

      <AhaBox>
        <p>
          The sigmoid has a beautiful property: negative z → probability close to 0,
          positive z → probability close to 1, and z = 0 → exactly 50/50. The more
          extreme the z, the more confident the prediction!
        </p>
      </AhaBox>

      <h3>Step 3: Make a Decision</h3>
      <p>
        By default, if probability &gt; 0.5, predict class 1. Otherwise, predict class 0.
        Simple as that!
      </p>

      <h3>Step 4: Learn from Mistakes</h3>
      <p>
        The model uses gradient descent to adjust weights w and bias b, minimizing
        the log loss (also called binary cross-entropy):
      </p>
      <MathBlock formula="J = -\frac{1}{m}\sum_{i=1}^{m}[y_i \log(\hat{y}_i) + (1-y_i)\log(1-\hat{y}_i)]" />

      <CalloutBox type="tip" title="Intuition">
        <p>
          Log loss severely punishes confident wrong predictions. If you&apos;re 99% sure
          something is class 1 but it&apos;s actually class 0? That&apos;s a HUGE penalty.
          Being humble about uncertain predictions is rewarded.
        </p>
      </CalloutBox>

      <h2>Worked Example with Numbers</h2>
      <CodeBlock
        code={`# Student with 5 hours of study
# Model weights: w = 0.8, b = -4

# Step 1: Calculate z
z = 0.8 * 5 + (-4)
z = 4 - 4 = 0

# Step 2: Apply sigmoid
probability = 1 / (1 + e^0) = 1 / 2 = 0.5

# Step 3: Decision
# 0.5 is exactly on the threshold - could go either way!

# What about 7 hours of study?
z = 0.8 * 7 - 4 = 1.6
probability = 1 / (1 + e^(-1.6)) ≈ 0.83

# 83% chance of passing! Predict: PASS`}
        language="python"
        title="Step-by-Step Calculation"
      />

      <h2>The Decision Boundary</h2>
      <p>
        The decision boundary is where the probability = 0.5 (which means z = 0).
        For our example:
      </p>
      <MathBlock formula="0.8x - 4 = 0 \implies x = 5" />
      <p>
        Study 5+ hours and you&apos;re predicted to pass. Less than 5? Predicted to fail.
        The decision boundary is at x = 5 hours.
      </p>

      <h2>The Knobs and Dials You Can Tweak</h2>
      <ParameterTable parameters={logisticParams} />

      <CalloutBox type="warning" title="Common Confusion">
        <p>
          The C parameter is INVERSE regularization strength. Higher C = LESS
          regularization = model is more free to fit the data. This is backwards
          from what most people expect. You&apos;ve been warned!
        </p>
      </CalloutBox>

      <h2>Where You&apos;ll Actually Use This</h2>
      <ul>
        <li>
          <strong>Spam detection:</strong> Is this email spam or not?
        </li>
        <li>
          <strong>Medical diagnosis:</strong> Does the patient have the disease?
        </li>
        <li>
          <strong>Credit scoring:</strong> Will this person default on the loan?
        </li>
        <li>
          <strong>Click prediction:</strong> Will the user click this ad?
        </li>
        <li>
          <strong>Churn prediction:</strong> Will this customer cancel their subscription?
        </li>
      </ul>

      <CalloutBox type="example" title="Google Uses This">
        <p>
          Google uses logistic regression (among many other techniques) for ad click
          prediction. With billions of ad impressions, even a tiny improvement in
          prediction accuracy is worth millions of dollars.
        </p>
      </CalloutBox>

      <h2>Let&apos;s Build Something</h2>
      <CodeBlock code={basicExample} language="python" title="Student Pass/Fail Predictor" />

      <h3>Real-World Example: Spam Detection</h3>
      <CodeBlock code={realWorldExample} language="python" title="Spam Classifier" />

      <h2>Level Up: From Good to Great</h2>

      <h3>Handling Imbalanced Data</h3>
      <p>
        If 95% of your data is class 0 and only 5% is class 1, your model might
        just predict 0 for everything and get 95% accuracy. That&apos;s useless!
      </p>
      <ul>
        <li>
          <strong>Use class_weight=&apos;balanced&apos;</strong> to automatically adjust for imbalance
        </li>
        <li>
          <strong>Oversample the minority class</strong> using SMOTE
        </li>
        <li>
          <strong>Adjust the threshold</strong> - maybe 0.3 is better than 0.5 for your case
        </li>
      </ul>

      <h3>Beyond Binary Classification</h3>
      <p>
        Logistic regression can handle multiple classes too! Options:
      </p>
      <ul>
        <li>
          <strong>One-vs-Rest (OvR):</strong> Train one classifier per class
        </li>
        <li>
          <strong>Softmax (Multinomial):</strong> Single model that outputs probabilities
          for all classes at once
        </li>
      </ul>

      <CalloutBox type="tip" title="Pro Tip">
        <p>
          Don&apos;t judge your classifier by accuracy alone! For imbalanced data, look at
          precision, recall, F1-score, and ROC-AUC. A model with 95% accuracy might
          be missing every important case.
        </p>
      </CalloutBox>

      <h2>Now Go Play With It!</h2>
      <p>
        See the sigmoid curve in action and watch how predictions change as you
        adjust parameters:
      </p>
      <SimulationLink
        simulationSlug="logistic-regression"
        description="Adjust study hours and watch the probability update"
      />
      <SimulationLink
        simulationSlug="logistic-function"
        description="Explore how weight and bias affect the sigmoid curve"
      />
      <SimulationLink
        simulationSlug="logistic-training"
        description="Watch the model learn in real-time with gradient descent"
      />
    </ArticlePost>
  );
}
