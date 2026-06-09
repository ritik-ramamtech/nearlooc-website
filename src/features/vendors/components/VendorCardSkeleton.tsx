import { cn } from "@/lib/utils";

interface VendorCardSkeletonProps {
  count?: number;
  className?: string;
}

export function VendorCardSkeleton({ count = 4, className }: VendorCardSkeletonProps) {
  return (
    <div className={cn("grid gap-3 animate-pulse", className ?? "grid-cols-2")}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-outline-variant">
          <div className="h-24 w-full bg-surface-container" />
          <div className="space-y-2 p-3 pt-7">
            <div className="h-4 w-3/4 rounded bg-surface-container" />
            <div className="h-3 w-1/2 rounded bg-surface-container" />
          </div>
        </div>
      ))}
    </div>
  );
}
