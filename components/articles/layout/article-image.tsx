"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
} from "react";
import Image from "next/image";
import { X, Expand, Minus, Plus, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { blurDataURL } from "@/lib/blur";

type ArticleImageProps = {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
};

/**
 * Click-to-expand hero image. Thumbnail opens a fullscreen lightbox;
 * clicking the backdrop, pressing Escape, or the X button closes it.
 */
export function ArticleImage({ src, alt, priority, className }: ArticleImageProps) {
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    startPanX: number;
    startPanY: number;
  } | null>(null);
  const draggedRef = useRef(false);

  const MIN_ZOOM = 0.5;
  const MAX_ZOOM = 3;
  const ZOOM_STEP = 0.25;

  const updateZoom = useCallback(
    (amount: number) => {
      setZoom((current) => {
        const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, current + amount));
        if (next <= 1) setPan({ x: 0, y: 0 });
        return next;
      });
    },
    [],
  );

  const resetZoom = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    draggedRef.current = false;
  }, []);

  const startPan = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      // Right-click is reserved for zooming out; it must never start a drag.
      if (e.button !== 0 || zoom <= 1) return;
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      draggedRef.current = false;
      dragRef.current = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        startPanX: pan.x,
        startPanY: pan.y,
      };
    },
    [pan.x, pan.y, zoom],
  );

  const movePan = useCallback((e: ReactPointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    if (Math.hypot(e.clientX - drag.startX, e.clientY - drag.startY) > 4) {
      draggedRef.current = true;
      setIsDragging(true);
    }
    setPan({
      x: drag.startPanX + e.clientX - drag.startX,
      y: drag.startPanY + e.clientY - drag.startY,
    });
  }, []);

  const endPan = useCallback((e: ReactPointerEvent<HTMLElement>) => {
    if (dragRef.current?.pointerId !== e.pointerId) return;
    dragRef.current = null;
    setIsDragging(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }, []);

  const handleImageClick = useCallback(
    (e: ReactMouseEvent<HTMLElement>) => {
      e.stopPropagation();
      if (draggedRef.current) {
        draggedRef.current = false;
        return;
      }
      updateZoom(ZOOM_STEP);
    },
    [updateZoom],
  );

  const handleImageContextMenu = useCallback(
    (e: ReactMouseEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      dragRef.current = null;
      draggedRef.current = false;
      setIsDragging(false);
      updateZoom(-ZOOM_STEP);
    },
    [updateZoom],
  );

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "+" || e.key === "=") updateZoom(ZOOM_STEP);
      if (e.key === "-" || e.key === "_") updateZoom(-ZOOM_STEP);
      if (e.key === "0") resetZoom();
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close, resetZoom, updateZoom]);

  useEffect(() => {
    if (open) resetZoom();
  }, [open, resetZoom]);

  return (
    <>
      <figure className={cn("relative my-10 aspect-video rounded-xl border-2", className)}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Expand image: ${alt}`}
          aria-haspopup="dialog"
          className="group absolute inset-0 block h-full w-full cursor-zoom-in rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority ?? true}
            loading={priority === false ? "lazy" : undefined}
            placeholder="blur"
            blurDataURL={blurDataURL}
            sizes="(max-width: 768px) 100vw, 800px"
            quality={src.endsWith(".svg") ? undefined : 85}
            className="rounded-xl object-cover"
          />
          <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-background/80 px-2.5 py-1.5 text-xs font-medium text-foreground opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            <Expand size={14} aria-hidden="true" />
            Expand
          </span>
        </button>
      </figure>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={close}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-8"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close image"
            className="absolute right-4 top-4 rounded-full bg-background/90 p-2 text-foreground shadow-lg transition hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X size={20} aria-hidden="true" />
          </button>
          <div
            role="group"
            aria-label="Image zoom controls"
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full bg-background/90 p-1 text-foreground shadow-lg backdrop-blur sm:bottom-6"
          >
            <button
              type="button"
              onClick={() => updateZoom(-ZOOM_STEP)}
              disabled={zoom <= MIN_ZOOM}
              aria-label="Zoom out"
              className="rounded-full p-2 transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Minus size={18} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={resetZoom}
              aria-label={`Reset zoom, currently ${Math.round(zoom * 100)}%`}
              className="min-w-14 rounded-full px-2 py-2 text-xs font-medium tabular-nums transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              type="button"
              onClick={() => updateZoom(ZOOM_STEP)}
              disabled={zoom >= MAX_ZOOM}
              aria-label="Zoom in"
              className="rounded-full p-2 transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Plus size={18} aria-hidden="true" />
            </button>
            <span className="mx-0.5 h-5 w-px bg-border" aria-hidden="true" />
            <button
              type="button"
              onClick={resetZoom}
              aria-label="Reset zoom"
              className="rounded-full p-2 transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <RotateCcw size={16} aria-hidden="true" />
            </button>
          </div>
          {/* Stop propagation so clicks on the image itself don't close. */}
          <figure
            onClick={handleImageClick}
            onContextMenu={handleImageContextMenu}
            onPointerDown={startPan}
            onPointerMove={movePan}
            onPointerUp={endPan}
            onPointerCancel={endPan}
            onWheel={(e) => {
              e.preventDefault();
              updateZoom(e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP);
            }}
            className={cn(
              "relative h-[min(78vh,48rem)] w-[min(90vw,64rem)] overflow-auto rounded-xl touch-none",
              isDragging ? "cursor-grabbing" : "cursor-zoom-in",
            )}
          >
            <Image
              src={src}
              alt={alt}
              fill
              placeholder="blur"
              blurDataURL={blurDataURL}
              sizes="90vw"
              quality={src.endsWith(".svg") ? undefined : 90}
              className="rounded-xl object-contain transition-transform duration-150"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              }}
            />
            {alt && (
              <figcaption className="absolute -bottom-8 left-0 right-0 truncate text-center text-sm text-white/80">
                {alt}
              </figcaption>
            )}
          </figure>
        </div>
      )}
    </>
  );
}
