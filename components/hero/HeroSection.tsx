import type { CSSProperties } from "react";
import Link from "next/link";
import { Play, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { label: "Visual", desc: "See algorithms work" },
  { label: "Interactive", desc: "Adjust & experiment" },
  { label: "Intuitive", desc: "Build understanding" },
];

// 18 CSS-animated trails (was 36 JS-driven SVG paths). Staggered
// stroke-dashoffset runs off the main thread instead of one rAF per line.
const TRAIL_COUNT = 18;
const TRAIL_COLS = 6;

function generateTrails() {
  const trails = [];
  const angle = 45;
  const angleRad = (angle * Math.PI) / 180;

  for (let i = 0; i < TRAIL_COUNT; i++) {
    const startX = -20 + (i % TRAIL_COLS) * 20 + ((i * 7) % 11) - 5;
    const startY = -15 + Math.floor(i / TRAIL_COLS) * 34 + ((i * 13) % 9) - 4;
    const length = 15 + ((i * 17) % 25);
    const endX = startX + Math.cos(angleRad) * length;
    const endY = startY + Math.sin(angleRad) * length;

    trails.push({
      id: i,
      x1: startX,
      y1: startY,
      x2: endX,
      y2: endY,
      isAccent: i % 6 === 0,
    });
  }

  return trails;
}

const staticTrails = generateTrails();

function TrailLine({
  trail,
  index,
}: {
  trail: (typeof staticTrails)[0];
  index: number;
}) {
  const { x1, y1, x2, y2, isAccent } = trail;
  const style = {
    "--trail-delay": `${((index * 0.37) % 3.2).toFixed(2)}s`,
    "--trail-duration": `${(2.2 + (index % 4) * 0.4).toFixed(2)}s`,
    "--trail-opacity": isAccent ? 0.85 : 0.35,
  } as CSSProperties;

  return (
    <line
      pathLength={1}
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={isAccent ? "oklch(0.75 0.12 220)" : "currentColor"}
      strokeWidth={isAccent ? 0.12 : 0.06}
      strokeLinecap="round"
      className={isAccent ? "trail" : "trail text-muted-foreground"}
      style={style}
    />
  );
}

function MLBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        {staticTrails.map((trail, index) => (
          <TrailLine key={trail.id} trail={trail} index={index} />
        ))}
      </svg>
    </div>
  );
}

function ScrollIndicator() {
  return (
    <div className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 sm:bottom-6 sm:block lg:bottom-8">
      <div className="scroll-indicator flex h-8 w-5 items-start justify-center rounded-full border border-muted-foreground/30 p-1.5 shadow-sm sm:h-10 sm:w-6 sm:p-2">
        <div className="scroll-indicator-dot h-1.5 w-0.5 rounded-full bg-primary/50 sm:h-2 sm:w-1" />
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative flex h-[clamp(500px,80vh,900px)] min-h-[min(90vh,800px)] items-center justify-center overflow-hidden">
      <MLBackground />
      <div className="relative z-10 mx-auto max-w-4xl px-4 py-8 text-center sm:px-6 sm:py-12 lg:px-12 lg:py-16">
        <div className="hero-rise mb-4 sm:mb-6">
          <span className="inline-block rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-primary backdrop-blur-sm sm:px-4 sm:py-1.5 sm:text-xs sm:tracking-[0.2em]">
            Interactive ML Education
          </span>
        </div>

        {/* Visible at first paint: LCP text never waits for hydration. */}
        <h1 className="text-[2.75rem] font-normal leading-[1.1] tracking-tighter sm:text-5xl sm:font-light sm:leading-[1.05] md:text-6xl lg:text-7xl">
          Learn by{" "}
          <span className="relative inline-block">
            <span className="relative z-10 font-semibold text-primary sm:font-medium">
              seeing
            </span>
            <span
              aria-hidden="true"
              className="hero-underline absolute bottom-0.5 left-0 z-0 h-1.5 w-full origin-left bg-primary/20 sm:bottom-2 sm:h-3"
            />
          </span>
        </h1>

        <p className="hero-rise mt-4 px-4 text-sm font-normal leading-relaxed text-muted-foreground sm:mt-6 sm:px-2 sm:text-base md:text-lg">
          Watch machine learning algorithms come alive through interactive
          visualizations. Adjust parameters, see results instantly.
        </p>

        <div className="hero-rise mt-6 flex flex-wrap justify-center gap-3 sm:mt-8 sm:gap-4 lg:mt-10">
          <Button
            size="lg"
            asChild
            className="group h-11 gap-2 rounded-full px-6 text-sm shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary/40 sm:gap-3 sm:px-8 sm:text-base"
          >
            <Link href="/simulations" scroll={true}>
              <Play className="h-3.5 w-3.5 transition-transform group-hover:scale-110 sm:h-4 sm:w-4" />
              Explore Simulations
            </Link>
          </Button>
          <Button
            size="lg"
            variant="ghost"
            asChild
            className="h-11 gap-2 rounded-full px-5 text-sm transition-colors hover:bg-muted/60 sm:gap-3 sm:px-6 sm:text-base lg:px-8"
          >
            <Link href="/learn" scroll={true}>
              <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Read Articles
            </Link>
          </Button>
        </div>

        <div className="hero-rise mt-8 flex flex-wrap justify-center gap-6 sm:mt-12 sm:gap-8 md:gap-12 lg:mt-16">
          {features.map((feature) => (
            <div key={feature.label} className="text-center">
              <div className="text-xs font-semibold tracking-tight text-foreground sm:text-sm">
                {feature.label}
              </div>
              <div className="mt-0.5 text-[10px] text-muted-foreground sm:mt-1 sm:text-xs">
                {feature.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
      <ScrollIndicator />
    </section>
  );
}
