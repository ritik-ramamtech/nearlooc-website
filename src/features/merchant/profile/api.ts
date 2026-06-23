import apiClient from "@/lib/api-client";
import type { ApiResponse } from "@/types";
import type { MerchantProfileData, SaveProfileInput } from "@/types/merchant";

export async function getMerchantProfile(): Promise<ApiResponse<MerchantProfileData>> {
  const res = await apiClient.get<ApiResponse<MerchantProfileData>>("/merchant/profile");
  return res.data;
}

export async function saveMerchantProfile(
  data: SaveProfileInput
): Promise<{ message: string; data: MerchantProfileData }> {
  const res = await apiClient.patch<{ message: string; data: MerchantProfileData }>(
    "/merchant/profile",
    data
  );
  return res.data;
}

export async function deactivateMerchantProfile(): Promise<{ message: string }> {
  const res = await apiClient.patch<{ message: string }>("/merchant/deactivate");
  return res.data;
}

export async function reactivateMerchantProfile(): Promise<{ message: string; data: MerchantProfileData }> {
  const res = await apiClient.patch<{ message: string; data: MerchantProfileData }>("/merchant/reactivate");
  return res.data;
}
