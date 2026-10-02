/**
 * Shared canvas tokens for the 2D simulations.
 *
 * Each sim keeps any visual that genuinely differs via spread override,
 * e.g. `{ ...SIM_COLORS, grid: "#f1f5f9" }` — so migrating a sim never
 * changes a pixel. When dark mode arrives, these are the knobs to turn.
 */
export const SIM_COLORS = {
  background: "#ffffff",
  foreground: "#1e293b", // slate-800
  grid: "#e2e8f0", // slate-200
  primary: "#2563eb", // blue-600
  destructive: "#ef4444", // red-500
  success: "#16a34a", // green-600
  muted: "#94a3b8", // slate-400
} as const;

export type SimColors = typeof SIM_COLORS;

/**
 * Client coords → canvas pixels. Accounts for CSS stretching
 * (canvas is often w-full while its bitmap keeps fixed dimensions).
 * Domain mapping (pixels → data coords, Y flips) stays per-sim.
 */
export function canvasPoint(
  canvas: HTMLCanvasElement,
  clientX: number,
  clientY: number,
) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (clientX - rect.left) * (canvas.width / rect.width),
    y: (clientY - rect.top) * (canvas.height / rect.height),
  };
}
