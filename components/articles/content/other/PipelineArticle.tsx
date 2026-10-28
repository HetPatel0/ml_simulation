import { ArticlePost } from "../../layout/article-post";
import {
  CodeBlock,
  CalloutBox,
  AhaBox,
  ParameterTable,
} from "../../components";

const pipelineParams = [
  {
    name: "steps",
    type: "list[tuple]",
    default: "required",
    description: "Ordered (name, transformer/estimator) pairs.",
    impact: "Last step is the model; every earlier step must be a transformer.",
  },
  {
    name: "memory",
    type: "str | None",
    default: "None",
    description: "Folder for caching transformer outputs between fits.",
    impact: "GridSearchCV refits get much faster when early steps are expensive.",
  },
  {
    name: "verbose",
    type: "bool",
    default: "False",
    description: "Print elapsed time per step during fit.",
    impact: "First tool for finding the slow step in a long chain.",
  },
];

const quickStart = `from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

pipe = Pipeline([
    ("scaler", StandardScaler()),      # transformer: fit_transform
    ("model", LogisticRegression()),   # estimator:  fit
])
pipe.fit(X_train, y_train)             # scaler then model, in order
pipe.predict(X_test)                   # transform only, then predict`;

const gridSearch = `from sklearn.model_selection import GridSearchCV
from sklearn.feature_selection import SelectKBest

pipe = Pipeline([
    ("select", SelectKBest()),
    ("inner", StandardScaler()),
    ("model", LogisticRegression(max_iter=1000)),
])

# step name + "__" + inner param name
search = GridSearchCV(pipe, {
    "select__k": [5, 10, 20],
    "model__C": [0.1, 1, 10],
}, cv=5)
search.fit(X_train, y_train)`

const production = `from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
import joblib

preprocess = ColumnTransformer([
    ("num", StandardScaler(), ["age", "income", "tenure"]),
    ("cat", OneHotEncoder(handle_unknown="ignore"), ["region", "plan"]),
])

pipe = Pipeline([
    ("preprocess", preprocess),
    ("model", RandomForestClassifier(n_estimators=300)),
])
pipe.fit(X_train, y_train)

joblib.dump(pipe, "model.joblib")      # transformers + model, one file`;

const serving = `# serving.py — runs far from the notebook
import joblib

pipe = joblib.load("model.joblib")

def handle(body: dict):
    row = [body]                       # match training column order
    return pipe.predict(row)[0]        # preprocessing applied identically`;

const crossVal = `from sklearn.model_selection import cross_val_score

# correct: the WHOLE pipeline is what gets fit per fold
scores = cross_val_score(pipe, X, y, cv=5)
print(scores.mean())

# wrong: scaler.fit(X) before splitting leaks test statistics
`;

export default function PipelineArticle() {
  return (
    <ArticlePost
      title="How sklearn Pipelines Work (and How to Ship One)"
      author="Keval Kansagra"
      description="Understand fit_transform chaining, why the Pipeline kills data leakage, and how the same object becomes your production artifact with one joblib dump."
      image={{
        src: "/article/other/pipeline-hero.webp",
        alt: "Notebook leakage on the left, one deployable production artifact on the right",
      }}
    >
      <h2>One Object, Exact Order</h2>
      <p>
        A pipeline is just a list of steps. Every step except the last is a
        transformer with <code>fit</code> and <code>transform</code> methods;
        the last step is an estimator. When you call{" "}
        <code>pipe.fit(X_train, y_train)</code>, sklearn walks the list in
        order: the earlier steps learn their parameters with{" "}
        <code>fit_transform</code> on the current data, and the final estimator
        fits on the output of the one before it.
      </p>
      <CodeBlock code={quickStart} language="python" title="Minimal pipeline" />
      <AhaBox>
        <p>
          <code>pipe.predict(X_test)</code> re-applies exactly the learned
          transforms — <code>transform</code> only, never{" "}
          <code>fit</code> again. The test statistics never touch the scaler,
          so your evaluation measures what serving will actually do.
        </p>
      </AhaBox>

      <h2>The Leakage Problem It Solves</h2>
      <p>
        The classic mistake in a notebook is fitting the scaler before the
        train/test split. The scaler then learns the mean and variance of rows
        that include the test set, and cross-validated scores quietly stop
        meaning anything. Pipelines close that hole by construction: the
        transformers live inside the same object you cross-validate.
      </p>
      <ul>
        <li>
          <strong>Tune inside the chain:</strong> feature selection placed in
          the pipeline is re-fit per fold.
        </li>
        <li>
          <strong>Score the whole object:</strong> cross_val_score fits and
          evaluates preprocessing + model together.
        </li>
        <li>
          <strong>Deploy what you validated:</strong> dump the pipeline, not a
          copy-pasted serving script.
        </li>
      </ul>
      <CodeBlock code={crossVal} language="python" title="Cross-validating the pipeline" />

      <h2>The <code>step__param</code> Naming Trick</h2>
      <p>
        Grid search over an unexpanded chain needs names. Sklearn addresses
        every nested parameter with <code>stepname__param</code> — that is why
        you should name steps instead of using{" "}
        <code>make_pipeline</code> everywhere.
      </p>
      <CodeBlock code={gridSearch} language="python" title="Nested params in GridSearchCV" />

      <h2>Mixed Columns with ColumnTransformer</h2>
      <p>
        Real data is rarely all-numbers. Put a ColumnTransformer as your first
        pipeline step and it routes numeric columns and categorical columns
        through different transforms, then hands the concatenation to the
        model. <code>handle_unknown=&quot;ignore&quot;</code> is production
        hygiene: a category that appears at serving time but not in training
        would otherwise crash the endpoint.
      </p>

      <h2>How We Use It in Production</h2>
      <p>
        In serving code you paste no preprocessing. The pipeline you validated
        in training <em>is</em> the model you deploy: dump it with joblib, load
        it in the API process, and call <code>.predict</code> on raw request
        rows. Preprocessing and model move together, in the same order, every
        time.
      </p>
      <CodeBlock code={production} language="python" title="Training job: fit + dump" />
      <CodeBlock code={serving} language="python" title="Serving job: load + predict" />
      <CalloutBox type="note" title="Production Checklist">
        <p>
          Pin the sklearn version in requirements (unpickling across major
          versions breaks), version the artifact file with a build hash, keep
          training column order documented, and retrain when the toolchain
          changes — a joblib file is not forward compatible.
        </p>
      </CalloutBox>

      <h2>Useful Pipeline Parameters</h2>
      <ParameterTable parameters={pipelineParams} />

      <h2>Common Pitfalls</h2>
      <ul>
        <li>
          <strong>Non-transformer mid-step:</strong> every step except the last
          must have <code>transform</code>; sklearn raises
          <code> TypeError</code> at fit time for intermediate estimators.
        </li>
        <li>
          <strong>Calling fit_transform at inference:</strong> serving must
          only <code>transform</code> (or simply <code>predict</code>) —
          re-fitting on request data means talking to production drift again.
        </li>
        <li>
          <strong>Wrong grid keys:</strong> <code>&quot;C&quot;</code> instead
          of <code>&quot;model__C&quot;</code> in GridSearchCV params — modern
          sklearn errors on unknown keys instead of ignoring them.
        </li>
        <li>
          <strong>Cached staleness with memory:</strong> cached transformer
          outputs assume the input data does not change — clear the cache
          directory when data pipelines change.
        </li>
      </ul>

      <h2>One-Sentence Summary</h2>
      <p>
        A pipeline locks your preprocessing to your estimator in one ordered
        object: cross-validate it as a whole, grid-search into it with{" "}
        <code>step__param</code> strings, and ship it to production as a single
        joblib artifact the API loads — no duplicated preprocessing code and no
        leakage.
      </p>
    </ArticlePost>
  );
}
