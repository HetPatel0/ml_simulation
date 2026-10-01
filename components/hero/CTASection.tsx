"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="border-y border-border bg-muted/30">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto px-6 py-12 text-center"
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
            className="h-11 px-10 text-base gap-3 rounded-full group shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <Link href="/simulations" scroll={true}>
              Start Learning
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
