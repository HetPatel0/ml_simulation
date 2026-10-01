import { useEffect, useRef, useState, useCallback } from "react";

interface CanvasSize {
  width: number;
  height: number;
}

interface UseResponsiveCanvasOptions {
  maxWidth?: number;
  aspectRatio?: number; // width / height
  minHeight?: number;
}

export function useResponsiveCanvas(options: UseResponsiveCanvasOptions = {}) {
  const { maxWidth = 700, aspectRatio = 16 / 10, minHeight = 300 } = options;

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState<CanvasSize>({ width: 600, height: 400 });

  const updateSize = useCallback(() => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth;
    const width = Math.min(containerWidth, maxWidth);
    const height = Math.max(width / aspectRatio, minHeight);
    const next = { width: Math.floor(width), height: Math.floor(height) };

    // Skip re-render when size is unchanged (ResizeObserver fires often).
    setSize((prev) => (prev.width === next.width && prev.height === next.height ? prev : next));
  }, [maxWidth, aspectRatio, minHeight]);

  useEffect(() => {
    updateSize();

    // Debounced observer: rapid resizes (drawer, rotate) recalc once.
    let timer: ReturnType<typeof setTimeout> | null = null;
    const resizeObserver = new ResizeObserver(() => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(updateSize, 100);
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (timer) clearTimeout(timer);
      resizeObserver.disconnect();
    };
  }, [updateSize]);

  return { containerRef, canvasRef, size };
}
