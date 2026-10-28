"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowDownUp, ArrowRight, Check, ExternalLink, Info, Link2, Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { averageScores, familyProfilesById, getModelScores, getModelSpeedTip, type ModelScores, type ModelSpec } from "@/lib/model-comparison";

type Props = { models: ModelSpec[] };

type SelectedItem = { type: "model" | "family"; id: string };

type RecTask = "Classification" | "Regression" | "Clustering" | "Dimensionality reduction" | "Anomaly detection";
type RecSize = "Small" | "Medium" | "Large";
type RecPriority = "Balanced" | "Interpretability" | "Accuracy" | "Speed";

type MobileInsight = { title: string; body: React.ReactNode };

const InsightContext = React.createContext<((insight: MobileInsight) => void) | null>(null);

function useCoarsePointer() {
  const [coarsePointer, setCoarsePointer] = React.useState(false);

  React.useEffect(() => {
    const query = window.matchMedia("(hover: none), (pointer: coarse)");
    const update = () => setCoarsePointer(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return coarsePointer;
}

const chipBase = "cursor-pointer rounded-full border px-3 py-1 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

const scoreRows: { label: string; key: keyof ModelScores; why: string }[] = [
  { label: "Interpretability", key: "interpretability", why: "easiest to explain to a person" },
  { label: "Training speed", key: "trainSpeed", why: "fastest to fit" },
  { label: "Prediction speed", key: "predictSpeed", why: "fastest to score new rows" },
  { label: "Tuning ease", key: "tuningEase", why: "least sensitive to hyperparameters" },
];

const quickComparisons: { label: string; ids: string[] }[] = [
  { label: "Logistic vs Random Forest", ids: ["logistic-regression", "random-forest"] },
  { label: "Ridge vs Lasso", ids: ["ridge", "lasso"] },
  { label: "Random Forest vs Gradient Boosting", ids: ["random-forest", "gradient-boosting"] },
  { label: "K-Means vs DBSCAN", ids: ["kmeans", "dbscan"] },
  { label: "PCA vs Truncated SVD", ids: ["pca", "truncated-svd"] },
  { label: "Isolation Forest vs LOF", ids: ["isolation-forest", "local-outlier-factor"] },
];

const recommendationRules: Record<RecTask, Record<RecSize, string[]>> = {
  Classification: {
    Small: ["logistic-regression", "gaussian-nb", "decision-tree"],
    Medium: ["logistic-regression", "random-forest", "hist-gradient-boosting"],
    Large: ["sgd-classifier", "hist-gradient-boosting", "linear-svc"],
  },
  Regression: {
    Small: ["linear-regression", "ridge", "decision-tree"],
    Medium: ["hist-gradient-boosting", "random-forest", "ridge"],
    Large: ["sgd-regressor", "hist-gradient-boosting", "random-forest"],
  },
  Clustering: {
    Small: ["kmeans", "agglomerative", "dbscan"],
    Medium: ["kmeans", "dbscan", "birch"],
    Large: ["mini-batch-kmeans", "birch", "kmeans"],
  },
  "Dimensionality reduction": {
    Small: ["pca", "factor-analysis", "truncated-svd"],
    Medium: ["pca", "truncated-svd", "kernel-pca"],
    Large: ["incremental-pca", "truncated-svd", "pca"],
  },
  "Anomaly detection": {
    Small: ["isolation-forest", "elliptic-envelope", "one-class-svm"],
    Medium: ["isolation-forest", "local-outlier-factor", "one-class-svm"],
    Large: ["sgd-one-class", "isolation-forest", "local-outlier-factor"],
  },
};

const recommendationPriority: Record<RecTask, Record<Exclude<RecPriority, "Balanced">, string[]>> = {
  Classification: {
    Interpretability: ["logistic-regression", "decision-tree", "gaussian-nb"],
    Accuracy: ["hist-gradient-boosting", "random-forest", "svc"],
    Speed: ["sgd-classifier", "linear-svc", "gaussian-nb"],
  },
  Regression: {
    Interpretability: ["linear-regression", "ridge", "decision-tree"],
    Accuracy: ["hist-gradient-boosting", "random-forest", "gradient-boosting"],
    Speed: ["sgd-regressor", "linear-regression", "ridge"],
  },
  Clustering: {
    Interpretability: ["kmeans", "agglomerative", "birch"],
    Accuracy: ["dbscan", "spectral-clustering", "agglomerative"],
    Speed: ["mini-batch-kmeans", "birch", "kmeans"],
  },
  "Dimensionality reduction": {
    Interpretability: ["pca", "truncated-svd", "factor-analysis"],
    Accuracy: ["kernel-pca", "sparse-pca", "factor-analysis"],
    Speed: ["pca", "truncated-svd", "incremental-pca"],
  },
  "Anomaly detection": {
    Interpretability: ["isolation-forest", "elliptic-envelope", "one-class-svm"],
    Accuracy: ["local-outlier-factor", "isolation-forest", "one-class-svm"],
    Speed: ["sgd-one-class", "isolation-forest", "one-class-svm"],
  },
};

const recTaskOptions: RecTask[] = ["Classification", "Regression", "Clustering", "Dimensionality reduction", "Anomaly detection"];
const recSizeOptions: RecSize[] = ["Small", "Medium", "Large"];
const recPriorityOptions: RecPriority[] = ["Balanced", "Interpretability", "Accuracy", "Speed"];

const popularModelIds = new Set([
  "linear-regression",
  "logistic-regression",
  "decision-tree",
  "random-forest",
  "gaussian-nb",
  "knn",
  "svc",
  "gradient-boosting",
  "pca",
  "kmeans",
]);

const quickSearches = ["text", "imbalanced", "small data", "nonlinear", "fast", "outliers"];
const searchAliases: Record<string, string> = {
  logical: "logistic",
  text: "multinomial bernoulli complement tf-idf sparse",
  imbalanced: "complement class_prior threshold recall precision",
  "small data": "gaussian naive bayes svm knn",
  nonlinear: "tree kernel forest gradient boosting neural",
  fast: "sgd naive bayes linear dummy",
  outliers: "huber ransac isolation forest robust",
};

function familyId(family: string) {
  return family.toLowerCase().replace(/[ /]/g, "-");
}

function getFamilySummary(family: string, models: ModelSpec[]) {
  const familyModels = models.filter((m) => m.family === family);
  const rep = familyModels[0];
  if (!rep) return null;

  const profile = familyProfilesById[family];
  const tasksStr = Array.from(new Set(familyModels.map((m) => m.task))).join(", ");

  return {
    id: familyId(family),
    name: familyTitle(family),
    family,
    task: tasksStr,
    coreAssumption: profile?.coreAssumption ?? familyModels.map((m) => m.summary).join(" | "),
    when: profile?.when ?? rep.when,
    why: profile?.why ?? rep.why,
    avoid: profile?.avoid ?? rep.avoid,
    scaling: profile?.scaling ?? rep.scaling,
    interpretability: profile?.interpretability ?? rep.interpretability,
    training: profile?.training ?? rep.training,
    prediction: profile?.prediction ?? rep.prediction,
    probability: profile?.probability ?? rep.probability,
    speedTip: profile?.speedTip ?? getModelSpeedTip(rep),
    scores: averageScores(familyModels),
    strengths: profile?.strengths ?? Array.from(new Set(familyModels.flatMap((m) => m.strengths))).slice(0, 5),
    limitations: profile?.limitations ?? Array.from(new Set(familyModels.flatMap((m) => m.limitations))).slice(0, 5),
    tips: profile?.tips ?? Array.from(new Set(familyModels.flatMap((m) => m.tips))).slice(0, 5),
    alternatives: profile?.alternatives ?? Array.from(new Set(familyModels.flatMap((m) => m.alternatives))).slice(0, 5),
    modelCount: familyModels.length,
    representativeModels: familyModels.slice(0, 3).map((m) => m.name).join(", "),
  };
}

type FamilySpec = NonNullable<ReturnType<typeof getFamilySummary>>;

type Column =
  | { type: "model"; model: ModelSpec }
  | { type: "family"; family: FamilySpec };

function columnScores(column: Column): ModelScores {
  return column.type === "model" ? getModelScores(column.model) : column.family.scores;
}

function columnName(column: Column) {
  return column.type === "model" ? column.model.name : column.family.name;
}

function plainSpeedTip(text: string) {
  return text.replace(/`/g, "");
}

function recommendModels(task: RecTask, size: RecSize, priority: RecPriority, models: ModelSpec[]) {
  const ids = priority === "Balanced"
    ? recommendationRules[task][size]
    : recommendationPriority[task][priority];
  return ids
    .map((id) => models.find((model) => model.id === id))
    .filter((model): model is ModelSpec => Boolean(model));
}

function formatList(items: string[]) {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

function recommendationReason(model: ModelSpec, task: RecTask, size: RecSize, priority: RecPriority) {
  const scores = getModelScores(model);
  const context = `${size.toLowerCase()} ${task.toLowerCase()}`;

  if (priority === "Balanced") {
    const average = (scores.interpretability + scores.trainSpeed + scores.predictSpeed + scores.tuningEase) / 4;
    const topMetric = scoreRows.reduce((best, row) => scores[row.key] > scores[best.key] ? row : best, scoreRows[0]);
    return `Balanced fit for ${context} data; averages ${average.toFixed(1)}/5, led by ${topMetric.label.toLowerCase()} (${scores[topMetric.key]}/5).`;
  }
  if (priority === "Interpretability") {
    return `Interpretability ${scores.interpretability}/5 for ${context} data.`;
  }
  if (priority === "Speed") {
    return `Training ${scores.trainSpeed}/5 and prediction ${scores.predictSpeed}/5 for ${context} data.`;
  }
  return `Shortlisted for accuracy on ${task.toLowerCase()} tasks; ${model.why}`;
}

const unifiedRows: { label: string; model: (model: ModelSpec) => string; family: (family: FamilySpec) => string }[] = [
  { label: "Best for", model: (m) => m.task, family: (f) => f.task },
  { label: "Core idea", model: (m) => m.summary, family: (f) => f.coreAssumption },
  { label: "Feature scaling", model: (m) => m.scaling, family: (f) => f.scaling },
  { label: "Interpretability", model: (m) => m.interpretability, family: (f) => f.interpretability },
  { label: "Training cost", model: (m) => m.training, family: (f) => f.training },
  { label: "Prediction cost", model: (m) => m.prediction, family: (f) => f.prediction },
  { label: "Speed tip", model: (m) => plainSpeedTip(getModelSpeedTip(m)), family: (f) => plainSpeedTip(f.speedTip) },
  { label: "Probability output", model: (m) => m.probability, family: (f) => f.probability },
  { label: "When to use", model: (m) => m.when, family: (f) => f.when },
  { label: "Why use it", model: (m) => m.why, family: (f) => f.why },
  { label: "Avoid when", model: (m) => m.avoid, family: (f) => f.avoid },
];

const glossary: Record<string, string> = {
  "feature scaling": "Putting numeric features on comparable ranges so distance, margins, and regularization behave fairly.",
  interpretability: "How easily a person can understand why a model made a prediction.",
  "probability output": "A model's confidence-like estimate; it still needs validation and calibration before decision-making.",
  "neural network": "Layers of learned weights connected by nonlinear activation functions. They can learn complex representations.",
  LLM: "Large Language Model: a neural network trained on huge text collections to predict and generate language.",
  transformer: "A neural network architecture that uses attention to relate tokens or patches across a sequence.",
  regularization: "A constraint or penalty that discourages overly complex models and helps reduce overfitting.",
  overfitting: "When a model memorizes training patterns or noise and performs worse on new data.",
  calibration: "Whether predicted probabilities match observed frequencies; 0.8 should mean roughly 80% correct over many cases.",
  kernel: "A similarity function that lets some models learn curved boundaries without explicitly creating every new feature.",
  sparse: "A data matrix with mostly zero values, common in bag-of-words and one-hot encoded features.",
};

function mainCategory(model: ModelSpec) {
  if (model.task.includes("Semi-supervised")) return "Semi-supervised learning";
  if (model.task.includes("Unsupervised") || model.task.includes("Density") || model.task.includes("Dimensionality") || model.task.includes("Topic") || model.task.includes("Anomaly") || model.task.includes("Covariance")) return "Unsupervised learning";
  if (model.task.includes("Classification") || model.task.includes("Regression") || model.task.includes("Multilabel")) return "Supervised learning";
  return "Modeling tools";
}

function familyTitle(family: string) {
  const titles: Record<string, string> = {
    Linear: "Linear Regression family",
    "Linear classification": "Logistic Regression family",
    "Naive Bayes": "Naive Bayes family",
    Tree: "Decision Tree family",
    "Tree ensemble": "Tree Ensemble family",
    "Margin / kernel": "Support Vector family",
    "Instance-based": "Nearest Neighbor family",
    "Neural network": "Neural Network family",
  };
  return titles[family] ?? `${family} family`;
}

function LearnedTerm({ term, children }: { term: string; children?: React.ReactNode }) {
  const showInsight = React.useContext(InsightContext);
  const coarsePointer = useCoarsePointer();
  const label = children ?? term;

  if (coarsePointer && showInsight) {
    return <button type="button" onClick={() => showInsight({ title: `Glossary: ${term}`, body: glossary[term] ?? term })} className="inline cursor-pointer border-b border-dotted border-primary/70 p-0 text-left text-foreground">{label}</button>;
  }

  return <Tooltip><TooltipTrigger asChild><span tabIndex={0} className="cursor-help border-b border-dotted border-primary/70 text-foreground">{label}</span></TooltipTrigger><TooltipContent>{glossary[term] ?? term}</TooltipContent></Tooltip>;
}

function docsUrl(api: string) {
  const moduleMatch = api.match(/^(sklearn\.[a-z_]+)/);
  if (!moduleMatch) return "https://scikit-learn.org/stable/api/";
  const module = moduleMatch[1];
  const classMatch = api.match(/^[^ ]+\.([A-Za-z][A-Za-z0-9_]*)/);
  return classMatch
    ? `https://scikit-learn.org/stable/modules/generated/${module}.${classMatch[1]}.html`
    : `https://scikit-learn.org/stable/api/${module}.html`;
}

function modelDocs(model: ModelSpec) {
  return model.family === "Neural network"
    ? { href: "https://docs.pytorch.org/tutorials/beginner/basics/intro.html", label: "PyTorch documentation" }
    : { href: docsUrl(model.sklearn), label: "Official API / parameters" };
}

function SpecList({ items, negative = false }: { items: string[]; negative?: boolean }) {
  return <ul className="space-y-2 text-sm leading-6 text-muted-foreground">{items.map((item) => <li key={item} className="flex items-start gap-2"><span className="mt-1 shrink-0">{negative ? <X size={14} className="text-destructive" /> : <Check size={14} className="text-primary" />}</span><span>{item}</span></li>)}</ul>;
}

function ModelInsight({ model }: { model: ModelSpec }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <p className="font-semibold">{model.name}</p>
        {popularModelIds.has(model.id) && <span className="rounded-full bg-primary-foreground/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]">Most popular</span>}
      </div>
      <p>{model.summary}</p>
      <p><span className="font-medium">Use when:</span> {model.when}</p>
      <p><span className="font-medium">Avoid:</span> {model.avoid}</p>
    </div>
  );
}

function FamilyInsight({ family }: { family: FamilySpec }) {
  return (
    <div className="space-y-2">
      <p className="font-semibold">{family.name}</p>
      <p>{family.coreAssumption}</p>
      <p><span className="font-medium">Best for:</span> {family.task}</p>
      <p><span className="font-medium">Models:</span> {family.representativeModels}</p>
    </div>
  );
}

function ScoreBar({ score }: { score: number }) {
  const percent = Math.max(0, Math.min(100, (score / 5) * 100));
  return <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted" aria-hidden="true"><div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} /></div>;
}

function SpeedTip({ text }: { text: string }) {
  return (
    <p className="mt-1 text-sm leading-6 text-muted-foreground">
      {text.split(/(`[^`]+`)/g).map((part, index) => part.startsWith("`") && part.endsWith("`")
        ? <code key={index} className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em] text-foreground">{part.slice(1, -1)}</code>
        : <React.Fragment key={index}>{part}</React.Fragment>)}
    </p>
  );
}

function WinnerBadge({ label, score, why, tied }: { label: string; score: number; why: string; tied: boolean }) {
  const showInsight = React.useContext(InsightContext);
  const coarsePointer = useCoarsePointer();
  const title = `${tied ? "Tied best" : "Best"} ${label.toLowerCase()}`;
  const detail = `${score}/5 — ${why} among the selected items.`;

  if (coarsePointer && showInsight) {
    return <button type="button" onClick={() => showInsight({ title, body: detail })} className="cursor-pointer rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-primary">{tied ? "Tied" : "Best"}</button>;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span tabIndex={0} className="cursor-help rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-primary">{tied ? "Tied" : "Best"}</span>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        {tied ? "Tied best" : "Best"} {label.toLowerCase()} ({score}/5): {why} among the selected items.
      </TooltipContent>
    </Tooltip>
  );
}

function MobileInsightSheet({ insight, onClose }: { insight: MobileInsight; onClose: () => void }) {
  const closeRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    closeRef.current?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/50" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="mobile-insight-title" className="max-h-[80vh] w-full overflow-y-auto rounded-t-3xl border border-border bg-background p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-3">
          <h2 id="mobile-insight-title" className="text-base font-semibold">{insight.title}</h2>
          <button ref={closeRef} type="button" onClick={onClose} aria-label="Close details" className="cursor-pointer rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"><X size={18} /></button>
        </div>
        <div className="mt-3 text-sm leading-6 text-muted-foreground">{insight.body}</div>
      </div>
    </div>
  );
}

function MobileInfoTooltip({ content, label }: { content: React.ReactNode; label: string }) {
  const [open, setOpen] = React.useState(false);

  return (
    <span className="inline-flex" onClickCapture={(event) => { event.preventDefault(); event.stopPropagation(); setOpen(true); }}>
      <Tooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger asChild>
          <button type="button" aria-label={label} className="inline-flex cursor-pointer items-center justify-center px-2 py-1.5 text-current transition-colors hover:bg-primary/10">
            <Info size={12} />
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">{content}</TooltipContent>
      </Tooltip>
    </span>
  );
}

export function ModelComparisonBrowser({ models }: Props) {
  const [selected, setSelected] = React.useState<SelectedItem[]>([]);
  const [query, setQuery] = React.useState("");
  const [directoryExpanded, setDirectoryExpanded] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [recTask, setRecTask] = React.useState<RecTask>("Classification");
  const [recSize, setRecSize] = React.useState<RecSize>("Medium");
  const [recPriority, setRecPriority] = React.useState<RecPriority>("Balanced");
  const [mobileInsight, setMobileInsight] = React.useState<MobileInsight | null>(null);
  const coarsePointer = useCoarsePointer();
  const showInsight = React.useCallback((insight: MobileInsight) => setMobileInsight(insight), []);
  const closeInsight = React.useCallback(() => setMobileInsight(null), []);
  const urlValueRef = React.useRef<string | null>(null);
  const copyTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => () => {
    if (copyTimer.current) clearTimeout(copyTimer.current);
  }, []);

  React.useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get("compare");
    if (!raw) return;
    const valid: SelectedItem[] = [];
    for (const token of raw.split(",")) {
      const [type, ...rest] = token.split(":");
      const id = rest.join(":");
      if (!id) continue;
      if (type === "model" && models.some((model) => model.id === id)) valid.push({ type, id });
      else if (type === "family" && models.some((model) => familyId(model.family) === id)) valid.push({ type, id });
      if (valid.length === 3) break;
    }
    const deduped = valid.filter((item, index) => valid.findIndex((other) => other.type === item.type && other.id === item.id) === index);
    if (deduped.length) setSelected(deduped);
  }, [models]);

  React.useEffect(() => {
    const value = selected.map((item) => `${item.type}:${item.id}`).join(",");
    if (urlValueRef.current === null) {
      urlValueRef.current = new URLSearchParams(window.location.search).get("compare") ?? "";
      return;
    }
    if (urlValueRef.current === value) return;
    urlValueRef.current = value;
    const url = new URL(window.location.href);
    if (value) url.searchParams.set("compare", value);
    else url.searchParams.delete("compare");
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }, [selected]);

  const familySpecs = React.useMemo(
    () => Array.from(new Set(models.map((model) => model.family)))
      .map((family) => getFamilySummary(family, models))
      .filter(Boolean) as FamilySpec[],
    [models]
  );

  const modelById = React.useMemo(() => new Map(models.map((model) => [model.id, model])), [models]);
  const familyById = React.useMemo(() => new Map(familySpecs.map((family) => [family.id, family])), [familySpecs]);

  const columns = React.useMemo<Column[]>(() => selected.flatMap<Column>((item) => {
    if (item.type === "model") {
      const model = modelById.get(item.id);
      return model ? [{ type: "model", model }] : [];
    }
    const family = familyById.get(item.id);
    return family ? [{ type: "family", family }] : [];
  }), [selected, modelById, familyById]);

  const scoreWinners = React.useMemo(() => scoreRows.map((row) => {
    const entries = columns.map((column) => ({ column, score: columnScores(column)[row.key] }));
    const best = entries.reduce((max, entry) => Math.max(max, entry.score), 0);
    return { ...row, entries, best, winners: entries.filter((entry) => entry.score === best) };
  }), [columns]);

  const overallRanking = React.useMemo(() => columns.map((column) => {
    const scores = columnScores(column);
    const average = scoreRows.reduce((sum, row) => sum + scores[row.key], 0) / scoreRows.length;
    return { column, average };
  }).sort((a, b) => b.average - a.average), [columns]);

  const overallTop = overallRanking[0];
  const overallLeaders = overallTop ? overallRanking.filter((entry) => entry.average === overallTop.average) : [];
  const overallRunnerUp = overallTop ? overallRanking.find((entry) => entry.average < overallTop.average) : undefined;
  const overallTradeoff = React.useMemo(() => {
    if (!overallTop || !overallRunnerUp) return null;
    const topScores = columnScores(overallTop.column);
    const runnerScores = columnScores(overallRunnerUp.column);
    return {
      topWins: scoreRows.filter((row) => topScores[row.key] > runnerScores[row.key]).map((row) => row.label.toLowerCase()),
      runnerWins: scoreRows.filter((row) => runnerScores[row.key] > topScores[row.key]).map((row) => row.label.toLowerCase()),
    };
  }, [overallTop, overallRunnerUp]);

  const deferredQuery = React.useDeferredValue(query);
  const normalizedQuery = deferredQuery.trim().toLowerCase();
  const filteredModels = React.useMemo(() => {
    const searchTerms = [normalizedQuery, ...(searchAliases[normalizedQuery]?.split(" ") ?? [])];
    return models.filter((model) => {
      if (!normalizedQuery) return true;
      const searchable = [model.name, model.family, model.task, model.sklearn, model.summary, model.when, model.why, ...model.alternatives, ...model.tips].join(" ").toLowerCase();
      return searchTerms.some((term) => searchable.includes(term));
    });
  }, [models, normalizedQuery]);

  const recommendations = React.useMemo(
    () => recommendModels(recTask, recSize, recPriority, models),
    [recTask, recSize, recPriority, models]
  );
  const compareRecommendations = () => {
    if (!recommendations.length || selected.length >= 3) return;
    setSelected(recommendations.map((model) => ({ type: "model", id: model.id })));
    window.requestAnimationFrame(() => document.getElementById("specifications")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const allGrouped = React.useMemo(() => Array.from(filteredModels.reduce((groups, model) => {
    const group = groups.get(model.family) ?? [];
    group.push(model);
    groups.set(model.family, group);
    return groups;
  }, new Map<string, ModelSpec[]>())), [filteredModels]);
  const groupedResults = normalizedQuery || directoryExpanded ? allGrouped : allGrouped.slice(0, 4);

  const isSelected = (type: SelectedItem["type"], id: string) => selected.some((item) => item.type === type && item.id === id);
  const addItem = (item: SelectedItem) => {
    if (selected.length >= 3 || isSelected(item.type, item.id)) return;
    setSelected((current) => [...current, item]);
  };
  const removeItem = (type: SelectedItem["type"], id: string) => {
    setSelected((current) => current.filter((item) => !(item.type === type && item.id === id)));
  };
  const toggleItem = (item: SelectedItem) => {
    if (isSelected(item.type, item.id)) removeItem(item.type, item.id);
    else addItem(item);
  };

  const copyLink = async () => {
    const url = new URL(window.location.href);
    const value = selected.map((item) => `${item.type}:${item.id}`).join(",");
    if (value) url.searchParams.set("compare", value);
    else url.searchParams.delete("compare");
    try {
      await navigator.clipboard.writeText(url.toString());
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <InsightContext.Provider value={showInsight}>
      <div className="space-y-8">
      <section className="space-y-4" aria-labelledby="compare-tray">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Add to compare</p>
            <h2 id="compare-tray" className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">Pick up to 3 models or families</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span aria-live="polite" aria-atomic="true" className="text-sm text-muted-foreground">{selected.length}/3 selected</span>
            {selected.length > 0 && (
              <>
                <Button variant="outline" size="sm" onClick={copyLink} className="gap-1.5">
                  {copied ? <Check size={14} /> : <Link2 size={14} />}
                  <span aria-live="polite">{copied ? "Link copied" : "Copy link"}</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSelected([])}>Clear all</Button>
              </>
            )}
          </div>
        </div>

        <div className="relative">
          <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search models, families, or try “text”, “nonlinear”, “small data”…" aria-label="Search models and families to compare" className="h-11 rounded-full pl-10 pr-10" />
          {query && (
            <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"><X size={16} /></button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Suggestions:</span>
          {quickSearches.map((term) => (
            <button key={term} type="button" onClick={() => setQuery(term)} className={`${chipBase} border-border/70 text-muted-foreground hover:border-primary/50 hover:text-primary`}>{term}</button>
          ))}
        </div>

        <div role="group" aria-label="Quick comparisons" className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Quick compare:</span>
          {quickComparisons.map((comparison) => (
            <button key={comparison.label} type="button" onClick={() => setSelected(comparison.ids.map((id) => ({ type: "model", id })))} className={`${chipBase} border-border/70 text-muted-foreground hover:border-primary/50 hover:text-primary`}>{comparison.label}</button>
          ))}
        </div>

        {selected.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {selected.map((item) => {
              if (item.type === "model") {
                const model = modelById.get(item.id);
                if (!model) return null;
                return (
                  <div key={`model-${model.id}`} className="flex items-start justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-primary">Comparing</span>
                        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Model</span>
                        {popularModelIds.has(model.id) && <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-primary">Most popular</span>}
                      </div>
                      <p className="mt-1 font-semibold">{model.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{mainCategory(model)} · {model.family}</p>
                    </div>
                    <button type="button" onClick={() => removeItem("model", model.id)} aria-label={`Remove ${model.name}`} className="cursor-pointer rounded-full p-1 text-muted-foreground hover:bg-background hover:text-foreground"><X size={16} /></button>
                  </div>
                );
              }
              const family = familyById.get(item.id);
              if (!family) return null;
              return (
                <div key={`family-${family.id}`} className="flex items-start justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-primary">Comparing</span>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Family</span>
                    </div>
                    <p className="mt-1 font-semibold">{family.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{family.modelCount} models · {family.representativeModels}</p>
                  </div>
                  <button type="button" onClick={() => removeItem("family", family.id)} aria-label={`Remove ${family.name}`} className="cursor-pointer rounded-full p-1 text-muted-foreground hover:bg-background hover:text-foreground"><X size={16} /></button>
                </div>
              );
            })}
          </div>
        )}

        {selected.length < 3 && (
          <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
            {selected.length === 0 ? "Add models or whole families below to start comparing." : `Add ${3 - selected.length} more item${3 - selected.length === 1 ? "" : "s"} if you want a wider comparison.`}
          </div>
        )}

        <div className="rounded-2xl border border-border/60 bg-card/50 p-3">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2 px-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Model Directory</h3>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground">{filteredModels.length} models</span>
              <Button size="sm" onClick={() => setDirectoryExpanded((value) => !value)} className="h-8 cursor-pointer gap-1.5 px-3 text-xs font-medium">
                <ArrowDownUp size={14} />{directoryExpanded ? "Contract" : "Expand"}
              </Button>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {groupedResults.map(([family, familyModels]) => {
              const familySpec = familySpecs.find((f) => f.family === family);
              const familyActive = familySpec ? isSelected("family", familySpec.id) : false;
              return (
              <section key={family} className="overflow-hidden rounded-xl border border-border/60 bg-background/50">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 bg-muted/30 px-4 py-3">
                  {familySpec && coarsePointer ? (
                    <button type="button" onClick={() => showInsight({ title: familyTitle(family), body: <FamilyInsight family={familySpec} /> })} className="cursor-pointer text-left">
                      <p className="text-sm font-semibold">{familyTitle(family)}</p>
                      <p className="text-xs text-muted-foreground">{familyModels.length} model{familyModels.length === 1 ? "" : "s"}</p>
                    </button>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div tabIndex={0} className="cursor-help">
                          <p className="text-sm font-semibold">{familyTitle(family)}</p>
                          <p className="text-xs text-muted-foreground">{familyModels.length} model{familyModels.length === 1 ? "" : "s"}</p>
                        </div>
                      </TooltipTrigger>
                      {familySpec && <TooltipContent side="bottom" className="max-w-xs"><FamilyInsight family={familySpec} /></TooltipContent>}
                    </Tooltip>
                  )}
                  <Button size="sm" variant={familyActive ? "default" : "outline"} onClick={() => familySpec && toggleItem({ type: "family", id: familySpec.id })} disabled={!familySpec || (selected.length >= 3 && !familyActive)} className="h-7 cursor-pointer px-2 text-xs">{familyActive ? "Remove family" : "Compare family"}</Button>
                </div>
                <div className="flex flex-wrap gap-2 p-3">
                  {familyModels.map((model) => {
                    const active = isSelected("model", model.id);
                    return (
                      <div key={model.id} className={`inline-flex items-center overflow-hidden rounded-full border text-xs transition-colors ${active ? "border-primary/50 bg-primary/10 text-primary" : "border-border/70 text-muted-foreground hover:border-primary/50 hover:text-primary"}`}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button type="button" onClick={() => toggleItem({ type: "model", id: model.id })} aria-disabled={!active && selected.length >= 3} className="inline-flex cursor-pointer items-center gap-1.5 px-3 py-1.5 transition-colors aria-disabled:cursor-not-allowed aria-disabled:opacity-40">
                              {active ? <Check size={12} /> : <Plus size={12} />}
                              {model.name}
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="max-w-xs"><ModelInsight model={model} /></TooltipContent>
                        </Tooltip>
                        {coarsePointer && (
                          <>
                            <span className="h-4 w-px bg-border/70" aria-hidden="true" />
                            <MobileInfoTooltip label={`Quick details for ${model.name}`} content={<ModelInsight model={model} />} />
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
              );
            })}
          </div>
          {!filteredModels.length && <p className="px-3 py-6 text-center text-sm text-muted-foreground">{query ? `No models match “${query}”.` : "No models available."}</p>}
        </div>
      </section>

      {selected.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-border/60 bg-muted/20 p-6 text-center">
          <p className="text-sm text-muted-foreground">{coarsePointer ? "Tap a family or the info icon on a model for a quick insight, then tap a model to compare." : "Hover any model or family for a quick insight, then click to compare."}</p>
        </section>
      ) : (
        <>
          <section aria-labelledby="specifications" className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Comparison</p>
              <h2 id="specifications" className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">Models and families side by side</h2>
            </div>
            {overallTop && (
              <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">Overall verdict</p>
                    <p className="mt-1 text-sm font-semibold">
                      {overallLeaders.length > 1
                        ? `Tied overall: ${overallLeaders.map((entry) => columnName(entry.column)).join(" + ")}`
                        : `Best overall: ${columnName(overallTop.column)}`}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {overallLeaders.length > 1
                        ? `Equal-weight average of the four practical scores (${overallTop.average.toFixed(1)}/5).`
                        : `Averages ${overallTop.average.toFixed(1)}/5 across the four practical scores.`}
                    </p>
                    {overallLeaders.length === 1 && overallTradeoff && overallRunnerUp && (
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">
                        {overallTradeoff.topWins.length ? `${columnName(overallTop.column)} wins on ${formatList(overallTradeoff.topWins)}` : `${columnName(overallTop.column)} ties on every score`}
                        {overallTradeoff.runnerWins.length ? `; ${columnName(overallRunnerUp.column)} wins on ${formatList(overallTradeoff.runnerWins)}.` : "."}
                      </p>
                    )}
                  </div>
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">{overallTop.average.toFixed(1)}/5</span>
                </div>
              </div>
            )}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {scoreWinners.map((row) => row.best > 0 && (
                <div key={row.key} className="rounded-xl border border-border/60 bg-muted/20 p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{row.label}</p>
                  <p className="mt-1 text-sm font-semibold">{row.winners.map((winner) => columnName(winner.column)).join(" + ")}</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{row.best}/5 — {row.why}.</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground md:hidden">Swipe sideways to compare all selected models.</p>
            <div className="overflow-x-auto overflow-y-clip overscroll-x-contain rounded-2xl border border-border/60">
              <table className="w-full min-w-180 border-collapse text-left text-sm">
                <caption className="sr-only">Specification comparison for selected models and families</caption>
                <thead>
                  <tr>
                    <th scope="col" className="sticky left-0 top-14 z-40 w-36 border-b border-r-2 border-border bg-white px-4 py-4 text-left font-extrabold text-black shadow-[4px_0_8px_-8px_rgba(0,0,0,0.8)] dark:bg-black dark:text-white"><span>Specification</span></th>
                    {columns.map((column) => {
                      const id = column.type === "model" ? column.model.id : column.family.id;
                      const name = column.type === "model" ? column.model.name : column.family.name;
                      const subtitle = column.type === "model" ? column.model.sklearn : column.family.representativeModels;
                      const popular = column.type === "model" && popularModelIds.has(column.model.id);
                      return (
                        <th key={`${column.type}-${id}`} scope="col" className="sticky top-14 z-30 min-w-56 border-b border-l border-border/60 bg-muted px-4 py-4 align-top">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] ${column.type === "model" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{column.type === "model" ? "Model" : "Family"}</span>
                                {popular && <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-primary">Popular</span>}
                              </div>
                              <span className="mt-1 block font-semibold text-foreground">{name}</span>
                            </div>
                            <button type="button" onClick={() => removeItem(column.type, id)} aria-label={`Remove ${name}`} className="cursor-pointer rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><X size={15} /></button>
                          </div>
                          <span className="mt-1 block text-xs font-normal text-muted-foreground">{subtitle}</span>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border/60 bg-primary/5 align-top">
                    <th scope="row" className="sticky left-0 z-10 border-r-2 border-border bg-white px-4 py-4 text-left font-extrabold text-black shadow-[4px_0_8px_-8px_rgba(0,0,0,0.8)] dark:bg-black dark:text-white">Best at</th>
                    {columns.map((column) => {
                      const wins = scoreWinners.filter((row) => row.best > 0 && row.winners.some((winner) => winner.column === column));
                      return (
                        <td key={`${column.type}-${column.type === "model" ? column.model.id : column.family.id}`} className="border-l border-border/60 px-4 py-4">
                          {wins.length ? <div className="flex flex-wrap gap-1">{wins.map((row) => <span key={row.key} className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">{row.label}</span>)}</div> : <span className="text-muted-foreground">—</span>}
                        </td>
                      );
                    })}
                  </tr>
                  {scoreRows.map((row) => {
                    const winnerRow = scoreWinners.find((item) => item.key === row.key);
                    return (
                      <tr key={row.key} className="border-t border-border/60 align-top">
                        <th scope="row" className="sticky left-0 z-10 border-r-2 border-border bg-white px-4 py-4 text-left font-extrabold text-black shadow-[4px_0_8px_-8px_rgba(0,0,0,0.8)] dark:bg-black dark:text-white">{row.label}</th>
                        {columns.map((column) => {
                          const entry = winnerRow?.entries.find((item) => item.column === column);
                          const isWinner = Boolean(entry && winnerRow && entry.score === winnerRow.best);
                          return (
                            <td key={`${column.type}-${column.type === "model" ? column.model.id : column.family.id}`} className="border-l border-border/60 px-4 py-4">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-mono text-xs font-semibold text-foreground">{entry?.score ?? "—"}/5</span>
                                <ScoreBar score={entry?.score ?? 0} />
                                {isWinner && <WinnerBadge label={row.label} score={entry?.score ?? 0} why={row.why} tied={Boolean(winnerRow && winnerRow.winners.length > 1)} />}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                  {unifiedRows.map((row) => (
                    <tr key={row.label} className="border-t border-border/60 align-top">
                      <th scope="row" className="sticky left-0 z-10 border-r-2 border-border bg-white px-4 py-4 text-left font-extrabold text-black shadow-[4px_0_8px_-8px_rgba(0,0,0,0.8)] dark:bg-black dark:text-white">{row.label}</th>
                      {columns.map((column) => (
                        <td key={`${column.type}-${column.type === "model" ? column.model.id : column.family.id}`} className="border-l border-border/60 px-4 py-4 leading-6 text-muted-foreground">
                          {column.type === "model" ? row.model(column.model) : row.family(column.family)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </section>

          <section aria-labelledby="deep-dive" className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Deep dive</p>
              <h2 id="deep-dive" className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">Pros, cons, tuning, and tricks</h2>
            </div>
            <div className={`grid gap-4 ${columns.length === 1 ? "md:grid-cols-1" : columns.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
              {columns.map((column) => {
                if (column.type === "model") {
                  const model = column.model;
                  const docs = modelDocs(model);
                  return (
                    <article key={`model-${model.id}`} className="rounded-2xl border border-border/60 p-5">
                      <div className="sticky top-14 z-20 -mx-5 -mt-5 mb-4 flex flex-wrap items-center gap-2 rounded-t-2xl border-b border-border/60 bg-background/95 px-5 py-3 backdrop-blur">
                        <h3 className="font-semibold">{model.name}</h3>
                        {popularModelIds.has(model.id) && <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-primary">Most popular</span>}
                      </div>
                      <div className="mt-5">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">Pros</p>
                        <SpecList items={model.strengths} />
                        <p className="mb-2 mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-primary">Cons</p>
                        <SpecList items={model.limitations} negative />
                        <p className="mb-2 mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-primary">Tune first</p>
                        <dl className="divide-y divide-border/60">
                          {model.parameters.map((parameter) => (
                            <div key={parameter.name} className="py-3">
                              <dt className="font-mono text-xs text-primary">{parameter.name}</dt>
                              <dd className="mt-1 text-sm leading-6 text-muted-foreground">{parameter.meaning}</dd>
                            </div>
                          ))}
                        </dl>
                        <p className="mb-2 mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-primary">Tips & tricks</p>
                        <SpecList items={model.tips} />
                        <div className="mt-5 rounded-xl border border-primary/20 bg-primary/5 p-3">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">Fast train/test tip</p>
                          <SpeedTip text={getModelSpeedTip(model)} />
                        </div>
                        <p className="mb-2 mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-primary">Better alternatives</p>
                        <ul className="space-y-2 text-sm leading-6 text-muted-foreground">
                          {model.alternatives.map((item) => (
                            <li key={item} className="flex gap-2"><ArrowRight size={14} className="mt-1 shrink-0 text-primary" />{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-5 flex flex-wrap gap-3 border-t border-border/60 pt-4">
                        <a href={docs.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">{docs.label} <ExternalLink size={13} /></a>
                        {model.article && <Link href={model.article} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">Learn <ArrowRight size={14} /></Link>}
                        {model.cheatsheet && <Link href={model.cheatsheet} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">Cheatsheet <ExternalLink size={13} /></Link>}
                      </div>
                    </article>
                  );
                }
                const family = column.family;
                return (
                  <article key={`family-${family.id}`} className="rounded-2xl border border-border/60 p-5">
                    <div className="sticky top-14 z-20 -mx-5 -mt-5 mb-4 rounded-t-2xl border-b border-border/60 bg-background/95 px-5 py-3 backdrop-blur">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{family.name}</h3>
                        <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Family</span>
                      </div>
                      <p className="mt-1 text-xs text-primary font-medium">{family.modelCount} models: {family.representativeModels}</p>
                    </div>
                    <div className="mt-5 space-y-4">
                      <div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">Core assumption</p><p className="text-sm text-muted-foreground">{family.coreAssumption}</p></div>
                      <div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">When to start with this family</p><p className="text-sm text-muted-foreground">{family.when}</p></div>
                      <div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">Why it works</p><p className="text-sm text-muted-foreground">{family.why}</p></div>
                      <div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">Avoid when</p><p className="text-sm text-muted-foreground">{family.avoid}</p></div>
                      <div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">Strengths</p><SpecList items={family.strengths} /></div>
                      <div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">Limitations</p><SpecList items={family.limitations} negative /></div>
                      <div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">Tips</p><SpecList items={family.tips} /></div>
                      <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">Fast train/test tip</p>
                        <SpeedTip text={family.speedTip} />
                      </div>
                      <div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-primary">Alternative families</p><SpecList items={family.alternatives} /></div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Deep learning</p>
            <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">Neural networks use PyTorch, not sklearn</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">For images, audio, <LearnedTerm term="LLM">LLMs</LearnedTerm>, and <LearnedTerm term="transformer">transformers</LearnedTerm>, use PyTorch. The <LearnedTerm term="neural network">neural network</LearnedTerm> entries in this directory use PyTorch APIs and link to the official tutorials.</p>
            <a href="https://docs.pytorch.org/tutorials/beginner/basics/intro.html" target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">PyTorch tutorials <ExternalLink size={13} /></a>
          </section>
        </>
      )}

      <section className="rounded-2xl border border-border/60 bg-card/50 p-4" aria-labelledby="shortlist">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Short recommendation</p>
            <h3 id="shortlist" className="mt-1 text-lg font-bold tracking-tight">Not sure where to start?</h3>
            <p className="mt-1 text-sm text-muted-foreground">Pick a task, data size, and priority for a quick heuristic shortlist. This is a starting point, not a benchmark.</p>
          </div>
          <Button size="sm" variant="outline" onClick={compareRecommendations} disabled={!recommendations.length || selected.length >= 3} className="shrink-0 gap-1.5">
            <ArrowRight size={14} /> Compare all three
          </Button>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="space-y-1">
            <Label htmlFor="rec-task" className="text-xs font-medium text-muted-foreground">Task</Label>
            <Select value={recTask} onValueChange={(value) => setRecTask(value as RecTask)}>
              <SelectTrigger id="rec-task" className="w-full rounded-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                {recTaskOptions.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="rec-size" className="text-xs font-medium text-muted-foreground">Data size</Label>
            <Select value={recSize} onValueChange={(value) => setRecSize(value as RecSize)}>
              <SelectTrigger id="rec-size" className="w-full rounded-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                {recSizeOptions.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="rec-priority" className="text-xs font-medium text-muted-foreground">Priority</Label>
            <Select value={recPriority} onValueChange={(value) => setRecPriority(value as RecPriority)}>
              <SelectTrigger id="rec-priority" className="w-full rounded-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                {recPriorityOptions.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">{recPriority === "Balanced" ? `Balanced shortlist tuned for ${recSize.toLowerCase()} data.` : `${recPriority} priority overrides data size.`}</p>
        <div aria-live="polite" className="mt-4 grid gap-3 md:grid-cols-3">
          {recommendations.map((model) => {
            const active = isSelected("model", model.id);
            return (
              <div key={model.id} className="rounded-xl border border-border/60 bg-background/60 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">{model.name}</p>
                    <p className="text-xs text-muted-foreground">{model.family} · {mainCategory(model)}</p>
                  </div>
                  <Button size="sm" variant={active ? "default" : "outline"} onClick={() => toggleItem({ type: "model", id: model.id })} disabled={!active && selected.length >= 3} className="h-7 shrink-0 px-2 text-xs">{active ? "Added" : "Add"}</Button>
                </div>
                <p className="mt-2 text-xs leading-5 text-muted-foreground"><span className="font-medium text-foreground">Why this pick:</span> {recommendationReason(model, recTask, recSize, recPriority)}</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground"><span className="font-medium text-foreground">Good when:</span> {model.when}</p>
              </div>
            );
          })}
        </div>
      </section>
      {mobileInsight && coarsePointer && <MobileInsightSheet insight={mobileInsight} onClose={closeInsight} />}
      </div>
    </InsightContext.Provider>
  );
}
