/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */

//TODO: FIX THIS Simulation
"use client";

import { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SimHeader from "../common/sim-header";
import Script from "next/script";

declare global {
  interface Window {
    Plotly: any;
  }
}

export default function KernelTrickVisualizer() {
  const plotDivRef = useRef<HTMLDivElement>(null);
  const [activeView, setActiveView] = useState<"2d" | "3d" | "plane">("2d");
  const [isLoaded, setIsLoaded] = useState(false);

  const tracesRef = useRef<any>({});
  const layoutRef = useRef<any>({});

  const initPlot = () => {
    if (!window.Plotly || !plotDivRef.current) return;

    const N_inner = 100;
    const N_outer = 150;

    let x: number[] = [];
    let y: number[] = [];
    let z_flat: number[] = [];
    let z_lifted: number[] = [];
    let colors: string[] = [];

    // Inner circle
    for (let i = 0; i < N_inner; i++) {
      const r = Math.random() * 2;
      const theta = Math.random() * 2 * Math.PI;
      const xi = r * Math.cos(theta);
      const yi = r * Math.sin(theta);
      x.push(xi);
      y.push(yi);
      z_flat.push(0);
      z_lifted.push((xi * xi + yi * yi) * 0.8);
      colors.push("#ff385f");
    }

    // Outer ring
    for (let i = 0; i < N_outer; i++) {
      const r = Math.random() * 3 + 3.5;
      const theta = Math.random() * 2 * Math.PI;
      const xi = r * Math.cos(theta);
      const yi = r * Math.sin(theta);
      x.push(xi);
      y.push(yi);
      z_flat.push(0);
      z_lifted.push((xi * xi + yi * yi) * 0.8);
      colors.push("#00d2ff");
    }

    // Plane
    const plane_x: number[][] = [];
    const plane_y: number[][] = [];
    const plane_z: number[][] = [];
    const gridSize = 20;

    for (let i = 0; i <= gridSize; i++) {
      const row_x: number[] = [];
      const row_y: number[] = [];
      const row_z: number[] = [];
      for (let j = 0; j <= gridSize; j++) {
        row_x.push((j / gridSize) * 14 - 7);
        row_y.push((i / gridSize) * 14 - 7);
        row_z.push(7.5);
      }
      plane_x.push(row_x);
      plane_y.push(row_y);
      plane_z.push(row_z);
    }

    tracesRef.current = {
      x,
      y,
      z_flat,
      z_lifted,
      colors,
      plane_x,
      plane_y,
      plane_z,
    };

    layoutRef.current = {
      paper_bgcolor: "#ffffff",
      margin: { l: 0, r: 0, t: 0, b: 0 },
      scene: {
        camera: { eye: { x: 0, y: 0, z: 2.5 } },
        xaxis: { showgrid: true, showticklabels: false },
        yaxis: { showgrid: true, showticklabels: false },
        zaxis: { title: "Kernel Dimension", range: [0, 35] },
        aspectratio: { x: 1, y: 1, z: 0.7 },
      },
      showlegend: false,
    };

    window.Plotly.newPlot(
      plotDivRef.current,
      [
        {
          x,
          y,
          z: z_flat,
          type: "scatter3d",
          mode: "markers",
          marker: { size: 5, color: colors, opacity: 0.8 },
        },
        {
          x: plane_x,
          y: plane_y,
          z: plane_z,
          type: "surface",
          opacity: 0,
          showscale: false,
        },
      ],
      layoutRef.current,
      { displayModeBar: false, responsive: true },
    );

    setIsLoaded(true);
  };

  const updateView = (view: "2d" | "3d" | "plane") => {
    if (!isLoaded || !plotDivRef.current) return;
    setActiveView(view);

    const t = tracesRef.current;

    window.Plotly.react(
      plotDivRef.current,
      [
        {
          x: t.x,
          y: t.y,
          z: view === "2d" ? t.z_flat : t.z_lifted,
          type: "scatter3d",
          mode: "markers",
          marker: {
            size: 6,
            color: t.colors,
            opacity: view === "plane" ? 0.3 : 0.8,
          },
        },
        {
          x: t.plane_x,
          y: t.plane_y,
          z: t.plane_z,
          type: "surface",
          opacity: view === "plane" ? 0.8 : 0,
          showscale: false,
        },
      ],
      layoutRef.current,
    );
  };

  return (
    <div className="flex flex-col gap-6 mb-8 w-full max-w-5xl mx-auto">
      <Script
        src="https://cdn.plot.ly/plotly-2.27.0.min.js"
        onLoad={initPlot}
      />

      <SimHeader
        title="Visualizing the Kernel Trick"
        subtitle="Watch how inseparable 2D data becomes separable in high dimensions."
      />

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <Button
              variant={activeView === "2d" ? "default" : "secondary"}
              onClick={() => updateView("2d")}
            >
              1. Normal 2D View
            </Button>

            <Button
              variant={activeView === "3d" ? "default" : "secondary"}
              onClick={() => updateView("3d")}
            >
              2. Apply Kernel Lift
            </Button>

            <Button
              variant={activeView === "plane" ? "default" : "secondary"}
              onClick={() => updateView("plane")}
            >
              3. Find Linear Plane
            </Button>
          </div>

          <div
            ref={plotDivRef}
            className="w-full h-125 border rounded bg-white"
          />
        </CardContent>
      </Card>
    </div>
  );
}
