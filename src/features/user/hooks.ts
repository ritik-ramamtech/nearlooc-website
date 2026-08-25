"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProfile,
  updateProfile,
  updateLocation,
  type UpdateProfileInput,
  type UpdateLocationInput,
  getSavedAddresses,
  updateActiveAddress,
  UpdateAddressInput,
  updateAddress,
  addAddress,
  CreateAddressInput,
} from "./api";

export function useProfile() {
  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: getProfile,
    select: (res) => res.data,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProfileInput) => updateProfile(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["user", "profile"] }),
  });
}

export function useUpdateLocation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateLocationInput) => updateLocation(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["user", "profile"] }),
  });
}

export function useSavedAddresses(enabled: boolean = true) {
  return useQuery({
    queryKey: ["user", "address"],
    queryFn: getSavedAddresses,
    select: (res) => res.data,
    enabled,
  });
}

export function useUpdateActiveAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => updateActiveAddress(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["user", "address"] }),
  });
}

export function useUpdateAddress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAddressInput }) =>
      updateAddress(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["user", "address"] }),
  });
}

export function useAddAdress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ data } : {data: CreateAddressInput}) =>
      addAddress(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["user", "address"] }),
  });
}
