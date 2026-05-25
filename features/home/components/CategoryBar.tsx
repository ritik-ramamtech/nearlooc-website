"use client";

import {
  LayoutGrid,
  Monitor,
  ShoppingBag,
  Home,
  UtensilsCrossed,
  Sparkles,
  Dumbbell,
  Store,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

interface CategoryBarProps {
  categories: Category[];
  selected: string | null;
  onSelect: (id: string | null) => void;
}

function getCategoryIcon(name: string): LucideIcon {
  const n = name.toLowerCase();
  if (n.includes("electron")) return Monitor;
  if (n.includes("fashion") || n.includes("clothing")) return ShoppingBag;
  if (n.includes("home") || n.includes("decor") || n.includes("beauty")) return Home;
  if (n.includes("food") || n.includes("dining")) return UtensilsCrossed;
  if (n.includes("spa") || n.includes("salon")) return Sparkles;
  if (n.includes("sport")) return Dumbbell;
  if (n.includes("vendor")) return Store;
  return LayoutGrid;
}

export function CategoryBar({ categories, selected, onSelect }: CategoryBarProps) {
  return (
    <div
      className="flex gap-2 overflow-x-auto px-4 py-3"
      style={{ scrollbarWidth: "none" }}
    >
      {/* All pill */}
      <button
        onClick={() => onSelect(null)}
        className={cn(
          "flex flex-shrink-0 items-center gap-1.5 rounded-full border text-[14px] font-medium transition-colors",
          selected === null
            ? "border-transparent bg-green-600 text-white"
            : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
        )}
        style={{ padding: "8px 20px" }}
      >
        <LayoutGrid className="h-4 w-4" strokeWidth={1.75} />
        All Deals
      </button>

      {categories.map((cat) => {
        const Icon = getCategoryIcon(cat.name);
        const isActive = selected === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={cn(
              "flex flex-shrink-0 items-center gap-1.5 rounded-full border text-[14px] font-medium transition-colors",
              isActive
                ? "border-transparent bg-green-600 text-white"
                : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
            )}
            style={{ padding: "8px 20px" }}
          >
            <Icon className="h-4 w-4" strokeWidth={1.75} />
            {cat.name}
          </button>
        );
      })}
    </div>
  );
}
