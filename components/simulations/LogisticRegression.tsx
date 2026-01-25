"use client";

import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import SimHeader from "../common/sim-header"; 
import { Slider } from "@/components/ui/slider";

export default function LogisticRegression() {
  const [hours, setHours] = useState(5.0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Model Coefficients (trained)
  const b0 = -4;
  const b1 = 0.8;

  const colors = {
    background: '#ffffff',
    gridLine: "#eee",
    curve: "#3498db", // blue
    success: "#2ecc71", // green
    destructive: "#e74c3c", // red
    dotOutline: "#fff",
  };

  // Math
  const sigmoid = (z: number) => 1 / (1 + Math.exp(-z));

  // Computed values
  const z = b0 + b1 * hours;
  const probability = sigmoid(z);
  const probPercent = (probability * 100).toFixed(1);
  const isPass = probability >= 0.5;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, width, height);

    // Draw Grid (50% line)
    ctx.strokeStyle = colors.gridLine;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    // Draw S-Curve
    ctx.beginPath();
    ctx.lineWidth = 3; 
    ctx.strokeStyle = colors.curve;
    for (let x = 0; x <= 10; x += 0.1) {
      const zVal = b0 + b1 * x;
      const yVal = sigmoid(zVal);

      const px = (x / 10) * width;
      const py = height - yVal * height;

      if (x === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke(); 

    // Draw Current User Dot (fixed colors)
    const dotX = (hours / 10) * width;
    const dotY = height - probability * height;

    ctx.beginPath();
    ctx.arc(dotX, dotY, 8, 0, 2 * Math.PI);
    ctx.fillStyle = isPass ? colors.success : colors.destructive;
    ctx.fill();
    ctx.strokeStyle = colors.dotOutline;
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [hours, probability, isPass, b0]); // Dependencies: removed colors, as they are now static

  return (
    <div className="flex flex-col gap-6 mb-8 items-center w-full max-w-5xl mx-auto">
      <SimHeader
        title="Logistic Regression"
        subtitle="An interactive visualization of binary classification and decision boundaries"
      />

      <Card className="max-w-5xl w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Will You Pass?</CardTitle>
          <CardDescription>
            Move the slider to see how <strong>Logistic Regression</strong>{" "}
            calculates probability.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="text-sm font-medium">Hours Studied</label>
              <span className="text-2xl font-bold text-primary">
                {hours.toFixed(1)}
              </span>
            </div>
            <Slider
              min={0}
              max={10}
              step={0.1}
              value={[hours]}
              onValueChange={([val]) => setHours(val)}
            />
          </div>

          {/* Visual Result */}
          <div
            className={`text-center py-6 text-2xl font-bold rounded-lg transition-colors text-white shadow-md ${
              isPass
                ? "bg-green-500 shadow-green-500/20"
                : "bg-red-500 shadow-red-500/20"
            }`}
          >
            {isPass ? "PASS" : "FAIL"}
          </div>

          {/* Explanation */}
          <div className="bg-muted/50 p-4 rounded-lg text-sm space-y-4">
            <div>
              <div className="font-semibold mb-1">
                1. The Prediction (Sigmoid)
              </div>
              <div className="flex justify-between mb-1">
                <span>Probability:</span>
                <span className="font-mono font-bold">{probPercent}%</span>
              </div>
              {/* Bar Component */}
              <div className="relative h-4 bg-muted rounded-full overflow-hidden">
                <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-foreground/20 z-10" />
                <div
                  className={`h-full transition-all duration-300 ${isPass ? "bg-green-500" : "bg-red-500"}`}
                  style={{ width: `${probPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0% (Fail)</span>
                <span>Threshold (50%)</span>
                <span>100% (Pass)</span>
              </div>
            </div>

            <div className="pt-2 border-t">
              <div className="font-semibold mb-1">2. The Decision</div>
              <p className="text-muted-foreground">
                {isPass
                  ? "Probability ≥ 50%. Model predicts Class 1 (Pass)."
                  : "Probability < 50%. Model predicts Class 0 (Fail)."}
              </p>
            </div>
          </div>

          {/* Canvas Graph */}
          <div className="flex justify-center border rounded-lg p-4 bg-white">
            <canvas
              ref={canvasRef}
              width={500}
              height={150}
              className="w-full max-w-125"
            />
          </div>
          <p className="text-xs text-center text-muted-foreground">
            The blue curve represents the logistic regression model.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
