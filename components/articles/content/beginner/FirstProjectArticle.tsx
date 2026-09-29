"use client";

import { ArticlePost } from "../../layout/article-post";
import {
  CodeBlock,
  MathBlock,
  CalloutBox,
  AhaBox,
  SimulationLink,
  ParameterTable,
} from "../../components";

const knobs = [
  {
    name: "test_size",
    type: "float",
    default: "0.2",
    description: "Fraction of rows held out for the final classroom test.",
    impact:
      "Affects how much data is available for training and how noisy the score is.",
  },
  {
    name: "random_state",
    type: "int",
    default: "42",
    description: "Seed that makes the random split repeatable.",
    impact: "Use it while learning so your result can be reproduced.",
  },
  {
    name: "fit_intercept",
    type: "bool",
    default: "True",
    description: "Lets the linear model learn its starting point.",
    impact:
      "Keep it True unless you have a strong reason that the line must pass through zero.",
  },
];

const setupCommands = `mkdir coffee-predictor
cd coffee-predictor
python -m venv .venv
source .venv/bin/activate
python -m pip install pandas scikit-learn fastapi uvicorn
`;

const windowsCommands = `python -m venv .venv
.\\.venv\\Scripts\\Activate.ps1
python -m pip install pandas scikit-learn fastapi uvicorn
`;

const dataCsv = `sleep_hours,coffees
8.0,1
7.5,1
7.0,2
6.5,2
6.0,3
5.5,3
5.0,4
4.0,4
3.0,5
2.0,6`;

const pandasMoves = `import pandas as pd

df = pd.read_csv("data.csv")
df.info()                              # types and non-null counts
print(df.head(3))                     # first three rows
print(df.describe())                  # numeric summaries
print(df.isna().sum())                # missing values by column

# Cleaning operations. Keep only the rules your data needs.
df = df.drop_duplicates()
df["sleep_hours"] = pd.to_numeric(df["sleep_hours"], errors="coerce")
df["coffees"] = pd.to_numeric(df["coffees"], errors="coerce")
df = df.dropna(subset=["sleep_hours", "coffees"])
df = df[df["sleep_hours"].between(0, 24)]

df.to_csv("clean_data.csv", index=False)`;

const trainPy = `import pickle
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, r2_score

df = pd.read_csv("clean_data.csv")
X = df[["sleep_hours"]]
y = df["coffees"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = LinearRegression(fit_intercept=True)
model.fit(X_train, y_train)

predictions = model.predict(X_test)
print("MAE:", mean_absolute_error(y_test, predictions))
print("R2:", r2_score(y_test, predictions))

with open("model.pkl", "wb") as file:
    pickle.dump(model, file)`;

const appPy = `from fastapi import FastAPI
import pickle
import pandas as pd

with open("model.pkl", "rb") as file:
    model = pickle.load(file)  # load only a file you trust

app = FastAPI()

@app.get("/predict")
def predict(sleep_hours: float):
    row = pd.DataFrame({"sleep_hours": [sleep_hours]})
    coffees = model.predict(row)[0]
    return {
        "sleep_hours": sleep_hours,
        "predicted_coffees": round(float(coffees), 1),
    }`;

const runCommands = `python train.py
uvicorn app:app --reload
`;

const curlCommand = `curl "http://127.0.0.1:8000/predict?sleep_hours=5.5"`;

export default function FirstProjectArticle() {
  return (
    <ArticlePost
      title="From Messy CSV to Working Prediction API"
      author="Keval Kansagra"
      description="Build a tiny machine learning project with a virtual environment, pandas, scikit-learn, and FastAPI. You will inspect data, train a model, and call it from a URL."
      image={{
        src: "/article/beginner/first-project-hero.webp",
        alt: "A beginner machine learning pipeline from data file to local prediction API",
      }}
    >
      <h2>The Challenge</h2>
      <p>
        Can you teach your laptop to estimate coffee intake from sleep hours,
        test the guess on rows it has never seen, and put the result behind a
        URL?
      </p>
      <p>
        We will build a deliberately tiny project. The data is synthetic, so it
        teaches the mechanics of a pipeline. It does not prove that sleep causes
        coffee consumption, and it is not health advice.
      </p>
      <CalloutBox type="note" title="What You Will Build">
        <p>
          A local prediction service. You will send <code>sleep_hours=5.5</code>
          to an endpoint and receive JSON containing a predicted coffee count.
          Local means your laptop can call it. It is not a public production
          deployment yet.
        </p>
      </CalloutBox>

      <h2>The Smallest AI Engineering Loop</h2>
      <p>
        The toy version is:
        <strong>
          {" "}
          define, isolate, inspect, clean, split, train, evaluate, save, serve.
        </strong>{" "}
        Real systems add versioning, monitoring, and retraining, but the shape
        is already here.
      </p>
      <ol>
        <li>Define the input and the answer you want to predict.</li>
        <li>
          Create an isolated environment so this project has its own packages.
        </li>
        <li>Inspect and clean the data before trusting it.</li>
        <li>Split examples into training and unseen evaluation rows.</li>
        <li>Fit a simple model and measure its mistakes.</li>
        <li>Save the fitted model, then serve it through an endpoint.</li>
      </ol>

      <h2>Step 1: Build a Python Sandbox</h2>
      <p>
        A virtual environment is an isolated Python environment with its own
        interpreter path and installed packages. It is not a magical second
        computer. It is a boundary that stops one project&apos;s dependencies
        from casually breaking another project.
      </p>
      <p>
        <strong>Mac or Linux:</strong>
      </p>
      <CodeBlock
        code={setupCommands}
        language="bash"
        title="Create and activate .venv"
      />
      <ul>
        <li>
          <code>mkdir</code> creates the project folder.
        </li>
        <li>
          <code>cd</code> moves the terminal into that folder.
        </li>
        <li>
          <code>python -m venv .venv</code> creates the isolated environment.
        </li>
        <li>
          <code>source .venv/bin/activate</code> activates it for this terminal.
        </li>
        <li>
          <code>python -m pip install ...</code> installs packages into the
          selected Python environment.
        </li>
      </ul>
      <p>
        <strong>Windows PowerShell:</strong>
      </p>
      <CodeBlock
        code={windowsCommands}
        language="bash"
        title="Windows PowerShell setup"
      />
      <p>
        Command Prompt uses <code>.venv\\\\Scripts\\\\activate.bat</code>{" "}
        instead. Seeing <code>(.venv)</code> in your prompt means the
        environment is active. Run <code>deactivate</code> when you want to
        leave it.
      </p>

      <h2>Step 2: Make Tiny Data</h2>
      <p>
        Save this as <code>data.csv</code>. Ten rows are small enough to inspect
        with your own eyes. That is useful for learning, not enough for a real
        performance claim.
      </p>
      <CodeBlock code={dataCsv} language="text" title="data.csv" />
      <h2>Step 3: Meet pandas</h2>
      <p>
        pandas is the data workbench. It turns a CSV into a labeled
        <code>DataFrame</code>, which feels like a spreadsheet you can control
        with Python. Use it for inspection and processing, not for training the
        model itself.
      </p>
      <CodeBlock
        code={pandasMoves}
        language="python"
        title="Inspect and clean the table"
      />
      <ul>
        <li>
          <code>read_csv</code> loads the file.
        </li>
        <li>
          <code>info</code>, <code>head</code>, and <code>describe</code> help
          you understand its shape.
        </li>
        <li>
          <code>isna</code> finds missing values.
        </li>
        <li>
          <code>drop_duplicates</code>, <code>to_numeric</code>, and{" "}
          <code>dropna</code> perform visible cleaning.
        </li>
        <li>
          <code>to_csv</code> saves the cleaned table for the next step.
        </li>
      </ul>
      <CalloutBox type="warning" title="Inspection Is Not Cleaning">
        <p>
          Looking at missing values is inspection. Choosing whether to remove,
          fill, or investigate them is cleaning. The correct decision depends on
          the meaning of the data.
        </p>
      </CalloutBox>

      <h2>CSV, pandas, and a Data Warehouse</h2>
      <p>
        These names describe different layers, not different sizes of the same
        object:
      </p>
      <ul>
        <li>
          <strong>CSV:</strong> a portable file for exchanging rows and columns.
        </li>
        <li>
          <strong>pandas:</strong> in-memory inspection and transformation in
          Python.
        </li>
        <li>
          <strong>Data warehouse:</strong> persistent, shared, queryable
          analytics storage, usually accessed with SQL.
        </li>
        <li>
          <strong>Model:</strong> fitted maths that turns features into
          predictions.
        </li>
        <li>
          <strong>FastAPI:</strong> the service window that lets another program
          ask for a prediction.
        </li>
      </ul>
      <p>
        A real project might query a warehouse, bring a slice into pandas, clean
        and validate it, train a model, and then serve predictions with FastAPI.
        A warehouse is not simply a giant pandas DataFrame.
      </p>

      <h2>Step 4: Split Features from the Answer</h2>
      <p>
        In machine learning, <code>X</code> is usually the feature table and
        <code>y</code> is the target column. Here, <code>X</code> contains sleep
        hours and <code>y</code> contains coffee count.
      </p>
      <MathBlock formula="X = features,\quad y = target" />
      <p>
        Hold out some rows before you fit the model. Training rows are practice
        questions. Test rows are exam questions. If the model sees the exam
        answers while training, the grade stops being honest.
      </p>

      <h2>Step 5: Train and Evaluate with scikit-learn</h2>
      <p>
        scikit-learn gives us estimators with a friendly pattern: create the
        model, call <code>fit</code>, call <code>predict</code>, and measure the
        errors. Linear regression learns a line:
      </p>
      <MathBlock formula="\hat{y} = m \cdot x + b" />
      <p>
        <em>m</em> is the slope, <em>b</em> is the intercept, and the model
        chooses them from the training rows. The intercept is the predicted
        target when the feature is zero, which may be outside the meaningful
        range of this toy example.
      </p>
      <CodeBlock code={trainPy} language="python" title="train.py" />
      <p>
        The script prints MAE, the average absolute miss in coffee units, and
        R2, a relative score that can be useful but is hard to trust on tiny
        datasets. The test set here has only two rows, so the scores are a
        classroom illustration, not a reliable estimate of real performance.
      </p>
      <CalloutBox type="note" title="No Data Leakage">
        <p>
          If you later add scaling or imputation, fit those transformations on
          training data only. A scikit-learn <code>Pipeline</code> keeps the
          preprocessing and model together so the same steps run at prediction
          time without peeking at held-out data.
        </p>
      </CalloutBox>

      <h2>Step 6: Serve It with FastAPI</h2>
      <p>
        Training creates a model artifact. Serving loads that artifact and
        reuses it for requests. FastAPI is not retraining the model on every
        request.
      </p>
      <CodeBlock code={appPy} language="python" title="app.py" />
      <ul>
        <li>
          <code>pickle.load</code> reloads the fitted model. Only load model
          files you trust.
        </li>
        <li>
          <code>FastAPI()</code> creates the application.
        </li>
        <li>
          <code>@app.get(&quot;/predict&quot;)</code> connects a URL to the
          function below it.
        </li>
        <li>
          <code>sleep_hours: float</code> asks FastAPI to parse and validate the
          query value.
        </li>
        <li>The DataFrame keeps the feature name used during training.</li>
        <li>The returned dictionary becomes JSON.</li>
      </ul>
      <p>Run the training script, then start the local server:</p>
      <CodeBlock
        code={runCommands}
        language="bash"
        title="Train, then start locally"
      />
      <ul>
        <li>
          <code>python train.py</code> creates or replaces{" "}
          <code>model.pkl</code>.
        </li>
        <li>
          <code>uvicorn app:app --reload</code> means: run the <code>app</code>{" "}
          object from <code>app.py</code>, and reload during development when
          code changes.
        </li>
      </ul>
      <p>
        Open <code>http://127.0.0.1:8000/docs</code> or use a second terminal:
      </p>
      <CodeBlock code={curlCommand} language="bash" title="Call the endpoint" />
      <p>
        This is local serving. Public deployment would add a host, HTTPS,
        authentication, logging, versioned artifacts, and monitoring. Restart
        the server after retraining because it may still hold the old model in
        memory.
      </p>

      <h2>The Three Knobs You Can Actually Change</h2>
      <ParameterTable parameters={knobs} />
      <p>
        <code>test_size</code> and <code>random_state</code> control the
        experiment, not the model&apos;s intelligence.{" "}
        <code>fit_intercept</code>
        changes the fitted equation. Change one setting at a time and write down
        what happened.
      </p>

      <h2>Where PyTorch Fits</h2>
      <p>
        PyTorch belongs later in the path, when you have an image, audio, text,
        or another problem that benefits from a neural network. It gives you
        tensors, neural network modules, losses, gradients, and optimizers. You
        do not need it to build this first tabular API.
      </p>
      <p>
        The full journey is now visible:
        <strong>
          {" "}
          pandas prepares data, scikit-learn fits a baseline, FastAPI serves it,
          and PyTorch becomes an option for deeper models.
        </strong>
      </p>

      <AhaBox>
        <p>
          You just built the smallest useful version of an AI engineering
          pipeline. Real systems add more data, stronger validation, model
          versioning, monitoring, and retraining. They do not replace the basic
          loop you just learned.
        </p>
      </AhaBox>

      <h2>Now Go Play With It</h2>
      <p>
        Change one row, retrain, restart the server, and call the endpoint
        again. Watch the prediction move. Then change the feature name and see
        how quickly a model-serving contract can break.
      </p>
      <SimulationLink
        simulationSlug="linear-regression"
        description="See the line your tiny model is trying to fit"
      />
      <SimulationLink
        simulationSlug="least-squares"
        description="Watch squared errors shrink around the fitted line"
      />
      <SimulationLink
        simulationSlug="gradient-descent"
        description="See parameters move toward lower error"
      />
    </ArticlePost>
  );
}
