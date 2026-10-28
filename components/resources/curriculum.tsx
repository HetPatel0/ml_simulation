import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  Hammer,
  MessageSquare,
  PlayCircle,
  Sparkles,
} from "lucide-react";
import { CalloutBox } from "@/components/articles/components/CalloutBox";
import { ArticleShare } from "@/components/articles/layout/article-share";
import { CodeBlock } from "@/components/articles/components/CodeBlock";
import { MathBlock } from "@/components/articles/components/MathBlock";
import { QuizBlock } from "@/components/articles/components/QuizBlock";
import { ExternalSourceLink } from "@/components/articles/layout/external-source-link";
import { YouTubeEmbed } from "@/components/resources/youtube-embed";
import { LessonProgress, StepDone } from "@/components/resources/lesson-progress";
import { PhaseScrollReset } from "@/components/resources/phase-scroll-reset";
import { ArticleListen } from "@/components/articles/layout/article-listen";
import { resourceAudio } from "@/lib/resource-audio";
import {
  mathToolkit,
  modelFamilies,
  moduleById,
  phaseFunFacts,
  phaseQuizzes,
  lessonPath,
  phasePath,
  resourceModules,
  resourceSteps,
  stepCode,
  videoNotes,
  type ResourceLink,
  type ResourceStep,
} from "@/lib/resources";
import { cn } from "@/lib/utils";

const STEP_NUMBER = new Map(resourceSteps.map((step, index) => [step.id, index + 1]));

function youtubeId(href: string): string | null {
  const match = href.match(/(?:v=|youtu\.be\/)([\w-]{11})/);
  return match?.[1] ?? null;
}

function Prose({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "mt-4 text-base leading-7 text-muted-foreground sm:text-[17px] sm:leading-8",
        className,
      )}
    >
      {children}
    </p>
  );
}

function LinkPill({
  href,
  children,
  external,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) {
  const className =
    "inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
        <ExternalLink className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function MathNote({
  title,
  formula,
  caption,
}: {
  title: string;
  formula: string;
  caption: string;
}) {
  return (
    <div className="my-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {title}
      </p>
      <MathBlock formula={formula} className="my-2" />
      <p className="-mt-2 text-sm leading-6 text-muted-foreground">{caption}</p>
    </div>
  );
}

function LessonVideo({
  video,
  notes,
}: {
  video: NonNullable<ResourceStep["video"]>;
  notes?: { why: string; watchFor: string };
}) {
  const id = youtubeId(video.href);
  if (!id) return null;
  const playlistHref = video.playlistHref ?? video.href;

  return (
    <figure className="my-6">
      <YouTubeEmbed
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={video.label}
      />
      <figcaption className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <a
          href={playlistHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 underline-offset-4 hover:text-foreground hover:underline"
        >
          <PlayCircle className="h-3.5 w-3.5" aria-hidden="true" />
          {video.label} · {video.author}
        </a>
        <a
          href={video.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 underline-offset-4 hover:text-foreground hover:underline"
        >
          Watch on YouTube
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </a>
      </figcaption>
      {notes && (
        <div className="mt-3 grid gap-3 rounded-lg border border-border/60 bg-muted/20 p-3 text-sm sm:grid-cols-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Why this video
            </p>
            <p className="mt-1 leading-6 text-foreground/80">{notes.why}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              What to notice
            </p>
            <p className="mt-1 leading-6 text-foreground/80">{notes.watchFor}</p>
          </div>
        </div>
      )}
    </figure>
  );
}

function stepLinks(step: ResourceStep): ResourceLink[] {
  const links: ResourceLink[] = [];
  if (step.article) {
    links.push({
      label: "Read the full article",
      href: `/learn/${step.article}`,
      internal: true,
    });
  }
  if (step.simulation) {
    links.push({
      label: "Play with the simulation",
      href: `/simulations/${step.simulation}`,
      internal: true,
    });
  }
  if (step.cheatsheet) {
    links.push({
      label: "Open the cheat sheet",
      href: `/cheatsheets/${step.cheatsheet}`,
      internal: true,
    });
  }

  const seen = new Set(links.map((link) => link.href));
  for (const resource of step.resources) {
    if (seen.has(resource.href)) continue;
    seen.add(resource.href);
    links.push(resource);
  }
  return links;
}

function StepBlock({
  step,
  phaseTitle,
  sharePath,
}: {
  step: ResourceStep;
  phaseTitle: string;
  sharePath: string;
}) {
  const number = STEP_NUMBER.get(step.id) ?? 0;
  const links = stepLinks(step);
  const code = stepCode[step.id] ?? [];
  return (
    <section
      id={step.id}
      className="mt-10 scroll-mt-52 border-t border-border/60 pt-8"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Step {String(number).padStart(2, "0")} · {step.time} min
        </p>
        <StepDone id={step.id} />
      </div>

      <h3 className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">
        {step.title}
      </h3>

      <p className="mt-3 text-base font-medium leading-7 text-foreground sm:text-lg">
        {step.summary}
      </p>

      {step.intro.map((paragraph) => (
        <Prose key={paragraph.slice(0, 40)}>{paragraph}</Prose>
      ))}

      <div
        id={`${step.id}-topics`}
        className="mt-5 scroll-mt-52 rounded-xl border border-border/70 bg-muted/20 p-4 sm:p-5"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Topics in this lesson
        </p>
        <ul className="mt-2 space-y-1.5">
          {step.learn.map((item) => (
            <li
              key={item}
              className="flex gap-2 text-sm leading-6 text-foreground/80"
            >
              <span
                className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-primary"
                aria-hidden="true"
              />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {step.math?.map((math) => (
        <MathNote
          key={math.title}
          title={math.title}
          formula={math.formula}
          caption={math.caption}
        />
      ))}

      {step.video && <LessonVideo video={step.video} notes={videoNotes[step.id]} />}

      {code.map((snippet) => (
        <div key={snippet.title}>
          <CodeBlock
            code={snippet.code}
            language={snippet.language}
            title={snippet.title}
          />
        </div>
      ))}

      <div className="mt-6 rounded-xl border border-primary/20 bg-primary/[0.04] p-4 sm:p-5">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <Hammer className="h-4 w-4 text-primary" aria-hidden="true" />
          Try this
        </p>
        <p className="mt-1.5 text-sm leading-6 text-foreground/80">{step.practice}</p>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Watch out
          </p>
          <ul className="mt-2 space-y-1.5">
            {step.pitfalls.map((pitfall) => (
              <li
                key={pitfall}
                className="flex gap-2 text-sm leading-6 text-muted-foreground"
              >
                <span
                  className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-amber-500"
                  aria-hidden="true"
                />
                {pitfall}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            You are ready when
          </p>
          <ul className="mt-2 space-y-1.5">
            {step.checklist.map((item) => (
              <li key={item} className="flex gap-2 text-sm leading-6 text-muted-foreground">
                <CheckCircle2
                  className="mt-1 h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {links.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {links.map((link) => (
            <LinkPill
              key={link.href}
              href={link.href}
              external={!link.internal}
            >
              {link.label}
            </LinkPill>
          ))}
        </div>
      )}
      {step.interviewQuestions && (
        <div className="mt-5 rounded-xl border border-border/70 bg-muted/20 p-4 sm:p-5">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <MessageSquare className="h-4 w-4 text-primary" aria-hidden="true" />
            Interview checkpoint
          </p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Answer aloud. Name the trade-off, the metric, and the failure mode.
          </p>
          <ol className="mt-3 space-y-2">
            {step.interviewQuestions.map((question, index) => (
              <li key={question} className="flex gap-2.5 text-sm leading-6 text-foreground/85">
                <span className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{question}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}

function MathToolkit() {
  return (
    <section className="mt-12">
      <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
        The math toolkit: six ideas, not a degree
      </h3>
      <Prose>
        You can go a long way with six ideas. They show up in every model below,
        usually wearing different notation. Read the words, glance at the formula,
        and move on; you can come back when a lesson makes you curious.
      </Prose>
      <div className="my-6 divide-y divide-border/60 rounded-xl border border-border/60">
        {mathToolkit.map((item) => (
          <div key={item.title} className="px-4 py-4 sm:px-5">
            <p className="text-sm font-semibold">{item.title}</p>
            <MathBlock
              formula={item.formula}
              className="my-2 border-0 bg-transparent py-1"
            />
            <p className="text-sm leading-6 text-muted-foreground">{item.caption}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ModelZoo() {
  return (
    <section className="mt-12">
      <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
        The model zoo, in one table
      </h3>
      <Prose>
        Every family below is still used in production somewhere. The trick is
        not memorizing them; it is knowing which question each one is good at
        answering. Start with the simplest row that could possibly work.
      </Prose>
      <div className="my-6 overflow-x-auto rounded-xl border border-border/60">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-4 py-3 font-semibold">Family</th>
              <th className="px-4 py-3 font-semibold">Reach for it when</th>
              <th className="px-4 py-3 font-semibold">Start here</th>
            </tr>
          </thead>
          <tbody>
            {modelFamilies.map((model, index) => (
              <tr
                key={model.family}
                className={cn(
                  "border-b border-border/60 last:border-b-0",
                  index % 2 === 0 ? "bg-background" : "bg-muted/20",
                )}
              >
                <td className="px-4 py-3">
                  <span className="font-medium">{model.family}</span>
                  <span className="mt-0.5 block text-xs leading-5 text-muted-foreground">
                    {model.idea}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{model.useWhen}</td>
                <td className="px-4 py-3">
                  <Link
                    href={model.href}
                    className="font-medium text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
                  >
                    {model.linkLabel}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function BeyondSupervised() {
  return (
    <section className="mt-12">
      <h3 id="beyond" className="scroll-mt-48 text-xl font-semibold tracking-tight sm:text-2xl">
        Beyond supervised learning
      </h3>
      <Prose>
        Most of this course is supervised learning: examples in, labels out. But
        the field is wider, and you should at least know what the other rooms are
        for.
      </Prose>
      <dl className="my-6 space-y-4">
        <div>
          <dt className="font-semibold">Unsupervised learning</dt>
          <dd className="mt-1 text-sm leading-6 text-muted-foreground">
            No labels. Clustering groups similar examples; PCA compresses
            features; anomaly detection looks for the weird ones. Useful for
            exploration, segmentation, and preprocessing.
          </dd>
          <dd className="mt-1.5 text-sm">
            <a
              href="https://www.youtube.com/watch?v=4b5d3muPQmA"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary underline underline-offset-4"
            >
              StatQuest: K-means clustering
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          </dd>
        </div>

        <div>
          <dt className="font-semibold">Reinforcement learning</dt>
          <dd className="mt-1 text-sm leading-6 text-muted-foreground">
            An agent takes actions, receives rewards, and learns a policy. It
            shows up in games, robotics, and recommendation systems. Powerful,
            sample-hungry, and easy to get wrong in the real world.
          </dd>
        </div>

        <div>
          <dt className="font-semibold">Self-supervised and generative models</dt>
          <dd className="mt-1 text-sm leading-6 text-muted-foreground">
            Learn structure from the data itself, often by predicting part of the
            input from the rest. This is the family behind modern language models,
            image generators, and embeddings.
          </dd>
        </div>
      </dl>
    </section>
  );
}

function Sources({ steps }: { steps: ResourceStep[] }) {
  const sources = new Map<string, { label: string; href: string }>();

  for (const step of steps) {
    if (step.video) {
      sources.set(step.video.href, {
        label: `${step.video.label} — ${step.video.author}`,
        href: step.video.href,
      });
    }

    for (const resource of step.resources) {
      if (resource.internal) continue;
      sources.set(resource.href, { label: resource.label, href: resource.href });
    }
  }

  if (sources.size === 0) return null;

  return (
    <section className="mt-10 border-t border-border pt-8">
      <h3 id="sources" className="scroll-mt-48 text-xl font-semibold tracking-tight sm:text-2xl">
        Sources
      </h3>
      <Prose>
        Keep this shelf handy as you move through the course whenever you want
        a deeper take.
      </Prose>
      <ul className="my-6 space-y-3">
        {[...sources.values()].map((source) => (
          <li key={source.href} className="text-sm leading-6">
            <ExternalSourceLink href={source.href}>
              {source.label}
            </ExternalSourceLink>
          </li>
        ))}
      </ul>
    </section>
  );
}

function KeepGoing() {
  return (
    <section className="mt-12">
      <h3 id="keep-going" className="scroll-mt-48 text-xl font-semibold tracking-tight sm:text-2xl">
        Keep going
      </h3>
      <Prose>
        Finish the capstone, then make it smaller. Remove a feature, delete a
        dependency, simplify the API, and see whether it still works. That habit
        will teach you more than another model family.
      </Prose>
      <div className="mt-5 flex flex-wrap gap-2">
        <LinkPill href="/learn">Browse all articles</LinkPill>
        <LinkPill href="/simulations">Open the simulations</LinkPill>
        <LinkPill href="/cheatsheets">Grab a cheat sheet</LinkPill>
        <LinkPill href="/model-comparison">Compare models</LinkPill>
      </div>
      <CalloutBox type="tip" title="One last thing">
        <p>
          Nobody feels ready. The people who get good are the ones who ship
          something small, measure it honestly, and then do it again with a
          little more taste.
        </p>
      </CalloutBox>
    </section>
  );
}

function PhaseHeader({
  moduleId,
  steps,
}: {
  moduleId: string;
  steps: ResourceStep[];
}) {
  const module = moduleById.get(moduleId);
  if (!module) return null;
  const minutes = steps.reduce((total, step) => total + step.time, 0);
  const videoCount = steps.filter((step) => step.video).length;

  return (
    <header className="border-b border-border/60 pb-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
        {module.kicker} of {resourceModules.length} · {steps.length} lessons
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        {module.title}
      </h2>
      <p className="mt-3 max-w-2xl text-lg leading-8 text-foreground">
        {module.summary}
      </p>
      <Prose>{module.intro}</Prose>

      <div className="mt-4">
        <ArticleListen title={module.title} src={resourceAudio[module.id]} vttSrc={`/audio/resources/${module.id}.vtt`} />
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1.5">
          <Clock className="h-3.5 w-3.5 text-primary" aria-hidden="true" />~{minutes} min
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1.5">
          <PlayCircle className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          {videoCount} videos
        </span>
      </div>

      <div className="mt-5 rounded-xl border border-border/70 bg-muted/20 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          By the end
        </p>
        <p className="mt-1 text-sm leading-6 text-foreground/85">{module.outcome}</p>
      </div>

      <nav aria-label="Topics in this phase" className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Topics in this phase
        </p>
        <ol className="mt-2 grid gap-1.5 sm:grid-cols-2">
          {steps.map((step, index) => (
            <li key={step.id}>
              <Link
                href={lessonPath(module.id, step.id)}
                className="group flex items-center gap-2 rounded-lg border border-border/60 bg-background px-3 py-2 text-sm text-foreground transition-colors hover:border-primary/50 hover:bg-muted/30"
              >
                <span className="font-mono text-[10px] text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1 truncate">{step.title}</span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ol>
      </nav>

      {module.id === "programming" && (
        <CalloutBox type="note" title="How to use this course">
          <p>
            Read a lesson. Watch the video at 1.25×. Do the short practice task.
            Tick the lesson and move on.
          </p>
          <p>
            If you already know a step, skip it. This is a path, not a compliance
            form. The practice boxes are the actual course; reading without
            building is just entertainment.
          </p>
        </CalloutBox>
      )}

      <LessonProgress ids={steps.map((step) => step.id)} title="Phase progress" />
    </header>
  );
}

function PhasePager({ moduleId }: { moduleId: string }) {
  const index = resourceModules.findIndex((module) => module.id === moduleId);
  const previous = index > 0 ? resourceModules[index - 1] : null;
  const next = index < resourceModules.length - 1 ? resourceModules[index + 1] : null;

  return (
    <nav aria-label="Phase navigation" className="mt-10 grid gap-3 border-t border-border pt-6 sm:grid-cols-2">
      {previous ? (
        <Link
          href={phasePath(previous.id)}
          className="group rounded-xl border border-border p-4 transition-colors hover:border-primary/50 hover:bg-muted/30"
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Previous phase
          </span>
          <span className="mt-1 block font-semibold group-hover:text-primary">
            {previous.title}
          </span>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            {previous.summary}
          </span>
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}

      {next ? (
        <Link
          href={phasePath(next.id)}
          className="group rounded-xl border border-border p-4 text-left transition-colors hover:border-primary/50 hover:bg-muted/30 sm:text-right"
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground sm:justify-end">
            Next phase
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <span className="mt-1 block font-semibold group-hover:text-primary">
            {next.title}
          </span>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            {next.summary}
          </span>
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
    </nav>
  );
}

export function Curriculum({
  moduleId,
  initialLesson,
}: {
  moduleId: string;
  initialLesson?: string;
}) {
  const module = moduleById.get(moduleId) ?? resourceModules[0];
  const steps = resourceSteps.filter((step) => step.module === module.id);
  const questions = phaseQuizzes[module.id] ?? [];
  const funFact = phaseFunFacts[module.id];

  return (
    <article id="course" className="scroll-mt-52 py-8 sm:py-10">
      <PhaseScrollReset moduleId={module.id} anchor={initialLesson} />
      <PhaseHeader moduleId={module.id} steps={steps} />

      {module.id === "math" && <MathToolkit />}
      {module.id === "classical" && <ModelZoo />}

      {steps.map((step) => (
        <StepBlock
          key={step.id}
          step={step}
          phaseTitle={module.title}
          sharePath={lessonPath(module.id, step.id)}
        />
      ))}

      {module.id === "model-types" && <BeyondSupervised />}

      {funFact && (
        <CalloutBox type="note" title="Fun fact">
          <p className="flex items-start gap-2">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-sky-600 dark:text-sky-400" aria-hidden="true" />
            <span>{funFact}</span>
          </p>
        </CalloutBox>
      )}

      {questions.length > 0 && (
        <QuizBlock
          slug={`resources-${module.id}`}
          questions={questions}
          title={`${module.kicker} check: true or false?`}
        />
      )}

      {module.id === "portfolio" && <KeepGoing />}

      <PhasePager moduleId={module.id} />
      <Sources steps={steps} />
    </article>
  );
}
