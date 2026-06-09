"use client";

import { useQuery } from "@tanstack/react-query";
import { getOfferById, getOffers, getRelatedOffers, type GetOffersQuery, type OfferDetailResponse } from "./api";

export function useOffer(id: string) {
  return useQuery({
    queryKey: ["offers", "detail", id],
    queryFn: () => getOfferById(id),
    select: (res) => {
      const d: OfferDetailResponse = res.data;
      return {
        ...d,
        merchant_id: d.merchant_id ?? d.merchant?.id ?? null,
        merchant_name: d.merchant_name ?? d.merchant?.name ?? null,
        merchant_logo_url: d.merchant_logo_url ?? d.merchant?.logo_url ?? null,
      };
    },
    enabled: !!id,
  });
}

export function useOffers(query?: GetOffersQuery) {
  return useQuery({
    queryKey: ["offers", "list", query],
    queryFn: () => getOffers(query),
  });
}

export function useRelatedOffers(id: string, limit = 10) {
  return useQuery({
    queryKey: ["offers", "related", id, limit],
    queryFn: () => getRelatedOffers(id, limit),
    select: (res) => res.data,
    enabled: !!id,
  });
}
