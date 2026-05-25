"use client";

import { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateReview } from "../hooks";

interface ReviewFormProps {
  offerId: string;
  onSuccess?: () => void;
}

export function ReviewForm({ offerId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const { mutate, isPending, error } = useCreateReview();

  const submit = () => {
    if (!rating) return;
    mutate({ offer_id: offerId, rating, comment: comment || undefined }, {
      onSuccess: () => { onSuccess?.(); setRating(0); setComment(""); },
    });
  };

  const serverError = error && "response" in error
    ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
    : null;

  return (
    <div className="space-y-3">
      {serverError && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-label-sm text-red-600">{serverError}</p>
      )}

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
              className={`h-7 w-7 transition-colors ${
                star <= (hovered || rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-on-surface-variant"
              }`}
            />
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience (optional)"
        rows={3}
        className="w-full resize-none rounded-xl border border-outline-variant bg-surface-container-low p-3 text-body-sm focus:outline-none focus:ring-1 focus:ring-stitch-primary"
      />

      <Button
        onClick={submit}
        disabled={!rating || isPending}
        className="w-full bg-stitch-primary hover:bg-stitch-secondary text-white"
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Review"}
      </Button>
    </div>
  );
}
