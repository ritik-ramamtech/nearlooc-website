import { Badge } from "@/components/ui/badge";
import type { Offer } from "@/types";

interface PriceBlockProps {
  offer: Pick<Offer, "original_price" | "discounted_price" | "discount_percentage" | "promo_price" | "promo_time_left">;
}

export function PriceBlock({ offer }: PriceBlockProps) {
  const activePrice = offer.promo_price ?? offer.discounted_price;
  const savings = offer.original_price - activePrice;

  return (
    <div className="space-y-1.5">
      {/* Main price row */}
      <div className="flex flex-wrap items-end gap-2">
        <span className="text-[28px] font-bold leading-none text-on-surface">
          ₹{activePrice.toLocaleString()}
        </span>

        {offer.original_price > activePrice && (
          <span className="mb-0.5 text-body-md text-on-surface-variant line-through">
            ₹{offer.original_price.toLocaleString()}
          </span>
        )}

        {offer.discount_percentage > 0 && (
          <Badge variant="destructive" className="mb-0.5">
            {Math.round(offer.discount_percentage)}% OFF
          </Badge>
        )}

        {offer.promo_price && offer.promo_price < offer.discounted_price && (
          <Badge className="mb-0.5 bg-stitch-secondary text-white">
            Promo price
          </Badge>
        )}
      </div>

      {/* Savings line */}
      {savings > 0 && (
        <p className="text-label-md text-green-600">
          You save ₹{savings.toLocaleString()}
        </p>
      )}
    </div>
  );
}
