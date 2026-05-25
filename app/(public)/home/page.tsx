"use client";

import { useState } from "react";
import { CategoryBar } from "@/features/home/components/CategoryBar";
import { OfferSection } from "@/features/home/components/OfferSection";
import { useHomeFeed } from "@/features/home/hooks";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { data, isPending, isError } = useHomeFeed(
    selectedCategory ? { category_id: selectedCategory } : undefined
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f9fafb" }}>
      {/* Category bar — always visible */}
      <div className="sticky top-16 z-30 border-b border-gray-200 bg-white">
        <CategoryBar
          categories={data?.categories ?? []}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>

      {/* Feed sections */}
      {isPending && (
        <div className="space-y-6 px-4 py-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3 animate-pulse">
              <div className="h-5 w-32 rounded bg-surface-container" />
              <div className="grid grid-cols-2 gap-3">
                {[1, 2].map((j) => (
                  <div key={j} className="aspect-[4/3] rounded-2xl bg-surface-container" />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="px-4 py-10 text-center text-on-surface-variant">
          Failed to load feed. Please try again.
        </div>
      )}

      {data && (
        <div className="divide-y divide-outline-variant/30">
          {data.sections.map((section) => (
            <OfferSection key={section.type} section={section} />
          ))}
          {data.sections.every((s) => s.offers.length === 0) && (
            <div className="px-4 py-10 text-center text-on-surface-variant">
              No offers found for this category.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
