"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import SimHeader from "../common/sim-header";

interface Point {
  x: number;
  y: number;
}

interface SVRParams {
  kernel: "rbf" | "poly" | "linear";
  gamma: number;
  degree: number;
  coeff: number;
  epsilon: number;
  C: number;
  lr: number;
}

export default function SupportVectorRegression() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<Point[]>([]);

  // Model Weights (Not in state to avoid re-renders on every SGD step)
  const alphas = useRef<number[]>([]);
  const bias = useRef<number>(0);

  const [params, setParams] = useState<SVRParams>({
    kernel: "rbf",
    gamma: 3.0,
    degree: 2,
    coeff: 1.0,
    epsilon: 0.1,
    C: 10,
    lr: 0.01,
  });

  // Animation ref
  const animFrame = useRef<number>(0);

  // Math Helpers
  const kernel = useCallback(
    (x1: number, x2: number) => {
      if (params.kernel === "linear") {
        return x1 * x2;
      } else if (params.kernel === "poly") {
        const base = x1 * x2 + params.coeff;
        return Math.pow(base, params.degree);
      } else {
        // RBF
        const d = x1 - x2;
        return Math.exp(-params.gamma * d * d);
      }
    },
    [params.kernel, params.gamma, params.degree, params.coeff],
  );

  const predict = useCallback(
    (x: number) => {
      let sum = bias.current;
      for (let i = 0; i < points.length; i++) {
        const a = alphas.current[i];
        if (!a || a === 0) continue;
        sum += a * kernel(x, points[i].x);
      }
      return sum;
    },
    [points, kernel],
  ); // bias.current and alphas.current are stable refs

  // Training Loop
  const trainStep = useCallback(() => {
    if (points.length === 0) return;

    const iterations = 50;
    const len = points.length;

    for (let k = 0; k < iterations; k++) {
      // Pick random
      const i = Math.floor(Math.random() * len);
      const p = points[i];

      const y_pred = predict(p.x);
      const error = p.y - y_pred;

      // SVR Update Rule
      if (Math.abs(error) > params.epsilon) {
        const sign = Math.sign(error);
        let update = params.lr * params.C * sign;

        // Stability Clamp
        if (Math.abs(update) > 0.5) update = 0.5 * sign;

        alphas.current[i] = (alphas.current[i] || 0) + update;
        bias.current += update * 0.5;
      }

      // Weight Decay
      if (alphas.current[i]) alphas.current[i] *= 0.999;
    }
  }, [points, params, predict]);

  // Drawing
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;
    const scale = width / 2.5;

    /* ---------- Clear (WHITE CANVAS) ---------- */
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    /* ---------- Prediction Tube ---------- */
    ctx.beginPath();
    ctx.fillStyle = "rgba(37, 99, 235, 0.12)"; // blue-600 (light)

    for (let i = 0; i <= width; i += 4) {
      const x = (i - cx) / scale;
      const y = predict(x) + params.epsilon;
      const py = -y * scale + cy;
      if (i === 0) ctx.moveTo(i, py);
      else ctx.lineTo(i, py);
    }

    for (let i = width; i >= 0; i -= 4) {
      const x = (i - cx) / scale;
      const y = predict(x) - params.epsilon;
      const py = -y * scale + cy;
      ctx.lineTo(i, py);
    }
    ctx.fill();

    /* ---------- Center Line ---------- */
    ctx.strokeStyle = "#2563eb"; // blue-600
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= width; i += 4) {
      const x = (i - cx) / scale;
      const y = predict(x);
      const py = -y * scale + cy;
      if (i === 0) ctx.moveTo(i, py);
      else ctx.lineTo(i, py);
    }
    ctx.stroke();

    /* ---------- Points ---------- */
    points.forEach((p) => {
      const px = p.x * scale + cx;
      const py = -p.y * scale + cy;

      const pred = predict(p.x);
      const error = Math.abs(p.y - pred);
      const isSV = error > params.epsilon * 0.95;

      ctx.beginPath();
      ctx.arc(px, py, isSV ? 6 : 4, 0, Math.PI * 2);

      ctx.fillStyle = isSV ? "#dc2626" : "#64748b"; // red-600 / slate-500
      ctx.fill();

      if (isSV) {
        ctx.strokeStyle = "rgba(220,38,38,0.35)";
        ctx.beginPath();
        ctx.moveTo(px, py);
        const tubeY =
          p.y > pred ? pred + params.epsilon : pred - params.epsilon;
        ctx.lineTo(px, -tubeY * scale + cy);
        ctx.stroke();
      }
    });
  }, [points, params.epsilon, predict]);

  // Loop
  useEffect(() => {
    const loop = () => {
      trainStep();
      draw();
      animFrame.current = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(animFrame.current);
  }, [trainStep, draw]);

  // Handlers
  const handleAddPoint = (e: React.MouseEvent) => {
    // Ignore right clicks for context menu
    if (e.button === 2) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - canvas.width / 2) / (canvas.width / 2.5);
    const y =
      -(e.clientY - rect.top - canvas.height / 2) / (canvas.height / 2.5);

    setPoints((prev) => [...prev, { x, y }]);
    alphas.current.push(0);
  };

  const handleReset = () => {
    const newPoints = [];
    for (let x = -0.8; x <= 0.8; x += 0.15) {
      newPoints.push({ x, y: Math.sin(x * 3.5) * 0.6 });
    }
    setPoints(newPoints);
    alphas.current = new Array(newPoints.length).fill(0);
    bias.current = 0;
  };

  const handleClear = () => {
    setPoints([]);
    alphas.current = [];
    bias.current = 0;
  };

  useEffect(() => {
    if (points.length === 0) handleReset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset Model when Kernel Changes
  useEffect(() => {
    alphas.current = new Array(points.length).fill(0);
    bias.current = 0;
  }, [params.kernel, params.degree, points.length]);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header (FULL WIDTH) */}
      <SimHeader
        title="Support Vector Regression (SVR)"
        subtitle="Understanding ε-insensitive loss, kernels, and support vectors through visualization"
      />

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Canvas Section */}
        <div className="flex-1 min-w-0">
          <Card className="border-slate-800">
            <div className="flex justify-center overflow-hidden rounded-lg">
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="w-full max-w-200 cursor-crosshair bg-white"
                onMouseDown={handleAddPoint}
                onContextMenu={(e) => e.preventDefault()}
              />
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-6 p-2 text-xs font-mono text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                Support Vector
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-500" />
                Ignored Point
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Prediction
              </div>
            </div>
          </Card>
        </div>

        {/* Controls */}
        <Card className="w-full lg:w-96 shrink-0">
          <CardHeader>
            <CardTitle>SVR Playground</CardTitle>
            <CardDescription>
              Support Vector Regression with SGD
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Kernel */}
            <div className="space-y-2">
              <Label>Kernel Type</Label>
              <Select
                value={params.kernel}
                onValueChange={(v: "rbf" | "poly" | "linear") =>
                  setParams({ ...params, kernel: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rbf">RBF (Radial Basis)</SelectItem>
                  <SelectItem value="poly">Polynomial</SelectItem>
                  <SelectItem value="linear">Linear</SelectItem>
                </SelectContent>
              </Select>

              <p className="text-xs text-muted-foreground">
                {params.kernel === "rbf" &&
                  "Localized curves. Good for wiggly data."}
                {params.kernel === "poly" && "Wide arcs. Good for curves."}
                {params.kernel === "linear" && "Straight line."}
              </p>
            </div>

            {/* Kernel Params */}
            {params.kernel === "rbf" && (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <Label>Gamma</Label>
                  <span>{params.gamma}</span>
                </div>
                <Slider
                  min={0.1}
                  max={10}
                  step={0.1}
                  value={[params.gamma]}
                  onValueChange={([v]) => setParams({ ...params, gamma: v })}
                />
              </div>
            )}

            {params.kernel === "poly" && (
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <Label>Degree</Label>
                  <span>{params.degree}</span>
                </div>
                <Slider
                  min={2}
                  max={5}
                  step={1}
                  value={[params.degree]}
                  onValueChange={([v]) => setParams({ ...params, degree: v })}
                />

                <div className="flex justify-between text-sm">
                  <Label>Coeff</Label>
                  <span>{params.coeff}</span>
                </div>
                <Slider
                  min={0}
                  max={5}
                  step={0.5}
                  value={[params.coeff]}
                  onValueChange={([v]) => setParams({ ...params, coeff: v })}
                />
              </div>
            )}

            {/* Global Params */}
            <div className="space-y-3 border-t pt-4">
              <div className="flex justify-between text-sm">
                <Label>Epsilon</Label>
                <span>{params.epsilon}</span>
              </div>
              <Slider
                min={0.01}
                max={0.5}
                step={0.01}
                value={[params.epsilon]}
                onValueChange={([v]) => setParams({ ...params, epsilon: v })}
              />

              <div className="flex justify-between text-sm">
                <Label>C</Label>
                <span>{params.C}</span>
              </div>
              <Slider
                min={1}
                max={100}
                step={1}
                value={[params.C]}
                onValueChange={([v]) => setParams({ ...params, C: v })}
              />

              <div className="flex justify-between text-sm">
                <Label>Learning Rate</Label>
                <span>{params.lr}</span>
              </div>
              <Slider
                min={0.001}
                max={0.1}
                step={0.001}
                value={[params.lr]}
                onValueChange={([v]) => setParams({ ...params, lr: v })}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleReset}
              >
                Reset
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleClear}
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
