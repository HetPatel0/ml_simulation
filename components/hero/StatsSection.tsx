"use client";

import { motion } from "framer-motion";

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

const stats = [
  { value: 10, suffix: "+", label: "Simulations" },
  { value: 9, suffix: "+", label: "In-depth Articles" },
  { value: 100, suffix: "%", label: "Free & Open" },
];

export function StatsSection() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="px-6 py-16 md:py-20"
    >
      <div
        className="relative max-w-5xl mx-auto glass rounded-3xl py-10 px-4 grid grid-cols-3 divide-x divide-border/30 text-center"
        style={{
          backgroundImage:
            "radial-gradient(80% 140% at 15% 0%, oklch(0.6723 0.1606 245 / 0.08), transparent 60%), radial-gradient(70% 130% at 85% 100%, oklch(0.6907 0.1554 160.3454 / 0.07), transparent 55%)",
        }}
      >
        {stats.map((stat, i) => (
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
  );
}
