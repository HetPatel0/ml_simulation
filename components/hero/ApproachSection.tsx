"use client";

import { motion } from "framer-motion";

const approaches = [
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
];

export function ApproachSection() {
  return (
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
          {approaches.map((item, i) => (
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
  );
}
