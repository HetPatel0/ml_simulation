import { ArrowRight, Info } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <main className="min-h-screen">

      <section className="px-6 lg:px-12 pt-8 pb-12">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Info className="h-5 w-5" />
            </div>
            <h1 className="text-4xl font-bold">About</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            A free platform for learning machine learning through interactive
            visualizations
          </p>
        </div>
      </section>

      <section className="px-6 lg:px-12 py-12 border-t border-border/50">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold tracking-tight mb-6">
            Why This Exists
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Most machine learning resources focus on equations and code
              snippets, hiding what&apos;s actually happening inside algorithms.
              Students memorize formulas without understanding why they work.
            </p>
            <p>
              We believe in{" "}
              <span className="text-foreground font-medium">
                showing, not just telling
              </span>
              . Watch gradient descent converge, see decision boundaries form,
              and observe how changing parameters affects results all in
              real-time.
            </p>
          </div>
        </div>
      </section>
      <section className="px-6 lg:px-12 py-12 bg-muted/30 border-y border-border/50">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold tracking-tight mb-6">
            Who This Is For
          </h2>

          <div className="grid sm:grid-cols-3 gap-6 mb-6">
            {[
              {
                title: "Students",
                description: "Preparing for exams or supplementing coursework.",
              },
              {
                title: "Developers",
                description: "Understanding ML beyond library calls.",
              },
              {
                title: "Curious Minds",
                description: "Anyone interested in how machines learn.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-4 rounded-xl border border-border/50 bg-card/50"
              >
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <p className="text-muted-foreground text-sm">
            No advanced math required. Just curiosity.
          </p>
        </div>
      </section>

      {/* ================= PRINCIPLES ================= */}
      <section className="px-6 lg:px-12 py-12">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold tracking-tight mb-6">
            Our Principles
          </h2>

          <ul className="space-y-2 text-muted-foreground">
            {[
              "Visual intuition before formal mathematics",
              "Simple examples before real-world complexity",
              "Failure cases matter as much as successes",
              "Free and accessible to everyone",
            ].map((principle) => (
              <li key={principle} className="flex items-center gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                {principle}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ================= PRIVACY ================= */}
      <section id="privacy" className="px-6 lg:px-12 py-12 border-t border-border/50 scroll-mt-14">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold tracking-tight mb-2">
            Privacy
          </h2>
          <p className="text-muted-foreground mb-6">
            No account needed. Here is what leaves your browser and what
            stays on your device.
          </p>
          <ul className="space-y-4 text-muted-foreground leading-relaxed max-w-2xl">
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
              <span>
                <span className="text-foreground font-medium">Analytics — </span>
                privacy-friendly page analytics (Vercel Analytics and Speed
                Insights) show which articles help learners. No advertising
                trackers, no cross-site cookies.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
              <span>
                <span className="text-foreground font-medium">Newsletter — </span>
                if you subscribe, your address is stored by Kit (our email
                provider) solely to send new-article alerts. Every email
                contains a one-click unsubscribe link. We never sell addresses
                and keep no subscriber database of our own.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
              <span>
                <span className="text-foreground font-medium">On-device storage — </span>
                quiz answers live in localStorage under keys like{" "}
                <code>ml-quiz:&lt;slug&gt;</code> and auto-erase 30 minutes
                after your last answer. Sound preference lives under{" "}
                <code>ml-fun:sound</code> and found easter eggs under{" "}
                <code>ml-fun:eggs</code>. Clear site data to erase them sooner.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />
              <span>
                <span className="text-foreground font-medium">Contact — </span>
                questions? Open an issue on the public GitHub repository linked
                in the footer.
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="px-6 lg:px-12 py-12 border-t border-border/50">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-2xl font-bold tracking-tight mb-3">
            Start Learning
          </h2>
          <p className="text-muted-foreground mb-6">
            Pick any simulation and start experimenting. No signup needed.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild className="h-11 px-6 gap-2">
              <Link href="/simulations" scroll={true}>
                Explore Simulations
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-11 px-6">
              <Link href="/learn" scroll={true}>Read Articles</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
