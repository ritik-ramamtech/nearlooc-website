"use client";

import { useQuery } from "@tanstack/react-query";
import { getCoupons } from "./api";

export function useCoupons() {
  return useQuery({
    queryKey: ["coupons", "list"],
    queryFn: getCoupons,
    select: (res) => res.data,
  });
}
