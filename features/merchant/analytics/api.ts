import apiClient from "@/lib/api-client";

export interface MerchantOverviewData {
  products: { total: number; active: number; inactive: number };
  offers: { total: number; active: number; inactive: number };
  reviews: {
    total: number;
    avg_rating: number;
    distribution: Record<1 | 2 | 3 | 4 | 5, number>;
  };
  locations: { total: number };
  recent_reviews: {
    id: string;
    rating: number;
    comment: string | null;
    reviewer: { id: string; name: string; avatar_url: string | null };
    product: { id: string; name: string };
    offer: { id: string; title: string } | null;
    created_at: string;
  }[];
  top_offers: {
    id: string;
    title: string;
    discounted_price: number;
    discount_percentage: number;
    rating: number;
    review_count: number;
    badge: string | null;
    product: { id: string; name: string };
  }[];
}

interface OverviewResponse {
  message: string;
  data: MerchantOverviewData;
}

export async function getMerchantOverview(): Promise<OverviewResponse> {
  const res = await apiClient.get<OverviewResponse>("/merchant/overview");
  return res.data;
}
