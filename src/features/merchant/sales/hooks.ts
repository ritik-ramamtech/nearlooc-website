"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getActiveSales, getSalesHistory, createOffer, updateOffer, deactivateOffer,
  type CreateOfferInput, type UpdateOfferInput,
} from "./api";

const QK = ["merchant", "sales"];

export function useActiveSales(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: [...QK, "active", params],
    queryFn: () => getActiveSales(params),
    select: (res) => res,
  });
}

export function useSalesHistory(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: [...QK, "history", params],
    queryFn: () => getSalesHistory(params),
    select: (res) => res,
  });
}

export function useCreateOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOfferInput) => createOffer(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK }),
  });
}

export function useUpdateOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOfferInput }) => updateOffer(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK }),
  });
}

export function useDeactivateOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deactivateOffer(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK }),
  });
}
