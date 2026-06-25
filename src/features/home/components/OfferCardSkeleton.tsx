"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useFitCount } from "@/hooks/useFitCount";
import { cn } from "@/lib/utils";

/** Width of one offer card incl. layout gap — keep in sync with OfferCard (w-60 = 240px). */
const CARD_WIDTH = 240;
const GAP = 16;

interface OfferCardSkeletonProps {
  /** w-60 fixed-width (carousel/wrap) when false; full-width grid cell when true. */
  fluid?: boolean;
  className?: string;
}

/** Placeholder mirroring <OfferCard /> — same 240×190 image ratio and content rows. */
export function OfferCardSkeleton({ fluid, className }: OfferCardSkeletonProps) {
  return (
    <div className={cn(!fluid && "w-60", fluid && "w-full", className)}>
      <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5">
        {/* Image */}
        <Skeleton className="aspect-[240/190] w-full rounded-none" />
        {/* Content */}
        <div className="flex flex-col gap-2 px-3 py-[10px]">
          <Skeleton className="h-3.5 w-3/4" />
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-3.5 w-12 rounded-full" />
          </div>
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
    </div>
  );
}

/**
 * Horizontal feed section placeholder — mirrors <OfferSection />: a header row
 * (title + "See All") with px-4, then a horizontal card row whose card count is
 * computed to fill the container width and overflow past the right edge, just
 * like the real scroll row (no hardcoded count).
 */
export function OfferSectionSkeleton() {
  const { ref, count } = useFitCount<HTMLDivElement>({
    axis: "row",
    itemWidth: CARD_WIDTH,
    gap: GAP,
    overscan: 2,
  });

  return (
    <section className="w-full py-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between px-4">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-4 w-16" />
      </div>
      {/* Scroll row — clip overflow; card count fills the width dynamically */}
      <div ref={ref} className="overflow-hidden">
        <div className="flex gap-4 px-4">
          {Array.from({ length: count }).map((_, i) => (
            <OfferCardSkeleton key={i} className="flex-shrink-0" />
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Wrapping grid of offer-card placeholders. Card count fills `rows` worth of
 * columns that fit the container width — dynamic, not hardcoded. Mirrors the
 * flex-wrap layout used by the offers, favorites and vendor-products pages.
 */
export function OfferCardSkeletonGrid({
  rows = 2,
  className,
}: {
  rows?: number;
  className?: string;
}) {
  const { ref, count } = useFitCount<HTMLDivElement>({
    axis: "grid",
    itemWidth: CARD_WIDTH,
    gap: GAP,
    rows,
  });

  return (
    <div ref={ref} className={cn("flex flex-wrap gap-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <OfferCardSkeleton key={i} className="flex-shrink-0" />
      ))}
    </div>
  );
}
