"use client";

import { ProductSummaryOffer } from "@/types/merchant";
import OfferListItem from "./OfferListItem";

interface ActiveOfferListProps {
  offers: ProductSummaryOffer[];
  selectedOfferId?: string;
  onSelect: (offer: ProductSummaryOffer) => void;
}

export default function ActiveOfferList({
  offers,
  selectedOfferId,
  onSelect,
}: ActiveOfferListProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <div>
          <h2 className="font-semibold text-gray-900">Active Offers</h2>
          <p className="text-xs text-gray-500">
            Select an offer to view details
          </p>
        </div>

        <div className="rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-600">
          {offers.length}
        </div>
      </div>

      {offers.length === 0 ? (
        <div className="flex h-44 flex-col items-center justify-center text-center">
          <p className="font-medium text-gray-700">
            No Active Offers
          </p>

          <p className="mt-1 text-sm text-gray-400">
            Create your first promotional offer.
          </p>
        </div>
      ) : (
        <div className="max-h-[420px] overflow-y-auto">
          {offers.map((offer) => (
            <OfferListItem
              key={offer.id}
              offer={offer}
              selected={offer.id === selectedOfferId}
              onClick={() => onSelect(offer)}
            />
          ))}
        </div>
      )}
    </div>
  );
}