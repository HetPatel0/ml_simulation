"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { MathBlock } from "@/components/articles/components/MathBlock";
import SimHeader from "./sim-header";
import { useResponsiveCanvas } from "@/lib/use-responsive-canvas";

type Label = 0 | 1 | 2 | 3;
type Pt = { x: number; y: number; label: Label; test?: boolean };
type Metric = "euclidean" | "manhattan";
type Weighting = "uniform" | "distance";

const RANGE = 7; // data space is [-RANGE, RANGE] on both axes
const CLASS_COLORS = ["#ef4444", "#2563eb", "#22c55e", "#a855f7"];
const CLASS_NAMES = ["Red", "Blue", "Green", "Purple"];
const COLORS = {
  background: "#ffffff",
  grid: "#e2e8f0",
  query: "#d97706", // amber-600
};
const GRID = 40; // heatmap resolution
const K_STEPS = [1, 3, 5, 7, 9, 11, 13, 15];

const GROUP_CENTERS: { x: number; y: number }[][] = [
  [
    { x: -3, y: 2.5 },
    { x: 3, y: -2.5 },
  ],
  [
    { x: -3.5, y: 2.5 },
    { x: 3.5, y: 2.5 },
    { x: 0, y: -3.5 },
  ],
  [
    { x: -3, y: 3 },
    { x: 3, y: 3 },
    { x: -3, y: -3 },
    { x: 3, y: -3 },
  ],
];

/** Deterministic RNG so the starting layout is stable across reloads. */
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
  // Box–Muller.
  const u = Math.max(rng(), 1e-9);
  const v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function makeBlobs(seed: number, groups: number): Pt[] {
  const rng = mulberry32(seed);
  const pts: Pt[] = [];
  const centers = GROUP_CENTERS[groups - 2];
  const n = Math.max(10, Math.round(52 / groups));
  centers.forEach((c, gi) => {
    for (let i = 0; i < n; i++) {
      const idx = pts.length;
      pts.push({
        x: Math.max(-RANGE + 0.5, Math.min(RANGE - 0.5, c.x + gaussian(rng) * 1.5)),
        y: Math.max(-RANGE + 0.5, Math.min(RANGE - 0.5, c.y + gaussian(rng) * 1.5)),
        label: gi as Label,
        // Every 5th point is held out for the accuracy curve.
        test: idx % 5 === 4,
      });
    }
  });
  return pts;
}

function dist(a: { x: number; y: number }, b: Pt, m: Metric, scaled: boolean) {
  // Scaling toggle stretches X ×6 — the article's "KNN lies" warning live.
  const sx = scaled ? 6 : 1;
  const dx = (a.x - b.x) * sx;
  const dy = a.y - b.y;
  return m === "euclidean" ? Math.hypot(dx, dy) : Math.abs(dx) + Math.abs(dy);
}

function classify(
  q: { x: number; y: number },
  train: Pt[],
  k: number,
  metric: Metric,
  scaled: boolean,
  weighting: Weighting,
): Label {
  const near = train
    .map((p) => ({ p, d: dist(q, p, metric, scaled) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, k);
  if (weighting === "uniform") {
    const counts = [0, 0, 0, 0];
    for (const n of near) counts[n.p.label]++;
    return counts.indexOf(Math.max(...counts)) as Label;
  }
  const weights = [0, 0, 0, 0];
  for (const n of near) weights[n.p.label] += 1 / (n.d * n.d + 1e-6);
  return weights.indexOf(Math.max(...weights)) as Label;
}

/** Big tap-friendly segmented control (radio behavior). */
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

export default function KNearestNeighbors() {
  const { containerRef, canvasRef, size } = useResponsiveCanvas({
    maxWidth: 640,
    aspectRatio: 1,
  });
  const [seed, setSeed] = useState(42);
  const [groups, setGroups] = useState(2);
  const [k, setK] = useState(5);
  const [metric, setMetric] = useState<Metric>("euclidean");
  const [weighting, setWeighting] = useState<Weighting>("uniform");
  const [scaled, setScaled] = useState(false);
  const [query, setQuery] = useState<{ x: number; y: number } | null>(null);
  const [showBoundary, setShowBoundary] = useState(false);
  const [sweeping, setSweeping] = useState(false);

  const points = useMemo(() => makeBlobs(seed, groups), [seed, groups]);
  const train = useMemo(() => points.filter((p) => !p.test), [points]);
  const testPts = useMemo(() => points.filter((p) => p.test), [points]);

  const neighbors = useMemo(() => {
    if (!query) return [];
    return train
      .map((p) => ({ p, d: dist(query, p, metric, scaled) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, k);
  }, [query, train, k, metric, scaled]);

  // Vote shares (weighted when enabled) + winner.
  const { shares, prediction } = useMemo(() => {
    const w = [0, 0, 0, 0];
    for (const n of neighbors) {
      w[n.p.label] += weighting === "uniform" ? 1 : 1 / (n.d * n.d + 1e-6);
    }
    const total = w.reduce((a, b) => a + b, 0) || 1;
    return {
      shares: w.map((v) => v / total),
      prediction:
        neighbors.length === 0
          ? null
          : (w.indexOf(Math.max(...w)) as Label),
    };
  }, [neighbors, weighting]);

  // Boundary wash: classify a coarse grid with current settings.
  const heat = useMemo(() => {
    if (!showBoundary) return null;
    const cells = new Uint8Array(GRID * GRID);
    for (let gy = 0; gy < GRID; gy++) {
      for (let gx = 0; gx < GRID; gx++) {
        cells[gy * GRID + gx] = classify(
          {
            x: ((gx + 0.5) / GRID) * 2 * RANGE - RANGE,
            y: RANGE - ((gy + 0.5) / GRID) * 2 * RANGE,
          },
          train,
          k,
          metric,
          scaled,
          weighting,
        );
      }
    }
    return cells;
  }, [showBoundary, train, k, metric, scaled, weighting]);

  // Accuracy vs k on the holdout set.
  const curve = useMemo(
    () =>
      K_STEPS.map((kk) => {
        if (testPts.length === 0) return 0;
        let ok = 0;
        for (const t of testPts) {
          if (classify(t, train, kk, metric, scaled, weighting) === t.label) ok++;
        }
        return ok / testPts.length;
      }),
    [testPts, train, metric, scaled, weighting],
  );
  const liveAcc = curve[K_STEPS.indexOf(k)] ?? 0;

  // k-sweep playback: chained timeouts, stops naturally at k=15
  // (no render-phase setState — completion derives from k itself).
  const sweepDone = k >= 15;
  const spinning = sweeping && !sweepDone;
  useEffect(() => {
    if (!sweeping || sweepDone) return;
    // k in deps: each step reschedules the next one.
    const id = setTimeout(() => setK((prev) => Math.min(prev + 2, 15)), 650);
    return () => clearTimeout(id);
  }, [sweeping, sweepDone, k]);

  const toPx = useCallback(
    (x: number, y: number) => ({
      px: ((x + RANGE) / (2 * RANGE)) * size.width,
      py: ((RANGE - y) / (2 * RANGE)) * size.height,
    }),
    [size],
  );

  // Drawing.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { width, height } = size;

    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, width, height);

    // Boundary wash first (under everything).
    if (heat) {
      const cw = width / GRID;
      const ch = height / GRID;
      ctx.globalAlpha = 0.13;
      for (let gy = 0; gy < GRID; gy++) {
        for (let gx = 0; gx < GRID; gx++) {
          ctx.fillStyle = CLASS_COLORS[heat[gy * GRID + gx]];
          ctx.fillRect(gx * cw, gy * ch, cw + 0.5, ch + 0.5);
        }
      }
      ctx.globalAlpha = 1;
    }

    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 1;
    for (let i = 0; i <= width; i += Math.max(20, width / 14)) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let i = 0; i <= height; i += Math.max(20, height / 14)) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    // Neighbor links under the points.
    if (query) {
      const q = toPx(query.x, query.y);
      ctx.setLineDash([5, 4]);
      for (const n of neighbors) {
        const p = toPx(n.p.x, n.p.y);
        ctx.strokeStyle = CLASS_COLORS[n.p.label];
        ctx.globalAlpha = 0.55;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(q.px, q.py);
        ctx.lineTo(p.px, p.py);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.setLineDash([]);
    }

    for (const p of points) {
      const { px, py } = toPx(p.x, p.y);
      const isNeighbor = neighbors.some((n) => n.p === p);
      ctx.beginPath();
      if (p.test) {
        // Holdout points render hollow.
        ctx.arc(px, py, 5, 0, 2 * Math.PI);
        ctx.strokeStyle = CLASS_COLORS[p.label];
        ctx.globalAlpha = 0.7;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.globalAlpha = 1;
        continue;
      }
      ctx.arc(px, py, isNeighbor ? 7 : 5, 0, 2 * Math.PI);
      ctx.fillStyle = CLASS_COLORS[p.label];
      ctx.globalAlpha = query && !isNeighbor ? 0.35 : 0.9;
      ctx.fill();
      ctx.globalAlpha = 1;
      if (isNeighbor) {
        ctx.strokeStyle = COLORS.query;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    if (query) {
      const q = toPx(query.x, query.y);
      // Hollow amber ring + solid center dot — reads cleanly at any zoom.
      ctx.strokeStyle = COLORS.query;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(q.px, q.py, 10, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fillStyle = COLORS.query;
      ctx.beginPath();
      ctx.arc(q.px, q.py, 3.5, 0, 2 * Math.PI);
      ctx.fill();
    }
  }, [points, neighbors, query, heat, size, toPx, canvasRef]);

  const placeQuery = (x: number, y: number) =>
    setQuery({
      x: Math.max(-RANGE, Math.min(RANGE, x)),
      y: Math.max(-RANGE, Math.min(RANGE, y)),
    });

  const onCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const fx = (e.clientX - rect.left) / rect.width;
    const fy = (e.clientY - rect.top) / rect.height;
    placeQuery(fx * 2 * RANGE - RANGE, RANGE - fy * 2 * RANGE);
  };

  // Sparkline geometry (viewBox 200x64).
  const spark = useMemo(() => {
    const pts = curve.map((a, i) => {
      const x = 8 + (i / (curve.length - 1)) * 184;
      const y = 56 - a * 48;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    const ki = K_STEPS.indexOf(k);
    const kx = 8 + (Math.max(0, ki) / (curve.length - 1)) * 184;
    const ky = 56 - (curve[Math.max(0, ki)] ?? 0) * 48;
    return { line: pts.join(" "), kx, ky };
  }, [curve, k]);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 mb-10">
      <SimHeader
        title="K-Nearest Neighbors"
        subtitle="Click anywhere — the k closest points vote on its label."
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
                aria-label="KNN playground. Activate to classify the clicked point."
              />
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <Button
                size="sm"
                variant={showBoundary ? "default" : "outline"}
                onClick={() => {
                  if (showBoundary) setSweeping(false);
                  setShowBoundary(!showBoundary);
                }}
                aria-pressed={showBoundary}
              >
                {showBoundary ? "Hide boundary" : "Show boundary"}
              </Button>
              <Button size="sm" variant="outline" onClick={() => placeQuery(0, 0)}>
                Center clash
              </Button>
            </div>
            <div className="mt-2.5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-500" />
                Train point
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-full border-2 border-blue-600" />
                Holdout (test) point
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-full border-2 border-amber-600" />
                Voting neighbor
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-flex h-2.5 w-2.5 items-center justify-center rounded-full border-2 border-amber-600">
                  <span className="h-1 w-1 rounded-full bg-amber-600" />
                </span>
                Your query
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full lg:w-80">
          <CardHeader className="pb-3">
            <CardTitle>Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <Segmented
              label="Classes"
              value={groups}
              onChange={(v) => {
                setGroups(v);
                setQuery(null);
              }}
              options={[
                { value: 2, label: "2" },
                { value: 3, label: "3" },
                { value: 4, label: "4" },
              ]}
            />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Neighbors (k)</span>
                <span className="rounded-md bg-primary/10 px-2 py-0.5 font-bold text-primary tabular-nums">
                  {k}
                </span>
              </div>
              <Slider
                value={[k]}
                min={1}
                max={15}
                step={2}
                onValueChange={([v]) => {
                  setSweeping(false);
                  setK(v);
                }}
                aria-label="Number of neighbors"
              />
              <Button
                size="sm"
                variant={spinning ? "default" : "outline"}
                className="w-full gap-2"
                onClick={() => {
                  if (sweepDone) {
                    setK(1);
                    setShowBoundary(true);
                    setSweeping(true);
                  } else {
                    if (!sweeping) setShowBoundary(true);
                    setSweeping((v) => !v);
                  }
                }}
                aria-label={spinning ? "Pause k sweep" : "Animate k from 1 to 15"}
              >
                {spinning ? (
                  <Pause className="h-3.5 w-3.5 fill-current" />
                ) : (
                  <Play className="h-3.5 w-3.5 fill-current" />
                )}
                {spinning ? "Stop sweep" : "Sweep k 1 → 15"}
              </Button>
              <p className="text-xs text-muted-foreground">
                Small k is jagged · large k is smooth
              </p>
            </div>

            <Segmented
              label="Distance"
              value={metric}
              onChange={setMetric}
              options={[
                { value: "euclidean", label: "Euclid" },
                { value: "manhattan", label: "Manhattan" },
              ]}
            />
            <div className="-mt-3 rounded-lg bg-muted/50 px-3 py-1.5 text-center">
              <MathBlock
                display="inline"
                formula={
                  metric === "euclidean"
                    ? "d = \\sqrt{\\sum (x_j - y_j)^2}"
                    : "d = \\sum |x_j - y_j|"
                }
              />
            </div>

            <Segmented
              label="Vote weight"
              value={weighting}
              onChange={setWeighting}
              options={[
                { value: "uniform", label: "Equal" },
                { value: "distance", label: "1/d²" },
              ]}
            />

            <div className="space-y-2 rounded-xl border border-dashed border-border p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">Stretch X ×6</span>
                <Button
                  size="sm"
                  variant={scaled ? "default" : "outline"}
                  onClick={() => setScaled((v) => !v)}
                  aria-pressed={scaled}
                >
                  {scaled ? "On" : "Off"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Watch one axis hijack every vote
              </p>
            </div>

            <div className="space-y-2 rounded-md bg-muted/50 p-3">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium">Vote</span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  test acc{" "}
                  <span className="font-bold text-foreground">
                    {(liveAcc * 100).toFixed(0)}%
                  </span>
                </span>
              </div>
              {neighbors.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  No query yet — click the canvas.
                </p>
              ) : (
                <>
                  <div className="flex h-2.5 overflow-hidden rounded-full">
                    {shares.map((s, i) =>
                      s > 0 ? (
                        <div
                          key={i}
                          className="transition-all"
                          style={{
                            width: `${s * 100}%`,
                            background: CLASS_COLORS[i],
                          }}
                        />
                      ) : null,
                    )}
                  </div>
                  <p className="text-sm">
                    <span className="font-bold text-primary">
                      {CLASS_NAMES[prediction ?? 0]} wins
                    </span>
                  </p>
                </>
              )}
              <div>
                <svg
                  viewBox="0 0 200 64"
                  className="h-16 w-full"
                  role="img"
                  aria-label={`Accuracy versus k curve, currently ${(liveAcc * 100).toFixed(0)} percent at k equals ${k}`}
                >
                  {[0.25, 0.5, 0.75].map((g) => (
                    <line
                      key={g}
                      x1="8"
                      x2="192"
                      y1={56 - g * 48}
                      y2={56 - g * 48}
                      stroke="currentColor"
                      className="text-border"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                    />
                  ))}
                  <polyline
                    points={spark.line}
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                  <circle cx={spark.kx} cy={spark.ky} r="4.5" fill="var(--primary)" stroke="#fff" strokeWidth="1.5" />
                </svg>
                <div className="flex justify-between text-[10px] text-muted-foreground tabular-nums">
                  <span>k=1</span>
                  <span>accuracy vs k (holdout)</span>
                  <span>k=15</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setSeed(Math.floor(Math.random() * 1e9))}
              >
                New data
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setQuery(null)}
                disabled={!query}
              >
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
