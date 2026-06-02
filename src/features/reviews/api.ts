import apiClient from "@/lib/api-client";
import type { ApiResponse, Review } from "@/types";

export interface CreateReviewInput {
  offer_id: string;
  rating: number;
  comment?: string;
}

export interface ReviewsListResponse {
  items: Review[];
  meta: { page: number; limit: number; total: number; has_more: boolean };
}

export async function createReview(data: CreateReviewInput): Promise<ApiResponse<Review>> {
  const res = await apiClient.post<ApiResponse<Review>>("/reviews", data);
  return res.data;
}

export async function getReviewsByOffer(offerId: string, page = 1, limit = 20): Promise<ApiResponse<ReviewsListResponse>> {
  const res = await apiClient.get<ApiResponse<ReviewsListResponse>>(
    `/reviews/offer/${offerId}`,
    { params: { page, limit } }
  );
  return res.data;
}

export async function getMyReviews(page = 1, limit = 20): Promise<ApiResponse<ReviewsListResponse>> {
  const res = await apiClient.get<ApiResponse<ReviewsListResponse>>("/reviews/me", {
    params: { page, limit },
  });
  return res.data;
}
