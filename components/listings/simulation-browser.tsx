"use client";

import { useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, SearchX } from "lucide-react";
import { LearningCard } from "@/components/cards/learning-card";
import { useSearchShortcut } from "@/lib/hooks/use-search-shortcut";

export interface Simulation {
  id: string;
  title: string;
  description: string;
  image: string;
  badge: string;
  category: "regression" | "classification" | "clustering" | "testing" | "other";
}

const PLOTLY_SRC = "https://cdn.plot.ly/plotly-gl3d-2.27.0.min.js";
// 3D sims need the Plotly CDN bundle — preconnect on listing mount and
// preload on card hover so it's cached before navigation (perceived instant).
const PLOTLY_SIMS = new Set(["kernel-trick", "svr-kernel-lift"]);

function ensurePreconnect() {
  if (document.querySelector('link[data-plotly-preconnect]')) return;
  for (const rel of ["preconnect", "dns-prefetch"]) {
    const l = document.createElement("link");
    l.rel = rel;
    l.href = "https://cdn.plot.ly";
    if (rel === "preconnect") l.crossOrigin = "anonymous";
    l.dataset.plotlyPreconnect = "1";
    document.head.appendChild(l);
  }
}

function prefetchPlotly() {
  ensurePreconnect();
  if (document.querySelector('link[data-plotly-preload]')) return;
  const l = document.createElement("link");
  l.rel = "preload";
  l.as = "script";
  l.href = PLOTLY_SRC;
  l.dataset.plotlyPreload = "1";
  document.head.appendChild(l);
}
const CATEGORY_TITLES: Record<Simulation["category"], string> = {
  regression: "Regression",
  classification: "Classification",
  clustering: "Clustering",
  testing: "Testing",
  other: "Advanced & Experimental",
};

const EMPTY_GROUPS: Record<Simulation["category"], Simulation[]> = {
  regression: [],
  classification: [],
  clustering: [],
  testing: [],
  other: [],
};

export function SimulationBrowser({
  simulations,
}: {
  simulations: Simulation[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  // Stable callback so the global keydown listener isn't re-registered per render.
  const clearSearch = useCallback(() => setSearchQuery(""), []);
  const searchInputRef = useSearchShortcut(clearSearch);
  // Warm up the Plotly CDN connection while the user browses the listing.
  useEffect(() => {
    ensurePreconnect();
  }, []);
  // Keep typing responsive while filtering 10+ cards + images.
  const deferredQuery = useDeferredValue(searchQuery.trim().toLowerCase());

  const groupedSimulations = useMemo(() => {
    const groups: Record<Simulation["category"], Simulation[]> = {
      regression: [],
      classification: [],
      clustering: [],
      testing: [],
      other: [],
    };
    for (const sim of simulations) {
      if (
        deferredQuery &&
        !sim.title.toLowerCase().includes(deferredQuery) &&
        !sim.description.toLowerCase().includes(deferredQuery) &&
        !sim.category.toLowerCase().includes(deferredQuery)
      ) {
        continue;
      }
      groups[sim.category].push(sim);
    }
    return groups;
  }, [simulations, deferredQuery]);

  const resultCount = useMemo(
    () =>
      (Object.keys(EMPTY_GROUPS) as Simulation["category"][]).reduce(
        (n, c) => n + groupedSimulations[c].length,
        0,
      ),
    [groupedSimulations],
  );

  return (
    <>
      {/* Search */}
      <div className="relative mb-10 ">
        <Search
          aria-hidden
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
        />

        <Input
          ref={searchInputRef}
          type="text"
          aria-label="Search simulations"
          placeholder="Search simulations… (⌘+K)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10 border-2"
        />

        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Clear search"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Sections */}
      <div className="space-y-16">
        {(Object.keys(CATEGORY_TITLES) as Simulation["category"][]).map(
          (category) => {
            const sims = groupedSimulations[category];
            if (sims.length === 0) return null;

            return (
              <section key={category} className="space-y-6">
                <h2 className="text-2xl font-semibold tracking-tight">
                  {CATEGORY_TITLES[category]}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sims.map((sim, i) => {
                    const card = (
                      <LearningCard
                        title={sim.title}
                        description={sim.description}
                        href={`/simulations/${sim.id}`}
                        image={sim.image}
                        badge={sim.badge}
                        variant="simulation"
                        priority={category === "regression" && i === 0}
                      />
                    );
                    // Hover intent on 3D cards starts the Plotly download
                    // before navigation — cached by the time the sim mounts.
                    return PLOTLY_SIMS.has(sim.id) ? (
                      <div key={sim.id} onMouseEnter={prefetchPlotly}>
                        {card}
                      </div>
                    ) : (
                      <div key={sim.id}>{card}</div>
                    );
                  })}
                </div>
              </section>
            );
          },
        )}
      </div>

      {resultCount === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border/60 py-20 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <SearchX className="h-6 w-6" aria-hidden />
          </div>
          <div className="space-y-1">
            <p className="font-medium text-foreground">
              No simulations found
            </p>
            <p className="text-muted-foreground">
              Nothing matches &quot;{searchQuery}&quot;
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={clearSearch}>
            Clear search
          </Button>
        </div>
      )}
    </>
  );
}
