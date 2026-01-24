/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRef, useState } from "react";
import SimHeader from "../common/sim-header";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

declare global {
  interface Window {
    Plotly: any;
  }
}

export default function SVRVisualizer() {
  const plotDivRef = useRef<HTMLDivElement>(null);
  const [activeView, setActiveView] = useState<"2d" | "3d" | "plane">("2d");
  const [isLoaded, setIsLoaded] = useState(false);

  const tracesRef = useRef<any>({});
  const layoutRef = useRef<any>({});
  const colors = {
    foreground: "#000000", // Black for text
    destructive: "#ff385f", // Red from original, good contrast
    grid: "#ddd", // Light gray for grid lines
  };

  const initPlot = () => {
    if (!window.Plotly || !plotDivRef.current) return;

    // 1. Data Generation
    const N = 100;
    let x_data = [],
      y_data = [],
      z_flat = [],
      z_lifted = [];

    for (let i = 0; i < N; i++) {
      let x = Math.random() * 10 - 5;
      let noise = (Math.random() - 0.5) * 4;
      let y = x * x + noise;

      x_data.push(x);
      y_data.push(y);
      z_flat.push(-5);
      z_lifted.push(x * x);
    }

    // Plane Gen
    let plane_x = [],
      plane_y = [],
      plane_z = [];
    const gridSize = 10;
    for (let i = 0; i <= gridSize; i++) {
      let row_x = [],
        row_y = [],
        row_z = [];
      let z_val = (i / gridSize) * 25;
      for (let j = 0; j <= gridSize; j++) {
        let x_val = (j / gridSize) * 10 - 5;
        row_x.push(x_val);
        row_z.push(z_val);
        row_y.push(z_val);
      }
      plane_x.push(row_x);
      plane_y.push(row_y);
      plane_z.push(row_z);
    }

    tracesRef.current = {
      x_data,
      y_data,
      z_flat,
      z_lifted,
      plane_x,
      plane_y,
      plane_z,
    };

    // Initial Trace
    const scatterTrace = {
      x: x_data,
      y: y_data,
      z: z_flat,
      mode: "markers",
      type: "scatter3d",
      marker: {
        size: 5,
        color: colors.destructive, // Fixed color
        opacity: 0.9,
        line: { color: "white", width: 0.5 },
      },
    };

    const planeTrace = {
      x: plane_x,
      y: plane_y,
      z: plane_z,
      type: "surface",
      showscale: false,
      opacity: 0,
      colorscale: "Viridis",
    };

    layoutRef.current = {
      paper_bgcolor: "#ffffff", // Always white background
      plot_bgcolor: "transparent",
      margin: { l: 0, r: 0, t: 0, b: 0 },
      scene: {
        camera: { eye: { x: 0, y: 0, z: 2.0 }, up: { x: 0, y: 1, z: 0 } },
        xaxis: { title: { text: "Input (X)", font: { color: colors.foreground } }, tickfont: { color: colors.foreground }, gridcolor: colors.grid },
        yaxis: { title: { text: "Target (Y)", font: { color: colors.foreground } }, tickfont: { color: colors.foreground }, gridcolor: colors.grid },
        zaxis: { title: { text: "", font: { color: colors.foreground } }, range: [-5, 30], showticklabels: false, gridcolor: colors.grid },
        aspectmode: "manual",
        aspectratio: { x: 1, y: 1, z: 0.5 },
      },
      showlegend: false,
    };
    window.Plotly.newPlot(
      plotDivRef.current,
      [scatterTrace, planeTrace],
      layoutRef.current,
      { displayModeBar: false, responsive: true },
    );
    setIsLoaded(true);
  };

  const updateView = (view: "2d" | "3d" | "plane") => {
    if (!isLoaded || !plotDivRef.current) return;
    setActiveView(view);

    const t = tracesRef.current;
    let layoutUpdate: any = {};

    // 2. Simplistic Redraw logic for reliability
    const scatter = {
      x: t.x_data,
      y: t.y_data,
      z: view === "2d" ? t.z_flat : t.z_lifted,
      mode: "markers",
      type: "scatter3d",
      marker: {
        size: 5,
        color: colors.destructive, // Fixed color
        opacity: view === "plane" ? 0.5 : 0.9,
        line: { color: "white", width: 0.5 },
      },
    };

    const plane = {
      x: t.plane_x,
      y: t.plane_y,
      z: t.plane_z,
      type: "surface",
      showscale: false,
      opacity: view === "plane" ? 0.7 : 0,
      colorscale: "Viridis",
    };

    // Camera & Labels
    if (view === "2d") {
      layoutUpdate["scene.camera.eye"] = { x: 0, y: 0, z: 2.0 };
      layoutUpdate["scene.zaxis.title"] = { text: "", font: { color: colors.foreground } };
    } else if (view === "3d") {
      layoutUpdate["scene.camera.eye"] = { x: 1.8, y: 0.5, z: 0.8 };
      layoutUpdate["scene.zaxis.title"] = { text: "Kernel Feature (X²)", font: { color: colors.foreground } };
    } else {
      layoutUpdate["scene.camera.eye"] = { x: 2.0, y: 0.2, z: 0.5 };
    }

    window.Plotly.react(
      plotDivRef.current,
      [scatter, plane],
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
        title="SVR: Visualizing the Regression Kernel"
        subtitle="Unrolling curved data in 3D to fit a flat SVR plane."
      />

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <Button
              onClick={() => updateView("2d")}
              variant={activeView === "2d" ? "default" : "secondary"}
            >
              1. The Problem (2D Curve)
            </Button>
            <Button
              onClick={() => updateView("3d")}
              variant={activeView === "3d" ? "default" : "secondary"}
            >
              2. Kernel Transform (Add Z)
            </Button>
            <Button
              onClick={() => updateView("plane")}
              variant={activeView === "plane" ? "default" : "secondary"}
            >
              3. Fit Linear SVR Plane
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
