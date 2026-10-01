"use client";

import { useCallback, useDeferredValue, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, SearchX } from "lucide-react";
import { LearningCard } from "@/components/cards/learning-card";
import { QuickTags } from "@/components/listings/quick-tags";
import { useSearchShortcut } from "@/lib/hooks/use-search-shortcut";
import type { Cheatsheet } from "@/lib/cheatsheets";

type Category = Cheatsheet["category"];

const CATEGORY_TITLES: Record<Category, string> = {
  regression: "Regression",
  classification: "Classification",
  beginner: "Beginner",
  advanced: "Advanced",
};

const CATEGORY_ORDER: Category[] = ["regression", "classification", "beginner", "advanced"];

export function CheatsheetBrowser({ items }: { items: Cheatsheet[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const clearSearch = useCallback(() => setSearchQuery(""), []);
  const searchInputRef = useSearchShortcut(clearSearch);
  const deferredQuery = useDeferredValue(searchQuery.trim().toLowerCase());

  const grouped = useMemo(() => {
    const groups: Record<Category, Cheatsheet[]> = {
      regression: [],
      classification: [],
      beginner: [],
      advanced: [],
    };
    for (const c of items) {
      if (
        deferredQuery &&
        !c.title.toLowerCase().includes(deferredQuery) &&
        !c.description.toLowerCase().includes(deferredQuery) &&
        !c.badge.toLowerCase().includes(deferredQuery) &&
        !c.category.toLowerCase().includes(deferredQuery) &&
        !c.params.some(
          (p) =>
            p.name.toLowerCase().includes(deferredQuery) ||
            p.description.toLowerCase().includes(deferredQuery),
        )
      ) {
        continue;
      }
      groups[c.category].push(c);
    }
    return groups;
  }, [items, deferredQuery]);

  // Quick tags use card badges only — no freeform terms.
  const badgeTags = useMemo(
    () => Array.from(new Set(items.map((c) => c.badge))),
    [items],
  );

  const resultCount = useMemo(
    () => CATEGORY_ORDER.reduce((n, c) => n + grouped[c].length, 0),
    [grouped],
  );

  return (
    <>
      {/* Search, same as Learn / Simulations */}
      <div className="relative mb-3">
        <Search
          aria-hidden
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          ref={searchInputRef}
          type="text"
          aria-label="Search cheatsheets"
          placeholder="Search cheatsheets… (⌘+K)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-2 pl-10 pr-10"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Clear search"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <QuickTags
        tags={badgeTags}
        activeQuery={searchQuery}
        onSelect={setSearchQuery}
      />

      {/* Sections */}
      <div className="space-y-16">
        {CATEGORY_ORDER.map((category) => {
          const list = grouped[category];
          if (list.length === 0) return null;
          return (
            <section key={category} className="space-y-6">
              <h2 className="text-2xl font-semibold tracking-tight">
                {CATEGORY_TITLES[category]}
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {list.map((c, i) => (
                  <LearningCard
                    key={c.slug}
                    title={c.title}
                    description={c.description}
                    href={`/cheatsheets/${c.slug}`}
                    image={c.image}
                    badge={c.badge}
                    priority={category === "regression" && i === 0}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {resultCount === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border/60 py-20 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <SearchX className="h-6 w-6" aria-hidden />
          </div>
          <div className="space-y-1">
            <p className="font-medium text-foreground">No cheatsheets found</p>
            <p className="text-muted-foreground">Nothing matches &quot;{searchQuery}&quot;</p>
          </div>
          <Button variant="outline" size="sm" onClick={clearSearch}>
            Clear search
          </Button>
        </div>
      )}
    </>
  );
}
