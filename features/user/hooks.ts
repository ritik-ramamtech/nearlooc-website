"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfile, updateLocation, type UpdateProfileInput, type UpdateLocationInput } from "./api";

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
