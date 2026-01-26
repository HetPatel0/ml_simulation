"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { RefObject } from "react";
import { Play, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { label: "Visual", desc: "See algorithms work" },
  { label: "Interactive", desc: "Adjust & experiment" },
  { label: "Intuitive", desc: "Build understanding" },
];

// Generate straight diagonal trails - like the reference image
// All lines go from top-left to bottom-right at ~50 degree angle
function generateTrails() {
  const trails = [];
  const angle = 45; // degrees
  const angleRad = (angle * Math.PI) / 180;

  // Create 60 trails spread across the canvas
  for (let i = 0; i < 60; i++) {
    // Distribute starting points across the canvas
    const startX = -20 + (i % 10) * 12 + ((i * 7) % 11) - 5;
    const startY = -15 + Math.floor(i / 10) * 18 + ((i * 13) % 9) - 4;

    // Varying lengths
    const length = 15 + ((i * 17) % 25);

    // Calculate end point based on angle
    const endX = startX + Math.cos(angleRad) * length;
    const endY = startY + Math.sin(angleRad) * length;

    // ~12% accent trails
    const isAccent = i % 8 === 0;

    trails.push({
      id: i,
      x1: startX,
      y1: startY,
      x2: endX,
      y2: endY,
      isAccent,
      length,
    });
  }

  return trails;
}

const staticTrails = generateTrails();

function StarTrail({
  trail,
  index,
}: {
  trail: (typeof staticTrails)[0];
  index: number;
}) {
  const { x1, y1, x2, y2, isAccent } = trail;

  // Stagger animations
  const delay = (index * 0.08) % 2.5;
  const duration = 1.5 + (index % 6) * 0.2;
  const repeatDelay = 0.5 + (index % 5) * 0.4;

  return (
    <motion.line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={isAccent ? "oklch(0.75 0.12 220)" : "currentColor"}
      strokeWidth={isAccent ? 0.12 : 0.06}
      strokeLinecap="round"
      className={isAccent ? "" : "text-muted-foreground"}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{
        pathLength: [0, 1, 1],
        opacity: [0, isAccent ? 0.85 : 0.4, 0],
      }}
      transition={{
        duration,
        delay,
        ease: "linear",
        times: [0, 0.6, 1],
        repeat: Infinity,
        repeatDelay,
      }}
    />
  );
}

function MLBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Muted trails first */}
        {staticTrails
          .filter((t) => !t.isAccent)
          .map((trail, i) => (
            <StarTrail key={trail.id} trail={trail} index={i} />
          ))}

        {/* Accent trails on top */}
        {staticTrails
          .filter((t) => t.isAccent)
          .map((trail, i) => (
            <StarTrail key={trail.id} trail={trail} index={i + 50} />
          ))}
      </svg>
    </div>
  );
}

function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5 }}
      className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 hidden sm:block"
    >
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="w-5 h-8 sm:w-6 sm:h-10 rounded-full border border-muted-foreground/30 flex items-start justify-center p-1.5 sm:p-2 shadow-sm"
      >
        <motion.div className="w-0.5 sm:w-1 h-1.5 sm:h-2 rounded-full bg-primary/50" />
      </motion.div>
    </motion.div>
  );
}

function HeroContent({
  heroOpacity,
  heroY,
}: {
  heroOpacity: MotionValue<number>;
  heroY: MotionValue<number>;
}) {
  return (
    <motion.div
      style={{ opacity: heroOpacity, y: heroY }}
      className="relative z-10 px-4 sm:px-6 lg:px-12 py-8 sm:py-12 lg:py-16 max-w-4xl mx-auto text-center"
    >
      {/* Overline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-4 sm:mb-6"
      >
        <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium tracking-[0.15em] sm:tracking-[0.2em] uppercase text-primary/90 border border-primary/20 rounded-full bg-primary/10 shadow-[0_0_15px_-3px_var(--primary)] shadow-primary/10 backdrop-blur-sm">
          Interactive ML Education
        </span>
      </motion.div>

      {/* Main headline */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="text-[2.75rem] sm:text-5xl md:text-6xl lg:text-7xl font-normal sm:font-light tracking-tighter leading-[1.1] sm:leading-[1.05]"
      >
        Learn by{" "}
        <span className="relative inline-block">
          <span className="relative z-10 font-semibold sm:font-medium text-primary">seeing</span>
          <motion.span
            className="absolute bottom-0.5 sm:bottom-2 left-0 w-full h-1.5 sm:h-3 bg-primary/20 z-0"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            style={{ originX: 0 }}
          />
        </span>
      </motion.h1>

      {/* Subheadline */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-muted-foreground/80 sm:text-muted-foreground/90 max-w-2xl mx-auto leading-relaxed font-normal px-4 sm:px-2"
      >
        Watch machine learning algorithms come alive through interactive
        visualizations. Adjust parameters, see results instantly.
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-6 sm:mt-8 lg:mt-10 flex flex-wrap justify-center gap-3 sm:gap-4"
      >
        <Button
          size="lg"
          asChild
          className="h-11 px-6 sm:px-8 text-sm sm:text-base gap-2 sm:gap-3 rounded-full group shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
        >
          <Link href="/simulations" scroll={true}>
            <Play className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:scale-110" />
            Start Exploring
          </Link>
        </Button>
        <Button
          size="lg"
          variant="ghost"
          asChild
          className="h-11 px-5 sm:px-6 lg:px-8 text-sm sm:text-base gap-2 sm:gap-3 rounded-full hover:bg-muted/50"
        >
          <Link href="/learn" scroll={true}>
            <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Read Articles
          </Link>
        </Button>
      </motion.div>

      {/* Feature pills */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="mt-8 sm:mt-12 lg:mt-16 flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-12"
      >
        {features.map((feature, i) => (
          <motion.div
            key={feature.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.8 + i * 0.1 }}
            className="text-center"
          >
            <div className="text-xs sm:text-sm font-semibold text-foreground tracking-tight">
              {feature.label}
            </div>
            <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">
              {feature.desc}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

interface HeroSectionProps {
  containerRef: RefObject<HTMLDivElement | null>;
}

export function HeroSection({ containerRef }: HeroSectionProps) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);

  return (
    <section className="relative min-h-[min(90vh,800px)] h-[clamp(500px,80vh,900px)] flex items-center justify-center overflow-hidden">
      <MLBackground />
      <HeroContent heroOpacity={heroOpacity} heroY={heroY} />
      <ScrollIndicator />
    </section>
  );
}
