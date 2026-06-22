import { Skeleton } from "@/components/ui/skeleton";

/**
 * Full-page placeholder for the offer detail view. Mirrors OfferDetail's
 * responsive layout: a constrained max-w-6xl wrapper that is a single stacked
 * column on mobile and a [gallery | info] grid on desktop — so the gallery
 * placeholder doesn't blow up to full viewport width.
 *
 * Reused by both the route-level loading.tsx (instant feedback on navigation)
 * and OfferDetail's own pending state.
 */
export function OfferDetailSkeleton() {
  return (
    <div className="pb-12">
      <div className="md:mx-auto md:max-w-6xl md:px-8 md:py-8">
        <div className="md:grid md:grid-cols-[1fr_420px] md:gap-10 md:items-start">
          {/* Left — gallery */}
          <div className="space-y-3">
            <Skeleton className="aspect-[4/3] w-full rounded-none md:rounded-2xl" />
            <div className="flex gap-2 px-4 md:px-0">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-16 rounded-xl" />
              ))}
            </div>
          </div>

          {/* Right — info */}
          <div className="space-y-5 px-4 pt-5 md:px-0 md:pt-0">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-7 w-3/4" />
            {/* Rating row */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-16" />
            </div>
            {/* Price */}
            <Skeleton className="h-9 w-1/2" />
            {/* Merchant row */}
            <div className="flex items-center gap-3">
              <Skeleton className="h-11 w-11 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-2/5" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-xl" />
              ))}
            </div>
            {/* Detail lines */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            {/* CTA */}
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
