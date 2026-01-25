"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Play, BookOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LearningCard } from "@/components/learning-card";
import { learningCards } from "./cardData";

// Abstract lines background
function MLBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.07] drop-shadow-sm"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Flowing curved lines */}
        <motion.path
          d="M -10 20 Q 20 10 40 25 T 70 20 T 110 30"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.15"
          className="text-primary"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
        <motion.path
          d="M -10 35 Q 25 45 50 30 T 85 40 T 110 35"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.12"
          className="text-primary"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.2, delay: 0.2, ease: "easeOut" }}
        />
        <motion.path
          d="M -10 65 Q 30 55 55 70 T 90 60 T 110 70"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.12"
          className="text-primary"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.2, delay: 0.3, ease: "easeOut" }}
        />
        <motion.path
          d="M -10 80 Q 35 90 60 75 T 95 85 T 110 80"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.15"
          className="text-primary"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.4, ease: "easeOut" }}
        />

        {/* Vertical accent lines */}
        <motion.line
          x1="20"
          y1="0"
          x2="25"
          y2="100"
          stroke="currentColor"
          strokeWidth="0.08"
          className="text-primary"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />
        <motion.line
          x1="75"
          y1="0"
          x2="80"
          y2="100"
          stroke="currentColor"
          strokeWidth="0.08"
          className="text-primary"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: 0.6 }}
        />

        {/* Diagonal lines */}
        <motion.line
          x1="0"
          y1="0"
          x2="40"
          y2="50"
          stroke="currentColor"
          strokeWidth="0.06"
          className="text-primary"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.8, delay: 0.7 }}
        />
        <motion.line
          x1="100"
          y1="100"
          x2="60"
          y2="50"
          stroke="currentColor"
          strokeWidth="0.06"
          className="text-primary"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.8, delay: 0.8 }}
        />

        {/* Circle accents */}
        <motion.circle
          cx="20"
          cy="25"
          r="3"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.08"
          className="text-primary"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        />
        <motion.circle
          cx="80"
          cy="75"
          r="4"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.08"
          className="text-primary"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        />
        <motion.circle
          cx="50"
          cy="50"
          r="8"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.05"
          className="text-primary"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        />
      </svg>

      {/* Soft gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/2 via-transparent to-primary/1" />
    </div>
  );
}

// Simple stat display (animation handled by parent motion.div)
function AnimatedNumber({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  return (
    <span>
      {value}
      {suffix}
    </span>
  );
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);

  const features = [
    { label: "Visual", desc: "See algorithms work" },
    { label: "Interactive", desc: "Adjust & experiment" },
    { label: "Intuitive", desc: "Build understanding" },
  ];

  return (
    <main ref={containerRef} className="min-h-screen">
      {/* ================= HERO ================= */}
      <section className="relative min-h-[min(90vh,800px)] h-[clamp(500px,80vh,900px)] flex items-center justify-center overflow-hidden">
        <MLBackground />

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
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tighter leading-[1.1] sm:leading-[1.05] drop-shadow-sm"
          >
            Learn by{" "}
            <span className="relative inline-block">
              <span className="relative z-10 font-medium text-primary">
                seeing
              </span>
              <motion.span
                className="absolute bottom-1 sm:bottom-2 left-0 w-full h-2 sm:h-3 bg-primary/20 z-0"
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
            className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-muted-foreground/90 max-w-2xl mx-auto leading-relaxed font-normal px-2"
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

        {/* Scroll indicator */}
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
      </section>

      {/* ================= STATS BAR ================= */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="border-y border-border/60 bg-muted/30"
      >
        <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-3 gap-8 text-center">
          {[
            { value: 6, suffix: "+", label: "Simulations" },
            { value: 6, suffix: "+", label: "In-depth Articles" },
            { value: 100, suffix: "%", label: "Free & Open" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-3xl md:text-4xl font-light text-foreground">
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ================= WHY VISUAL LEARNING ================= */}
      <section className="px-6 lg:px-12 py-24 md:py-32">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-xl mb-16"
          >
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-primary">
              Our Approach
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl font-light tracking-tight">
              Understanding through
              <br />
              <span className="font-medium">observation</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12 md:gap-8">
            {[
              {
                num: "01",
                title: "See the Math",
                desc: "Watch gradient descent converge. See decision boundaries form in real-time. Understand through direct observation.",
              },
              {
                num: "02",
                title: "Experiment Freely",
                desc: "Change learning rates, add noise, modify data. See how each parameter affects the outcome instantly.",
              },
              {
                num: "03",
                title: "Build Intuition",
                desc: "Move beyond memorizing formulas. Develop deep understanding that transfers to real problems.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="group"
              >
                <span className="text-2xl h1 font-mono text-primary/60">
                  {item.num}
                </span>
                <h3 className="mt-3 text-xl font-medium tracking-tight group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="mt-3 text-muted-foreground leading-relaxed text-sm">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURED CONTENT ================= */}
      <section className="px-6 lg:px-12 py-24 bg-muted/20 border-y border-border/40">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
          >
            <div>
              <span className="text-xs font-medium tracking-[0.2em] uppercase text-primary">
                Start Learning
              </span>
              <h2 className="mt-4 text-3xl md:text-4xl font-light tracking-tight">
                Explore <span className="font-medium">Topics</span>
              </h2>
            </div>
            <Button
              variant="ghost"
              asChild
              className="w-fit gap-2 group rounded-full"
            >
              <Link href="/learn" scroll={true}>
                View all articles
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {learningCards.map((card, index) => (
              <motion.div
                key={card.href}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <LearningCard {...card} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="px-6 lg:px-12 py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-light tracking-tight">
            Ready to <span className="font-medium text-primary">explore</span>?
          </h2>
          <p className="mt-4 text-muted-foreground">
            No signup required. Jump straight into any simulation.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <Button
              size="lg"
              asChild
              className="h-11 px-10 text-base gap-3 rounded-full group"
            >
              <Link href="/simulations" scroll={true}>
                Start Learning
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>
    </main>
  );
}
