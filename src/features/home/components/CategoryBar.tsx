"use client";

import { useState } from "react";
import {
  ConciergeBell,
  Flower,
  Shirt,
  Smartphone,
  Sofa,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export const VENDORS_TAB = "vendors" as const;

interface CategoryBarProps {
  categories: Category[];
  selected: string | null;
  onSelect: (id: string | null) => void;
  onSubcategorySelect?: (categoryId: string, subcategoryId: string) => void;
  isPending?: boolean;
}

const CATEGORY_ICON_BY_NAME: Record<string, LucideIcon> = {
  electronics: Smartphone,
  "home decore": Sofa,
  "home decor": Sofa,
  fashion: Shirt,
  "beauty & spa": Flower,
  beauty: Flower,
  spa: Flower,
  "food dinning": ConciergeBell,
  "food dining": ConciergeBell,
  food: ConciergeBell,
};

function getCategoryIcon(name: string) {
  const normalizedName = name.trim().toLowerCase();

  if (normalizedName.includes("food") || normalizedName.includes("dining") || normalizedName.includes("dinning")) {
    return ConciergeBell;
  }

  if (normalizedName.includes("beauty") || normalizedName.includes("spa")) {
    return Flower;
  }

  if (normalizedName.includes("fashion")) {
    return Shirt;
  }

  if (normalizedName.includes("home")) {
    return Sofa;
  }

  if (normalizedName.includes("electronic")) {
    return Smartphone;
  }

  return CATEGORY_ICON_BY_NAME[normalizedName] ?? Smartphone;
}

function CategoryTab({
  label,
  isSelected,
  onClick,
  onMouseEnter,
  icon: Icon,
  emoji,
}: {
  label: string;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter?: () => void;
  icon?: LucideIcon;
  emoji?: string;
}) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onFocus={onMouseEnter}
      className={cn(
        "group relative flex h-[54px] shrink-0 items-center justify-center gap-2 px-5 text-[13px] font-semibold leading-none transition-colors whitespace-nowrap",
        isSelected ? "text-stitch-secondary" : "text-gray-950 hover:text-stitch-secondary"
      )}
    >
      {emoji ? (
        <span className="text-[18px] leading-none">{emoji}</span>
      ) : Icon ? (
        <Icon
          className={cn(
            "h-[18px] w-[18px] shrink-0 stroke-[1.8]",
            isSelected
              ? "text-stitch-secondary"
              : "text-gray-900 group-hover:text-stitch-secondary"
          )}
        />
      ) : null}
      <span>{label}</span>

      {isSelected && (
        <span className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full bg-stitch-secondary" />
      )}
    </button>
  );
}

export function CategoryBar({ categories, selected, onSelect, onSubcategorySelect, isPending }: CategoryBarProps) {
  const [activeMegaId, setActiveMegaId] = useState<string | null>(null);
  const activeCategory = categories.find((cat) => cat.id === activeMegaId) ?? null;
  const activeSubcategories = activeCategory?.subcategories ?? [];

  return (
    <div
      className="relative border-b border-gray-100 bg-white"
      onMouseLeave={() => setActiveMegaId(null)}
    >
      <div className="no-scrollbar mx-auto flex max-w-container-max justify-center overflow-x-auto px-4 sm:px-6 lg:px-16">
        <div className="flex min-w-max gap-3 sm:gap-5">
          {isPending ? (
            <>
              <div className="flex h-[54px] shrink-0 items-center justify-center gap-2 px-5">
                <Skeleton className="h-[18px] w-[18px] rounded-full" />
                <Skeleton className="h-4 w-[68px] rounded-md" />
              </div>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex h-[54px] shrink-0 items-center justify-center gap-2 px-5">
                  <Skeleton className="h-[18px] w-[18px] rounded-full" />
                  <Skeleton className="h-4 w-20 rounded-md" />
                </div>
              ))}
            </>
          ) : (
            <>
              <CategoryTab
                label="Top Deals"
                isSelected={selected === null}
                onClick={() => onSelect(null)}
                onMouseEnter={() => setActiveMegaId(null)}
                emoji={"\uD83D\uDD25"}
              />

              {categories.map((cat) => (
                <CategoryTab
                  key={cat.id}
                  label={cat.name}
                  isSelected={selected === cat.id}
                  onClick={() => onSelect(cat.id)}
                  onMouseEnter={() => setActiveMegaId(cat.subcategories?.length ? cat.id : null)}
                  icon={getCategoryIcon(cat.name)}
                />
              ))}
            </>
          )}
        </div>
      </div>

      {activeCategory && activeSubcategories.length > 0 && (
        <div
          className="absolute left-1/2 top-full z-50 mt-2 w-[min(700px,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl bg-white p-8 shadow-[0_18px_60px_rgba(20,27,43,0.16)] ring-1 ring-black/5"
          onMouseEnter={() => setActiveMegaId(activeCategory.id)}
        >
          <h3 className="mb-6 text-[20px] font-bold leading-tight text-gray-950">
            {activeCategory.name}
          </h3>
          <div className="grid grid-cols-1 gap-x-12 gap-y-4 sm:grid-cols-2">
            {activeSubcategories.map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => {
                  onSubcategorySelect?.(activeCategory.id, sub.id);
                  setActiveMegaId(null);
                }}
                className="min-w-0 rounded-md py-1 text-left text-[15px] font-medium leading-6 text-gray-700 transition-colors hover:text-stitch-secondary focus:outline-none focus:ring-2 focus:ring-stitch-secondary/20"
              >
                {sub.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
