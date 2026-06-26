"use client";

import { Store } from "lucide-react";
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

export function CategoryBar({ categories, selected, onSelect }: CategoryBarProps) {
  return (
    <div className="px-4 no-scrollbar flex gap-2 overflow-x-auto py-3">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          "shrink-0 rounded-full px-4 py-1.5 text-label-md font-medium transition-colors",
          selected === null
            ? "bg-stitch-primary text-white"
            : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
        )}
      >
        All
      </button>

      <button
        onClick={() => onSelect(VENDORS_TAB)}
        className={cn(
          "shrink-0 flex items-center gap-1.5 rounded-full px-4 py-1.5 text-label-md font-medium transition-colors",
          selected === VENDORS_TAB
            ? "bg-stitch-primary text-white"
            : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
        )}
      >
        <Store className="h-3.5 w-3.5" />
        Vendors
      </button>

      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={cn(
            "shrink-0 rounded-full px-4 py-1.5 text-label-md font-medium transition-colors",
            selected === cat.id
              ? "bg-stitch-primary text-white"
              : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container"
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
          {cat.name}
        </button>
      ))}
    </div>
  );
}
