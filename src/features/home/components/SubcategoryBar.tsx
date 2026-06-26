"use client";

import { cn } from "@/lib/utils";
import type { Subcategory } from "@/types";

interface SubcategoryBarProps {
  subcategories: Subcategory[];
  selected: string | null;
  onSelect: (id: string | null) => void;
}

export function SubcategoryBar({ subcategories, selected, onSelect }: SubcategoryBarProps) {
  if (subcategories.length === 0) return null;

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
            >
              {sub.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
