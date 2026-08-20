import apiClient from "@/lib/api-client";
import type { ApiResponse, Review } from "@/types";

export interface CreateReviewInput {
  offer_id: string;
  rating: number;
  comment?: string;
}

export interface RatingDistribution {
  "1": number;
  "2": number;
  "3": number;
  "4": number;
  "5": number;
}

export interface RatingSummary {
  total_reviews: number;
  avg_rating: number;
  distribution: RatingDistribution
}

export interface ReviewsListResponse {
  summary: RatingSummary
  items: Review[];
  meta: { page: number; limit: number; total: number; has_more: boolean };
}

interface ReviewsApiData {
  summary: {
    total_reviews: number;
    avg_rating: number;
    distribution: {}
  }
  data?: Review[];
  items?: Review[];
  meta?: ReviewsListResponse["meta"];
}

interface ReviewsApiResponse {
  success: boolean;
  message: string;
  summary: RatingSummary
  data: Review[] | ReviewsApiData;
  meta?: ReviewsListResponse["meta"];
}

function normalizeReviewsResponse(res: ReviewsApiResponse): ApiResponse<ReviewsListResponse> {
  const nested = Array.isArray(res.data) ? null : res.data;
  const summary = res.summary;
  const items = Array.isArray(res.data)
    ? res.data
    : nested?.items ?? nested?.data ?? [];
  const meta =
    res.meta ??
    nested?.meta ?? {
      page: 1,
      limit: items.length,
      total: items.length,
      has_more: false,
    };

  return {
    success: res.success,
    message: res.message,
    data: { items, meta, summary },
  };
}

export async function createReview(data: CreateReviewInput): Promise<ApiResponse<Review>> {
  const res = await apiClient.post<ApiResponse<Review>>("/reviews", data);
  return res.data;
}

export async function getReviewsByOffer(offerId: string, page = 1, limit = 20): Promise<ApiResponse<ReviewsListResponse>> {
  const res = await apiClient.get<ReviewsApiResponse>(
    `/reviews/offer/${offerId}`,
    { params: { page, limit } }
  );
  return normalizeReviewsResponse(res.data);
}

export async function getMyReviews(page = 1, limit = 20): Promise<ApiResponse<ReviewsListResponse>> {
  const res = await apiClient.get<ReviewsApiResponse>("/reviews/me", {
    params: { page, limit },
  });
  return normalizeReviewsResponse(res.data);
}
