export type CheatsheetParam = {
  name: string;
  type: string;
  default: string;
  description: string;
  impact?: string;
};

export type Cheatsheet = {
  slug: string;
  title: string;
  description: string;
  badge: string;
  image: string;
  category: "regression" | "classification" | "beginner" | "advanced";
  params: CheatsheetParam[];
  snippet: { title: string; language: string; code: string };
  simSlug?: string;
  articleSlug?: string;
  tips: string[];
};

export const cheatsheets: Record<string, Cheatsheet> = {
  "linear-regression": {
    slug: "linear-regression",
    title: "Linear Regression Cheatsheet",
    description: "sklearn LinearRegression params, assumptions, and copy-paste snippets.",
    badge: "Regression",
    image: "/images/regression/linear-regression.webp",
    category: "regression",
    articleSlug: "linear-regression",
    simSlug: "linear-regression",
    params: [
      { name: "fit_intercept", type: "bool", default: "True", description: "Whether to calculate the intercept for the model.", impact: "Set False only if data is already centered." },
      { name: "copy_X", type: "bool", default: "True", description: "Whether X is copied or overwritten.", impact: "False saves memory on large arrays." },
      { name: "n_jobs", type: "int | None", default: "None", description: "Cores used for computation.", impact: "Use -1 for all cores on large problems." },
      { name: "positive", type: "bool", default: "False", description: "Force coefficients to be positive.", impact: "Useful when domain knowledge says effects are non-negative." },
    ],
    snippet: {
      title: "LinearRegression quickstart",
      language: "python",
      code: `from sklearn.linear_model import LinearRegression\nfrom sklearn.model_selection import train_test_split\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\nmodel = LinearRegression()\nmodel.fit(X_train, y_train)\nprint("R²:", model.score(X_test, y_test))`,
    },
    tips: ["Scale features when comparing coefficients.", "Check residual plots before trusting R².", "Outliers pull the line, so try the Least Squares sim."],
  },
  "gradient-descent": {
    slug: "gradient-descent",
    title: "Gradient Descent Cheatsheet",
    description: "Learning rate, batch size, momentum, and convergence diagnostics.",
    badge: "Optimization",
    image: "/images/regression/gradient-descent.webp",
    category: "regression",
    articleSlug: "gradient-descent",
    simSlug: "gradient-descent",
    params: [
      { name: "learning_rate", type: "float", default: "0.01", description: "Step size along negative gradient.", impact: "Too high diverges, too low crawls." },
      { name: "batch_size", type: "int", default: "32", description: "Samples per gradient estimate.", impact: "Small = noisy/fast, large = stable/slow." },
      { name: "momentum", type: "float", default: "0.0", description: "Fraction of prior update carried forward.", impact: "0.9 smooths ravines." },
      { name: "max_iter", type: "int", default: "1000", description: "Max optimization steps.", impact: "Pair with tol for early stopping." },
    ],
    snippet: {
      title: "SGDRegressor quickstart",
      language: "python",
      code: `from sklearn.linear_model import SGDRegressor\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.pipeline import make_pipeline\n\nmodel = make_pipeline(StandardScaler(), SGDRegressor(max_iter=1000, tol=1e-3, penalty=None, learning_rate="constant", eta0=0.01))\nmodel.fit(X_train, y_train)`,
    },
    tips: ["Always scale before SGD.", "Plot loss vs step: flat means LR too small.", "Try the Gradient Descent sim with LR 0.001 vs 0.3."],
  },
  "logistic-regression": {
    slug: "logistic-regression",
    title: "Logistic Regression Cheatsheet",
    description: "C, penalty, solver, and threshold tuning for binary classification.",
    badge: "Classification",
    image: "/images/classification/logistic-regression.webp",
    category: "classification",
    articleSlug: "logistic-regression",
    simSlug: "logistic-regression",
    params: [
      { name: "C", type: "float", default: "1.0", description: "Inverse regularization strength.", impact: "Small C = stronger regularization." },
      { name: "penalty", type: "{l1,l2,elasticnet,None}", default: "l2", description: "Norm used for regularization.", impact: "l1 sparsifies, l2 shrinks." },
      { name: "solver", type: "str", default: "lbfgs", description: "Optimization algorithm.", impact: "liblinear for small data + l1, saga for elasticnet." },
      { name: "max_iter", type: "int", default: "100", description: "Max solver iterations.", impact: "Raise to 1000 if ConvergenceWarning." },
    ],
    snippet: {
      title: "LogisticRegression quickstart",
      language: "python",
      code: `from sklearn.linear_model import LogisticRegression\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.pipeline import make_pipeline\n\nclf = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000))\nclf.fit(X_train, y_train)\nprint("acc:", clf.score(X_test, y_test))`,
    },
    tips: ["Scale features for faster convergence.", "Tune threshold, not just C, for imbalanced data.", "Check calibration before trusting probabilities."],
  },
  "polynomial-regression": {
    slug: "polynomial-regression",
    title: "Polynomial Regression Cheatsheet",
    description: "Degree, interaction terms, and overfitting guards.",
    badge: "Regression",
    image: "/images/regression/polynomial-regression.webp",
    category: "regression",
    articleSlug: "polynomial-regression",
    simSlug: "polynomial-regression",
    params: [
      { name: "degree", type: "int", default: "2", description: "Max polynomial degree.", impact: "Each +1 adds wiggle and overfit risk." },
      { name: "include_bias", type: "bool", default: "True", description: "Include bias column.", impact: "False only if downstream model adds intercept." },
      { name: "interaction_only", type: "bool", default: "False", description: "Only interaction features, no powers.", impact: "True cuts feature explosion." },
    ],
    snippet: {
      title: "PolynomialFeatures quickstart",
      language: "python",
      code: `from sklearn.preprocessing import PolynomialFeatures, StandardScaler\nfrom sklearn.linear_model import Ridge\nfrom sklearn.pipeline import make_pipeline\n\nmodel = make_pipeline(PolynomialFeatures(degree=3, include_bias=False), StandardScaler(), Ridge(alpha=1.0))\nmodel.fit(X_train, y_train)`,
    },
    tips: ["Always pair with Ridge/Lasso.", "Validate degree on held-out data.", "degree>4 rarely generalizes."],
  },
  "svr": {
    slug: "svr",
    title: "SVR Cheatsheet",
    description: "epsilon, C, kernel, and gamma for Support Vector Regression.",
    badge: "Advanced",
    image: "/images/regression/svr.webp",
    category: "advanced",
    articleSlug: "svr",
    simSlug: "svr-visualizer",
    params: [
      { name: "epsilon", type: "float", default: "0.1", description: "Half-width of no-penalty tube.", impact: "Larger epsilon = fewer support vectors, flatter fit." },
      { name: "C", type: "float", default: "1.0", description: "Penalty for violations outside tube.", impact: "High C overfits, low C underfits." },
      { name: "kernel", type: "str", default: "rbf", description: "Kernel mapping.", impact: "rbf for curves, linear for straight trends." },
      { name: "gamma", type: "{scale,auto} | float", default: "scale", description: "Influence radius of one sample.", impact: "High gamma = spiky fit." },
    ],
    snippet: {
      title: "SVR quickstart",
      language: "python",
      code: `from sklearn.svm import SVR\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.pipeline import make_pipeline\n\nmodel = make_pipeline(StandardScaler(), SVR(kernel="rbf", C=10.0, epsilon=0.1))\nmodel.fit(X_train, y_train)`,
    },
    tips: ["Scale is mandatory for SVR.", "Tune epsilon before C.", "Try SVR Kernel Lift sim to see rbf effect."],
  },
  "decision-trees": {
    slug: "decision-trees",
    title: "Decision Trees Cheatsheet",
    description: "max_depth, impurity, pruning knobs that stop overfitting.",
    badge: "Classification",
    image: "/images/classification/decision-tree-v2.webp",
    category: "classification",
    articleSlug: "decision-trees",
    simSlug: "decision-trees",
    params: [
      { name: "max_depth", type: "int | None", default: "None", description: "Max tree depth.", impact: "First knob to limit overfit: try 3-8." },
      { name: "criterion", type: "{gini,entropy,log_loss}", default: "gini", description: "Split impurity measure.", impact: "Rarely matters; gini is fastest." },
      { name: "min_samples_split", type: "int | float", default: "2", description: "Min samples to split a node.", impact: "Raise to 10-20 to smooth." },
      { name: "ccp_alpha", type: "float", default: "0.0", description: "Minimal cost-complexity pruning.", impact: "Small positive values prune noise." },
    ],
    snippet: {
      title: "DecisionTree quickstart",
      language: "python",
      code: `from sklearn.tree import DecisionTreeClassifier\n\nclf = DecisionTreeClassifier(max_depth=5, min_samples_split=10, ccp_alpha=0.001, random_state=42)\nclf.fit(X_train, y_train)`,
    },
    tips: ["Depth unlimited memorizes noise.", "Export with plot_tree to debug splits.", "Trees love unscaled categorical-ish splits."],
  },
  "k-nearest-neighbors": {
    slug: "k-nearest-neighbors",
    title: "KNN Cheatsheet",
    description: "k, weights, metric, and scaling checklist.",
    badge: "Classification",
    image: "/images/classification/k-nearest-neighbors-v2.webp",
    category: "classification",
    articleSlug: "k-nearest-neighbors",
    simSlug: "k-nearest-neighbors",
    params: [
      { name: "n_neighbors", type: "int", default: "5", description: "Number of voters.", impact: "Odd k avoids ties; small k noisy, large k smooth." },
      { name: "weights", type: "{uniform,distance}", default: "uniform", description: "Vote weighting.", impact: "distance helps dense clusters." },
      { name: "metric", type: "str", default: "minkowski", description: "Distance function.", impact: "euclidean for dense numeric, cosine for text." },
      { name: "p", type: "int", default: "2", description: "Minkowski power.", impact: "1=manhattan, 2=euclidean." },
    ],
    snippet: {
      title: "KNN quickstart",
      language: "python",
      code: `from sklearn.neighbors import KNeighborsClassifier\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.pipeline import make_pipeline\n\nclf = make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=7, weights="distance"))\nclf.fit(X_train, y_train)`,
    },
    tips: ["Scale or distances lie.", "Cross-validate k on odd grid 1..21.", "KNN is slow at predict on big data."],
  },
  "naive-bayes": {
    slug: "naive-bayes",
    title: "Naive Bayes Cheatsheet",
    description: "alpha smoothing, priors, and text pipeline.",
    badge: "Classification",
    image: "/images/classification/naive-bayes-v2.webp",
    category: "classification",
    articleSlug: "naive-bayes",
    simSlug: "naive-bayes",
    params: [
      { name: "alpha", type: "float", default: "1.0", description: "Additive smoothing.", impact: "Lower (0.1) when vocab large, raise when sparse." },
      { name: "fit_prior", type: "bool", default: "True", description: "Learn class priors from data.", impact: "False + class_prior for balanced assumption." },
      { name: "binarize", type: "float | None", default: "0.0", description: "Bernoulli threshold.", impact: "Use for presence/absence text features." },
    ],
    snippet: {
      title: "Naive Bayes text quickstart",
      language: "python",
      code: `from sklearn.naive_bayes import MultinomialNB\nfrom sklearn.feature_extraction.text import TfidfVectorizer\nfrom sklearn.pipeline import make_pipeline\n\nclf = make_pipeline(TfidfVectorizer(), MultinomialNB(alpha=0.5))\nclf.fit(texts_train, y_train)`,
    },
    tips: ["TF-IDF + MultinomialNB is a strong baseline.", "Calibrate outputs if you need true probabilities.", "GaussianNB for continuous blobs (see sim)."],
  },
};

export const cheatsheetMetadata: Record<string, { title: string; description: string }> =
  Object.fromEntries(
    Object.values(cheatsheets).map((c) => [
      c.slug,
      { title: c.title, description: c.description },
    ]),
  );

export const cheatsheetList = Object.values(cheatsheets);
