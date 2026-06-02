import apiClient from "@/lib/api-client";
import type { MerchantLocationData } from "@/types/merchant";

interface ApiResponse<T> {
  message: string;
  data: T;
}

export interface CreateLocationInput {
  label: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  latitude?: number;
  longitude?: number;
  is_primary?: boolean;
}

export type UpdateLocationInput = Partial<CreateLocationInput>;

export async function getMerchantLocations(): Promise<ApiResponse<MerchantLocationData[]>> {
  const res = await apiClient.get<ApiResponse<MerchantLocationData[]>>("/merchant/locations");
  return res.data;
}

export async function createMerchantLocation(
  data: CreateLocationInput
): Promise<ApiResponse<MerchantLocationData>> {
  const res = await apiClient.post<ApiResponse<MerchantLocationData>>(
    "/merchant/locations",
    data
  );
  return res.data;
}

export async function updateMerchantLocation(
  id: string,
  data: UpdateLocationInput
): Promise<ApiResponse<MerchantLocationData>> {
  const res = await apiClient.patch<ApiResponse<MerchantLocationData>>(
    `/merchant/locations/${id}`,
    data
  );
  return res.data;
}

export async function deleteMerchantLocation(id: string): Promise<void> {
  await apiClient.delete(`/merchant/locations/${id}`);
}
