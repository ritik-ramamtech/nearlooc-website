"use client";

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { getAllVendors, getVendorById, getVendorProducts, type VendorProductsNormalised } from "./api";
import type { GetVendorsQuery, GetVendorProductsQuery } from "./types";


export function useVendors(query?: GetVendorsQuery) {
  return useQuery({
    queryKey: ["vendors", "list", query],
    queryFn: () => getAllVendors(query),
    select: (res) => ({
      items: res.data,
      meta: res.meta,
    }),
  });
}

export function useVendorsInfinite(query?: Omit<GetVendorsQuery, "page">) {
  return useInfiniteQuery({
    queryKey: ["vendors", "infinite", query],
    queryFn: ({ pageParam }) => getAllVendors({ ...query, page: pageParam as number }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.has_more ? lastPage.meta.page + 1 : undefined,
    select: (data) => ({
      items: data.pages.flatMap((p) => p.data),
      meta: data.pages[data.pages.length - 1].meta,
    }),
  });
}

export function useVendorById(id: string) {
  return useQuery({
    queryKey: ["vendors", "detail", id],
    queryFn: () => getVendorById(id),
    enabled: !!id,
  });
}

export function useVendorProducts(id: string, query?: GetVendorProductsQuery) {
  return useQuery({
    queryKey: ["vendors", "products", id, query],
    queryFn: () => getVendorProducts(id, query),
    // Backend returns { success, message, vendor, data: [...products], meta }
    // Normalise into { vendor, products, meta } for clean component consumption
    select: (res): VendorProductsNormalised => ({
      vendor: res.vendor,
      products: res.data ?? [],
      meta: res.meta,
    }),
    enabled: !!id,
  });
}
