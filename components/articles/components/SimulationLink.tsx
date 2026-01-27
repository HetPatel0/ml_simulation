"use client";

import Link from "next/link";
import { Play, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { simulationMetadata } from "@/lib/metadata";

interface SimulationLinkProps {
  simulationSlug: string;
  title?: string;
  description?: string;
  variant?: "default" | "compact";
  className?: string;
}

export function SimulationLink({
  simulationSlug,
  title,
  description,
  variant = "default",
  className,
}: SimulationLinkProps) {
  const meta = simulationMetadata[simulationSlug];
  const displayTitle = title || meta?.title || simulationSlug;
  const displayDescription =
    description || meta?.description || "Try the interactive simulation";

  if (variant === "compact") {
    return (
      <Link
        href={`/simulations/${simulationSlug}`}
        className={cn(
          "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all",
          "bg-primary text-primary-foreground hover:bg-primary/90",
          "hover:gap-3",
          className
        )}
      >
        <Play className="h-4 w-4" />
        Try Simulation
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    );
  }

  return (
    <Link
      href={`/simulations/${simulationSlug}`}
      className={cn(
        "group block my-6 p-6 rounded-xl border-2 border-dashed transition-all",
        "border-primary/30 hover:border-primary bg-primary/5 hover:bg-primary/10",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary group-hover:scale-110 transition-transform">
            <Play className="h-6 w-6 ml-0.5" />
          </div>
          <div>
            <h4 className="font-semibold text-lg group-hover:text-primary transition-colors">
              {displayTitle}
            </h4>
            <p className="text-sm text-muted-foreground">{displayDescription}</p>
          </div>
        </div>
        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  );
}

// Component for multiple simulation links
export function SimulationLinks({
  simulations,
  className,
}: {
  simulations: Array<{ slug: string; description?: string }>;
  className?: string;
}) {
  return (
    <div className={cn("space-y-3 my-6", className)}>
      {simulations.map((sim) => (
        <SimulationLink
          key={sim.slug}
          simulationSlug={sim.slug}
          description={sim.description}
        />
      ))}
    </div>
  );
}
