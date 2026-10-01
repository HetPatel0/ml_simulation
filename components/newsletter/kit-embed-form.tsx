"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { toast } from "sonner";

const TOAST_ID = "kit-subscribe";

/**
 * Kit-hosted signup form (form 9987433), restyled to match the site theme.
 * Kit's default <style> blob is intentionally omitted — all visuals come
 * from `.kit-themed` in globals.css (theme tokens, auto dark mode).
 * Posts directly to Kit; ck.js progressive-enhances with AJAX + inline
 * success/error states. Works as a plain POST without JS too.
 *
 * Toasts go through the shadcn Sonner toaster (bottom-right): ck.js gives
 * no JS callbacks, so we watch its DOM output — submit shows pending, the
 * success message / error alert resolve it. No env keys needed anywhere:
 * the form ID is public by design.
 */
export function KitEmbedForm({
  hideChrome = false,
  className = "",
}: {
  /** Hide heading/guarantee/badge — fields only, for inline strip use. */
  hideChrome?: boolean;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const form = root?.querySelector<HTMLFormElement>("form[data-sv-form]");
    if (!root || !form) return;

    const onSubmit = () => {
      toast.loading("Subscribing…", { id: TOAST_ID });
    };
    form.addEventListener("submit", onSubmit);

    // ck.js renders outcome into the form DOM — observe and mirror as toast.
    const observer = new MutationObserver(() => {
      const ok = root.querySelector(".formkit-alert-success");
      if (ok && ok.textContent?.trim()) {
        toast.success("Success! You are subscribed.", { id: TOAST_ID });
      } else {
        const err = root.querySelector(".formkit-alert-error");
        if (err && err.textContent?.trim()) {
          toast.error(err.textContent.trim().slice(0, 120), { id: TOAST_ID });
        }
      }
    });
    observer.observe(root, { childList: true, subtree: true, characterData: true });

    return () => {
      form.removeEventListener("submit", onSubmit);
      observer.disconnect();
      toast.dismiss(TOAST_ID);
    };
  }, []);

  return (
    <div ref={rootRef} className={`kit-themed max-w-md ${className}`.trim()}>
      <Script src="https://f.convertkit.com/ckjs/ck.5.js" strategy="afterInteractive" />
      <form
        action="https://app.kit.com/forms/9987433/subscriptions"
        className="seva-form formkit-form"
        method="post"
        data-sv-form="9987433"
        data-uid="4ed93e325b"
        data-format="inline"
        data-version="5"
        data-options='{"settings":{"after_subscribe":{"action":"message","success_message":"Success! You are subscribed.","redirect_url":""}},"version":"5"}'
      >
        <div data-style="full">
          {!hideChrome && (
            <div className="kit-head">
              <h2>Join the Newsletter</h2>
              <p className="kit-sub">One email per new article. No spam, unsubscribe anytime.</p>
            </div>
          )}
          <ul
            className="formkit-alert formkit-alert-error"
            data-element="errors"
            data-group="alert"
          />
          <div data-element="fields" className="seva-fields formkit-fields kit-fields">
            <div className="formkit-field">
              <input
                className="formkit-input"
                name="email_address"
                aria-label="Email Address"
                placeholder="you@example.com"
                required
                type="email"
              />
            </div>
            <button data-element="submit" className="formkit-submit" type="submit">
              <span>Subscribe</span>
            </button>
          </div>
          {!hideChrome && (
            <p className="kit-guarantee">
              We won&apos;t send you spam. Unsubscribe at any time.
            </p>
          )}
          <a
            href="https://kit.com/features/forms?utm_campaign=poweredby&utm_content=form&utm_medium=referral&utm_source=dynamic"
            data-element="powered-by"
            className="kit-powered-by"
            target="_blank"
            rel="nofollow noopener"
          >
            Built with Kit
          </a>
        </div>
      </form>
    </div>
  );
}
