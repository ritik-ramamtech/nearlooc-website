"use client";

import { useQuery } from "@tanstack/react-query";
import { getOfferById, getOffers, getRelatedOffers, type GetOffersQuery } from "./api";

export function useOffer(id: string) {
  return useQuery({
    queryKey: ["offers", "detail", id],
    queryFn: () => getOfferById(id),
    select: (res) => res.data,
    enabled: !!id,
  });
}

export function useOffers(query?: GetOffersQuery) {
  return useQuery({
    queryKey: ["offers", "list", query],
    queryFn: () => getOffers(query),
    select: (res) => res.data,
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
