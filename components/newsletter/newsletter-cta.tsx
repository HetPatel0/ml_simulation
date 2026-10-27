import { KitEmbedForm } from "@/components/newsletter/kit-embed-form";

/**
 * Newsletter band just before the main CTA on home.
 * Theme-aware band (white in light mode, black in dark mode), max-w-5xl
 * inner. Two-column on desktop, tightened type scale on mobile so
 * heading > sub > form reads in order. Entrance is CSS-only so the home
 * page ships no animation runtime.
 */
export function NewsletterCTA() {
  return (
    <section
      aria-labelledby="newsletter-heading"
      className="reveal border-y border-border bg-background"
    >
      <div className="mx-auto grid max-w-5xl items-center gap-6 px-6 py-10 md:grid-cols-2 md:gap-8 md:py-12">
        <div className="text-center md:text-left">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Stay in loop
          </p>
          <h2
            id="newsletter-heading"
            className="mt-2 text-2xl font-light tracking-tight text-foreground md:text-3xl"
          >
            New guides, <span className="font-medium text-primary">one email</span>
          </h2>
          <p className="mx-auto mt-1.5 max-w-md text-sm text-muted-foreground md:mx-0 md:mt-2">
            One email per article. No spam, unsubscribe anytime.
          </p>
        </div>
        <div>
          <KitEmbedForm
            hideChrome
            className="kit-on-dark kit-centered mx-auto w-full md:mx-0"
          />
        </div>
      </div>
    </section>
  );
}
