"use client";

import { useState, useMemo, useEffect } from "react";
import { CategoryBar, VENDORS_TAB } from "@/features/home/components/CategoryBar";
import { SubcategoryBar } from "@/features/home/components/SubcategoryBar";
import { OfferSection } from "@/features/home/components/OfferSection";
import { VendorCard } from "@/features/vendors/components/VendorCard";
import { VendorCardSkeleton } from "@/features/vendors/components/VendorCardSkeleton";
import { useHomeFeed } from "@/features/home/hooks";
import { useCategories } from "@/features/categories/hooks";
import { useVendorsInfinite } from "@/features/vendors/hooks";
import type { OfferSection as OfferSectionType } from "@/types";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  const isVendorsTab = selectedCategory === VENDORS_TAB;

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

  // Only send category_id to the API — subcategory filtering is done client-side
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
  }

  /*
   * Default feed (no category selected):
   * Show sections returned by the API as-is (top_deals, recommended, etc.)
   *
   * Category selected, no subcategory:
   * Group offers by subcategory → one OfferSection per subcategory.
   * Falls back to a single "All [category]" section if offers have no subcategory_id.
   *
   * Category + subcategory selected:
   * Show a single filtered OfferSection.
   */
  const displaySections = useMemo<OfferSectionType[]>(() => {
    if (!data) return [];

    // Default feed — API sections + per-category grouped sections
    if (!selectedCategory) {
      const categoryNameById = new Map(categories.map((c) => [c.id, c.name]));
      const allOffers = data.sections.flatMap((s) => s.offers);

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

      return [...data.sections, ...catSections];
    }

    const allOffers = data.sections.flatMap((s) => s.offers);
    if (allOffers.length === 0) return [];

    // Subcategory selected → filter offers client-side by subcategory_id
    if (selectedSubcategory) {
      const subcategoryName =
        subcategories.find((s) => s.id === selectedSubcategory)?.name ?? "Offers";
      const filtered = allOffers.filter((o) => o.subcategory_id === selectedSubcategory);
      return [{ type: "filtered", title: subcategoryName, parent_category: selectedCategory, offers: filtered }];
    }

    // Category selected, no subcategory → group by subcategory_id
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

  const isEmpty = !isPending && !isError && displaySections.every((s) => s.offers.length === 0);

  return (
    <div className="min-h-screen bg-surface">

      {/* ── Sticky filter header ── */}
      <div className="sticky top-16 z-30">

        {/* Main category tabs */}
        <div className="bg-surface border-b border-outline-variant">
          <div className="mx-auto max-w-container-max">
            <CategoryBar
              categories={categories}
              selected={selectedCategory}
              onSelect={handleCategorySelect}
            />
          </div>
        </div>

        {/* Subcategory chips — only visible when a real category is active */}
        {selectedCategory && !isVendorsTab && (
          <SubcategoryBar
            subcategories={subcategories}
            selected={selectedSubcategory}
            onSelect={setSelectedSubcategory}
          />
        )}
      </div>

      {/* ── Vendors tab ── */}
      {isVendorsTab && (
        <div className="mx-auto max-w-container-max px-4 py-6">
          {vendorsPending && (
            <VendorCardSkeleton count={6} className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" />
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
                {vendorsData.items.map((vendor) => (
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

      {/* ── Loading skeleton ── */}
      {!isVendorsTab && isPending && (
        <div className="mx-auto max-w-container-max space-y-8 px-4 py-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3 animate-pulse">
              <div className="h-5 w-36 rounded bg-surface-container" />
              <div className="flex gap-4">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="h-[320px] w-[240px] flex-shrink-0 rounded-xl bg-surface-container" />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Error ── */}
      {!isVendorsTab && isError && (
        <div className="mx-auto max-w-container-max px-4 py-16 text-center">
          <p className="text-body-md text-on-surface-variant">Failed to load. Please try again.</p>
        </div>
      )}

      {/* ── Empty state ── */}
      {!isVendorsTab && isEmpty && (
        <div className="mx-auto max-w-container-max px-4 py-16 text-center">
          <p className="text-body-md text-on-surface-variant">No offers found.</p>
          {(selectedCategory || selectedSubcategory) && (
            <button
              onClick={() => handleCategorySelect(null)}
              className="mt-3 text-label-md text-stitch-primary underline underline-offset-2"
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* ── Feed sections ── */}
      {!isVendorsTab && !isPending && !isError && !isEmpty && (
        <div className="mx-auto max-w-container-max divide-y divide-outline-variant/30 overflow-x-hidden">
          {displaySections.map((section) => (
            <OfferSection key={section.type} section={section} />
          ))}
        </div>
      )}
    </div>
  );
}
