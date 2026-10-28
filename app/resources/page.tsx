import { Suspense } from "react";
import { redirect } from "next/navigation";
import {
  ResourcesShell,
  ResourcesSkeleton,
  ResourcesView,
  resourcesMetadata,
} from "@/components/resources/resources-page";
import { moduleById, phaseIdFromSlug, phasePath } from "@/lib/resources";

export const metadata = resourcesMetadata();

type SearchParams = {
  phase?: string | string[];
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

async function ResourcesRoot({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const requested = firstParam((await searchParams).phase);
  if (requested) {
    const phaseId = phaseIdFromSlug(requested) ?? requested;
    const phase = moduleById.get(phaseId);
    if (phase) redirect(phasePath(phase.id));
  }

  return <ResourcesView atRoot />;
}

export default function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  return (
    <ResourcesShell>
      <Suspense fallback={<ResourcesSkeleton />}>
        <ResourcesRoot searchParams={searchParams} />
      </Suspense>
    </ResourcesShell>
  );
}
