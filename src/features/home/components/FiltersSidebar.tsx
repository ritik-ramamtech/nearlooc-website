"use client";

import { MapPin, Star, X, Clock, Gift } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Offer } from "@/types";

/* ──────────────────────────────────────────────────────────────────────────
 * Filter model + pure helpers (co-located so page logic stays declarative).
 * All of these run client-side on the offers already loaded in the feed.
 * ────────────────────────────────────────────────────────────────────────── */

export interface OfferFilters {
  priceMin: number | null;
  priceMax: number | null;
  minRating: number; // 0 = any
  minDiscount: number; // 0 = any
  badges: string[]; // selected deal-type badges
  limitedTimeOnly: boolean;
  giftableOnly: boolean;
}

export const EMPTY_FILTERS: OfferFilters = {
  priceMin: null,
  priceMax: null,
  minRating: 0,
  minDiscount: 0,
  badges: [],
  limitedTimeOnly: false,
  giftableOnly: false,
};

/** Filters an offer list down to those matching every active criterion. */
export function applyOfferFilters(offers: Offer[], f: OfferFilters): Offer[] {
  return offers.filter((o) => {
    if (f.priceMin !== null && o.discounted_price < f.priceMin) return false;
    if (f.priceMax !== null && o.discounted_price > f.priceMax) return false;
    if (f.minRating > 0 && o.rating < f.minRating) return false;
    if (f.minDiscount > 0 && o.discount_percentage < f.minDiscount) return false;
    if (f.badges.length > 0 && (!o.badge || !f.badges.includes(o.badge))) return false;
    if (f.limitedTimeOnly && !o.promo_time_left) return false;
    if (f.giftableOnly && !o.badge?.toLowerCase().includes("gift")) return false;
    return true;
  });
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
  return n;
}

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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-gray-100 py-4">
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
    <button onClick={onClick} className="flex w-full items-center gap-2.5 text-left">
      <span
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
          active ? "border-stitch-secondary" : "border-gray-300"
        )}
      >
        {active && <span className="h-2 w-2 rounded-full bg-stitch-secondary" />}
      </span>
      {leading}
      <span className="text-[13px] text-gray-700">{label}</span>
    </button>
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
    <button onClick={onClick} className="flex w-full items-center gap-2.5 text-left">
      <span
        className={cn(
          "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
          checked ? "border-stitch-secondary bg-stitch-secondary text-white" : "border-gray-300"
        )}
      >
        {checked && (
          <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none">
            <path d="M2.5 6.5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
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
            checked ? "bg-stitch-secondary" : "bg-gray-200"
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
              checked && "translate-x-5"
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
  onChange: (filters: OfferFilters) => void;
  badgeOptions: string[];
  priceBounds: { min: number; max: number };
  location?: string | null;
  onClose?: () => void;
}

export function FiltersSidebar({
  filters,
  onChange,
  badgeOptions,
  priceBounds,
  location,
  onClose,
}: FiltersSidebarProps) {
  const activeCount = countActiveFilters(filters);
  const set = (patch: Partial<OfferFilters>) => onChange({ ...filters, ...patch });

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

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[18px] font-bold text-gray-950">Filters</h3>
        <div className="flex items-center gap-3">
          {activeCount > 0 && (
            <button
              onClick={() => onChange(EMPTY_FILTERS)}
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

      {/* Your Location — display only until geolocation + backend radius are wired */}
      <Section title="Your Location">
        <div className="flex items-center gap-2 rounded-full bg-gray-50 px-3 py-2">
          <MapPin className="h-4 w-4 shrink-0 text-gray-500" />
          <span className="truncate text-[13px] text-gray-700">
            {location || "Set your location"}
          </span>
          <button className="ml-auto shrink-0 text-[12px] font-semibold text-stitch-secondary underline underline-offset-2">
            Change
          </button>
        </div>
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
          <RadioRow label="Any rating" active={filters.minRating === 0} onClick={() => set({ minRating: 0 })} />
          {RATING_OPTIONS.map((opt) => (
            <RadioRow
              key={opt.value}
              label={opt.label}
              active={filters.minRating === opt.value}
              onClick={() => set({ minRating: opt.value })}
              leading={<Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />}
            />
          ))}
        </div>
      </Section>

      {/* Discount */}
      <Section title="Discount">
        <div className="space-y-2.5">
          <RadioRow label="Any discount" active={filters.minDiscount === 0} onClick={() => set({ minDiscount: 0 })} />
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
