"use client";

import { ArticlePost } from "../../layout/article-post";
import {
  CodeBlock,
  MathBlock,
  CalloutBox,
  AhaBox,
  SimulationLinks,
  ParameterTable,
} from "../../components";

const knobParams = [
  {
    name: "degree",
    type: "int",
    default: "2",
    description: "How much curve the polynomial model can use.",
    impact: "Too small can underfit. Too large can memorize noise.",
  },
  {
    name: "alpha",
    type: "float",
    default: "1.0",
    description: "Strength of Ridge or Lasso regularization.",
    impact: "Larger values shrink weights more, but excessive shrinkage can underfit.",
  },
  {
    name: "l1_ratio",
    type: "float",
    default: "0.5",
    description: "ElasticNet mix between L1 and L2 penalties.",
    impact: "1.0 is L1, 0.0 is L2, and values between them mix both behaviors.",
  },
];

const degreeExample = `import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error
from sklearn.model_selection import train_test_split
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import PolynomialFeatures

rng = np.random.default_rng(1)
X = rng.uniform(0, 5, 80).reshape(-1, 1)
y = 2 * X.ravel() + 0.5 * X.ravel() ** 2 + rng.normal(0, 1.5, 80)

# Keep a final test set untouched.
X_work, X_test, y_work, y_test = train_test_split(
    X, y, test_size=0.2, random_state=1
)
X_train, X_val, y_train, y_val = train_test_split(
    X_work, y_work, test_size=0.25, random_state=1
)

for degree in [1, 2, 15]:
    model = make_pipeline(
        PolynomialFeatures(degree, include_bias=False),
        LinearRegression(),
    )
    model.fit(X_train, y_train)
    val_mse = mean_squared_error(y_val, model.predict(X_val))
    print(f"degree {degree:2d} -> validation MSE {val_mse:6.2f}")

# Choose using validation, then grade exactly once on the untouched test set.`;

const regularizeExample = `from sklearn.linear_model import ElasticNet, Lasso, Ridge
from sklearn.metrics import mean_squared_error
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import PolynomialFeatures, StandardScaler

def build(degree, estimator):
    return make_pipeline(
        PolynomialFeatures(degree, include_bias=False),
        StandardScaler(),
        estimator,
    )

models = {
    "Ridge": build(15, Ridge(alpha=1.0)),
    "Lasso": build(15, Lasso(alpha=0.05, max_iter=100000)),
    "ElasticNet": build(
        15, ElasticNet(alpha=0.05, l1_ratio=0.5, max_iter=100000)
    ),
}

for name, model in models.items():
    model.fit(X_train, y_train)
    val_mse = mean_squared_error(y_val, model.predict(X_val))
    print(name, round(val_mse, 2))`;

const baselineExample = `from sklearn.dummy import DummyRegressor
from sklearn.metrics import mean_squared_error

baseline = DummyRegressor(strategy="mean")
baseline.fit(y_train.to_numpy().reshape(-1, 1), y_train)
# In a real script, compare its predictions with the same validation rows.`;

export default function GoodVsBadModelsArticle() {
  return (
    <ArticlePost
      title="Your Model Is Cheating: Finding the Sweet Spot Between Too Simple and Too Clever"
      author="Keval Kansagra"
      description="See underfitting, overfitting, validation, L1, L2, and regularization as one visual experiment. Then train a model that generalizes instead of memorizing."
      image={{
        src: "/article/beginner/good-vs-bad-hero.webp",
        alt: "Three model curves showing underfitting, a good fit, and overfitting",
      }}
    >


      <h2>The Model Audition</h2>
      <p>
        You have one noisy dataset and three candidates. The first draws a
        straight ruler through everything. The second follows the trend. The
        third wiggles through every dot like it has something to prove.
      </p>
      <p>
        Which one learned the pattern, and which one memorized the dots? You
        cannot answer by looking only at the training score. You need examples
        the model did not use while fitting.
      </p>
      <CalloutBox type="note" title="The One-Sentence Version">
        <p>
          Underfitting means the model is too simple to learn the signal.
          Overfitting means it is too flexible and learns noise. A good model
          performs well on unseen data, beats a simple baseline, and keeps a
          reasonable gap between training and validation performance.
        </p>
      </CalloutBox>

      <h2>Read the Two Scores</h2>
      <p>
        Training error tells you how well the model fits examples it has
        practiced on. Validation error tells you how well it handles examples
        held out while you choose the model. Test error is the final grade,
        checked once after decisions are finished.
      </p>
      <ul>
        <li>
          <strong>Both errors high:</strong> the model is probably underfitting.
          Try better features or a little more capacity.
        </li>
        <li>
          <strong>Training low, validation high:</strong> the model is probably
          overfitting. Simplify it, regularize it, or collect better data.
        </li>
        <li>
          <strong>Both low and close:</strong> promising, as long as the metric
          matches the real problem and beats a baseline.
        </li>
      </ul>


      <h2>Underfit, Sweet Spot, Overfit</h2>
      <p>
        Model complexity is how much shape or flexibility the model is allowed
        to use. A degree-1 polynomial is a line. A degree-2 polynomial can make
        a curve. A degree-15 polynomial can twist itself around many accidental
        details.
      </p>
      <p>
        As complexity rises, training error often falls for this family of
        models. Validation error may fall first, reach a useful region, and
        then rise. That picture is a teaching pattern, not a promise that every
        dataset produces a smooth U.
      </p>
      <MathBlock formula="\text{generalization gap} = \text{validation error} - \text{training error}" />
      <p>
        A large positive gap is a warning sign. The model is brilliant on
        rehearsal and shaky on new questions.
      </p>

      <h2>Do the Experiment Without Cheating</h2>
      <p>
        We will create a noisy curve, keep a final test set untouched, and use
        a validation set to choose among degrees. This matters because if you
        keep choosing the model with the best test score, the test set slowly
        becomes part of training through your decisions.
      </p>
      <CodeBlock code={degreeExample} language="python" title="Compare degrees on validation data" />
      <p>
        Degree 1 is the ruler. Degree 15 is the spaghetti candidate. Degree 2
        may be the sweet spot for this generated curve, but the code must decide
        using validation data. Only after choosing should you evaluate once on
        the untouched test set.
      </p>
      <CalloutBox type="warning" title="The Test Set Is Not a Tuning Knob">
        <p>
          Use validation data or cross-validation while comparing degrees and
          hyperparameters. Keep the test set quiet until the end. Otherwise the
          final number becomes optimistic because you have repeatedly reacted to
          it.
        </p>
      </CalloutBox>

      <h2>What Does the Metric Mean?</h2>
      <p>
        Mean squared error averages squared misses. Lower is better, but its
        units are squared, so mean absolute error or root mean squared error can
        be easier to explain in the original target units.
      </p>
      <MathBlock formula="MSE = \frac{1}{n}\sum_{i=1}^{n}(y_i - \hat{y}_i)^2" />
      <p>
        A metric is not a universal goodness score. For a rare-event classifier,
        accuracy can look impressive while missing almost every important
        positive case. Pick metrics based on the errors the project can afford.
      </p>

      <h2>Regularization: Charge the Model for Extra Wiggle</h2>
      <p>
        Regularization adds a penalty to the loss. The model can still fit the
        data, but unnecessary complexity becomes expensive.
      </p>
      <h3>L1: The Snipper</h3>
      <MathBlock formula="\text{loss} = MSE + \lambda \sum_j |w_j|" />
      <p>
        L1 can push some weights exactly to zero. That can make a model sparser,
        but with correlated features the selected feature may be unstable. Zero
        does not automatically mean “this feature is the only truth.”
      </p>
      <h3>L2: The Shrinker</h3>
      <MathBlock formula="\text{loss} = MSE + \lambda \sum_j w_j^2" />
      <p>
        L2 discourages very large weights and usually keeps many features in
        play. Because the penalty depends on coefficient size, scale features
        inside a pipeline before using L1 or L2.
      </p>


      <h2>Run Three Controlled Comparisons</h2>
      <p>
        Change one idea at a time. Keep the data split and validation metric
        fixed.
      </p>
      <ol>
        <li>
          <strong>Baseline:</strong> predict the training mean. A real model
          must beat this boring reference.
        </li>
        <li>
          <strong>Complexity run:</strong> compare degree 1, degree 2, and
          degree 15 on validation data.
        </li>
        <li>
          <strong>Regularization run:</strong> rescue the flexible degree-15
          model with Ridge, Lasso, or ElasticNet.
        </li>
      </ol>
      <CodeBlock code={baselineExample} language="python" title="Start with a boring baseline" />
      <CodeBlock code={regularizeExample} language="python" title="Compare L1, L2, and a mixture" />
      <p>
        The regularization block assumes <code>X_train</code>, <code>X_val</code>,
        <code>y_train</code>, and <code>y_val</code> from the previous experiment.
        In a project, put all preprocessing in the pipeline and tune
        <code>alpha</code> with validation or cross-validation.
      </p>

      <h2>The Parameters Worth Checking</h2>
      <ParameterTable parameters={knobParams} />
      <p>
        <code>degree</code>, <code>alpha</code>, and <code>l1_ratio</code> affect
        model behavior. <code>test_size</code> affects how evaluation is
        estimated, not how intelligent the model is. Change two or three
        related values, record the validation metric, and stop when the result
        is stable enough for the problem.
      </p>

      <h2>Where the Technology Fits</h2>
      <ul>
        <li>
          <strong>pandas</strong> helps you inspect duplicates, missing values,
          and feature distributions before the experiment.
        </li>
        <li>
          <strong>scikit-learn</strong> supplies the pipelines, estimators,
          regularizers, metrics, and cross-validation used here.
        </li>
        <li>
          <strong>FastAPI</strong> belongs after model selection, when you want
          to serve the chosen pipeline to another application.
        </li>
        <li>
          <strong>PyTorch</strong> belongs when the problem needs a neural
          network or a custom training loop. Do not use it to hide a data
          quality problem.
        </li>
      </ul>

      <AhaBox>
        <p>
          A model that wins training is not necessarily a model that learned.
          Keep one honest holdout, compare against a baseline, and prefer the
          simplest model that performs well enough on new data.
        </p>
      </AhaBox>

      <h2>Now Go Play With It</h2>
      <p>
        Move the polynomial degree slider before looking at the error. Predict
        when validation error will start rising, then check your guess. The
        point is not to find a magical degree. It is to feel the moment the
        model starts learning the noise.
      </p>
      <SimulationLinks
        simulations={[
          { slug: "polynomial-regression", description: "Raise the degree and watch a good fit become too flexible" },
          { slug: "linear-regression", description: "See how a too-simple line misses a curved pattern" },
          { slug: "gradient-descent", description: "Watch parameters move toward lower loss" },
        ]}
      />
    </ArticlePost>
  );
}
