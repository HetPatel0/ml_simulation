import { ExternalLink, Globe2 } from "lucide-react";

type ExternalSourceLinkProps = {
  href: string;
  children: React.ReactNode;
};

function getPreviewSrc(href: string): string {
  try {
    const url = new URL(href);
    const host = url.hostname.replace(/^www\./, "");
    if (host === "youtube.com" || host === "youtu.be") {
      const playlist = url.searchParams.get("list");
      if (playlist) {
        return `https://www.youtube-nocookie.com/embed/videoseries?list=${encodeURIComponent(playlist)}`;
      }
      const video = host === "youtu.be" ? url.pathname.slice(1) : url.searchParams.get("v");
      if (video) {
        return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(video)}`;
      }
    }
  } catch {
    // Use the original URL for non-YouTube links or malformed URLs.
  }
  return href;
}

/** External link with a compact hover/focus preview of its new-tab behavior. */
export function ExternalSourceLink({ href, children }: ExternalSourceLinkProps) {
  const previewSrc = getPreviewSrc(href);
  let destination = href;
  try {
    destination = new URL(href).hostname.replace(/^www\./, "");
  } catch {
    // Keep the original value for a malformed or relative URL.
  }

  return (
    <span className="group/source relative inline-flex">
      <a
        className="inline-flex items-center gap-1 underline underline-offset-4"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
        <ExternalLink size={13} aria-hidden="true" />
      </a>
      <span
        role="tooltip"
        className="pointer-events-none invisible absolute bottom-full left-0 z-20 mb-2 w-64 -translate-y-1 overflow-hidden rounded-lg border bg-popover text-left text-xs text-popover-foreground opacity-0 shadow-lg transition-all group-hover/source:visible group-hover/source:translate-y-0 group-hover/source:opacity-100 group-focus-within/source:visible group-focus-within/source:translate-y-0 group-focus-within/source:opacity-100"
      >
        <span className="relative block h-36 w-64 overflow-hidden bg-muted">
          <span className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 via-muted to-accent">
            <Globe2 size={24} aria-hidden="true" className="text-primary/70" />
          </span>
          <iframe
            src={previewSrc}
            title={`Preview of ${children}`}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="pointer-events-none absolute left-0 top-0 h-[450px] w-[800px] origin-top-left scale-[0.32] border-0 bg-background"
          />
          <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-8 text-[10px] text-white">
            {destination}
          </span>
        </span>
        <span className="block px-3 py-2">
          <span className="block font-medium">Opens in a new tab</span>
          <span className="mt-0.5 block truncate text-muted-foreground">Preview of the destination site</span>
        </span>
      </span>
    </span>
  );
}
