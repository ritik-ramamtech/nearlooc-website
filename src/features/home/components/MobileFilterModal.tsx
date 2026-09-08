import { Category, Subcategory } from "@/types";
import { DISTANCE_OPTIONS, EMPTY_FILTERS, OfferFilters, Sort } from "./FiltersSidebar";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { PriceRangeSlider } from "./PriceRangeFilter";
import { useVendors, useVendorsInfinite } from "@/features/vendors";
import { Check, Search } from "lucide-react";

interface FiltersSidebarProps {
  filters: OfferFilters;
  onChange: (filters: Partial<OfferFilters>, categoryId: string | null) => void;
  badgeOptions: string[];
  priceBounds: { min: number; max: number };
  onClose?: () => void;
  onClear: () => void;
  subCategories: Subcategory[];
  categories?: Category[];
  selectedCategoryId?: string | null;
  sort: Sort | null;
  onSortChange: (sort: Sort | null) => void;
  hasCoordinates?: boolean;
}

const BASE_SECTIONS = [
  "Sort",
  "Category",
  "Price",
  "Rating",
  "Discount",
  "Badges",
  "Merchant",
];

const RATING_OPTIONS = [
  { label: "4.5★ & up", value: 4.5 },
  { label: "4★ & up", value: 4 },
  { label: "3.5★ & up", value: 3.5 },
  { label: "3★ & up", value: 3 },
];

const DISCOUNT_OPTIONS = [
  { label: "10%+", value: 10 },
  { label: "25%+", value: 25 },
  { label: "50%+", value: 50 },
];

const SORT_DROPDOWN_OPTIONS: { label: string; value: Sort | "" }[] = [
  { label: "Recommended", value: Sort.recommended },
  { label: "Rating", value: Sort.rating },
  { label: "Price: Low to High", value: Sort.priceLowToHigh },
  { label: "Price: High To Low", value: Sort.priceHighToLow },
  { label: "Discount", value: Sort.discount },
];

interface FilterPillsOption<T extends string | number> {
  label: string;
  value: T;
}

interface FilterPillsProps<T extends string | number> {
  value: T | null;
  options: FilterPillsOption<T>[];
  onChange: (value: T | null) => void;
}

export function FilterPills<T extends string | number>({
  value,
  options,
  onChange,
}: FilterPillsProps<T>) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const selected = value === option.value;

        return (
          <button
            key={String(option.value)}
            type="button"
            onClick={() => onChange(selected ? null : option.value)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition-colors",
              selected
                ? "border-stitch-primary bg-stitch-primary text-white"
                : "border-gray-300 bg-white text-gray-700",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function MobileFilterModal({
  filters,
  onChange,
  priceBounds,
  subCategories,
  categories,
  selectedCategoryId,
  onSortChange,
  onClose,
  hasCoordinates,
}: FiltersSidebarProps) {
  const sections = hasCoordinates
    ? [...BASE_SECTIONS, "Distance"]
    : BASE_SECTIONS;
  const sentinelRef = useRef(null);
  const [activeSection, setActiveSection] = useState("Sort");
  const [draftFilters, setDraftFilters] = useState(filters);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [draftCategory, setDraftCategory] = useState(selectedCategoryId);
  const set = (patch: Partial<OfferFilters>) =>
    setDraftFilters((prev) => ({ ...prev, ...patch }));

  const {
    data: merchantData,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useVendorsInfinite({
    category_id: draftCategory ?? "",
    search: debouncedSearch,
    limit: 20
  });

  const merchants = Array.from(
    new Map((merchantData?.items ?? []).map((v) => [v.id, v])).values(),
  );

  const subcategories =
    categories?.find((cat) => cat.id === draftCategory)?.subcategories ?? [];

  useEffect(() => {
    setDraftFilters(filters);
    setDraftCategory(selectedCategoryId);
  }, [filters, selectedCategoryId]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  });

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(t);
  }, [search]);

  return (
    <div className="flex flex-col h-full">
      <div className="w-full p-4 border-b">
        <h3 className="text-lg font-bold mb-2">Filters</h3>
      </div>
      <div className="flex flex-1 overflow-hidden min-h-0">
        <section className="w-32 border-r pb-5">
          <div className="flex flex-col items-center">
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={cn(
                  "w-full px-4 py-6 text-left border-b text-gray-600",
                  activeSection === section &&
                    "bg-white text-gray-800 font-semibold border-l-4 border-l-stitch-primary",
                )}
              >
                {section}
              </button>
            ))}
          </div>
        </section>
        <div className="flex flex-1 px-3 py-5 overflow-y-auto min-h-0">
          {activeSection === "Sort" && (
            <div>
              <h4>Sort</h4>
              <div className="flex flex-wrap gap-2 mt-4">
                <FilterPills
                  value={draftFilters.sort}
                  options={SORT_DROPDOWN_OPTIONS.filter(
                    (o): o is { label: string; value: Sort } => o.value !== "",
                  )}
                  onChange={(sort) => set({ sort })}
                />
              </div>
            </div>
          )}
          {activeSection === "Price" && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold">Price Range</h4>
                <p className="text-sm text-gray-500">
                  Only show offers within this range.
                </p>
              </div>

              <PriceRangeSlider
                min={priceBounds.min}
                max={priceBounds.max}
                value={[
                  draftFilters.priceMin ?? priceBounds.min,
                  draftFilters.priceMax ?? priceBounds.max,
                ]}
                onChange={([min, max]) =>
                  setDraftFilters((prev) => ({
                    ...prev,
                    priceMin: min,
                    priceMax: max,
                  }))
                }
              />
            </div>
          )}
          {activeSection === "Category" && (
            <div className="space-y-6">
              <div className="space-y-2">
                {activeSection === "Category" && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold">Category</h4>
                      <p className="text-sm text-gray-500">
                        Choose a category to browse.
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <FilterPills
                          value={draftCategory ?? null}
                          options={(categories ?? []).map((c) => ({
                            label: c.name,
                            value: c.id,
                          }))}
                          onChange={(categoryId) => {
                            setDraftCategory(categoryId);

                            set({
                              subcategoryId: null,
                              merchantname: null,
                            });
                          }}
                        />
                      </div>
                    </div>

                    {draftCategory && (
                      <div className="animate-in fade-in slide-in-from-bottom-1 duration-200">
                        <h4 className="text-base font-semibold">
                          Subcategories
                        </h4>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {subcategories && subcategories.length > 0 && (
                            <>
                              <FilterPills
                                value={draftFilters.subcategoryId}
                                options={subcategories.map((sub) => ({
                                  label: sub.name,
                                  value: sub.id,
                                }))}
                                onChange={(subcategoryId) =>
                                  set({ subcategoryId })
                                }
                              />
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          {activeSection === "Rating" && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold">Minimum Rating</h4>
                <p className="text-sm text-gray-500">
                  Show offers from highly rated merchants.
                </p>
              </div>

              <FilterPills
                value={draftFilters.minRating || null}
                options={RATING_OPTIONS}
                onChange={(rating) =>
                  set({
                    minRating: rating ?? 0,
                  })
                }
              />
            </div>
          )}
          {activeSection === "Discount" && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold">Minimum Discount</h4>
                <p className="text-sm text-gray-500">
                  Only show offers above a certain discount.
                </p>
              </div>

              <FilterPills
                value={draftFilters.minDiscount || null}
                options={DISCOUNT_OPTIONS}
                onChange={(discount) =>
                  set({
                    minDiscount: discount ?? 0,
                  })
                }
              />
            </div>
          )}

          {activeSection === "Distance" && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold">Distance</h4>
                <p className="text-sm text-gray-500">
                  Only show offers within a certain distance.
                </p>
              </div>

              <FilterPills
                value={draftFilters.maxDistanceKm}
                options={DISTANCE_OPTIONS}
                onChange={(maxDistanceKm) => set({ maxDistanceKm })}
              />
            </div>
          )}

          {activeSection === "Merchant" && (
            <div className="space-y-6 h-full flex flex-col">
              <div className="w-full relative shrink-0">
                <input
                  type="search"
                  className="outline-none pl-10 py-2 border border-gray-400 max-w-full"
                  placeholder="Search Brands"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Search className="absolute left-2 top-2" size={22} />
              </div>
              <div className="overflow-y-auto flex-1 min-h-0">
                <div className="space-y-4">
                  {merchants?.map((merchant) => (
                    <div
                      className="flex gap-4 items-center"
                      key={merchant.id}
                      onClick={() =>
                        set({ merchantname: merchant.business_name })
                      }
                    >
                      <Check
                        size={14}
                        className={cn(
                          "text-gray-400",
                          draftFilters.merchantname ===
                            merchant.business_name &&
                            "text-green-500 text-bold",
                        )}
                      />
                      <p
                        className={cn(
                          "text-gray-600",
                          draftFilters.merchantname ===
                            merchant.business_name && "text-gray-800 font-bold",
                        )}
                      >
                        {merchant.business_name}
                      </p>
                    </div>
                  ))}
                  {isFetchingNextPage &&
                    Array.from({ length: 3 }).map((_, index) => (
                      <div
                        className="flex gap-4 items-center animate-pulse w-full"
                        key={index}
                      >
                        <div className="h-6 w-6 rounded-full border bg-gray-200"></div>
                        <div className="h-4 px-16 rounded-xl bg-gray-200"></div>
                      </div>
                    ))}
                  <div ref={sentinelRef} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Footer */}
      <div className="sticky bottom-0 z-20 border-t bg-white p-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              // setDraftFilters(EMPTY_FILTERS);
              onChange(EMPTY_FILTERS, null);
            }}
            className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700"
          >
            Reset
          </button>

          <button
            type="button"
            onClick={() => {
              onChange(draftFilters, draftCategory ?? null);
              onClose?.();
            }}
            className="rounded-xl bg-stitch-primary px-8 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
