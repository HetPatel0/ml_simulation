"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const SnowfallLayer = dynamic(
  () => import("./snowfall-layer").then((mod) => mod.SnowfallLayer),
  { ssr: false },
);

export function SeasonalSnowfall() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const preview =
      new URLSearchParams(window.location.search).get("snow") === "1";
    if (new Date().getMonth() !== 11 && !preview) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setActive(true);
  }, []);

  if (!active) return null;

  return <SnowfallLayer />;
}
