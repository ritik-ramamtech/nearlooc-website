"use client";

import { Star, X, Clock, Gift, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Offer, Subcategory, Category } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useVendors, useVendorsInfinite, Vendor } from "@/features/vendors";
import { useEffect, useRef, useState } from "react";

/* ──────────────────────────────────────────────────────────────────────────
 * Filter model + pure helpers (co-located so page logic stays declarative).
 * All of these run client-side on the offers already loaded in the feed.
 * ────────────────────────────────────────────────────────────────────────── */

export enum Sort {
  rating = "rating",
  priceLowToHigh = "price_low_to_high",
  priceHighToLow = "price_high_to_low",
  recommended = "recommended",
  discount = "discount",
}

export interface OfferFilters {
  priceMin: number | null;
  priceMax: number | null;
  minRating: number; // 0 = any
  minDiscount: number; // 0 = any
  badges: string[]; // selected deal-type badges
  limitedTimeOnly: boolean;
  giftableOnly: boolean;
  subcategoryId: string | null;
  sort: Sort | null;
  merchantname: string | null;
  maxDistanceKm: number | null; // null = any distance
}

export const EMPTY_FILTERS: OfferFilters = {
  priceMin: null,
  priceMax: null,
  minRating: 0,
  minDiscount: 0,
  badges: [],
  limitedTimeOnly: false,
  giftableOnly: false,
  subcategoryId: null,
  sort: null,
  merchantname: null,
  maxDistanceKm: null,
};

/** Filters an offer list down to those matching every active criterion. */
export function applyOfferFilters(offers: Offer[], f: OfferFilters): Offer[] {
  const filteredOffers = offers.filter((o) => {
    if (f.minDiscount > 0 && o.discount_percentage < f.minDiscount)
      return false;
    // if (f.badges.length > 0 && (!o.badge || !f.badges.includes(o.badge)))
    //   return false;
    if (f.limitedTimeOnly && !o.promo_time_left) return false;
    if (f.giftableOnly && !o.badge?.toLowerCase().includes("gift"))
      return false;
    return true;
  });
  return filteredOffers;
}

/** Number of distinct filter groups currently narrowing the results. */
export function countActiveFilters(f: OfferFilters): number {
  let n = 0;
  if (f.priceMin !== null || f.priceMax !== null) n++;
  if (f.minRating > 0) n++;
  if (f.minDiscount > 0) n++;
  if (f.badges.length > 0) n++;
  if (f.limitedTimeOnly) n++;
  if (f.giftableOnly) n++;
  if (f.subcategoryId) n++;
  if (f.maxDistanceKm !== null) n++;
  return n;
}

export const DISTANCE_OPTIONS = [
  { label: "Within 5 km", value: 5 },
  { label: "Within 10 km", value: 10 },
  { label: "Within 25 km", value: 25 },
  { label: "Within 50 km", value: 50 },
];

const RATING_OPTIONS = [
  { label: "4.5 & up", value: 4.5 },
  { label: "4.0 & up", value: 4 },
  { label: "3.5 & up", value: 3.5 },
  { label: "3.0 & up", value: 3 },
];

const DISCOUNT_OPTIONS = [
  { label: "10% or more", value: 10 },
  { label: "25% or more", value: 25 },
  { label: "50% or more", value: 50 },
];

/* ──────────────────────────────────────────────────────────────────────────
 * UI primitives
 * ────────────────────────────────────────────────────────────────────────── */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-gray-100 py-4 relative">
      <h4 className="mb-3 text-[14px] font-bold text-gray-900">{title}</h4>
      {children}
    </section>
  );
}

function RadioRow({
  label,
  active,
  onClick,
  leading,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  leading?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2.5 text-left"
    >
      <span
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
          active ? "border-stitch-secondary" : "border-gray-300",
        )}
      >
        {active && (
          <span className="h-2 w-2 rounded-full bg-stitch-secondary" />
        )}
      </span>
      {leading}
      <span className="text-[13px] text-gray-700">{label}</span>
    </button>
  );
}

function RadioRowSkeleton() {
  return (
    <div className="flex items-center gap-2.5">
      <Skeleton className="h-4 w-4 shrink-0 rounded-full" />
      <Skeleton className="h-3.5 w-32 rounded-md" />
    </div>
  );
}

function CheckRow({
  label,
  checked,
  onClick,
}: {
  label: string;
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2.5 text-left"
    >
      <span
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
          checked
            ? "border-stitch-secondary bg-stitch-secondary text-white"
            : "border-gray-300",
        )}
      >
        {checked && (
          <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none">
            <path
              d="M2.5 6.5l2.5 2.5 4.5-5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span className="truncate text-[13px] text-gray-700">{label}</span>
    </button>
  );
}

function ToggleRow({
  title,
  subtitle,
  icon: Icon,
  checked,
  onChange,
}: {
  title: string;
  subtitle: string;
  icon: typeof Clock;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <section className="border-t border-gray-100 py-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 shrink-0 text-gray-500" />
          <div>
            <h4 className="text-[14px] font-bold text-gray-900">{title}</h4>
            <p className="mt-0.5 text-[12px] text-gray-500">{subtitle}</p>
          </div>
        </div>
        <button
          onClick={onChange}
          role="switch"
          aria-checked={checked}
          aria-label={title}
          className={cn(
            "relative h-6 w-11 shrink-0 rounded-full transition-colors",
            checked ? "bg-stitch-secondary" : "bg-gray-200",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
              checked && "translate-x-5",
            )}
          />
        </button>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * Sidebar
 * ────────────────────────────────────────────────────────────────────────── */

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
  hasCoordinates?: boolean;
}

export function FiltersSidebar({
  filters,
  onChange,
  badgeOptions,
  priceBounds,
  onClose,
  onClear,
  subCategories,
  categories,
  selectedCategoryId,
  hasCoordinates,
}: FiltersSidebarProps) {
  const [showMerchantModal, setShowMerchantModal] = useState(false);
  const [limit, setLimit] = useState();
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeCount = countActiveFilters(filters);
  const set = (patch: Partial<OfferFilters>) =>
    onChange(patch, selectedCategoryId ?? null);

  const toggleBadge = (badge: string) =>
    set({
      badges: filters.badges.includes(badge)
        ? filters.badges.filter((b) => b !== badge)
        : [...filters.badges, badge],
    });

  const parsePrice = (v: string): number | null => {
    const n = parseInt(v.replace(/[^0-9]/g, ""), 10);
    return Number.isFinite(n) ? n : null;
  };

  const {
    data: merchantData,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isLoading,
  } = useVendorsInfinite({
    category_id: selectedCategoryId ?? "",
    subcategory_id: filters.subcategoryId ?? "",
    limit: 40,
    search: debouncedSearch,
  });

  const data = merchantData?.items.slice(0, 10);
  const merchants = Array.from(
    new Map((merchantData?.items ?? []).map((v) => [v.id, v])).values(),
  );

  const total = merchantData?.meta.total ?? 0;

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(t);
  }, [search]);

  const handleMerchantScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;

    if (isFetchingNextPage || !hasNextPage) return;

    if (el.scrollWidth - el.scrollLeft - el.clientWidth < 200) {
      fetchNextPage();
    }
  };

  return (
    <div className="rounded-br-2xl border border-gray-200 bg-white p-5">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[18px] font-bold text-gray-950">Filters</h3>
        <div className="flex items-center gap-3">
          {activeCount > 0 && (
            <button
              onClick={() => onChange(EMPTY_FILTERS, null)}
              className="text-[12px] font-semibold text-stitch-secondary underline underline-offset-2"
            >
              Clear all
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close filters"
              className="text-gray-400 transition-colors hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {hasCoordinates && (
        <Section title="Distance">
          <div className="space-y-2.5">
            <RadioRow
              label="Any distance"
              active={filters.maxDistanceKm === null}
              onClick={() => set({ maxDistanceKm: null })}
            />
            {DISTANCE_OPTIONS.map((opt) => (
              <RadioRow
                key={opt.value}
                label={opt.label}
                active={filters.maxDistanceKm === opt.value}
                onClick={() => set({ maxDistanceKm: opt.value })}
              />
            ))}
          </div>
        </Section>
      )}

      {categories && categories.length > 0 && (
        <Section title="Categories">
          <div className="space-y-2.5">
            <RadioRow
              label="All Categories"
              active={!selectedCategoryId}
              onClick={() => onChange({}, null)}
            />
            {categories.map((category) => (
              <RadioRow
                key={category.id}
                label={category.name}
                active={selectedCategoryId === category.id}
                onClick={() =>
                  onChange(
                    { subcategoryId: null, merchantname: null },
                    category.id,
                  )
                }
              />
            ))}
          </div>
        </Section>
      )}

      {subCategories.length > 0 && (
        <Section title="subcategories">
          <div className="space-y-2.5">
            <RadioRow
              label="All SubCategories"
              active={!filters.subcategoryId}
              onClick={() => {
                set({ subcategoryId: null, merchantname: "" });
              }}
            />
            {subCategories.map((subcategory) => (
              <RadioRow
                key={subcategory.id}
                label={subcategory.name}
                active={filters.subcategoryId === subcategory.id}
                onClick={() => {
                  set({ subcategoryId: subcategory.id, merchantname: "" });
                }}
              />
            ))}
          </div>
        </Section>
      )}

      {/* Brands section */}
      <Section title="Brands">
        <div className="">
          <div>
            <input
              type="search"
              placeholder="Search brands"
              className=" outline-none border border-gray-400 rounded-md w-[100%] px-2 py-1"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2 mt-2">
            {isLoading ? (
              <>
                <Skeleton className="h-4 w-10" />

                {Array.from({ length: 6 }).map((_, i) => (
                  <RadioRowSkeleton key={i} />
                ))}

                <Skeleton className="mt-1 h-4 w-14" />
              </>
            ) : (
              <>
                <div
                  onClick={() => set({ merchantname: "" })}
                  className=" cursor-pointer text-blue-700 font-medium underline"
                >
                  Clear
                </div>
                {data?.map((vendor) => (
                  <div key={vendor.id} className="flex gap-2 text-body-sm">
                    {/* <input type="radio" id={vendor.id} value={vendor.business_name} name="merchant_name" className=" rounded-none border-gray-200"/>
                <label htmlFor={vendor.id}>{vendor.business_name}</label> */}
                    <RadioRow
                      label={vendor.business_name}
                      onClick={() =>
                        set({ merchantname: vendor.business_name })
                      }
                      active={filters.merchantname === vendor.business_name}
                    />
                  </div>
                ))}
                <div
                  onClick={() => setShowMerchantModal(true)}
                  className="text-blue-700 font-medium cursor-pointer"
                >
                  See All
                </div>
              </>
            )}
          </div>
        </div>

        {showMerchantModal && (
          <div className="absolute top-20 z-50 left-0 flex items-center justify-center">
            <div className="w-[90vw] max-w-5xl bg-white shadow-2xl py-1">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-b-gray-200 px-6 py-2 pt-3">
                <div className="flex gap-2 items-end">
                  {/* Search */}
                  <input
                    type="search"
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search brands"
                    className="rounded-lg border border-gray-300 px-4 py-1 outline-none focus:border-stitch-secondary"
                  />
                  <p className="text-sm text-gray-500">{total ?? 0} brands</p>
                </div>

                <button
                  onClick={() => setShowMerchantModal(false)}
                  className="rounded-full p-2 hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Merchant List */}
              <div
                className="overflow-x-auto thin-scrollbar overflow-y-hidden px-6 mb-4"
                onScroll={handleMerchantScroll}
              >
                <div className="grid grid-flow-col grid-rows-8 py-2 gap-x-8 gap-y-3 w-max">
                  {merchants?.map((vendor) => (
                    <RadioRow
                      key={vendor.id}
                      label={vendor.business_name}
                      active={filters.merchantname === vendor.business_name}
                      onClick={() => {
                        set({
                          merchantname: vendor.business_name,
                        });
                        setShowMerchantModal(false);
                      }}
                    />
                  ))}

                  {isFetchingNextPage &&
                    Array.from({ length: 8 }).map((_, i) => (
                      <RadioRowSkeleton key={i} />
                    ))}
                </div>
              </div>

              {/* Footer */}
              {/* <div className="flex justify-end gap-3 border-t px-6 py-4">
              <button
                onClick={() => {
                  set({ merchantname: null });
                  setShowMerchantModal(false);
                }}
                className="rounded-lg border px-4 py-2 text-sm font-medium"
              >
                Clear
              </button>

              <button
                onClick={() => setShowMerchantModal(false)}
                className="rounded-lg bg-stitch-secondary px-5 py-2 text-sm font-medium text-white"
              >
                Done
              </button>
            </div> */}
            </div>
          </div>
        )}
      </Section>

      {/* Price range */}
      <Section title="Price range">
        <div className="flex items-center gap-2">
          <label className="flex flex-1 items-center gap-1 rounded-lg border border-gray-300 px-2.5 py-2 focus-within:border-stitch-secondary">
            <span className="text-[12px] text-gray-400">Rs</span>
            <input
              inputMode="numeric"
              placeholder={String(priceBounds.min)}
              value={filters.priceMin ?? ""}
              onChange={(e) => set({ priceMin: parsePrice(e.target.value) })}
              className="w-full text-[13px] text-gray-900 outline-none placeholder:text-gray-400"
            />
          </label>
          <span className="text-gray-400">–</span>
          <label className="flex flex-1 items-center gap-1 rounded-lg border border-gray-300 px-2.5 py-2 focus-within:border-stitch-secondary">
            <span className="text-[12px] text-gray-400">Rs</span>
            <input
              inputMode="numeric"
              placeholder={priceBounds.max ? String(priceBounds.max) : "Any"}
              value={filters.priceMax ?? ""}
              onChange={(e) => set({ priceMax: parsePrice(e.target.value) })}
              className="w-full text-[13px] text-gray-900 outline-none placeholder:text-gray-400"
            />
          </label>
        </div>
      </Section>

      {/* Rating */}
      <Section title="Customer rating">
        <div className="space-y-2.5">
          <RadioRow
            label="Any rating"
            active={filters.minRating === 0}
            onClick={() => set({ minRating: 0 })}
          />
          {RATING_OPTIONS.map((opt) => (
            <RadioRow
              key={opt.value}
              label={opt.label}
              active={filters.minRating === opt.value}
              onClick={() => set({ minRating: opt.value })}
              leading={
                <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />
              }
            />
          ))}
        </div>
      </Section>

      {/* Discount */}
      <Section title="Discount">
        <div className="space-y-2.5">
          <RadioRow
            label="Any discount"
            active={filters.minDiscount === 0}
            onClick={() => set({ minDiscount: 0 })}
          />
          {DISCOUNT_OPTIONS.map((opt) => (
            <RadioRow
              key={opt.value}
              label={opt.label}
              active={filters.minDiscount === opt.value}
              onClick={() => set({ minDiscount: opt.value })}
            />
          ))}
        </div>
      </Section>

      {/* Deal type (badges) — only shown when the loaded feed has badged offers */}
      {badgeOptions.length > 0 && (
        <Section title="Deal type">
          <div className="space-y-2.5">
            {badgeOptions.map((badge) => (
              <CheckRow
                key={badge}
                label={badge}
                checked={filters.badges.includes(badge)}
                onClick={() => toggleBadge(badge)}
              />
            ))}
          </div>
        </Section>
      )}

      {/* Toggles */}
      <ToggleRow
        title="Limited-time deals"
        subtitle="Only deals ending soon"
        icon={Clock}
        checked={filters.limitedTimeOnly}
        onChange={() => set({ limitedTimeOnly: !filters.limitedTimeOnly })}
      />
      <ToggleRow
        title="Giftable deals"
        subtitle="Great to give as a gift"
        icon={Gift}
        checked={filters.giftableOnly}
        onChange={() => set({ giftableOnly: !filters.giftableOnly })}
      />
    </div>
  );
}

function SkeletonFilterSection({
  rows = 3,
  withInputs,
}: {
  rows?: number;
  withInputs?: boolean;
}) {
  return (
    <section className="border-t border-gray-100 py-4">
      <Skeleton className="mb-3 h-4 w-28" />
      {withInputs ? (
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 flex-1 rounded-lg" />
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-9 flex-1 rounded-lg" />
        </div>
      ) : (
        <div className="space-y-2.5">
          {Array.from({ length: rows }).map((_, index) => (
            <div key={index} className="flex items-center gap-2.5">
              <Skeleton className="h-4 w-4 shrink-0 rounded-full" />
              <Skeleton className="h-3.5 w-32" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export function FiltersSidebarSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="mb-2 flex items-center justify-between">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-4 w-14" />
      </div>

      <SkeletonFilterSection rows={4} />
      <SkeletonFilterSection withInputs />
      <SkeletonFilterSection rows={4} />
      <SkeletonFilterSection rows={3} />

      <section className="border-t border-gray-100 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <div>
              <Skeleton className="h-4 w-32" />
              <Skeleton className="mt-1.5 h-3 w-28" />
            </div>
          </div>
          <Skeleton className="h-6 w-11 rounded-full" />
        </div>
      </section>

      <section className="border-t border-gray-100 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-1.5 h-3 w-32" />
            </div>
          </div>
          <Skeleton className="h-6 w-11 rounded-full" />
        </div>
      </section>
    </div>
  );
}
