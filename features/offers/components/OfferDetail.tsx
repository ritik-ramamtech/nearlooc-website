"use client";

import { Star, Clock, CheckCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { PriceBlock } from "./PriceBlock";
import { PromoTimer } from "./PromoTimer";
import { OfferCard } from "@/features/home/components/OfferCard";
import { useOffer, useRelatedOffers } from "../hooks";
import type { Offer } from "@/types";

interface OfferDetailProps {
  id: string;
}

export function OfferDetail({ id }: OfferDetailProps) {
  const { data: offer, isPending, isError } = useOffer(id);
  const { data: related } = useRelatedOffers(id, 4);

  if (isPending) {
    return (
      <div className="space-y-4 px-4 pt-4 animate-pulse">
        <div className="aspect-[4/3] w-full rounded-2xl bg-surface-container" />
        <div className="h-6 w-3/4 rounded bg-surface-container" />
        <div className="h-10 w-1/2 rounded bg-surface-container" />
      </div>
    );
  }

  if (isError || !offer) {
    return (
      <div className="px-4 pt-10 text-center text-on-surface-variant">
        Offer not found.
      </div>
    );
  }

  const images: string[] = offer.images ?? (offer.image_url ? [offer.image_url] : []);

  return (
    <div className="pb-8">
      {/* Main image */}
      {images[0] && (
        <div className="aspect-[4/3] w-full overflow-hidden bg-surface-container-low">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[0]} alt={offer.title} className="h-full w-full object-cover" />
        </div>
      )}

      <div className="space-y-4 px-4 pt-4">
        {/* Category + title */}
        {offer.category_name && (
          <span className="text-label-sm font-semibold uppercase tracking-wide text-stitch-secondary">
            {offer.category_name}
          </span>
        )}
        <h1 className="text-headline-md font-bold text-on-surface">{offer.title}</h1>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-body-sm font-semibold text-on-surface">{offer.rating.toFixed(1)}</span>
          <span className="text-body-sm text-on-surface-variant">({offer.review_count} reviews)</span>
          {offer.duration && (
            <>
              <span className="text-on-surface-variant">·</span>
              <Clock className="h-4 w-4 text-on-surface-variant" />
              <span className="text-body-sm text-on-surface-variant">{offer.duration}</span>
            </>
          )}
        </div>

        {/* Promo timer */}
        {offer.promo_end_at && (
          <PromoTimer promoEndAt={offer.promo_end_at} promoTimeLeft={offer.promo_time_left} />
        )}

        {/* Price */}
        <PriceBlock offer={offer} />

        <Separator />

        {/* Merchant */}
        {offer.merchant_name && (
          <div className="flex items-center gap-3">
            {offer.merchant_logo_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={offer.merchant_logo_url}
                alt={offer.merchant_name}
                className="h-10 w-10 rounded-full object-cover"
              />
            )}
            <div>
              <p className="text-label-sm text-on-surface-variant">Offered by</p>
              <p className="text-body-sm font-semibold text-on-surface">{offer.merchant_name}</p>
            </div>
          </div>
        )}

        <Separator />

        {/* Tabs — details */}
        <Tabs defaultValue="overview">
          <TabsList className="w-full">
            <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
            <TabsTrigger value="highlights" className="flex-1">Highlights</TabsTrigger>
            <TabsTrigger value="terms" className="flex-1">Terms</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 space-y-3">
            {offer.description && (
              <p className="text-body-sm text-on-surface-variant leading-relaxed">{offer.description}</p>
            )}
            {offer.features && offer.features.length > 0 && (
              <ul className="space-y-2">
                {offer.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-body-sm text-on-surface">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-stitch-secondary" />
                    {f}
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>

          <TabsContent value="highlights" className="mt-4">
            {offer.highlights && offer.highlights.length > 0 ? (
              <ul className="space-y-2">
                {offer.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-body-sm text-on-surface">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-stitch-primary" />
                    {h}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-body-sm text-on-surface-variant">No highlights available.</p>
            )}
          </TabsContent>

          <TabsContent value="terms" className="mt-4">
            {offer.terms && offer.terms.length > 0 ? (
              <ul className="space-y-2">
                {offer.terms.map((t, i) => (
                  <li key={i} className="text-body-sm text-on-surface-variant">· {t}</li>
                ))}
              </ul>
            ) : (
              <p className="text-body-sm text-on-surface-variant">No terms specified.</p>
            )}
          </TabsContent>
        </Tabs>

        {/* Related offers */}
        {related && related.length > 0 && (
          <>
            <Separator />
            <div>
              <h2 className="mb-3 text-headline-sm font-semibold text-on-surface">You might also like</h2>
              <div className="grid grid-cols-2 gap-3">
                {related.map((o: Offer) => (
                  <OfferCard key={o.id} offer={o} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
