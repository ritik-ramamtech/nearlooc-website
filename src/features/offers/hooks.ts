"use client";

import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query";
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
    placeholderData: keepPreviousData
  });
}

export function useOffersInfinite(query?: GetOffersQuery) {
  return useInfiniteQuery({
    queryKey: ["offers", "infinite", query],
    queryFn: ({pageParam}) => getOffers({...query, page: pageParam as number}),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.meta.has_more ?  lastPage.meta.page + 1 : undefined,
    select: (data) => ({
      items: data.pages.flatMap((p) => p.items),
      meta: data.pages[data.pages.length - 1].meta
    })
  })
}

export function useRelatedOffers(id: string, limit = 10) {
  return useQuery({
    queryKey: ["offers", "related", id, limit],
    queryFn: () => getRelatedOffers(id, limit),
    select: (res) => res.data,
    enabled: !!id,
  });
}
