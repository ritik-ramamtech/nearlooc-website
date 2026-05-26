import apiClient from "@/lib/api-client";
import type { Vendor, VendorSummary, VendorProduct, GetVendorsQuery, GetVendorProductsQuery } from "./types";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  total_pages?: number;
  has_more: boolean;
}

// GET /vendors — standard ApiResponse shape
export interface VendorsRawResponse {
  message: string;
  data: Vendor[];
  meta: PaginationMeta;
}

// GET /vendors/:id/products — non-standard: vendor + meta are siblings of data
export interface VendorProductsRawResponse {
  success: boolean;
  message: string;
  vendor: VendorSummary;
  data: VendorProduct[];
  meta: PaginationMeta;
}

// Normalised shape consumed by components
export interface VendorProductsNormalised {
  vendor: VendorSummary;
  products: VendorProduct[];
  meta: PaginationMeta;
}

export async function getAllVendors(query?: GetVendorsQuery): Promise<VendorsRawResponse> {
  const res = await apiClient.get<VendorsRawResponse>("/vendors", { params: query });
  return res.data;
}

export async function getVendorById(id: string): Promise<Vendor | null> {
  // No dedicated GET /vendors/:id endpoint — fetch list with high limit and find by ID
  const res = await apiClient.get<VendorsRawResponse>("/vendors", { params: { limit: 100 } });
  return res.data.data.find((v) => v.id === id) ?? null;
}

export async function getVendorProducts(
  id: string,
  query?: GetVendorProductsQuery
): Promise<VendorProductsRawResponse> {
  const res = await apiClient.get<VendorProductsRawResponse>(
    `/vendors/${id}/products`,
    { params: query }
  );
  return res.data;
}
