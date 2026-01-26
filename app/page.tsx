"use client";

import { useRef } from "react";
import { HeroSection } from "@/components/hero/HeroSection";
import { StatsSection } from "@/components/hero/StatsSection";
import { ApproachSection } from "@/components/hero/ApproachSection";
import { FeaturedSection } from "@/components/hero/FeaturedSection";
import { CTASection } from "@/components/hero/CTASection";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <main ref={containerRef} className="min-h-screen">
      <HeroSection containerRef={containerRef} />
      <StatsSection />
      <ApproachSection />
      <FeaturedSection />
      <CTASection />
    </main>
  );
}
