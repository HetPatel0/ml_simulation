import type { Metadata } from "next";
import { GraduationCap } from "lucide-react";
import { BreadcrumbJsonLd } from "@/components/articles/layout/article-breadcrumb";
import { BackToTop } from "@/components/layout/overlays/back-to-top";
import { CourseNav } from "@/components/resources/course-nav";
import { Curriculum } from "@/components/resources/curriculum";
import { siteConfig } from "@/lib/metadata";
import {
  lessonPath,
  moduleById,
  phasePath,
  resourceModules,
  resourceSteps,
  resourceTotals,
  type ResourceModule,
  type ResourceStep,
} from "@/lib/resources";

export const RESOURCES_TITLE = "ML Curriculum: From Zero to LLM";
export const RESOURCES_DESCRIPTION =
  "A sequential, noob-to-LLM machine learning course: Python, math, data engineering, classical models, deep learning, model families, LLMs, RAG agents, FastAPI, Docker, CI/CD, scaling, reliability, system design, and interview preparation.";

export function resourcesMetadata(
  phase?: ResourceModule,
  lesson?: ResourceStep,
): Metadata {
  if (!phase) {
    return {
      title: RESOURCES_TITLE,
      description: RESOURCES_DESCRIPTION,
      alternates: { canonical: "/resources" },
    };
  }

  const canonical = lesson ? lessonPath(phase.id, lesson.id) : phasePath(phase.id);
  const title = lesson
    ? `${lesson.title} — ${phase.kicker}: ${phase.title}`
    : `${phase.kicker}: ${phase.title} | ML Curriculum`;

  return {
    title,
    description: lesson?.summary ?? phase.summary,
    alternates: { canonical },
    openGraph: {
      title: `${title} | ML Simulations`,
      description: lesson?.summary ?? phase.summary,
      type: "article",
      url: `${siteConfig.url}${canonical}`,
      images: [{ url: "/resources/twitter-image.png", width: 1731, height: 909 }],
    },
    twitter: {
      card: "summary_large_image",
      images: ["/resources/twitter-image.png"],
    },
  };
}

export function ResourcesShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <header className="mb-8">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <GraduationCap className="h-5 w-5" aria-hidden="true" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                ML Curriculum
              </h1>
            </div>
          </div>
          <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">
            A sequential path from “what is a feature?” to LLM applications and
            production systems. Twelve phases, detailed articles, code, videos,
            interview checkpoints, and a quiz after every phase.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {resourceTotals.steps} lessons · {resourceTotals.modules} phases ·{" "}
            {resourceTotals.videos} videos · free, no signup
          </p>
        </header>
        {children}
      </div>
      <BackToTop />
    </div>
  );
}

export function ResourcesSkeleton() {
  return (
    <div className="space-y-4" aria-hidden="true">
      <div className="h-16 animate-pulse rounded-xl bg-muted/50" />
      <div className="h-8 w-48 animate-pulse rounded bg-muted" />
      <div className="h-40 animate-pulse rounded-xl bg-muted/40" />
    </div>
  );
}

export function ResourcesView({
  phase = resourceModules[0],
  lesson,
  atRoot = false,
}: {
  phase?: ResourceModule;
  lesson?: ResourceStep;
  atRoot?: boolean;
}) {
  const active = moduleById.get(phase.id) ?? resourceModules[0];
  const canonical = lesson ? lessonPath(active.id, lesson.id) : phasePath(active.id);

  const phases = resourceModules.map((module) => {
    const steps = resourceSteps.filter((step) => step.module === module.id);
    return {
      id: module.id,
      kicker: module.kicker,
      title: module.title,
      summary: module.summary,
      stepIds: steps.map((step) => step.id),
      stepTitles: steps.map((step) => step.title),
      href: phasePath(module.id),
    };
  });

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Machine Learning: From Zero to LLM",
    description:
      "A free, sequential curriculum covering Python, data, the core math, classical models, deep learning, LLMs, retrieval, agents, FastAPI serving, deployment, scaling, reliability, and system design.",
    provider: {
      "@type": "Organization",
      name: "ML Simulations",
      sameAs: siteConfig.url,
    },
    isAccessibleForFree: true,
    hasPart: resourceModules.map((module) => ({
      "@type": "CourseChapter",
      name: `${module.kicker}: ${module.title}`,
      description: module.summary,
    })),
  };

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Resources", href: "/resources" },
    ...(atRoot
      ? []
      : [{ label: `${active.kicker}: ${active.title}`, href: phasePath(active.id) }]),
    ...(lesson ? [{ label: lesson.title, href: canonical }] : []),
  ];

  return (
    <>
      <BreadcrumbJsonLd siteUrl={siteConfig.url} items={breadcrumbItems} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
      <CourseNav
        phases={phases}
        currentId={active.id}
        shareTitle={`${active.kicker}: ${active.title} — ML Curriculum`}
        sharePath={phasePath(active.id)}
      />
      <Curriculum moduleId={active.id} initialLesson={lesson?.id} />
    </>
  );
}
