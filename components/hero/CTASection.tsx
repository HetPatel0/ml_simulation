import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="border-y border-border bg-muted/30">
      <div className="reveal mx-auto max-w-5xl px-6 py-12 text-center">
        <h2 className="text-3xl font-light tracking-tight md:text-4xl">
          Ready to <span className="font-medium text-primary">explore</span>?
        </h2>
        <p className="mt-4 text-muted-foreground">
          No signup required. Jump straight into any simulation.
        </p>
        <div className="mt-8">
          <Button
            size="lg"
            asChild
            className="group h-10 gap-2 rounded-full px-6 text-sm shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary/40 sm:h-11 sm:gap-3 sm:px-10 sm:text-base"
          >
            <Link href="/simulations" scroll={true}>
              Start Learning
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
