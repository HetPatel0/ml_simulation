"use client";

import { useTheme } from "next-themes";
import Snowfall from "react-snowfall";

export function SnowfallLayer() {
  const { resolvedTheme } = useTheme();
  const color = resolvedTheme === "dark" ? "#dbeafe" : "#2563eb";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 overflow-hidden print:hidden"
    >
      <Snowfall
        color={color}
        snowflakeCount={120}
        radius={[0.8, 2.6]}
        speed={[0.4, 1.4]}
        wind={[-0.3, 0.8]}
        changeFrequency={120}
      />
    </div>
  );
}
