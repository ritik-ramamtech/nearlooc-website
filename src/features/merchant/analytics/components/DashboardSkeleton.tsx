import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-4 px-6 py-3 bg-slate-100">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl px-10 py-10">
        <Skeleton className="h-5 w-36 rounded-full" />
        <Skeleton className="mt-4 h-12 w-96 rounded-xl" />
        <Skeleton className="mt-3 h-5 w-72 rounded-xl" />

        {/* <div className="absolute -right-20 -top-12 h-72 w-72 rounded-full bg-green-200/40 blur-3xl" />
        <div className="absolute right-40 top-0 h-40 w-40 rounded-full bg-green-100/40 blur-3xl" /> */}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="mt-4 h-4 w-24" />
            <Skeleton className="mt-3 h-8 w-14" />
            <Skeleton className="mt-2 h-3 w-32" />
          </div>
        ))}
      </div>

      {/* Rating + Top Offer */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Rating */}
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <Skeleton className="h-5 w-40" />

          <div className="mt-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-3 w-4" />
                <Skeleton className="h-2 flex-1 rounded-full" />
                <Skeleton className="h-3 w-5" />
              </div>
            ))}
          </div>
        </div>

        {/* Top Offer */}
        <div className="relative overflow-hidden rounded-[28px] border border-stone-200 bg-[#FBFAF6] p-5 shadow-sm">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 via-green-400 to-teal-300" />

          <Skeleton className="h-5 w-44" />
          <Skeleton className="mt-2 h-4 w-28" />

          <div className="mt-6 flex gap-5">
            <Skeleton className="h-32 w-32 rounded-2xl" />

            <div className="flex-1">
              <Skeleton className="h-7 w-64" />

              <div className="mt-5 flex gap-3">
                <Skeleton className="h-7 w-24" />
                <Skeleton className="h-7 w-20 rounded-full" />
              </div>

              <Skeleton className="mt-5 h-4 w-36" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* Top offers */}
        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <Skeleton className="h-5 w-28" />

          <div className="mt-5 space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-2xl border p-3"
              >
                <Skeleton className="h-20 w-20 rounded-xl" />

                <div className="flex-1">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="mt-3 h-4 w-24" />
                  <Skeleton className="mt-2 h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <Skeleton className="h-5 w-36" />

          <div className="mt-5 space-y-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />

                <div className="flex-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="mt-2 h-3 w-44" />
                  <Skeleton className="mt-3 h-4 w-full" />
                  <Skeleton className="mt-2 h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}