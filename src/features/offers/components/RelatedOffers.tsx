import { OfferCard } from "@/features/home";
import type { Offer } from "@/types";

interface RelatedOffersProps {
  offers: Offer[];
}

export function RelatedOffers({ offers }: RelatedOffersProps) {
  if (offers.length === 0) return null;

  return (
    <div>
      <h2 className="mb-3 px-4 text-headline-sm font-semibold text-on-surface md:px-0">
        You might also like
      </h2>
      <div
        className="no-scrollbar flex gap-4 overflow-x-auto px-4 pb-2 md:px-0"
        style={{ WebkitOverflowScrolling: "touch", scrollSnapType: "x mandatory" }}
      >
        {offers.map((offer) => (
          <div key={offer.id} style={{ scrollSnapAlign: "start", flexShrink: 0 }}>
            <OfferCard offer={offer} />
          </div>
        ))}
      </div>
    </div>
  );
}
