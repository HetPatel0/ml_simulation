import type { MetadataRoute } from "next";
import { simulationMetadata, articleMetadata, siteConfig } from "@/lib/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const simulations = Object.keys(simulationMetadata);
  const articles = Object.keys(articleMetadata);

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/simulations`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/learn`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const simulationPages: MetadataRoute.Sitemap = simulations.map((slug) => ({
    url: `${siteConfig.url}/simulations/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const articlePages: MetadataRoute.Sitemap = articles.map((slug) => ({
    url: `${siteConfig.url}/learn/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...simulationPages, ...articlePages];
}
