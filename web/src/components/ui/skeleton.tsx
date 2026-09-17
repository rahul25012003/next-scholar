import { cn } from "@/lib/cn";

/**
 * Loading placeholders.
 *
 * Shaped like the thing that is coming rather than a generic spinner, so the
 * page does not reflow into a different layout once the data lands. The pulse
 * is a CSS animation, which means the reduced-motion rule in globals.css
 * already collapses it without this component knowing anything about that.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("block animate-pulse rounded-input bg-light", className)}
    />
  );
}

/** A card-shaped placeholder, used wherever a panel of figures is loading. */
export function SkeletonPanel({
  rows = 4,
  className,
}: {
  rows?: number;
  className?: string;
}) {
  return (
    <div className={cn("rounded-panel border border-line bg-white p-6", className)}>
      <Skeleton className="h-4 w-32" />
      <div className="mt-5 space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="flex items-center justify-between gap-6">
            <Skeleton className="h-3.5 w-40" />
            <Skeleton className="h-3.5 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * The whole-page loading state for an authenticated surface. Announced to
 * screen readers, because a silent skeleton tells a screen reader user nothing
 * at all.
 */
export function PageLoading({ label }: { label: string }) {
  return (
    <div className="shell" role="status" aria-live="polite">
      <span className="sr-only">{label}</span>
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-4 h-9 w-80 max-w-full" />
      <Skeleton className="mt-4 h-4 w-full max-w-xl" />
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        <SkeletonPanel rows={5} className="lg:col-span-2" />
        <SkeletonPanel rows={3} />
        <SkeletonPanel rows={4} />
        <SkeletonPanel rows={4} className="lg:col-span-2" />
      </div>
    </div>
  );
}
