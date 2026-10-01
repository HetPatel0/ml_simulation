"use client";

import { useCallback, useDeferredValue, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, SearchX } from "lucide-react";
import { LearningCard } from "@/components/cards/learning-card";
import { QuickTags } from "@/components/listings/quick-tags";
import { useSearchShortcut } from "@/lib/hooks/use-search-shortcut";

export interface Article {
  id: string;
  title: string;
  description: string;
  image: string;
  badge: string;
  category:
    | "beginner"
    | "regression"
    | "classification"
    | "clustering"
    | "testing"
    | "tuning"
    | "cleaning"
    | "other";
}

const CATEGORY_TITLES: Record<Article["category"], string> = {
  beginner: "Beginner",
  regression: "Regression",
  classification: "Classification",
  clustering: "Clustering",
  testing: "Testing",
  tuning: "Fine Tuning HyperParameters",
  cleaning: "Cleaning Datas",
  other: "Advanced & Experimental",
};

export function ArticleBrowser({ articles }: { articles: Article[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  // Stable callback so the global keydown listener isn't re-registered per render.
  const clearSearch = useCallback(() => setSearchQuery(""), []);
  const searchInputRef = useSearchShortcut(clearSearch);
  // Keep typing responsive while filtering cards + images.
  const deferredQuery = useDeferredValue(searchQuery.trim().toLowerCase());

  const groupedArticles = useMemo(() => {
    const groups: Record<Article["category"], Article[]> = {
      beginner: [],
      regression: [],
      classification: [],
      clustering: [],
      testing: [],
      tuning: [],
      cleaning: [],
      other: [],
    };
    for (const article of articles) {
      if (
        deferredQuery &&
        !article.title.toLowerCase().includes(deferredQuery) &&
        !article.description.toLowerCase().includes(deferredQuery) &&
        !article.badge.toLowerCase().includes(deferredQuery) &&
        !article.category.toLowerCase().includes(deferredQuery)
      ) {
        continue;
      }
      groups[article.category].push(article);
    }
    return groups;
  }, [articles, deferredQuery]);

  // Quick tags use card badges only — no freeform terms.
  const badgeTags = useMemo(
    () => Array.from(new Set(articles.map((a) => a.badge))),
    [articles],
  );

  const resultCount = useMemo(
    () =>
      (Object.keys(CATEGORY_TITLES) as Article["category"][]).reduce(
        (n, c) => n + groupedArticles[c].length,
        0,
      ),
    [groupedArticles],
  );

  return (
    <>
      {/* Search */}
      <div className="relative mb-3">
        <Search
          aria-hidden
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
        />

        <Input
          ref={searchInputRef}
          type="text"
          aria-label="Search articles"
          placeholder="Search articles… (⌘+K)"
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

      <QuickTags
        tags={badgeTags}
        activeQuery={searchQuery}
        onSelect={setSearchQuery}
      />

      {/* Sections */}
      <div className="space-y-16">
        {(Object.keys(CATEGORY_TITLES) as Article["category"][]).map(
          (category) => {
            const items = groupedArticles[category];
            if (items.length === 0) return null;

            return (
              <section key={category} className="space-y-6">
                <h2 className="text-2xl font-semibold tracking-tight">
                  {CATEGORY_TITLES[category]}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((article, i) => (
                    <LearningCard
                      key={article.id}
                      title={article.title}
                      description={article.description}
                      href={`/learn/${article.id}`}
                      image={article.image}
                      badge={article.badge}
                      priority={category === "regression" && i === 0}
                    />
                  ))}
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
              No articles found
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
