"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useOffers } from "@/features/offers/hooks";
import {
  FiltersSidebar,
  FiltersSidebarSkeleton,
  Sort,
  applyOfferFilters,
  type OfferFilters,
} from "@/features/home/components/FiltersSidebar";
import { useCategories } from "@/features/categories";
import {
  CategoryOffersResults,
  CategoryOffersResultsSkeleton,
} from "../CategoryOffersResult";
import type { Offer } from "@/types";

export function CategoryOffersPage({ categoryId }: { categoryId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data: categories = [], isLoading } = useCategories();
  const selectedCategory = categories.find(
    (category) => category.id === categoryId,
  );

  const subCategories = selectedCategory?.subcategories ?? [];

  const filters: OfferFilters = {
    priceMin: searchParams.get("min_price")
      ? Number(searchParams.get("min_price"))
      : null,
    priceMax: searchParams.get("max_price")
      ? Number(searchParams.get("max_price"))
      : null,
    minRating: Number(searchParams.get("min_rating") ?? 0),
    minDiscount: Number(searchParams.get("min_discount") ?? 0),
    badges: searchParams.getAll("badge"),
    limitedTimeOnly: searchParams.get("limited_time_only") === "true",
    giftableOnly: searchParams.get("giftable_only") === "true",
    subcategoryId: searchParams.get("subcategory_id"),
    sort: (searchParams.get("sort") as Sort | null) ?? null,
    merchantname: (searchParams.get("merchant_name"))
  };

  const updateFilters = (patch: Partial<OfferFilters>) => {
    const next = { ...filters, ...patch };
    const params = new URLSearchParams(searchParams.toString());

    setParam(params, "min_price", next.priceMin);
    setParam(params, "max_price", next.priceMax);
    setParam(params, "min_rating", next.minRating || null);
    setParam(params, "min_discount", next.minDiscount || null);
    setParam(params, "limited_time_only", next.limitedTimeOnly ? "true" : null);
    setParam(params, "giftable_only", next.giftableOnly ? "true" : null);
    setParam(params, "subcategory_id", next.subcategoryId);
    setParam(params, "sort", next.sort);
    setParam(params, "merchant_name", next.merchantname)

    params.delete("badge");
    next.badges.forEach((badge) => params.append("badge", badge));

    router.replace(`/home/${categoryId}?${params.toString()}`);
  };

  const clearFilters = () => {
    router.replace(`/home/${categoryId}`);
  };

  // Local state for infinite scroll
  const [page, setPage] = useState(1);
  const [allItems, setAllItems] = useState<Offer[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Reset page and accumulated items when any filters/categories change
  const filtersKey = `${categoryId}|${filters.priceMin ?? ""}|${filters.priceMax ?? ""}|${filters.minRating ?? ""}|${filters.minDiscount ?? ""}|${filters.badges.join(",")}|${filters.limitedTimeOnly}|${filters.giftableOnly}|${filters.subcategoryId ?? ""}|${filters.sort ?? ""}`;
  const prevFiltersKey = useRef(filtersKey);

  useEffect(() => {
    if (prevFiltersKey.current !== filtersKey) {
      prevFiltersKey.current = filtersKey;
      setPage(1);
      setAllItems([]);
    }
  }, [filtersKey]);

  const offersQuery = useOffers({
    category_id: categoryId,
    min_price: filters.priceMin ?? undefined,
    max_price: filters.priceMax ?? undefined,
    min_rating: filters.minRating || undefined,
    sort: filters.sort ?? undefined,
    page,
    limit: 20,
    subcategory_id: filters.subcategoryId ?? undefined,
  });

  // Accumulate pages; page 1 always replaces
  useEffect(() => {
    if (!offersQuery.data?.items) return;
    setAllItems((prev) => (page === 1 ? offersQuery.data.items : [...prev, ...offersQuery.data.items]));
  }, [offersQuery.data, page]);

  // Apply client-side filters (min_discount, limitedTimeOnly, giftableOnly etc.) on all accumulated items
  const offers = applyOfferFilters(allItems, filters);

  const isFirstLoad = offersQuery.isPending && page === 1 && allItems.length === 0;
  const isLoadingMore = offersQuery.isFetching && page > 1;
  const hasMore = offersQuery.data?.meta?.has_more ?? false;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        <FiltersSidebarSkeleton />
        <CategoryOffersResultsSkeleton />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
      <div className="hidden lg:block">
        <FiltersSidebar
          filters={filters}
          onChange={updateFilters}
          onClear={clearFilters}
          badgeOptions={[]}
          priceBounds={{ min: 0, max: 5000 }}
          subCategories={subCategories}
          categories={categories}
          selectedCategoryId={categoryId}
        />
      </div>

      <CategoryOffersResults
        offers={offers}
        title={selectedCategory?.name ?? "Category"}
        isFirstLoad={isFirstLoad}
        isLoadingMore={isLoadingMore}
        hasMore={hasMore}
        onLoadMore={() => setPage((p) => p + 1)}
        onOpenMobileFilters={() => setMobileFiltersOpen(true)}
        meta={offersQuery.data?.meta}
        isError={offersQuery.isError}
        sort={filters.sort}
        onSortChange={(sort) => updateFilters({ sort })}
      />

      {/* Mobile filters drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 lg:hidden">
          <div className="relative w-[300px] h-full overflow-y-auto bg-white p-5 animate-in slide-in-from-right duration-200">
            <FiltersSidebar
              filters={filters}
              onChange={updateFilters}
              onClear={clearFilters}
              badgeOptions={[]}
              priceBounds={{ min: 0, max: 5000 }}
              subCategories={subCategories}
              categories={categories}
              selectedCategoryId={categoryId}
              onClose={() => setMobileFiltersOpen(false)}
            />
          </div>
          {/* Click outside to close */}
          <div className="absolute inset-0 -z-10" onClick={() => setMobileFiltersOpen(false)} />
        </div>
      )}
    </div>
  );
}

function setParam(
  params: URLSearchParams,
  key: string,
  value: string | number | null | undefined,
) {
  if (value === null || value === undefined || value === "") {
    params.delete(key);
  } else {
    params.set(key, String(value));
  }
}
