import apiClient from "@/lib/api-client";
import type { ApiResponse, Coupon } from "@/types";

export async function getCoupons(): Promise<ApiResponse<Coupon[]>> {
  const res = await apiClient.get<ApiResponse<Coupon[]>>("/coupons");
  return res.data;
}
