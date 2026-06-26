"use client";

import { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  SlidersHorizontal,
  MapPin,
  Map,
  ArrowUpDown,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Subcategory } from "@/types";

export type SortOption =
  | "relevance"
  | "price_asc"
  | "price_desc"
  | "rating"
  | "discount";

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "relevance", label: "Relevance" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Top rated" },
  { value: "discount", label: "Biggest discount" },
];

interface SubcategoryBarProps {
  subcategories: Subcategory[];
  selected: string | null;
  onSelect: (id: string | null) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  filtersOpen: boolean;
  onToggleFilters: () => void;
  activeFilterCount?: number;
}

/** Closes the popover when a click lands outside the returned ref. */
function useClickOutside<T extends HTMLElement>(onClose: () => void) {
  const ref = useRef<T>(null);
  useEffect(() => {
    function handle(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) onClose();
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [onClose]);
  return ref;
}

/** Grey rounded chip — white + outlined when active. */
function Pill({
  label,
  isSelected,
  onClick,
}: {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold transition-colors",
        isSelected
          ? "border border-gray-300 bg-white text-gray-900"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      )}
    >
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}

/** Single row inside a dropdown menu. */
function DropdownItem({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-[13px] transition-colors hover:bg-gray-50",
        active ? "font-semibold text-stitch-secondary" : "text-gray-700"
      )}
    >
      <span className="truncate">{label}</span>
      {active && <Check className="h-4 w-4 shrink-0" />}
    </button>
  );
}

/** Underlined text control used in the filter row. */
function FilterAction({
  icon: Icon,
  label,
  onClick,
  trailingChevron,
  chevronOpen,
  badge = 0,
  className,
}: {
  icon: typeof MapPin;
  label: string;
  onClick?: () => void;
  trailingChevron?: boolean;
  chevronOpen?: boolean;
  badge?: number;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 text-[13px] font-semibold text-gray-900 transition-colors hover:text-stitch-secondary",
        className
      )}
    >
      <Icon className="h-4 w-4" />
      <span className="whitespace-nowrap underline underline-offset-4">{label}</span>
      {badge > 0 && (
        <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-stitch-secondary px-1 text-[11px] font-bold leading-none text-white">
          {badge}
        </span>
      )}
      {trailingChevron && (
        <ChevronDown
          className={cn("h-4 w-4 transition-transform", chevronOpen && "rotate-180")}
        />
      )}
    </button>
  );
}

export function SubcategoryBar({
  subcategories,
  selected,
  onSelect,
  sort,
  onSortChange,
  filtersOpen,
  onToggleFilters,
  activeFilterCount = 0,
}: SubcategoryBarProps) {
  const [catOpen, setCatOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const catRef = useClickOutside<HTMLDivElement>(() => setCatOpen(false));
  const sortRef = useClickOutside<HTMLDivElement>(() => setSortOpen(false));

  if (subcategories.length === 0) return null;

  const sortLabel =
    sort === "relevance"
      ? "Sort by"
      : SORT_OPTIONS.find((o) => o.value === sort)?.label ?? "Sort by";

  return (
    <div className="border-b border-gray-100 bg-surface">
      <div className="mx-auto max-w-container-max px-4 sm:px-6 lg:px-16">
        {/* Subcategory pills — always visible */}
        <div className="flex items-center gap-2 py-3">
          {/* Categories dropdown lead pill */}
          <div className="relative shrink-0" ref={catRef}>
            <button
              onClick={() => setCatOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-full bg-gray-100 px-4 py-2 text-[13px] font-semibold text-gray-700 transition-colors hover:bg-gray-200"
            >
              Categories
              <ChevronDown
                className={cn("h-4 w-4 transition-transform", catOpen && "rotate-180")}
              />
            </button>

            {catOpen && (
              <div className="absolute left-0 top-full z-50 mt-2 max-h-72 w-56 overflow-y-auto rounded-xl border border-gray-100 bg-white p-1 shadow-lg ring-1 ring-black/5">
                <DropdownItem
                  label="All"
                  active={selected === null}
                  onClick={() => {
                    onSelect(null);
                    setCatOpen(false);
                  }}
                />
                {subcategories.map((sub) => (
                  <DropdownItem
                    key={sub.id}
                    label={sub.name}
                    active={selected === sub.id}
                    onClick={() => {
                      onSelect(sub.id);
                      setCatOpen(false);
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="no-scrollbar flex flex-1 items-center gap-2 overflow-x-auto">
            <Pill
              label="All"
              isSelected={selected === null}
              onClick={() => onSelect(null)}
            />
            {subcategories.map((sub) => (
              <Pill
                key={sub.id}
                label={sub.name}
                isSelected={selected === sub.id}
                onClick={() => onSelect(selected === sub.id ? null : sub.id)}
              />
            ))}
          </div>
        </div>

        {/* Filter row */}
        <div className="flex items-center justify-between gap-4 border-t border-gray-100 py-3">
          <div className="flex items-center gap-5">
            <FilterAction
              icon={SlidersHorizontal}
              label={filtersOpen ? "Hide filters" : "Show filters"}
              onClick={onToggleFilters}
              badge={activeFilterCount}
            />
            <FilterAction
              icon={MapPin}
              label="Set location"
              trailingChevron
              className="hidden sm:flex"
            />
          </div>

          <div className="flex items-center gap-5">
            <FilterAction
              icon={Map}
              label="Show on map"
              className="hidden sm:flex"
            />

            <div className="relative" ref={sortRef}>
              <FilterAction
                icon={ArrowUpDown}
                label={sortLabel}
                onClick={() => setSortOpen((v) => !v)}
                trailingChevron
                chevronOpen={sortOpen}
              />

              {sortOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-gray-100 bg-white p-1 shadow-lg ring-1 ring-black/5">
                  {SORT_OPTIONS.map((opt) => (
                    <DropdownItem
                      key={opt.value}
                      label={opt.label}
                      active={sort === opt.value}
                      onClick={() => {
                        onSortChange(opt.value);
                        setSortOpen(false);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
