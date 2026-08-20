import { cn, formatLocalDateShort } from "@/lib/utils";
import { Review } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

export function ReviewItem({ review }: { review: Review }) {
  return (
    <article className="flex gap-3 rounded-xl border-outline-variant bg-white py-4">
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarImage src={review.user?.avatar_url ?? undefined} />
        <AvatarFallback className="bg-stitch-primary/10 text-stitch-primary text-label-sm">
          {review.user?.name?.charAt(0) ?? "U"}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className="text-body-sm font-semibold text-on-surface">
            {review.user?.name ?? "Anonymous"}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-0.5 mt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-3.5 w-3.5",
                i < review.rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-outline-variant",
              )}
            />
          ))}
        </div>
        {review.comment && (
          <p className="mt-2 text-body-sm leading-relaxed text-on-surface-variant">
            {review.comment}
          </p>
        )}
        <p className="mt-2 text-label-sm text-on-surface-variant">
          Reviewed on: {formatLocalDateShort(review.created_at)}
        </p>
      </div>
    </article>
  );
}