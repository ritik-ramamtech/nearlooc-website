import apiClient from "@/lib/api-client";
import type { ApiResponse, UserProfile, PreferredLocation, Address } from "@/types";
import { string } from "zod";

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

export interface CreateAddressInput {
  label: string;
  latitude?: string;
  longitude?: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
}

export interface UpdateAddressInput extends Partial<CreateAddressInput> {}

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

export async function getSavedAddresses(): Promise<ApiResponse<Address[]>> {
  const res = await apiClient.get("/locations/addresses");

  return res.data;
}

export async function updateActiveAddress(id: String) {
  const res = await apiClient.put(`/locations/addresses/${id}/activate`);

  return res.data;
}

export async function updateAddress(id:string, data: UpdateAddressInput) {
  const res = await apiClient.patch(`/locations/addresses/${id}`, data);

  return res.data;
}

export async function addAddress(data: CreateAddressInput) {
  const res = await apiClient.post('/locations/addresses', data);

  return res.data;
}