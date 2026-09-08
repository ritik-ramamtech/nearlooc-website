"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { useVendorById, useVendorReviewsInfinite } from "@/features/vendors/hooks";
import { ReviewSummary } from "@/features/reviews/components/ReviewSummary";
import { ReviewItem } from "@/features/reviews/components/ReviewItem";
import ReviewSummarySkeleton from "@/features/reviews/components/ReviewSummarySkeleton";
import ReviewItemSkeleton from "@/features/reviews/components/ReviewItemSkeleton";
import { MessageSquare } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

const EMPTY_DISTRIBUTION = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 } as const;

export default function VendorReviewsPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();

  const { data: vendor } = useVendorById(id);

  const {
    data,
    isPending,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useVendorReviewsInfinite(id);

  const summary = data?.summary;
  const reviews = data?.items ?? [];

  return (
    <div className="mx-auto max-w-container-max px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="mb-3 text-sm text-stitch-primary hover:underline"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold">Store Reviews</h1>

        {vendor && (
          <p className="mt-1 text-sm text-on-surface-variant">
            {vendor.business_name}
          </p>
        )}
      </div>

      <div className="mx-auto max-w-2xl">
        {/* Summary */}
        <div className="rounded-2xl border border-outline-variant/50 px-4 py-4 shadow-sm">
          {isPending ? (
            <ReviewSummarySkeleton />
          ) : (
            <ReviewSummary
              total_reviews={summary?.total_reviews ?? 0}
              avg_rating={summary?.avg_rating ?? 0}
              distribution={summary?.rating_distribution ?? EMPTY_DISTRIBUTION}
            />
          )}
        </div>

        {/* List */}
        <div className="mt-8">
          <p className="font-medium">
            All Reviews {summary ? `(${summary.total_reviews})` : ""}
          </p>

          {isPending ? (
            <div className="mt-2 divide-y divide-outline-variant/50">
              <ReviewItemSkeleton />
              <ReviewItemSkeleton />
              <ReviewItemSkeleton />
            </div>
          ) : reviews.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <MessageSquare className="h-8 w-8 text-gray-300" />
              </div>
              <p className="text-base font-semibold text-gray-800">
                No reviews yet
              </p>
            </div>
          ) : (
            <>
              <div className="divide-y divide-outline-variant/50">
                {reviews.map((review) => (
                  <ReviewItem key={review.id} review={review} />
                ))}
              </div>

              {hasNextPage && (
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    className="rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition-all hover:border-gray-400 hover:text-gray-900 disabled:opacity-60"
                  >
                    {isFetchingNextPage ? "Loading..." : "Load more reviews"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
