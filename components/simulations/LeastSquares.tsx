"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SimHeader from "../common/sim-header";

interface Point {
  x: number;
  y: number;
}

export default function LeastSquares() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [stats, setStats] = useState({ m: 0, b: 0, r: 0 });

  const width = 700;
  const height = 400;

  const colors = {
    background: '#ffffff',
    grid: "#e2e8f0", // Light gray
    destructive: "#ef4444", // Red-500
    primary: "#2563eb", // Blue-600
  };

  // Regression Logic
  const calculateRegression = useCallback(() => {
    const n = points.length;
    if (n < 2) return { m: 0, b: 0, r: 0 };

    let sumX = 0,
      sumY = 0,
      sumXY = 0,
      sumX2 = 0,
      sumY2 = 0;

    for (const p of points) {
      sumX += p.x;
      sumY += p.y;
      sumXY += p.x * p.y;
      sumX2 += p.x * p.x;
      sumY2 += p.y * p.y;
    }

    // Slope (m)
    const numeratorM = n * sumXY - sumX * sumY;
    const denominatorM = n * sumX2 - sumX * sumX;
    const m = denominatorM === 0 ? 0 : numeratorM / denominatorM;

    // Intercept (b)
    const b = (sumY - m * sumX) / n;

    // Correlation (r)
    const numeratorR = n * sumXY - sumX * sumY;
    const denominatorR = Math.sqrt(
      (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY),
    );
    const r = denominatorR === 0 ? 0 : numeratorR / denominatorR;

    return { m, b, r };
  }, [points]);

  // Drawing Logic
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { m, b } = stats;

    // Clear
    ctx.fillStyle = colors.background; // Always white
    ctx.fillRect(0, 0, width, height);

    // Draw Grid
    ctx.strokeStyle = colors.grid; // Fixed grid color
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let i = 0; i < height; i += 20) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    // Draw Residuals (if enough data)
    if (points.length >= 2) {
      ctx.strokeStyle = colors.destructive; // Fixed destructive color
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);

      points.forEach((p) => {
        const predictedY = m * p.x + b;
        // In canvas coords
        const renderX = p.x;
        const renderActualY = height - p.y;
        const renderPredictedY = height - predictedY;

        ctx.beginPath();
        ctx.moveTo(renderX, renderActualY);
        ctx.lineTo(renderX, renderPredictedY);
        ctx.stroke();
      });
      ctx.setLineDash([]);
    }

    // Draw Line of Best Fit
    if (points.length >= 2) {
      ctx.strokeStyle = colors.primary; // Fixed primary color
      ctx.lineWidth = 3;
      ctx.beginPath();

      const y1 = m * 0 + b;
      const y2 = m * width + b;

      ctx.moveTo(0, height - y1);
      ctx.lineTo(width, height - y2);
      ctx.stroke();
    }

    // Draw Points
    ctx.fillStyle = colors.primary; // Fixed primary color
    points.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, height - p.y, 6, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [points, stats, width, height]);

  useEffect(() => {
    setStats(calculateRegression());
  }, [calculateRegression]);

  useEffect(() => {
    draw();
  }, [draw, stats]); // Re-draw when stats fully updated

  // Interaction Handlers
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    // Coordinate relative to canvas element
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;

    // Scale for actual canvas size vs display size if responsive (simple approach here assume 1:1 or use offset)
    // Actually getting raw pixels if canvas size matches display size.
    // We should account for scaling if CSS resizes it, but assuming fixed internal dimensions for simulation logic logic:
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = rawX * scaleX;
    const y = rawY * scaleY;

    // Logical Y is flipped
    const logicalY = height - y;

    setPoints((prev) => [...prev, { x, y: logicalY }]);
  };

  const handleReset = () => {
    setPoints([]);
  };

  const handleRandom = () => {
    const newPoints: Point[] = [];
    for (let i = 0; i < 10; i++) {
      const rx = Math.random() * width;
      // Linear-ish trend with noise
      let ry = rx * 0.5 + Math.random() * 100;
      if (ry > height) ry = height - 10;
      newPoints.push({ x: rx, y: ry });
    }
    setPoints((prev) => [...prev, ...newPoints]);
  };

  return (
    <div className="flex flex-col gap-8 mb-10 items-center w-full max-w-5xl mx-auto">
      <SimHeader
        title={" Ordinary Least Squares"}
        subtitle={" Interactive Linear Regression Demo"}
      />
      {/* Stats Panel */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold font-mono">
              {stats.m.toFixed(3)}
            </div>
            <div className="text-sm text-muted-foreground">Slope (m)</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold font-mono">
              {stats.b.toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">Intercept (b)</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold font-mono">
              {stats.r.toFixed(3)}
            </div>
            <div className="text-sm text-muted-foreground">Correlation (r)</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-lg font-bold font-mono truncate">
              y = {stats.m.toFixed(2)}x {stats.b >= 0 ? "+" : "-"}{" "}
              {Math.abs(stats.b).toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">Equation</div>
          </CardContent>
        </Card>
      </div>
      <Card className="w-full overflow-hidden border-2 border-dashed bg-white">
        <div className="relative w-full overflow-x-auto flex justify-center bg-[url('/grid-pattern.svg')]">
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            onClick={handleCanvasClick}
            className="cursor-crosshair max-w-full" />
        </div>
      </Card>
      <p className="text-sm text-muted-foreground">
        Click anywhere on the grid to add data points manually.
      </p>
      <div className="flex gap-4">
        <Button variant="secondary" onClick={handleReset}>
          Reset Canvas
        </Button>
        <Button onClick={handleRandom}>Add Random Data</Button>
      </div>
    </div>
  );
}
