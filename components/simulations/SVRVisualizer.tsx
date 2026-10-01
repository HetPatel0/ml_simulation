/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useResponsiveCanvas } from "@/lib/use-responsive-canvas";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import SimHeader from "./sim-header";

type KernelType = "rbf" | "poly" | "linear";

type Point = {
  x: number;
  y: number;
};

export default function SVRVisualizer() {
  const { containerRef, canvasRef, size } = useResponsiveCanvas({
    maxWidth: 700,
    aspectRatio: 16 / 10,
    minHeight: 320,
  });

  /* ---------- Persistent model state ---------- */
  const pointsRef = useRef<Point[]>([]);
  const alphasRef = useRef<number[]>([]);
  const biasRef = useRef(0);

  /* ---------- UI state ---------- */
  const [kernel, setKernel] = useState<KernelType>("rbf");
  const [gamma, setGamma] = useState(3);
  const [degree, setDegree] = useState(2);
  const [coeff, setCoeff] = useState(1);
  const [epsilon, setEpsilon] = useState(0.1);
  const [C, setC] = useState(10);
  const [lr, setLr] = useState(0.01);

  /* ---------- Kernel ---------- */
  const kernelFn = useCallback(
    (x1: number, x2: number) => {
      if (kernel === "linear") return x1 * x2;
      if (kernel === "poly") return Math.pow(x1 * x2 + coeff, degree);
      const d = x1 - x2;
      return Math.exp(-gamma * d * d);
    },
    [kernel, gamma, degree, coeff],
  );

  const predict = useCallback(
    (x: number) => {
      let sum = biasRef.current;
      pointsRef.current.forEach((p, i) => {
        sum += alphasRef.current[i] * kernelFn(x, p.x);
      });
      return sum;
    },
    [kernelFn],
  );

  /* ---------- Training ---------- */
  const trainStep = useCallback(() => {
    const pts = pointsRef.current;
    if (!pts.length) return;

    for (let k = 0; k < 40; k++) {
      const i = Math.floor(Math.random() * pts.length);
      const p = pts[i];

      const err = p.y - predict(p.x);
      if (Math.abs(err) > epsilon) {
        const sign = Math.sign(err);
        let update = lr * C * sign;
        update = Math.max(-0.5, Math.min(0.5, update));

        alphasRef.current[i] += update;
        biasRef.current += update * 0.5;
      }

      alphasRef.current[i] *= 0.999;
    }
  }, [predict, epsilon, C, lr]);

  /* ---------- Draw ---------- */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { width, height } = size;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;
    const scale = width / 2.5;

    // Epsilon tube
    ctx.fillStyle = "rgba(37, 99, 235, 0.12)";
    ctx.beginPath();
    for (let i = 0; i <= width; i += 4) {
      const x = (i - cx) / scale;
      const y = predict(x) + epsilon;
      ctx.lineTo(i, -y * scale + cy);
    }
    for (let i = width; i >= 0; i -= 4) {
      const x = (i - cx) / scale;
      const y = predict(x) - epsilon;
      ctx.lineTo(i, -y * scale + cy);
    }
    ctx.closePath();
    ctx.fill();

    // Prediction curve
    ctx.strokeStyle = "#2563eb";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= width; i += 4) {
      const x = (i - cx) / scale;
      const y = predict(x);
      ctx.lineTo(i, -y * scale + cy);
    }
    ctx.stroke();

    // Points
    pointsRef.current.forEach((p) => {
      const px = p.x * scale + cx;
      const py = -p.y * scale + cy;
      const err = Math.abs(p.y - predict(p.x));

      ctx.beginPath();
      ctx.arc(px, py, err > epsilon ? 6 : 4, 0, Math.PI * 2);
      ctx.fillStyle = err > epsilon ? "#dc2626" : "#6b7280";
      ctx.fill();
    });

    trainStep();
  }, [size, predict, epsilon, trainStep]);

  /* ---------- Init (ONCE) ---------- */
  useEffect(() => {
    pointsRef.current = [];
    for (let x = -0.8; x <= 0.8; x += 0.15) {
      pointsRef.current.push({ x, y: Math.sin(x * 3.5) * 0.6 });
    }
    alphasRef.current = new Array(pointsRef.current.length).fill(0);
    biasRef.current = 0;
  }, []);

  /* ---------- Animation loop ---------- */
  useEffect(() => {
    let rafId: number;

    const loop = () => {
      draw();
      rafId = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(rafId);
  }, [draw]);

  /* ---------- Interaction: drag to move, right-click to delete ---------- */
  const dragIdxRef = useRef<number | null>(null);

  /** Client coords -> canvas pixels (canvas is w-full, may be CSS-stretched). */
  const toCanvasPx = (e: { clientX: number; clientY: number; currentTarget: HTMLCanvasElement }) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      px: (e.clientX - rect.left) * (size.width / rect.width),
      py: (e.clientY - rect.top) * (size.height / rect.height),
      cssScale: size.width / rect.width,
    };
  };

  const dataFromPx = (px: number, py: number) => {
    const scale = size.width / 2.5;
    return { x: (px - size.width / 2) / scale, y: -(py - size.height / 2) / scale };
  };

  /** Index of point within grab radius, else null. */
  const nearPoint = (px: number, py: number, cssScale: number) => {
    const scale = size.width / 2.5;
    const radius = 14 * cssScale;
    for (let i = pointsRef.current.length - 1; i >= 0; i--) {
      const p = pointsRef.current[i];
      const qx = p.x * scale + size.width / 2;
      const qy = -p.y * scale + size.height / 2;
      if (Math.hypot(qx - px, qy - py) <= radius) return i;
    }
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button === 2) return; // right-click handled by onContextMenu
    const { px, py, cssScale } = toCanvasPx(e);
    const idx = nearPoint(px, py, cssScale);
    if (idx !== null) {
      dragIdxRef.current = idx; // hold and move existing point
    } else {
      const { x, y } = dataFromPx(px, py);
      pointsRef.current.push({ x, y });
      alphasRef.current.push(0);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const drag = dragIdxRef.current;
    if (drag === null) return;
    const { px, py } = toCanvasPx(e);
    pointsRef.current[drag] = dataFromPx(px, py);
  };

  const endDrag = () => {
    dragIdxRef.current = null;
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // suppress browser menu
    const { px, py, cssScale } = toCanvasPx(e);
    const idx = nearPoint(px, py, cssScale);
    if (idx !== null) {
      pointsRef.current.splice(idx, 1);
      alphasRef.current.splice(idx, 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const t = e.touches[0];
    const { px, py, cssScale } = toCanvasPx({
      clientX: t.clientX,
      clientY: t.clientY,
      currentTarget: e.currentTarget,
    });
    const idx = nearPoint(px, py, cssScale);
    if (idx !== null) dragIdxRef.current = idx;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const drag = dragIdxRef.current;
    if (drag === null) return;
    const t = e.touches[0];
    const { px, py } = toCanvasPx({
      clientX: t.clientX,
      clientY: t.clientY,
      currentTarget: e.currentTarget,
    });
    pointsRef.current[drag] = dataFromPx(px, py);
  };

  /* ---------- UI ---------- */
  return (
    <div className="flex flex-col gap-6 mb-8 w-full max-w-5xl mx-auto">
      <SimHeader
        title="SVR: Visualizing the Regression Kernel"
        subtitle="Understanding epsilon-insensitive regression with kernels."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="flex min-w-0 flex-1 items-center justify-center p-4">
          <div ref={containerRef} className="w-full">
            <canvas
              ref={canvasRef}
              width={size.width}
              height={size.height}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={endDrag}
              onMouseLeave={endDrag}
              onContextMenu={handleContextMenu}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={endDrag}
              className="w-full rounded-lg border bg-white cursor-crosshair touch-none"
            />
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Click to add · drag a point to move it · right-click a point to delete it
            </p>
          </div>
        </Card>

        <Card className="p-4 space-y-5">
          <div className="space-y-2">
            <Label>Kernel</Label>
            <Select
              value={kernel}
              onValueChange={(v) => setKernel(v as KernelType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rbf">RBF</SelectItem>
                <SelectItem value="poly">Polynomial</SelectItem>
                <SelectItem value="linear">Linear</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {kernel === "rbf" && (
            <SliderBlock
              label="Gamma"
              value={gamma}
              setValue={setGamma}
              min={0.1}
              max={10}
              step={0.1}
            />
          )}

          {kernel === "poly" && (
            <>
              <SliderBlock
                label="Degree"
                value={degree}
                setValue={setDegree}
                min={2}
                max={5}
                step={1}
              />
              <SliderBlock
                label="Coeff"
                value={coeff}
                setValue={setCoeff}
                min={0}
                max={5}
                step={0.5}
              />
            </>
          )}

          <SliderBlock
            label="Epsilon"
            value={epsilon}
            setValue={setEpsilon}
            min={0.01}
            max={0.5}
            step={0.01}
          />
          <SliderBlock
            label="C"
            value={C}
            setValue={setC}
            min={1}
            max={100}
            step={1}
          />
          <SliderBlock
            label="Learning Rate"
            value={lr}
            setValue={setLr}
            min={0.001}
            max={0.1}
            step={0.001}
          />

          <Button
            variant="destructive"
            onClick={() => {
              pointsRef.current = [];
              alphasRef.current = [];
              biasRef.current = 0;
            }}
            className="cursor-pointer"
          >
            Clear Points
          </Button>
        </Card>
      </div>
    </div>
  );
}

/* ---------- Slider helper ---------- */
function SliderBlock({
  label,
  value,
  setValue,
  min,
  max,
  step,
}: {
  label: string;
  value: number;
  setValue: (v: number) => void;
  min: number;
  max: number;
  step: number;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <Label>{label}</Label>
        <span className="font-mono text-muted-foreground">{value}</span>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(v) => setValue(v[0])}
      />
    </div>
  );
}