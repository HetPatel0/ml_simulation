import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/articles/components";
import { SimulationLink } from "@/components/articles/components";
import { Breadcrumb, BreadcrumbJsonLd } from "@/components/articles/layout/article-breadcrumb";
import { ArticleShell } from "@/components/articles/layout/article-shell";
import { ArticleImage } from "@/components/articles/layout/article-image";
import { ExternalSourceLink } from "@/components/articles/layout/external-source-link";
import { CheatsheetTopBar } from "@/components/cheatsheets/cheatsheet-topbar";
import { BackToTop } from "@/components/layout/overlays/back-to-top";
import { CheatsheetParams } from "@/components/cheatsheets/cheatsheet-params";
import { cheatsheets, cheatsheetMetadata, siteConfig } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const meta = cheatsheetMetadata[slug];
  if (!meta) return { title: "Cheatsheet Not Found" };
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `/cheatsheets/${slug}` },
    openGraph: {
      title: `${meta.title} | ML Simulations`,
      description: meta.description,
      type: "article",
      url: `${siteConfig.url}/cheatsheets/${slug}`,
    },
    twitter: { card: "summary_large_image", title: meta.title, description: meta.description },
  };
}

export function generateStaticParams() {
  return Object.keys(cheatsheets).map((slug) => ({ slug }));
}

export default async function CheatsheetPage({ params }: Props) {
  const { slug } = await params;
  const sheet = cheatsheets[slug];
  if (!sheet) notFound();

  return (
    <div className="min-h-screen">
      <BreadcrumbJsonLd
        siteUrl={siteConfig.url}
        items={[
          { label: "Home", href: "/" },
          { label: "Cheatsheets", href: "/cheatsheets" },
          { label: sheet.title, href: `/cheatsheets/${slug}` },
        ]}
      />
      {/* Sim-style Back/Share bar, contained in max-w-5xl like sims */}
      <div className="mx-auto w-full max-w-5xl">
        <CheatsheetTopBar title={sheet.title} />
      </div>

      <ArticleShell>
        {/* Title block formatted like Learn article pages (ArticlePost header) */}
        <header className="space-y-6 pt-8">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Cheatsheets", href: "/cheatsheets" },
              { label: sheet.title },
            ]}
          />
          <h1 className="text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
            {sheet.title}
          </h1>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge>{sheet.badge}</Badge>
            {sheet.category.toLowerCase() !== sheet.badge.toLowerCase() && (
              <span className="capitalize">{sheet.category}</span>
            )}
          </div>

          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            {sheet.description}
          </p>

          <div className="flex flex-wrap gap-3 text-sm">
            {sheet.articleSlug && (
              <Link className="underline underline-offset-4" href={`/learn/${sheet.articleSlug}`}>
                Read the full guide →
              </Link>
            )}
            {sheet.simSlug && (
              <Link className="underline underline-offset-4" href={`/simulations/${sheet.simSlug}`}>
                Open interactive sim →
              </Link>
            )}
          </div>
        </header>
        <ArticleImage
          src={sheet.hero}
          alt={`${sheet.title} diagram`}
          priority
          className={sheet.heroAspect ?? "aspect-video"}
        />

        <h2 className="mb-2 mt-10 text-xl font-semibold tracking-tight sm:text-2xl">Parameters</h2>
        <CheatsheetParams sheet={sheet} />

        <h2 className="mb-2 mt-10 text-xl font-semibold tracking-tight sm:text-2xl">Model variants &amp; sub-types</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b text-left text-muted-foreground">
                <th className="py-2 pr-4 font-medium">Variant</th>
                <th className="py-2 pr-4 font-medium">API</th>
                <th className="py-2 pr-4 font-medium">Best for</th>
                <th className="py-2 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {sheet.variants.map((v) => (
                <tr key={v.name} className="border-b align-top">
                  <td className="py-2 pr-4 font-medium">{v.name}</td>
                  <td className="py-2 pr-4 font-mono text-xs">{v.api}</td>
                  <td className="py-2 pr-4">{v.bestFor}</td>
                  <td className="py-2 text-muted-foreground">{v.note ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mb-2 mt-10 text-xl font-semibold tracking-tight sm:text-2xl">How it differs from other models</h2>
        <ul className="list-disc space-y-2 pl-6">
          {sheet.vsOthers.map((c) => (
            <li key={c.versus}>
              <strong>{c.versus}:</strong> {c.difference}
            </li>
          ))}
        </ul>

        <h2 className="mb-2 mt-10 text-xl font-semibold tracking-tight sm:text-2xl">Copy-paste snippet</h2>
        <CodeBlock code={sheet.snippet.code} language={sheet.snippet.language as "python"} title={sheet.snippet.title} />

        <h2 className="mb-2 mt-10 text-xl font-semibold tracking-tight sm:text-2xl">Tuning tips</h2>
        <ul className="list-disc space-y-2 pl-6">
          {sheet.tips.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>

        <h2 className="mb-2 mt-10 text-xl font-semibold tracking-tight sm:text-2xl">Common pitfalls</h2>
        <ul className="list-disc space-y-2 pl-6">
          {sheet.pitfalls.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>

        <section className="pb-10">
          <h2 className="mb-2 mt-10 text-xl font-semibold tracking-tight sm:text-2xl">Sources</h2>
          <ul className="list-disc space-y-2 pl-6 text-sm">
          {sheet.sources.map((s) => (
            <li key={s.url}>
              <ExternalSourceLink href={s.url}>
                {s.label}
              </ExternalSourceLink>
            </li>
          ))}
          </ul>
        </section>

        {sheet.simSlug && (
          <div className="mt-10">
            <SimulationLink
              simulationSlug={sheet.simSlug}
              description="Try these params live in the simulation"
            />
          </div>
        )}
      </ArticleShell>
      <BackToTop />
    </div>
  );
}
