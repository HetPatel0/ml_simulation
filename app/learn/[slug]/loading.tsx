import { ArticleSkeleton } from "@/components/ui/loading-skeleton";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:grid lg:grid-cols-[240px_minmax(0,44rem)_240px] lg:justify-center lg:gap-8">
      <div className="hidden lg:block" />
      <div className="mx-auto w-full min-w-0 max-w-[44rem]">
        <ArticleSkeleton />
      </div>
      <div className="hidden lg:block" />
    </div>
  );
}
