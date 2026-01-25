/* eslint-disable prefer-const */
"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import SimHeader from "../common/sim-header";
import { Slider } from "@/components/ui/slider";
import { useResponsiveCanvas } from "@/lib/use-responsive-canvas";

export default function LogisticFunctionVisualizer() {
  const { containerRef, canvasRef, size } = useResponsiveCanvas({
    maxWidth: 600,
    aspectRatio: 12 / 7,
  });

  // State for Weight (slope) and Bias (shift)
  const [w, setW] = useState(1.0);
  const [b, setB] = useState(0.0);
  const colors = {
    background: '#ffffff',
    gridLine: "#e0e0e0", // Light gray
    gridText: "#666",    // Dark gray
    axisLine: "#aaa",    // Medium gray
    primaryCurve: "#3498db", // Blue
  };

  const sigmoid = (x: number, weight: number, bias: number) => {
    const z = weight * x + bias;
    return 1 / (1 + Math.exp(-z));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = size.width;
    const height = size.height;
    const padding = 40;
    const minX = -10;
    const maxX = 10;

    // Coordinate mapping
    const toPixelX = (logicalX: number) => {
      const range = maxX - minX;
      const plotWidth = width - 2 * padding;
      return padding + ((logicalX - minX) / range) * plotWidth;
    };

    const toPixelY = (logicalY: number) => {
      const plotHeight = height - 2 * padding;
      return height - padding - logicalY * plotHeight;
    };

    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, width, height);

    // --- Draw Grid & Axes ---
    ctx.strokeStyle = colors.gridLine;
    ctx.lineWidth = 1;
    ctx.font = "12px Arial";
    ctx.fillStyle = colors.gridText;
    ctx.textAlign = "center";

    // Y-axis lines
    [0, 0.5, 1.0].forEach((yLog) => {
      let yPix = toPixelY(yLog);
      ctx.beginPath();
      ctx.moveTo(padding, yPix);
      ctx.lineTo(width - padding, yPix);
      if (yLog === 0.5) {
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = colors.gridLine;
      } else {
        ctx.setLineDash([]);
        ctx.strokeStyle = colors.gridLine;
      }
      ctx.stroke();
      ctx.fillText(yLog.toFixed(1), padding - 15, yPix + 4);
    });

    // Center Axes
    ctx.beginPath();
    ctx.moveTo(padding, toPixelY(0));
    ctx.lineTo(width - padding, toPixelY(0));
    ctx.strokeStyle = colors.axisLine;
    ctx.setLineDash([]);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(toPixelX(0), padding);
    ctx.lineTo(toPixelX(0), height - padding);
    ctx.stroke();

    // X-axis Labels
    for (let i = minX; i <= maxX; i += 2) {
      ctx.fillText(i.toString(), toPixelX(i), height - padding + 20);
    }
    ctx.fillText("Input X", width / 2, height - 5);

    // Y Label (Rotated)
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("Probability", 0, 0);
    ctx.restore();

    // --- Draw Curve ---
    ctx.beginPath();
    ctx.lineWidth = 4; 
    ctx.strokeStyle = colors.primaryCurve;
    ctx.lineCap = "round";

    let firstPoint = true;
    for (let lx = minX; lx <= maxX; lx += 0.1) {
      const ly = sigmoid(lx, w, b);
      const px = toPixelX(lx);
      const py = toPixelY(ly);

      if (firstPoint) {
        ctx.moveTo(px, py);
        firstPoint = false;
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();
  }, [w, b, size]);

  return (
    <div className="flex flex-col gap-6 mb-8 items-center w-full max-w-5xl mx-auto">
      <SimHeader
        title="Logistic Function Visualizer"
        subtitle="Understand how Weight (w) and Bias (b) shape the S-curve."
      />

      <Card className="w-full">
        <CardContent className="space-y-6 pt-6">
          {/* Controls */}
          <div className="bg-muted/50 p-6 rounded-xl border space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between font-semibold">
                <label>Weight / Steepness (w)</label>
                <span className="text-primary font-mono">{w.toFixed(1)}</span>
              </div>
              <Slider
                min={-5}
                max={5}
                step={0.1}
                value={[w]}
                onValueChange={([val]) => setW(val)}
              />
              <p className="text-xs text-muted-foreground">
                Controls how fast the probability changes.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between font-semibold">
                <label>Bias / Horizontal Shift (b)</label>
                <span className="text-primary font-mono">{b.toFixed(1)}</span>
              </div>
              <Slider
                min={-10}
                max={10}
                step={0.1}
                value={[b]}
                onValueChange={([val]) => setB(val)}
              />
              <p className="text-xs text-muted-foreground">
                Moves the center point left or right.
              </p>
            </div>
          </div>

          {/* Formula Display */}
          <div className="font-mono bg-muted/50 p-4 rounded border-l-4 border-primary text-center text-sm md:text-base">
            Probability = 1 / (1 + e
            <sup>
              -({w < 0 ? "(" : ""}
              {w.toFixed(1)}
              {w < 0 ? ")" : ""}x{" "}
              {b < 0 ? "- " + Math.abs(b).toFixed(1) : "+ " + b.toFixed(1)})
            </sup>
            )
          </div>

          {/* Canvas */}
          <div ref={containerRef} className="border rounded-lg bg-white p-2 overflow-hidden">
            <canvas
              ref={canvasRef}
              width={size.width}
              height={size.height}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
