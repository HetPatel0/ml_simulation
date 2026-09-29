"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { HeroSection } from "@/components/hero/HeroSection";
import { CardGridSkeleton } from "@/components/ui/loading-skeleton";

// Below-fold sections are code-split so the initial client bundle only
// carries the hero. `ssr: true` (default) keeps them server-rendered for SEO;
// chunks hydrate lazily after first paint.
const StatsSection = dynamic(() =>
  import("@/components/hero/StatsSection").then((m) => ({
    default: m.StatsSection,
  })),
);
const ApproachSection = dynamic(() =>
  import("@/components/hero/ApproachSection").then((m) => ({
    default: m.ApproachSection,
  })),
);
const FeaturedSection = dynamic(
  () =>
    import("@/components/hero/FeaturedSection").then((m) => ({
      default: m.FeaturedSection,
    })),
  { loading: () => <CardGridSkeleton count={6} /> },
);
const CTASection = dynamic(() =>
  import("@/components/hero/CTASection").then((m) => ({
    default: m.CTASection,
  })),
);

export function HomeClient() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="min-h-screen">
      <HeroSection containerRef={containerRef} />
      <StatsSection />
      <ApproachSection />
      <FeaturedSection />
      <CTASection />
    </div>
  );
}
