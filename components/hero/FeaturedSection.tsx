import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LearningCard } from "@/components/cards/learning-card";
import { learningCards } from "@/app/cardData";

export function FeaturedSection() {
  return (
    <section className="border-y border-border/40 bg-muted/20 px-6 py-24 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="reveal mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              Start Learning
            </span>
            <h2 className="mt-4 text-3xl font-light tracking-tight md:text-4xl">
              Explore <span className="font-medium">Topics</span>
            </h2>
          </div>
          <Button
            variant="ghost"
            asChild
            className="group w-fit gap-2 rounded-full"
          >
            <Link href="/learn" scroll={true}>
              View all articles
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {learningCards.map((card, index) => (
            <div key={card.href} className="reveal">
              <LearningCard {...card} prefetch={index < 3} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
