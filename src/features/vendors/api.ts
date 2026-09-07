import apiClient from "@/lib/api-client";
import type { PaginationMeta } from "@/types/api";
import type {
  Vendor,
  VendorSummary,
  VendorProduct,
  GetVendorsQuery,
  GetVendorProductsQuery,
  VendorLocation,
} from "./types";
import { RatingDistribution, Review } from "@/types";

export interface VendorDetails extends Omit<Vendor, 'product_count' | 'locations'> {
  primaryLocation: VendorLocation[];
  active_offer_count: number;
}

export interface VendorDetailsRawResponse {
  success: boolean;
  message: string;
  data: VendorDetails
}

// GET /vendors — standard ApiResponse shape
export interface VendorsRawResponse {
  message: string;
  data: Vendor[];
  meta: PaginationMeta;
}

// GET /vendors/:id/products — non-standard: vendor + meta are siblings of data
export interface VendorProductsRawResponse {
  success: boolean;
  message: string;
  vendor: VendorSummary;
  data: VendorProduct[];
  meta: PaginationMeta;
}

// Normalised shape consumed by components
export interface VendorProductsNormalised {
  vendor: VendorSummary;
  products: VendorProduct[];
  meta: PaginationMeta;
}

export interface VendorReview {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  reviewer: {
    id: string;
    name: string;
    avatar_url: string | null;
  };
  product: {
    id: string;
    name: string;
    image_url: string | null;
  };
  offer_id: string;
}

export interface VendorReviewsResponse {
  data: VendorReview[];
  summary: {
    total_reviews: number;
    avg_rating: number;
    rating_distribution: RatingDistribution;
  };
  meta: PaginationMeta;
}

function normalizeVendorReview(review: VendorReview): Review {
  return {
    id: review.id,
    user_id: review.reviewer.id,
    product_id: review.product.id,
    offer_id: review.offer_id,
    rating: review.rating,
    comment: review.comment,
    created_at: review.created_at,

    user: {
      name: review.reviewer.name,
      avatar_url: review.reviewer.avatar_url,
    },

    offer: {
      id: review.offer_id,
      title: "",
    },

    product: {
      id: review.product.id,
      name: review.product.name,
      image_url: review.product.image_url ?? "",
    },
  };
}

export async function getAllVendors(
  query?: GetVendorsQuery,
): Promise<VendorsRawResponse> {
  const res = await apiClient.get<VendorsRawResponse>("/vendors", {
    params: query,
  });
  return res.data;
}

export async function getVendorById(id: string): Promise<VendorDetails | null> {
  // No dedicated GET /vendors/:id endpoint — fetch list with high limit and find by ID
  const res = await apiClient.get<VendorDetailsRawResponse>(`/vendors/${id}`);

  return res.data.data;
}

export async function getVendorProducts(
  id: string,
  query?: GetVendorProductsQuery,
): Promise<VendorProductsRawResponse> {
  const res = await apiClient.get<VendorProductsRawResponse>(
    `/vendors/${id}/products`,
    { params: query },
  );
  return res.data;
}

export async function getVendorReviews(id: string, page = 1, limit = 20) {
  const res = await apiClient.get<VendorReviewsResponse>(
    `/vendors/${id}/reviews`,
    { params: { page, limit } },
  );

  return { ...res.data, data: res.data.data.map(normalizeVendorReview) };
}
