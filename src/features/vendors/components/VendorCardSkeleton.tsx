"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useFitCount } from "@/hooks/useFitCount";
import { cn } from "@/lib/utils";

interface VendorCardSkeletonProps {
  /** Fixed count (e.g. appended "load more" pages). Omit to fill the grid dynamically. */
  count?: number;
  className?: string;
}

/** Grid of placeholders mirroring <VendorCard /> — cover band, logo, title, stats. */
export function VendorCardSkeleton({ count, className }: VendorCardSkeletonProps) {
  const { ref, count: fitCount } = useFitCount<HTMLDivElement>({
    axis: "grid",
    itemWidth: 160,
    gap: 12,
    rows: 4,
  });
  const n = count ?? fitCount;

  return (
    <div ref={ref} className={cn("grid gap-3", className ?? "grid-cols-2")}>
      {Array.from({ length: n }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_8px_22px_rgba(20,27,43,0.06)]"
        >
          {/* Cover band */}
          <div className="relative h-32 w-full bg-gray-100">
            <div className="absolute -bottom-6 left-3">
              <Skeleton className="h-14 w-14 rounded-xl border-2 border-white" />
            </div>
          </div>
          {/* Content */}
          <div className="space-y-2 px-3 pb-3 pt-8">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <div className="flex items-center gap-3 pt-1">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
