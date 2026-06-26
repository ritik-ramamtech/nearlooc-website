"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, Clock, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Offer } from "@/types";
import { useToggleFavorite } from "@/features/favorites";

interface OfferCardProps {
  offer: Offer & { merchant?: { id: string; name: string; logo_url: string | null } };
  className?: string;
  fluid?: boolean;
}

export function OfferCard({ offer, className, fluid }: OfferCardProps) {
  const router = useRouter();
  const merchantName = offer.merchant?.name ?? offer.merchant_name ?? null;
  const categoryName = offer.category_name ?? offer.badge ?? null;
  const { toggle, isPending } = useToggleFavorite();
  const [isFav, setIsFav] = useState(!!offer.is_favorite);
  const discount = Math.round(offer.discount_percentage);
  const hasDiscount = discount > 0;

  return (
    <div className={cn(!fluid && "w-[208px] sm:w-[224px]", fluid && "w-full", className)}>
      <Link
        href={`/offers/${offer.id}`}
        className="group relative flex h-full min-h-[318px] flex-col overflow-hidden rounded-xl bg-white shadow-[0_8px_22px_rgba(20,27,43,0.06)] ring-1 ring-gray-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(20,27,43,0.10)]"
      >
        <div className="relative flex aspect-[224/148] items-center justify-center overflow-hidden bg-[#f7faf8] px-4 pb-1 pt-8">
          {offer.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={offer.image_url}
              alt={offer.title}
              className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-gray-400">
              No image
            </div>
          )}

          {hasDiscount && (
            <span className="absolute left-3 top-3 rounded-[5px] bg-[#ff2d46] px-2 py-1 text-[10px] font-bold leading-none text-white">
              {discount}% OFF
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
            className="absolute right-3 top-3 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm transition-colors hover:bg-gray-50"
          >
            <Heart
              className={cn(
                "h-3.5 w-3.5 transition-[fill,color] duration-150",
                isFav ? "fill-red-500 text-red-500" : "text-gray-500"
              )}
            />
          </button>
        </div>

        <div className="flex flex-1 flex-col px-3 pb-3 pt-1">
          {categoryName && (
            <span className="mb-2 w-fit rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold leading-none text-emerald-700">
              {categoryName}
            </span>
          )}

          <p className="line-clamp-2 min-h-[34px] text-[13px] font-bold leading-[17px] text-gray-950">
            {offer.title}
          </p>

          {merchantName && (
            <div 
              className="mt-2 flex items-center gap-1.5 overflow-hidden z-10 cursor-pointer hover:opacity-80"
              onClick={(e) => {
                const merchantId = offer.merchant?.id ?? offer.merchant_id;
                if (merchantId) {
                  e.preventDefault();
                  e.stopPropagation();
                  router.push(`/vendors/${merchantId}/products`);
                }
              }}
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
              <span className="truncate text-[11px] text-gray-500 hover:underline">{merchantName}</span>
            </div>
          )}

          <div className="mt-2.5 flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />
            <span className="text-[11px] font-medium text-gray-700">{offer.rating.toFixed(1)}</span>
            <span className="text-[11px] text-gray-500">({offer.review_count.toLocaleString()})</span>
          </div>

          <div className="mt-3 flex items-end gap-2">
            <span className="text-[14px] font-semibold leading-none text-gray-900">
              Rs {offer.discounted_price.toLocaleString()}
            </span>
            {offer.original_price > offer.discounted_price && (
              <span className="text-[11px] text-gray-400 line-through">
                Rs {offer.original_price.toLocaleString()}
              </span>
            )}
            {hasDiscount && (
              <span className="ml-auto whitespace-nowrap rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-bold leading-none text-emerald-700">
                {discount}% off
              </span>
            )}
          </div>

          {offer.promo_time_left && (
            <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2">
              <div className="flex items-center gap-1">
                <Clock className="h-[11px] w-[11px] text-gray-400" />
                <span className="text-[10px] font-medium uppercase text-gray-400">
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




