"use client";

import { useState, useMemo, useEffect } from "react";
import { CategoryBar, VENDORS_TAB } from "@/features/home/components/CategoryBar";
import { SubcategoryBar, type SortOption } from "@/features/home/components/SubcategoryBar";
import {
  FiltersSidebar,
  EMPTY_FILTERS,
  applyOfferFilters,
  countActiveFilters,
  type OfferFilters,
} from "@/features/home/components/FiltersSidebar";
import type { Offer } from "@/types";
import { OfferSection } from "@/features/home/components/OfferSection";
import { FeaturedVendors } from "@/features/home/components/FeaturedVendors";
import { VendorCard } from "@/features/vendors/components/VendorCard";
import { VendorCardSkeleton } from "@/features/vendors/components/VendorCardSkeleton";
import { OfferSectionSkeleton } from "@/features/home/components/OfferCardSkeleton";
import { useHomeFeed } from "@/features/home/hooks";
import { useCategories } from "@/features/categories/hooks";
import { useVendorsInfinite } from "@/features/vendors/hooks";
import type { OfferSection as OfferSectionType } from "@/types";

/** Client-side sort applied to a section's offers. "relevance" preserves API order. */
function sortOffers(offers: Offer[], sort: SortOption): Offer[] {
  if (sort === "relevance") return offers;
  const sorted = [...offers];
  switch (sort) {
    case "price_asc":
      return sorted.sort((a, b) => a.discounted_price - b.discounted_price);
    case "price_desc":
      return sorted.sort((a, b) => b.discounted_price - a.discounted_price);
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "discount":
      return sorted.sort((a, b) => b.discount_percentage - a.discount_percentage);
    default:
      return offers;
  }
}

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOption>("relevance");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<OfferFilters>(EMPTY_FILTERS);

  const isVendorsTab = selectedCategory === VENDORS_TAB;
  // Default landing view â€” no filters active. Shows the rich hero + vendor showcase.
  const isLanding = !selectedCategory;

  const { data: categories = [] } = useCategories();
  const {
    data: vendorsData,
    isPending: vendorsPending,
    isError: vendorsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useVendorsInfinite();

  // Auto-fetch all pages sequentially until hasNextPage is false
  useEffect(() => {
    if (isVendorsTab && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isVendorsTab, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Only send category_id to the API â€” subcategory filtering is done client-side
  const feedQuery = useMemo(() => {
    if (!selectedCategory || isVendorsTab) return undefined;
    return { category_id: selectedCategory };
  }, [selectedCategory, isVendorsTab]);

  const { data, isPending, isError } = useHomeFeed(feedQuery);

  // Subcategories for the active category tab
  const subcategories = useMemo(() => {
    if (!selectedCategory) return [];
    return categories.find((c) => c.id === selectedCategory)?.subcategories ?? [];
  }, [categories, selectedCategory]);

  function handleCategorySelect(id: string | null) {
    setSelectedCategory(id);
    setSelectedSubcategory(null);
    setFilters(EMPTY_FILTERS);
  }

  function handleSubcategorySelect(categoryId: string, subcategoryId: string) {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(subcategoryId);
  }

  /*
   * Default feed (no category selected):
   * Show sections returned by the API as-is (top_deals, recommended, etc.)
   *
   * Category selected, no subcategory:
   * Group offers by subcategory â†’ one OfferSection per subcategory.
   * Falls back to a single "All [category]" section if offers have no subcategory_id.
   *
   * Category + subcategory selected:
   * Show a single filtered OfferSection.
   */
  const displaySections = useMemo<OfferSectionType[]>(() => {
    if (!data) return [];

    // Default feed â€” API sections + per-category grouped sections
    if (!selectedCategory) {
      const categoryNameById = new Map(categories.map((c) => [c.id, c.name]));
      // Hide the "Recommended For You" section from the UI
      const apiSections = data.sections.filter((s) => s.type !== "recommended");
      const allOffers = apiSections.flatMap((s) => s.offers);

      const grouped = new Map<string, typeof allOffers>();
      for (const offer of allOffers) {
        if (!offer.category_id) continue;
        if (!grouped.has(offer.category_id)) grouped.set(offer.category_id, []);
        grouped.get(offer.category_id)!.push(offer);
      }

      const catSections: OfferSectionType[] = categories.flatMap((category) => {
        const offers = grouped.get(category.id);
        if (!offers || offers.length === 0) return [];
        const uniqueOffers = Array.from(new Map(offers.map((o) => [o.id, o])).values());
        return [{
          type: `category_${category.id}`,
          title: categoryNameById.get(category.id) ?? category.name,
          parent_category: category.id,
          offers: uniqueOffers,
        }];
      });

      return [...apiSections, ...catSections];
    }

    const allOffers = data.sections.flatMap((s) => s.offers);
    if (allOffers.length === 0) return [];

    // Subcategory selected â†’ filter offers client-side by subcategory_id
    if (selectedSubcategory) {
      const subcategoryName =
        subcategories.find((s) => s.id === selectedSubcategory)?.name ?? "Offers";
      const filtered = allOffers.filter((o) => o.subcategory_id === selectedSubcategory);
      return [{ type: "filtered", title: subcategoryName, parent_category: selectedCategory, offers: filtered }];
    }

    // Category selected, no subcategory â†’ group by subcategory_id
    const subcategoryNameById = new Map(subcategories.map((s) => [s.id, s.name]));
    const grouped = new Map<string, typeof allOffers>();
    const noSubcat: typeof allOffers = [];

    for (const offer of allOffers) {
      if (offer.subcategory_id) {
        if (!grouped.has(offer.subcategory_id)) grouped.set(offer.subcategory_id, []);
        grouped.get(offer.subcategory_id)!.push(offer);
      } else {
        noSubcat.push(offer);
      }
    }

    const sections: OfferSectionType[] = [];

    // Ordered by subcategory list from the API
    for (const sub of subcategories) {
      const offers = grouped.get(sub.id);
      if (!offers || offers.length === 0) continue;
      sections.push({
        type: `subcat_${sub.id}`,
        title: subcategoryNameById.get(sub.id) ?? sub.name,
        parent_category: selectedCategory,
        offers,
      });
    }

    // Offers with no subcategory_id go at the end under the category name
    if (noSubcat.length > 0) {
      const catName = categories.find((c) => c.id === selectedCategory)?.name ?? "Offers";
      sections.push({
        type: `cat_other_${selectedCategory}`,
        title: catName,
        parent_category: selectedCategory,
        offers: noSubcat,
      });
    }

    // If there were no subcategory matches at all, show everything together
    if (sections.length === 0) {
      const catName = categories.find((c) => c.id === selectedCategory)?.name ?? "Offers";
      sections.push({
        type: `cat_all_${selectedCategory}`,
        title: catName,
        parent_category: selectedCategory,
        offers: allOffers,
      });
    }

    return sections;
  }, [data, selectedCategory, selectedSubcategory, subcategories, categories]);

  // Apply sidebar filters, then sort, to each section — dropping emptied sections.
  const sortedSections = useMemo<OfferSectionType[]>(() => {
    return displaySections.flatMap((s) => {
      const filtered = applyOfferFilters(s.offers, filters);
      if (filtered.length === 0) return [];
      return [{ ...s, offers: sortOffers(filtered, sort) }];
    });
  }, [displaySections, filters, sort]);

  // Badge options + price bounds for the filters sidebar, derived from loaded offers.
  const { badgeOptions, priceBounds } = useMemo(() => {
    const offers = displaySections.flatMap((s) => s.offers);
    const badges = new Set<string>();
    let min = Infinity;
    let max = 0;
    for (const o of offers) {
      if (o.badge) badges.add(o.badge);
      min = Math.min(min, o.discounted_price);
      max = Math.max(max, o.discounted_price);
    }
    return {
      badgeOptions: Array.from(badges).sort(),
      priceBounds: offers.length ? { min: Math.floor(min), max: Math.ceil(max) } : { min: 0, max: 0 },
    };
  }, [displaySections]);

  const activeFilterCount = countActiveFilters(filters);
  const isEmpty = !isPending && !isError && sortedSections.every((s) => s.offers.length === 0);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-surface">


      {/* â”€â”€ Sticky filter header â”€â”€ */}
      <div className="sticky top-16 z-30">

        {/* Main category tabs */}
        <div className="bg-surface">
          <div className="mx-auto max-w-container-max">
            <CategoryBar
              categories={categories}
              selected={selectedCategory}
              onSelect={handleCategorySelect}
              onSubcategorySelect={handleSubcategorySelect}
            />
          </div>
        </div>

        {/* Subcategory chips â€” only visible when a real category is active */}
        {selectedCategory && !isVendorsTab && (
          <SubcategoryBar
            subcategories={subcategories}
            selected={selectedSubcategory}
            onSelect={setSelectedSubcategory}
            sort={sort}
            onSortChange={setSort}
            filtersOpen={filtersOpen}
            onToggleFilters={() => setFiltersOpen((v) => !v)}
            activeFilterCount={activeFilterCount}
          />
        )}
      </div>

      {/* â”€â”€ Vendors tab â”€â”€ */}
      {isVendorsTab && (
        <div className="mx-auto max-w-container-max px-4 py-6">
          {vendorsPending && (
            <VendorCardSkeleton className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" />
          )}

          {vendorsError && (
            <p className="py-10 text-center text-body-sm text-on-surface-variant">
              Failed to load vendors.
            </p>
          )}

          {vendorsData && vendorsData.items.length === 0 && (
            <p className="py-10 text-center text-body-sm text-on-surface-variant">
              No vendors found.
            </p>
          )}

          {vendorsData && vendorsData.items.length > 0 && (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {Array.from(new Map(vendorsData.items.map((v) => [v.id, v])).values()).map((vendor) => (
                  <VendorCard key={vendor.id} vendor={vendor} />
                ))}
              </div>
            </>
          )}

          {/* Loading next pages */}
          {isFetchingNextPage && (
            <div className="mt-4">
              <VendorCardSkeleton count={4} className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" />
            </div>
          )}
        </div>
      )}

      {/* â”€â”€ Offer feed â€” filters sidebar pushes the cards right when open â”€â”€ */}
      {!isVendorsTab && (
        <div className="mx-auto flex max-w-container-max gap-5">
          {filtersOpen && (
            <aside className="hidden w-[280px] shrink-0 px-4 pt-6 lg:block">
              <div className="sticky top-[140px] max-h-[calc(100vh-160px)] overflow-y-auto">
                <FiltersSidebar
                  filters={filters}
                  onChange={setFilters}
                  badgeOptions={badgeOptions}
                  priceBounds={priceBounds}
                  onClose={() => setFiltersOpen(false)}
                />
              </div>
            </aside>
          )}

          <div className="min-w-0 flex-1">
            {/* Loading skeleton */}
            {isPending && (
              <div className="divide-y divide-outline-variant/30 overflow-x-hidden">
                {[1, 2, 3].map((i) => (
                  <OfferSectionSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Error */}
            {isError && (
              <div className="px-4 py-16 text-center">
                <p className="text-body-md text-on-surface-variant">Failed to load. Please try again.</p>
              </div>
            )}

            {/* Empty state */}
            {isEmpty && (
              <div className="px-4 py-16 text-center">
                <p className="text-body-md text-on-surface-variant">No offers found.</p>
                {activeFilterCount > 0 ? (
                  <button
                    onClick={() => setFilters(EMPTY_FILTERS)}
                    className="mt-3 text-label-md text-stitch-primary underline underline-offset-2"
                  >
                    Clear filters
                  </button>
                ) : (
                  (selectedCategory || selectedSubcategory) && (
                    <button
                      onClick={() => handleCategorySelect(null)}
                      className="mt-3 text-label-md text-stitch-primary underline underline-offset-2"
                    >
                      Reset
                    </button>
                  )
                )}
              </div>
            )}

            {/* Feed sections (Top Deals etc.) */}
            {!isPending && !isError && !isEmpty && (
              <div className="divide-y divide-outline-variant/30 overflow-x-hidden">
                {sortedSections.map((section) => (
                  <OfferSection key={section.type} section={section} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* â”€â”€ Featured vendors showcase â€” landing view only, below the feed â”€â”€ */}
      {isLanding && !isVendorsTab && (
        <div className="mx-auto max-w-container-max">
          <FeaturedVendors />
        </div>
      )}
    </div>
  );
}


