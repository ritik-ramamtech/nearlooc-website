import apiClient from "@/lib/api-client";
import type { ApiResponse, UserProfile, PreferredLocation } from "@/types";

export interface UpdateProfileInput {
  name?: string;
  phone?: string;
  avatar_url?: string;
}

export interface UpdateLocationInput {
  latitude: number;
  longitude: number;
  display_name?: string;
}

export async function getProfile(): Promise<ApiResponse<UserProfile>> {
  const res = await apiClient.get<ApiResponse<UserProfile>>("/users/me");
  return res.data;
}

export async function updateProfile(data: UpdateProfileInput): Promise<ApiResponse<UserProfile>> {
  const res = await apiClient.patch<ApiResponse<UserProfile>>("/users/me", data);
  return res.data;
}

export async function updateLocation(
  data: UpdateLocationInput
): Promise<ApiResponse<{ preferred_location: PreferredLocation }>> {
  const res = await apiClient.put("/users/me/location", data);
  return res.data;
}
