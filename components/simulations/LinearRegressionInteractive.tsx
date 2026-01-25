/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState } from "react";
import SimHeader from "../common/sim-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Point = { x: number; y: number };

export default function LinearRegressionInteractive() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [stats, setStats] = useState({ m: 0, b: 0, r: 0 });

  // Constants
  const width = 700;
  const height = 400;
  const colors = {
    background: '#ffffff',
    grid: "#f1f5f9", // Tailwind slate-100
    destructive: "#ef4444", // Tailwind red-500
    primary: "#2563eb", // Tailwind blue-600
  };

  // --- Math ---
  const calculateRegression = (pts: Point[]) => {
    const n = pts.length;
    if (n < 2) return { m: 0, b: 0, r: 0 };

    let sumX = 0,
      sumY = 0,
      sumXY = 0,
      sumX2 = 0,
      sumY2 = 0;

    for (const p of pts) {
      sumX += p.x;
      sumY += p.y;
      sumXY += p.x * p.y;
      sumX2 += p.x * p.x;
      sumY2 += p.y * p.y;
    }

    const numeratorM = n * sumXY - sumX * sumY;
    const denominatorM = n * sumX2 - sumX * sumX;
    const m = denominatorM === 0 ? 0 : numeratorM / denominatorM;

    const b = (sumY - m * sumX) / n;

    const numeratorR = n * sumXY - sumX * sumY;
    const denominatorR = Math.sqrt(
      (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY),
    );
    const r = denominatorR === 0 ? 0 : numeratorR / denominatorR;

    return { m, b, r };
  };

  // --- Handlers ---
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Flip Y for storage (Cartesian)
    setPoints([...points, { x, y: height - y }]);
  };

  const clearPoints = () => setPoints([]);

  const generateRandom = () => {
    const newPoints = [];
    for (let i = 0; i < 10; i++) {
      const rx = Math.random() * width;
      let ry = rx * 0.5 + Math.random() * 100;
      if (ry > height) ry = height - 10;
      newPoints.push({ x: rx, y: ry });
    }
    setPoints([...points, ...newPoints]);
  };

  // --- Drawing ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear and Draw Grid
    ctx.fillStyle = colors.background; // Always white background
    ctx.fillRect(0, 0, width, height);

    // Draw Grid Pattern (manually or via css, here we do canvas)
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

    const { m, b, r } = calculateRegression(points);
    setStats({ m, b, r });

    if (points.length >= 2) {
      // Draw Residuals (fixed destructive color)
      ctx.strokeStyle = colors.destructive; 
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      for (const p of points) {
        const predictedY = m * p.x + b;
        const actualY = p.y;
        ctx.beginPath();
        ctx.moveTo(p.x, height - actualY);
        ctx.lineTo(p.x, height - predictedY);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Draw Regression Line (fixed primary color)
      ctx.strokeStyle = colors.primary; 
      ctx.lineWidth = 3;
      const y1 = m * 0 + b;
      const y2 = m * width + b;
      ctx.beginPath();
      ctx.moveTo(0, height - y1);
      ctx.lineTo(width, height - y2);
      ctx.stroke();
    }

    // Draw Points (fixed primary color)
    ctx.fillStyle = colors.primary; 
    for (const p of points) {
      ctx.beginPath();
      ctx.arc(p.x, height - p.y, 6, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [points]);

  return (
    <div className="flex flex-col gap-6 mb-8 items-center w-full max-w-5xl mx-auto">
      <SimHeader
        title="Linear Regression Interactive"
        subtitle="Ordinary Least Squares (OLS) visualization."
      />

      <Card className="w-full">
        <CardContent className="p-6">
          {/* Stats Panel */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 bg-muted/50 p-4 rounded-lg">
            <div className="text-center">
              <div className="text-xl font-bold font-mono text-foreground">
                {stats.m.toFixed(3)}
              </div>
              <div className="text-xs text-muted-foreground uppercase">
                Slope (m)
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold font-mono text-foreground">
                {stats.b.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground uppercase">
                Y-Intercept (b)
              </div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold font-mono text-foreground">
                {stats.r.toFixed(3)}
              </div>
              <div className="text-xs text-muted-foreground uppercase">
                Correlation (r)
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold font-mono text-primary truncate">
                y = {stats.m.toFixed(2)}x {stats.b >= 0 ? "+" : "-"}{" "}
                {Math.abs(stats.b).toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground uppercase">
                Equation
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="relative border-2 border-muted rounded-lg overflow-hidden bg-white cursor-crosshair mb-6 flex justify-center">
            <canvas
              ref={canvasRef}
              width={700}
              height={400}
              onMouseDown={handleCanvasClick}
              className="w-full max-w-175"
            />
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <Button onClick={clearPoints} variant="secondary">
              Reset Canvas
            </Button>
            <Button onClick={generateRandom}>Add Random Data</Button>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-4">
            Click anywhere on the grid to add data points manually.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
