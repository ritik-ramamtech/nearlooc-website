"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getActiveSales,
  getSalesHistory,
  createOffer,
  updateOffer,
  deactivateOffer,
  type CreateOfferInput,
  type UpdateOfferInput,
  getOffer,
  notifyOffer,
} from "./api";

const QK = ["merchant", "sales"];

export function useActiveSales( 
  enabled: boolean, 
  params?: {
  page?: number;
  limit?: number;
  category_id?: string;
  subcatgeory_id?: string;
  min_price?: number;
  max_price?: number;
  product_id?: string;
}) {
  return useQuery({
    queryKey: [...QK, "active", params],
    queryFn: () => getActiveSales(params),
    select: (res) => res,
    enabled: enabled
  });
}

export function useSalesHistory(
  enabled: boolean,
  params?: { 
    page?: number; 
    limit?: number,
    category_id?: string;
    subcatgeory_id?: string;
    min_price?: number;
    max_price?: number;
    product_id?: string;
   }) {
  return useQuery({
    queryKey: [...QK, "history", params],
    queryFn: () => getSalesHistory(params),
    select: (res) => res,
    enabled: enabled
  });
}

export function useCreateOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOfferInput) => createOffer(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK });
      qc.invalidateQueries({ queryKey: ["merchant", "overview"] });
    },
  });
}

export function useUpdateOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOfferInput }) =>
      updateOffer(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK });
      qc.invalidateQueries({ queryKey: ["merchant", "overview"] });
    },
  });
}

export function useDeactivateOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deactivateOffer(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK });
      qc.invalidateQueries({ queryKey: ["merchant", "overview"] });
    },
  });
}

export function useNotifyOffer() {
  return useMutation({
    mutationFn: ({ id, custom_message }: { id: string; custom_message?: string }) =>
      notifyOffer(id, custom_message),
  });
}

export function useMerchantOfferDetail(id: string) {
  return useQuery({
    queryKey: [...QK, id],
    queryFn: () => getOffer(id),
    select: (res) => res.data,
    enabled: !!id,
  })
}