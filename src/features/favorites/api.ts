import apiClient from "@/lib/api-client";
import type { ApiResponse, Offer } from "@/types";

export interface FavoritesListResponse {
  items: Offer[];
  meta: { page: number; limit: number; total: number; has_more: boolean };
}

export async function getFavorites(page = 1, limit = 20): Promise<ApiResponse<FavoritesListResponse>> {
  const res = await apiClient.get<ApiResponse<FavoritesListResponse>>("/favorites", {
    params: { page, limit },
  });
  return res.data;
}

export async function addFavorite(offerId: string): Promise<ApiResponse<{ offer_id: string; is_favorite: boolean }>> {
  const res = await apiClient.post("/favorites", { offer_id: offerId });
  return res.data;
}

export async function removeFavorite(offerId: string): Promise<ApiResponse<{ offer_id: string; is_favorite: boolean }>> {
  const res = await apiClient.delete(`/favorites/${offerId}`);
  return res.data;
}
