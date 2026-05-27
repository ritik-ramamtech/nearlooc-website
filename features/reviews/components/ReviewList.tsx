import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatLocalDateShort } from "@/lib/utils";
import type { Review } from "@/types";

interface ReviewListProps {
  reviews: Review[];
}

function ReviewItem({ review }: { review: Review }) {
  return (
    <div className="flex gap-3">
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarImage src={review.user?.avatar_url ?? undefined} />
        <AvatarFallback className="bg-stitch-primary/10 text-stitch-primary text-label-sm">
          {review.user?.name?.charAt(0) ?? "U"}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="text-body-sm font-semibold text-on-surface">
            {review.user?.name ?? "Anonymous"}
          </p>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-on-surface-variant"
                }`}
              />
            ))}
          </div>
        </div>
        {review.comment && (
          <p className="mt-1 text-body-sm text-on-surface-variant leading-relaxed">{review.comment}</p>
        )}
        <p className="mt-1 text-label-sm text-on-surface-variant">
          {formatLocalDateShort(review.created_at)}
        </p>
      </div>
    </div>
  );
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <p className="py-4 text-center text-body-sm text-on-surface-variant">
        No reviews yet. Be the first!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))}
    </div>
  );
}
