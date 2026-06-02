"use client";

import { useQuery } from "@tanstack/react-query";
import { getMerchantOverview } from "./api";

export function useMerchantOverview() {
  return useQuery({
    queryKey: ["merchant", "overview"],
    queryFn: getMerchantOverview,
    select: (res) => res.data,
    staleTime: 60_000,
  });
}
