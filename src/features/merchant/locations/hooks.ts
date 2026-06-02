"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMerchantLocations,
  createMerchantLocation,
  updateMerchantLocation,
  deleteMerchantLocation,
  type CreateLocationInput,
  type UpdateLocationInput,
} from "./api";

const QK = ["merchant", "locations"];

export function useMerchantLocations() {
  return useQuery({
    queryKey: QK,
    queryFn: getMerchantLocations,
    select: (res) => res.data,
  });
}

export function useCreateLocation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateLocationInput) => createMerchantLocation(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK });
      qc.invalidateQueries({ queryKey: ["merchant", "profile"] });
    },
  });
}

export function useUpdateLocation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLocationInput }) =>
      updateMerchantLocation(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK });
      qc.invalidateQueries({ queryKey: ["merchant", "profile"] });
    },
  });
}

export function useDeleteLocation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteMerchantLocation(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK });
      qc.invalidateQueries({ queryKey: ["merchant", "profile"] });
    },
  });
}
