"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, Clock, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Offer } from "@/types";
import { useToggleFavorite } from "@/features/favorites";

interface OfferCardProps {
  offer: Offer & { merchant?: { id: string; name: string; logo_url: string | null } };
  className?: string;
  fluid?: boolean;
}

export function OfferCard({ offer, className, fluid }: OfferCardProps) {
  const merchantName = offer.merchant?.name ?? offer.merchant_name ?? null;
  const { toggle, isPending } = useToggleFavorite();
  const [isFav, setIsFav] = useState(!!offer.is_favorite);

  return (
    <div className={cn(!fluid && "w-60", fluid && "w-full", className)}>
      <Link
        href={`/offers/${offer.id}`}
        className="group block overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5 transition-all duration-200 hover:-translate-y-0.5"
      >
        {/* Image — maintains 240×190 proportions at any card width */}
        <div className="relative aspect-[240/190] overflow-hidden bg-gray-100">
          {offer.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={offer.image_url}
              alt={offer.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-gray-400">
              No image
            </div>
          )}

          {offer.discount_percentage > 0 && (
            <span className="absolute left-2.5 top-2.5 rounded-full bg-red-500 px-2 py-[3px] text-[11px] font-bold leading-none text-white">
              {Math.round(offer.discount_percentage)}%
            </span>
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (isPending) return;
              setIsFav((prev) => !prev);
              toggle(offer, isFav);
            }}
            aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
            className="absolute bottom-2.5 right-2.5 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-none bg-white shadow"
          >
            <Heart
              className={cn(
                "h-3.5 w-3.5 transition-[fill,color] duration-150",
                isFav ? "fill-red-500 text-red-500" : "text-gray-400"
              )}
            />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1.5 px-3 py-[10px]">
          {/* Title — 1 line hard clip */}
          <p className="line-clamp-1 m-0 text-[13px] font-medium leading-snug text-gray-900">
            {offer.title}
          </p>

          {/* Price */}
          <div className="flex flex-nowrap items-center gap-1.5">
            {offer.original_price > offer.discounted_price && (
              <span className="text-[11px] text-gray-400 line-through">
                ₹{offer.original_price.toLocaleString()}
              </span>
            )}
            <span className="text-sm font-semibold text-gray-900">
              ₹{offer.discounted_price.toLocaleString()}
            </span>
            {offer.discount_percentage > 0 && (
              <span className="whitespace-nowrap rounded-full bg-green-100 px-1.5 py-0.5 text-[10px] font-semibold leading-snug text-green-600">
                {Math.round(offer.discount_percentage)}% off
              </span>
            )}
          </div>

          {/* Merchant */}
          {merchantName && (
            <div className="flex items-center gap-1 overflow-hidden">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
              <span className="truncate text-[11px] text-gray-500">{merchantName}</span>
              <Star className="h-2.5 w-2.5 shrink-0 fill-amber-400 text-amber-400" />
              <span className="text-[11px] text-gray-700">{offer.rating.toFixed(1)}</span>
              <span className="text-[11px] text-gray-400">({offer.review_count})</span>
            </div>
          )}

          {/* Timer */}
          {offer.promo_time_left && (
            <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-1.5">
              <div className="flex items-center gap-1">
                <Clock className="h-[11px] w-[11px] text-gray-400" />
                <span className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                  Ends in
                </span>
              </div>
              <span className="tabular-nums text-xs font-semibold text-green-600">
                {offer.promo_time_left}
              </span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
