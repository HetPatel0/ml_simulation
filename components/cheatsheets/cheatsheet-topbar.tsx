import { ContentTopBar } from "@/components/layout/content-topbar";

/**
 * Sim-style top bar (Back left, Share right) without the centered title —
 * the title lives in the shell below, formatted like Learn article pages.
 * Parent controls width (max-w-5xl, like sims) so the border-b matches.
 */
export function CheatsheetTopBar({ title }: { title: string }) {
  return (
    <ContentTopBar shareTitle={title} fallbackHref="/cheatsheets" />
  );
}
