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

    setSize({ width: Math.floor(width), height: Math.floor(height) });
  }, [maxWidth, aspectRatio, minHeight]);

  useEffect(() => {
    updateSize();

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [updateSize]);

  return { containerRef, canvasRef, size };
}
