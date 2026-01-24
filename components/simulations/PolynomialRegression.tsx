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
import SimHeader from "../common/sim-header";

interface Point {
  x: number;
  y: number;
}

export default function PolynomialRegression() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [points, setPoints] = useState<Point[]>([]);
  const [degree, setDegree] = useState(3);
  const [coeffs, setCoeffs] = useState<number[]>([]);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const width = 800;
  const height = 450;
  const scale = 2.5;

  /* -------------------- Math -------------------- */
  const solve = useCallback((pts: Point[], deg: number): number[] => {
    if (pts.length === 0) return [];

    const M = deg + 1;
    const X: number[][] = [];
    const Y: number[] = [];

    pts.forEach((p) => {
      X.push(Array.from({ length: M }, (_, i) => Math.pow(p.x, i)));
      Y.push(p.y);
    });

    const transpose = (m: number[][]) => m[0].map((_, i) => m.map((r) => r[i]));
    const mult = (a: number[][], b: number[][]) =>
      a.map((r) =>
        b[0].map((_, j) => r.reduce((s, v, k) => s + v * b[k][j], 0)),
      );
    const multVec = (m: number[][], v: number[]) =>
      m.map((r) => r.reduce((s, v2, i) => s + v2 * v[i], 0));

    const XT = transpose(X);
    const A = mult(XT, X);
    const B = multVec(XT, Y);

    // Ridge stabilization
    for (let i = 0; i < M; i++) A[i][i] += 1e-5;

    // Gaussian Elimination
    const n = A.length;
    const Mtx = A.map((r, i) => [...r, B[i]]);

    for (let i = 0; i < n; i++) {
      let max = i;
      for (let k = i + 1; k < n; k++)
        if (Math.abs(Mtx[k][i]) > Math.abs(Mtx[max][i])) max = k;

      if (Math.abs(Mtx[max][i]) < 1e-12) return [];
      [Mtx[i], Mtx[max]] = [Mtx[max], Mtx[i]];

      for (let k = i + 1; k < n; k++) {
        const f = Mtx[k][i] / Mtx[i][i];
        for (let j = i; j <= n; j++) Mtx[k][j] -= f * Mtx[i][j];
      }
    }

    const res = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      let sum = 0;
      for (let j = i + 1; j < n; j++) sum += Mtx[i][j] * res[j];
      res[i] = (Mtx[i][n] - sum) / Mtx[i][i];
    }

    return res;
  }, []);

  const predict = (x: number, c: number[]) =>
    c.reduce((s, v, i) => s + v * Math.pow(x, i), 0);

  /* -------------------- Effects -------------------- */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDegree((d) => Math.min(d, Math.max(1, points.length - 1)));
    setCoeffs(solve(points, degree));
  }, [points, degree, solve]);

  /* -------------------- Drawing -------------------- */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    /* ---------- Background ---------- */
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;

    /* ---------- Axes ---------- */
    ctx.strokeStyle = "#94a3b8"; // slate-400
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, height);
    ctx.moveTo(0, cy);
    ctx.lineTo(width, cy);
    ctx.stroke();

    /* ---------- Polynomial Curve ---------- */
    if (coeffs.length) {
      ctx.strokeStyle = "#2563eb"; // blue-600
      ctx.lineWidth = 3;
      ctx.beginPath();

      let started = false;
      for (let px = 0; px <= width; px += 2) {
        const mx = (px - cx) / (width / scale);
        const my = predict(mx, coeffs);

        if (!isFinite(my) || Math.abs(my) > 5) {
          started = false;
          continue;
        }

        const py = cy - my * (height / scale);
        if (!started) {
          ctx.moveTo(px, py);
          started = true;
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.stroke();
    }

    /* ---------- Points + Residuals ---------- */
    points.forEach((p, i) => {
      const px = cx + p.x * (width / scale);
      const py = cy - p.y * (height / scale);

      const pred = predict(p.x, coeffs);
      const predPy = cy - pred * (height / scale);

      /* Residual line */
      ctx.strokeStyle = "rgba(0,0,0,0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px, predPy);
      ctx.stroke();

      /* Point */
      ctx.fillStyle = dragIdx === i ? "#1e293b" : "#dc2626"; // slate-800 / red-600
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fill();

      /* Outline for contrast */
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }, [points, coeffs, dragIdx]);

  useEffect(draw, [draw]);

  /* -------------------- Interaction -------------------- */
  const getCoords = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);

    return {
      x: (x - width / 2) / (width / scale),
      y: -(y - height / 2) / (height / scale),
    };
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if ("button" in e && e.button === 2) return;

    const m = getCoords(e);
    let idx: number | null = null;
    let min = 0.1;

    points.forEach((p, i) => {
      const d = Math.hypot(p.x - m.x, p.y - m.y);
      if (d < min) {
        min = d;
        idx = i;
      }
    });

    if (idx !== null) setDragIdx(idx);
    else
      setPoints((p) => {
        setDragIdx(p.length);
        return [...p, m];
      });
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (dragIdx === null) return;
    const m = getCoords(e);

    setPoints((p) => {
      const next = [...p];
      next[dragIdx] = {
        x: Math.max(-1.5, Math.min(1.5, m.x)),
        y: Math.max(-1.5, Math.min(1.5, m.y)),
      };
      return next;
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    const m = getCoords(e);
    setPoints((p) =>
      p.filter((pt) => Math.hypot(pt.x - m.x, pt.y - m.y) > 0.1),
    );
  };

  const reset = () => {
    setPoints(
      Array.from({ length: 9 }, (_, i) => {
        const x = -0.8 + i * 0.2;
        return { x, y: Math.sin(x * 3) * 0.5 };
      }),
    );
    setDegree(3);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!points.length) reset();
  }, [points.length]);

  /* -------------------- UI -------------------- */
  return (
    <div
      className="gap-6 max-w-5xl mx-auto "
      onMouseUp={() => setDragIdx(null)}
      onTouchEnd={() => setDragIdx(null)}
    >
      <SimHeader
        title={"Polynomial Curve Fitting"}
        subtitle={
          "How Polynomial Degrees Work and how it find perfect curve to fit accordingly "
        }
      />
      <Card className="my-10">
        <CardHeader className="text-center ">
          <CardTitle>Polynomial Curve Fitting</CardTitle>
          <CardDescription>Drag points · Right-click to delete</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="w-full bg-white rounded-lg cursor-crosshair touch-none"
            onMouseDown={handleStart}
            onMouseMove={handleMove}
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onContextMenu={handleDelete}
          />

          <input
            type="range"
            min={1}
            max={Math.max(1, points.length - 1)}
            value={degree}
            onChange={(e) => setDegree(+e.target.value)}
            className="w-full"
          />

          <div className="flex gap-2">
            <Button onClick={() => setDegree(Math.max(1, points.length - 1))}>
              Auto Fit
            </Button>
            <Button variant="secondary" onClick={reset}>
              Reset
            </Button>
            <Button variant="destructive" onClick={() => setPoints([])}>
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
