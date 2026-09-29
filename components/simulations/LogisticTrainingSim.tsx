"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import SimHeader from "./sim-header";
import { Button } from "@/components/ui/button";
import { useResponsiveCanvas } from "@/lib/use-responsive-canvas";

type DataPoint = { x: number; y: number };
type LogEntry = {
  epoch: number;
  loss: number;
  mle: string;
  w: number;
  dw: number;
  b: number;
  db: number;
};

/** Column header with an instant hover tooltip (drops below the sticky row). */
function ThTip({
  label,
  tip,
  align = "center",
  className = "",
}: {
  label: string;
  tip: string;
  align?: "left" | "center" | "right";
  className?: string;
}) {
  const pos =
    align === "left"
      ? "left-0"
      : align === "right"
        ? "right-0"
        : "left-1/2 -translate-x-1/2";
  return (
    <th
      className={`group relative px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider ${className}`}
    >
      {label}
      <span
        role="tooltip"
        className={`pointer-events-none absolute top-full z-20 mt-2 w-52 rounded-lg border border-border bg-popover px-3 py-2 text-left text-xs font-normal normal-case leading-snug tracking-normal text-popover-foreground opacity-0 shadow-lg transition-all duration-150 group-hover:translate-y-0 group-hover:opacity-100 translate-y-1 ${pos}`}
      >
        {tip}
      </span>
    </th>
  );
}

export default function LogisticTrainingSim() {
  const { containerRef, canvasRef, size } = useResponsiveCanvas({
    maxWidth: 600,
    aspectRatio: 12 / 7,
  });

  // Simulation State Refs (Mutable for animation loop)
  const dataRef = useRef<DataPoint[]>([]);
  const paramsRef = useRef({ w: 0, b: 0 });
  const isTrainingRef = useRef(false);
  const epochRef = useRef(0);
  const reqIdRef = useRef<number>(0);

  // UI State
  const [isTraining, setIsTraining] = useState(false);
  const [stats, setStats] = useState({
    loss: 0,
    mle: "0.00",
    dw: 0,
    db: 0,
    w: 0,
    b: 0,
  });
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [showLog, setShowLog] = useState(false);

  // Constants
  const LEARNING_RATE = 0.05;
  const MAX_EPOCHS = 500;
  const PADDING = 40;

  const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));

  // --- Drawing Logic ---
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Helpers
    const mapX = (x: number) => PADDING + (x / 12) * (width - 2 * PADDING);
    const mapY = (y: number) => height - PADDING - y * (height - 2 * PADDING);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    // Axes
    ctx.strokeStyle = "#ddd";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(PADDING, mapY(0));
    ctx.lineTo(width - PADDING, mapY(0));
    ctx.moveTo(mapX(0), PADDING);
    ctx.lineTo(mapX(0), height - PADDING);
    ctx.stroke();

    // Threshold Line
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(PADDING, mapY(0.5));
    ctx.lineTo(width - PADDING, mapY(0.5));
    ctx.stroke();
    ctx.setLineDash([]);

    // Data Points
    for (const p of dataRef.current) {
      ctx.beginPath();
      ctx.arc(mapX(p.x), mapY(p.y), 6, 0, 2 * Math.PI);
      ctx.fillStyle = p.y === 1 ? "#22c55e" : "#ef4444";
      ctx.fill();
      ctx.strokeStyle = "#333";
      ctx.stroke();
    }

    // Sigmoid Curve
    ctx.beginPath();
    ctx.strokeStyle = "#2563eb";
    ctx.lineWidth = 3;
    const { w, b } = paramsRef.current;
    for (let x = 0; x <= 12; x += 0.1) {
      const y = sigmoid(w * x + b);
      if (x === 0) ctx.moveTo(mapX(x), mapY(y));
      else ctx.lineTo(mapX(x), mapY(y));
    }
    ctx.stroke();
  };

  // --- Logic ---
  const generateData = () => {
    stopTraining();
    dataRef.current = [];
    paramsRef.current = { w: 0, b: 0 };
    epochRef.current = 0;
    setLogs([]);
    setStats({ loss: 0, mle: "0.00", dw: 0, db: 0, w: 0, b: 0 });

    for (let i = 0; i < 50; i++) {
      // eslint-disable-next-line react-hooks/purity
      const x = Math.random() * 12;
      const z = 1.5 * x - 9; // Target logic
      const prob = sigmoid(z);
      // eslint-disable-next-line react-hooks/purity
      const y = Math.random() < prob ? 1 : 0;
      dataRef.current.push({ x, y });
    }
    draw();
  };

  const startTraining = () => {
    isTrainingRef.current = true;
    setIsTraining(true);
    loop();
  };

  const stopTraining = () => {
    isTrainingRef.current = false;
    setIsTraining(false);
    if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
  };

  const loop = () => {
    if (!isTrainingRef.current) return;

    let { w, b } = paramsRef.current;
    let dw = 0,
      db = 0,
      totalLoss = 0,
      logLikelihoodSum = 0;
    const m = dataRef.current.length;

    if (m === 0) return;

    for (const p of dataRef.current) {
      const pred = sigmoid(w * p.x + b);
      const error = pred - p.y;

      dw += error * p.x;
      db += error;

      const safePred = Math.max(0.000001, Math.min(0.999999, pred));
      totalLoss += -(
        p.y * Math.log(safePred) +
        (1 - p.y) * Math.log(1 - safePred)
      );
      logLikelihoodSum +=
        p.y * Math.log(safePred) + (1 - p.y) * Math.log(1 - safePred);
    }

    dw /= m;
    db /= m;
    w -= LEARNING_RATE * dw;
    b -= LEARNING_RATE * db;

    paramsRef.current = { w, b };
    epochRef.current++;

    // Update Visuals
    draw();

    // Update React State (Throttled slightly naturally by React batching, but we do every frame here)
    // For smoother UI in heavy loads, you might throttle this part.
    const currentStats = {
      loss: totalLoss / m,
      mle: logLikelihoodSum.toFixed(2),
      dw,
      db,
      w,
      b,
    };
    setStats(currentStats);

    if (epochRef.current % 5 === 0) {
      setLogs((prev) => [
        { epoch: epochRef.current, ...currentStats },
        ...prev.slice(0, 49), // Keep last 50
      ]);
    }

    if (epochRef.current >= MAX_EPOCHS) {
      stopTraining();
    } else {
      reqIdRef.current = requestAnimationFrame(loop);
    }
  };

  useEffect(() => {
    generateData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    draw();
  }, [size]);

  return (
    <div className="flex flex-col gap-6 mb-8 w-full max-w-5xl mx-auto">
      <SimHeader
        title="Logistic Regression Internals"
        subtitle="MLE & Gradient Descent Visualizer"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Controls & Canvas */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex gap-4">
            <Button onClick={generateData} className="flex-1">
              1. Generate Data
            </Button>
            <Button
              onClick={isTraining ? stopTraining : startTraining}
              variant={isTraining ? "destructive" : "default"}
              className="flex-1"
            >
              {isTraining ? "Stop Training" : "2. Start Training"}
            </Button>
          </div>

          <Card>
            <CardContent className="p-2">
              <div ref={containerRef} className="w-full">
                <canvas
                  ref={canvasRef}
                  width={size.width}
                  height={size.height}
                  className="w-full bg-white rounded border"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Stats */}
        <div className="space-y-4">
          <Card className="bg-muted/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm uppercase text-muted-foreground">
                Objective Functions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Log Loss (minimize):</span>
                <span className="font-mono font-bold text-red-600">
                  {stats.loss.toFixed(4)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Likelihood (maximize):</span>
                <span className="font-mono font-bold text-green-600">
                  {stats.mle}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                *Likelihood is P(Data|Model).
              </p>
            </CardContent>
          </Card>

          <Card className="bg-muted/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm uppercase text-muted-foreground">
                Gradient Descent
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="font-mono bg-background text-foreground p-2 rounded text-xs mb-2">
                dw = Σ(pred-y)*x
                <br />
                db = Σ(pred-y)
              </div>
              <div className="flex justify-between">
                <span>Slope Grad (dw):</span>
                <span className="font-mono font-bold">
                  {stats.dw.toFixed(4)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Bias Grad (db):</span>
                <span className="font-mono font-bold">
                  {stats.db.toFixed(4)}
                </span>
              </div>
              <div className="border-t pt-2 mt-2">
                <strong>Current Weights:</strong>
                <br />w = {stats.w.toFixed(2)}, b = {stats.b.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Log Table — collapsed by default so the interactive stage fits
          one screen for projection; expands in place when needed. */}
      <Card>
        <button
          type="button"
          onClick={() => setShowLog((v) => !v)}
          aria-expanded={showLog}
          className="flex w-full cursor-pointer items-center justify-between px-6 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
        >
          <CardTitle className="text-base">
            Training Log (Last 50 Updates)
          </CardTitle>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
              showLog && "rotate-180",
            )}
          />
        </button>
        {showLog && (
          <CardContent
            className="p-0 max-h-56 overflow-hidden rounded-b-xl border-t"
            // Lenis hijacks wheel events page-wide; without this the inner
            // table scroll never receives them (nested-scroll dead zone).
            data-lenis-prevent
          >
            <div className="max-h-56 overflow-y-auto" data-lenis-prevent>
              <table className="w-full border-collapse text-sm">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-muted/90 text-muted-foreground backdrop-blur">
                    <ThTip
                      label="Epoch"
                      tip="Training pass counter — one full gradient-descent sweep over the dataset."
                      align="left"
                      className="text-left"
                    />
                    <ThTip
                      label="Loss ↓"
                      tip="Log loss (binary cross-entropy) — model error. Lower is better."
                      className="text-right"
                    />
                    <ThTip
                      label="Likelihood ↑"
                      tip="P(Data|Model) — probability the data came from this model. Higher is better."
                      className="text-right"
                    />
                    <ThTip
                      label="w"
                      tip="Current slope weight of the logistic model."
                      className="text-right"
                    />
                    <ThTip
                      label="dw"
                      tip="Gradient of loss w.r.t. w (dw = Σ(pred−y)·x) — the slope correction applied each update."
                      align="right"
                      className="text-right"
                    />
                  </tr>
                </thead>
                <tbody className="font-mono text-xs tabular-nums">
                  {logs.map((log, i) => (
                    <tr
                      key={i}
                      className="border-t border-border/50 transition-colors first:border-t-0 even:bg-muted/20 hover:bg-primary/5"
                    >
                      <td className="px-4 py-1.5 text-left">
                        <span className="inline-flex min-w-10 justify-center rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                          {log.epoch}
                        </span>
                      </td>
                      <td className="px-4 py-1.5 text-right font-semibold text-red-600 dark:text-red-400">
                        {log.loss.toFixed(4)}
                      </td>
                      <td className="px-4 py-1.5 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                        {log.mle}
                      </td>
                      <td className="px-4 py-1.5 text-right text-foreground">
                        {log.w.toFixed(3)}
                      </td>
                      <td className="px-4 py-1.5 text-right text-muted-foreground">
                        {log.dw.toFixed(4)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
