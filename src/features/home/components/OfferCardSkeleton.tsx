"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useFitCount } from "@/hooks/useFitCount";
import { cn } from "@/lib/utils";

const CARD_WIDTH = 224;
const GAP = 16;

interface OfferCardSkeletonProps {
  fluid?: boolean;
  className?: string;
}

export function OfferCardSkeleton({ fluid, className }: OfferCardSkeletonProps) {
  return (
    <div className={cn(!fluid && "w-[208px] sm:w-[224px]", fluid && "w-full", className)}>
      <div className="min-h-[318px] overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
        {/* Image area — mirrors OfferCard's aspect-[224/148] with bg-[#f7faf8] */}
        <div className="relative aspect-[224/148] overflow-hidden bg-[#f7faf8]">
          <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
          {/* Discount badge */}
          <Skeleton className="absolute left-3 top-3 h-[18px] w-14 rounded-[5px]" />
          {/* Favourite button */}
          <Skeleton className="absolute right-3 top-3 h-7 w-7 rounded-full" />
        </div>
        {/* Content area */}
        <div className="flex flex-1 flex-col px-3 pb-3 pt-1">
          {/* Category badge */}
          <Skeleton className="mb-2 h-5 w-20 rounded-full" />
          {/* Title */}
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-4/5" />
          </div>
          {/* Merchant name */}
          <Skeleton className="mt-2 h-3 w-2/3" />
          {/* Rating */}
          <Skeleton className="mt-2.5 h-3 w-24" />
          {/* Price row */}
          <div className="mt-3 flex items-end gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-3 w-12" />
            <Skeleton className="ml-auto h-5 w-14 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function OfferSectionSkeleton() {
  const { ref, count } = useFitCount<HTMLDivElement>({
    axis: "row",
    itemWidth: CARD_WIDTH,
    gap: GAP,
    overscan: 2,
  });

  return (
    <section className="w-full py-8">
      <div className="mb-5 flex items-center justify-between px-4 sm:px-6 lg:px-16">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-3.5 w-72 max-w-[70vw]" />
        </div>
        <Skeleton className="h-4 w-16" />
      </div>
      <div ref={ref} className="overflow-hidden">
        <div className="flex gap-4 px-4 sm:px-6 lg:px-16">
          {Array.from({ length: count }).map((_, i) => (
            <OfferCardSkeleton key={i} className="flex-shrink-0" />
          ))}
        </div>
      </div>
    </section>
  );
}

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

