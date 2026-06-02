"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMerchantProducts, createProduct, updateProduct, deactivateProduct,
  type CreateProductInput, type UpdateProductInput,
} from "./api";

const QK = ["merchant", "products"];

export function useMerchantProducts(params?: { page?: number; limit?: number; is_active?: boolean }) {
  return useQuery({
    queryKey: [...QK, params],
    queryFn: () => getMerchantProducts(params),
    select: (res) => res,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProductInput) => createProduct(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductInput }) => updateProduct(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK }),
  });
}

export function useDeactivateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deactivateProduct(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK }),
  });
}
