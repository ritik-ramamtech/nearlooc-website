"use client";

import { useQuery } from "@tanstack/react-query";
import { getMerchantReviews, type GetMerchantReviewsParams } from "./api";

export function useMerchantReviews(params?: GetMerchantReviewsParams) {
  return useQuery({
    queryKey: ["merchant", "reviews", params],
    queryFn: () => getMerchantReviews(params),
    staleTime: 30_000,
  });
}
