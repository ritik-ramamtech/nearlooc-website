"use client";

import { TopBar } from "@/components/layout/TopBar";
import { CouponCard } from "@/features/coupons/components/CouponCard";
import { useCoupons } from "@/features/coupons/hooks";

export default function CouponsPage() {
  const { data, isPending, isError } = useCoupons();

  return (
    <>
      <TopBar title="My Coupons" showBack={false} />
      <div className="pt-14 px-4 py-4 space-y-4">
        {isPending && (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-36 rounded-2xl bg-surface-container" />
            ))}
          </div>
        )}

        {isError && (
          <p className="py-10 text-center text-body-sm text-on-surface-variant">
            Failed to load coupons.
          </p>
        )}

        {data && data.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-headline-sm font-semibold text-on-surface">No coupons available</p>
            <p className="mt-1 text-body-sm text-on-surface-variant">Check back later for deals.</p>
          </div>
        )}

        {data?.map((coupon) => (
          <CouponCard key={coupon.id} coupon={coupon} />
        ))}
      </div>
    </>
  );
}
