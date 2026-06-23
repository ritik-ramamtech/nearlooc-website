"use client";

import { useState, useMemo } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { EmptyState } from "@/components/ui/empty-state";
import { OfferCard } from "@/features/home/components/OfferCard";
import { OfferCardSkeletonGrid } from "@/features/home/components/OfferCardSkeleton";
import { useFavorites } from "@/features/favorites/hooks";
import { useCategories } from "@/features/categories/hooks";

export default function FavoritesPage() {
  const { data, isPending, isError } = useFavorites();
  const { data: categories = [] } = useCategories();
  const [activeCategory, setActiveCategory] = useState("All");

  // Build id → name map from the categories API
  const categoryNameById = useMemo(
    () => new Map(categories.map((c) => [c.id, c.name])),
    [categories]
  );

  // Derive category pills from offers using category_id → resolved name
  const categoryPills = useMemo(() => {
    if (!data?.items?.length) return ["All"];
    const names = data.items
      .map((o) => (o.category_name ?? categoryNameById.get(o.category_id)))
      .filter(Boolean) as string[];
    return ["All", ...Array.from(new Set(names))];
  }, [data?.items, categoryNameById]);

  const filtered = useMemo(() => {
    if (!data?.items) return [];
    if (activeCategory === "All") return data.items;
    return data.items.filter(
      (o) =>
        (o.category_name ?? categoryNameById.get(o.category_id)) === activeCategory
    );
  }, [data?.items, activeCategory, categoryNameById]);

  return (
    <>
      <TopBar title="My Favorites" showBack={false} />

      <div className="pt-14 min-h-screen bg-surface">
        {/* Loading skeleton */}
        {isPending && (
          <OfferCardSkeletonGrid className="px-4 py-4" />
        )}

        {isError && (
          <p className="py-10 text-center text-body-sm text-on-surface-variant">
            Failed to load favorites.
          </p>
        )}

        {data && !data.items?.length && (
          <EmptyState
            title="No favorites yet"
            subtitle="Tap the heart on any offer to save it here."
          />
        )}

        {data && data.items?.length > 0 && (
          <div className="px-4 py-4">
            {/* Count */}
            <p className="mb-3 text-label-sm text-on-surface-variant">
              {data.meta?.total ?? data.items.length} saved
            </p>

            {/* Category filter pills */}
            <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
              {categoryPills.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`shrink-0 px-4 py-1.5 rounded-full text-label-sm border transition-colors ${
                    activeCategory === cat
                      ? "bg-on-surface text-white border-on-surface"
                      : "bg-white text-on-surface-variant border-outline-variant"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Cards — same 240px fixed width as home feed, left-aligned, wrapping */}
            {filtered.length === 0 ? (
              <p className="py-10 text-center text-body-sm text-on-surface-variant">
                No favorites in this category.
              </p>
            ) : (
              <div className="flex flex-wrap gap-4">
                {filtered.map((offer) => (
                  <div key={offer.id} style={{ width: 240 }}>
                    <OfferCard offer={{ ...offer, is_favorite: true }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
