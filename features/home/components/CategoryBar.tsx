"use client";

import { cn } from "@/lib/utils";
import type { Category } from "@/types";

interface CategoryBarProps {
  categories: Category[];
  selected: string | null;
  onSelect: (id: string | null) => void;
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
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
