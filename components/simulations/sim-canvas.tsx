import { cn } from "@/lib/utils";
import { useResponsiveCanvas } from "@/lib/use-responsive-canvas";

type SimCanvasProps = {
  maxWidth?: number;
  aspectRatio?: number;
  minHeight?: number;
  label: string;
  className?: string;
  canvasClassName?: string;
};

/**
 * Shared canvas stage for 2D sims. Additive primitive — existing sims keep
 * their local hook usage; new / migrated sims use this to kill boilerplate.
 * DPR backing store is handled inside useResponsiveCanvas; draw in CSS px
 * via the `draw` callback receiving a pre-scaled ctx.
 */
export function SimCanvas({
  maxWidth = 700,
  aspectRatio = 16 / 10,
  minHeight = 300,
  label,
  className,
  canvasClassName,
}: SimCanvasProps) {
  const { containerRef, canvasRef, size } = useResponsiveCanvas({
    maxWidth,
    aspectRatio,
    minHeight,
  });

  return (
    <div ref={containerRef} className={cn("w-full", className)}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={label}
        width={size.width}
        height={size.height}
        style={{ width: size.width, height: size.height }}
        className={cn("w-full rounded-lg border", canvasClassName)}
      />
    </div>
  );
}
