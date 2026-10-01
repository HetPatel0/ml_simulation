import type { MetadataRoute } from "next";
import { simulationMetadata, articleMetadata, siteConfig } from "@/lib/metadata";
import { cheatsheetMetadata } from "@/lib/cheatsheets";

// Static last-modified dates: bumping only when a section actually changes
// keeps sitemap.xml cacheable instead of invalidating crawlers daily.
const LAST_MODIFIED = {
  home: new Date("2026-09-20"),
  listings: new Date("2026-09-20"),
  about: new Date("2026-09-10"),
  articles: new Date("2026-09-18"),
  simulations: new Date("2026-09-18"),
  cheatsheets: new Date("2026-10-01"),
  newsletter: new Date("2026-10-01"),
  privacy: new Date("2026-10-01"),
} as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const simulations = Object.keys(simulationMetadata);
  const articles = Object.keys(articleMetadata);
  const cheatsheets = Object.keys(cheatsheetMetadata);

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteConfig.url, lastModified: LAST_MODIFIED.home, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/simulations`, lastModified: LAST_MODIFIED.listings, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteConfig.url}/learn`, lastModified: LAST_MODIFIED.listings, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteConfig.url}/cheatsheets`, lastModified: LAST_MODIFIED.cheatsheets, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteConfig.url}/newsletter`, lastModified: LAST_MODIFIED.newsletter, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteConfig.url}/about`, lastModified: LAST_MODIFIED.about, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteConfig.url}/privacy`, lastModified: LAST_MODIFIED.privacy, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteConfig.url}/sitemap-page`, lastModified: LAST_MODIFIED.listings, changeFrequency: "monthly", priority: 0.3 },
  ];

  const simulationPages: MetadataRoute.Sitemap = simulations.map((slug) => ({
    url: `${siteConfig.url}/simulations/${slug}`,
    lastModified: LAST_MODIFIED.simulations,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const articlePages: MetadataRoute.Sitemap = articles.map((slug) => ({
    url: `${siteConfig.url}/learn/${slug}`,
    lastModified: LAST_MODIFIED.articles,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const cheatsheetPages: MetadataRoute.Sitemap = cheatsheets.map((slug) => ({
    url: `${siteConfig.url}/cheatsheets/${slug}`,
    lastModified: LAST_MODIFIED.cheatsheets,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...simulationPages, ...articlePages, ...cheatsheetPages];
}
