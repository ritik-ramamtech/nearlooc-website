"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFavorites, addFavorite, removeFavorite, type FavoritesListResponse } from "./api";
import type { ApiResponse, Offer, HomeFeed } from "@/types";
import type { OffersListResponse } from "@/features/offers/api";

export function useFavorites(page = 1) {
  return useQuery({
    queryKey: ["favorites", "list", page],
    queryFn: () => getFavorites(page),
    staleTime: 30_000,
    select: (res) => {
      const raw = res.data as unknown;
      if (Array.isArray(raw)) {
        return {
          items: raw as Offer[],
          meta: { total: (raw as unknown[]).length, page: 1, limit: 20, has_more: false },
        } as FavoritesListResponse;
      }
      return raw as FavoritesListResponse;
    },
  });
}

// Patch is_favorite on every offer that matches offerId across all cached query shapes
function patchOfferInCache(
  qc: ReturnType<typeof useQueryClient>,
  offerId: string,
  isFavorite: boolean
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

  // Favorites list — only remove optimistically (we lack full offer data to add safely)
  if (!isFavorite) {
    qc.setQueriesData<ApiResponse<FavoritesListResponse>>(
      { queryKey: ["favorites", "list"] },
      (old) => {
        if (!old) return old;
        const raw = old.data as unknown;
        const items: Offer[] = Array.isArray(raw)
          ? (raw as Offer[])
          : ((raw as FavoritesListResponse)?.items ?? []);

        const next = items.filter((o) => o.id !== offerId);
        const normalized: FavoritesListResponse = {
          items: next,
          meta: { total: next.length, page: 1, limit: 20, has_more: false },
        };
        return { ...old, data: normalized as unknown as typeof old.data };
      }
    );
  }
}

export function useToggleFavorite() {
  const qc = useQueryClient();

  const mutationOptions = (isAdding: boolean) => ({
    onMutate: async (offerId: string) => {
      // Cancel in-flight queries to avoid overwriting our optimistic update
      await qc.cancelQueries({ queryKey: ["offers"] });
      await qc.cancelQueries({ queryKey: ["home"] });
      await qc.cancelQueries({ queryKey: ["favorites"] });

      // Snapshot current cache for rollback
      const prevOfferDetail = qc.getQueryData<ApiResponse<Offer>>(["offers", "detail", offerId]);
      const prevOfferLists = qc.getQueriesData<ApiResponse<OffersListResponse>>({ queryKey: ["offers", "list"] });
      const prevHome = qc.getQueriesData<ApiResponse<HomeFeed>>({ queryKey: ["home"] });
      const prevFavorites = qc.getQueriesData<ApiResponse<FavoritesListResponse>>({ queryKey: ["favorites", "list"] });

      patchOfferInCache(qc, offerId, isAdding);

      return { prevOfferDetail, prevOfferLists, prevHome, prevFavorites, offerId };
    },
    onError: (
      err: unknown,
      offerId: string,
      ctx: {
        prevOfferDetail?: ApiResponse<Offer>;
        prevOfferLists: [readonly unknown[], ApiResponse<OffersListResponse> | undefined][];
        prevHome: [readonly unknown[], ApiResponse<HomeFeed> | undefined][];
        prevFavorites: [readonly unknown[], ApiResponse<FavoritesListResponse> | undefined][];
        offerId: string;
      } | undefined
    ) => {
      if (!ctx) return;

      // 409 on add = already favorited; keep heart filled instead of rolling back
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (isAdding && status === 409) {
        patchOfferInCache(qc, offerId, true);
        qc.invalidateQueries({ queryKey: ["favorites", "list"] });
        return;
      }

      // Roll back all snapshots
      if (ctx.prevOfferDetail) {
        qc.setQueryData(["offers", "detail", offerId], ctx.prevOfferDetail);
      }
      ctx.prevOfferLists.forEach(([key, data]) => qc.setQueryData(key, data));
      ctx.prevHome.forEach(([key, data]) => qc.setQueryData(key, data));
      ctx.prevFavorites.forEach(([key, data]) => qc.setQueryData(key, data));
    },
    onSettled: (_data: unknown, _err: unknown, offerId: string) => {
      // Only sync the specific offer from server — no full cascade refetch
      qc.invalidateQueries({ queryKey: ["offers", "detail", offerId] });
      qc.invalidateQueries({ queryKey: ["favorites", "list"] });
    },
  });

  const add = useMutation({ mutationFn: addFavorite, ...mutationOptions(true) });
  const remove = useMutation({ mutationFn: removeFavorite, ...mutationOptions(false) });

  const toggle = (offerId: string, isFavorite: boolean) => {
    if (isFavorite) remove.mutate(offerId);
    else add.mutate(offerId);
  };

  return { toggle, isPending: add.isPending || remove.isPending };
}
