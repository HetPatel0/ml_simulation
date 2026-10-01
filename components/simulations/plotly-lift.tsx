"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

const PLOTLY_CDN = "https://cdn.plot.ly/plotly-gl3d-2.27.0.min.js";

type PlotlyLiftProps = {
  /** Unique div id for the plot. */
  id: string;
  /** Build initial { data, layout } once Plotly is ready. */
  buildTraces: () => { data: unknown[]; layout: Record<string, unknown> };
  /** Rebuild data on param change. Return null to skip update. */
  buildUpdate: () => { data: unknown[] } | null;
  height?: number;
};

/**
 * Shared Plotly 3D lift shell. Extracts the ~80% clone between
 * KernelTrickVisualizer and SvrKernelLift (CDN load, init, update, skeleton).
 * Additive — existing sims unwired until migrated one by one.
 */
export function PlotlyLift({ id, buildTraces, buildUpdate, height = 480 }: PlotlyLiftProps) {
  const [ready, setReady] = useState(false);
  const inited = useRef(false);
  const buildTracesRef = useRef(buildTraces);
  const buildUpdateRef = useRef(buildUpdate);

  useEffect(() => {
    buildTracesRef.current = buildTraces;
    buildUpdateRef.current = buildUpdate;
  });

  useEffect(() => {
    if (!ready || inited.current) return;
    const w = window as unknown as { Plotly?: { newPlot: (...a: unknown[]) => void; react: (...a: unknown[]) => void } };
    if (!w.Plotly) return;
    inited.current = true;
    const { data, layout } = buildTracesRef.current();
    w.Plotly.newPlot(id, data as [], { ...layout, height } as never, { responsive: true });
  }, [ready, id, height]);

  useEffect(() => {
    if (!ready || !inited.current) return;
    const update = buildUpdateRef.current();
    if (!update) return;
    const w = window as unknown as { Plotly?: { react: (...a: unknown[]) => void } };
    w.Plotly?.react(id, update.data as [], undefined as never);
  });

  return (
    <>
      <Script src={PLOTLY_CDN} strategy="afterInteractive" onLoad={() => setReady(true)} />
      {!ready && (
        <div role="status" aria-label="Loading 3D visualization" className="skeleton-shimmer rounded-xl" style={{ height }} />
      )}
      <div id={id} style={{ height, display: ready ? "block" : "none" }} role="img" aria-label="3D kernel lift visualization" />
    </>
  );
}
