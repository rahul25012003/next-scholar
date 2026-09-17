import { Skeleton } from "@/components/ui/skeleton";

/**
 * Marketing pages are static, so this fires rarely: on a first navigation to a
 * route that has not been prefetched, and on the dynamic destination guides.
 * It mirrors the page header rather than filling the viewport with grey boxes.
 */
export default function MarketingLoading() {
  return (
    <div className="shell" role="status" aria-live="polite">
      <span className="sr-only">Loading the page</span>
      <Skeleton className="h-3 w-20" />
      <Skeleton className="mt-5 h-11 w-full max-w-2xl" />
      <Skeleton className="mt-3 h-11 w-full max-w-lg" />
      <Skeleton className="mt-7 h-4 w-full max-w-xl" />
      <Skeleton className="mt-2.5 h-4 w-full max-w-md" />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        <Skeleton className="h-52" />
        <Skeleton className="h-52" />
        <Skeleton className="h-52" />
      </div>
    </div>
  );
}
