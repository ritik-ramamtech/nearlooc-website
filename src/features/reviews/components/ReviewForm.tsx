"use client";

import { useEffect, useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getServerError } from "@/lib/utils";
import { useCreateReview } from "../hooks";
import { useOffer } from "@/features/offers";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ReviewFormProps {
  offerId: string;
  onSuccess?: () => void;
}

export function ReviewForm({ offerId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");

  const router = useRouter();

  const { data, isPending: loadingOffer } = useOffer(offerId);
  const { mutateAsync, isPending, error } = useCreateReview();

  const name = data?.title;
  const image_cover = data?.image_url
    ? data.image_url
    : data?.images && data?.images?.length > 0
      ? data?.images[0]
      : null;

  const submit = () => {
    if (!rating) return;
    mutateAsync(
      { offer_id: offerId, rating, comment: comment || undefined },
      {
        onSuccess: () => {
          onSuccess?.();
          setRating(0);
          setComment("");
          router.back();
        },
      },
    );
  };

  const serverError = getServerError(error);
  useEffect(() => {
    if (loadingOffer) return;
    if (!data) return;
    if (data?.can_review === false) {
      router.replace(`/offers/${offerId}`);
    }
  }, [data, loadingOffer, offerId, router]);

  if (isPending || loadingOffer) return <div>Loading...</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-8">
      {serverError && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-label-sm text-red-600">
          {serverError}
        </p>
      )}

      <div className="flex items-center gap-6 mb-6">
        <div className="relative h-24 w-24 overflow-hidden rounded-lg border">
          {image_cover && (
            <Image
              src={image_cover}
              alt={name || "offer image"}
              fill
              className="object-cover"
              sizes="80px"
            />
          )}
        </div>

        <div className="">
          <h2 className="text-xl font-bold">How was this item?</h2>
          <p className="">{name}</p>
        </div>
      </div>

      {/* Star rating */}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
          >
            <Star
              className={`h-8 w-8 transition-colors ${
                star <= (hovered || rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-on-surface-variant"
              }`}
            />
          </button>
        ))}
      </div>

      <p className="font-semibold">Write a Review</p>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience (optional)"
        rows={5}
        className="w-full resize-none rounded-xl border border-outline-variant bg-surface-container-low p-3 text-body-sm focus:outline-none focus:ring-1 focus:ring-stitch-primary"
      />

      <Button
        onClick={submit}
        disabled={!rating || isPending}
        className="w-fit px-8 bg-stitch-primary hover:bg-stitch-secondary text-white"
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          "Submit Review"
        )}
      </Button>
    </div>
  );
}
