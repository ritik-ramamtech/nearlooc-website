"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { Star, Clock, Shield, MapPin, Tag, Timer, Heart, Share2, Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { PriceBlock } from "./PriceBlock";
import { PromoTimer } from "./PromoTimer";
import { OfferImageGallery } from "./OfferImageGallery";
import { MerchantRow } from "./MerchantRow";
import { OfferAccordion } from "./OfferAccordion";
import { RelatedOffers } from "./RelatedOffers";
import { OfferClaimBar } from "./OfferClaimBar";
import { OfferDetailSkeleton } from "./OfferDetailSkeleton";
import { useOffer, useRelatedOffers } from "../hooks";
import { useToggleFavorite } from "@/features/favorites";

interface OfferDetailProps {
  id: string;
}

export function OfferDetail({ id }: OfferDetailProps) {
  const { data: offer, isPending, isError } = useOffer(id);
  const { data: related = [] } = useRelatedOffers(id, 6);
  const { toggle: toggleFavorite } = useToggleFavorite();
  const [copied, setCopied] = useState(false);

  if (isPending) {
    return <OfferDetailSkeleton />;
  }

  if (isError || !offer) {
    return (
      <div className="px-4 pt-10 text-center text-on-surface-variant">
        Offer not found.
      </div>
    );
  }

  const images: string[] = offer.images ?? (offer.image_url ? [offer.image_url] : []);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: offer.title, text: offer.title, url });
      } catch {
        /* share dismissed — ignore */
      }
      return;
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        /* clipboard blocked — ignore */
      }
    }
  };

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

              <div className="flex items-start justify-between gap-3">
                <h1 className="text-[22px] font-bold leading-snug text-on-surface">
                  {offer.title}
                </h1>

                <div className="flex shrink-0 items-center gap-2">
                  {/* Like */}
                  <button
                    onClick={() => toggleFavorite(offer, !!offer.is_favorite)}
                    aria-label={offer.is_favorite ? "Remove from favorites" : "Save offer"}
                    aria-pressed={!!offer.is_favorite}
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border transition-all active:scale-95",
                      offer.is_favorite
                        ? "border-red-200 bg-red-50 text-red-500"
                        : "border-outline-variant bg-white text-on-surface-variant hover:border-red-200 hover:text-red-500"
                    )}
                  >
                    <Heart className={cn("h-5 w-5 transition-all", offer.is_favorite && "fill-red-500")} />
                  </button>

                  {/* Share */}
                  <button
                    onClick={handleShare}
                    aria-label="Share offer"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant bg-white text-on-surface-variant transition-all hover:border-stitch-primary hover:text-stitch-primary active:scale-95"
                  >
                    {copied ? <Check className="h-5 w-5 text-green-600" /> : <Share2 className="h-5 w-5" />}
                  </button>
                </div>
              </div>

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

      {/* Mobile sticky bar */}
      <div className="md:hidden">
        <OfferClaimBar merchantId={offer.merchant_id} />
      </div>
    </>
  );
}
