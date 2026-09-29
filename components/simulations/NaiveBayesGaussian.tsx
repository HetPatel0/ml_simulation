"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { CalloutBox } from "@/components/articles/components/CalloutBox";
import { MathBlock } from "@/components/articles/components/MathBlock";
import { cn } from "@/lib/utils";
import SimHeader from "./sim-header";
import { useResponsiveCanvas } from "@/lib/use-responsive-canvas";

const RANGE = 7;
const CLASS_COLORS = ["#ef4444", "#2563eb"];
const CLASS_NAMES = ["Red", "Blue"];
const GRID = 36;

type Blob = { cx: number; cy: number; s: number };

function gauss(x: number, y: number, b: Blob): number {
  const dx = x - b.cx;
  const dy = y - b.cy;
  const v = b.s * b.s;
  return Math.exp(-(dx * dx + dy * dy) / (2 * v)) / (2 * Math.PI * v);
}

function posterior(
  x: number,
  y: number,
  blobs: [Blob, Blob],
  priorRed: number,
): [number, number] {
  const lr = gauss(x, y, blobs[0]) * priorRed;
  const lb = gauss(x, y, blobs[1]) * (1 - priorRed);
  const t = lr + lb || 1;
  return [lr / t, lb / t];
}

/** GaussianNB playground: drag the class blobs, watch the boundary follow. */
export default function NaiveBayesGaussian() {
  const { containerRef, canvasRef, size } = useResponsiveCanvas({
    maxWidth: 640,
    aspectRatio: 1,
  });
  const [blobs, setBlobs] = useState<[Blob, Blob]>([
    { cx: -2.5, cy: 2, s: 1.6 },
    { cx: 2.5, cy: -2, s: 1.6 },
  ]);
  const [priorRed, setPriorRed] = useState(50);
  const [query, setQuery] = useState<{ x: number; y: number } | null>(null);
  const dragIdx = useRef<number | null>(null);

  const toPx = useCallback(
    (x: number, y: number) => ({
      px: ((x + RANGE) / (2 * RANGE)) * size.width,
      py: ((RANGE - y) / (2 * RANGE)) * size.height,
    }),
    [size],
  );
  const toData = useCallback(
    (px: number, py: number, rect: DOMRect) => ({
      x: ((px - rect.left) / rect.width) * 2 * RANGE - RANGE,
      y: RANGE - ((py - rect.top) / rect.height) * 2 * RANGE,
    }),
    [],
  );

  const qp = query ? posterior(query.x, query.y, blobs, priorRed / 100) : null;
  const verdictRed = (qp?.[0] ?? 0.5) >= 0.5;

  // Boundary wash: argmax posterior per cell.
  const heat = useMemo(() => {
    const cells = new Uint8Array(GRID * GRID);
    for (let gy = 0; gy < GRID; gy++) {
      for (let gx = 0; gx < GRID; gx++) {
        const x = ((gx + 0.5) / GRID) * 2 * RANGE - RANGE;
        const y = RANGE - ((gy + 0.5) / GRID) * 2 * RANGE;
        cells[gy * GRID + gx] = posterior(x, y, blobs, priorRed / 100)[0] >= 0.5 ? 0 : 1;
      }
    }
    return cells;
  }, [blobs, priorRed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { width, height } = size;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    const cw = width / GRID;
    const ch = height / GRID;
    ctx.globalAlpha = 0.14;
    for (let gy = 0; gy < GRID; gy++) {
      for (let gx = 0; gx < GRID; gx++) {
        ctx.fillStyle = CLASS_COLORS[heat[gy * GRID + gx]];
        ctx.fillRect(gx * cw, gy * ch, cw + 0.5, ch + 0.5);
      }
    }
    ctx.globalAlpha = 1;

    ctx.strokeStyle = "#e2e8f0";
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

    // 1σ / 2σ ellipse rings per blob.
    blobs.forEach((b, i) => {
      const c = toPx(b.cx, b.cy);
      const rx = (b.s / (2 * RANGE)) * width;
      const ry = (b.s / (2 * RANGE)) * height;
      for (const k of [1, 2]) {
        ctx.strokeStyle = CLASS_COLORS[i];
        ctx.globalAlpha = k === 1 ? 0.8 : 0.35;
        ctx.lineWidth = k === 1 ? 2 : 1.5;
        ctx.setLineDash(k === 1 ? [] : [6, 4]);
        ctx.beginPath();
        ctx.ellipse(c.px, c.py, rx * k, ry * k, 0, 0, 2 * Math.PI);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;
      // Drag handle.
      ctx.fillStyle = CLASS_COLORS[i];
      ctx.beginPath();
      ctx.arc(c.px, c.py, 8, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(c.px, c.py, 3, 0, 2 * Math.PI);
      ctx.fill();
    });

    if (query) {
      const q = toPx(query.x, query.y);
      ctx.strokeStyle = "#d97706";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(q.px, q.py, 10, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fillStyle = "#d97706";
      ctx.beginPath();
      ctx.arc(q.px, q.py, 3.5, 0, 2 * Math.PI);
      ctx.fill();
    }
  }, [blobs, heat, query, size, toPx, canvasRef]);

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const d = toData(e.clientX, e.clientY, rect);
    const q = toPx(d.x, d.y);
    const hit = blobs.findIndex((b) => {
      const c = toPx(b.cx, b.cy);
      return Math.hypot(q.px - c.px, q.py - c.py) < 18;
    });
    if (hit >= 0) {
      dragIdx.current = hit;
      e.currentTarget.setPointerCapture(e.pointerId);
    } else {
      setQuery({ x: Math.max(-RANGE, Math.min(RANGE, d.x)), y: Math.max(-RANGE, Math.min(RANGE, d.y)) });
    }
  };
  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (dragIdx.current === null) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const d = toData(e.clientX, e.clientY, rect);
    const i = dragIdx.current;
    setBlobs((b) => {
      const next = [...b] as [Blob, Blob];
      next[i] = {
        ...next[i],
        cx: Math.max(-RANGE, Math.min(RANGE, d.x)),
        cy: Math.max(-RANGE, Math.min(RANGE, d.y)),
      };
      return next;
    });
  };
  const onPointerUp = () => {
    dragIdx.current = null;
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 mb-10">
      <SimHeader
        title="Gaussian Naive Bayes"
        subtitle="Drag the class blobs — the boundary follows the math."
      />

      <div className="flex flex-col gap-6 lg:flex-row">
        <Card className="flex-1">
          <CardContent className="p-4">
            <div ref={containerRef} className="w-full">
              <canvas
                ref={canvasRef}
                width={size.width}
                height={size.height}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                className="w-full cursor-crosshair rounded-lg border touch-none"
                aria-label="Gaussian playground. Drag blob centers or activate to classify."
              />
            </div>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Drag a blob center to move its class · click empty space to query
            </p>
            {qp && query && (
              <div className="mx-auto mt-3 max-w-md space-y-2" aria-live="polite">
                {(
                  [
                    { label: "P(red|x)", p: qp[0], cls: "bg-red-500" },
                    { label: "P(blue|x)", p: qp[1], cls: "bg-blue-600" },
                  ] as const
                ).map((b) => (
                  <div key={b.label} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold">{b.label}</span>
                      <span className="font-bold tabular-nums">{(b.p * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div className={cn(b.cls, "h-full rounded-full transition-all duration-200")} style={{ width: `${b.p * 100}%` }} />
                    </div>
                  </div>
                ))}
                <p className="text-center text-sm">
                  Verdict:{" "}
                  <span className={cn("font-bold", verdictRed ? "text-red-500" : "text-blue-600")}>
                    {verdictRed ? "RED" : "BLUE"}
                  </span>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="w-full lg:w-80">
          <CardHeader className="pb-3">
            <CardTitle>Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {blobs.map((b, i) => (
              <div key={i} className="space-y-2 rounded-xl border border-border/60 p-3">
                <p className="inline-flex items-center gap-2 text-sm font-medium">
                  <span className="h-3 w-3 rounded-full" style={{ background: CLASS_COLORS[i] }} />
                  {CLASS_NAMES[i]} blob
                </p>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Spread σ</span>
                  <span className="font-bold text-foreground tabular-nums">{b.s.toFixed(1)}</span>
                </div>
                <Slider
                  value={[b.s]}
                  min={0.6}
                  max={3}
                  step={0.1}
                  onValueChange={([v]) =>
                    setBlobs((prev) => {
                      const next = [...prev] as [Blob, Blob];
                      next[i] = { ...next[i], s: v };
                      return next;
                    })
                  }
                  aria-label={`${CLASS_NAMES[i]} spread`}
                />
              </div>
            ))}

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Prior P(red)</span>
                <span className="font-bold text-primary tabular-nums">{priorRed}%</span>
              </div>
              <Slider
                value={[priorRed]}
                min={5}
                max={95}
                step={1}
                onValueChange={([v]) => setPriorRed(v)}
                aria-label="Prior probability of red"
              />
              <p className="text-xs text-muted-foreground">
                High prior pulls the boundary toward blue territory
              </p>
            </div>

            <div className="rounded-lg bg-muted/50 px-3 py-2 text-center">
              <MathBlock display="inline" formula="P(y \mid x) \propto P(y) \cdot \mathcal{N}(x; \mu_y, \sigma_y)" />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setBlobs([
                    { cx: -2.5, cy: 2, s: 1.6 },
                    { cx: 2.5, cy: -2, s: 1.6 },
                  ]);
                  setQuery(null);
                }}
              >
                Reset
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => setQuery(null)} disabled={!query}>
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <CalloutBox type="tip" title="What to try">
        <p>
          Drag the blobs on top of each other and watch confidence collapse to
          the prior. Widen one blob&apos;s σ: its territory grows because flat
          likelihoods reach further. Then skew the prior to 90% and see the
          boundary surrender ground to the underdog.
        </p>
      </CalloutBox>
    </div>
  );
}
