"use client";

import { useState } from "react";
import { Star, MessageSquare } from "lucide-react";
import { useMyReviews } from "@/features/reviews/hooks";
import { TopBar } from "@/components/layout/TopBar";

export default function MyReviewsPage() {
  const [page, setPage] = useState(1);
  const { data, isPending } = useMyReviews(page);

  return (
    <div className="min-h-screen bg-page-bg">
      <TopBar title="My Reviews" />

      <div className="mx-auto max-w-2xl space-y-4 px-4 py-6">
        {isPending && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-gray-200" />
            ))}
          </div>
        )}

        {!isPending && (data?.items?.length ?? 0) === 0 && (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <MessageSquare className="h-10 w-10 text-gray-300" />
            <p className="text-sm font-medium text-gray-500">You haven&apos;t written any reviews yet.</p>
          </div>
        )}

        {!isPending && data?.items?.map((review) => (
          <div key={review.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
                />
              ))}
            </div>
            {review.comment && (
              <p className="text-sm text-gray-700">{review.comment}</p>
            )}
            <p className="mt-2 text-xs text-gray-400">
              {new Date(review.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          </div>
        ))}

        {!isPending && data?.meta && data.meta.total > data.meta.limit && (
          <div className="flex justify-center gap-2 pt-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              disabled={!data.meta.has_more}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
