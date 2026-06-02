"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createReview, getReviewsByOffer, getMyReviews, type CreateReviewInput } from "./api";

export function useReviewsByOffer(offerId: string, page = 1) {
  return useQuery({
    queryKey: ["reviews", "offer", offerId, page],
    queryFn: () => getReviewsByOffer(offerId, page),
    select: (res) => res.data,
    enabled: !!offerId,
  });
}

export function useMyReviews(page = 1) {
  return useQuery({
    queryKey: ["reviews", "me", page],
    queryFn: () => getMyReviews(page),
    select: (res) => res.data,
  });
}

export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateReviewInput) => createReview(data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ["reviews", "offer", variables.offer_id] });
      qc.invalidateQueries({ queryKey: ["reviews", "me"] });
      qc.invalidateQueries({ queryKey: ["offers", "detail", variables.offer_id] });
    },
  });
}
