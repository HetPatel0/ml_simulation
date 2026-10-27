import type { Metadata } from "next";
import { HeroSection } from "@/components/hero/HeroSection";
import { StatsSection } from "@/components/hero/StatsSection";
import { ApproachSection } from "@/components/hero/ApproachSection";
import { FeaturedSection } from "@/components/hero/FeaturedSection";
import { NewsletterCTA } from "@/components/newsletter/newsletter-cta";
import { CTASection } from "@/components/hero/CTASection";
import { SeasonalSnowfall } from "@/components/fun/seasonal-snowfall";

export const metadata: Metadata = {
  title: "ML Simulations - Interactive Machine Learning Education",
  description:
    "Watch machine learning algorithms come alive through interactive visualizations. Adjust parameters, see results instantly.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <div className="min-h-screen">
      <SeasonalSnowfall />
      <HeroSection />
      <StatsSection />
      <ApproachSection />
      <FeaturedSection />
      <NewsletterCTA />
      <CTASection />
    </div>
  );
}
