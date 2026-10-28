import type { Metadata } from "next";
import { GitCompareArrows } from "lucide-react";
import { ModelComparisonBrowser } from "@/components/model-comparison/model-comparison-browser";
import { modelCatalog } from "@/lib/model-comparison";
import { BackToTop } from "@/components/layout/overlays";

export const metadata: Metadata = {
  title: "Compare ML Models",
  description: "Compare any three ML models and subtypes by use case, trade-offs, parameters, and practical tips.",
  alternates: { canonical: "/model-comparison" },
};

export default function ModelComparisonPage() {
  return <div className="container mx-auto max-w-5xl px-4 py-8">
    <header className="mb-10">
      <div className="mb-2 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><GitCompareArrows className="h-5 w-5" /></div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Compare ML models</h1>
      </div>
      <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">Choose any three models or subtypes and compare them like a specification sheet — from the right use case down to the parameter that changes their behavior most.</p>
    </header>
    <main><ModelComparisonBrowser models={modelCatalog} /></main>
    <BackToTop />
  </div>;
}
