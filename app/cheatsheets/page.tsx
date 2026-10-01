import type { Metadata } from "next";
import { Zap } from "lucide-react";
import { cheatsheetList } from "@/lib/cheatsheets";
import { CheatsheetBrowser } from "@/components/cheatsheets/cheatsheet-browser";

export const metadata: Metadata = {
  title: "ML Cheatsheets",
  description: "Copy-paste sklearn params, snippets, and tuning tips for every ML Simulations article.",
  alternates: { canonical: "/cheatsheets" },
};

export default function CheatsheetsPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Zap className="h-5 w-5" />
          </div>
          <h1 className="text-4xl font-bold">ML Cheatsheets</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Copy-paste sklearn params, snippets, and tuning tips for every ML Simulations article.
        </p>
      </div>
      <CheatsheetBrowser items={cheatsheetList} />
    </div>
  );
}
