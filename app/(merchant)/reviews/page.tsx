"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, MessageSquare, Filter } from "lucide-react";
import { useMerchantReviews } from "@/features/merchant/reviews/hooks";

const STAR_FILTERS = [
  { label: "All", value: undefined },
  { label: "5★", value: 5 },
  { label: "4★", value: 4 },
  { label: "3★", value: 3 },
  { label: "2★", value: 2 },
  { label: "1★", value: 1 },
];

export default function ReviewsPage() {
  const [starFilter, setStarFilter] = useState<number | undefined>(undefined);
  const [page, setPage] = useState(1);

  const { data, isPending } = useMerchantReviews({
    page,
    limit: 20,
    min_rating: starFilter,
    max_rating: starFilter,
  });

  const reviews = data?.data ?? [];
  const summary = data?.summary;
  const meta = data?.meta;

  return (
    <div className="min-h-screen bg-[#f0f7f0]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-20">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Customer Reviews</h1>
          <p className="text-xs text-gray-400">All reviews across your products and offers</p>
        </div>
      </header>

      <div className="p-6 max-w-3xl mx-auto space-y-5">
        {/* Summary card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex items-center gap-6">
          <div className="text-center shrink-0">
            <p className="text-4xl font-bold text-gray-900">
              {summary?.avg_rating ? summary.avg_rating.toFixed(1) : "—"}
            </p>
            <div className="flex justify-center mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.round(summary?.avg_rating ?? 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`}
                />
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1">{summary?.total_reviews ?? 0} reviews</p>
          </div>

          <div className="flex-1 space-y-1.5">
            {([5, 4, 3, 2, 1] as const).map((star) => {
              const count = (summary?.total_reviews ?? 0) > 0
                ? reviews.filter((r) => r.rating === star).length
                : 0;
              const total = summary?.total_reviews ?? 0;
              const pct = total > 0 ? (count / total) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 w-3 text-right">{star}</span>
                  <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 shrink-0" />
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-4 w-4 text-gray-400 shrink-0" />
          {STAR_FILTERS.map((f) => (
            <button
              key={String(f.value)}
              onClick={() => { setStarFilter(f.value); setPage(1); }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                starFilter === f.value
                  ? "bg-[#1a5c2a] text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-[#1a5c2a] hover:text-[#1a5c2a]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Reviews list */}
        {isPending ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 h-28 animate-pulse" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 flex flex-col items-center text-center">
            <div className="h-16 w-16 rounded-full bg-[#f0f7f0] flex items-center justify-center mb-4">
              <MessageSquare className="h-8 w-8 text-gray-300" />
            </div>
            <p className="text-base font-semibold text-gray-800">No reviews yet</p>
            <p className="text-sm text-gray-400 mt-1 max-w-xs">
              {starFilter
                ? `No ${starFilter}-star reviews found.`
                : "When customers leave reviews on your products and offers, they'll appear here."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <div className="flex gap-3">
                  {/* Avatar */}
                  <div className="h-10 w-10 rounded-full bg-[#f0f7f0] shrink-0 overflow-hidden">
                    {review.reviewer.avatar_url ? (
                      <Image
                        src={review.reviewer.avatar_url}
                        alt={review.reviewer.name}
                        width={40}
                        height={40}
                        className="object-cover h-full w-full"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-sm font-bold text-[#1a5c2a]">
                        {review.reviewer.name[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{review.reviewer.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`}
                            />
                          ))}
                          <span className="text-xs text-gray-400 ml-1">{review.rating}.0</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-400 shrink-0">
                        {new Date(review.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>

                    {/* Product/offer tags */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 bg-[#f0f7f0] text-[#1a5c2a] rounded-full">
                        {review.product.name}
                      </span>
                      {review.offer && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 bg-orange-50 text-orange-600 rounded-full">
                          Offer: {review.offer.title}
                        </span>
                      )}
                    </div>

                    {review.comment ? (
                      <p className="text-sm text-gray-600 mt-2 leading-relaxed">{review.comment}</p>
                    ) : (
                      <p className="text-sm text-gray-300 mt-2 italic">No comment left.</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {meta && meta.total_pages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:border-[#1a5c2a] hover:text-[#1a5c2a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ← Previous
            </button>
            <p className="text-sm text-gray-400">
              Page {meta.page} of {meta.total_pages}
            </p>
            <button
              disabled={!meta.has_more}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:border-[#1a5c2a] hover:text-[#1a5c2a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
