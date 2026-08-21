"use client";

import { cn } from "@/lib/utils";
import { Star } from "lucide-react";
import { RatingSummary } from "../api";

export function ReviewSummary({ total_reviews, avg_rating, distribution }: RatingSummary) {
    const ratings = ["5", "4", "3", "2", "1"] as const;
  return (
    <div className="mt-6 grid gap-2 grid-cols-[120px_1fr]" >
      {/* Left */}
      <div className="text-center">
        <p className="text-5xl font-bold text-on-surface">
          {avg_rating.toFixed(1)}
        </p>

        <div className="mt-2 flex justify-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-5 w-5",
                i < Math.round(avg_rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-outline-variant",
              )}
            />
          ))}
        </div>

        <p className="mt-2 text-sm text-on-surface-variant">
          {total_reviews} reviews
        </p>
      </div>

      {/* Right */}
      <div className="space-y-2">
        {ratings.map((rating) => {
          const count = distribution[rating] ?? 0;
          const percentage =
            total_reviews === 0
              ? 0
              : (count / total_reviews) * 100;

          return (
            <div key={rating} className="flex items-center gap-3">
              <span className="w-8 text-sm">{rating}★</span>

              <div className="h-4 flex-1 overflow-hidden rounded-sm border border-gray-300">
                <div
                  className="h-full rounded-sm bg-yellow-400 transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <span className="w-8 text-right text-sm text-on-surface-variant">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
