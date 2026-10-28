export type ArticleSource = {
  label: string;
  url: string;
};

/** Primary documentation and references shown below each article's quiz. */
export const articleSources: Record<string, ArticleSource[]> = {
  "gradient-descent": [
    {
      label: "scikit-learn SGD user guide",
      url: "https://scikit-learn.org/stable/modules/sgd.html",
    },
    {
      label: "scikit-learn SGDClassifier API",
      url: "https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.SGDClassifier.html",
    },
  ],
  "least-squares": [
    {
      label: "scikit-learn LinearRegression API",
      url: "https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LinearRegression.html",
    },
    {
      label: "scikit-learn linear models guide",
      url: "https://scikit-learn.org/stable/modules/linear_model.html",
    },
  ],
  "linear-regression": [
    {
      label: "scikit-learn LinearRegression API",
      url: "https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LinearRegression.html",
    },
    {
      label: "scikit-learn linear models guide",
      url: "https://scikit-learn.org/stable/modules/linear_model.html",
    },
  ],
  "polynomial-regression": [
    {
      label: "scikit-learn PolynomialFeatures API",
      url: "https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.PolynomialFeatures.html",
    },
    {
      label: "scikit-learn Ridge API",
      url: "https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.Ridge.html",
    },
  ],
  "logistic-regression": [
    {
      label: "scikit-learn LogisticRegression API",
      url: "https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LogisticRegression.html",
    },
    {
      label: "scikit-learn classification guide",
      url: "https://scikit-learn.org/stable/supervised_learning.html",
    },
  ],
  "decision-trees": [
    {
      label: "scikit-learn DecisionTreeClassifier API",
      url: "https://scikit-learn.org/stable/modules/generated/sklearn.tree.DecisionTreeClassifier.html",
    },
    {
      label: "scikit-learn decision trees guide",
      url: "https://scikit-learn.org/stable/modules/tree.html",
    },
  ],
  "k-nearest-neighbors": [
    {
      label: "scikit-learn KNeighborsClassifier API",
      url: "https://scikit-learn.org/stable/modules/generated/sklearn.neighbors.KNeighborsClassifier.html",
    },
    {
      label: "scikit-learn nearest neighbors guide",
      url: "https://scikit-learn.org/stable/modules/neighbors.html",
    },
  ],
  "naive-bayes": [
    {
      label: "scikit-learn Naive Bayes guide",
      url: "https://scikit-learn.org/stable/modules/naive_bayes.html",
    },
    {
      label: "scikit-learn GaussianNB API",
      url: "https://scikit-learn.org/stable/modules/generated/sklearn.naive_bayes.GaussianNB.html",
    },
  ],
  "kernel-trick": [
    {
      label: "scikit-learn kernel approximation guide",
      url: "https://scikit-learn.org/stable/modules/kernel_approximation.html",
    },
    {
      label: "scikit-learn SVM guide",
      url: "https://scikit-learn.org/stable/modules/svm.html",
    },
  ],
  svr: [
    {
      label: "scikit-learn SVR API",
      url: "https://scikit-learn.org/stable/modules/generated/sklearn.svm.SVR.html",
    },
    {
      label: "scikit-learn support vector machines guide",
      url: "https://scikit-learn.org/stable/modules/svm.html",
    },
  ],
  "what-is-ml": [
    {
      label: "scikit-learn supervised learning guide",
      url: "https://scikit-learn.org/stable/supervised_learning.html",
    },
    {
      label: "scikit-learn estimator overview",
      url: "https://scikit-learn.org/stable/machine_learning_map.html",
    },
  ],
  "first-project": [
    {
      label: "Python virtual environments guide",
      url: "https://docs.python.org/3/library/venv.html",
    },
    {
      label: "FastAPI first steps",
      url: "https://fastapi.tiangolo.com/tutorial/first-steps/",
    },
    {
      label: "scikit-learn getting started",
      url: "https://scikit-learn.org/stable/getting_started.html",
    },
  ],
  "good-vs-bad-models": [
    {
      label: "scikit-learn model selection guide",
      url: "https://scikit-learn.org/stable/model_selection.html",
    },
    {
      label: "scikit-learn common pitfalls",
      url: "https://scikit-learn.org/stable/common_pitfalls.html",
    },
  ],
  pipeline: [
    {
      label: "scikit-learn Pipeline API",
      url: "https://scikit-learn.org/stable/modules/generated/sklearn.pipeline.Pipeline.html",
    },
    {
      label: "scikit-learn Compose guide (ColumnTransformer)",
      url: "https://scikit-learn.org/stable/modules/compose.html",
    },
    {
      label: "scikit-learn Model Persistence guide",
      url: "https://scikit-learn.org/stable/model_persistence.html",
    },
  ],
};
