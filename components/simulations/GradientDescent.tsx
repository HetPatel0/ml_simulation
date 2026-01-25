"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import SimHeader from "@/components/common/sim-header";
import { useResponsiveCanvas } from "@/lib/use-responsive-canvas";

export default function GradientDescent() {
  const [currentX, setCurrentX] = useState(-4);
  const [startPos, setStartPos] = useState(-4);
  const [learningRate, setLearningRate] = useState(0.1);
  const [iteration, setIteration] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const { containerRef, canvasRef, size } = useResponsiveCanvas({
    maxWidth: 700,
    aspectRatio: 3 / 2,
  });

  const colors = {
    background: '#ffffff',
    foreground: '#000000',
    primary: '#2563eb', // blue-600
    accent: '#7c3aed', // violet-600
    destructive: '#dc2626', // red-600
    success: '#16a34a', // green-600
  };

  const f = (x: number) => x * x;
  const df = (x: number) => 2 * x;

  const scaleX = 40;
  const scaleY = 40;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height - 48;

    const toX = (x: number) => centerX + x * scaleX;
    const toY = (y: number) => centerY - y * scaleY;

    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = colors.foreground;
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 2;

    const start = -centerX / scaleX;
    const end = (canvas.width - centerX) / scaleX;

    for (let x = start; x <= end; x += 0.1) {
      const y = f(x);

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      x === start ? ctx.moveTo(toX(x), toY(y)) : ctx.lineTo(toX(x), toY(y));
    }
    ctx.stroke();

    ctx.fillStyle = colors.primary;
    ctx.globalAlpha = 0.25;

    history.forEach((x) => {
      ctx.beginPath();
      ctx.arc(toX(x), toY(f(x)), 4, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;

    const slope = df(currentX);
    ctx.setLineDash([6, 6]);
    ctx.strokeStyle = colors.accent;
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(toX(currentX - 0.5), toY(f(currentX) - slope * 0.5));
    ctx.lineTo(toX(currentX + 0.5), toY(f(currentX) + slope * 0.5));
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.arc(toX(currentX), toY(f(currentX)), 8, 0, Math.PI * 2);
    ctx.fillStyle = colors.destructive;
    ctx.fill();

    ctx.strokeStyle = colors.background;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(toX(0), toY(0), 5, 0, Math.PI * 2);
    ctx.fillStyle = colors.success;
    ctx.fill();
  }, [currentX, history, size]);

  useEffect(() => {
    draw();
  }, [draw]);

  const step = useCallback(() => {
    setCurrentX((x) => {
      if (Math.abs(x) > 50 || Math.abs(x) < 0.001) {
        setIsRunning(false);
        return x;
      }

      setHistory((h) => [...h, x]);
      setIteration((i) => i + 1);

      return x - learningRate * df(x);
    });
  }, [learningRate]);

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(step, 200);
    return () => clearInterval(id);
  }, [isRunning, step]);

  const reset = () => {
    setIsRunning(false);
    setCurrentX(startPos);
    setIteration(0);
    setHistory([]);
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 mb-10">
      <SimHeader
        title="Gradient Descent"
        subtitle=<>
          Visualize how gradient descent optimization finds the minimum
        </>
      />

      <div className="flex flex-col gap-6 lg:flex-row">
        <Card className="flex flex-1 items-center justify-center p-4">
          <div ref={containerRef} className="w-full max-w-2xl">
            <canvas
              ref={canvasRef}
              width={size.width}
              height={size.height}
              className="w-full rounded-lg border"
            />
          </div>
        </Card>

        <Card className="w-full lg:w-80">
          <CardHeader>
            <CardTitle>Controls</CardTitle>
            <CardDescription>
              Tune parameters and observe convergence
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Start Position */}
            <div className="rounded-md bg-muted/50 p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Starting X</span>
                <span className="font-semibold text-primary">{startPos}</span>
              </div>
              <input
                type="range"
                min="-5"
                max="5"
                step="0.1"
                value={startPos}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  setStartPos(v);
                  setCurrentX(v);
                  setIteration(0);
                  setHistory([]);
                  setIsRunning(false);
                }}
                className="w-full"
              />
            </div>

            {/* Learning Rate */}
            <div className="rounded-md bg-muted/50 p-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Learning Rate</span>
                <span className="font-semibold text-primary">
                  {learningRate}
                </span>
              </div>
              <input
                type="range"
                min="0.01"
                max="1.1"
                step="0.01"
                value={learningRate}
                onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Higher values may diverge
              </p>
            </div>

            {/* Stats */}
            <div className="rounded-md border bg-card p-3 font-mono text-sm space-y-1">
              <div className="flex justify-between">
                <span>Iteration</span>
                <span>{iteration}</span>
              </div>
              <div className="flex justify-between">
                <span>X</span>
                <span>{currentX.toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span>Gradient</span>
                <span>{df(currentX).toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span>Cost</span>
                <span>{f(currentX).toFixed(4)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" onClick={step} disabled={isRunning}>
                Step
              </Button>
              <Button
                onClick={() => setIsRunning((r) => !r)}
                variant={isRunning ? "secondary" : "default"}
              >
                {isRunning ? "Stop" : "Auto Run"}
              </Button>
            </div>

            <Button variant="destructive" onClick={reset}>
              Reset
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
