"use client";

import { CalendarDays, Clock3, MapPin, Tag } from "lucide-react";

import { ProductSummaryOffer } from "@/types/merchant";

interface Props {
  offers: ProductSummaryOffer[];
}

export default function OfferHistoryTable({ offers }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}

      <div className="border-b px-5 py-4 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-gray-900">Offer History</h2>

          <p className="text-xs text-gray-500">Previously deactivated offers</p>
        </div>

        <div className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold">
          {offers.length}
        </div>
      </div>

      {offers.length === 0 ? (
        <div className="flex h-36 items-center justify-center text-sm text-gray-400">
          No previous offers
        </div>
      ) : (
        <div className="divide-y">
          {offers.map((offer) => (
            <HistoryItem key={offer.id} offer={offer} />
          ))}
        </div>
      )}
    </div>
  );
}

function HistoryItem({ offer }: { offer: ProductSummaryOffer }) {
  return (
    <div className="p-5 hover:bg-gray-50 transition">
      <div className="flex items-start justify-between">
        {/* LEFT */}

        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold">
              {offer.discount_percentage}% OFF
            </span>

            {offer.badge && (
              <span className="rounded-full bg-orange-100 px-2 py-1 text-xs text-orange-700">
                {offer.badge}
              </span>
            )}
          </div>

          <div className="mt-3 flex items-end gap-2">
            <h3 className="text-xl font-bold">
              ₹{offer.discounted_price.toLocaleString("en-IN")}
            </h3>
          </div>

          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />

              {offer.location.label}
            </div>

            {offer.promo_end_at && (
              <div className="flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                Ended{" "}
                {new Date(offer.promo_end_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            )}
          </div>
        </div>

        {/* STATUS */}

        <div>
          <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
            Inactive
          </span>
        </div>
      </div>
    </div>
  );
}
