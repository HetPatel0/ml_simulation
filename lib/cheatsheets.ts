export type CheatsheetParam = {
  name: string;
  type: string;
  default: string;
  description: string;
  impact?: string;
};

export type CheatsheetVariant = {
  name: string;
  api: string;
  bestFor: string;
  note?: string;
};

export type CheatsheetCompare = {
  versus: string;
  difference: string;
};

export type CheatsheetSource = {
  label: string;
  url: string;
};

export type Cheatsheet = {
  slug: string;
  title: string;
  description: string;
  badge: string;
  image: string;
  hero: string;
  /** Tailwind aspect class matching the hero image ratio (default aspect-video). */
  heroAspect?: string;
  category: "regression" | "classification" | "beginner" | "advanced";
  params: CheatsheetParam[];
  snippet: { title: string; language: string; code: string };
  simSlug?: string;
  articleSlug?: string;
  tips: string[];
  variants: CheatsheetVariant[];
  vsOthers: CheatsheetCompare[];
  pitfalls: string[];
  sources: CheatsheetSource[];
};

export const cheatsheets: Record<string, Cheatsheet> = {
  "linear-regression": {
    slug: "linear-regression",
    title: "Linear Regression Cheatsheet",
    description: "sklearn LinearRegression params, assumptions, and copy-paste snippets.",
    badge: "Regression",
    image: "/images/cheatsheet/thumbnail/linear-regression.webp",
    hero: "/images/cheatsheet/articles/linear-regression.webp",
    heroAspect: "aspect-[3/2]",
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
    variants: [
      { name: "Plain OLS", api: "sklearn.linear_model.LinearRegression", bestFor: "Few features, low noise, need interpretable coefficients", note: "Closed-form least squares — no regularization, uses scipy/DGGLSD via BLAS" },
      { name: "Ridge (L2)", api: "sklearn.linear_model.Ridge", bestFor: "Many correlated features; defaults on almost any tabular problem", note: "Shrinks coefficients toward 0, never exactly 0; usually beats OLS on test data" },
      { name: "Lasso (L1)", api: "sklearn.linear_model.Lasso", bestFor: "Feature selection — drives *some* coefficients to exactly 0", note: "Unstable when features are correlated; consider LassoLars for high-dim data" },
      { name: "ElasticNet", api: "sklearn.linear_model.ElasticNet", bestFor: "Correlated features + you still want sparsity", note: "Mixes L1 and L2 via l1_ratio; random_state needed when selection='random'" },
      { name: "Bayesian Ridge", api: "sklearn.linear_model.BayesianRidge", bestFor: "Small datasets, want uncertainty-aware coefficients", note: "Tunes regularization automatically; no alpha-grid search needed" },
      { name: "Robust regression", api: "sklearn.linear_model.{HuberRegressor, RANSACRegressor, TheilSenRegressor}", bestFor: "Data with outliers", note: "Huber down-weights outliers; RANSAC refits until consensus; Theil-Sen for median-slope of pairs" },
    ],
    vsOthers: [
      { versus: "Ridge / Lasso", difference: "Plain OLS has no penalty — it fits the training data exactly in the least-squares sense. Ridge/Lasso trade unbiasedness for variance reduction, almost always better out-of-sample when n is small or p is large." },
      { versus: "KNN Regressor", difference: "OLS fits a *global* equation; KNN predicts the local average of neighbors. OLS is fast at predict and extrapolates; KNN needs scaling and can't extrapolate past the data range." },
      { versus: "SVR", difference: "SVR ignores errors inside an epsilon-tube and uses kernels for nonlinearity; OLS counts every squared error and is linear in features (combine with PolynomialFeatures for curves)." },
    ],
    pitfalls: [
      "Non-centered features make the intercept huge and meaningless — scale or mean-center for interpretation.",
      "Ignoring assumption checks: linearity, homoscedasticity, normal residuals, no collinearity. The RMSE/OLS score can still look fine.",
      "VIF > 10 signals multicollinearity: coefficients flip sign depending on data; use Ridge or drop features.",
      "Using R² alone: a low R² doesn't mean bad fit if noise is high; a high R² on train can just be overfit.",
    ],
    sources: [
      { label: "sklearn LinearRegression API", url: "https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LinearRegression.html" },
      { label: "sklearn Linear Models guide", url: "https://scikit-learn.org/stable/modules/linear_model.html" },
      { label: "StatQuest: Linear Regression", url: "https://www.youtube.com/watch?v=nk2CQITm_PQ&list=PLblh5JKOoLUICTaGLRoHQDuF_7q2GfuJF" },
    ],
  },
  "gradient-descent": {
    slug: "gradient-descent",
    title: "Gradient Descent Cheatsheet",
    description: "Learning rate, batch size, momentum, and convergence diagnostics.",
    badge: "Optimization",
    image: "/images/cheatsheet/thumbnail/gradient-descent.webp",
    hero: "/images/cheatsheet/articles/gradient-descent.webp",
    heroAspect: "aspect-[3/2]",
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
    variants: [
      { name: "Batch GD", api: "gradient over full training set each step", bestFor: "Small datasets, smooth convex landscapes", note: "Stable, exact gradient, but slow and memory-hungry on big data" },
      { name: "Stochastic GD", api: "sklearn.linear_model.SGDRegressor / SGDClassifier", bestFor: "Large streaming datasets, online learning", note: "Noisy steps escape shallow local minima; needs learning-rate schedule" },
      { name: "Mini-batch GD", api: "batch sizes 32-512 (default in DL frameworks)", bestFor: "The workhorse for deep learning — best speed/stability trade-off", note: "Not natively in sklearn; sklearn's SGD is per-sample" },
      { name: "SGDClassifier with log_loss", api: "sklearn.linear_model.SGDClassifier(loss='log_loss')", bestFor: "Logistic regression on millions of rows", note: "Equivalent to LogisticRegression but trickier to converge; use average=True to stabilize" },
      { name: "Adam / RMSProp / AdaGrad", api: "torch.optim.Adam (not sklearn)", bestFor: "Neural networks and sparse gradients", note: "Per-coordinate adaptive learning rates; AdamW adds decoupled weight decay" },
    ],
    vsOthers: [
      { versus: "Direct solvers (OLS/LogisticRegression lbfgs)", difference: "Linear/Logistic problems have closed-form or quasi-Newton solutions that are faster and more accurate for n < ~100k. SGD wins when data doesn't fit memory or arrives as a stream." },
      { versus: "Newton-family", difference: "Newton uses curvature for big steps but is expensive; momentum-only GD approximates it cheaply. Memory: O(1 SGD) vs O(n² Newton)." },
      { versus: "SGD with AdaGrad", difference: "Plain SGD uses one global LR; AdaGrad keeps per-feature learning rates — better when features have very different scales." },
    ],
    pitfalls: [
      "Not scaling features: SGD zigzags along the steepest-feature axis and takes forever to converge.",
      "Too-large LR: loss goes to NaN/∞. Too small: 'ConvergenceWarning' and looks converged when it isn't.",
      "Feeding unscaled data straight into SGD when features have different value ranges.",
      "Forgetting tol: sklearn stops when improvement < tol, max_iter may never be the binding constraint.",
    ],
    sources: [
      { label: "sklearn SGD User Guide", url: "https://scikit-learn.org/stable/modules/sgd.html" },
      { label: "SGDRegressor API", url: "https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.SGDRegressor.html" },
      { label: "Stanford CS229 lecture notes on GD", url: "https://cs229.stanford.edu/notes/classnotes.pdf" },
    ],
  },
  "logistic-regression": {
    slug: "logistic-regression",
    title: "Logistic Regression Cheatsheet",
    description: "C, penalty, solver, and threshold tuning for binary classification.",
    badge: "Classification",
    image: "/images/cheatsheet/thumbnail/logistic-regression.webp",
    hero: "/images/cheatsheet/articles/logistic-regression.webp",
    heroAspect: "aspect-[3/2]",
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
    variants: [
      { name: "Binary logistic", api: "sklearn.linear_model.LogisticRegression", bestFor: "Two-class problems with a clean probability output", note: "Outputs P(y=1) via the sigmoid — threshold at 0.5 by default, move it to trade precision/recall" },
      { name: "Multinomial (softmax) LR", api: "LogisticRegression(multi_class='multinomial') (default for lbfgs)", bestFor: "3+ mutually exclusive classes", note: "Fits a softmax; 'ovr' fits one binary classifier per class instead" },
      { name: "SGDClassifier (log_loss)", api: "sklearn.linear_model.SGDClassifier(loss='log_loss')", bestFor: "Very large or streaming datasets", note: "Same model class, trained incrementally — needs more tuning to converge" },
      { name: "With nonlinearity", api: "PolynomialFeatures + LogisticRegression", bestFor: "Non-linear decision boundaries you still want as a linear classifier", note: "Polynomial features transform the space, sigmoid stays linear in that space" },
      { name: "Ordinal / multi-label", api: "OrdinalRegression lib (mord) / OneVsRestClassifier", bestFor: "Ordered labels (low<med<high) or overlapping labels", note: "sklearn doesn't do ordinal natively; use MultiOutputClassifier for multi-label" },
    ],
    vsOthers: [
      { versus: "Decision Tree", difference: "Logistic draws ONE hyperplane boundary — no interactions or thresholds discovered automatically. Trees carve axis-aligned regions and need no scaling; logistic needs scaling and feature engineering but gives smooth probabilities." },
      { versus: "SVC", difference: "LinearSVC is nearly the same decision function, tuned with hinge loss instead of log-loss. Logistic gives calibrated probabilities out of the box; SVC needs CalibratedClassifierCV." },
      { versus: "Naive Bayes", difference: "NB assumes features are independent given class; logistic learns coefficient weights per feature. NB is faster and great on tiny/text data, logistic usually wins more data." },
      { versus: "Ridge/L2-ish framing", difference: "penalty='l2' isn't an option you pick for accuracy — it's what stops coefficients exploding on separable data. l1 gives sparse selection." },
    ],
    pitfalls: [
      "Default lbfgs only supports l2/None — try saga for l1/elasticnet penalties.",
      "Threshold of 0.5 is arbitrary: on imbalanced data, precision-recall curves or threshold moving should follow.",
      "Perfect separation: with C too small and unregularized data, coefficients can blow up — raise max_iter, check ConvergenceWarning.",
      "Multi_class='auto' default changed across sklearn versions — pin your sklearn version in requirements and read the migration notes.",
    ],
    sources: [
      { label: "sklearn LogisticRegression API", url: "https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LogisticRegression.html" },
      { label: "sklearn Linear Models guide (all solvers compared)", url: "https://scikit-learn.org/stable/modules/linear_model.html#logistic-regression" },
      { label: "sklearn Calibration guide", url: "https://scikit-learn.org/stable/modules/calibration.html" },
    ],
  },
  "polynomial-regression": {
    slug: "polynomial-regression",
    title: "Polynomial Regression Cheatsheet",
    description: "Degree, interaction terms, and overfitting guards.",
    badge: "Regression",
    image: "/images/cheatsheet/thumbnail/polynomial-regression.webp",
    hero: "/images/cheatsheet/articles/polynomial-regression.webp",
    heroAspect: "aspect-[3/2]",
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
    variants: [
      { name: "Polynomial features", api: "sklearn.preprocessing.PolynomialFeatures", bestFor: "Curved relationships around a few numeric features", note: "Number of features explodes: k features → C(k+d, d) columns; degree 3 on 6 params ≈ 84 cols" },
      { name: "Interaction-only", api: "PolynomialFeatures(interaction_only=True)", bestFor: "Features that matter together (x1 * x2), not squared on their own", note: "Halves the column count vs raw degree-2 expansion" },
      { name: "Spline basis", api: "sklearn.preprocessing.SplineTransformer", bestFor: "Smooth, local curvature without the wild edges of polynomials", note: "Better extrapolation behavior than raw PolynomialFeatures; supports n_knots tuning" },
      { name: "Ordinal encoding", api: "sklearn.preprocessing.{KBinsDiscretizer.OrdinalEncoder}", bestFor: "Categorical features before poly expansion", note: "Must come before PolynomialFeatures in the pipeline" },
    ],
    vsOthers: [
      { versus: "SVR (rbf kernel)", difference: "Polynomial regression makes the nonlinearity *explicit* — you can see x² terms. Kernel SVR keeps it implicit; slower to train on large data but no feature explosion." },
      { versus: "GAM (Generalized Additive Model)", difference: "Plain poly lets every pair of features interact; a GAM fits each feature independently — usually better generalization but less expressive for interactions." },
      { versus: "High-degree polynomials alone", difference: "degree≫5 on noisy data gives extreme variance. Pair it with Ridge(alpha) to keep the wiggle where the data supports it." },
    ],
    pitfalls: [
      "Adding PolynomialFeatures **before** StandardScaler creates numerically huge columns — always scale, then expand.",
      "Fit PolynomialFeatures on both train and dev set independently — must use the same transformer fit on train (pipeline handles this for you).",
      "With Ridge and degree-3 on 6 features, total columns ≈ 84 — visualize with column names to spot surprising columns.",
    ],
    sources: [
      { label: "sklearn PolynomialFeatures API", url: "https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.PolynomialFeatures.html" },
      { label: "sklearn SplineTransformer for polynomial-like basis", url: "https://scikit-learn.org/stable/modules/preprocessing.html#spline-transformer" },
      { label: "Ridge regression User Guide", url: "https://scikit-learn.org/stable/modules/linear_model.html#ridge-regression" },
    ],
  },
  "svr": {
    slug: "svr",
    title: "SVR Cheatsheet",
    description: "epsilon, C, kernel, and gamma for Support Vector Regression.",
    badge: "Advanced",
    image: "/images/cheatsheet/thumbnail/svr.webp",
    hero: "/images/cheatsheet/articles/svr.webp",
    heroAspect: "aspect-[1200/514]",
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
    variants: [
      { name: "linear kernel", api: `SVR(kernel="linear") or sklearn.svm.LinearSVR`, bestFor: "Many samples (n>10k) or few features", note: "LinearSVR scales linearly in n; full SVR quadratic — O(n²)-O(n³)" },
      { name: "RBF kernel", api: "SVR(kernel=\"rbf\")", bestFor: "Smooth curve-fitting (default)", note: "gamma = influence radius: gamma='scale' (=1/(n_features * X.var())) is the safe default" },
      { name: "Polynomial kernel", api: "SVR(kernel=\"poly\", degree=3)", bestFor: "Polynomial structure without expanding features manually", note: "coef0 matters: with degree>1 it lets polynomial survive independent of the linear part" },
      { name: "NuSVR", api: "sklearn.svm.NuSVR", bestFor: "When you want to control the fraction of *support vectors* (nu) instead of epsilon", note: "nu ∈ (0,1] replaces the epsilon knob; sklearn docs list the exact conversion formula" },
      { name: "One-Class SVM", api: "sklearn.svm.OneClassSVM", bestFor: "Outlier/novelty detection, not regression", note: "Different task — flag it clearly or you'll misuse SVR for anomaly detection" },
    ],
    vsOthers: [
      { versus: "Ridge/Lasso", difference: "SVR ignores errors inside the epsilon tube; OLS family penalizes *every* residual squared. SVR thus produces a flat, sparse fit — handy when small errors are acceptable noise, bad when you need to match every point." },
      { versus: "Polynomial Regression", difference: "Same kind of nonlinearity, different math — poly features are explicit; kernel tricks are implicit. SVR handles higher-dim nonlinear fits without feature explosion; polynomial regression is more interpretable." },
      { versus: "Random Forest Regressor", difference: "RF needs no scaling and captures discontinuous steps; SVR is smooth but needs scaling and is fragile to outliers. If data is big (n>50k), RF or gradient boosting usually wins on speed." },
      { versus: "SVC", difference: "Same math, different loss: SVR's epsilon-tube vs SVC's margin/hinge for classification." },
    ],
    pitfalls: [
      "Forgetting StandardScaler — the distance-based kernel is meaningless with unscaled features.",
      "Setting epsilon=0 turns SVR into something closer to plain ridge-like loss with all points as support vectors.",
      "Forgetting that svc-like OneClassSVM is a different task — don't reach for SVR when you want anomaly detection.",
      "Forgetting LinearSVR vs SVR(kernel='linear') — LinearSVR scales to large n and supports L1/L2 regularization.",
    ],
    sources: [
      { label: "sklearn SVM User Guide (all kernels, epsilon-tube math)", url: "https://scikit-learn.org/stable/modules/svm.html" },
      { label: "SVR API", url: "https://scikit-learn.org/stable/modules/generated/sklearn.svm.SVR.html" },
      { label: "NuSVR API (nu vs epsilon conversion)", url: "https://scikit-learn.org/stable/modules/generated/sklearn.svm.NuSVR.html" },
    ],
  },
  "decision-trees": {
    slug: "decision-trees",
    title: "Decision Trees Cheatsheet",
    description: "max_depth, impurity, pruning knobs that stop overfitting.",
    badge: "Classification",
    image: "/images/cheatsheet/thumbnail/decision-trees.webp",
    hero: "/images/cheatsheet/articles/decision-trees.webp",
    heroAspect: "aspect-[3/2]",
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
    variants: [
      { name: "DecisionTreeClassifier", api: "sklearn.tree.DecisionTreeClassifier", bestFor: "Categorical targets with tabular features", note: "CART algorithm; greedy top-down split by Gini/entropy" },
      { name: "DecisionTreeRegressor", api: "sklearn.tree.DecisionTreeRegressor", bestFor: "Numeric targets, captures non-linear thresholds naturally", note: "Split criterion: Friedman MSE, squared error, or MAE; predicts the mean (or median w/ MAE) of leaves" },
      { name: "ExtraTrees (Extremely Randomized)", api: "sklearn.ensemble.ExtraTreesClassifier", bestFor: "Lower variance trees via random split thresholds", note: "Uses random thresholds rather than best-threshold search → faster and more variance reduction" },
      { name: "Hundreds of trees", api: "sklearn.ensemble.RandomForestClassifier", bestFor: "Bagging many shallow trees — usually better accuracy than a single tree", note: "First knob to try after a single tree underperforms" },
      { name: "Pre-pruned vs post-pruned", api: "max_depth / min_samples_leaf vs ccp_alpha", bestFor: "Stopping overfit BEFORE vs AFTER growing a full tree", note: "ccp_alpha uses cost-complexity pruning — sklearn docs show pruning path API" },
    ],
    vsOthers: [
      { versus: "Linear / Logistic Regression", difference: "Trees need no scale, discover interaction thresholds automatically, and are non-parametric. Linear models need scaling + feature engineering but extrapolate; trees can only predict within leaf-mean ranges — they cannot extrapolate to unseen feature values." },
      { versus: "Random Forest / Gradient Boosting", difference: "A single tree is high-variance and unstable. Ensembles average/boost many trees → less variance, more accuracy, but lose the easy-to-plot interpretability." },
      { versus: "KNN", difference: "Both non-parametric and axis-aligned-ish, but trees generalize with hard rules; KNN stores training data and answers queries at predict-time. Trees are far faster at inference." },
      { versus: "Naive Bayes", difference: "NB assumes feature independence (wrong often); trees learn feature interactions directly — nearly always more accurate on tabular data." },
    ],
    pitfalls: [
      "Unpruned tree memorizes: 100% train accuracy is normal *and* useless — always prune (max_depth, ccp_alpha) before evaluating.",
      "Trees can't extrapolate past the max/min of training data — beware of regressions on ranges outside training.",
      "Duplicate features with identical values across features (common with one-hot heavy data) can dominate splits and overfit.",
      "Numerically-tuned trees on tiny data don't converge — cross-validate and average across sklearn's random_state.",
      "Note: impurity criterion gini vs entropy changes splits by <1% in practice — don't over-tune it.",
    ],
    sources: [
      { label: "sklearn Decision Trees User Guide", url: "https://scikit-learn.org/stable/modules/tree.html" },
      { label: "DecisionTreeClassifier API", url: "https://scikit-learn.org/stable/modules/generated/sklearn.tree.DecisionTreeClassifier.html" },
      { label: "Cost-complexity pruning example (sklearn docs)", url: "https://scikit-learn.org/stable/auto_examples/tree/plot_cost_complexity_pruning.html" },
    ],
  },
  "k-nearest-neighbors": {
    slug: "k-nearest-neighbors",
    title: "KNN Cheatsheet",
    description: "k, weights, metric, and scaling checklist.",
    badge: "Classification",
    image: "/images/cheatsheet/thumbnail/k-nearest-neighbors.webp",
    hero: "/images/cheatsheet/articles/k-nearest-neighbors.webp",
    heroAspect: "aspect-[3/2]",
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
    variants: [
      { name: "KNeighborsClassifier", api: "sklearn.neighbors.KNeighborsClassifier", bestFor: "Small-to-medium tabular data with numeric features", note: "algorithm='auto' picks between brute, kd_tree, ball_tree based on data shape" },
      { name: "KNeighborsRegressor", api: "sklearn.neighbors.KNeighborsRegressor", bestFor: "Regression by local averaging of k nearest targets", note: "weights='distance' reduces the step-like output a bit; still piecewise by nature" },
      { name: "RadiusNeighbors", api: "sklearn.neighbors.RadiusNeighborsClassifier", bestFor: "Non-uniform class density; breaks the fixed-k assumption", note: "Can fail (raise) when a query point has 0 neighbors in radius 'r' — handle with outlier_label" },
      { name: "NearestCentroid", api: "sklearn.neighbors.NearestCentroid", bestFor: "Very high-dimensional sparse data (text with TF-IDF)", note: "Class-membership = nearest class centroid; shrink_threshold helps when features are few" },
      { name: "KNNImputer", api: "sklearn.impute.KNNImputer", bestFor: "Missing-value imputation using nearest-complete rows", note: "Bonus use of the same neighbor machinery" },
    ],
    vsOthers: [
      { versus: "Logistic / Linear models", difference: "KNN is lazy: no training, predicting is expensive (O(n) per query). Linear models train once and predict in O(d). Rule of thumb: if predict latency matters or n is large, prefer a linear model." },
      { versus: "Decision Tree", difference: "Both non-parametric, but trees give interpretable rules and fast predict; KNN often better with dense smooth decision boundaries but slower and less explainable." },
      { versus: "SVM (RBF)", difference: "Both use distance-like structure: SVM kernelizes and compresses (support vectors) while KNN keeps all data. SVM gives smooth boundaries; KNN boundaries are jagged, sensitive to k." },
      { versus: "Naive Bayes", difference: "KNN uses spatial distance; NB uses per-feature likelihoods and is much faster. For text, NB usually wins; for low-dim dense features KNN is competitive." },
    ],
    pitfalls: [
      "Curse of dimensionality: with 100+ features, distances concentrate — do PCA / feature selection first.",
      "Skewed k: class imbalance means majority-class neighbors dominate votes — consider weights='distance' or rebalancing.",
      "KNeighborsRegressor on extrapolation: output is bounded by the min/max y of neighbors — can never predict beyond the training range.",
      "for algorithm='auto' on low-dimensional data, brute force may be chosen instead of kd_tree — sklearn docs detail the switch.",
      "Memory footprint grows linearly with n (all of train stays in RAM).",
    ],
    sources: [
      { label: "sklearn Nearest Neighbors User Guide", url: "https://scikit-learn.org/stable/modules/neighbors.html" },
      { label: "KNeighborsClassifier API", url: "https://scikit-learn.org/stable/modules/generated/sklearn.neighbors.KNeighborsClassifier.html" },
      { label: "sklearn Unsupervised Neighbors (KD/Ball tree details)", url: "https://scikit-learn.org/stable/modules/neighbors.html#unsupervised-neighbors" },
    ],
  },
  "naive-bayes": {
    slug: "naive-bayes",
    title: "Naive Bayes Cheatsheet",
    description: "alpha smoothing, priors, and text pipeline.",
    badge: "Classification",
    image: "/images/cheatsheet/thumbnail/naive-bayes.webp",
    hero: "/images/cheatsheet/articles/naive-bayes.webp",
    heroAspect: "aspect-[3/2]",
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
    variants: [
      { name: "GaussianNB", api: "sklearn.naive_bayes.GaussianNB", bestFor: "Continuous numeric features, mixture-of-Gaussians shapes", note: "var_smoothing default 1e-9 prevents zero-variance blowups; try 1e-8–1e-7 as a tuning knob" },
      { name: "MultinomialNB", api: "sklearn.naive_bayes.MultinomialNB", bestFor: "Count-based (text) features — TF-IDF, word counts", note: "Requires non-negative integer-like features; alpha is Laplace smoothing" },
      { name: "BernoulliNB", api: "sklearn.naive_bayes.BernoulliNB", bestFor: "Binary (yes/no) features: word *presence*, not count", note: "binarize threshold converts counts to 0/1 for you" },
      { name: "ComplementNB", api: "sklearn.naive_bayes.ComplementNB", bestFor: "Imbalanced text classification — beats plain MultinomialNB", note: "Uses feature weights from the *complement* class; recommended by Rennie et al." },
      { name: "CategoricalNB", api: "sklearn.naive_bayes.CategoricalNB", bestFor: "Properly categorical features (integer-encoded)", note: "Expects category indices 0..n_categories-1; use OrdinalEncoder to fit" },
    ],
    vsOthers: [
      { versus: "Logistic Regression", difference: "NB learns class-conditional feature distributions, assuming independence. Logistic learns per-feature weights without that assumption. Logistic usually wins with lots of data; NB is cheaper, works great on tiny/text corpora and provides a class-level P(y) without fitting most parameters." },
      { versus: "Decision Tree", difference: "Trees handle feature interactions; NB *can't* (that's the 'naive' part). Trees usually win on tabular data with interactions; NB is very fast for text and one-hot blocked features." },
      { versus: "KNN", difference: "NB is far faster at predict and handles high-dimensional sparse features naturally (text) where KNN distances become meaningless." },
      { versus: "SVM (linear)", difference: "Linear SVM and MultinomialNB are both top text baselines. SVM usually edges out NB with more data; NB needs no tuning and trains in one pass." },
    ],
    pitfalls: [
      "Features with negative values (e.g. PCA output, standard scaled data) break MultinomialNB silently — sklearn raises a ValueError; switch to GaussianNB instead.",
      "Naive independence assumption: correlated features double-count evidence; no fix inside NB — the wrong probabilities are only useful for ranking.",
      "class_prior vs fit_prior: with fit_prior=True, NB learns imbalanced priors that can *surprise* you on resampled training data.",
      "NB probabilities are badly calibrated for ranking *against* thresholds — run CalibratedClassifierCV if you need readouts in %.",
    ],
    sources: [
      { label: "sklearn Naive Bayes User Guide", url: "https://scikit-learn.org/stable/modules/naive_bayes.html" },
      { label: "MultinomialNB API", url: "https://scikit-learn.org/stable/modules/generated/sklearn.naive_bayes.MultinomialNB.html" },
      { label: "Text classification with NB (sklearn example)", url: "https://scikit-learn.org/stable/tutorial/text_analytics/working_with_text_data.html" },
    ],
  },
  "pipeline": {
    slug: "pipeline",
    title: "Pipeline Cheatsheet",
    description: "sklearn Pipeline chaining, leakage-proof fitting, and how to ship the same object to production.",
    badge: "Workflow",
    image: "/images/cheatsheet/articles/pipeline.webp",
    hero: "/images/cheatsheet/articles/pipeline.webp",
    heroAspect: "aspect-[1200/671]",
    category: "advanced",
    articleSlug: "pipeline",
    params: [
      { name: "steps", type: "list[tuple]", default: "required", description: "Ordered (name, estimator) pairs; last step is the model.", impact: "Order matters: scalers/encoders must come before the estimator." },
      { name: "memory", type: "str | None", default: "None", description: "Directory to cache transformer outputs.", impact: "Speeds repeated GridSearchCV fits across slow transformers." },
      { name: "verbose", type: "bool", default: "False", description: "Print per-step timing during fit.", impact: "True shows which step is the bottleneck." },
    ],
    snippet: {
      title: "Production-ready pipeline",
      language: "python",
      code: `from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
import joblib

preprocess = ColumnTransformer([
    ("num", StandardScaler(), ["age", "income"]),
    ("cat", OneHotEncoder(handle_unknown="ignore"), ["region"]),
])

pipe = Pipeline([
    ("preprocess", preprocess),
    ("model", LogisticRegression(max_iter=1000)),
]).fit(X_train, y_train)

joblib.dump(pipe, "model.joblib")  # one artifact: preprocessing + model

# later, in serving:
pipe = joblib.load("model.joblib")
pipe.predict(X_new)                # no manual preprocessing here`,
    },
    tips: ["Cross-validate the whole pipeline, never the bare model.", "Tune inner steps with stepname__param strings.", "Name your steps — debugging and claims depends on it.", "One joblib dump ships preprocessing + model together."],
    variants: [
      { name: "Pipeline", api: "sklearn.pipeline.Pipeline", bestFor: "Chaining any ordered fit/transform sequence ending in an estimator", note: "pipe.fit() calls fit_transform on all but the last step, fit on the last" },
      { name: "make_pipeline", api: "sklearn.pipeline.make_pipeline", bestFor: "Quick scripts — auto-names steps from class names", note: "Step names become lowercase class names; use named Pipeline when you grid-search" },
      { name: "ColumnTransformer", api: "sklearn.compose.ColumnTransformer", bestFor: "Different transforms for numeric vs categorical columns", note: "Nest it as the first Pipeline step; handle_unknown='ignore' keeps prod safe on new categories" },
      { name: "TransformedTargetRegressor", api: "sklearn.compose.TransformedTargetRegressor", bestFor: "Also transforming y (log target) without leaking into eval", note: "Wraps the estimator + its y-transformer into one object" },
      { name: "Persistence", api: "joblib.dump / joblib.load", bestFor: "Shipping the exact fit/transform chain to serving", note: "Pin sklearn version: unpickling across major versions can break" },
    ],
    vsOthers: [
      { versus: "Manual fit/transform calls", difference: "Hand-chaining scaler.fit + transform + model.fit lets you accidentally fit transformers on the test set. Pipeline saves the fitted state inside one object and re-applies only transform() at predict — leakage becomes hard by construction." },
      { versus: "FeatureUnion", difference: "Pipeline is sequential (each step consumes the previous output); FeatureUnion runs transformers in parallel and concatenates their outputs. Use Pipeline for order, FeatureUnion inside a step to merge parallel branches." },
      { versus: "Notebook preprocessing", difference: "Copy-pasted preprocessing code between notebook and serving code drifts silently. The pipeline is the single source of truth — dump and load it instead of re-implementing steps." },
    ],
    pitfalls: [
      "Fitting transformers on the full dataset before splitting — test-set statistics leak into training. Fit the whole pipeline inside cross_val_score or after the split.",
      "Wrong step types: only the LAST step may be an estimator. sklearn validates this at fit time with a ValueError.",
      "Grid-searching with the wrong name: params use 'stepname__param' syntax — 'clf__C' not 'C'. Mechanics fail via fit-error or get_params lookup.",
      "Unpickling across sklearn major versions: a joblib dump is not forward compatible — pin versions in requirements and retrain if the toolchain changes.",
    ],
    sources: [
      { label: "sklearn Pipeline API", url: "https://scikit-learn.org/stable/modules/generated/sklearn.pipeline.Pipeline.html" },
      { label: "sklearn Compose guide (ColumnTransformer)", url: "https://scikit-learn.org/stable/modules/compose.html" },
      { label: "sklearn Model Persistence guide", url: "https://scikit-learn.org/stable/model_persistence.html" },
    ],
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
