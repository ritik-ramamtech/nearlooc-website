"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllVendors, getVendorProducts } from "./api";
import type { GetVendorsQuery, GetVendorProductsQuery } from "./types";

export function useVendors(query?: GetVendorsQuery) {
  return useQuery({
    queryKey: ["vendors", "list", query],
    queryFn: () => getAllVendors(query),
    select: (res) => res.data,
  });
}

export function useVendorProducts(id: string, query?: GetVendorProductsQuery) {
  return useQuery({
    queryKey: ["vendors", "products", id, query],
    queryFn: () => getVendorProducts(id, query),
    select: (res) => res.data,
    enabled: !!id,
  });
}
