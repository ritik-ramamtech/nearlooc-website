import apiClient from "@/lib/api-client";
import type { Offer } from "@/types";

export interface GetOffersQuery {
  category_id?: string;
  subcategory_id?: string;
  query?: string;           // backend field name is "query", not "search"
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

// Actual shape the backend returns for GET /offers (meta is at the top level, not inside data)
interface OffersApiResponse {
  success: boolean;
  message: string;
  data: Offer[];
  meta: { page: number; limit: number; total: number; has_more: boolean };
}

export async function getOffers(query?: GetOffersQuery): Promise<OffersListResponse> {
  const res = await apiClient.get<OffersApiResponse>("/offers", { params: query });
  return { items: res.data.data, meta: res.data.meta };
}

export async function getOfferById(id: string) {
  const res = await apiClient.get(`/offers/${id}`);
  return res.data;
}

export async function getRelatedOffers(id: string, limit = 10) {
  const res = await apiClient.get(`/offers/${id}/related`, { params: { limit } });
  return res.data;
}
