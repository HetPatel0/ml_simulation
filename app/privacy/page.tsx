import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How ML Simulations handles analytics, newsletter emails, and local browser storage.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          No account needed. Here is what leaves your browser and what stays on your device.
        </p>
      </div>
      <div className="prose dark:prose-invert max-w-2xl">
        <h2>Analytics</h2>
        <p>
          Privacy-friendly page analytics (Vercel Analytics and Speed Insights)
          show which articles help learners. No advertising trackers, no
          cross-site cookies.
        </p>
        <h2>Newsletter</h2>
        <p>
          If you subscribe, your address is stored by Kit (our email
          provider) solely to send new-article alerts. Every email contains a
          one-click unsubscribe link. We never sell addresses and keep no
          subscriber database of our own.
        </p>
        <h2>On-device storage</h2>
        <p>
          Quiz scores live in localStorage under keys like{" "}
          <code>ml-quiz:&lt;slug&gt;</code>. Clear site data to erase them.
        </p>
        <h2>Contact</h2>
        <p>
          Questions? Open an issue on the public GitHub repository linked in the
          footer.
        </p>
      </div>
    </div>
  );
}
