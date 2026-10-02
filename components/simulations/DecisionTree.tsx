"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { CalloutBox } from "@/components/articles/components/CalloutBox";
import { cn } from "@/lib/utils";
import SimHeader from "./sim-header";
import { useResponsiveCanvas } from "@/lib/use-responsive-canvas";
import {
  accuracy,
  countStats,
  leafRules,
  makeDataset,
  splitOrder,
  trainTree,
  type DatasetKind,
  type LeafRule,
  type SplitNode,
  type TreeNode,
} from "@/lib/cart";

const RANGE = 7;
const CLASS_COLORS = ["#ef4444", "#2563eb"];
const CLASS_NAMES = ["Red", "Blue"];

function Segmented<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="space-y-2">
      <span className="text-sm font-medium">{label}</span>
      <div
        role="radiogroup"
        aria-label={label}
        className="grid gap-1 rounded-xl border border-border bg-muted/40 p-1"
        style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}
      >
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={String(o.value)}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(o.value)}
              className={cn(
                "cursor-pointer rounded-lg px-2 py-2 text-sm font-semibold transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground active:scale-95",
              )}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ruleText(r: LeafRule): string {
  if (r.conditions.length === 0) return "Always";
  return r.conditions
    .map((c) => `${c.feature === 0 ? "x" : "y"} ${c.op} ${c.threshold.toFixed(2)}`)
    .join(" · ");
}

export default function DecisionTree() {
  const { containerRef, canvasRef, size } = useResponsiveCanvas({
    maxWidth: 640,
    aspectRatio: 1,
  });

  const [dataset, setDataset] = useState<DatasetKind>("blobs");
  const [trainSeed, setTrainSeed] = useState(11);
  const [noise, setNoise] = useState(1);
  const [maxDepth, setMaxDepth] = useState(3);
  const [minLeaf, setMinLeaf] = useState(1);
  const [grown, setGrown] = useState<number | null>(null);
  const [growing, setGrowing] = useState(false);
  const [query, setQuery] = useState<{ x: number; y: number } | null>(null);
  const [selRule, setSelRule] = useState<number | null>(null);

  const { train, test } = useMemo(
    () => makeDataset(dataset, trainSeed, 999, noise),
    [dataset, trainSeed, noise],
  );
  const tree = useMemo(
    () => trainTree(train, { maxDepth, minSamplesLeaf: minLeaf }),
    [train, maxDepth, minLeaf],
  );
  const splits = useMemo(() => splitOrder(tree), [tree]);
  const rules = useMemo(() => leafRules(tree), [tree]);
  const stats = useMemo(() => countStats(tree), [tree]);
  const shownSplits = grown ?? splits.length;

  const splitIdx = useMemo(() => {
    const m = new Map<SplitNode, number>();
    splits.forEach((s, i) => m.set(s, i));
    return m;
  }, [splits]);

  const curve = useMemo(
    () =>
      [1, 2, 3, 4, 5, 6, 7, 8].map((d) => {
        const t = trainTree(train, { maxDepth: d, minSamplesLeaf: minLeaf });
        return { d, train: accuracy(t, train), test: accuracy(t, test) };
      }),
    [train, test, minLeaf],
  );

  // Grow animation: reveal splits one by one, stop at full tree.
  // Chain breaks if `grown` ever leaves the dep list — each step must
  // reschedule the next one.
  const growDone = shownSplits >= splits.length;
  const growingActive = growing && !growDone;
  const lastSplit = grown !== null && grown > 0 ? splits[grown - 1] : undefined;
  useEffect(() => {
    if (!growingActive) return;
    const id = setTimeout(
      () => setGrown((g) => Math.min((g ?? 0) + 1, splits.length)),
      750,
    );
    return () => clearTimeout(id);
  }, [growingActive, grown, splits.length]);

  const toPx = useCallback(
    (x: number, y: number) => ({
      px: ((x + RANGE) / (2 * RANGE)) * size.width,
      py: ((RANGE - y) / (2 * RANGE)) * size.height,
    }),
    [size],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { width, height } = size;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    const X = (x: number) => ((x + RANGE) / (2 * RANGE)) * width;
    const Y = (y: number) => ((RANGE - y) / (2 * RANGE)) * height;

    const drawRegions = (node: TreeNode, b: LeafRule["bounds"]) => {
      if (node.kind === "split" && (splitIdx.get(node) ?? 0) < shownSplits) {
        const f = node.feature;
        drawRegions(node.left, { ...b, ...(f === 0 ? { x1: node.threshold } : { y1: node.threshold }) });
        drawRegions(node.right, { ...b, ...(f === 0 ? { x0: node.threshold } : { y0: node.threshold }) });
        ctx.strokeStyle = "#0f172a";
        ctx.lineWidth = 2;
        ctx.beginPath();
        if (f === 0) {
          ctx.moveTo(X(node.threshold), Y(b.y1));
          ctx.lineTo(X(node.threshold), Y(b.y0));
        } else {
          ctx.moveTo(X(b.x0), Y(node.threshold));
          ctx.lineTo(X(b.x1), Y(node.threshold));
        }
        ctx.stroke();
        return;
      }
      const leaf = node.kind === "leaf" ? node : null;
      ctx.fillStyle = leaf ? CLASS_COLORS[leaf.prediction] : "#cbd5e1";
      ctx.globalAlpha = 0.16;
      ctx.fillRect(X(b.x0), Y(b.y1), X(b.x1) - X(b.x0), Y(b.y0) - Y(b.y1));
      ctx.globalAlpha = 1;
      if (!leaf) {
        ctx.strokeStyle = "#94a3b8";
        ctx.setLineDash([6, 4]);
        ctx.strokeRect(X(b.x0), Y(b.y1), X(b.x1) - X(b.x0), Y(b.y0) - Y(b.y1));
        ctx.setLineDash([]);
      }
    };
    drawRegions(tree, { x0: -RANGE, x1: RANGE, y0: -RANGE, y1: RANGE });

    if (selRule !== null && rules[selRule]) {
      const b = rules[selRule].bounds;
      ctx.strokeStyle = "#d97706";
      ctx.lineWidth = 3;
      ctx.strokeRect(X(b.x0), Y(b.y1), X(b.x1) - X(b.x0), Y(b.y0) - Y(b.y1));
    }

    for (const p of train) {
      const { px, py } = toPx(p.x, p.y);
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, 2 * Math.PI);
      ctx.fillStyle = CLASS_COLORS[p.label];
      ctx.globalAlpha = 0.9;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    for (const p of test) {
      const { px, py } = toPx(p.x, p.y);
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, 2 * Math.PI);
      ctx.strokeStyle = CLASS_COLORS[p.label];
      ctx.globalAlpha = 0.75;
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    if (query) {
      const q = toPx(query.x, query.y);
      ctx.fillStyle = "#d97706";
      ctx.beginPath();
      ctx.arc(q.px, q.py, 3.5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = "#d97706";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(q.px, q.py, 10, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }, [tree, train, test, query, rules, selRule, shownSplits, splitIdx, size, toPx, canvasRef]);

  const onCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 * RANGE - RANGE;
    const y = RANGE - ((e.clientY - rect.top) / rect.height) * 2 * RANGE;
    setQuery({ x, y });
  };

  const queryRule = query
    ? rules.find((r) =>
        r.conditions.every((c) => {
          const v = c.feature === 0 ? query.x : query.y;
          return c.op === "<=" ? v <= c.threshold : v > c.threshold;
        }),
      )
    : undefined;

  const resetGrow = () => {
    setGrown(null);
    setGrowing(false);
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 mb-10">
      <SimHeader
        title="Decision Trees"
        subtitle="Watch one tree grow, then poke it."
      />

      <div className="flex flex-col gap-6 lg:flex-row">
        <Card className="flex-1">
          <CardContent className="p-4">
            <div ref={containerRef} className="w-full">
              <canvas
                ref={canvasRef}
                width={size.width}
                height={size.height}
                onClick={onCanvasClick}
                className="w-full cursor-crosshair rounded-lg border"
                aria-label="Tree map. Activate to classify the clicked point."
              />
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <Button
                size="sm"
                variant={growingActive ? "default" : "outline"}
                className="gap-2"
                disabled={splits.length === 0}
                title={splits.length === 0 ? "Pure data — nothing to split" : undefined}
                onClick={() => {
                  if (growingActive) {
                    setGrowing(false);
                  } else if (growDone && grown !== null) {
                    setGrown(0);
                    setGrowing(true);
                  } else {
                    setGrown(0);
                    setGrowing(true);
                  }
                }}
              >
                {growingActive ? (
                  <Pause className="h-3.5 w-3.5 fill-current" />
                ) : (
                  <Play className="h-3.5 w-3.5 fill-current" />
                )}
                {growingActive
                  ? `Growing… ${shownSplits}/${splits.length}`
                  : grown !== null && growDone
                    ? "Replay growth"
                    : "Grow the tree"}
              </Button>
              {grown !== null && (
                <Button size="sm" variant="ghost" onClick={resetGrow}>
                  Full tree
                </Button>
              )}
            </div>
            {/* Growth progress: proves the animation is alive + what just split. */}
            {grown !== null && (
              <div className="mx-auto mt-3 max-w-md space-y-1.5" aria-live="polite">
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${splits.length === 0 ? 0 : (shownSplits / splits.length) * 100}%` }}
                  />
                </div>
                <p className="text-center text-xs text-muted-foreground tabular-nums">
                  {growDone ? (
                    <>Tree complete — {splits.length} splits</>
                  ) : lastSplit ? (
                    <>
                      Split {shownSplits}/{splits.length}: {lastSplit.feature === 0 ? "x" : "y"} ≤{" "}
                      {lastSplit.threshold.toFixed(2)} · gain {lastSplit.gain.toFixed(3)}
                    </>
                  ) : (
                    <>Starting…</>
                  )}
                </p>
              </div>
            )}
            {query && queryRule ? (
              <p className="mx-auto mt-3 max-w-md rounded-lg bg-amber-500/10 px-4 py-2 text-center text-sm">
                Query →{" "}
                <strong style={{ color: CLASS_COLORS[queryRule.prediction] }}>
                  {CLASS_NAMES[queryRule.prediction]}
                </strong>{" "}
                <span className="font-mono text-xs text-muted-foreground">
                  via {ruleText(queryRule)}
                </span>
              </p>
            ) : (
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Click the map to classify a point · solid = train, hollow = test
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="w-full lg:w-80">
          <CardHeader className="pb-3">
            <CardTitle>Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <Segmented
              label="Dataset"
              value={dataset}
              onChange={(v) => {
                setDataset(v);
                setQuery(null);
                resetGrow();
              }}
              options={[
                { value: "blobs", label: "Blobs" },
                { value: "moons", label: "Moons" },
                { value: "diagonal", label: "Diagonal" },
              ]}
            />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Max depth</span>
                <span className="rounded-md bg-primary/10 px-2 py-0.5 font-bold text-primary tabular-nums">
                  {maxDepth}
                </span>
              </div>
              <Slider
                value={[maxDepth]}
                min={1}
                max={8}
                step={1}
                onValueChange={([v]) => {
                  setMaxDepth(v);
                  resetGrow();
                }}
                aria-label="Maximum tree depth"
              />
              <svg viewBox="0 0 200 64" className="h-16 w-full" role="img" aria-label="Train versus test accuracy across depths">
                {[0.25, 0.5, 0.75].map((g) => (
                  <line key={g} x1="8" x2="192" y1={56 - g * 48} y2={56 - g * 48} stroke="currentColor" className="text-border" strokeWidth="1" strokeDasharray="3 3" />
                ))}
                <polyline
                  points={[1, 2, 3, 4, 5, 6, 7, 8].map((d, i) => {
                    const t = trainTree(train, { maxDepth: d, minSamplesLeaf: minLeaf });
                    return `${8 + (i / 7) * 184},${56 - accuracy(t, train) * 48}`;
                  }).join(" ")}
                  fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"
                />
                <polyline
                  points={[1, 2, 3, 4, 5, 6, 7, 8].map((d, i) => {
                    const t = trainTree(train, { maxDepth: d, minSamplesLeaf: minLeaf });
                    return `${8 + (i / 7) * 184},${56 - accuracy(t, test) * 48}`;
                  }).join(" ")}
                  fill="none" stroke="#d97706" strokeWidth="2" strokeDasharray="5 3" strokeLinejoin="round" strokeLinecap="round"
                />
                <circle cx={8 + ((maxDepth - 1) / 7) * 184} cy={56 - accuracy(tree, test) * 48} r="4.5" fill="#d97706" stroke="#fff" strokeWidth="1.5" />
              </svg>
              <div className="flex justify-between text-[10px] text-muted-foreground tabular-nums">
                <span>depth 1</span>
                <span className="text-primary">— train</span>
                <span className="text-amber-600">┄ test</span>
                <span>depth 8</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Noise</span>
                <span className="font-semibold text-primary tabular-nums">{noise.toFixed(1)}</span>
              </div>
              <Slider value={[noise]} min={0.2} max={2} step={0.1} onValueChange={([v]) => { setNoise(v); resetGrow(); }} aria-label="Data noise" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Min leaf size</span>
                <span className="font-semibold text-primary tabular-nums">{minLeaf}</span>
              </div>
              <Slider value={[minLeaf]} min={1} max={10} step={1} onValueChange={([v]) => { setMinLeaf(v); resetGrow(); }} aria-label="Minimum samples per leaf" />
            </div>

            <div className="rounded-md bg-muted/50 p-3 text-xs leading-relaxed">
              <span className="font-medium">Snapshot:</span> {stats.leaves} leaves ·{" "}
              {stats.nodes} nodes · train {(accuracy(tree, train) * 100).toFixed(0)}% · test{" "}
              {(accuracy(tree, test) * 100).toFixed(0)}%
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => { setTrainSeed(Math.floor(Math.random() * 1e9)); resetGrow(); }}>
                New data
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => setQuery(null)} disabled={!query}>
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Learned rules ({rules.length} leaves)</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-1.5 sm:grid-cols-2">
            {rules.map((r, i) => (
              <li key={i}>
                <button
                  type="button"
                  onMouseEnter={() => setSelRule(i)}
                  onMouseLeave={() => setSelRule(null)}
                  onFocus={() => setSelRule(i)}
                  onBlur={() => setSelRule(null)}
                  onClick={() => setSelRule(selRule === i ? null : i)}
                  className={cn(
                    "flex w-full cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 font-mono text-xs transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    selRule === i ? "border-amber-600/60 bg-amber-500/10" : "border-border/60 hover:border-border",
                  )}
                >
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: CLASS_COLORS[r.prediction] }} />
                  <span className="truncate">
                    IF {ruleText(r)} → {CLASS_NAMES[r.prediction]} ({r.counts[0]}/{r.counts[1]})
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <CalloutBox type="tip" title="What to try">
        <p>
          Hit “Grow the tree” and watch splits arrive one by one. Push depth to 8:
          train hits 100% while test falls. Diagonal dataset shows the staircase
          weakness of axis-aligned splits.
        </p>
      </CalloutBox>
    </div>
  );
}
