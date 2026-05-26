"use client";

import { useQuery } from "@tanstack/react-query";
import { getCategories } from "./api";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    select: (res) => res.data,
    staleTime: 10 * 60 * 1000, // categories change rarely — cache for 10 min
  });
}
