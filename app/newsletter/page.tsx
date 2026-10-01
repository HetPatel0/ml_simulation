import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { KitEmbedForm } from "@/components/newsletter/kit-embed-form";

export const metadata: Metadata = {
  title: "Newsletter",
  description: "One email per new ML article. No spam, one-click unsubscribe.",
  alternates: { canonical: "/newsletter" },
};

export default function NewsletterPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Mail className="h-5 w-5" />
          </div>
          <h1 className="text-4xl font-bold">Newsletter</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          One email per new article. No account, no spam, no tracking.
        </p>
      </div>
      <KitEmbedForm />
      <div className="mt-8 max-w-2xl space-y-2 text-sm text-muted-foreground">
        <p>
          <strong className="text-foreground">How it works:</strong> your
          address is stored by Kit (our email provider) only to send new
          article alerts. Every email contains a one-click unsubscribe link —
          no login needed.
        </p>
        <p>
          See also <a className="underline" href="/privacy">Privacy</a>.
        </p>
      </div>
    </div>
  );
}
