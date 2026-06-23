import { TopBar } from "@/components/layout/TopBar";
import { OfferDetailSkeleton } from "@/features/offers/components/OfferDetailSkeleton";

/**
 * Route-level loading fallback — shown instantly on navigation to an offer
 * while the server component resolves, so clicking an offer always shows the
 * shimmer skeleton immediately (no blank/frozen gap).
 */
export default function OfferDetailLoading() {
  return (
    <>
      <TopBar title="Offer Details" />
      <div className="pt-14">
        <OfferDetailSkeleton />
      </div>
    </>
  );
}
