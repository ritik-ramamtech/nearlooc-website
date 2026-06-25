"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, SlidersHorizontal } from "lucide-react";
import { useOffers } from "@/features/offers/hooks";
import { OfferCard } from "@/features/home/components/OfferCard";
import { OfferCardSkeletonGrid } from "@/features/home/components/OfferCardSkeleton";
import { EmptyState } from "@/components/ui/empty-state";
import type { Offer } from "@/types";

export interface OffersInitialParams {
  type?: string;
  category_id?: string;
  subcategory_id?: string;
  search?: string;
  sort?: string;
  title?: string;
}

const TYPE_SORT: Record<string, string> = {
  top_deals: "discount",
  recommended: "rating",
};

const TYPE_TITLE: Record<string, string> = {
  top_deals: "Top Deals",
  recommended: "Recommended",
};

// Values must match backend GetOffersDto sort enum
const SORT_OPTIONS = [
  { label: "Best Discount", value: "discount" },
  { label: "Highest Rated", value: "rating" },
  { label: "Price: Low → High", value: "price_low_to_high" },
  { label: "Price: High → Low", value: "price_high_to_low" },
];

export function OffersView({ initialParams }: { initialParams: OffersInitialParams }) {
  const router = useRouter();
  const { type = "", category_id, subcategory_id } = initialParams;

  const pageTitle =
    initialParams.title ?? TYPE_TITLE[type] ?? "All Offers";
  const defaultSort = initialParams.sort ?? TYPE_SORT[type] ?? "";

  const [search, setSearch] = useState(initialParams.search ?? "");
  const [sort, setSort] = useState(defaultSort);
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [allItems, setAllItems] = useState<Offer[]>([]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // Reset page + accumulated items whenever the query filters change
  const filtersKey = `${debouncedSearch}|${sort}|${category_id ?? ""}|${subcategory_id ?? ""}`;
  const prevFiltersKey = useRef(filtersKey);
  useEffect(() => {
    if (prevFiltersKey.current === filtersKey) return;
    prevFiltersKey.current = filtersKey;
    setPage(1);
    setAllItems([]);
  }, [filtersKey]);

  const { data, isPending, isFetching } = useOffers({
    category_id,
    subcategory_id,
    query: debouncedSearch || undefined,
    sort: sort || undefined,
    page,
    limit: 20,
  });

  // Accumulate pages; page 1 always replaces
  useEffect(() => {
    if (!data?.items) return;
    setAllItems((prev) => (page === 1 ? data.items : [...prev, ...data.items]));
  // page is intentionally omitted — data change is the trigger, page is read inside
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const isFirstLoad = isPending && page === 1 && allItems.length === 0;
  const isLoadingMore = isFetching && page > 1;
  const hasMore = data?.meta?.has_more ?? false;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-surface pb-10">
      {/* Filter header */}
      <div className="border-b border-outline-variant/30 bg-surface">
       <div className="mx-auto max-w-container-max">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            onClick={() => router.back()}
            className="rounded-full p-1.5 hover:bg-surface-variant"
          >
            <ArrowLeft className="h-5 w-5 text-on-surface" />
          </button>
          <h1 className="flex-1 text-[17px] font-bold text-on-surface">{pageTitle}</h1>
        </div>

        <div className="flex gap-2 px-4 pb-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-on-surface-variant" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search offers…"
              className="h-9 w-full rounded-lg border border-outline-variant bg-surface-container-low pl-9 pr-3 text-[13px] text-on-surface placeholder:text-on-surface-variant focus:border-stitch-primary focus:outline-none"
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <SlidersHorizontal className="pointer-events-none absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-on-surface-variant" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-9 rounded-lg border border-outline-variant bg-surface-container-low pl-8 pr-2 text-[12px] text-on-surface focus:border-stitch-primary focus:outline-none"
            >
              <option value="">Sort</option>
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
       </div>
      </div>

      <div className="mx-auto max-w-container-max px-4 py-6">
        {/* First-load skeleton */}
        {isFirstLoad && (
          <OfferCardSkeletonGrid className="justify-center" />
        )}

        {/* Empty */}
        {!isFirstLoad && allItems.length === 0 && (
          <EmptyState
            title="No offers found"
            subtitle="Try a different search or sort."
          />
        )}

        {/* Results */}
        {!isFirstLoad && allItems.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(200px,240px))] gap-4 justify-center">
              {allItems.map((offer) => (
                <OfferCard key={offer.id} offer={offer} fluid />
              ))}
            </div>

            {hasMore && (
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={isLoadingMore}
                className="mt-5 w-full rounded-xl border border-outline-variant py-3 text-[13px] font-semibold text-stitch-primary hover:bg-surface-variant disabled:opacity-60"
              >
                {isLoadingMore ? "Loading…" : "Load more"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
