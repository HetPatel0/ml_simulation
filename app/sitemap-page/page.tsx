import type { Metadata } from "next";
import Link from "next/link";
import { Map } from "lucide-react";
import { articleMetadata, simulationMetadata, siteConfig } from "@/lib/metadata";
import { cheatsheetList } from "@/lib/cheatsheets";

export const metadata: Metadata = {
  title: "Sitemap",
  description: "Every article, simulation, and cheatsheet on ML Simulations.",
  alternates: { canonical: "/sitemap-page" },
};

export default function SitemapPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Map className="h-5 w-5" />
          </div>
          <h1 className="text-4xl font-bold">Sitemap</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Prefer machines? See <a className="underline" href="/sitemap.xml">sitemap.xml</a>.
        </p>
      </div>
      <div className="mt-8 grid gap-10 sm:grid-cols-2">
        <section>
          <h2 className="text-xl font-semibold">Learn</h2>
          <ul className="mt-3 space-y-2">
            <li><Link className="underline underline-offset-4" href="/learn">All articles</Link></li>
            {Object.entries(articleMetadata).map(([slug, m]) => (
              <li key={slug}><Link className="text-muted-foreground hover:text-foreground" href={`/learn/${slug}`}>{m.title}</Link></li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-semibold">Simulations</h2>
          <ul className="mt-3 space-y-2">
            <li><Link className="underline underline-offset-4" href="/simulations">All simulations</Link></li>
            {Object.entries(simulationMetadata).map(([slug, m]) => (
              <li key={slug}><Link className="text-muted-foreground hover:text-foreground" href={`/simulations/${slug}`}>{m.title}</Link></li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-semibold">Cheatsheets</h2>
          <ul className="mt-3 space-y-2">
            <li><Link className="underline underline-offset-4" href="/cheatsheets">All cheatsheets</Link></li>
            {cheatsheetList.map((c) => (
              <li key={c.slug}><Link className="text-muted-foreground hover:text-foreground" href={`/cheatsheets/${c.slug}`}>{c.title}</Link></li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="text-xl font-semibold">Site</h2>
          <ul className="mt-3 space-y-2">
            {[["Home", "/"], ["About", "/about"]].map(([label, href]) => (
              <li key={href}><Link className="text-muted-foreground hover:text-foreground" href={href}>{label}</Link></li>
            ))}
          </ul>
        </section>
      </div>
      <p className="mt-8 text-sm text-muted-foreground">Canonical host: {siteConfig.url}</p>
    </div>
  );
}
