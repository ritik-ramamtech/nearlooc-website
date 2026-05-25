import apiClient from "@/lib/api-client";
import type { ApiResponse, Offer } from "@/types";

export interface GetOffersQuery {
  category_id?: string;
  subcategory_id?: string;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
  latitude?: number;
  longitude?: number;
}

export interface OffersListResponse {
  items: Offer[];
  meta: { page: number; limit: number; total: number; has_more: boolean };
}

export async function getOffers(query?: GetOffersQuery): Promise<ApiResponse<OffersListResponse>> {
  const res = await apiClient.get<ApiResponse<OffersListResponse>>("/offers", { params: query });
  return res.data;
}

export async function getOfferById(id: string): Promise<ApiResponse<Offer>> {
  const res = await apiClient.get<ApiResponse<Offer>>(`/offers/${id}`);
  return res.data;
}

export async function getRelatedOffers(id: string, limit = 10): Promise<ApiResponse<Offer[]>> {
  const res = await apiClient.get<ApiResponse<Offer[]>>(`/offers/${id}/related`, {
    params: { limit },
  });
  return res.data;
}
