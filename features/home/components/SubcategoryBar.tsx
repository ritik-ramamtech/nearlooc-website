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
    <div className="border-b border-outline-variant/40 bg-surface-container-low">
      <div className="mx-auto max-w-container-max">
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-2.5">
          <button
            onClick={() => onSelect(null)}
            className={cn(
              "shrink-0 rounded-md px-3 py-1 text-[12px] font-semibold tracking-wide transition-all",
              selected === null
                ? "bg-stitch-primary text-white shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            All
          </button>

          {subcategories.map((sub) => (
            <button
              key={sub.id}
              onClick={() => onSelect(selected === sub.id ? null : sub.id)}
              className={cn(
                "shrink-0 rounded-md border px-3 py-1 text-[12px] font-medium transition-all",
                selected === sub.id
                  ? "border-stitch-primary bg-stitch-primary/10 text-stitch-primary"
                  : "border-outline-variant bg-white text-on-surface-variant hover:border-stitch-primary/40 hover:text-on-surface"
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
