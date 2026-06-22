"use client";

import { cn } from "@/lib/utils";
import { useFitCount } from "@/hooks/useFitCount";

/**
 * Skeleton — the single loading-placeholder primitive for the whole app.
 *
 * Renders a muted block with a gradient shimmer sweeping across it. Compose
 * these to mirror the real layout (a title bar, an avatar circle, a card, …)
 * so the transition into loaded content has no layout shift.
 *
 * Base color is `surface-container` to match the design system. Override with
 * className for size, radius, and shape:
 *   <Skeleton className="h-4 w-3/4" />            text line
 *   <Skeleton className="h-10 w-10 rounded-full"/> avatar
 *   <Skeleton className="h-40 w-full rounded-2xl"/> image / card
 */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "shimmer-overlay rounded-md bg-surface-container",
        className,
      )}
      {...props}
    />
  );
}

interface SkeletonListProps {
  /** Height of each row in px — used both to size rows and to compute how many fit. */
  itemHeight: number;
  /** Extra classes for each row (e.g. rounded-xl). */
  itemClassName?: string;
  /** Gap between rows in px (default 12, matches space-y-3). */
  gap?: number;
  /** Clamp the dynamic count. */
  min?: number;
  max?: number;
  className?: string;
}

/**
 * Vertical list of row placeholders. The number of rows is computed to fill the
 * viewport height below the list — dynamic, not hardcoded. Use for any
 * stacked-list loading state (notifications, coupons, reviews, products, …).
 */
function SkeletonList({
  itemHeight,
  itemClassName,
  gap = 12,
  min,
  max,
  className,
}: SkeletonListProps) {
  const { ref, count } = useFitCount<HTMLDivElement>({
    axis: "list",
    itemHeight,
    gap,
    min,
    max,
  });

  return (
    <div ref={ref} className={className} style={{ display: "flex", flexDirection: "column", gap }}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={itemClassName} style={{ height: itemHeight }} />
      ))}
    </div>
  );
}

export { Skeleton, SkeletonList };
