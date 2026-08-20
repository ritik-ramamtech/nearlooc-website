import type { Review } from "@/types";
import Link from "next/link";
import { RatingSummary } from "../api";
import { ReviewItem } from "./ReviewItem";

interface ReviewListProps {
  offerId: string;
  reviews: Review[];
  total?: number;
  averageRating?: number;
  isLoading?: boolean;
  isError?: boolean;
  summary?: RatingSummary;
}


export function ReviewList({
  reviews,
  total,
  averageRating,
  isLoading,
  isError,
  summary,
  offerId,
}: ReviewListProps) {
  const reviewCount = total ?? reviews.length;
  const previewReviews = reviews.slice(0, 4);

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-5">
        <div className="h-5 w-28 rounded bg-outline-variant/40" />
        <div className="mt-4 space-y-3">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="rounded-xl border border-outline-variant bg-white p-4"
            >
              <div className="h-4 w-40 rounded bg-outline-variant/40" />
              <div className="mt-3 h-4 w-full rounded bg-outline-variant/30" />
              <div className="mt-2 h-4 w-2/3 rounded bg-outline-variant/30" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-5">
        <h2 className="text-title-md font-bold text-on-surface">Reviews</h2>
        <p className="mt-3 text-body-sm text-on-surface-variant">
          Failed to load reviews. Please try again.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border-outline-variant bg-surface-container-lowest">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-title-md font-bold text-on-surface">Reviews</h2>
          <p className="mt-1 text-body-sm text-on-surface-variant">
            What customers are saying about this offer
          </p>
        </div>
      </div>

      {previewReviews.length === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-outline-variant bg-white px-4 py-8 text-center">
          <p className="text-body-sm font-medium text-on-surface">
            No reviews yet
          </p>
          <p className="mt-1 text-body-sm text-on-surface-variant">
            Reviews from customers will appear here once they are posted.
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {previewReviews.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))}
        </div>
      )}

      {reviewCount > 4 && (
        <div className="mt-6 flex justify-center cursor-pointer">
          <Link
            href={`/customer-reviews/${offerId}`}
            className="rounded-lg border border-outline-variant px-5 py-2.5 text-sm text-black font-medium transition-colors hover:bg-surface-container"
          >
            See all {reviewCount} reviews
          </Link>
        </div>
      )}
    </section>
  );
}
