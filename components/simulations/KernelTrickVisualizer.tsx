/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import SimHeader from "../common/sim-header";
import Script from "next/script";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    Plotly: any;
  }
}

export default function KernelTrickVisualizer() {
  const plotDivRef = useRef<HTMLDivElement>(null);
  const [activeView, setActiveView] = useState<"2d" | "3d" | "plane">("2d");
  const [isLoaded, setIsLoaded] = useState(false);

  // Data State refs to persist across renders without causing re-renders
  const tracesRef = useRef<any>({});
  const layoutRef = useRef<any>({});

  const colors = {
    foreground: "#000000", // Black for text
    blue: "#0ea5e9", // Tailwind blue-500
    red: "#ef4444", // Tailwind red-500
    plane: "#e5e7eb", // Tailwind gray-200
    grid: "#ddd", // Light gray for grid lines
  };

  const initPlot = () => {
    if (!window.Plotly || !plotDivRef.current) return;

    // Data Gen
    const N_inner = 100,
      N_outer = 150;
    let x: number[] = [],
      y: number[] = [],
      z_flat: number[] = [],
      z_lifted: number[] = [],
      pointColors: string[] = [];

    // Inner Circle
    for (let i = 0; i < N_inner; i++) {
      let r = Math.random() * 2;
      let theta = Math.random() * 2 * Math.PI;
      let xi = r * Math.cos(theta);
      let yi = r * Math.sin(theta);
      x.push(xi);
      y.push(yi);
      z_flat.push(0);
      z_lifted.push((xi * xi + yi * yi) * 0.8);
      pointColors.push(colors.red); // Fixed red
    }
    // Outer Ring
    for (let i = 0; i < N_outer; i++) {
      let r = Math.random() * 3 + 3.5;
      let theta = Math.random() * 2 * Math.PI;
      let xi = r * Math.cos(theta);
      let yi = r * Math.sin(theta);
      x.push(xi);
      y.push(yi);
      z_flat.push(0);
      z_lifted.push((xi * xi + yi * yi) * 0.8);
      pointColors.push(colors.blue); // Fixed blue
    }

    // Plane Data
    let plane_x = [],
      plane_y = [],
      plane_z = [];
    const gridSize = 20;
    for (let i = 0; i <= gridSize; i++) {
      let row_x = [],
        row_y = [],
        row_z = [];
      for (let j = 0; j <= gridSize; j++) {
        row_x.push((j / gridSize) * 14 - 7);
        row_y.push((i / gridSize) * 14 - 7);
        row_z.push(7.5);
      }
      plane_x.push(row_x);
      plane_y.push(row_y);
      plane_z.push(row_z);
    }

    // Storing for toggling
    tracesRef.current = {
      x,
      y,
      z_flat,
      z_lifted,
      colors: pointColors,
      plane_x,
      plane_y,
      plane_z,
    };

    const scatterTrace = {
      x: x,
      y: y,
      z: z_flat,
      mode: "markers",
      type: "scatter3d",
      marker: {
        size: 5,
        color: pointColors, // Use fixed pointColors
        opacity: 0.8,
        line: { color: "white", width: 0.5 },
      },
      name: "Data Points",
    };

    const planeTrace = {
      x: plane_x,
      y: plane_y,
      z: plane_z,
      type: "surface",
      showscale: false,
      opacity: 0,
      colorscale: [
        [0, colors.plane],
        [1, colors.plane],
      ],
      name: "Hyperplane",
    };

    layoutRef.current = {
      paper_bgcolor: "#ffffff", // Always white background
      plot_bgcolor: "transparent",
      margin: { l: 0, r: 0, t: 0, b: 0 },
      scene: {
        camera: { eye: { x: 0, y: 0, z: 2.5 }, up: { x: 0, y: 1, z: 0 } },
        xaxis: {
          title: "",
          showgrid: true,
          zeroline: false,
          showticklabels: false,
          gridcolor: colors.grid, // Fixed grid color
        },
        yaxis: {
          title: "",
          showgrid: true,
          zeroline: false,
          showticklabels: false,
          gridcolor: colors.grid, // Fixed grid color
        },
        zaxis: {
          title: { text: "Kernel Dimension", font: { color: colors.foreground } }, // Fixed foreground for text
          range: [0, 35],
          showgrid: true,
          zeroline: false,
          gridcolor: colors.grid, // Fixed grid color
        },
        aspectmode: "manual",
        aspectratio: { x: 1, y: 1, z: 0.7 },
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
    const updateData: any = {};
    const updateLayout: any = {};

    if (view === "2d") {
      updateData.z = [t.z_flat, t.plane_z]; // Reset points flat
      updateData["marker.opacity"] = [0.8, 0]; // Hide plane opacity
      updateData["opacity"] = [0.8, 0]; // Hide plane
      updateLayout["scene.camera.eye"] = { x: 0, y: 0, z: 2.5 };
    } else if (view === "3d") {
      updateData.z = [t.z_lifted, t.plane_z]; // Lift points
      updateData["marker.opacity"] = [0.8, 0];
      updateData["opacity"] = [0.8, 0]; // Keep plane hidden
      updateLayout["scene.camera.eye"] = { x: 1.5, y: 1.5, z: 1.2 };
    } else {
      updateData.z = [t.z_lifted, t.plane_z];
      updateData["marker.opacity"] = [0.4, 0.8]; // Fade points, show plane
      updateData["opacity"] = [0.4, 0.8]; // Show plane
      // Optional camera shift
    }

    // Use React method for Plotly to update efficiently
    window.Plotly.react(
      plotDivRef.current,
      [
        {
          ...tracesRef.current.scatterTrace,
          z: updateData.z[0],
          marker: {
            ...tracesRef.current.scatterTrace?.marker,
            opacity: updateData["marker.opacity"][0],
          },
        },
        { ...tracesRef.current.planeTrace, opacity: updateData["opacity"][1] },
      ],
      layoutRef.current,
    );

    // Animate Camera independently
    window.Plotly.animate(
      plotDivRef.current,
      {
        layout: updateLayout,
      },
      { transition: { duration: 1000 }, frame: { duration: 1000 } },
    );

    // Re-trigger full redraw logic for data switch (simpler than partial update for these specific files)
    // *Re-implementing simplified logic similar to original file:*

    const scatter = {
      x: t.x,
      y: t.y,
      z: view === "2d" ? t.z_flat : t.z_lifted,
      mode: "markers",
      type: "scatter3d",
      marker: {
        size: 6,
        color: t.colors, // Use fixed colors
        opacity: view === "plane" ? 0.3 : 0.8,
        line: { color: "white", width: 0.5 },
      },
    };

    const plane = {
      x: t.plane_x,
      y: t.plane_y,
      z: t.plane_z,
      type: "surface",
      showscale: false,
      opacity: view === "plane" ? 0.8 : 0,
      colorscale: [
        [0, colors.plane],
        [1, colors.plane],
      ],
    };

    window.Plotly.react(
      plotDivRef.current,
      [scatter, plane],
      layoutRef.current,
    );

    if (updateLayout["scene.camera.eye"]) {
      window.Plotly.animate(
        plotDivRef.current,
        { layout: updateLayout },
        { transition: { duration: 1000 }, frame: { duration: 1000 } },
      );
    }
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
          <div className="flex justify-center gap-4 mb-6">
            <Button
              onClick={() => updateView("2d")}
              variant={activeView === "2d" ? "default" : "secondary"}
            >
              1. Normal 2D View
            </Button>
            <Button
              onClick={() => updateView("3d")}
              variant={activeView === "3d" ? "default" : "secondary"}
            >
              2. Apply Kernel Lift
            </Button>
            <Button
              onClick={() => updateView("plane")}
              variant={activeView === "plane" ? "default" : "secondary"}
            >
              3. Find Linear Plane
            </Button>
          </div>

          <div
            ref={plotDivRef}
            className="w-full h-[500px] border rounded bg-white"
          />
        </CardContent>
      </Card>
    </div>
  );
}
