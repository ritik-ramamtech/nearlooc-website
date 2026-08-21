import { Skeleton } from "@/components/ui";

export default function ReviewItemSkeleton() {
  return (
    <div className="py-5 border-b last:border-b-0">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />

        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
    </div>
  );
}
