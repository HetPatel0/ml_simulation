"use client";

import {
  ContentBrowser,
  type BrowserCategory,
  type BrowserItem,
} from "@/components/listings/content-browser";
import type { Cheatsheet } from "@/lib/cheatsheets";

const CATEGORIES: BrowserCategory[] = [
  { value: "regression", title: "Regression" },
  { value: "classification", title: "Classification" },
  { value: "beginner", title: "Beginner" },
  { value: "advanced", title: "Advanced" },
];

function matchesParams(item: BrowserItem, query: string) {
  const sheet = item as unknown as Cheatsheet;
  return sheet.params.some(
    (p) =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query),
  );
}

export function CheatsheetBrowser({ items }: { items: Cheatsheet[] }) {
  return (
    <ContentBrowser
      items={items.map((c) => ({ ...c, id: c.slug }))}
      categories={CATEGORIES}
      searchNoun="cheatsheets"
      emptyTitle="No cheatsheets found"
      hrefFor={(c) => `/cheatsheets/${c.id}`}
      eagerCategory="regression"
      matchesExtra={matchesParams}
    />
  );
}
