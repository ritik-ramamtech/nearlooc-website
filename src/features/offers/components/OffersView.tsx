"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useOffers } from "@/features/offers/hooks";
import { useCategories } from "@/features/categories/hooks";
import {
  FiltersSidebar,
  FiltersSidebarSkeleton,
  applyOfferFilters,
  type OfferFilters,
  Sort,
} from "@/features/home/components/FiltersSidebar";
import { CategoryOffersResults } from "@/features/home/components/CategoryOffersResult";
import { OffersMapView } from "@/features/home/components/OffersMapView";
import { MobileFilterModal } from "@/features/home/components/MobileFilterModal";
import { useProfile } from "@/features/user";
import { useLocationStore } from "@/store/location.store";

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
  recommended: "recommended",
};

const TYPE_TITLE: Record<string, string> = {
  top_deals: "Top Deals",
  recommended: "Recommended",
};

export function OffersView({
  initialParams,
}: {
  initialParams: OffersInitialParams;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { type = "recommended" } = initialParams;
  const { location } = useLocationStore();

  const defaultSort = initialParams.sort ?? TYPE_SORT[type] ?? "";

  const urlSearch = searchParams.get("search") ?? initialParams.search ?? "";
  const [search, setSearch] = useState(urlSearch);
  const [page, setPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [filtersChanged, setFiltersChanged] = useState(false);

  const selectedCategoryId =
    searchParams.get("category_id") ?? initialParams.category_id ?? null;

  // Read filters from search params
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
    subcategoryId:
      searchParams.get("subcategory_id") ??
      initialParams.subcategory_id ??
      null,
    sort:
      (searchParams.get("sort") as Sort | null) ??
      (defaultSort as Sort | null) ??
      null,
    merchantname: searchParams.get("merchant_name") ?? null,
    maxDistanceKm: searchParams.get("max_distance_km")
      ? Number(searchParams.get("max_distance_km"))
      : null,
  };

  const updateFilters = (
    patch: Partial<OfferFilters>,
    categoryId: string | null,
  ) => {
    const next = { ...filters, ...patch };
    const params = new URLSearchParams(searchParams.toString());

    const categoryChanges = categoryId !== selectedCategoryId; //check against current catgeory id state in url and the next state we are trying to change to.

    if (categoryChanges) {
      next.subcategoryId = null;
      next.merchantname = null;
    }

    applyCategoryToParams(params, categoryId);

    setParam(params, "min_price", next.priceMin);
    setParam(params, "max_price", next.priceMax);
    setParam(params, "min_rating", next.minRating || null);
    setParam(params, "min_discount", next.minDiscount || null);
    setParam(params, "limited_time_only", next.limitedTimeOnly ? "true" : null);
    setParam(params, "giftable_only", next.giftableOnly ? "true" : null);
    setParam(params, "subcategory_id", next.subcategoryId);
    setParam(params, "sort", next.sort);
    setParam(params, "merchant_name", next.merchantname);
    setParam(params, "max_distance_km", next.maxDistanceKm);

    params.delete("badge");
    next.badges.forEach((badge) => params.append("badge", badge));

    router.replace(`/offers?${params.toString()}`);
  };

  const clearFilters = () => {
    router.replace(`/offers`);
  };

  const toggleMap = () => {
    setShowMap((prev) => !prev);
  };

  const applyCategoryToParams = (
    params: URLSearchParams,
    categoryId: string | null,
  ) => {
    setParam(params, "category_id", categoryId);

    // category change resets these
    params.delete("subcategory_id");
    params.delete("merchant_name");
  };

  // Fetch categories & subcategories
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();
  const { data, isPending, isFetching, isError, isPlaceholderData } = useOffers({
    category_id: selectedCategoryId ?? undefined,
    subcategory_id: filters.subcategoryId ?? undefined,
    query: debouncedSearch || undefined,
    sort: filters.sort ?? undefined,
    min_price: filters.priceMin ?? undefined,
    max_price: filters.priceMax ?? undefined,
    min_rating: filters.minRating || undefined,
    merchant_name: filters.merchantname ?? undefined,
    page,
    limit: 20,
    latitude: location?.latitude,
    longitude: location?.longitude,
    max_distance_km: filters.maxDistanceKm ?? undefined,
  });
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
  const subCategories = selectedCategory?.subcategories ?? [];
  const offers = applyOfferFilters(data?.items ?? [], filters);

  const pageTitle =
    initialParams.title ??
    selectedCategory?.name ??
    TYPE_TITLE[type] ??
    "All Offers";

  // Reset page + accumulated items whenever the query parameters/filters change
  const filtersKey = `${debouncedSearch}|${selectedCategoryId ?? ""}|${filters.priceMin ?? ""}|${filters.priceMax ?? ""}|${filters.minRating ?? ""}|${filters.badges.join(",")}|${filters.subcategoryId ?? ""}|${filters.sort ?? ""}|${filters.merchantname ?? ""}|${filters.maxDistanceKm ?? ""}`;
  const prevFiltersKey = useRef(filtersKey);



  useEffect(() => {
    if (prevFiltersKey.current !== filtersKey) {
      prevFiltersKey.current = filtersKey;
      setFiltersChanged(true);
      setPage(1);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [filtersKey]);

  // Keep local search in sync when the URL changes from outside this component
  // (e.g. a new query submitted from the nav bar search box)
  useEffect(() => {
    setSearch(urlSearch);
  }, [urlSearch]);

  // Sync debounced search to URL query param
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
      const params = new URLSearchParams(searchParams.toString());
      if (search) {
        params.set("search", search);
      } else {
        params.delete("search");
      }
      router.replace(`/offers?${params.toString()}`);
    }, 400);
    return () => clearTimeout(t);
    // searchParams intentionally omitted — router.replace() produces a new
    // searchParams object every time, which would re-trigger this effect and
    // loop forever. Only a real change to `search` should restart the debounce.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, router]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page]);

  useEffect(() => {
    if(!isPlaceholderData) {
      setFiltersChanged(false);
    }
  }, [isPlaceholderData]);

  const isFirstLoad = isPending && page === 1 && offers.length === 0;
  const showSkeleton = filtersChanged && isPlaceholderData;
  const showSpinner = !filtersChanged && isPlaceholderData;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-surface">
      <div className="max-w-container-max">
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr] 2xl:grid-cols-[280px_1fr] gap-2 2xl:gap-6">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden md:block">
            {categoriesLoading ? (
              <FiltersSidebarSkeleton />
            ) : (
              <FiltersSidebar
                filters={filters}
                onChange={updateFilters}
                onClear={clearFilters}
                badgeOptions={[]}
                priceBounds={{ min: 0, max: 5000 }}
                subCategories={subCategories}
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                hasCoordinates={!!location}
              />
            )}
          </aside>
          <CategoryOffersResults
            offers={offers}
            title={pageTitle}
            isFirstLoad={isFirstLoad}
            onOpenMobileFilters={() => setMobileFiltersOpen(true)}
            meta={data?.meta}
            isError={isError}
            sort={filters.sort}
            onSortChange={(sort) => updateFilters({ sort }, selectedCategoryId)}
            page={page}
            setPage={setPage}
            isFetching={isFetching}
            showSkeleton={showSkeleton}
            showSpinner={showSpinner}
            // isFetchingNextPage={isFetchingNextPage}
            // hasNextPage={hasNextPage}
          />
        </div>
      </div>

      {/* Mobile filters drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 lg:hidden">
          <div className="fixed inset-x-0 bottom-0 top-20 overflow-y-auto bg-white animate-in slide-in-from-bottom-0 duration-200">
            <MobileFilterModal
              filters={filters}
              onChange={updateFilters}
              onClear={clearFilters}
              badgeOptions={[]}
              priceBounds={{ min: 0, max: 5000 }}
              subCategories={subCategories}
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onClose={() => setMobileFiltersOpen(false)}
              sort={filters.sort}
              onSortChange={(sort) =>
                updateFilters({ sort }, selectedCategoryId)
              }
              hasCoordinates={!!location}
            />
          </div>
          {/* Click outside to close */}
          <div
            className="absolute inset-0 -z-10"
            onClick={() => setMobileFiltersOpen(false)}
          />
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
