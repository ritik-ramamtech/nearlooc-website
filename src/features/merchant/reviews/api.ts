import apiClient from "@/lib/api-client";

export interface MerchantReview {
  id: string;
  rating: number;
  comment: string | null;
  reviewer: { id: string; name: string; avatar_url: string | null };
  product: { id: string; name: string };
  offer: { id: string; title: string; discounted_price: number } | null;
  created_at: string;
}

interface ReviewsResponse {
  message: string;
  summary: { total_reviews: number; avg_rating: number };
  data: MerchantReview[];
  meta: { page: number; limit: number; total: number; total_pages: number; has_more: boolean };
}

export interface GetMerchantReviewsParams {
  page?: number;
  limit?: number;
  product_id?: string;
  offer_id?: string;
  min_rating?: number;
  max_rating?: number;
}

export async function getMerchantReviews(params?: GetMerchantReviewsParams): Promise<ReviewsResponse> {
  const res = await apiClient.get<ReviewsResponse>("/merchant/reviews", { params });
  return res.data;
}
