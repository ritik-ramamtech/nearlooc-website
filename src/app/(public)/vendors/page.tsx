"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { VendorCard } from "@/features/vendors/components/VendorCard";
import { VendorCardSkeleton } from "@/features/vendors/components/VendorCardSkeleton";
import { useVendorsInfinite } from "@/features/vendors/hooks";
import { useCategories } from "@/features/categories";
import { useRouter, useSearchParams } from "next/navigation";

export default function VendorsPage() {
  return (
    <Suspense fallback={<div className="min-h-[calc(100vh-4rem)] bg-surface" />}>
      <VendorsPageContent />
    </Suspense>
  );
}

function VendorsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [categoryId, setCategoryId] = useState(
    searchParams.get("categoryId") ?? "",
  );
  const [subcategoryId, setSubcategoryId] = useState(
    searchParams.get("subcategoryId") ?? "",
  );
  const sentinelRef = useRef<HTMLDivElement>(null);

  const updateQueryParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    router.replace(`/vendors?${params.toString()}`, {
      scroll: false,
    });
  };

  const {
    data,
    isPending,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useVendorsInfinite({search, category_id: categoryId, subcategory_id: subcategoryId});
  const { data: categories } = useCategories();

  const selectedCategory = categories?.find((c) => c.id === categoryId);

  const subcategories = selectedCategory?.subcategories ?? [];

  // Infinite scroll — load next page when sentinel enters the viewport
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Deduplicate across pages — backend may return the same item on adjacent pages
  const vendors = Array.from(
    new Map((data?.items ?? []).map((v) => [v.id, v])).values(),
  );
  const total = data?.meta.total ?? 0;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-surface">
      {/* Header */}
      <div className="bg-surface-container-lowest px-4 py-4">
        <div className="mx-auto max-w-container-max">
          <h1 className="text-headline-md font-bold text-on-surface">
            Vendors
          </h1>
          <p className="mt-0.5 text-body-sm text-on-surface-variant">
            Discover local businesses near you
          </p>

          <div className="flex gap-4 items-center mt-3">
            {/* Search */}
            <div className="relative w-[50%]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant" />
              <input
                value={search}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearch(value);

                  updateQueryParams({
                    search
                  });
                }}
                placeholder="Search vendors..."
                className="w-full rounded-xl border border-outline-variant bg-surface-container-low py-2.5 pl-10 pr-4 text-body-sm focus:outline-none focus:ring-1 focus:ring-stitch-primary"
              />
            </div>

            <select
              value={categoryId}
              onChange={(e) => {
                const value = e.target.value;
                setCategoryId(value);
                setSubcategoryId("");

                updateQueryParams({
                  categoryId: value,
                  subcategoryId: ""
                })
              }}
              className="rounded-xl border border-outline-variant px-3 h-11"
            >
              <option value="">All Categories</option>

              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={subcategoryId}
              disabled={!categoryId}
              onChange={(e) => {
                const value = e.target.value;
                setSubcategoryId(value);
                updateQueryParams({
                  subcategoryId: value,
                });
              }}
              className="rounded-xl border border-outline-variant px-3 h-11"
            >
              <option value="">All Subcategories</option>

              {subcategories.map((subcategory) => (
                <option key={subcategory.id} value={subcategory.id}>
                  {subcategory.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-container-max px-4 py-4">
        {/* Initial loading skeleton */}
        {isPending && <VendorCardSkeleton />}

        {isError && (
          <p className="py-10 text-center text-body-sm text-on-surface-variant">
            Failed to load vendors.
          </p>
        )}

        {!isPending && vendors.length === 0 && (
          <p className="py-10 text-center text-body-sm text-on-surface-variant">
            No vendors found.
          </p>
        )}

        {vendors.length > 0 && (
          <>
            <p className="mb-3 text-label-sm text-on-surface-variant">
              {total} vendors found
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {vendors.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </div>
          </>
        )}

        {/* "Load more" skeleton shown while fetching next page */}
        {isFetchingNextPage && (
          <div className="mt-3">
            <VendorCardSkeleton count={4} />
          </div>
        )}

        {/* Invisible sentinel — triggers next-page fetch when scrolled into view */}
        <div ref={sentinelRef} className="h-1" />
      </div>
    </div>
  );
}
