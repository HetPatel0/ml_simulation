"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AmbientGlow } from "@/components/common/ambient-glow";

export function CTASection() {
  return (
    <section className="px-6 lg:px-12 py-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative max-w-3xl mx-auto"
      >
        {/* Orbs behind the panel get frosted by the glass */}
        <AmbientGlow className="inset-x-8 top-6 bottom-0" compact />
        <div className="relative glass rounded-[2rem] px-8 py-16 md:py-20 text-center overflow-hidden">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-light tracking-tight">
              Ready to{" "}
              <span className="font-medium text-primary">explore</span>?
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
          </div>
        </div>
      </motion.div>
    </section>
  );
}
