/**
 * Curriculum data for /resources.
 *
 * The page is deliberately article-like: each step gets a short narrative,
 * the handful of formulas that actually appear in code, one excellent video,
 * a practice task, the traps that bite beginners, and links into the rest of
 * the site. No dashboards, no progress casino.
 */
import type { QuizQuestion } from "./quizzes";

export type ResourceKind = "guide" | "reference" | "practice" | "video";

export type ResourceLink = {
  label: string;
  href: string;
  internal?: boolean;
  kind?: ResourceKind;
};

export type ResourceVideo = {
  label: string;
  href: string;
  /** Optional collection page to open from the lesson video title. */
  playlistHref?: string;
  /** Who made it — credit where it is due. */
  author: string;
};

export type MathSnippet = {
  title: string;
  formula: string;
  caption: string;
};

export type ResourceStep = {
  id: string;
  module: string;
  title: string;
  question: string;
  /** One-sentence lead shown under the step title. */
  summary: string;
  /** Two short paragraphs of plain-English teaching. */
  intro: [string, string];
  /** Rough study time in minutes for reading + practice. */
  time: number;
  video?: ResourceVideo;
  math?: MathSnippet[];
  learn: string[];
  practice: string;
  pitfalls: string[];
  checklist: string[];
  resources: ResourceLink[];
  /** Optional interview-style prompts rendered under the lesson. */
  interviewQuestions?: string[];
  /** Internal slugs for the "go deeper" row. */
  article?: string;
  simulation?: string;
  cheatsheet?: string;
};

export type ResourceModule = {
  id: string;
  kicker: string;
  title: string;
  summary: string;
  /** Short phase opener rendered before the steps. */
  intro: string;
  outcome: string;
};

export const resourceModules: ResourceModule[] = [
  {
    id: "programming",
    kicker: "Phase 1",
    title: "Programming foundations",
    summary: "Python, Git, Linux, and the command line, in the order you actually use them.",
    intro:
      "You cannot debug a model if you cannot debug a script. This phase builds the working habits that make every later phase less mysterious: run Python, navigate a shell, version your work, and reproduce an environment.",
    outcome: "A small project you can clone, run, inspect, and explain without a notebook open.",
  },
  {
    id: "math",
    kicker: "Phase 2",
    title: "Mathematics and statistics",
    summary: "The linear algebra, calculus, and probability that show up in real model code.",
    intro:
      "You do not need a proof-heavy math degree. You need enough fluency to read a model equation, spot a shape bug, understand a loss curve, and reason about uncertainty without pretending a single score is the truth.",
    outcome: "You can read a model equation and predict how it will behave.",
  },
  {
    id: "data",
    kicker: "Phase 3",
    title: "Data engineering fundamentals",
    summary: "NumPy, pandas, SQL, cleaning, honest splits, features, tests, and experiments.",
    intro:
      "Data work is not the boring part before the model. It is the part that decides whether the model can work at all, in training and at 3 a.m. in production. This phase turns a CSV into a pipeline you can trust.",
    outcome: "A clean dataset, an honest split, and a pipeline that reruns the same way twice.",
  },
  {
    id: "classical",
    kicker: "Phase 4",
    title: "Classical machine learning",
    summary: "Problem framing, baselines, regression, classification, trees, ensembles, and clustering.",
    intro:
      "The classical model zoo is still where most tabular problems are won. Start with the simplest model that could work, learn why it fails, and let complexity earn its keep with evidence.",
    outcome: "You can frame a prediction problem, pick a sensible model, and defend the choice.",
  },
  {
    id: "deep",
    kicker: "Phase 5",
    title: "Deep learning",
    summary: "Neural networks, backpropagation, and a small PyTorch training loop.",
    intro:
      "Deep learning is a stack of weighted sums with a good story. Learn the mechanics on a small problem first: tensors, layers, loss, gradients, and the training loop you will reuse forever.",
    outcome: "A small network you trained yourself, with a loss curve you can explain.",
  },
  {
    id: "model-types",
    kicker: "Phase 6",
    title: "AI model types",
    summary: "CNNs, transformers, diffusion models, and graph neural networks.",
    intro:
      "Different data shapes demand different inductive biases. Convolutions exploit locality, attention models relationships, diffusion models learn to denoise, and graph networks respect structure. Learn what each family is for before reaching for one.",
    outcome: "A mental map from data shape and task to a sensible model family.",
  },
  {
    id: "llm",
    kicker: "Phase 7",
    title: "LLMs and generative AI",
    summary: "Tokens, embeddings, attention, decoding, and fine-tuning.",
    intro:
      "A language model is not magic; it is next-token prediction at scale, wrapped in tokenization, attention, and sampling. Understand the machinery and the failure modes before building a product on top of it.",
    outcome: "You can explain how an LLM turns text into tokens and tokens into a response.",
  },
  {
    id: "llm-apps",
    kicker: "Phase 8",
    title: "LLM application engineering",
    summary: "RAG, vector databases, agents, and evaluation.",
    intro:
      "The model is rarely the product. The product is retrieval, context, tools, guardrails, latency, and a way to prove that an answer is better than the last version. This is applied AI engineering.",
    outcome: "A grounded LLM feature with a retrieval path and an evaluation set.",
  },
  {
    id: "backend",
    kicker: "Phase 9",
    title: "Backend engineering",
    summary: "FastAPI, REST APIs, authentication, and async work.",
    intro:
      "A model in a notebook is a science fair project. A model behind a validated endpoint, with a stable contract and a clear failure mode, is a product. This phase makes the service real.",
    outcome: "A documented prediction API with validation, auth, and sane async behavior.",
  },
  {
    id: "mlops",
    kicker: "Phase 10",
    title: "Deployment and MLOps",
    summary: "Docker, cloud deployment, CI/CD, quality gates, and monitoring.",
    intro:
      "Shipping once is easy. Shipping repeatedly, safely, and with evidence is the job. Containers, pipelines, rollback plans, and monitoring turn a model into an operational system.",
    outcome: "A containerized service that deploys through CI and reports its own health.",
  },
  {
    id: "advanced",
    kicker: "Phase 11",
    title: "Advanced AI engineering",
    summary: "Inference optimization, scaling, and reliability under load.",
    intro:
      "Once the system works, the questions change: how fast, how cheap, how many users, and what happens when a dependency fails? This phase is about performance and failure under real traffic.",
    outcome: "A latency budget, a scaling plan, and a failure mode you have actually tested.",
  },
  {
    id: "portfolio",
    kicker: "Phase 12",
    title: "Portfolio and job preparation",
    summary: "Projects, system design, and the interview questions that reveal depth.",
    intro:
      "One finished project beats five half-built ones. This phase packages the work, practices the system-design conversation, and prepares answers that show judgment rather than vocabulary.",
    outcome: "A portfolio project, a system-design walkthrough, and a practiced interview story.",
  },
];

const rawSteps: ResourceStep[] = [
  {
    id: "problem",
    module: "classical",
    title: "Frame the problem",
    question: "What decision should this model improve?",
    summary:
      "ML is useful only when it improves a real decision. Define the prediction moment, available information, target, and cost of mistakes before writing model code.",
    intro: [
      "Most failed ML projects were doomed before anyone opened a notebook. The model was fine; the question was fuzzy. If nobody can say what decision changes when the prediction arrives, the project has no finish line.",
      "A model is a machine that turns information you have at one moment into a guess about something you do not know yet. Predicting tomorrow's umbrella sales is a different problem from predicting today's, because tomorrow's weather is not available today. Write the moment down and the features write themselves.",
    ],
    time: 25,
    video: {
      label: "A Gentle Introduction to Machine Learning",
      href: "https://www.youtube.com/watch?v=Gv9_4yMHFhI",
      playlistHref:
        "https://www.youtube.com/playlist?list=PLblh5JKOoLUICTaGLRoHQDuF_7q2GfuJF",
      author: "StatQuest",
    },
    math: [
      {
        title: "Why the metric comes from the cost",
        formula: String.raw`\text{expected cost} = p(y=1)\,C_{\text{FN}} + (1-p(y=1))\,C_{\text{FP}}`,
        caption:
          "A missed fraud case and a false alarm rarely cost the same. The metric should reflect that asymmetry, not whatever is easiest to print.",
      },
    ],
    learn: [
      "A feature is legal only if it exists before the prediction moment.",
      "A baseline is a required reference point, not a beginner-only exercise.",
      "The primary metric should encode the cost of being wrong.",
    ],
    practice:
      "Write a one-page problem contract: user, decision, prediction moment, target, features, baseline, metric, and failure cost. Shrink the problem until every field is concrete.",
    pitfalls: [
      "Starting from an algorithm instead of a decision.",
      "Using information that only appears after the prediction moment.",
      "Changing the metric after seeing results.",
    ],
    checklist: ["Name the user.", "Define the target.", "Choose a primary metric."],
    resources: [
      { label: "Our guide: What is ML?", href: "/learn/what-is-ml", internal: true, kind: "guide" },
      {
        label: "scikit-learn model map",
        href: "https://scikit-learn.org/stable/machine_learning_map.html",
        kind: "reference",
      },
    ],
    article: "what-is-ml",
  },
  {
    id: "workspace",
    module: "programming",
    title: "Set up a boring workspace",
    question: "Can someone else rerun your work?",
    summary:
      "A clean environment, version control, clear folders, and repeatable commands turn an experiment into engineering work.",
    intro: [
      "You do not need a fancy setup. You need a boring one that works twice: once on your laptop today, and once on a fresh machine next month when the demo is due.",
      "Think of a project like a kitchen. The data is the ingredients, the code is the recipe, and the saved model is the dish. If the recipe only works while you are standing in the kitchen, it is not a recipe yet.",
    ],
    time: 30,
    learn: [
      "Use one virtual environment per project and pin its dependencies.",
      "Keep source, data, tests, and generated artifacts separate.",
      "Move durable logic out of notebooks and into scripts.",
    ],
    practice:
      "Create a repository with a virtual environment, README, source folder, test folder, and one train command that works from a fresh clone.",
    pitfalls: [
      "Global package installs that only work on your machine.",
      "Hiding all logic in one notebook.",
      "Committing secrets or raw private data.",
    ],
    checklist: ["Create a virtual environment.", "Pin dependencies.", "Document a quick start."],
    resources: [
      {
        label: "Python virtual environments",
        href: "https://docs.python.org/3/library/venv.html",
        kind: "reference",
      },
      { label: "Our first ML project", href: "/learn/first-project", internal: true, kind: "guide" },
    ],
    article: "first-project",
  },
  {
    id: "data",
    module: "data",
    title: "Profile the data",
    question: "What does this dataset really contain?",
    summary:
      "Quality usually matters more than model choice. Inspect meaning, units, missingness, duplicates, category drift, and the way labels were created.",
    intro: [
      "Data is not messy because someone lied. It is messy because the world is messy and every collection process leaves fingerprints. Before modeling, become a detective: who collected this, when, why, and what does one row actually represent?",
      "Missingness is a clue, not just an inconvenience. A column missing more often for new customers may be telling you about the signup flow. A sudden change in category spelling may be telling you the upstream form changed.",
    ],
    time: 35,
    video: {
      label: "Complete Python Pandas data science tutorial",
      href: "https://www.youtube.com/watch?v=vmEHCJofslg",
      author: "Keith Galli",
    },
    learn: [
      "Missingness can be signal, random noise, or a collection failure.",
      "Duplicates and identifiers can leak information.",
      "A target distribution sets expectations for metrics and baselines.",
    ],
    practice:
      "Produce a data report with schema, null rate, ranges, cardinality, duplicates, target balance, and a few representative rows.",
    pitfalls: [
      "Dropping nulls without measuring the impact.",
      "Treating IDs as ordinary features.",
      "Ignoring changes in how the data was collected.",
    ],
    checklist: ["Document every column.", "Measure nulls and duplicates.", "Inspect target balance."],
    resources: [
      {
        label: "pandas getting started",
        href: "https://pandas.pydata.org/docs/getting_started/index.html",
        kind: "reference",
      },
      { label: "Kaggle data cleaning", href: "https://www.kaggle.com/learn/data-cleaning", kind: "practice" },
    ],
  },
  {
    id: "split",
    module: "data",
    title: "Split data honestly",
    question: "Will this validation result survive deployment?",
    summary:
      "A split estimates future behavior. Time, groups, repeated users, and leakage determine whether a random split is honest.",
    intro: [
      "A split is a time machine. You hide part of the present, train on the rest, and ask the model to predict the hidden part. If the hidden part is secretly similar to the training part, the machine is lying to you.",
      "Random splits assume rows are independent. Customers, sessions, and days usually are not. When the future matters, split by time. When the same person appears twice, split by person. The rule is simple: the validation setup should look like deployment, not like a shuffled spreadsheet.",
    ],
    time: 30,
    video: {
      label: "Machine Learning Fundamentals: Cross Validation",
      href: "https://www.youtube.com/watch?v=fSytzGwwBVw",
      author: "StatQuest",
    },
    learn: [
      "Training fits parameters; validation selects decisions; test is the final audit.",
      "Group splits protect repeated entities such as customers or sessions.",
      "Time splits simulate the future when patterns or labels evolve.",
    ],
    practice:
      "Create random, group, and temporal splits. Choose the one that mirrors deployment and write down why the others would lie.",
    pitfalls: [
      "Preprocessing the full dataset before the split.",
      "Tuning repeatedly on the test set.",
      "Splitting rows instead of customers or sessions.",
    ],
    checklist: ["Define independence.", "Freeze a test set.", "Keep transforms inside folds."],
    resources: [
      {
        label: "scikit-learn cross-validation",
        href: "https://scikit-learn.org/stable/modules/cross_validation.html",
        kind: "reference",
      },
      {
        label: "Common pitfalls",
        href: "https://scikit-learn.org/stable/common_pitfalls.html",
        kind: "guide",
      },
    ],
    article: "good-vs-bad-models",
  },
  {
    id: "vectors",
    module: "math",
    title: "Vectors, matrices, and the dot product",
    question: "What shape is the information flowing through?",
    summary:
      "Rows are feature vectors and datasets are matrices. These structures make weighted predictions and transformations efficient.",
    intro: [
      "A dataset is a spreadsheet. A feature vector is one row. A matrix is the whole spreadsheet. That is most of the linear algebra you need on day one, and it is enough to debug a surprising number of shape errors.",
      "The dot product is the star of the show: it multiplies matching entries and adds them up. In ML it is a weighted vote. Each feature casts a vote, each weight says how much that vote counts, and the total is the score.",
    ],
    time: 30,
    video: {
      label: "Vectors — Essence of Linear Algebra, Chapter 1",
      href: "https://www.youtube.com/watch?v=fNk_zzaMoSs",
      author: "3Blue1Brown",
    },
    math: [
      {
        title: "A prediction is a weighted sum",
        formula: String.raw`\hat{y} = \mathbf{w}\cdot\mathbf{x} + b = \sum_{i=1}^{n} w_i x_i + b`,
        caption:
          "The dot product is the core of linear models, neural network layers, and similarity search. Learn it once, see it everywhere.",
      },
      {
        title: "Many rows, one transformation",
        formula: String.raw`\mathbf{X}\mathbf{W} \quad\text{has shape}\quad (n \times d)(d \times k) = (n \times k)`,
        caption:
          "Matrix multiplication applies the same weighted sum to every row. The inner dimensions must match; the outer dimensions are the result.",
      },
    ],
    learn: [
      "A dot product is a weighted sum.",
      "Matrix multiplication applies the same transformation to many rows.",
      "Scale changes distances and the geometry of optimization.",
    ],
    practice:
      "Calculate dot products, matrix multiplication, cosine similarity, and standardized features in NumPy. Print every shape along the way.",
    pitfalls: ["Losing track of dimensions.", "Mixing up rows and columns.", "Ignoring scale."],
    checklist: ["Know the shapes of X, y, weights, predictions.", "Explain the dot product.", "Standardize when scale matters."],
    resources: [
      {
        label: "3Blue1Brown linear algebra",
        href: "https://www.3blue1brown.com/topics/linear-algebra",
        kind: "video",
      },
      { label: "NumPy quickstart", href: "https://numpy.org/doc/stable/user/quickstart.html", kind: "reference" },
    ],
  },
  {
    id: "stats",
    module: "math",
    title: "Statistics and uncertainty",
    question: "How certain should you be about a score?",
    summary:
      "Statistics separates stable signal from sampling noise. Learn base rates, distributions, intervals, and why one metric is never the full story.",
    intro: [
      "A single number is a story with the ending missing. A model that scores 0.84 on one split might score 0.79 or 0.88 on the next, and the difference may have nothing to do with the model.",
      "The mean is a summary, not a truth. The median laughs at outliers. The variance tells you how much the mean is hiding. And the base rate — how common the positive class is — changes what almost every metric means.",
    ],
    time: 35,
    video: {
      label: "The Central Limit Theorem, Clearly Explained",
      href: "https://www.youtube.com/watch?v=YAlJCEDH2uY",
      author: "StatQuest",
    },
    math: [
      {
        title: "Mean and variance",
        formula: String.raw`\bar{x} = \frac{1}{n}\sum_{i=1}^{n} x_i, \qquad \sigma^2 = \frac{1}{n-1}\sum_{i=1}^{n}(x_i-\bar{x})^2`,
        caption:
          "Variance is the average squared distance from the mean. Large variance means one summary number is doing a lot of quiet lying.",
      },
    ],
    learn: [
      "A mean hides skew and subgroups.",
      "Base rates change how metrics should be read.",
      "Repeated splits show metric variation instead of a single lucky number.",
    ],
    practice:
      "Bootstrap a confidence interval for your metric and compare performance across meaningful user slices.",
    pitfalls: [
      "Reporting one score with no spread.",
      "Using accuracy on rare positives.",
      "Reading correlation as cause.",
    ],
    checklist: ["Inspect distributions.", "Check prevalence.", "Report variation."],
    resources: [
      {
        label: "StatQuest statistics playlist",
        href: "https://www.youtube.com/playlist?list=PLblh5JKOoLUK0FLuzwntyYI10UQFUhsY9",
        kind: "video",
      },
      {
        label: "scikit-learn metrics",
        href: "https://scikit-learn.org/stable/modules/model_evaluation.html",
        kind: "reference",
      },
    ],
  },
  {
    id: "gradient",
    module: "math",
    title: "Gradient descent",
    question: "How does a model learn from error?",
    summary:
      "A loss measures error; a gradient measures how parameters change that error. Optimization moves parameters in the direction that reduces loss.",
    intro: [
      "Imagine hiking in fog. You cannot see the valley, but you can feel the slope under your feet. Take a step downhill. Repeat. That is gradient descent, minus the boots and the bad decisions.",
      "The loss is your altitude. The gradient is the direction of steepest uphill, so you walk the other way. The learning rate is your stride: too small and you crawl, too large and you leap past the valley into a worse one.",
    ],
    time: 30,
    video: {
      label: "Gradient descent, how neural networks learn",
      href: "https://www.youtube.com/watch?v=IHZwWFHWa-w",
      author: "3Blue1Brown",
    },
    math: [
      {
        title: "The loss",
        formula: String.raw`J(\theta) = \frac{1}{n}\sum_{i=1}^{n}\left(\hat{y}_i - y_i\right)^2`,
        caption:
          "Mean squared error turns many individual mistakes into one number the optimizer can improve.",
      },
      {
        title: "The update",
        formula: String.raw`\theta_{t+1} = \theta_t - \eta\,\nabla_\theta J(\theta_t)`,
        caption:
          "Subtract a small multiple of the gradient. The learning rate η controls how aggressively you move.",
      },
    ],
    learn: [
      "Loss turns many errors into one objective.",
      "The gradient is local sensitivity for each parameter.",
      "Learning rate can converge, crawl, or diverge.",
    ],
    practice:
      "Implement linear regression in NumPy and compare loss curves for a small, useful, and unstable learning rate.",
    pitfalls: [
      "Never plotting the loss.",
      "Ignoring feature scale.",
      "Equating lower training loss with better generalization.",
    ],
    checklist: ["Plot train and validation loss.", "Check divergence.", "Explain one update."],
    resources: [
      { label: "Our gradient descent article", href: "/learn/gradient-descent", internal: true, kind: "guide" },
      { label: "3Blue1Brown neural networks", href: "https://www.3blue1brown.com/topics/neural-networks", kind: "video" },
    ],
    article: "gradient-descent",
    simulation: "gradient-descent",
    cheatsheet: "gradient-descent",
  },
  {
    id: "baseline",
    module: "classical",
    title: "Build a baseline",
    question: "What is the simplest model that can win?",
    summary:
      "A baseline reveals whether there is signal and makes model complexity earn its cost.",
    intro: [
      "Before you build a Ferrari, check whether a bicycle already gets there. A baseline is the bicycle: predict the mean, predict the majority class, or use last week's value. It is embarrassingly simple and it keeps you honest.",
      "If a fancy model cannot beat the baseline, the problem is usually not the model. It is the labels, the split, the features, or the fact that there is simply no signal to find. That is a useful answer too.",
    ],
    time: 25,
    video: {
      label: "Bias and Variance",
      href: "https://www.youtube.com/watch?v=EuBBz3bI-aA",
      author: "StatQuest",
    },
    math: [
      {
        title: "The laziest regression",
        formula: String.raw`\hat{y} = \bar{y} \qquad \text{and} \qquad \hat{p} = \frac{\#\{\,y_i = 1\,\}}{n}`,
        caption:
          "Predict the average for regression, the positive rate for classification. Any real model should beat this on the same split.",
      },
    ],
    learn: [
      "Dummy estimators measure naive performance.",
      "Simple models are quick to debug.",
      "Complexity needs validation gain and operational justification.",
    ],
    practice:
      "Compare a dummy estimator, a linear model, and a tree under one fixed evaluation protocol. Record what each adds.",
    pitfalls: [
      "Skipping the dummy model.",
      "Adding complexity before checking the labels.",
      "Comparing models trained on different splits.",
    ],
    checklist: ["Fit a dummy model.", "Set a threshold.", "Log the split."],
    resources: [
      {
        label: "scikit-learn dummy estimators",
        href: "https://scikit-learn.org/stable/modules/model_evaluation.html#dummy-estimators",
        kind: "reference",
      },
      { label: "Our model comparison", href: "/model-comparison", internal: true, kind: "guide" },
    ],
    article: "good-vs-bad-models",
  },
  {
    id: "linear",
    module: "classical",
    title: "Linear regression",
    question: "When is a weighted relationship enough?",
    summary:
      "Linear regression is fast, interpretable, and often a very strong numeric-prediction baseline. Residuals reveal where its assumptions miss reality.",
    intro: [
      "Linear regression draws the straight line that makes the total squared error as small as possible. It is the plain white shirt of ML: unglamorous, reusable, and right more often than people admit.",
      "Each coefficient is a conditional association: change one feature by one unit while the others stay fixed, and the prediction moves by roughly that amount. That is useful, but it is not a causal guarantee. The world rarely holds everything else fixed.",
    ],
    time: 35,
    video: {
      label: "Linear Regression, Clearly Explained",
      href: "https://www.youtube.com/watch?v=nk2CQITm_eo",
      author: "StatQuest",
    },
    math: [
      {
        title: "The model",
        formula: String.raw`\hat{y} = w_1x_1 + w_2x_2 + \cdots + w_dx_d + b`,
        caption:
          "A weighted sum plus an intercept. Simple, fast, and surprisingly hard to beat when the relationship is roughly linear.",
      },
      {
        title: "The objective",
        formula: String.raw`\min_{\mathbf{w},b}\;\sum_{i=1}^{n}\left(y_i - \hat{y}_i\right)^2`,
        caption:
          "Least squares chooses the line with the smallest total squared residual. Squaring punishes large misses more than small ones.",
      },
    ],
    learn: [
      "Coefficients are conditional associations, not causal guarantees.",
      "Residual plots reveal nonlinearity and unusual examples.",
      "Ridge adds L2 regularization for stability.",
    ],
    practice:
      "Compare linear and ridge regression. Plot residuals and explain the effect of alpha on coefficients.",
    pitfalls: [
      "Treating coefficients as causal proof.",
      "Ignoring residuals.",
      "Regularizing unscaled features.",
    ],
    checklist: ["Inspect residuals.", "Compare ridge.", "Check subgroups."],
    resources: [
      { label: "Our linear regression guide", href: "/learn/linear-regression", internal: true, kind: "guide" },
      { label: "scikit-learn linear models", href: "https://scikit-learn.org/stable/modules/linear_model.html", kind: "reference" },
    ],
    article: "linear-regression",
    simulation: "linear-regression",
    cheatsheet: "linear-regression",
  },
  {
    id: "logistic",
    module: "classical",
    title: "Logistic regression and thresholds",
    question: "What should a predicted probability trigger?",
    summary:
      "Classification produces a score; a threshold turns it into a decision. The right threshold depends on error costs, capacity, prevalence, and calibration.",
    intro: [
      "Linear regression will happily predict minus four hundred or plus one million. Logistic regression puts the output through a sigmoid, squashing it into the zero-to-one range so it can be read as a probability.",
      "The model gives you a score. You give the score a job. Moving the threshold changes the trade-off between false alarms and missed positives, and 0.5 is not a law of nature. It is a default that somebody forgot to question.",
    ],
    time: 40,
    video: {
      label: "Logistic Regression",
      href: "https://www.youtube.com/watch?v=yIYKR4sgzI8",
      author: "StatQuest",
    },
    math: [
      {
        title: "The sigmoid",
        formula: String.raw`\sigma(z) = \frac{1}{1 + e^{-z}}, \qquad z = \mathbf{w}\cdot\mathbf{x} + b`,
        caption:
          "The sigmoid maps any real-valued score into (0, 1). Large positive scores approach 1; large negative scores approach 0.",
      },
      {
        title: "Log-odds",
        formula: String.raw`\log\frac{p}{1-p} = \mathbf{w}\cdot\mathbf{x} + b`,
        caption:
          "Logistic regression is linear in log-odds, not in probability. That is why coefficients change the odds multiplicatively.",
      },
    ],
    learn: [
      "Precision and recall answer different questions.",
      "ROC-AUC ranks; PR-AUC is often stronger for rare positives.",
      "Calibration checks whether probabilities mean what they say.",
    ],
    practice:
      "Plot PR and calibration curves, then choose a threshold from an explicit cost table for your problem.",
    pitfalls: [
      "Using accuracy for rare events.",
      "Assuming 0.5 is a special threshold.",
      "Confusing ranking quality with calibration.",
    ],
    checklist: ["Compare thresholds.", "Choose a metric from cost.", "Check calibration."],
    resources: [
      { label: "Our logistic regression guide", href: "/learn/logistic-regression", internal: true, kind: "guide" },
      { label: "scikit-learn calibration", href: "https://scikit-learn.org/stable/modules/calibration.html", kind: "reference" },
    ],
    article: "logistic-regression",
    simulation: "logistic-regression",
    cheatsheet: "logistic-regression",
  },
  {
    id: "trees",
    module: "classical",
    title: "Decision trees",
    question: "When should a model split instead of draw a line?",
    summary:
      "Trees learn nonlinear rules and interactions, but deep trees can memorize training data quickly.",
    intro: [
      "A decision tree is a flowchart learned from data. At each node it asks the yes/no question that makes the two groups as pure as possible. Keep asking until the groups are useful or the tree runs out of manners.",
      "Trees are wonderful because they can capture thresholds and interactions without you engineering them by hand. They are dangerous for the same reason: give one enough depth and it will memorize the training set, including the noise.",
    ],
    time: 30,
    video: {
      label: "Decision Trees",
      href: "https://www.youtube.com/watch?v=7VeUPuFGJHk",
      author: "StatQuest",
    },
    math: [
      {
        title: "Gini impurity",
        formula: String.raw`G = 1 - \sum_{k=1}^{K} p_k^2`,
        caption:
          "A split is good when the child nodes are purer than the parent. Gini is one common way to score that purity.",
      },
    ],
    learn: [
      "Splits reduce impurity or error.",
      "Depth and pruning control memorization.",
      "Feature importance is not causal importance.",
    ],
    practice:
      "Train shallow, medium, and unlimited-depth trees. Compare train/validation gaps and inspect the actual paths.",
    pitfalls: ["Unbounded depth.", "Reading importance causally.", "Ignoring unstable splits."],
    checklist: ["Tune depth with CV.", "Compare against baseline.", "Inspect paths."],
    resources: [
      { label: "Our decision trees guide", href: "/learn/decision-trees", internal: true, kind: "guide" },
      { label: "scikit-learn trees", href: "https://scikit-learn.org/stable/modules/tree.html", kind: "reference" },
    ],
    article: "decision-trees",
    simulation: "decision-trees",
    cheatsheet: "decision-trees",
  },
  {
    id: "ensembles",
    module: "classical",
    title: "Random forests and boosting",
    question: "When do many models beat one?",
    summary:
      "Random forests average diverse trees; boosting corrects prior errors sequentially. Both can excel on tabular data but still need validation, latency budgets, and restraint.",
    intro: [
      "One tree is opinionated. A forest is a committee: many trees, each trained on a slightly different view of the data, then averaged. The committee is usually calmer and more accurate than any single member.",
      "Boosting works differently. It builds trees in sequence, and each new tree focuses on the mistakes the previous ones made. Random forests reduce variance; boosting reduces bias. Both can be brilliant, and both can be tuned into a small overfitting factory.",
    ],
    time: 40,
    video: {
      label: "Random Forests, Part 1",
      href: "https://www.youtube.com/watch?v=J4Wdy0Wc_xQ",
      author: "StatQuest",
    },
    math: [
      {
        title: "Bagging averages",
        formula: String.raw`\hat{y}(\mathbf{x}) = \frac{1}{B}\sum_{b=1}^{B} f_b(\mathbf{x})`,
        caption:
          "Train B trees on resampled data and average their predictions. Diversity is the point; identical trees add nothing.",
      },
      {
        title: "Boosting adds corrections",
        formula: String.raw`F_m(\mathbf{x}) = F_{m-1}(\mathbf{x}) + \nu\,h_m(\mathbf{x})`,
        caption:
          "Each new tree h_m fits the remaining error, and ν (the learning rate) keeps the steps small.",
      },
    ],
    learn: [
      "Bagging reduces variance.",
      "Boosting improves residual errors.",
      "Depth, learning rate, and early stopping control complexity.",
    ],
    practice:
      "Compare random forest and gradient boosting on fixed folds. Tune only two parameters with a written hypothesis for each.",
    pitfalls: [
      "Blind hyperparameter sweeps.",
      "Different folds for each model.",
      "Ignoring inference time.",
    ],
    checklist: ["Use CV.", "Use early stopping.", "Measure latency."],
    resources: [
      { label: "scikit-learn ensembles", href: "https://scikit-learn.org/stable/modules/ensemble.html", kind: "reference" },
      { label: "XGBoost tutorials", href: "https://xgboost.readthedocs.io/en/stable/tutorials/index.html", kind: "practice" },
    ],
  },
  {
    id: "knn-svm",
    module: "classical",
    title: "KNN, SVMs, and the meaning of similarity",
    question: "What does similarity mean in your data?",
    summary:
      "KNN and SVMs depend on geometry. They can be excellent when scaling, distance, margin, and representation match the task.",
    intro: [
      "K-nearest neighbors asks a very human question: who are you standing next to? To predict a new point, it finds the closest training examples and lets them vote. No equation is learned; the dataset is the model.",
      "A support vector machine asks a different question: where is the widest street between the classes? It chooses the boundary with the largest margin, which tends to generalize well. Kernels let that street bend without leaving the math behind.",
    ],
    time: 35,
    video: {
      label: "K-nearest neighbors, Clearly Explained",
      href: "https://www.youtube.com/watch?v=HVXime0nQeI",
      author: "StatQuest",
    },
    math: [
      {
        title: "Distance in KNN",
        formula: String.raw`d(\mathbf{x},\mathbf{z}) = \sqrt{\sum_{j=1}^{d}(x_j - z_j)^2}`,
        caption:
          "Euclidean distance is the default, but it only means something if the features are on comparable scales.",
      },
      {
        title: "The margin",
        formula: String.raw`\mathbf{w}\cdot\mathbf{x} + b = 0, \qquad \text{margin} = \frac{2}{\lVert \mathbf{w}\rVert}`,
        caption:
          "SVMs maximize the gap between the boundary and the nearest points. Those nearest points are the support vectors.",
      },
    ],
    learn: [
      "KNN predicts from nearby examples.",
      "SVMs maximize a margin.",
      "High dimensions make raw distance less informative.",
    ],
    practice:
      "Run KNN with and without scaling. Then vary SVM C and gamma and record the boundary and validation score.",
    pitfalls: [
      "Unscaled distance features.",
      "Ignoring KNN inference cost.",
      "Treating kernel settings as magic.",
    ],
    checklist: ["Scale features.", "Test sensitivity.", "Measure prediction cost."],
    resources: [
      { label: "Our KNN guide", href: "/learn/k-nearest-neighbors", internal: true, kind: "guide" },
      { label: "Our kernel trick guide", href: "/learn/kernel-trick", internal: true, kind: "guide" },
    ],
    article: "k-nearest-neighbors",
    simulation: "k-nearest-neighbors",
    cheatsheet: "k-nearest-neighbors",
  },
  {
    id: "eval",
    module: "mlops",
    title: "Evaluate like an engineer",
    question: "How do you know an improvement is real?",
    summary:
      "Evaluation is testing: fixed inputs, a declared protocol, meaningful slices, and reproducible evidence.",
    intro: [
      "A score is a claim. Evaluation is the cross-examination. Did the improvement survive a different split? Does it hold for the subgroup that matters? Is it larger than the noise you measured last week?",
      "Accuracy is a terrible narrator for rare events. Precision asks how often a positive prediction is right. Recall asks how many real positives you found. F1 balances them, but no single number can tell you whether the model is useful in the world.",
    ],
    time: 35,
    video: {
      label: "ROC and AUC, Clearly Explained",
      href: "https://www.youtube.com/watch?v=4jRBRDbJemM",
      author: "StatQuest",
    },
    math: [
      {
        title: "Precision and recall",
        formula: String.raw`\text{precision} = \frac{TP}{TP+FP}, \qquad \text{recall} = \frac{TP}{TP+FN}`,
        caption:
          "Precision is trust in a positive prediction; recall is coverage of the real positives. You usually trade one for the other.",
      },
      {
        title: "F1",
        formula: String.raw`F_1 = 2\cdot\frac{\text{precision}\cdot\text{recall}}{\text{precision}+\text{recall}}`,
        caption:
          "The harmonic mean punishes lopsided models. It is a summary, not a substitute for looking at the confusion matrix.",
      },
    ],
    learn: [
      "Cross-validation estimates variation.",
      "Slice metrics reveal hidden failures.",
      "Regression tests pin known behavior.",
    ],
    practice:
      "Create an evaluation report with overall score, slice scores, spread, reviewed mistakes, and a release decision.",
    pitfalls: ["One average metric.", "No high-impact slices.", "Unsaved predictions."],
    checklist: ["Freeze evaluation data.", "Set quality gates.", "Review errors."],
    resources: [
      {
        label: "scikit-learn evaluation",
        href: "https://scikit-learn.org/stable/modules/model_evaluation.html",
        kind: "reference",
      },
      {
        label: "Rules of ML",
        href: "https://developers.google.com/machine-learning/guides/rules-of-ml",
        kind: "guide",
      },
    ],
  },
  {
    id: "regularization",
    module: "mlops",
    title: "Beat overfitting with L1 and L2",
    question: "How do I make the model learn signal, not noise?",
    summary:
      "Regularization modifies the objective so unnecessary complexity is expensive. It reduces variance at the cost of some bias, so strength must be selected through validation.",
    intro: [
      "Overfitting is memorizing the practice test. The model gets better and better on data it has seen while quietly getting worse on data it has not. Regularization makes complicated answers expensive, so the model prefers simpler ones unless the evidence is strong.",
      "L1 adds the absolute value of the weights to the loss, and that tends to push some weights all the way to zero. L2 adds squared weights, shrinking everything smoothly. Neither is magic; both need a strength chosen inside cross-validation.",
    ],
    time: 30,
    video: {
      label: "Regularization Part 1: Ridge (L2) Regression",
      href: "https://www.youtube.com/watch?v=Q81RR3yKn30",
      author: "StatQuest",
    },
    math: [
      {
        title: "L1 and L2 penalties",
        formula: String.raw`J_{\text{L1}} = J + \lambda\sum_j |w_j|, \qquad J_{\text{L2}} = J + \lambda\sum_j w_j^2`,
        caption:
          "L1 encourages sparsity; L2 encourages small, spread-out weights. λ controls how much you care about simplicity.",
      },
    ],
    learn: [
      "L1 penalizes absolute weights and can make coefficients exactly zero.",
      "L2 penalizes squared weights and smoothly shrinks correlated features.",
      "Tune regularization strength inside cross-validation.",
    ],
    practice:
      "Compare unregularized, L1, and L2 logistic regression. Report the train/validation gap, coefficient count, calibration, and selected strength.",
    pitfalls: [
      "Tuning strength on the test set.",
      "Scaling outside a pipeline.",
      "Assuming L1 always chooses the truth.",
    ],
    checklist: ["Use a pipeline.", "Tune with CV.", "Report both train and validation."],
    resources: [
      {
        label: "Our good vs bad models article",
        href: "/learn/good-vs-bad-models",
        internal: true,
        kind: "guide",
      },
      {
        label: "scikit-learn logistic regression",
        href: "https://scikit-learn.org/stable/modules/linear_model.html#logistic-regression",
        kind: "reference",
      },
    ],
    article: "good-vs-bad-models",
  },
  {
    id: "features",
    module: "data",
    title: "Engineer features safely",
    question: "Can the model see useful signal at prediction time?",
    summary:
      "Feature engineering is domain reasoning plus strict time discipline. Every transform must be reproducible in training and serving.",
    intro: [
      "Features are the model's senses. If the signal is not in the features at prediction time, no algorithm can invent it. A brilliant model staring at a useless column is just an expensive random number generator.",
      "The dangerous part is time. A feature that looks predictive in training may be a ghost from the future: a cancellation reason, a post-purchase survey, a label that only exists after the outcome. If it will not exist at serving time, it does not exist.",
    ],
    time: 40,
    video: {
      label: "Decision Trees, Part 2 — Feature Selection and Missing Data",
      href: "https://www.youtube.com/watch?v=wpNl-JwwplA",
      author: "StatQuest",
    },
    learn: [
      "Encode dates, text, categories, and numbers inside a pipeline.",
      "Interactions must earn their complexity through validation.",
      "Feature source and timing are part of the specification.",
    ],
    practice:
      "Create three features, document their source and availability, then evaluate them through one pipeline.",
    pitfalls: [
      "Fitting encoders globally.",
      "Unsafe target encoding.",
      "Features that are unavailable at serving time.",
    ],
    checklist: ["Document feature timing.", "Fit transforms inside folds.", "Measure marginal value."],
    resources: [
      { label: "scikit-learn compose", href: "https://scikit-learn.org/stable/modules/compose.html", kind: "reference" },
      { label: "Our pipeline guide", href: "/learn/pipeline", internal: true, kind: "guide" },
    ],
    article: "pipeline",
    cheatsheet: "pipeline",
  },
  {
    id: "tests",
    module: "data",
    title: "Test data and pipelines",
    question: "What breaks before a score moves?",
    summary:
      "Data contracts and pipeline tests catch the failures that model metrics cannot: schema changes, impossible ranges, bad transforms, and serving mismatch.",
    intro: [
      "A model that works only on your laptop is a demo. Tests are how you keep it working after you forget why it worked, after a dependency upgrades, and after a well-meaning teammate renames a column.",
      "You do not need a giant test suite. You need a few sharp ones: a schema check, an edge-case transform check, a known-prediction check, and a leakage check. Those catch the failures that quietly ruin a score.",
    ],
    time: 35,
    video: {
      label: "Python Testing: A Beginner's Guide to Pytest",
      href: "https://www.youtube.com/watch?v=Kt6QqGoAlvI",
      author: "teclado",
    },
    learn: [
      "Unit tests verify local transforms.",
      "Data tests guard schema, range, null rate, and freshness.",
      "Golden examples prevent behavior regressions.",
    ],
    practice:
      "Write one schema test, one preprocessing edge-case test, one known-prediction test, and one leakage test.",
    pitfalls: [
      "Testing imports only.",
      "Exact float assertions everywhere.",
      "Different train and serve transforms.",
    ],
    checklist: ["Test edge inputs.", "Run tests in CI.", "Keep a golden dataset."],
    resources: [
      { label: "pytest docs", href: "https://docs.pytest.org/en/stable/", kind: "reference" },
      { label: "Great Expectations", href: "https://docs.greatexpectations.io/", kind: "practice" },
    ],
    article: "pipeline",
  },
  {
    id: "experiments",
    module: "data",
    title: "Track experiments",
    question: "Can you explain why this model exists?",
    summary:
      "A run is code, data, parameters, metrics, artifacts, and a decision. Tracking converts trial-and-error into evidence.",
    intro: [
      "An experiment without a record is a rumor. Three weeks later, nobody remembers which preprocessing changed, which split was used, or why the second-best run was abandoned. The model still works, but the reasoning is gone.",
      "A run should answer a question. Name it after the question, log the data version and parameters, save the full pipeline, and write one sentence about what you learned. The goal is not a tidy dashboard; it is a trail you can follow backward.",
    ],
    time: 30,
    video: {
      label: "MLflow: A Quickstart Guide",
      href: "https://www.youtube.com/watch?v=cjeCAoW83_U",
      author: "Pierce Portfolio",
    },
    learn: [
      "Log parameters, metrics, plots, dataset version, and artifacts together.",
      "Name runs after the question being tested.",
      "Persist the complete preprocessing-plus-model pipeline.",
    ],
    practice:
      "Run three intentional experiments, log each, and state what each taught you before selecting one.",
    pitfalls: ["Logging only the final score.", "Comparing mismatched datasets.", "Model artifacts with no lineage."],
    checklist: ["Record data version.", "Log parameters.", "Save the full artifact."],
    resources: [
      { label: "MLflow tracking", href: "https://mlflow.org/docs/latest/ml/tracking/", kind: "reference" },
      { label: "DVC documentation", href: "https://dvc.org/doc", kind: "reference" },
    ],
  },
  {
    id: "neural",
    module: "deep",
    title: "Neural network intuition",
    question: "What are layers actually learning?",
    summary:
      "Networks stack differentiable transformations. Backpropagation assigns error to parameters; architecture and regularization shape which representations can emerge.",
    intro: [
      "A neural network is a stack of weighted sums and squishes. Each layer reshapes the data into something the next layer can use. Early layers might learn edges; later layers combine them into faces, words, or fraud patterns.",
      "Backpropagation is the chain rule with good bookkeeping. It asks how much each weight contributed to the final error and nudges it in the helpful direction. Training is still gradient descent; the network just has more knobs.",
    ],
    time: 45,
    video: {
      label: "But what is a neural network?",
      href: "https://www.youtube.com/watch?v=aircAruvnKk",
      author: "3Blue1Brown",
    },
    math: [
      {
        title: "One neuron",
        formula: String.raw`a = \phi\left(\sum_{i=1}^{n} w_i x_i + b\right)`,
        caption:
          "A weighted sum followed by a nonlinear activation φ. Stack many of these and the composition becomes expressive.",
      },
    ],
    learn: [
      "Layers transform activations through weights and nonlinearities.",
      "Backpropagation applies the chain rule through the graph.",
      "Learning rate, batch size, weight decay, and augmentation control training.",
    ],
    practice:
      "Train a small PyTorch network and change one of learning rate, batch size, or weight decay while plotting validation loss.",
    pitfalls: ["No validation curve.", "Big model before data checks.", "Ignoring reproducibility."],
    checklist: ["Understand the forward pass.", "Plot validation behavior.", "Use an overfit control."],
    resources: [
      { label: "PyTorch basics", href: "https://pytorch.org/tutorials/beginner/basics/intro.html", kind: "practice" },
      { label: "3Blue1Brown neural networks", href: "https://www.3blue1brown.com/topics/neural-networks", kind: "video" },
    ],
  },
  {
    id: "transformer",
    module: "model-types",
    title: "Transformers and attention",
    question: "Why can attention models work with long sequences?",
    summary:
      "Transformers use attention to build context-dependent token representations. Queries, keys, and values decide what each position should look at.",
    intro: [
      "Attention lets every token look at every other token and decide who is relevant. In the sentence 'the bank raised its rates', the word bank should lean on raised and rates, not on river. Attention learns that leaning.",
      "A transformer stacks attention and feed-forward layers into a deep contextual machine. Positional information tells it where tokens sit, residual connections keep gradients flowing, and multiple heads let it track several relationships at once.",
    ],
    time: 40,
    video: {
      label: "Attention in transformers, step-by-step",
      href: "https://www.youtube.com/watch?v=eMlx5fFNoYc",
      author: "3Blue1Brown",
    },
    math: [
      {
        title: "Scaled dot-product attention",
        formula: String.raw`\text{Attention}(Q,K,V) = \text{softmax}\left(\frac{QK^\top}{\sqrt{d_k}}\right)V`,
        caption:
          "Queries and keys decide who attends to whom; the softmax turns those scores into weights; V carries the content.",
      },
    ],
    learn: [
      "Attention weights combine information across positions.",
      "Multiple heads learn different relationship patterns.",
      "Position encoding and residuals make deep stacks trainable.",
    ],
    practice:
      "Implement one scaled dot-product attention head with small random tensors and verify the output shape before adding a second head.",
    pitfalls: [
      "Forgetting masks and letting future tokens leak in.",
      "Ignoring sequence length and attention cost.",
      "Treating attention weights as a complete explanation.",
    ],
    checklist: ["Check Q, K, V shapes.", "Verify the mask.", "Explain one head."],
    resources: [
      { label: "The Illustrated Transformer", href: "https://jalammar.github.io/illustrated-transformer/", kind: "guide" },
      { label: "Attention Is All You Need", href: "https://arxiv.org/abs/1706.03762", kind: "reference" },
    ],
  },
  {
    id: "llm-evals",
    module: "llm-apps",
    title: "Evaluate AI applications",
    question: "How do you improve an LLM app without vibes?",
    summary:
      "Build the evaluation set before changing prompts, retrieval, or the model. Measure task quality, groundedness, safety, latency, and cost separately.",
    intro: [
      "A fluent answer is not a correct answer. Language models are confident interns, not databases. They will happily invent a citation, misread a table, or agree with a false premise unless the system around them makes that hard.",
      "Evaluation is how you stop tuning by anecdote. Write the test set first: representative questions, hard edge cases, and the failures that would actually hurt someone. Then every prompt, retrieval, or model change gets the same exam.",
    ],
    time: 40,
    video: {
      label: "Intro to Large Language Models",
      href: "https://www.youtube.com/watch?v=zjkBMFhNj_g",
      author: "Andrej Karpathy",
    },
    learn: [
      "Representative evals include hard, ambiguous, and high-risk cases.",
      "Automated checks need periodic human calibration.",
      "Release gates should protect high-severity failures.",
    ],
    practice:
      "Create 30 representative prompts with expected facts or a rubric. Score a baseline, inspect failures, then make one targeted change.",
    pitfalls: [
      "Prompt changes without a fixed eval.",
      "Uncalibrated LLM-as-judge.",
      "Optimizing average score only.",
    ],
    checklist: ["Version eval data.", "Categorize failures.", "Set release gates."],
    resources: [
      { label: "OpenAI evals guide", href: "https://platform.openai.com/docs/guides/evals", kind: "reference" },
      { label: "Hugging Face evaluate", href: "https://huggingface.co/docs/evaluate/index", kind: "reference" },
    ],
  },
  {
    id: "fastapi",
    module: "backend",
    title: "Serve with FastAPI",
    question: "How does a trained model become a dependable API?",
    summary:
      "A model service validates inputs, loads one versioned artifact, performs identical preprocessing, returns a stable contract, and emits useful telemetry.",
    intro: [
      "A model in a notebook is a science fair project. An API is a product. Someone else's code will call it at an inconvenient hour and expect an answer in milliseconds, not a stack trace.",
      "FastAPI makes the contract explicit. Pydantic validates the input, the response schema stays stable, and the model loads once at startup. The important part is not the framework; it is that training and serving run the exact same preprocessing.",
    ],
    time: 45,
    video: {
      label: "FastAPI Course for Beginners",
      href: "https://www.youtube.com/watch?v=tLKKmouUams",
      author: "freeCodeCamp.org",
    },
    learn: [
      "Pydantic creates explicit input and output contracts.",
      "Load models at startup, not per request.",
      "Health checks, timeouts, structured errors, and version logging are product behavior.",
    ],
    practice:
      "Build health and predict endpoints for a saved pipeline with validation, timing, and a model version in the response.",
    pitfalls: [
      "Loading the model per request.",
      "Unvalidated JSON.",
      "Reimplementing preprocessing in API code.",
    ],
    checklist: ["Validate schema.", "Return stable fields.", "Log latency and version."],
    resources: [
      { label: "FastAPI tutorial", href: "https://fastapi.tiangolo.com/tutorial/", kind: "practice" },
      { label: "Our prediction API guide", href: "/learn/first-project", internal: true, kind: "guide" },
    ],
    article: "first-project",
  },
  {
    id: "optimize",
    module: "advanced",
    title: "Optimize inference",
    question: "Where are time, memory, and money actually going?",
    summary:
      "Optimization is a measurement loop: define a target, profile the actual bottleneck, change one thing, and verify both performance and quality.",
    intro: [
      "Fast is a measurement, not a feeling. A service that feels snappy on your laptop can melt under twenty concurrent requests, and a model that takes 40 milliseconds on average can still ruin someone's day at the 99th percentile.",
      "Profile before you optimize. The bottleneck is often not where the intuition points: it might be JSON parsing, a pandas copy, a cold model load, or a database call pretending to be a model problem.",
    ],
    time: 40,
    video: {
      label: "Profiling and optimizing PyTorch applications",
      href: "https://www.youtube.com/watch?v=8Rr_8jy1_GY",
      author: "PyTorch",
    },
    math: [
      {
        title: "Latency, concurrency, throughput",
        formula: String.raw`\text{throughput} \approx \frac{\text{concurrency}}{\text{latency}}`,
        caption:
          "Little's law in a practical costume. If latency doubles and concurrency stays fixed, throughput roughly halves.",
      },
    ],
    learn: [
      "Latency and throughput are different measures.",
      "p95 and p99 show tail pain that averages hide.",
      "Batching, caching, quantization, and compilation help only in the right workload.",
    ],
    practice:
      "Measure p50/p95 latency and throughput under realistic concurrency. Profile one bottleneck, improve it, and rerun the quality regression suite.",
    pitfalls: [
      "Optimizing without a profile.",
      "Using a one-request local benchmark as a capacity plan.",
      "Shipping a faster service with worse predictions.",
    ],
    checklist: ["Set latency and quality targets.", "Profile first.", "Load test realistically."],
    resources: [
      {
        label: "PyTorch performance recipes",
        href: "https://pytorch.org/tutorials/recipes/recipes_index.html",
        kind: "reference",
      },
      { label: "FastAPI deployment", href: "https://fastapi.tiangolo.com/deployment/concepts/", kind: "guide" },
    ],
  },
  {
    id: "monitor",
    module: "mlops",
    title: "Monitor and improve",
    question: "How will you know when the model stops being useful?",
    summary:
      "Production starts a new learning loop. Watch service health, data drift, prediction distributions, delayed quality labels, and the real decision outcome.",
    intro: [
      "Your model is not a sculpture; it is a houseplant. The world changes, the inputs change, and the relationship between them changes. A model that was accurate in January can be confidently wrong by June.",
      "Monitoring is how you notice before your users do. Watch the boring service metrics, then watch the data: input drift, prediction drift, and eventually the quality labels that arrive too late to prevent the mistake but early enough to fix the next one.",
    ],
    time: 35,
    video: {
      label: "Data Drift vs Model Drift in Machine Learning",
      href: "https://www.youtube.com/watch?v=0P25tVRg99s",
      author: "PM Expert",
    },
    learn: [
      "Input drift and concept drift are different failures.",
      "Observability links request, model version, output, latency, and eventual outcome.",
      "Rollback and champion-challenger plans make changes safer.",
    ],
    practice:
      "Design a dashboard for request volume, errors, p95 latency, feature drift, prediction drift, delayed quality, and alert owners.",
    pitfalls: ["Monitoring uptime only.", "Alerting on every small change.", "Deploying with no rollback."],
    checklist: ["Define alert owners.", "Version artifacts.", "Plan rollback and retraining."],
    resources: [
      {
        label: "Google Rules of ML",
        href: "https://developers.google.com/machine-learning/guides/rules-of-ml",
        kind: "guide",
      },
      { label: "Evidently docs", href: "https://docs.evidentlyai.com/", kind: "reference" },
    ],
  },
  {
    id: "capstone",
    module: "portfolio",
    title: "Ship the complete system",
    question: "Can you show the full ML engineering loop?",
    summary:
      "A strong capstone makes judgment visible: framing, data contract, honest evaluation, tests, reproducible training, API, monitoring plan, and known limitations.",
    intro: [
      "The capstone is not a bigger model. It is proof that you can take a fuzzy question, make honest decisions, and ship something small that works. Scope is the skill being tested.",
      "Pick a problem where you can get real data, define a baseline, and explain the trade-offs to a human. A narrow system with a clear README, a measured evaluation, and an honest limitations section is far more convincing than a notebook with a beautiful loss curve.",
    ],
    time: 120,
    learn: [
      "Completeness is more impressive than an unexplained giant model.",
      "Trade-offs and limitations are evidence of engineering maturity.",
      "A reliable small system is a credible portfolio project.",
    ],
    practice:
      "Ship a narrow end-to-end project with README, data contract, train pipeline, evaluation report, tests, saved artifact, FastAPI service, and monitoring plan.",
    pitfalls: [
      "Too much scope before the baseline.",
      "Hiding failures.",
      "Presenting a score without decision context.",
    ],
    checklist: ["Write a problem contract.", "Pass quality gates.", "Demo and explain limitations."],
    resources: [
      { label: "Our production pipelines guide", href: "/learn/pipeline", internal: true, kind: "guide" },
      { label: "MLOps guide", href: "https://ml-ops.org/", kind: "guide" },
    ],
    article: "pipeline",
  },
  {
    id: "python",
    module: "programming",
    title: "Python you need for ML",
    question: "Can you turn a notebook idea into a script that runs twice?",
    summary:
      "Functions, data structures, imports, file I/O, and readable errors matter more than clever syntax. Write small scripts before writing models.",
    intro: [
      "Most beginner ML code fails for ordinary Python reasons: a path is wrong, a function mutates a shared list, an exception is swallowed, or the script only works from one directory. Those are not model bugs. They are programming bugs.",
      "You do not need every language feature. You need functions with clear inputs, small modules, virtual environments, and errors that tell you what actually broke. That is enough to build the rest of the course.",
    ],
    time: 35,
    video: {
      label: "Learn Python — full course for beginners",
      href: "https://www.youtube.com/watch?v=rfscVS0vtbw",
      author: "freeCodeCamp.org",
    },
    learn: [
      "Use functions to keep data loading, transforms, and training separate.",
      "Read tracebacks from the bottom up and fix the first real cause.",
      "Use pathlib, explicit encodings, and context managers for file work.",
    ],
    practice:
      "Write a 60-line script that reads a CSV, validates required columns, prints a summary, and exits with a nonzero status on bad input.",
    pitfalls: [
      "Keeping all logic in notebook cells that must run in order.",
      "Catching every exception and printing a vague message.",
      "Using mutable defaults or global state without noticing.",
    ],
    checklist: ["Run the script from a clean shell.", "Trigger one useful error.", "Explain every function."],
    resources: [
      { label: "Python tutorial", href: "https://docs.python.org/3/tutorial/", kind: "guide" },
      { label: "Automate the Boring Stuff", href: "https://automatetheboringstuff.com/", kind: "practice" },
    ],
  },
  {
    id: "git-linux",
    module: "programming",
    title: "Git, Linux, and the command line",
    question: "Can you move around, inspect, and version a project without a GUI?",
    summary:
      "The shell is the control room. Learn paths, pipes, processes, file permissions, git status, diffs, branches, and safe commits.",
    intro: [
      "A model job is mostly files, processes, and logs. The command line is how you see them. You do not need to memorize every flag; you need to know how to find the right command and verify what it did.",
      "Git is the undo button for ideas. Small commits with clear messages let you experiment, compare, and recover. A repository is also the first thing a reviewer opens, so keep it readable.",
    ],
    time: 30,
    learn: [
      "Absolute and relative paths explain most “file not found” errors.",
      "git status and git diff are safer than guessing what changed.",
      "Ignore data, environments, secrets, and generated artifacts early.",
    ],
    practice:
      "Create a repo, add a .gitignore, run a script from the shell, commit the working version, then inspect the diff after one small change.",
    pitfalls: [
      "Committing raw data, API keys, or virtual environments.",
      "Using destructive reset commands before checking status.",
      "Relying on the IDE to remember how the project is run.",
    ],
    checklist: ["Navigate with cd and ls.", "Read a diff.", "Commit only intended files."],
    resources: [
      { label: "Pro Git book", href: "https://git-scm.com/book/en/v2", kind: "guide" },
      { label: "Linux command line for beginners", href: "https://ubuntu.com/tutorials/command-line-for-beginners", kind: "practice" },
    ],
  },
  {
    id: "numpy-sql",
    module: "data",
    title: "NumPy, pandas, and SQL",
    question: "Can you answer a data question without looping over every row?",
    summary:
      "Use arrays for numeric work, dataframes for tabular transforms, and SQL for joins, aggregation, and the data that never fits in memory.",
    intro: [
      "NumPy gives you vectorized math and predictable shapes. pandas gives you labelled columns, joins, groupbys, and missing-data tools. SQL gives you the same ideas where the data actually lives, with a planner that can be much faster than pulling everything into Python.",
      "The skill is translation: a filter is a WHERE clause, a groupby is GROUP BY, a join is a join. Learn to express the question in the tool that owns the data, then verify row counts before trusting the result.",
    ],
    time: 40,
    learn: [
      "Vectorized operations replace most Python loops over numeric data.",
      "Join keys and cardinality determine whether a merge explodes rows.",
      "SQL NULL, pandas NaN, and zero are three different ideas.",
    ],
    practice:
      "Answer five questions about one dataset twice: once with pandas and once with SQL. Reconcile any differences before writing the model.",
    pitfalls: [
      "Looping over dataframe rows for ordinary arithmetic.",
      "Joining without checking duplicate keys.",
      "Treating NULL as zero or silently dropping it.",
    ],
    checklist: ["Check shapes after every merge.", "Use explicit dtypes.", "Reconcile pandas and SQL totals."],
    resources: [
      { label: "NumPy quickstart", href: "https://numpy.org/doc/stable/user/quickstart.html", kind: "reference" },
      { label: "pandas 10 minutes", href: "https://pandas.pydata.org/docs/user_guide/10min.html", kind: "guide" },
      { label: "SQLBolt", href: "https://sqlbolt.com/", kind: "practice" },
    ],
  },
  {
    id: "clustering",
    module: "classical",
    title: "Clustering and structure without labels",
    question: "What groups exist when nobody gave you the answers?",
    summary:
      "K-means, hierarchical clustering, and PCA find structure without labels. The hard part is deciding whether the structure is useful or just an artifact of scale.",
    intro: [
      "Clustering is unsupervised, which means there is no ground truth to appeal to. The algorithm will always return clusters, even on random noise. Your job is to decide whether those groups mean anything to the problem.",
      "Scale the features, choose a distance, and inspect the result. A cluster is a hypothesis, not a label. Validate it with domain knowledge, stability across seeds, and a downstream decision it actually changes.",
    ],
    time: 30,
    video: {
      label: "StatQuest: K-means clustering",
      href: "https://www.youtube.com/watch?v=4b5d3muPQmA",
      author: "StatQuest",
    },
    learn: [
      "K-means assumes roughly spherical clusters and a chosen k.",
      "PCA compresses correlated features into directions of variance.",
      "Silhouette and stability help, but domain usefulness decides.",
    ],
    practice:
      "Cluster a customer or product table, inspect centroid differences, and write one sentence explaining each segment to a non-technical reader.",
    pitfalls: [
      "Clustering unscaled features and letting one column dominate.",
      "Treating cluster IDs as true labels.",
      "Choosing k only by an elbow plot.",
    ],
    checklist: ["Scale features.", "Check stability.", "Explain the segments."],
    resources: [
      { label: "scikit-learn clustering guide", href: "https://scikit-learn.org/stable/modules/clustering.html", kind: "reference" },
      { label: "StatQuest: PCA", href: "https://www.youtube.com/watch?v=FgakZw6K1QQ", kind: "video" },
    ],
  },
  {
    id: "backprop",
    module: "deep",
    title: "Backpropagation and the training loop",
    question: "How does a network assign blame to each weight?",
    summary:
      "Backpropagation applies the chain rule backward through the graph. Autograd handles the bookkeeping; your job is to build a correct loss and a trustworthy loop.",
    intro: [
      "A forward pass produces a prediction. A loss compares it to the target. Backpropagation asks how much each parameter contributed to that loss, then gradient descent nudges every parameter in the useful direction.",
      "Frameworks automate the calculus, not the thinking. You still need the right shapes, the right loss, zeroed gradients, a train/eval switch, and a validation curve that tells you when to stop.",
    ],
    time: 35,
    learn: [
      "The chain rule turns local derivatives into a gradient for every weight.",
      "Autograd records operations during the forward pass.",
      "Gradient clipping and normalization stabilize difficult training.",
    ],
    practice:
      "Implement one gradient update for a tiny linear layer by hand, then compare it with torch.autograd on the same numbers.",
    pitfalls: [
      "Forgetting to zero gradients between steps.",
      "Using the wrong loss for the output shape.",
      "Calling backward on a detached tensor.",
    ],
    checklist: ["Verify one gradient by hand.", "Plot loss.", "Check train/eval mode."],
    resources: [
      { label: "PyTorch autograd tutorial", href: "https://pytorch.org/tutorials/beginner/blitz/autograd_tutorial.html", kind: "guide" },
      { label: "3Blue1Brown: backpropagation", href: "https://www.youtube.com/watch?v=Ilg3gGewQ5U", kind: "video" },
    ],
  },
  {
    id: "pytorch",
    module: "deep",
    title: "Train a small network in PyTorch",
    question: "Can you build a training loop you trust?",
    summary:
      "Tensors, modules, datasets, optimizers, and a train/validation loop. Start with a small tabular or image problem before touching a large model.",
    intro: [
      "PyTorch is explicit by design. You write the loop, so you can see where data moves, where the loss is computed, and when the optimizer steps. That visibility is the point.",
      "Keep the first experiment small enough to run in minutes. Change one thing at a time: learning rate, batch size, width, regularization. A model you can iterate on teaches more than one you can only afford to run once.",
    ],
    time: 45,
    learn: [
      "A Dataset yields examples; a DataLoader batches and shuffles them.",
      "model.train() and model.eval() change dropout and normalization behavior.",
      "Save state_dict, not the whole Python object, for portable artifacts.",
    ],
    practice:
      "Train a small MLP on a tabular dataset with early stopping. Save the best state_dict and reload it in a fresh process.",
    pitfalls: [
      "Evaluating without model.eval().",
      "Leaking validation data into normalization or augmentation.",
      "Mixing CPU and GPU tensors in one operation.",
    ],
    checklist: ["Run one batch end to end.", "Reload the artifact.", "Explain the loss curve."],
    resources: [
      { label: "PyTorch 60-minute blitz", href: "https://pytorch.org/tutorials/beginner/deep_learning_60min_blitz.html", kind: "practice" },
      { label: "PyTorch basics", href: "https://pytorch.org/tutorials/beginner/basics/intro.html", kind: "guide" },
    ],
  },
  {
    id: "cnn",
    module: "model-types",
    title: "Convolutional networks",
    question: "Why do images need a different architecture?",
    summary:
      "Convolutions exploit locality and weight sharing. Filters learn local patterns, pooling widens the receptive field, and depth composes them into objects.",
    intro: [
      "A dense network on pixels throws away the fact that nearby pixels belong together. A convolution slides the same small filter across the image, so a cat detector learned in one corner can fire in another.",
      "Channels, stride, padding, and pooling control the shape of the information. Most CNN bugs are shape bugs, and most overfitting is a data or augmentation problem wearing a model costume.",
    ],
    time: 30,
    learn: [
      "Weight sharing makes convolutions efficient and translation-aware.",
      "The receptive field grows with depth, stride, and pooling.",
      "Augmentation must preserve the label you are trying to predict.",
    ],
    practice:
      "Train a small CNN on FashionMNIST, then inspect one confusion pair and the images the model gets most wrong.",
    pitfalls: [
      "Flattening spatial structure too early.",
      "Augmenting in a way that changes the label.",
      "Comparing models trained with different preprocessing.",
    ],
    checklist: ["Print tensor shapes.", "Check augmentation examples.", "Inspect failure cases."],
    resources: [
      { label: "PyTorch CNN tutorial", href: "https://pytorch.org/tutorials/beginner/blitz/cifar10_tutorial.html", kind: "practice" },
      { label: "CS231n: convolutional networks", href: "https://cs231n.github.io/convolutional-networks/", kind: "guide" },
    ],
  },
  {
    id: "diffusion",
    module: "model-types",
    title: "Diffusion models",
    question: "How do generative models turn noise into an image?",
    summary:
      "Diffusion models learn to reverse a gradual noising process. Training predicts noise; sampling denoises step by step, optionally guided by text.",
    intro: [
      "The forward process destroys an image with Gaussian noise. The model learns the reverse direction: given a noisy sample and a timestep, predict the noise that was added. Sampling starts from pure noise and applies that learned denoiser repeatedly.",
      "Latent diffusion runs the process in a compressed space, which makes high-resolution generation practical. Steps, guidance scale, and the base model change both quality and cost, so compare them under a fixed prompt set.",
    ],
    time: 30,
    learn: [
      "Training adds noise; sampling removes it in learned steps.",
      "Latent diffusion trades pixel detail for compute efficiency.",
      "Guidance and step count change quality, diversity, and latency.",
    ],
    practice:
      "Run the same prompt at several step counts and guidance values. Record quality, latency, and failure modes in one small table.",
    pitfalls: [
      "Comparing outputs generated with different settings.",
      "Treating a generated image as evidence of a real event.",
      "Ignoring model licenses and provenance.",
    ],
    checklist: ["Fix the prompt set.", "Record settings.", "Check license and provenance."],
    resources: [
      { label: "Hugging Face diffusion course", href: "https://huggingface.co/learn/diffusion-course/unit0/1", kind: "practice" },
      { label: "Denoising diffusion paper", href: "https://arxiv.org/abs/2006.11239", kind: "reference" },
    ],
  },
  {
    id: "gnn",
    module: "model-types",
    title: "Graph neural networks",
    question: "How do you learn from relationships instead of rows?",
    summary:
      "Graph networks pass messages along edges. Node, edge, and graph tasks need different readouts, and graph structure creates leakage risks.",
    intro: [
      "Some data is not a table; it is a network. Users connect to users, molecules have bonds, and documents cite each other. A graph neural network updates each node by aggregating information from its neighbors.",
      "Stack too many message-passing layers and every node starts to look the same. Split edges by time or entity, and make sure validation graphs do not share the exact edges you are trying to predict.",
    ],
    time: 30,
    learn: [
      "Message passing aggregates neighbor features.",
      "Readout differs for node, edge, and whole-graph prediction.",
      "Deep GNNs can oversmooth; more layers are not always better.",
    ],
    practice:
      "Build a small citation or social graph, train a two-layer GCN, and compare a node classification score against a feature-only baseline.",
    pitfalls: [
      "Leaking future edges into training.",
      "Shuffling nodes but keeping the same edges across splits.",
      "Ignoring the oversmoothing plateau.",
    ],
    checklist: ["Define the prediction unit.", "Split by graph structure.", "Compare to a feature baseline."],
    resources: [
      { label: "PyTorch Geometric docs", href: "https://pytorch-geometric.readthedocs.io/en/latest/", kind: "reference" },
      { label: "Distill: A Gentle Introduction to GNNs", href: "https://distill.pub/2021/gnn-intro/", kind: "guide" },
    ],
  },
  {
    id: "tokens-embeddings",
    module: "llm",
    title: "Tokens, embeddings, and context",
    question: "What does the model actually see when you send text?",
    summary:
      "Text becomes token IDs, token IDs become vectors, and the context window limits how much the model can attend to. Token counts drive cost and truncation.",
    intro: [
      "A tokenizer splits text into subword pieces. Common words may be one token; rare words, code, and some languages get split into many. The model never sees your characters directly, only IDs and positions.",
      "Embeddings turn those IDs into vectors that shift with context. Similar meanings tend to land near each other, but the geometry is learned, not a philosophical map of truth. Count tokens before you build a prompt budget.",
    ],
    time: 30,
    learn: [
      "Tokenization is model-specific and not the same as words.",
      "Embeddings are learned vectors, not guaranteed semantic truth.",
      "Context limits apply to input plus output, including retrieved chunks.",
    ],
    practice:
      "Tokenize the same paragraph in English, code, and a non-English language. Compare token counts and find where truncation would cut a fact.",
    pitfalls: [
      "Assuming one word equals one token.",
      "Treating cosine similarity as proof of meaning.",
      "Forgetting retrieved context consumes the window.",
    ],
    checklist: ["Measure token counts.", "Test truncation.", "Budget input and output together."],
    resources: [
      { label: "Hugging Face tokenizers", href: "https://huggingface.co/learn/nlp-course/chapter2/4", kind: "guide" },
      { label: "OpenAI tokenizer", href: "https://platform.openai.com/tokenizer", kind: "reference" },
    ],
  },
  {
    id: "fine-tuning",
    module: "llm",
    title: "Fine-tuning and adaptation",
    question: "When should you change the weights instead of the prompt?",
    summary:
      "Fine-tuning teaches behavior and format; retrieval supplies facts. LoRA makes adaptation cheaper, but data quality and evaluation still decide the result.",
    intro: [
      "Prompting changes the instruction. Retrieval changes the context. Fine-tuning changes the model's weights, which is a much heavier commitment. Use it when you need a consistent behavior, style, or task format that prompting cannot reliably produce.",
      "Parameter-efficient methods such as LoRA train small adapters instead of every weight. That lowers cost, not the need for clean examples, a held-out eval, and a prompt-only baseline to beat.",
    ],
    time: 40,
    learn: [
      "Fine-tune behavior and format; retrieve facts.",
      "LoRA adapters train a small number of added parameters.",
      "A fine-tuned model needs the same eval set as the baseline.",
    ],
    practice:
      "Curate 200 clean examples, train a small LoRA adapter, and compare it with the prompt-only baseline on held-out tasks and safety cases.",
    pitfalls: [
      "Fine-tuning before establishing a prompt baseline.",
      "Letting evaluation examples leak into training.",
      "Assuming more epochs always improve behavior.",
    ],
    checklist: ["Write the target behavior.", "Hold out evals.", "Compare cost and quality."],
    resources: [
      { label: "Hugging Face training guide", href: "https://huggingface.co/docs/transformers/training", kind: "guide" },
      { label: "PEFT documentation", href: "https://huggingface.co/docs/peft/index", kind: "reference" },
    ],
  },
  {
    id: "decoding",
    module: "llm",
    title: "Decoding, prompting, and structured output",
    question: "Why does the same prompt produce different answers?",
    summary:
      "Sampling settings control randomness and diversity. Structured output needs schema validation, and prompts are an interface that must be tested, versioned, and defended against injection.",
    intro: [
      "A language model outputs a probability distribution over the next token. Greedy decoding takes the top choice; temperature and top-p sample from the rest. That is why the same prompt can produce different answers and why temperature zero is not a mathematical guarantee of determinism.",
      "When another program consumes the output, natural language is not enough. Ask for JSON against a schema, validate it, and handle the invalid case. Treat retrieved text and user text as untrusted input, not as instructions.",
    ],
    time: 30,
    learn: [
      "Temperature and top-p trade consistency for diversity.",
      "Structured output needs schema validation, not hope.",
      "Prompt injection is an input-trust problem, not just a wording problem.",
    ],
    practice:
      "Run one prompt at temperature 0, 0.7, and top-p 0.9. Record variance. Then add a JSON schema and a validator that rejects malformed output.",
    pitfalls: [
      "Assuming temperature 0 means identical output forever.",
      "Parsing JSON without validating it.",
      "Putting untrusted retrieved text in the system instruction.",
    ],
    checklist: ["Version prompts.", "Validate structured output.", "Test injection cases."],
    resources: [
      { label: "Hugging Face: how to generate", href: "https://huggingface.co/blog/how-to-generate", kind: "guide" },
      { label: "JSON Schema", href: "https://json-schema.org/", kind: "reference" },
    ],
  },
  {
    id: "rag-vector",
    module: "llm-apps",
    title: "RAG and vector search",
    question: "How do you give a model the right context at the right time?",
    summary:
      "Retrieval-augmented generation chunks sources, embeds them, retrieves candidates, and places the best evidence in the prompt. Retrieval quality is the ceiling.",
    intro: [
      "RAG is a pipeline, not a prompt trick. Split documents into useful chunks, embed them, store the vectors, retrieve candidates for a question, rerank them, and give the model only the evidence it needs with citations back to the source.",
      "The model cannot ground an answer in a document it never received. Measure retrieval separately: did the right chunk appear in the top few results? Then measure whether the answer used it faithfully and cited it correctly.",
    ],
    time: 45,
    learn: [
      "Chunk size and overlap determine what can be retrieved.",
      "Hybrid search combines lexical and vector signals.",
      "Retrieval recall is a separate metric from answer quality.",
    ],
    practice:
      "Build a small RAG over 20 documents. Create 20 questions, measure top-k retrieval recall, then inspect the failures before changing the model.",
    pitfalls: [
      "Chunks too large to fit or too small to contain the answer.",
      "Evaluating only the final answer and never the retrieval.",
      "No source citation when facts matter.",
    ],
    checklist: ["Measure retrieval recall.", "Inspect chunks.", "Cite sources."],
    interviewQuestions: [
      "How would you diagnose a RAG system that retrieves relevant documents but still gives wrong answers?",
      "When would you choose hybrid search over pure vector search?",
      "How do chunk size and overlap affect latency, cost, and answer quality?",
    ],
    resources: [
      { label: "Retrieval-Augmented Generation paper", href: "https://arxiv.org/abs/2005.11401", kind: "reference" },
      { label: "Qdrant concepts", href: "https://qdrant.tech/documentation/concepts/", kind: "guide" },
      { label: "pgvector", href: "https://github.com/pgvector/pgvector", kind: "reference" },
    ],
  },
  {
    id: "agents",
    module: "llm-apps",
    title: "Agents and tool use",
    question: "When does a model need tools instead of a longer prompt?",
    summary:
      "Agents let a model choose tools and observe results in a loop. Tool schemas, step budgets, state, and guardrails decide whether that loop is useful or dangerous.",
    intro: [
      "A tool call turns a language model into a controller. The model chooses an action, the system executes it, and the result goes back into context. That loop can search, calculate, query a database, or file a ticket.",
      "The danger is the loop. Bound the number of steps, validate every tool argument, make side effects idempotent, and log the full trace. A model that can retry forever without a budget is an outage waiting to happen.",
    ],
    time: 35,
    learn: [
      "Tool schemas should be narrow, typed, and validated.",
      "Step and cost budgets prevent runaway loops.",
      "Side-effecting tools need idempotency and human approval.",
    ],
    practice:
      "Build one read-only tool agent with a three-step budget. Log every action, force a failure, and verify it stops safely instead of retrying forever.",
    pitfalls: [
      "Unbounded retries and no cost ceiling.",
      "Trusting tool output as instructions.",
      "Exposing destructive tools without confirmation.",
    ],
    checklist: ["Define tool contracts.", "Set budgets.", "Log and replay traces."],
    interviewQuestions: [
      "How would you prevent an agent from taking an irreversible action by mistake?",
      "What belongs in the tool schema versus the prompt?",
      "How do you evaluate an agent when the path is not fixed?",
    ],
    resources: [
      { label: "OpenAI function calling", href: "https://platform.openai.com/docs/guides/function-calling", kind: "guide" },
      { label: "LangGraph documentation", href: "https://langchain-ai.github.io/langgraph/", kind: "reference" },
    ],
  },
  {
    id: "backend-auth-async",
    module: "backend",
    title: "REST, auth, and async",
    question: "Can the service survive real clients and real mistakes?",
    summary:
      "Design resources and status codes, separate authentication from authorization, and keep blocking model work off the async event loop.",
    intro: [
      "A prediction endpoint is a contract. The request schema, status codes, error shape, and versioning tell clients what to expect. Authentication proves who is calling; authorization decides what they may do.",
      "Async helps with waiting, not with CPU work. Database and network calls can await. A heavy model prediction usually belongs in a worker thread, a queue, or a separate service, or it will block every other request.",
    ],
    time: 40,
    learn: [
      "Use status codes and error bodies that a client can act on.",
      "Authentication and authorization are separate decisions.",
      "Async I/O and CPU-bound inference need different concurrency strategies.",
    ],
    practice:
      "Add API-key auth, a rate limit, one async dependency call, and a threadpool-wrapped prediction. Test expired credentials and a slow dependency.",
    pitfalls: [
      "Putting secrets in source control.",
      "Running CPU-heavy inference directly on the event loop.",
      "Returning stack traces or internal model details to clients.",
    ],
    checklist: ["Document the contract.", "Test auth failures.", "Load test the blocking path."],
    interviewQuestions: [
      "How would you secure a public prediction endpoint?",
      "Why can async code still block?",
      "What status code and body would you return for an invalid feature shape?",
    ],
    resources: [
      { label: "FastAPI security", href: "https://fastapi.tiangolo.com/tutorial/security/", kind: "guide" },
      { label: "FastAPI async", href: "https://fastapi.tiangolo.com/async/", kind: "guide" },
      { label: "OWASP API Security Top 10", href: "https://owasp.org/www-project-api-security/", kind: "reference" },
    ],
  },
  {
    id: "docker-cloud",
    module: "mlops",
    title: "Containerize and deploy",
    question: "Can you reproduce the service outside your laptop?",
    summary:
      "A container pins the runtime, not the model quality. Build a small image, pass configuration at runtime, add a health check, and deploy to one real host.",
    intro: [
      "Containers solve the “works on my machine” problem by shipping the runtime with the code. They do not solve data drift, model versioning, or bad configuration. The image is one layer of reproducibility, not the whole system.",
      "Keep the image small and the configuration external. Secrets come from the platform, not the Dockerfile. A health endpoint and a startup check tell the platform whether the process is actually ready to serve.",
    ],
    time: 40,
    learn: [
      "Pin base images and dependencies for repeatable builds.",
      "Configuration and secrets belong in runtime environment, not layers.",
      "Health and readiness checks are part of the deploy contract.",
    ],
    practice:
      "Write a multi-stage Dockerfile for the prediction API, run it locally, deploy it to one cloud host, and verify health plus a real prediction.",
    pitfalls: [
      "Using latest tags with no lockfile.",
      "Baking API keys or model credentials into the image.",
      "Deploying without a health check or rollback path.",
    ],
    checklist: ["Build from a clean checkout.", "Run the container locally.", "Verify health after deploy."],
    resources: [
      { label: "Docker get started", href: "https://docs.docker.com/get-started/", kind: "guide" },
      { label: "FastAPI in containers", href: "https://fastapi.tiangolo.com/deployment/docker/", kind: "guide" },
    ],
  },
  {
    id: "cicd",
    module: "mlops",
    title: "CI/CD and release gates",
    question: "How do you make a safe change on a Friday afternoon?",
    summary:
      "Automate tests, builds, and deployment checks. A release gate should stop a regression before users see it, not after the incident review.",
    intro: [
      "Continuous integration answers a simple question: does this change still build and pass its checks? Continuous delivery extends that to packaging and deployment, with the same evidence attached to every release.",
      "A model pipeline needs more than unit tests. Add schema checks, a small evaluation slice, artifact versioning, and a manual approval for production if the risk warrants it. The goal is boring, reversible releases.",
    ],
    time: 30,
    learn: [
      "CI should run the same checks locally and remotely.",
      "Evaluation gates belong in the release path, not a forgotten notebook.",
      "Every deploy needs an artifact version and a rollback plan.",
    ],
    practice:
      "Add a GitHub Actions workflow that installs, tests, builds the image, and runs a smoke prediction. Require a manual approval before deploy.",
    pitfalls: [
      "Deploying on every push with no gate.",
      "Using unpinned actions or credentials in logs.",
      "Building an image that was never tested.",
    ],
    checklist: ["Run checks locally.", "Pin actions.", "Verify rollback."],
    resources: [
      { label: "GitHub Actions documentation", href: "https://docs.github.com/en/actions", kind: "guide" },
      { label: "MLOps principles", href: "https://ml-ops.org/", kind: "reference" },
    ],
  },
  {
    id: "scaling",
    module: "advanced",
    title: "Scale inference and data paths",
    question: "What breaks first when traffic grows?",
    summary:
      "Scaling is a queueing problem, not just a bigger server. Stateless services, batching, caching, backpressure, and capacity estimates decide the knee.",
    intro: [
      "At low traffic, average latency looks fine. Under load, queues form, tail latency explodes, and retries make the queue longer. The useful question is not “how many requests per second?” but “what is the latency at the traffic we actually expect?”",
      "Scale the part that is actually constrained. A stateless API can add replicas; a stateful model server may need batching or a different runtime. Caches help repeated work, but they also create freshness and invalidation problems.",
    ],
    time: 35,
    learn: [
      "Queueing turns small utilization increases into large tail latency.",
      "Batching raises throughput but can hurt per-request latency.",
      "Backpressure protects the system when demand exceeds capacity.",
    ],
    practice:
      "Load test the API, find the point where p95 doubles, add one replica or a queue, and rerun the same test with the same data.",
    pitfalls: [
      "Scaling a stateful service by copying it.",
      "Letting a queue grow without a limit or alert.",
      "Testing with one request and calling it capacity.",
    ],
    checklist: ["Measure p95 under load.", "Find the knee.", "Add backpressure."],
    resources: [
      { label: "Google SRE book", href: "https://sre.google/sre-book/table-of-contents/", kind: "reference" },
      { label: "vLLM documentation", href: "https://docs.vllm.ai/en/latest/", kind: "guide" },
    ],
  },
  {
    id: "reliability",
    module: "advanced",
    title: "Reliability under failure",
    question: "What happens when a dependency is slow, wrong, or gone?",
    summary:
      "Timeouts, retries with jitter, idempotency, circuit breakers, and graceful degradation keep one failure from becoming an outage.",
    intro: [
      "Distributed systems fail partially. A database is slow, a model server returns errors, a third-party API times out. Without a timeout, a request waits forever. Without jitter, every client retries at the same instant and creates a thundering herd.",
      "Reliability is designed, then tested. Define an SLO, add a fallback for non-critical paths, and deliberately break a dependency in staging. A failure you have rehearsed is an incident; one you have not is a surprise.",
    ],
    time: 30,
    learn: [
      "Timeouts are required at every network boundary.",
      "Retries need limits, backoff, jitter, and idempotency.",
      "Graceful degradation beats a perfect response that never arrives.",
    ],
    practice:
      "Kill the model dependency in staging. Verify the timeout, fallback, alert, and user-facing error. Then restore it and check recovery.",
    pitfalls: [
      "Retrying non-idempotent writes.",
      "No timeout on an HTTP client.",
      "Alerting on every transient error until nobody reads alerts.",
    ],
    checklist: ["Set timeouts.", "Test fallback.", "Review alert ownership."],
    resources: [
      { label: "Google SRE workbook", href: "https://sre.google/workbook/table-of-contents/", kind: "reference" },
      { label: "AWS Well-Architected", href: "https://aws.amazon.com/architecture/well-architected/", kind: "guide" },
    ],
  },
  {
    id: "system-design",
    module: "portfolio",
    title: "ML system design",
    question: "Can you design the whole system, not just the model?",
    summary:
      "Start with requirements, then data flow, model choice, serving, evaluation, failure modes, cost, and operations. The interview is a trade-off conversation.",
    intro: [
      "A system-design answer that starts with “I would use a transformer” has already skipped the interesting part. Clarify the user, the decision, the scale, the latency budget, and the cost of mistakes. Then choose the simplest architecture that meets those constraints.",
      "Draw the data path and the request path. Name the source of truth, the training trigger, the serving contract, the evaluation gate, and what happens when the model is unavailable. Trade-offs are the answer; the diagram is just evidence.",
    ],
    time: 45,
    learn: [
      "Requirements and constraints come before architecture.",
      "Separate offline training from online serving and evaluation.",
      "Every design needs a failure mode and an operating cost.",
    ],
    practice:
      "Write a 45-minute design doc for a RAG support assistant: users, data freshness, retrieval, model, latency, cost, eval, monitoring, and fallback.",
    pitfalls: [
      "Jumping to a model before clarifying the problem.",
      "Ignoring data freshness and label delay.",
      "Drawing boxes with no latency or failure budget.",
    ],
    checklist: [
      "State requirements and constraints.",
      "Draw data and request paths.",
      "Name failure modes and cost.",
    ],
    interviewQuestions: [
      "Design a fraud detection system with a 50 ms p95 latency budget.",
      "How would you design retraining and rollback for a demand forecasting model?",
      "Walk through the data flow for a RAG assistant that must cite sources.",
      "What would you monitor in the first week after launch?",
      "How would you reduce inference cost by 40% without hurting quality?",
    ],
    resources: [
      { label: "Machine Learning Systems Design", href: "https://github.com/chiphuyen/machine-learning-systems-design", kind: "guide" },
      { label: "System Design Primer", href: "https://github.com/donnemartin/system-design-primer", kind: "reference" },
    ],
  },
  {
    id: "interview",
    module: "portfolio",
    title: "Interview preparation",
    question: "Can you explain your work and your judgment under pressure?",
    summary:
      "Prepare project stories, ML fundamentals, system design, and behavioral answers. Interviewers are testing reasoning, trade-offs, and communication.",
    intro: [
      "An interview is not a trivia contest. It is a sample of how you think when you are unsure. Strong candidates clarify the question, state assumptions, compare options, and explain what they would measure.",
      "Prepare a few deep project stories rather than a list of technologies. For each one, know the problem, baseline, data, metric, failure, trade-off, and what you would do differently. Then practice saying it in two minutes and in ten.",
    ],
    time: 60,
    learn: [
      "Depth on one project beats shallow mentions of ten.",
      "State assumptions and trade-offs before details.",
      "Behavioral answers should show decisions, not just outcomes.",
    ],
    practice:
      "Record three STAR stories and answer five system-design prompts aloud. Review for clarity, missing metrics, and unexplained trade-offs.",
    pitfalls: [
      "Reciting definitions without connecting them to a decision.",
      "Claiming a result with no baseline or measurement.",
      "Blaming teammates or tools instead of explaining the trade-off.",
    ],
    checklist: ["Prepare three stories.", "Practice one design prompt.", "Prepare questions to ask."],
    interviewQuestions: [
      "Tell me about a model that failed in production. What did you change?",
      "How do you choose a primary metric when stakeholders disagree?",
      "Explain precision versus recall using a real product decision.",
      "How would you detect leakage in a feature pipeline?",
      "When would you choose a simpler model over a neural network?",
      "How do you evaluate an LLM feature without a ground-truth label?",
      "Design the data pipeline for a recommendation feature.",
      "How would you handle a sudden drop in model quality after a deploy?",
      "What is the difference between data drift and concept drift?",
      "How do you decide whether to fine-tune, use RAG, or improve the prompt?",
      "Describe a trade-off you made between latency and quality.",
      "What would you build in your first 30 days on an ML platform team?",
    ],
    resources: [
      { label: "Machine Learning Systems Design", href: "https://github.com/chiphuyen/machine-learning-systems-design", kind: "guide" },
      { label: "System Design Primer", href: "https://github.com/donnemartin/system-design-primer", kind: "reference" },
    ],
  },
];

const STEP_ORDER = [
  "python",
  "workspace",
  "git-linux",
  "vectors",
  "stats",
  "gradient",
  "data",
  "numpy-sql",
  "split",
  "features",
  "tests",
  "experiments",
  "problem",
  "baseline",
  "linear",
  "logistic",
  "trees",
  "ensembles",
  "knn-svm",
  "clustering",
  "neural",
  "backprop",
  "pytorch",
  "cnn",
  "transformer",
  "diffusion",
  "gnn",
  "tokens-embeddings",
  "fine-tuning",
  "decoding",
  "rag-vector",
  "agents",
  "llm-evals",
  "fastapi",
  "backend-auth-async",
  "eval",
  "regularization",
  "docker-cloud",
  "cicd",
  "monitor",
  "optimize",
  "scaling",
  "reliability",
  "capstone",
  "system-design",
  "interview",
];

const stepOrderIndex = new Map(STEP_ORDER.map((id, index) => [id, index]));

export const resourceSteps: ResourceStep[] = [...rawSteps].sort(
  (a, b) => (stepOrderIndex.get(a.id) ?? Number.MAX_SAFE_INTEGER) - (stepOrderIndex.get(b.id) ?? Number.MAX_SAFE_INTEGER),
);


/**
 * The six formulas that keep showing up. This is intentionally short:
 * enough to read the rest of the page, not a replacement for a math course.
 */
export const mathToolkit: MathSnippet[] = [
  {
    title: "A feature vector",
    formula: String.raw`\mathbf{x} = \begin{bmatrix} x_1 & x_2 & \cdots & x_d \end{bmatrix}`,
    caption:
      "One row of your spreadsheet, written as a vector. d is the number of features; n is the number of rows.",
  },
  {
    title: "The dot product (a weighted vote)",
    formula: String.raw`\mathbf{w}\cdot\mathbf{x} = \sum_{i=1}^{d} w_i x_i`,
    caption:
      "Multiply matching entries, add them up. Every linear model and every neural network layer starts here.",
  },
  {
    title: "Mean and standard deviation",
    formula: String.raw`\bar{x} = \frac{1}{n}\sum_{i=1}^{n}x_i, \qquad s = \sqrt{\frac{1}{n-1}\sum_{i=1}^{n}(x_i-\bar{x})^2}`,
    caption:
      "The mean summarizes the center; the standard deviation summarizes the spread. Always look at both.",
  },
  {
    title: "A gradient",
    formula: String.raw`\nabla_\theta J = \begin{bmatrix} \frac{\partial J}{\partial \theta_1} & \cdots & \frac{\partial J}{\partial \theta_k} \end{bmatrix}`,
    caption:
      "A vector of slopes: how much the loss changes when each parameter moves a tiny amount. Gradient descent walks the other way.",
  },
  {
    title: "The sigmoid",
    formula: String.raw`\sigma(z) = \frac{1}{1+e^{-z}}`,
    caption:
      "Squashes any score into (0, 1). It is how logistic regression and many classifiers turn a number into a probability.",
  },
  {
    title: "Mean squared error",
    formula: String.raw`J = \frac{1}{n}\sum_{i=1}^{n}(\hat{y}_i - y_i)^2`,
    caption:
      "The default loss for regression. Squaring makes large errors expensive, which is either exactly what you want or a warning sign.",
  },
];

export type ModelFamily = {
  family: string;
  idea: string;
  useWhen: string;
  href: string;
  linkLabel: string;
};

/**
 * A map of the model families a beginner will meet. The rows are deliberately
 * short — each one links to a longer treatment elsewhere on the site.
 */
export const modelFamilies: ModelFamily[] = [
  {
    family: "Linear regression",
    idea: "Fit a weighted sum for a numeric target.",
    useWhen: "The relationship is roughly linear and you need a fast, readable baseline.",
    href: "/learn/linear-regression",
    linkLabel: "Read the guide",
  },
  {
    family: "Logistic regression",
    idea: "Fit a weighted sum, then squash it with a sigmoid.",
    useWhen: "You need a probability for a yes/no decision and a interpretable baseline.",
    href: "/learn/logistic-regression",
    linkLabel: "Read the guide",
  },
  {
    family: "Decision tree",
    idea: "Learn a flowchart of yes/no splits.",
    useWhen: "You have tabular data with thresholds and interactions, and need explainability.",
    href: "/learn/decision-trees",
    linkLabel: "Read the guide",
  },
  {
    family: "Random forest / boosting",
    idea: "Combine many trees, either by averaging or by correcting mistakes.",
    useWhen: "Tabular accuracy matters and you can afford tuning and inference cost.",
    href: "/resources/phase-4/ensembles",
    linkLabel: "See the step",
  },
  {
    family: "K-nearest neighbors",
    idea: "Let nearby examples vote.",
    useWhen: "Similarity is meaningful and the dataset is small enough for fast lookup.",
    href: "/learn/k-nearest-neighbors",
    linkLabel: "Read the guide",
  },
  {
    family: "SVM / SVR",
    idea: "Find the widest margin, optionally with a kernel.",
    useWhen: "You have medium-sized data and a boundary that is not a straight line.",
    href: "/learn/svr",
    linkLabel: "Read the guide",
  },
  {
    family: "Naive Bayes",
    idea: "Combine feature likelihoods with Bayes' rule and an independence assumption.",
    useWhen: "You need a tiny, fast baseline for text or high-dimensional counts.",
    href: "/learn/naive-bayes",
    linkLabel: "Read the guide",
  },
  {
    family: "Neural network",
    idea: "Stack weighted sums and nonlinearities, then train with backprop.",
    useWhen: "The data is unstructured (images, audio, text) or the pattern is hard to hand-engineer.",
    href: "/resources/phase-5/neural",
    linkLabel: "See the step",
  },
  {
    family: "CNN",
    idea: "Slide shared filters across spatial data.",
    useWhen: "Images, video frames, spectrograms, or any grid where nearby values belong together.",
    href: "/resources/phase-6/cnn",
    linkLabel: "See the step",
  },
  {
    family: "Transformer / LLM",
    idea: "Use attention to build context-dependent token representations.",
    useWhen: "You are working with language, code, or multimodal sequences.",
    href: "/resources/phase-6/transformer",
    linkLabel: "See the step",
  },
  {
    family: "Diffusion model",
    idea: "Learn to reverse a gradual noising process.",
    useWhen: "You need high-quality image, audio, or video generation and can afford iterative sampling.",
    href: "/resources/phase-6/diffusion",
    linkLabel: "See the step",
  },
  {
    family: "Graph neural network",
    idea: "Pass messages along edges to learn from relationships.",
    useWhen: "The data is a graph: molecules, citations, social networks, or recommendations.",
    href: "/resources/phase-6/gnn",
    linkLabel: "See the step",
  },
  {
    family: "Clustering (K-means, PCA)",
    idea: "Find structure without labels.",
    useWhen: "You want to explore groups, compress features, or detect anomalies.",
    href: "/resources/phase-4/clustering",
    linkLabel: "See the step",
  },
  {
    family: "Reinforcement learning",
    idea: "Learn actions by trial, reward, and feedback.",
    useWhen: "A system must make sequential decisions and can safely explore.",
    href: "/resources/phase-6#beyond",
    linkLabel: "See beyond",
  },
];

/**
 * Curated references worth bookmarking. The page also cites individual
 * videos inline, so this list is a "start here when you want more" shelf.
 */
export const sourceLibrary = [
  {
    label: "StatQuest — Machine Learning playlist",
    href: "https://www.youtube.com/playlist?list=PLblh5JKOoLUICTaGLRoHQDuF_7q2GfuJF",
    note: "Friendly, example-first videos for almost every model on this page.",
  },
  {
    label: "StatQuest — Statistics playlist",
    href: "https://www.youtube.com/playlist?list=PLblh5JKOoLUK0FLuzwntyYI10UQFUhsY9",
    note: "The statistics you need without the textbook voice.",
  },
  {
    label: "3Blue1Brown — Essence of Linear Algebra",
    href: "https://www.3blue1brown.com/topics/linear-algebra",
    note: "Visual intuition for vectors, matrices, and transformations.",
  },
  {
    label: "3Blue1Brown — Neural Networks",
    href: "https://www.3blue1brown.com/topics/neural-networks",
    note: "The best visual explanation of backpropagation and attention.",
  },
  {
    label: "An Introduction to Statistical Learning",
    href: "https://www.statlearning.com/",
    note: "Free, rigorous, and surprisingly readable. The natural next book.",
  },
  {
    label: "scikit-learn User Guide",
    href: "https://scikit-learn.org/stable/user_guide.html",
    note: "The reference for classical ML in Python. Read the examples first.",
  },
  {
    label: "Google — Rules of Machine Learning",
    href: "https://developers.google.com/machine-learning/guides/rules-of-ml",
    note: "Hard-earned production advice, organized as rules.",
  },
  {
    label: "pandas documentation",
    href: "https://pandas.pydata.org/docs/",
    note: "The tool you will use most in the first month.",
  },
  {
    label: "PyTorch tutorials",
    href: "https://pytorch.org/tutorials/",
    note: "Start with the 60-minute blitz, then build something small.",
  },
  {
    label: "FastAPI tutorial",
    href: "https://fastapi.tiangolo.com/tutorial/",
    note: "The quickest path from a saved model to a real endpoint.",
  },
  {
    label: "MLflow documentation",
    href: "https://mlflow.org/docs/latest/",
    note: "Experiment tracking, model registry, and packaging.",
  },
  {
    label: "Evidently documentation",
    href: "https://docs.evidentlyai.com/",
    note: "Open-source drift and model-quality reports for production.",
  },
  {
    label: "Hugging Face NLP course",
    href: "https://huggingface.co/learn/nlp-course/chapter1/1",
    note: "A practical path into transformers, datasets, and fine-tuning.",
  },
  {
    label: "Kaggle Learn",
    href: "https://www.kaggle.com/learn",
    note: "Short, hands-on courses for pandas, feature engineering, and ML.",
  },
  {
    label: "OpenAI — Evaluation guide",
    href: "https://platform.openai.com/docs/guides/evals",
    note: "How to evaluate an LLM feature instead of guessing.",
  },
  {
    label: "LangChain — RAG tutorial",
    href: "https://python.langchain.com/docs/tutorials/rag/",
    note: "A working retrieval pipeline you can inspect end to end.",
  },
  {
    label: "Docker — Get started",
    href: "https://docs.docker.com/get-started/",
    note: "The shortest path from a local app to a portable container.",
  },
  {
    label: "GitHub Actions documentation",
    href: "https://docs.github.com/en/actions",
    note: "Test, build, and deploy from the same repository.",
  },
  {
    label: "Google SRE Book",
    href: "https://sre.google/sre-book/table-of-contents/",
    note: "The clearest writing on SLOs, reliability, and operational trade-offs.",
  },
  {
    label: "The System Design Primer",
    href: "https://github.com/donnemartin/system-design-primer",
    note: "A practical vocabulary for scaling and system-design interviews.",
  },
];

export type StepCode = {
  title: string;
  language: "python" | "bash" | "text";
  code: string;
};

export const videoNotes: Record<string, { why: string; watchFor: string }> = {
  problem: {
    why: "A friendly, example-first tour of what machine learning is and where it fits.",
    watchFor: "The difference between ordinary code and learning a pattern from examples.",
  },
  python: {
    why: "A long Python refresher you can dip into when the syntax gets in the way.",
    watchFor: "Functions, imports, lists, dictionaries, and the habit of running small scripts.",
  },
  data: {
    why: "Pandas fundamentals for loading, inspecting, selecting, and cleaning a real table.",
    watchFor: "How a DataFrame is indexed, and what happens to missing values at each step.",
  },
  split: {
    why: "A short explanation of why training and test data must stay separate.",
    watchFor: "The moment the test set is created, then never touched again until evaluation.",
  },
  vectors: {
    why: "The visual intuition behind vectors, bases, and linear combinations.",
    watchFor: "How a vector can be both a point and a direction, depending on the question.",
  },
  stats: {
    why: "A clear explanation of why averages from samples behave predictably.",
    watchFor: "The shape of the sampling distribution and what the standard error measures.",
  },
  gradient: {
    why: "The best visual explanation of loss surfaces and gradient descent.",
    watchFor: "Why the negative gradient points downhill and how the learning rate changes the walk.",
  },
  baseline: {
    why: "Bias and variance explained without turning the idea into a slogan.",
    watchFor: "What underfitting and overfitting look like as model flexibility changes.",
  },
  linear: {
    why: "Least squares explained through residuals and a fitted line.",
    watchFor: "Why the line minimizes squared vertical distance rather than raw distance.",
  },
  logistic: {
    why: "A visual walk through the sigmoid, odds, and decision boundaries.",
    watchFor: "How a linear score becomes a probability and where the 0.5 boundary sits.",
  },
  trees: {
    why: "A grounded introduction to how a decision tree chooses its splits.",
    watchFor: "How impurity falls after a split and why unrestricted trees overfit.",
  },
  ensembles: {
    why: "The intuition behind bagging, random forests, and boosting.",
    watchFor: "The difference between averaging many independent trees and correcting mistakes in sequence.",
  },
  "knn-svm": {
    why: "A compact tour of distance-based classification and maximum-margin classifiers.",
    watchFor: "Why scaling changes KNN, and what the margin looks like for an SVM.",
  },
  clustering: {
    why: "A geometric explanation of how K-means assigns points and updates centroids.",
    watchFor: "Why the number of clusters and the feature scale change the result so much.",
  },
  eval: {
    why: "A practical explanation of the confusion matrix and the metrics built from it.",
    watchFor: "When precision matters more than recall, and why accuracy can lie.",
  },
  regularization: {
    why: "Ridge and lasso explained as constraints on model complexity.",
    watchFor: "Why L1 can zero coefficients while L2 mostly shrinks them.",
  },
  features: {
    why: "A survey of feature-selection methods and the leakage traps around them.",
    watchFor: "The difference between filter, wrapper, and embedded selection.",
  },
  tests: {
    why: "A beginner-friendly pytest walkthrough with assertions and fixtures.",
    watchFor: "How one small test isolates a behavior and how pytest discovers it.",
  },
  experiments: {
    why: "A quickstart for logging runs, parameters, metrics, and artifacts with MLflow.",
    watchFor: "What belongs in a run record so a result can be reproduced later.",
  },
  neural: {
    why: "An animated introduction to neurons, weights, and layered representations.",
    watchFor: "How a network composes simple functions into something more expressive.",
  },
  transformer: {
    why: "Attention broken into queries, keys, values, and context.",
    watchFor: "How each token decides which other tokens matter at that layer.",
  },
  "llm-evals": {
    why: "A big-picture tour of how language models are trained and where they fail.",
    watchFor: "The gap between next-token prediction, factual reliability, and task quality.",
  },
  fastapi: {
    why: "A hands-on introduction to routes, request models, and automatic API docs.",
    watchFor: "How type hints become validation and interactive documentation.",
  },
  optimize: {
    why: "A practical demonstration of profiling a PyTorch workload before optimizing it.",
    watchFor: "How the profiler separates CPU overhead from accelerator time.",
  },
  monitor: {
    why: "A clear explanation of data drift, concept drift, and why offline scores decay.",
    watchFor: "The difference between the input distribution changing and the input-output relationship changing.",
  },
};

export const stepCode: Record<string, StepCode[]> = {
  python: [
    {
      title: "A script with a real failure mode",
      language: "python",
      code: `from pathlib import Path

import pandas as pd

REQUIRED = {"customer_id", "spend"}


def load(path: Path) -> pd.DataFrame:
    frame = pd.read_csv(path)
    missing = REQUIRED - set(frame.columns)
    if missing:
        raise ValueError(f"missing columns: {sorted(missing)}")
    return frame


if __name__ == "__main__":
    frame = load(Path("data/raw/customers.csv"))
    print(f"rows={len(frame)} spend_mean={frame['spend'].mean():.2f}")`,
    },
  ],
  "git-linux": [
    {
      title: "The commands you will use every day",
      language: "bash",
      code: `git status
git diff
git add src/train.py
git commit -m "add training baseline"
git log --oneline -5

ls -la
find . -name "*.py" | head
python src/train.py`,
    },
  ],
  workspace: [
    {
      title: "A boring project layout",
      language: "text",
      code: `ml-project/
  data/
    raw/
    processed/
  src/
    preprocess.py
    train.py
    predict.py
  tests/
    test_preprocess.py
    test_api.py
  artifacts/
    model.joblib
  requirements.txt
  README.md`,
    },
  ],
  data: [
    {
      title: "Load, inspect, and clean a table",
      language: "python",
      code: `import pandas as pd

df = pd.read_csv("data/raw/listings.csv")

print(df.shape)
print(df.isna().mean().sort_values(ascending=False).head())

df["price"] = pd.to_numeric(df["price"], errors="coerce")
df = df.dropna(subset=["price"])
df = df[df["price"] > 0]

df.to_parquet("data/processed/listings.parquet", index=False)`,
    },
  ],
  "numpy-sql": [
    {
      title: "The same question in pandas and SQL",
      language: "python",
      code: `import pandas as pd

orders = pd.read_csv("orders.csv")
customers = pd.read_csv("customers.csv")

answer = (
    orders.merge(customers, on="customer_id", validate="many_to_one")
    .groupby("region", as_index=False)
    .agg(revenue=("amount", "sum"), orders=("order_id", "nunique"))
    .sort_values("revenue", ascending=False)
)

print(answer.head())

query = """
SELECT c.region,
       SUM(o.amount) AS revenue,
       COUNT(DISTINCT o.order_id) AS orders
FROM orders o
JOIN customers c ON c.customer_id = o.customer_id
GROUP BY c.region
ORDER BY revenue DESC
"""
print(pd.read_sql(query, connection).head())`,
    },
  ],
  split: [
    {
      title: "One split you can trust",
      language: "python",
      code: `from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y,
)

print(X_train.shape, X_test.shape)`,
    },
  ],
  baseline: [
    {
      title: "A baseline that is allowed to win",
      language: "python",
      code: `from sklearn.dummy import DummyClassifier
from sklearn.metrics import accuracy_score

baseline = DummyClassifier(strategy="most_frequent")
baseline.fit(X_train, y_train)

pred = baseline.predict(X_test)
print("baseline accuracy:", accuracy_score(y_test, pred))`,
    },
  ],
  linear: [
    {
      title: "Train and evaluate a small pipeline",
      language: "python",
      code: `from sklearn.linear_model import Ridge
from sklearn.metrics import root_mean_squared_error
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

model = Pipeline([
    ("scale", StandardScaler()),
    ("regressor", Ridge(alpha=1.0)),
])

model.fit(X_train, y_train)
pred = model.predict(X_test)
print("rmse:", root_mean_squared_error(y_test, pred))`,
    },
  ],
  tests: [
    {
      title: "Two tests that catch real failures",
      language: "python",
      code: `import pandas as pd
import pytest

from src.preprocess import clean_frame
from src.predict import predict_one


def test_drops_rows_without_a_price():
    raw = pd.DataFrame({"price": [10.0, None, 30.0]})
    cleaned = clean_frame(raw)
    assert len(cleaned) == 2


def test_rejects_the_wrong_feature_count():
    with pytest.raises(ValueError):
        predict_one([1.0, 2.0, 3.0])`,
    },
  ],
  clustering: [
    {
      title: "Cluster, inspect, and explain",
      language: "python",
      code: `from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

pipeline = Pipeline([
    ("scale", StandardScaler()),
    ("kmeans", KMeans(n_clusters=4, random_state=42, n_init="auto")),
])

labels = pipeline.fit_predict(customer_features)
score = silhouette_score(pipeline[:-1].transform(customer_features), labels)

print("silhouette:", round(score, 3))
print(pipeline.named_steps["kmeans"].cluster_centers_)`,
    },
  ],
  backprop: [
    {
      title: "Let autograd check your gradient",
      language: "python",
      code: `import torch

x = torch.tensor([2.0, -1.0], requires_grad=True)
w = torch.tensor([0.5, 3.0], requires_grad=True)
b = torch.tensor(1.0, requires_grad=True)

prediction = w.dot(x) + b
loss = (prediction - 4.0) ** 2

loss.backward()
print("dL/dw:", w.grad)
print("dL/db:", b.grad)`,
    },
  ],
  pytorch: [
    {
      title: "A training loop you can reuse",
      language: "python",
      code: `import torch
from torch import nn

model = nn.Sequential(nn.Linear(8, 32), nn.ReLU(), nn.Linear(32, 1))
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-3)
loss_fn = nn.MSELoss()

for epoch in range(20):
    model.train()
    for xb, yb in train_loader:
        optimizer.zero_grad()
        loss = loss_fn(model(xb), yb)
        loss.backward()
        optimizer.step()

    model.eval()
    with torch.no_grad():
        val_loss = sum(loss_fn(model(xb), yb).item() for xb, yb in val_loader)
    print(epoch, round(val_loss / len(val_loader), 4))`,
    },
  ],
  cnn: [
    {
      title: "A small convolutional stack",
      language: "python",
      code: `import torch
from torch import nn

model = nn.Sequential(
    nn.Conv2d(1, 16, kernel_size=3, padding=1),
    nn.ReLU(),
    nn.MaxPool2d(2),
    nn.Conv2d(16, 32, kernel_size=3, padding=1),
    nn.ReLU(),
    nn.MaxPool2d(2),
    nn.Flatten(),
    nn.Linear(32 * 7 * 7, 10),
)

images = torch.randn(8, 1, 28, 28)
print(model(images).shape)`,
    },
  ],
  "rag-vector": [
    {
      title: "Retrieve before you generate",
      language: "python",
      code: `def answer(question: str, top_k: int = 4) -> str:
    query_vector = embed(question)
    hits = vector_store.search(query_vector, limit=top_k)

    context = "\\n\\n".join(
        f"[{hit.id}] {hit.text}" for hit in hits
    )

    response = llm.generate(
        system="Answer only from the supplied sources. Cite ids.",
        user=f"Question: {question}\\n\\nSources:\\n{context}",
    )
    return response.text

result = answer("What is the refund window?")
print(result)`,
    },
  ],
  "backend-auth-async": [
    {
      title: "Auth, validation, and off-loop inference",
      language: "python",
      code: `from fastapi import Depends, FastAPI, HTTPException, Security
from fastapi.concurrency import run_in_threadpool
from fastapi.security import APIKeyHeader

app = FastAPI()
api_key = APIKeyHeader(name="X-API-Key")

async def require_key(key: str = Security(api_key)) -> str:
    if key != settings.api_key:
        raise HTTPException(status_code=401, detail="invalid credentials")
    return key

@app.post("/predict")
async def predict(request: PredictRequest, _: str = Depends(require_key)):
    prediction = await run_in_threadpool(model.predict, request.features)
    return {"prediction": float(prediction[0])}`,
    },
  ],
  "docker-cloud": [
    {
      title: "A small production image",
      language: "text",
      code: `FROM python:3.12-slim AS runtime
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY src ./src
COPY artifacts ./artifacts

ENV PORT=8000
EXPOSE 8000
CMD ["uvicorn", "src.api:app", "--host", "0.0.0.0", "--port", "8000"]`,
    },
  ],
  cicd: [
    {
      title: "Test, build, and gate a release",
      language: "text",
      code: `name: release
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - run: pip install -r requirements.txt
      - run: pytest
      - run: python -m src.evaluate --max-regression 0.02
      - run: docker build -t ml-api:\${{ github.sha }} .`,
    },
  ],
  fastapi: [
    {
      title: "A small, validated prediction API",
      language: "python",
      code: `from contextlib import asynccontextmanager

import joblib
import numpy as np
from fastapi import FastAPI
from pydantic import BaseModel, Field

model = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global model
    model = joblib.load("artifacts/model.joblib")
    yield


app = FastAPI(lifespan=lifespan)


class PredictRequest(BaseModel):
    features: list[float] = Field(min_length=4, max_length=4)


class PredictResponse(BaseModel):
    prediction: float
    model_version: str


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/predict", response_model=PredictResponse)
def predict(request: PredictRequest) -> PredictResponse:
    assert model is not None
    row = np.asarray(request.features).reshape(1, -1)
    return PredictResponse(
        prediction=float(model.predict(row)[0]),
        model_version="1.0.0",
    )`,
    },
  ],
};

export const phaseFunFacts: Record<string, string> = {
  programming:
    "Python is named after Monty Python, not the snake. The language was designed around readability, which is why indentation is part of the syntax rather than a style preference.",
  math:
    "A matrix multiplication is just a batch of dot products. When you write XW, every output cell is one weighted sum. That is why a shape error usually points to a mismatch between the rows and columns being combined.",
  data:
    "Pandas is named after “panel data,” an econometrics term for observations measured over time. The library became famous for tabular data, but its name is a small piece of statistics history.",
  classical:
    "Random forests remain stubbornly strong on tabular data. Each tree sees a random slice of the rows and features, which makes the trees less correlated; averaging them cancels some of their individual mistakes.",
  deep:
    "The 2017 paper “Attention Is All You Need” introduced the transformer without recurrence or convolution. It relied on attention and feed-forward layers, and that design became the foundation of modern language models.",
  "model-types":
    "Convolutional networks were popularized by LeNet for handwritten digits and later by AlexNet. The same weight-sharing trick that helped read checks became the basis of modern image systems.",
  llm:
    "A language model does not store facts in neat rows. It compresses patterns from training text into weights, which is why it can sound authoritative while inventing a citation. Fluency and truth are different properties.",
  "llm-apps":
    "Vector databases usually use approximate nearest-neighbor search rather than checking every vector. That trade-off is why retrieval can be fast at scale and still miss the exact best chunk.",
  backend:
    "FastAPI is built on Starlette for the web layer and Pydantic for data validation. Its interactive docs are generated from type hints, which is why a small schema change can update the documentation automatically.",
  mlops:
    "Google’s Rules of Machine Learning include a useful reminder: more data usually beats a cleverer algorithm, but better data beats more data. Deployment is where that difference becomes visible.",
  advanced:
    "Queueing theory has a brutal intuition: as utilization approaches capacity, wait time grows much faster than traffic. A service that looks fine at 70% load can fall over at 90%.",
  portfolio:
    "The Netflix Prize offered $1 million for a 10% improvement in recommendation accuracy. The winning ensemble hit the target, but Netflix never deployed it because the engineering cost outweighed the gain. A better score is not the same as a better product.",
};

export const phaseQuizzes: Record<string, QuizQuestion[]> = {
  programming: [
    {
      id: "programming-notebook",
      question:
        "True or false: if a notebook runs top to bottom once, the work is reproducible.",
      options: ["True", "False"],
      answerIndex: 1,
      explanation:
        "False. Hidden state, out-of-order cells, and unpinned packages can make a notebook impossible to rerun. Durable logic belongs in scripts with a documented environment.",
    },
    {
      id: "programming-secrets",
      question:
        "True or false: a .env file should be committed so every teammate can run the project.",
      options: ["True", "False"],
      answerIndex: 1,
      explanation:
        "False. Secrets belong outside version control. Commit a .env.example with variable names, then provide real values through the environment or a secret manager.",
    },
    {
      id: "programming-shell",
      question:
        "True or false: a relative path can fail even when the file exists on disk.",
      options: ["True", "False"],
      answerIndex: 0,
      explanation:
        "True. Relative paths are resolved from the current working directory. Running the same script from another folder can break it, which is why pathlib and project-root anchors help.",
    },
  ],
  math: [
    {
      id: "math-shape",
      question:
        "True or false: multiplying an (n × d) matrix by a (d × k) matrix produces an (n × k) matrix.",
      options: ["True", "False"],
      answerIndex: 0,
      explanation:
        "True. The inner dimensions must match and cancel, while the outer dimensions become the result. Checking that rule catches a large share of beginner shape bugs.",
    },
    {
      id: "math-loss",
      question:
        "True or false: a lower training loss always means the model will generalize better.",
      options: ["True", "False"],
      answerIndex: 1,
      explanation:
        "False. A model can memorize the training set and still fail on new data. That is why validation loss, not training loss alone, decides whether an improvement is real.",
    },
    {
      id: "math-scale",
      question:
        "True or false: feature scaling can change how quickly gradient descent converges.",
      options: ["True", "False"],
      answerIndex: 0,
      explanation:
        "True. Unscaled features create a stretched loss surface, so one learning rate can be too small in one direction and too large in another.",
    },
  ],
  classical: [
    {
      id: "classical-tree",
      question:
        "True or false: an unlimited decision tree can memorize the training data.",
      options: ["True", "False"],
      answerIndex: 0,
      explanation:
        "True. Keep splitting and the tree can isolate individual rows. That flexibility is useful for fitting, but it is also why depth limits, pruning, and validation matter.",
    },
    {
      id: "classical-knn",
      question:
        "True or false: K-nearest neighbors usually needs feature scaling before distances are compared.",
      options: ["True", "False"],
      answerIndex: 0,
      explanation:
        "True. A feature measured in thousands will dominate one measured in fractions. Scaling puts the features on a comparable footing before distance is calculated.",
    },
    {
      id: "classical-complex",
      question:
        "True or false: a more complex model always beats a simpler model on unseen data.",
      options: ["True", "False"],
      answerIndex: 1,
      explanation:
        "False. Complexity can fit noise and make production harder. The right model is the simplest one that wins under a trustworthy evaluation protocol.",
    },
  ],
  mlops: [
    {
      id: "mlops-container",
      question:
        "True or false: a container makes the model reproducible, so offline evaluation no longer matters.",
      options: ["True", "False"],
      answerIndex: 1,
      explanation:
        "False. A container pins the runtime, not the data, weights, or evaluation logic. Reproducibility and model quality are separate claims.",
    },
    {
      id: "mlops-gate",
      question:
        "True or false: a release gate should be able to stop a deployment when a quality metric regresses.",
      options: ["True", "False"],
      answerIndex: 0,
      explanation:
        "True. CI is more than unit tests. A model release should fail closed when its evaluation slice, schema check, or smoke prediction fails.",
    },
    {
      id: "mlops-rollback",
      question:
        "True or false: a deploy is not complete until the team knows how to roll it back.",
      options: ["True", "False"],
      answerIndex: 0,
      explanation:
        "True. The rollback path, artifact version, and owner are part of the release. Without them, a bad deploy becomes an incident with no exit.",
    },
  ],
  data: [
    {
      id: "data-scaler",
      question:
        "True or false: fitting a scaler on the full dataset before splitting leaks test information.",
      options: ["True", "False"],
      answerIndex: 0,
      explanation:
        "True. The scaler learns the mean and spread of the test rows. Fit preprocessing inside the training fold, usually as part of a pipeline, so the test set stays unseen.",
    },
    {
      id: "data-pipeline",
      question:
        "True or false: a pipeline keeps preprocessing and the model together as one artifact.",
      options: ["True", "False"],
      answerIndex: 0,
      explanation:
        "True. That is how you prevent training and serving from drifting apart. Save the fitted pipeline, not just the final estimator.",
    },
    {
      id: "data-tests",
      question:
        "True or false: tests are only useful after the model is deployed.",
      options: ["True", "False"],
      answerIndex: 1,
      explanation:
        "False. Tests catch schema changes, bad transforms, and serving mismatches before users see them. A few sharp tests are part of building the model, not an afterthought.",
    },
  ],
  deep: [
    {
      id: "deep-backprop",
      question:
        "True or false: backpropagation computes gradients by applying the chain rule through the network.",
      options: ["True", "False"],
      answerIndex: 0,
      explanation:
        "True. Backpropagation is bookkeeping for the chain rule. It asks how much each parameter contributed to the loss, then gradient descent uses those slopes to update the weights.",
    },
    {
      id: "deep-gradzero",
      question:
        "True or false: gradients must be cleared before each optimizer step, or they accumulate.",
      options: ["True", "False"],
      answerIndex: 0,
      explanation:
        "True. Autograd adds new gradients to existing .grad buffers. Calling optimizer.zero_grad() before backward() is what keeps each step independent.",
    },
    {
      id: "deep-evalmode",
      question:
        "True or false: model.eval() turns off dropout and switches normalization layers to inference behavior.",
      options: ["True", "False"],
      answerIndex: 0,
      explanation:
        "True. Evaluation must be deterministic and use running statistics. Forgetting model.eval() makes validation scores noisy and misleading.",
    },
  ],
  "model-types": [
    {
      id: "model-types-cnn",
      question:
        "True or false: a convolution reuses the same filter across different spatial positions.",
      options: ["True", "False"],
      answerIndex: 0,
      explanation:
        "True. Weight sharing is the core efficiency trick. A pattern learned in one region can be detected elsewhere without relearning it from scratch.",
    },
    {
      id: "model-types-transformer",
      question:
        "True or false: transformers can model long-range dependencies without recurrence.",
      options: ["True", "False"],
      answerIndex: 0,
      explanation:
        "True. Attention connects positions directly, so the path between distant tokens can be short. That is why transformers scaled so well for language.",
    },
    {
      id: "model-types-diffusion",
      question:
        "True or false: diffusion training teaches a model to predict the noise added to a sample.",
      options: ["True", "False"],
      answerIndex: 0,
      explanation:
        "True. The forward process adds noise; the network learns to estimate it. Sampling runs that prediction backward, step by step.",
    },
  ],
  llm: [
    {
      id: "llm-words",
      question:
        "True or false: one word is always one token.",
      options: ["True", "False"],
      answerIndex: 1,
      explanation:
        "False. Tokenizers split text into subwords, and the split depends on the model. Code, rare words, and many languages use more tokens per word.",
    },
    {
      id: "llm-finetune",
      question:
        "True or false: fine-tuning is the best way to keep frequently changing facts up to date.",
      options: ["True", "False"],
      answerIndex: 1,
      explanation:
        "False. Retrieval is usually better for changing facts. Fine-tuning is better suited to behavior, format, and task-specific style.",
    },
    {
      id: "llm-temperature",
      question:
        "True or false: temperature zero guarantees identical output on every call.",
      options: ["True", "False"],
      answerIndex: 1,
      explanation:
        "False. Greedy decoding usually makes the same choice, but infrastructure, batching, and model changes can still produce variation. Treat determinism as an engineering property to verify.",
    },
  ],
  "llm-apps": [
    {
      id: "llm-apps-retrieval",
      question:
        "True or false: if the right source chunk is never retrieved, a better generator is unlikely to fix the answer.",
      options: ["True", "False"],
      answerIndex: 0,
      explanation:
        "True. Retrieval quality is the ceiling. The model cannot ground an answer in evidence it never received, so measure retrieval separately.",
    },
    {
      id: "llm-apps-chunk",
      question:
        "True or false: chunk size and overlap have little effect on RAG quality.",
      options: ["True", "False"],
      answerIndex: 1,
      explanation:
        "False. Chunks that are too small lose context; chunks that are too large dilute the signal and consume the window. Both choices affect recall and cost.",
    },
    {
      id: "llm-apps-agents",
      question:
        "True or false: an agent should be allowed unlimited retries so it can eventually solve the task.",
      options: ["True", "False"],
      answerIndex: 1,
      explanation:
        "False. Unbounded loops create cost and safety failures. Step budgets, timeouts, and idempotent tools make agent behavior survivable.",
    },
  ],
  "advanced": [
    {
      id: "advanced-queue",
      question:
        "True or false: latency can grow sharply as service utilization approaches capacity.",
      options: ["True", "False"],
      answerIndex: 0,
      explanation:
        "True. Queueing effects are nonlinear. A system that feels fine at moderate load can develop long waits and timeouts near saturation.",
    },
    {
      id: "advanced-retry",
      question:
        "True or false: retries without backoff and jitter are a safe way to handle a struggling dependency.",
      options: ["True", "False"],
      answerIndex: 1,
      explanation:
        "False. Synchronized retries add load to an already failing service. Use limits, exponential backoff, jitter, and idempotency.",
    },
    {
      id: "advanced-batch",
      question:
        "True or false: larger batches always reduce per-request latency.",
      options: ["True", "False"],
      answerIndex: 1,
      explanation:
        "False. Batching can raise throughput while increasing the time an individual request waits. The right batch size depends on the latency target.",
    },
  ],
  backend: [
    {
      id: "backend-startup",
      question:
        "True or false: loading the model once at application startup is usually better than loading it on every request.",
      options: ["True", "False"],
      answerIndex: 0,
      explanation:
        "True. Per-request loading adds latency and memory churn for no benefit. Load the versioned artifact once, then reuse it across requests.",
    },
    {
      id: "backend-preprocess",
      question:
        "True or false: training and serving can use different preprocessing as long as the API returns a prediction.",
      options: ["True", "False"],
      answerIndex: 1,
      explanation:
        "False. Different preprocessing means the model sees different features in production than it learned from. Ship one fitted pipeline and use it in both places.",
    },
    {
      id: "backend-latency",
      question:
        "True or false: p95 latency is often more useful than average latency for understanding user experience.",
      options: ["True", "False"],
      answerIndex: 0,
      explanation:
        "True. Averages hide the slow requests that users actually remember. Tail latency shows how often the service feels broken, even when the mean looks healthy.",
    },
  ],
  portfolio: [
    {
      id: "portfolio-scope",
      question:
        "True or false: a smaller completed system is usually more convincing than a larger unfinished one.",
      options: ["True", "False"],
      answerIndex: 0,
      explanation:
        "True. Completeness demonstrates judgment: framing, evaluation, tests, deployment, and limitations. An unfinished giant model mostly demonstrates ambition.",
    },
    {
      id: "portfolio-limits",
      question:
        "True or false: a limitations section weakens a portfolio project.",
      options: ["True", "False"],
      answerIndex: 1,
      explanation:
        "False. Honest limitations show that you understand the system and its risks. They are evidence of engineering maturity, not a confession.",
    },
    {
      id: "portfolio-readme",
      question:
        "True or false: a README should let someone else run the project from a fresh checkout.",
      options: ["True", "False"],
      answerIndex: 0,
      explanation:
        "True. Setup, data, training, tests, and serving commands are part of the deliverable. If only you can run it, the project is still a demo.",
    },
  ],
};

export const resourceTotals = {
  steps: resourceSteps.length,
  modules: resourceModules.length,
  videos: resourceSteps.filter((step) => step.video).length,
  minutes: resourceSteps.reduce((total, step) => total + step.time, 0),
};

export const stepById = new Map(resourceSteps.map((step) => [step.id, step]));
export const moduleById = new Map(resourceModules.map((module) => [module.id, module]));

const phaseNumberById = new Map(
  resourceModules.map((module, index) => [module.id, index + 1]),
);
const phaseIdByNumber = new Map(
  resourceModules.map((module, index) => [index + 1, module.id]),
);

export function phaseSlug(moduleId: string): string {
  const number = phaseNumberById.get(moduleId) ?? 1;
  return `phase-${number}`;
}

export function phasePath(moduleId: string): string {
  return `/resources/${phaseSlug(moduleId)}`;
}

export function lessonPath(moduleId: string, stepId: string): string {
  return `${phasePath(moduleId)}/${stepId}`;
}

export function phaseIdFromSlug(slug: string): string | null {
  const match = /^phase-(\d+)$/i.exec(slug);
  if (!match) return null;
  return phaseIdByNumber.get(Number(match[1])) ?? null;
}
