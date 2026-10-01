"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { ParameterTable } from "@/components/articles/components/ParameterTable";
import type { Cheatsheet } from "@/lib/cheatsheets";

export function CheatsheetParams({ sheet }: { sheet: Cheatsheet }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sheet.params;
    return sheet.params.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.impact ?? "").toLowerCase().includes(q),
    );
  }, [sheet.params, query]);

  return (
    <div>
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Filter params in this sheet…"
        aria-label="Filter params"
        className="max-w-sm"
      />
      <ParameterTable parameters={filtered} />
      {filtered.length === 0 && (
        <p className="text-sm text-muted-foreground">No params match &quot;{query}&quot;.</p>
      )}
    </div>
  );
}
