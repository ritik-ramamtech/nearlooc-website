"use client";

import { Store, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

export const VENDORS_TAB = "vendors" as const;

interface CategoryBarProps {
  categories: Category[];
  selected: string | null;
  onSelect: (id: string | null) => void;
}

/** A single circular category tile with a label underneath. */
function CategoryTile({
  label,
  isSelected,
  onClick,
  imageUrl,
  icon,
}: {
  label: string;
  isSelected: boolean;
  onClick: () => void;
  imageUrl?: string | null;
  icon?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex w-[68px] shrink-0 flex-col items-center gap-1.5 pt-1"
    >
      <span
        className={cn(
          "relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full transition-all duration-200 group-hover:-translate-y-0.5",
          isSelected
            ? "shadow-md ring-2 ring-stitch-primary ring-offset-2 ring-offset-surface"
            : "shadow-sm ring-1 ring-outline-variant group-hover:ring-stitch-primary/40",
          // photos sit on grey; icon tiles get a soft primary tint so they don't read as empty placeholders
          imageUrl ? "bg-gray-100" : "bg-stitch-primary/10"
        )}
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={label}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <span className="text-stitch-primary transition-colors">{icon}</span>
        )}
      </span>

      <span
        className={cn(
          "line-clamp-2 text-center text-[11px] leading-tight transition-colors",
          isSelected
            ? "font-semibold text-stitch-primary"
            : "font-medium text-on-surface-variant group-hover:text-on-surface"
        )}
      >
        {label}
      </span>
    </button>
  );
}

export function CategoryBar({ categories, selected, onSelect }: CategoryBarProps) {
  return (
    <div className="no-scrollbar overflow-x-auto">
      {/* w-max + mx-auto: centers the row when it fits, scrolls when it overflows */}
      <div className="mx-auto flex w-max gap-5 px-4 py-3 sm:gap-6">
        <CategoryTile
          label="All"
          isSelected={selected === null}
          onClick={() => onSelect(null)}
          icon={<LayoutGrid className="h-5 w-5" />}
        />

        <CategoryTile
          label="Vendors"
          isSelected={selected === VENDORS_TAB}
          onClick={() => onSelect(VENDORS_TAB)}
          icon={<Store className="h-5 w-5" />}
        />

        {categories.map((cat) => (
          <CategoryTile
            key={cat.id}
            label={cat.name}
            isSelected={selected === cat.id}
            onClick={() => onSelect(cat.id)}
            imageUrl={cat.image_url}
            icon={<Store className="h-5 w-5" />}
          />
        ))}
      </div>
    </div>
  );
}
