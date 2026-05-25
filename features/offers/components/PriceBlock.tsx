import { Badge } from "@/components/ui/badge";
import type { Offer } from "@/types";

interface PriceBlockProps {
  offer: Pick<Offer, "original_price" | "discounted_price" | "discount_percentage" | "promo_price" | "promo_time_left">;
}

export function PriceBlock({ offer }: PriceBlockProps) {
  const activePrice = offer.promo_price ?? offer.discounted_price;

  return (
    <div className="flex flex-wrap items-end gap-3">
      <span className="text-display font-bold text-on-surface">
        ₹{activePrice.toLocaleString()}
      </span>

      {offer.original_price > activePrice && (
        <span className="mb-1 text-body-lg text-on-surface-variant line-through">
          ₹{offer.original_price.toLocaleString()}
        </span>
      )}

      {offer.discount_percentage > 0 && (
        <Badge variant="destructive" className="mb-1">
          {Math.round(offer.discount_percentage)}% OFF
        </Badge>
      )}

      {offer.promo_price && offer.promo_price < offer.discounted_price && (
        <Badge className="mb-1 bg-stitch-secondary text-white">
          Promo price applied
        </Badge>
      )}
    </div>
  );
}
