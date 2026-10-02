"use client";

import type { ReactNode } from "react";
import {
  ContentBrowser,
  type BrowserCategory,
  type BrowserItem,
} from "@/components/listings/content-browser";

export interface Simulation {
  id: string;
  title: string;
  description: string;
  image: string;
  badge: string;
  category: "regression" | "classification" | "clustering" | "testing" | "other";
}

const CATEGORIES: BrowserCategory[] = [
  { value: "regression", title: "Regression" },
  { value: "classification", title: "Classification" },
  { value: "clustering", title: "Clustering" },
  { value: "testing", title: "Testing" },
  { value: "other", title: "Advanced & Experimental" },
];

const PLOTLY_SRC = "https://cdn.plot.ly/plotly-gl3d-2.27.0.min.js";
// 3D sims need the Plotly CDN bundle — preconnect on listing mount and
// preload on card hover so it's cached before navigation (perceived instant).
const PLOTLY_SIMS = new Set(["kernel-trick", "svr-kernel-lift"]);

function ensurePreconnect() {
  if (document.querySelector("link[data-plotly-preconnect]")) return;
  for (const rel of ["preconnect", "dns-prefetch"]) {
    const l = document.createElement("link");
    l.rel = rel;
    l.href = "https://cdn.plot.ly";
    if (rel === "preconnect") l.crossOrigin = "anonymous";
    l.dataset.plotlyPreconnect = "1";
    document.head.appendChild(l);
  }
}

function prefetchPlotly() {
  ensurePreconnect();
  if (document.querySelector("link[data-plotly-preload]")) return;
  const l = document.createElement("link");
  l.rel = "preload";
  l.as = "script";
  l.href = PLOTLY_SRC;
  l.dataset.plotlyPreload = "1";
  document.head.appendChild(l);
}

function wrapCard(card: ReactNode, sim: BrowserItem) {
  // Hover intent on 3D cards starts the Plotly download
  // before navigation — cached by the time the sim mounts.
  return PLOTLY_SIMS.has(sim.id) ? (
    <div key={sim.id} onMouseEnter={prefetchPlotly}>
      {card}
    </div>
  ) : (
    <div key={sim.id}>{card}</div>
  );
}

export function SimulationBrowser({
  simulations,
}: {
  simulations: Simulation[];
}) {
  return (
    <ContentBrowser
      items={simulations}
      categories={CATEGORIES}
      searchNoun="simulations"
      emptyTitle="No simulations found"
      hrefFor={(s) => `/simulations/${s.id}`}
      cardVariant="simulation"
      eagerCategory="regression"
      wrapCard={wrapCard}
      onMount={ensurePreconnect}
    />
  );
}
