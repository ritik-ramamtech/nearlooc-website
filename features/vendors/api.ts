import apiClient from "@/lib/api-client";
import type { ApiResponse } from "@/types";
import type { Vendor, VendorProduct, GetVendorsQuery, GetVendorProductsQuery } from "./types";

export interface VendorsListResponse {
  items: Vendor[];
  meta: { page: number; limit: number; total: number; has_more: boolean };
}

export interface VendorProductsResponse {
  vendor: Vendor;
  products: VendorProduct[];
  meta: { page: number; limit: number; total: number; has_more: boolean };
}

export async function getAllVendors(query?: GetVendorsQuery): Promise<ApiResponse<VendorsListResponse>> {
  const res = await apiClient.get<ApiResponse<VendorsListResponse>>("/vendors", { params: query });
  return res.data;
}

export async function getVendorProducts(
  id: string,
  query?: GetVendorProductsQuery
): Promise<ApiResponse<VendorProductsResponse>> {
  const res = await apiClient.get<ApiResponse<VendorProductsResponse>>(
    `/vendors/${id}/products`,
    { params: query }
  );
  return res.data;
}
