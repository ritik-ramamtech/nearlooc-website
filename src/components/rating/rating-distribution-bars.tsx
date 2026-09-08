import { Star } from "lucide-react";

type RatingDistributionBarsProps = {
  distribution: Partial<Record<1 | 2 | 3 | 4 | 5, number>>;
  totalReviews: number;
  className?: string;
};

export function RatingDistributionBars({
  distribution,
  totalReviews,
  className = "",
}: RatingDistributionBarsProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {([5, 4, 3, 2, 1] as const).map((star) => {
        const count = distribution[star] ?? 0;
        const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

        return (
          <div key={star} className="flex items-center gap-3">
            <span className="flex w-10 shrink-0 items-center justify-end gap-1 text-xs font-semibold text-gray-500">
              {star}
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            </span>

            <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-yellow-400 transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>

            <span className="w-6 shrink-0 text-right text-xs text-gray-400">
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
}
