import { cn } from "@/lib/utils";

interface AmbientGlowProps {
  className?: string;
  /** Renders smaller, tighter orbs suited for inside panels */
  compact?: boolean;
}

/**
 * Soft, slowly drifting gradient orbs.
 * Place BEHIND a .glass surface so the backdrop blur has
 * colorful light to refract - this is what makes glassmorphism read as glass.
 */
export function AmbientGlow({ className, compact = false }: AmbientGlowProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        // Fade orbs out before they reach the container edges,
        // otherwise overflow clipping produces hard-edged color blocks
        "[mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_72%)]",
        "[-webkit-mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_72%)]",
        className,
      )}
    >
      <div
        className={cn(
          "absolute rounded-full bg-primary/25 blur-[110px] animate-drift",
          compact ? "size-56 -top-16 -left-10" : "size-96 -top-32 -left-32",
        )}
      />
      <div
        className={cn(
          "absolute rounded-full bg-chart-2/20 blur-[120px] animate-drift [animation-delay:-6s]",
          compact
            ? "size-48 top-1/4 -right-12"
            : "size-[28rem] top-1/3 -right-32",
        )}
      />
      <div
        className={cn(
          "absolute rounded-full bg-chart-3/15 blur-[100px] animate-drift [animation-delay:-12s]",
          compact
            ? "size-44 -bottom-14 left-1/3"
            : "size-80 -bottom-40 left-1/4",
        )}
      />
    </div>
  );
}
