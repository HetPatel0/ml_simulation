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
            className="group h-11 gap-3 rounded-full px-10 text-base shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <Link href="/simulations" scroll={true}>
              Start Learning
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
