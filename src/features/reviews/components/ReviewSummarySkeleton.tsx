import { Skeleton } from "@/components/ui";

export default function ReviewSummarySkeleton() {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-5">
        <Skeleton className="h-16 w-16 rounded-full" />

        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-3 w-8" />
            <Skeleton className="h-2 flex-1 rounded-full" />
            <Skeleton className="h-3 w-6" />
          </div>
        ))}
      </div>
    </div>
  );
}
