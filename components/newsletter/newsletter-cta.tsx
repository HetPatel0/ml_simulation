"use client";

import { motion } from "framer-motion";
import { KitEmbedForm } from "@/components/newsletter/kit-embed-form";

/**
 * Newsletter band just before the main CTA on home.
 * Theme-aware band (white in light mode, black in dark mode), max-w-5xl
 * inner. Two-column on desktop, tightened type scale on mobile so
 * heading > sub > form reads in order. Same entrance motion as CTASection.
 */
export function NewsletterCTA() {
  return (
    <motion.section
      aria-labelledby="newsletter-heading"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="border-y border-border bg-white dark:border-neutral-800 dark:bg-black"
    >
      <div className="mx-auto grid max-w-5xl items-center gap-6 px-6 py-10 md:gap-8 md:py-12 md:grid-cols-2">
        <div className="text-center md:text-left">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground dark:text-neutral-400">
            Stay in loop
          </p>
          <h2 id="newsletter-heading" className="mt-2 text-2xl font-light tracking-tight text-foreground sm:text-2xl md:mt-2 md:text-3xl dark:text-neutral-50">
            New guides, <span className="font-medium text-primary">one email</span>
          </h2>
          <p className="mx-auto mt-1.5 max-w-md text-sm text-muted-foreground md:mx-0 md:mt-2 dark:text-neutral-400">
            One email per article. No spam, unsubscribe anytime.
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
        >
          <KitEmbedForm hideChrome className="kit-on-dark kit-centered mx-auto w-full md:mx-0" />
        </motion.div>
      </div>
    </motion.section>
  );
}
