import apiClient from "@/lib/api-client";
import type { MerchantSale } from "@/types/merchant";

interface ApiResponse<T> { message: string; data: T }
interface PaginatedResponse<T> { data: T[]; meta: { total: number; page: number; limit: number; total_pages: number } }

export interface CreateOfferInput {
  product_id: string;
  discounted_price: number;
  badge?: string;
  promo_price?: number;
  promo_end_at?: string;
  duration?: string;
  features?: string[];
  terms?: string[];
  location_ids?: string[];
}

export type UpdateOfferInput = Partial<Omit<CreateOfferInput, "product_id" | "location_ids"> & { location_id?: string }>;

export async function getActiveSales(params?: { page?: number; limit?: number }): Promise<PaginatedResponse<MerchantSale>> {
  const res = await apiClient.get<PaginatedResponse<MerchantSale> & { message: string }>("/merchant/sales/active", { params });
  return res.data;
}

export async function getSalesHistory(params?: { page?: number; limit?: number }): Promise<PaginatedResponse<MerchantSale>> {
  const res = await apiClient.get<PaginatedResponse<MerchantSale> & { message: string }>("/merchant/sales/history", { params });
  return res.data;
}

export async function createOffer(data: CreateOfferInput): Promise<ApiResponse<MerchantSale | MerchantSale[]>> {
  const res = await apiClient.post<ApiResponse<MerchantSale | MerchantSale[]>>("/merchant/sales", data);
  return res.data;
}

export async function updateOffer(id: string, data: UpdateOfferInput): Promise<ApiResponse<MerchantSale>> {
  const res = await apiClient.patch<ApiResponse<MerchantSale>>(`/merchant/sales/${id}`, data);
  return res.data;
}

export async function deactivateOffer(id: string): Promise<ApiResponse<MerchantSale>> {
  const res = await apiClient.patch<ApiResponse<MerchantSale>>(`/merchant/sales/${id}/deactivate`);
  return res.data;
}
