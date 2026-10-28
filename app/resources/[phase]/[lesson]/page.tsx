import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import {
  ResourcesShell,
  ResourcesSkeleton,
  ResourcesView,
  resourcesMetadata,
} from "@/components/resources/resources-page";
import {
  lessonPath,
  moduleById,
  phaseIdFromSlug,
  phaseSlug,
  resourceSteps,
  stepById,
} from "@/lib/resources";

type Params = {
  phase: string;
  lesson: string;
};

export function generateStaticParams() {
  return resourceSteps.map((step) => ({
    phase: phaseSlug(step.module),
    lesson: step.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { phase, lesson } = await params;
  const phaseId = phaseIdFromSlug(phase);
  const active = phaseId ? moduleById.get(phaseId) : undefined;
  const step = stepById.get(lesson);
  return resourcesMetadata(active, step);
}

async function LessonView({ params }: { params: Promise<Params> }) {
  const { phase, lesson } = await params;
  const phaseId = phaseIdFromSlug(phase);
  const active = phaseId ? moduleById.get(phaseId) : undefined;
  if (!active) notFound();

  const step = stepById.get(lesson);
  if (!step) notFound();
  if (step.module !== active.id) redirect(lessonPath(step.module, step.id));

  return <ResourcesView phase={active} lesson={step} />;
}

export default function LessonPage({ params }: { params: Promise<Params> }) {
  return (
    <ResourcesShell>
      <Suspense fallback={<ResourcesSkeleton />}>
        <LessonView params={params} />
      </Suspense>
    </ResourcesShell>
  );
}
