"use client";

import { Button } from "@/components/ui/button";

/**
 * Quick tag pills rendered under the listing searchbar.
 * Clicking a tag fills the search query; clicking the active tag clears it.
 */
export function QuickTags({
  tags,
  activeQuery,
  onSelect,
  label = "Popular",
}: {
  tags: string[];
  activeQuery: string;
  onSelect: (tag: string | "") => void;
  label?: string;
}) {
  if (tags.length === 0) return null;
  const active = activeQuery.trim().toLowerCase();
  return (
    <div className="mb-10 flex flex-wrap items-center gap-2" aria-label="Quick searches">
      <span className="text-xs font-medium  tracking-wider text-muted-foreground">
        {label}:
      </span>
      {tags.map((tag) => {
        const isActive = active === tag.toLowerCase();
        return (
          <Button
            key={tag}
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={() => onSelect(isActive ? "" : tag)}
            aria-pressed={isActive}
            className="h-7 rounded-full px-3 text-xs"
          >
            {tag}
          </Button>
        );
      })}
    </div>
  );
}
