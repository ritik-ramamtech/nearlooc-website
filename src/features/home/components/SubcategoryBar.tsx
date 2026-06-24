"use client";

import {
  Hotel,
  Plane,
  Umbrella,
  Flower2,
  Scissors,
  Utensils,
  Coffee,
  Smartphone,
  Laptop,
  Headphones,
  Shirt,
  Footprints,
  LayoutGrid,
  Tag,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Subcategory } from "@/types";

interface SubcategoryBarProps {
  subcategories: Subcategory[];
  selected: string | null;
  onSelect: (id: string | null) => void;
}

/** Maps backend Material-style icon_key → lucide icon. Falls back to a tag. */
const ICON_BY_KEY: Record<string, LucideIcon> = {
  hotel: Hotel,
  flight: Plane,
  beach_access: Umbrella,
  spa: Flower2,
  content_cut: Scissors,
  restaurant: Utensils,
  local_cafe: Coffee,
  smartphone: Smartphone,
  computer: Laptop,
  headphones: Headphones,
  male: Shirt,
  female: Shirt,
  steps: Footprints,
};

/** A slim pill chip with an icon + label inline. */
function SubcategoryChip({
  label,
  isSelected,
  onClick,
  icon: Icon,
}: {
  label: string;
  isSelected: boolean;
  onClick: () => void;
  icon: LucideIcon;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-all",
        isSelected
          ? "border-stitch-primary bg-stitch-primary text-white shadow-sm"
          : "border-outline-variant bg-white text-on-surface-variant hover:border-stitch-primary/40 hover:text-on-surface"
      )}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}

export function SubcategoryBar({ subcategories, selected, onSelect }: SubcategoryBarProps) {
  if (subcategories.length === 0) return null;

  return (
    <div className="border-b border-outline-variant/40 bg-surface-container-low">
      <div className="mx-auto max-w-container-max">
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-2.5">
          <SubcategoryChip
            label="All"
            isSelected={selected === null}
            onClick={() => onSelect(null)}
            icon={LayoutGrid}
          />

          {subcategories.map((sub) => (
            <SubcategoryChip
              key={sub.id}
              label={sub.name}
              isSelected={selected === sub.id}
              onClick={() => onSelect(selected === sub.id ? null : sub.id)}
              icon={(sub.icon_key && ICON_BY_KEY[sub.icon_key]) || Tag}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
