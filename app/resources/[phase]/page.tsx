import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ResourcesShell,
  ResourcesSkeleton,
  ResourcesView,
  resourcesMetadata,
} from "@/components/resources/resources-page";
import {
  moduleById,
  phaseIdFromSlug,
  phaseSlug,
  resourceModules,
} from "@/lib/resources";

type Params = {
  phase: string;
};

export function generateStaticParams() {
  return resourceModules.map((module) => ({ phase: phaseSlug(module.id) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { phase } = await params;
  const phaseId = phaseIdFromSlug(phase);
  const active = phaseId ? moduleById.get(phaseId) : undefined;
  return resourcesMetadata(active);
}

async function PhaseView({ params }: { params: Promise<Params> }) {
  const { phase } = await params;
  const phaseId = phaseIdFromSlug(phase);
  const active = phaseId ? moduleById.get(phaseId) : undefined;
  if (!active) notFound();

  return <ResourcesView phase={active} />;
}

export default function PhasePage({ params }: { params: Promise<Params> }) {
  return (
    <ResourcesShell>
      <Suspense fallback={<ResourcesSkeleton />}>
        <PhaseView params={params} />
      </Suspense>
    </ResourcesShell>
  );
}
