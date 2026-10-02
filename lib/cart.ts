/**
 * Minimal CART engine for the Decision Tree sim: greedy axis-aligned
 * splits on Gini impurity. Pure + dependency-free. Split creation order
 * is BFS so the Grow animation reveals parents before children.
 */

export type Label = 0 | 1;
export type Pt = { x: number; y: number; label: Label };

export type SplitNode = {
  kind: "split";
  feature: 0 | 1;
  threshold: number;
  gain: number;
  impurity: number;
  samples: number;
  left: TreeNode;
  right: TreeNode;
};

export type LeafNode = {
  kind: "leaf";
  prediction: Label;
  counts: [number, number];
  impurity: number;
  samples: number;
};

export type TreeNode = SplitNode | LeafNode;

function gini(counts: [number, number]): number {
  const n = counts[0] + counts[1];
  if (n === 0) return 0;
  const p0 = counts[0] / n;
  return 1 - p0 * p0 - (1 - p0) * (1 - p0);
}

export function predict(tree: TreeNode, x: number, y: number): Label {
  let node = tree;
  while (node.kind === "split") {
    node = (node.feature === 0 ? x : y) <= node.threshold ? node.left : node.right;
  }
  return node.prediction;
}

export function accuracy(tree: TreeNode, pts: Pt[]): number {
  if (pts.length === 0) return 0;
  let ok = 0;
  for (const p of pts) if (predict(tree, p.x, p.y) === p.label) ok++;
  return ok / pts.length;
}

export function countStats(tree: TreeNode): { leaves: number; nodes: number } {
  if (tree.kind === "leaf") return { leaves: 1, nodes: 1 };
  const l = countStats(tree.left);
  const r = countStats(tree.right);
  return { leaves: l.leaves + r.leaves, nodes: 1 + l.nodes + r.nodes };
}

export type LeafRule = {
  prediction: Label;
  counts: [number, number];
  bounds: { x0: number; x1: number; y0: number; y1: number };
  conditions: { feature: 0 | 1; op: "<=" | ">"; threshold: number }[];
};

export function leafRules(
  tree: TreeNode,
  bounds = { x0: -7, x1: 7, y0: -7, y1: 7 },
  path: LeafRule["conditions"] = [],
): LeafRule[] {
  if (tree.kind === "leaf") {
    return [{ prediction: tree.prediction, counts: tree.counts, bounds, conditions: path }];
  }
  const f = tree.feature;
  return [
    ...leafRules(tree.left, { ...bounds, ...(f === 0 ? { x1: tree.threshold } : { y1: tree.threshold }) }, [
      ...path, { feature: f, op: "<=", threshold: tree.threshold },
    ]),
    ...leafRules(tree.right, { ...bounds, ...(f === 0 ? { x0: tree.threshold } : { y0: tree.threshold }) }, [
      ...path, { feature: f, op: ">", threshold: tree.threshold },
    ]),
  ];
}

/** Splits BFS (parents before children) — drives the Grow animation. */
export function splitOrder(tree: TreeNode): SplitNode[] {
  const out: SplitNode[] = [];
  const queue: TreeNode[] = [tree];
  while (queue.length > 0) {
    const n = queue.shift()!;
    if (n.kind === "split") {
      out.push(n);
      queue.push(n.left, n.right);
    }
  }
  return out;
}

export function trainTree(
  pts: Pt[],
  opts: { maxDepth?: number; minSamplesLeaf?: number } = {},
): TreeNode {
  const { maxDepth = 4, minSamplesLeaf = 1 } = opts;
  const countsOf = (rows: Pt[]): [number, number] => {
    let a = 0;
    for (const p of rows) if (p.label === 0) a++;
    return [a, rows.length - a];
  };
  const build = (rows: Pt[], depth: number): TreeNode => {
    const counts = countsOf(rows);
    const impurity = gini(counts);
    const prediction: Label = counts[0] >= counts[1] ? 0 : 1;
    if (depth >= maxDepth || rows.length < 2 || impurity === 0) {
      return { kind: "leaf", prediction, counts, impurity, samples: rows.length };
    }
    let best: { feature: 0 | 1; threshold: number; gain: number; left: Pt[]; right: Pt[] } | null = null;
    for (const feature of [0, 1] as const) {
      const sorted = [...rows].sort((a, b) => (feature === 0 ? a.x - b.x : a.y - b.y));
      for (let i = 1; i < sorted.length; i++) {
        const va = feature === 0 ? sorted[i - 1].x : sorted[i - 1].y;
        const vb = feature === 0 ? sorted[i].x : sorted[i].y;
        if (va === vb) continue;
        const left = sorted.slice(0, i);
        const right = sorted.slice(i);
        if (left.length < minSamplesLeaf || right.length < minSamplesLeaf) continue;
        const gain =
          impurity -
          (left.length / rows.length) * gini(countsOf(left)) -
          (right.length / rows.length) * gini(countsOf(right));
        if (gain > 0 && (!best || gain > best.gain)) {
          best = { feature, threshold: (va + vb) / 2, gain, left, right };
        }
      }
    }
    if (!best) return { kind: "leaf", prediction, counts, impurity, samples: rows.length };
    return {
      kind: "split", feature: best.feature, threshold: best.threshold,
      gain: best.gain, impurity, samples: rows.length,
      left: build(best.left, depth + 1), right: build(best.right, depth + 1),
    };
  };
  return build(pts, 0);
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gaussian(rng: () => number) {
  const u = Math.max(rng(), 1e-9);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rng());
}

export type DatasetKind = "blobs" | "moons" | "diagonal";

export function makeDataset(
  kind: DatasetKind, trainSeed: number, testSeed: number, noise = 1,
): { train: Pt[]; test: Pt[] } {
  const gen = (seed: number, n: number): Pt[] => {
    const rng = mulberry32(seed);
    const pts: Pt[] = [];
    for (let i = 0; i < n; i++) {
      let x = 0;
      let y = 0;
      let label: Label = 0;
      if (kind === "blobs") {
        const c = rng() < 0.5 ? 0 : 1;
        label = c as Label;
        x = (c === 0 ? -3 : 3) + gaussian(rng) * 1.6 * noise;
        y = (c === 0 ? 2.5 : -2.5) + gaussian(rng) * 1.6 * noise;
      } else if (kind === "moons") {
        const upper = rng() < 0.5;
        const t = rng() * Math.PI;
        label = upper ? 0 : 1;
        x = (upper ? Math.cos(t) : 1 - Math.cos(t)) * 4 + gaussian(rng) * 0.55 * noise;
        y = (upper ? Math.sin(t) : 0.6 - Math.sin(t)) * 3.4 + (upper ? 0.6 : -1.2) + gaussian(rng) * 0.55 * noise;
      } else {
        x = (rng() * 2 - 1) * 6;
        y = (rng() * 2 - 1) * 6;
        label = (y > x + gaussian(rng) * 1.1 * noise ? 0 : 1) as Label;
      }
      pts.push({ x: Math.max(-6.5, Math.min(6.5, x)), y: Math.max(-6.5, Math.min(6.5, y)), label });
    }
    return pts;
  };
  return { train: gen(trainSeed, 90), test: gen(testSeed, 30) };
}
