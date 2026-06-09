"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { getFavorites, addFavorite, removeFavorite, type FavoritesListResponse } from "./api";
import type { ApiResponse, Offer, HomeFeed } from "@/types";
import type { OffersListResponse } from "@/features/offers/api";

function normalizeFavoritesData(data: unknown): FavoritesListResponse {
  if (Array.isArray(data)) {
    return {
      items: data as Offer[],
      meta: { total: data.length, page: 1, limit: 20, has_more: false },
    };
  }
  return data as FavoritesListResponse;
}

export function useFavorites(page = 1) {
  return useQuery({
    queryKey: ["favorites", "list", page],
    queryFn: () => getFavorites(page),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
    select: (res) => normalizeFavoritesData(res.data),
  });
}

// Patch is_favorite on every offer that matches offerId across all cached query shapes
function patchOfferInCache(
  qc: ReturnType<typeof useQueryClient>,
  offerId: string,
  isFavorite: boolean,
  offerObj?: Offer | null
) {
  // Offer detail
  qc.setQueryData<ApiResponse<Offer>>(["offers", "detail", offerId], (old) => {
    if (!old) return old;
    return { ...old, data: { ...old.data, is_favorite: isFavorite } };
  });

  // Offer lists
  qc.setQueriesData<ApiResponse<OffersListResponse>>({ queryKey: ["offers", "list"] }, (old) => {
    if (!old?.data?.items) return old;
    return {
      ...old,
      data: {
        ...old.data,
        items: old.data.items.map((o) =>
          o.id === offerId ? { ...o, is_favorite: isFavorite } : o
        ),
      },
    };
  });

  // Home feed (offers nested inside sections)
  qc.setQueriesData<ApiResponse<HomeFeed>>({ queryKey: ["home"] }, (old) => {
    if (!old?.data?.sections) return old;
    return {
      ...old,
      data: {
        ...old.data,
        sections: old.data.sections.map((section) => ({
          ...section,
          offers: section.offers.map((o) =>
            o.id === offerId ? { ...o, is_favorite: isFavorite } : o
          ),
        })),
      },
    };
  });

  // Favorites list — update in place using normalized shape
  qc.setQueriesData<ApiResponse<FavoritesListResponse>>(
    { queryKey: ["favorites", "list"] },
    (old) => {
      if (!old) return old;
      const current = normalizeFavoritesData(old.data);

      let nextItems: Offer[];
      if (!isFavorite) {
        nextItems = current.items.filter((o) => o.id !== offerId);
      } else if (offerObj && !current.items.some((o) => o.id === offerId)) {
        nextItems = [{ ...offerObj, is_favorite: true }, ...current.items];
      } else {
        return old;
      }

      const normalized: FavoritesListResponse = {
        items: nextItems,
        meta: { total: nextItems.length, page: 1, limit: 20, has_more: false },
      };
      return { ...old, data: normalized };
    }
  );
}

export function useToggleFavorite() {
  const qc = useQueryClient();

  const mutationOptions = (isAdding: boolean) => ({
    onMutate: async (offerOrId: string | Offer) => {
      const offerId = typeof offerOrId === "string" ? offerOrId : offerOrId.id;
      const offerObj = typeof offerOrId === "string" ? null : offerOrId;

      await qc.cancelQueries({ queryKey: ["offers"] });
      await qc.cancelQueries({ queryKey: ["home"] });
      await qc.cancelQueries({ queryKey: ["favorites"] });

      const prevOfferDetail = qc.getQueryData<ApiResponse<Offer>>(["offers", "detail", offerId]);
      const prevOfferLists = qc.getQueriesData<ApiResponse<OffersListResponse>>({ queryKey: ["offers", "list"] });
      const prevHome = qc.getQueriesData<ApiResponse<HomeFeed>>({ queryKey: ["home"] });
      const prevFavorites = qc.getQueriesData<ApiResponse<FavoritesListResponse>>({ queryKey: ["favorites", "list"] });

      patchOfferInCache(qc, offerId, isAdding, offerObj);

      return { prevOfferDetail, prevOfferLists, prevHome, prevFavorites, offerId };
    },
    onError: (
      err: unknown,
      offerOrId: string | Offer,
      ctx: {
        prevOfferDetail?: ApiResponse<Offer>;
        prevOfferLists: [readonly unknown[], ApiResponse<OffersListResponse> | undefined][];
        prevHome: [readonly unknown[], ApiResponse<HomeFeed> | undefined][];
        prevFavorites: [readonly unknown[], ApiResponse<FavoritesListResponse> | undefined][];
        offerId: string;
      } | undefined
    ) => {
      if (!ctx) return;

      // 409 on add = already favorited — keep heart filled instead of rolling back
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (isAdding && status === 409) {
        patchOfferInCache(qc, ctx.offerId, true);
        qc.invalidateQueries({ queryKey: ["favorites", "list"] });
        return;
      }

      if (ctx.prevOfferDetail) {
        qc.setQueryData(["offers", "detail", ctx.offerId], ctx.prevOfferDetail);
      }
      ctx.prevOfferLists.forEach(([key, data]) => qc.setQueryData(key, data));
      ctx.prevHome.forEach(([key, data]) => qc.setQueryData(key, data));
      ctx.prevFavorites.forEach(([key, data]) => qc.setQueryData(key, data));
    },
    onSettled: (_data: unknown, _err: unknown, offerOrId: string | Offer) => {
      const offerId = typeof offerOrId === "string" ? offerOrId : offerOrId.id;
      qc.invalidateQueries({ queryKey: ["offers", "detail", offerId] });
      if (isAdding) {
        qc.invalidateQueries({ queryKey: ["favorites", "list"] });
      }
    },
  });

  const add = useMutation({
    mutationFn: (offerOrId: string | Offer) => {
      const offerId = typeof offerOrId === "string" ? offerOrId : offerOrId.id;
      return addFavorite(offerId);
    },
    ...mutationOptions(true),
  });

  const remove = useMutation({
    mutationFn: (offerOrId: string | Offer) => {
      const offerId = typeof offerOrId === "string" ? offerOrId : offerOrId.id;
      return removeFavorite(offerId);
    },
    ...mutationOptions(false),
  });

  const toggle = (offerOrId: string | Offer, isFavorite: boolean) => {
    if (isFavorite) remove.mutate(offerOrId);
    else add.mutate(offerOrId);
  };

  return { toggle, isPending: add.isPending || remove.isPending };
}
