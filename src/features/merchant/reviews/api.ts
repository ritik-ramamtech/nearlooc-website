import apiClient from "@/lib/api-client";

export interface MerchantReview {
  id: string;
  rating: number;
  comment: string | null;
  reviewer: { id: string; name: string; avatar_url: string | null };
  product: {
    id: string;
    name: string;
    image_url: string | null;
    images: string[];
  };
  offer: { id: string; title: string; discounted_price: number } | null;
  created_at: string;
}

export interface RatingDistribution {
  "1": number;
  "2": number;
  "3": number;
  "4": number;
  "5": number;
}

interface ReviewsResponse {
  message: string;
  summary: {
    total_reviews: number;
    avg_rating: number;
    rating_distribution: RatingDistribution;
    rating_trend: {
      historicalRating: number;
      currentRating: number;
      direction: string;
      difference: number;
    };
  };
  data: MerchantReview[];
  meta: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_more: boolean;
  };
}

export interface GetMerchantReviewsParams {
  page?: number;
  limit?: number;
  product_id?: string;
  offer_id?: string;
  min_rating?: number;
  max_rating?: number;
  sort?: string;
  has_comment?: boolean;
}

export async function getMerchantReviews(
  params?: GetMerchantReviewsParams,
): Promise<ReviewsResponse> {
  const res = await apiClient.get<ReviewsResponse>("/merchant/reviews", {
    params,
  });
  return res.data;
}
