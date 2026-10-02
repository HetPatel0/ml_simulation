import dynamic from "next/dynamic";
import type { ComponentType, ReactNode } from "react";

type ModuleImporter = () => Promise<{ default: ComponentType }>;

type DynamicMapOptions = {
  /** Skeleton shown while the chunk loads. */
  loading: () => ReactNode;
  /** False for client-only sims; defaults to true (server-rendered). */
  ssr?: boolean;
  /**
   * Wrap the loaded component, e.g. to append a quiz inside the same
   * chunk. Runs once per entry at module load, not per render.
   */
  decorate?: (Body: ComponentType, slug: string) => ComponentType;
};

/**
 * Shared slug → lazily-loaded component map. Powers both the article
 * client (`decorate` appends the quiz) and the simulation client
 * (`ssr: false` + outer error boundary). Each slug stays in its own
 * chunk; visiting one route never bundles the others.
 */
export function dynamicMap(
  entries: Record<string, ModuleImporter>,
  { loading, ssr, decorate }: DynamicMapOptions,
): Record<string, ComponentType> {
  const out: Record<string, ComponentType> = {};
  for (const [slug, importer] of Object.entries(entries)) {
    const load: ModuleImporter = decorate
      ? () =>
          importer().then((mod) => ({
            default: decorate(mod.default, slug),
          }))
      : importer;
    out[slug] = dynamic(load, { ssr, loading });
  }
  return out;
}

/** Render the mapped component for a slug, or nothing when unknown. */
export function ContentFromMap({
  map,
  slug,
}: {
  map: Record<string, ComponentType>;
  slug: string;
}) {
  const C = map[slug];
  if (!C) return null;
  return <C />;
}
