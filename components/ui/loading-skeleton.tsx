import { cn } from "@/lib/utils";

/**
 * Shimmer skeleton loaders — fast sweeping highlight (not a slow pulse),
 * sized to mirror the real content above the fold to minimize layout shift.
 */

function Bar({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={cn("skeleton-shimmer rounded-md", className)} />
  );
}

/** Mirrors a simulation page: SimHeader, canvas stage + controls column. */
export function SimulationSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading simulation"
      className="mx-auto flex w-full max-w-6xl flex-col gap-6 mb-10"
    >
      <span className="sr-only">Loading simulation…</span>
      {/* SimHeader: back bar + centered title/subtitle */}
      <div className="w-full">
        <div className="flex items-center border-b py-5">
          <Bar className="h-8 w-20 rounded-md" />
        </div>
        <div className="mt-6 space-y-2 text-center">
          <Bar className="mx-auto h-9 w-1/3" />
          <Bar className="mx-auto h-5 w-1/2" />
        </div>
      </div>
      {/* Stage + controls row */}
      <div className="flex flex-col gap-6 lg:flex-row">
        <Bar className="min-h-[420px] flex-1 rounded-xl" />
        <div className="w-full space-y-4 rounded-xl border p-4 lg:w-80">
          <Bar className="h-5 w-1/2" />
          <Bar className="h-4 w-3/4" />
          <div className="space-y-6 pt-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="space-y-2 rounded-md p-1">
                <div className="flex justify-between">
                  <Bar className="h-4 w-1/3" />
                  <Bar className="h-4 w-10" />
                </div>
                <Bar className="h-1.5 w-full rounded-full" />
              </div>
            ))}
          </div>
          <Bar className="h-10 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}

/** Mirrors LearningCard: aspect-video image + badge, title, desc, CTA pill. */
export function CardSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading card"
      className="overflow-hidden rounded-2xl border-2 border-border/60 bg-background"
    >
      <span className="sr-only">Loading…</span>
      <div className="relative aspect-video">
        <Bar className="absolute inset-0 h-full w-full rounded-none" />
      </div>
      <div className="flex flex-col gap-4 p-6">
        <div className="space-y-2">
          <Bar className="h-5 w-20 rounded-full" />
          <Bar className="h-6 w-3/4" />
          <Bar className="h-4 w-full" />
          <Bar className="h-4 w-5/6" />
        </div>
        <Bar className="h-8 w-28 rounded-md" />
      </div>
    </div>
  );
}

/** Mirrors FeaturedSection: header row + responsive card grid. */
export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <section
      role="status"
      aria-busy="true"
      aria-label="Loading topics"
      className="px-6 lg:px-12 py-24 bg-muted/20 border-y border-border/40"
    >
      <span className="sr-only">Loading topics…</span>
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="space-y-4">
            <Bar className="h-4 w-32" />
            <Bar className="h-9 w-64" />
          </div>
          <Bar className="h-10 w-40 rounded-full" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: count }, (_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
/** Mirrors /learn + /simulations: header, search bar, card grid. */
export function ListingSkeleton({ cards = 6 }: { cards?: number }) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading"
      className="container mx-auto px-4 py-8 max-w-5xl"
    >
      <span className="sr-only">Loading…</span>
      <div className="mb-8 space-y-2">
        <div className="flex items-center gap-3 mb-2">
          <Bar className="h-10 w-10 rounded-lg" />
          <Bar className="h-9 w-64" />
        </div>
        <Bar className="h-6 w-1/2" />
      </div>
      <Bar className="h-10 w-full mb-10 rounded-md" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: cards }, (_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

/** Mirrors ArticlePost: h1, byline, lede, Listen/Share row, hero, paragraphs. */
export function ArticleSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading article"
      className="mx-auto w-full space-y-6 py-8 sm:py-12"
    >
      <span className="sr-only">Loading article…</span>
      {/* Header block */}
      <div className="space-y-6">
        <Bar className="h-9 w-3/4" />
        <Bar className="h-4 w-1/4" />
        <Bar className="h-6 w-full" />
        {/* Listen + Share pills */}
        <div className="flex gap-3">
          <Bar className="h-9 w-28 rounded-full" />
          <Bar className="h-9 w-24 rounded-full" />
        </div>
      </div>
      {/* Hero figure */}
      <Bar className="aspect-video w-full rounded-xl" />
      {/* Body copy */}
      <div className="space-y-4">
        <Bar className="h-4 w-full" />
        <Bar className="h-4 w-full" />
        <Bar className="h-4 w-5/6" />
        <Bar className="h-7 w-1/2 pt-2" />
        <Bar className="h-4 w-full" />
        <Bar className="h-4 w-2/3" />
      </div>
    </div>
  );
}
