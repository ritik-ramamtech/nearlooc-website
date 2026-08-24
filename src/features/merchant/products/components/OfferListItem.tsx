"use client";

import { ChevronRight, Clock, MapPin, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductSummaryOffer } from "@/types/merchant";

interface Props {
  offer: ProductSummaryOffer;
  selected: boolean;
  onClick: () => void;
}

export default function OfferListItem({ offer, selected, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group w-full border-l-4 border-transparent border-b border-gray-100 px-5 py-4 text-left transition-all hover:bg-gray-50",
        selected && "border-brand-500 bg-brand-50",
      )}
    >
      <div className="flex items-start justify-between">
        {/* LEFT */}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
              {offer.discount_percentage}% OFF
            </span>

            {offer.badge && (
              <span className="rounded-full bg-orange-100 px-2.5 py-1 text-[11px] font-medium text-orange-700">
                {offer.badge}
              </span>
            )}
          </div>

          <div className="mt-3 flex items-end gap-2">
            <h3 className="text-2xl font-bold text-gray-900">
              ₹{offer.discounted_price.toLocaleString("en-IN")}
            </h3>

            {offer.promo_price && (
              <span className="pb-1 text-sm text-gray-400 line-through">
                ₹{offer.promo_price.toLocaleString("en-IN")}
              </span>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {offer.location.label}
            </div>

            {offer.promo_end_at && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />

                {new Date(offer.promo_end_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })}
              </div>
            )}

            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />

              {offer.rating}

              <span className="text-gray-400">({offer.review_count})</span>
            </div>
          </div>
        </div>

        {/* RIGHT */}

        <ChevronRight
          className={cn(
            "mt-1 h-5 w-5 transition-all",
            selected
              ? "translate-x-1 text-brand-500"
              : "text-gray-300 group-hover:text-gray-500",
          )}
        />
      </div>
    </button>
  );
}
