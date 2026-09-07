"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import type { MerchantReview } from "@/features/merchant/reviews/api";
import Image from "next/image";
import {
  Star,
  MessageSquare,
  ChevronDown,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  BarChart2,
  Award,
} from "lucide-react";
import { useMerchantReviews } from "@/features/merchant/reviews/hooks";
import { SkeletonList } from "@/components/ui/skeleton";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formatLocalDateShort } from "@/lib/utils";
import { RatingDistributionBars } from "@/components/rating/rating-distribution-bars";

const STAR_FILTERS = [
  { label: "All Stars", value: undefined },
  { label: "5★ only", value: 5 },
  { label: "4★ only", value: 4 },
  { label: "3★ only", value: 3 },
  { label: "2★ only", value: 2 },
  { label: "1★ only", value: 1 },
];

export enum Sort {
  newest = "newest",
  oldest = "oldest",
  highest_rated = "highest_rated",
  lowest_rated = "lowest_rated",
}

const SORT_OPTIONS: { label: string; value: Sort }[] = [
  { label: "Newest First", value: Sort.newest },
  { label: "Oldest First", value: Sort.oldest },
  { label: "Highest Rated", value: Sort.highest_rated },
  { label: "Lowest Rated", value: Sort.lowest_rated },
];

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < rating
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-200 fill-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

function InitialAvatar({
  name,
  size = "md",
}: {
  name: string;
  size?: "sm" | "md";
}) {
  const colors = [
    "bg-violet-100 text-violet-600",
    "bg-blue-100 text-blue-600",
    "bg-emerald-100 text-emerald-600",
    "bg-rose-100 text-rose-600",
    "bg-amber-100 text-amber-600",
    "bg-cyan-100 text-cyan-600",
  ];
  const idx = name.charCodeAt(0) % colors.length;
  const cls = size === "sm" ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm";
  return (
    <div
      className={`${cls} ${colors[idx]} rounded-full flex items-center justify-center font-bold shrink-0`}
    >
      {name[0]?.toUpperCase()}
    </div>
  );
}

function ReviewComment({ comment }: { comment: string }) {
  const [expanded, setExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (el) setIsTruncated(el.scrollHeight > el.clientHeight);
  }, [comment]);

  return (
    <>
      <p
        ref={ref}
        className={`mt-3 text-sm leading-6 text-gray-600 ${expanded ? "" : "line-clamp-3"}`}
      >
        {comment}
      </p>
      {isTruncated && (
        <button
          onClick={() => setExpanded((e) => !e)}
          className="mt-2 text-sm font-semibold text-emerald-700"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </>
  );
}

export default function ReviewsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-100" />}>
      <ReviewsPageContent />
    </Suspense>
  );
}

function ReviewsPageContent() {
  const [page, setPage] = useState(1);
  const [sortOpen, setSortOpen] = useState(false);
  const [ratingOpen, setRatingOpen] = useState(false);

  const pathName = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sort: Sort = (searchParams.get("sort") as Sort) ?? Sort.oldest;
  const hasComment = searchParams.get("has_comment") === "true" ? true : undefined;
  const starFilter = searchParams.get("rating")
    ? Number(searchParams.get("rating"))
    : undefined;

  const { data, isPending, isFetching, isPlaceholderData } = useMerchantReviews({
    page,
    limit: 20,
    min_rating: starFilter,
    max_rating: starFilter,
    sort: sort,
    has_comment: hasComment,
  });

  const [allReviews, setAllReviews] = useState<MerchantReview[]>([]);

  // Reset page when filters change — allReviews is left as-is (still showing the
  // old list) until real (non-placeholder) data for page 1 lands, at which point
  // the accumulate effect below replaces it wholesale. Avoids an empty-state flash.
  const filtersKey = `${sort}|${starFilter ?? ""}|${hasComment ?? ""}`;
  const prevFiltersKey = useRef(filtersKey);

  useEffect(() => {
    if (prevFiltersKey.current !== filtersKey) {
      prevFiltersKey.current = filtersKey;
      setPage(1);
    }
  }, [filtersKey]);

  // Accumulate pages; page 1 always replaces. Skip while `data` is just
  // placeholderData (the previous query's result) — otherwise a page bump
  // would re-append stale data before the real page lands.
  useEffect(() => {
    if (!data?.data || isPlaceholderData) return;
    setAllReviews((prev) => (page === 1 ? data.data : [...prev, ...data.data]));
  }, [data, page, isPlaceholderData]);

  const setParam = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams);

    if (!value) params.delete(key);
    else {
      params.set(key, value);
    }

    router.replace(`${pathName}?${params.toString()}`);
  };

  const selectedSort =
    SORT_OPTIONS.find((o) => o.value === sort) ?? SORT_OPTIONS[0];

  const selectedStarFilter =
    STAR_FILTERS.find((f) => f.value === starFilter) ?? STAR_FILTERS[0];

  const reviews = allReviews;
  const summary = data?.summary;
  const meta = data?.meta;
  const isFirstLoad = isPending && page === 1;
  const isLoadingMore = isFetching && page > 1;
  const avgRating = summary?.avg_rating ?? 0;
  const totalReviews = summary?.total_reviews ?? 0;

  const distribution = summary?.rating_distribution;
  const trend = summary?.rating_trend;

  const fiveStarPct =
    distribution && totalReviews > 0
      ? Math.round((distribution["5"] / totalReviews) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-20">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Customer Reviews</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            All reviews across your products and offers
          </p>
        </div>
      </header>

      <div className="p-2 sm:p-6 max-w-8xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row w-full gap-2 xl:gap-4">
          {/* ── Rating summary card ── */}
          <div className="bg-gradient-to-r from-emerald-50 via-white to-green-50 flex-1 rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-row sm:items-center gap-4 xl:gap-8">
            {/* Big average */}
            <div className="text-center shrink-0 w-30 xl:w-32">
              <p className="text-5xl font-extrabold text-gray-900 leading-none">
                {avgRating ? avgRating.toFixed(1) : "—"}
              </p>
              <div className="flex justify-center mt-2">
                <StarRow rating={Math.round(avgRating)} />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
              </p>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px self-stretch bg-gray-100" />

            {/* Per-star bars */}
            <RatingDistributionBars
              className="flex-1"
              distribution={distribution ?? {}}
              totalReviews={totalReviews}
            />
          </div>
          {/* ── Stat tiles ── */}
          <div className="grid grid-cols-2 gap-4">
            {/* 5-star % */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
              <div className="flex gap-6 items-center justify-between">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  5-Star Reviews
                </span>
                <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <Award className="h-4 w-4 text-emerald-500" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-gray-900 leading-none">
                  {fiveStarPct}%
                </p>
                <p className="text-xs text-gray-400 mt-2">5 Star Reviews</p>
              </div>
            </div>

            {/* This week */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  This Week
                </span>
                <div className="h-8 w-8 rounded-lg bg-violet-50 flex items-center justify-center">
                  {trend?.direction === "down" ? (
                    <TrendingDown className="h-4 w-4 text-violet-500" />
                  ) : (
                    <TrendingUp className="h-4 w-4 text-violet-500" />
                  )}
                </div>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-gray-900 leading-none">
                  {trend
                    ? `${trend.direction === "up" ? "+" : trend.direction === "down" ? "-" : ""}${Math.abs(trend.difference).toFixed(1)}`
                    : "—"}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  {trend?.direction === "up"
                    ? "Rating trending up"
                    : trend?.direction === "down"
                      ? "Rating trending down"
                      : "No change this week"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Controls row ── */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Rating dropdown */}
            <div className="relative">
              <button
                onClick={() => setRatingOpen((o) => !o)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:border-gray-400 transition-all"
              >
                {selectedStarFilter.label}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${ratingOpen ? "rotate-180" : ""}`}
                />
              </button>
              {ratingOpen && (
                <div className="absolute left-0 mt-2 w-36 bg-white border border-gray-100 rounded-xl shadow-lg z-10 overflow-hidden">
                  {STAR_FILTERS.map((f) => (
                    <button
                      key={String(f.value)}
                      onClick={() => {
                        setParam("rating", f.value?.toString());
                        setPage(1);
                        setRatingOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        starFilter === f.value
                          ? "bg-gray-50 font-semibold text-gray-900"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Has-comment toggle */}
            <button
              onClick={() => {
                setParam("has_comment", hasComment ? undefined : "true");
                setPage(1);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all ${
                hasComment
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900"
              }`}
            >
              <MessageSquare className="h-3 w-3" />
              With Comments
            </button>
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setSortOpen((o) => !o)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:border-gray-400 transition-all"
            >
              {selectedSort.label}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${sortOpen ? "rotate-180" : ""}`}
              />
            </button>
            {sortOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-xl shadow-lg z-10 overflow-hidden">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setParam("sort", opt.value);
                      setSortOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      sort === opt.value
                        ? "bg-gray-50 font-semibold text-gray-900"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Reviews grid ── */}
        {isFirstLoad ? (
          <SkeletonList itemHeight={200} itemClassName="rounded-2xl" />
        ) : reviews.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 flex flex-col items-center text-center">
            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <MessageSquare className="h-8 w-8 text-gray-300" />
            </div>
            <p className="text-base font-semibold text-gray-800">
              No reviews yet
            </p>
            <p className="text-sm text-gray-400 mt-1 max-w-xs">
              {starFilter
                ? `No ${starFilter}-star reviews found.`
                : "When customers leave reviews on your products and offers, they'll appear here."}
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3">
              {reviews.map((review) => {
                const productImg =
                  review.product.image_url ??
                  review.product.images?.[0] ??
                  null;
                return (
                  <div
                    key={review.id}
                    // className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-row items-stretch"
                    className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                  >
                    {/* Product image */}
                    <div className="relative w-32 shrink-0 bg-white border-r border-gray-50 p-3 flex flex-col justify-center">
                      <div className="relative w-full aspect-square">
                        {productImg ? (
                          <Image
                            src={productImg}
                            alt={review.product.name}
                            fill
                            sizes="128px"
                            className="object-contain rounded-lg"
                          />
                        ) : (
                          <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
                            <MessageSquare className="h-8 w-8 text-gray-300" />
                          </div>
                        )}
                      </div>
                      {/* {productName} */}
                    </div>

                    {/* Card body */}
                    {/* <div className="p-4 space-y-3 flex-1 min-w-0 flex flex-col">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <StarRow rating={review.rating} />
                          <span className="text-xs font-bold text-gray-700">
                            {review.rating}.0
                          </span>
                        </div>
                        <span className="text-[11px] text-gray-400">
                          {new Date(review.created_at).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                          {review.reviewer.avatar_url ? (
                            <div className="h-12 w-12 rounded-full overflow-hidden shrink-0">
                              <Image
                                src={review.reviewer.avatar_url}
                                alt={review.reviewer.name}
                                width={32}
                                height={32}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          ) : (
                            <InitialAvatar
                              name={review.reviewer.name}
                              size="sm"
                            />
                          )}
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {review.reviewer.name}
                          </p>
                          <p className="text-[11px] text-gray-500 truncate">
                            {review.product.name}
                          </p>
                        </div>
                      </div>

                      <div className="flex-1">
                        {review.comment ? (
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {review.comment}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-300 italic">
                            No comment left.
                          </p>
                        )}
                      </div>
                    </div> */}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <StarRow rating={review.rating} />
                            <span>{review.rating}.0</span>
                          </div>

                          <p className="mt-2 font-semibold">
                            {review.reviewer.name}
                          </p>

                          <p className="text-xs text-gray-500">
                            {review.product.name}
                          </p>
                        </div>

                        <span className="shrink-0 text-xs text-gray-400">
                          {formatLocalDateShort(review.created_at)}
                        </span>
                      </div>

                      {review.comment ? (
                        <ReviewComment comment={review.comment} />
                      ) : (
                        <p className="mt-3 text-sm italic leading-6 text-gray-400">
                          No comment left.
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
              {isLoadingMore && (
                <SkeletonList
                  itemHeight={200}
                  itemClassName="rounded-2xl"
                  min={2}
                  max={2}
                />
              )}
            </div>

            {/* ── Pagination / Load more ── */}
            {meta && meta.total_pages > 1 && (
              <div className="flex flex-col items-center gap-3 pt-2">
                {meta.has_more && (
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={isLoadingMore}
                    className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:border-gray-400 hover:text-gray-900 transition-all shadow-sm disabled:opacity-60"
                  >
                    {isLoadingMore ? (
                      "Loading..."
                    ) : (
                      <>
                        View more reviews
                        <ChevronDown className="h-4 w-4" />
                      </>
                    )}
                  </button>
                )}
                <p className="text-xs text-gray-400">
                  Page {meta.page} of {meta.total_pages} · {meta.total} total
                  reviews
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
