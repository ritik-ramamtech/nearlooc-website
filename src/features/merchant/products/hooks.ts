"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMerchantProducts,
  createProduct,
  updateProduct,
  deactivateProduct,
  type CreateProductInput,
  type UpdateProductInput,
  getProduct,
  deactivateProductAtLocation,
} from "./api";

const QK = ["merchant", "products"];

export function useMerchantProducts(params?: {
  page?: number;
  limit?: number;
  is_active?: boolean;
  category_id?: string;
  subcategory_id?: string;
}) {
  return useQuery({
    queryKey: [...QK, params],
    queryFn: () => getMerchantProducts(params),
    select: (res) => res,
  });
}

export function useMerchantProduct(id: string) {
  return useQuery({
    queryKey: [...QK, id],
    queryFn: () => getProduct(id),
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
    mutationFn: ({ id, data }: { id: string; data: UpdateProductInput }) =>
      updateProduct(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: [...QK, id] });
      qc.invalidateQueries({ queryKey: QK });
    },
  });
}

export function useDeactivateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deactivateProduct(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK }),
  });
}

export function useDeactivateProductAtLocation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({id, locationId, is_active}: {id: string, locationId: string, is_active: boolean}) => deactivateProductAtLocation(id, locationId, is_active),
    onSuccess: (_, { id }) => qc.invalidateQueries({ queryKey: [...QK, id]})
  })
}