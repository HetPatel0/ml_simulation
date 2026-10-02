import { ArticleSkeleton, DetailGridShell } from "@/components/ui/loading-skeleton";

export default function Loading() {
  return (
    <DetailGridShell>
      <ArticleSkeleton />
    </DetailGridShell>
  );
}
