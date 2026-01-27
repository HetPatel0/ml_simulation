"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LearningCard } from "@/components/learning-card";
import { learningCards } from "@/app/cardData";

export function FeaturedSection() {
  return (
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
  );
}
