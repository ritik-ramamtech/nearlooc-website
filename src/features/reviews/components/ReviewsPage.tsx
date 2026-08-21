"use client";

import { useOffer } from "@/features/offers";
import { useReviewsByOffer } from "../hooks";
import { ReviewSummary } from "./ReviewSummary";
import { ReviewItem } from "./ReviewItem";

type ReviewsPageProps = {
  offerId: string;
};

export default function CustomerReviewsPage({ offerId }: ReviewsPageProps) {
  const { data: offer, isLoading: isOfferLoading } = useOffer(offerId);
  const { data: reviews, isLoading } = useReviewsByOffer(offerId);

  if (isLoading || isOfferLoading) return <div>Loading...</div>;
  return (
    <div className="p-2 lg:px-10">
      <div className="flex lg:gap-4">
        <div className="w-full lg:max-w-sm">
          {reviews?.summary && (
            <ReviewSummary
              total_reviews={reviews?.summary.total_reviews}
              avg_rating={reviews?.summary.avg_rating}
              distribution={reviews?.summary.distribution}
            />
          )}
        </div>
        <div className="lg:gap-10 hidden lg:flex">
          <div className="w-40 h-40">
            <img src={offer?.image_url} />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-semibold">{offer?.title}</h3>
            <p>by {offer?.merchant?.name}</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        {reviews?.items.map((review) => (
          <ReviewItem review={review} key={review.id} />
        ))}
      </div>
    </div>
  );
}
