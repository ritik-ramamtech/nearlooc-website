"use client";

import type React from "react";
import Link from "next/link";
import { Star, Clock, Shield, MapPin, Tag, Timer } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { PriceBlock } from "./PriceBlock";
import { PromoTimer } from "./PromoTimer";
import { OfferImageGallery } from "./OfferImageGallery";
import { MerchantRow } from "./MerchantRow";
import { OfferAccordion } from "./OfferAccordion";
import { RelatedOffers } from "./RelatedOffers";
import { OfferClaimBar } from "./OfferClaimBar";
import { useOffer, useRelatedOffers } from "../hooks";
import { useToggleFavorite } from "@/features/favorites";

interface OfferDetailProps {
  id: string;
}

export function OfferDetail({ id }: OfferDetailProps) {
  const { data: offer, isPending, isError } = useOffer(id);
  const { data: related = [] } = useRelatedOffers(id, 6);
  const { toggle: toggleFavorite } = useToggleFavorite();

  if (isPending) {
    return (
      <div className="animate-pulse space-y-4 px-4 pt-4">
        <div className="aspect-[4/3] w-full rounded-2xl bg-surface-container" />
        <div className="h-6 w-3/4 rounded bg-surface-container" />
        <div className="h-8 w-1/2 rounded bg-surface-container" />
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
  const activePrice = offer.promo_price ?? offer.discounted_price;

  const trustBadges = [
    offer.duration
      ? { icon: Timer, label: offer.duration, sub: "Offer validity" }
      : null,
    offer.promo_end_at
      ? { icon: Shield, label: "Limited Time", sub: "Promo pricing active" }
      : null,
    (offer.latitude && offer.longitude)
      ? { icon: MapPin, label: "Location-based", sub: "Deal near you" }
      : null,
    offer.discount_percentage > 0
      ? { icon: Tag, label: `${Math.round(offer.discount_percentage)}% Off`, sub: "On original price" }
      : null,
  ].filter(Boolean) as { icon: React.ElementType; label: string; sub: string }[];

  return (
    <>
      <div className="pb-28 md:pb-12">

        <div className="md:mx-auto md:max-w-6xl md:px-8 md:py-8">
          <div className="md:grid md:grid-cols-[1fr_420px] md:gap-10 md:items-start">

            {/* Left — Image gallery */}
            <div className="md:sticky md:top-20">
              <OfferImageGallery
                images={images}
                title={offer.title}
                discountPercentage={offer.discount_percentage}
                badge={offer.badge}
              />
            </div>

            {/* Right — Info + CTAs */}
            <div className="space-y-5 px-4 pt-5 md:px-0 md:pt-0">

              {offer.category_name && (
                <p className="text-label-sm font-semibold uppercase tracking-widest text-stitch-secondary">
                  {offer.category_name}
                </p>
              )}

              <h1 className="text-[22px] font-bold leading-snug text-on-surface">
                {offer.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-label-md font-semibold text-on-surface">
                    {offer.rating.toFixed(1)}
                  </span>
                  <span className="text-body-sm text-on-surface-variant">
                    ({offer.review_count} reviews)
                  </span>
                </div>
                {offer.duration && (
                  <div className="flex items-center gap-1 text-on-surface-variant">
                    <span>·</span>
                    <Clock className="h-3.5 w-3.5" />
                    <span className="text-body-sm">{offer.duration}</span>
                  </div>
                )}
              </div>

              <Separator />

              <PriceBlock offer={offer} />

              {offer.promo_end_at && (
                <PromoTimer
                  promoEndAt={offer.promo_end_at}
                  promoTimeLeft={offer.promo_time_left}
                />
              )}

              {trustBadges.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {trustBadges.map(({ icon: Icon, label, sub }) => (
                    <div
                      key={label}
                      className="flex items-start gap-2.5 rounded-xl border border-outline-variant bg-surface-container-lowest p-3"
                    >
                      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-stitch-secondary" />
                      <div>
                        <p className="text-label-sm font-semibold text-on-surface">{label}</p>
                        <p className="text-[11px] text-on-surface-variant">{sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}


              {/* Desktop CTAs */}
              <div className="hidden space-y-2 md:block">
                <button className="w-full rounded-xl bg-stitch-primary py-3.5 text-label-md font-semibold text-white transition-colors hover:bg-stitch-secondary active:scale-[0.98]">
                  Claim Deal — ₹{activePrice.toLocaleString()}
                </button>
                {offer.merchant_id && (
                  <Link
                    href={`/vendors/${offer.merchant_id}/products`}
                    className="block w-full rounded-xl border-2 border-stitch-primary py-3.5 text-center text-label-md font-semibold text-stitch-primary transition-colors hover:bg-surface-container"
                  >
                    See All Deals
                  </Link>
                )}
              </div>

              {/* Desktop accordion */}
              <div className="hidden md:block">
                <OfferAccordion
                  description={offer.description}
                  features={offer.features}
                  highlights={offer.highlights}
                  terms={offer.terms}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile accordion */}
        <div className="mt-5 px-4 md:hidden">
          <OfferAccordion
            description={offer.description}
            features={offer.features}
            highlights={offer.highlights}
            terms={offer.terms}
          />
        </div>

        {related.length > 0 && (
          <div className="mt-8 md:mx-auto md:max-w-6xl md:px-8">
            <Separator className="mb-6" />
            <RelatedOffers offers={related} />
          </div>
        )}
      </div>

      {/* Mobile sticky claim bar */}
      <div className="md:hidden">
        <OfferClaimBar
          price={activePrice}
          isFavorite={offer.is_favorite}
          merchantId={offer.merchant_id}
          onToggleFavorite={() => toggleFavorite(offer, !!offer.is_favorite)}
        />
      </div>
    </>
  );
}
