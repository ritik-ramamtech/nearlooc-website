"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMerchantProfile, saveMerchantProfile } from "./api";
import type { SaveProfileInput } from "@/types/merchant";

export function useMerchantProfile() {
  return useQuery({
    queryKey: ["merchant", "profile"],
    queryFn: getMerchantProfile,
    select: (res) => res.data,
  });
}

export function useSaveMerchantProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SaveProfileInput) => saveMerchantProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["merchant", "profile"] });
    },
  });
}
