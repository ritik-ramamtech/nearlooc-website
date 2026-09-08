export interface MerchantProfileData {
  id: string;
  business_name: string;
  bio: string | null;
  logo_url: string | null;
  stores_imgs_url: string[];
  phone: string | null;
  website: string | null;
  category_id: string | null;
  subcategory_id: string | null;
  rating: number;
  review_count: number;
  is_verified: boolean;
  is_active: boolean;
  merchant_id: string;
  owner: {
    id: string;
    name: string;
    email: string;
    avatar_url: string | null;
    role: string;
  };
  locations: MerchantLocationData[];
  created_at: string;
  updated_at: string;
}

export interface MerchantLocationData {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  latitude: number | null;
  longitude: number | null;
  is_primary: boolean;
}

export interface SaveProfileInput {
  business_name?: string;
  bio?: string;
  logo_url?: string;
  phone?: string;
  website?: string;
  category_id?: string;
  subcategory_id?: string;
}

export interface MerchantOverview {
  total_products: number;
  active_products: number;
  inactive_products: number;
  active_offers: number;
  expiring_soon_offers: number;
  average_rating: number;
  total_reviews: number;
  total_locations: number;
}

export interface Product {
  id: string;
  merchant_id: string;
  name: string;
  title: string | null;
  description: string | null;
  highlights: string[] | null;
  image_url: string | null;
  images: string[];
  base_price: number;
  category_id: string | null;
  subcategory_id: string | null;
  category_name: string | null;
  subcategory_name: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  locations?: { id: string; label: string; city: string, is_active: boolean, street: string }[];
}

export type ActivityType =
  | "offer_created"
  | "offer_ended"
  | "product_updated"
  | "product_created"
  | "location_added"
  | "offer_deactivated"

export interface ProductActivity {
  type: ActivityType;
  date: string;
}

export interface ProductSummaryStats {
  total_favorite_count: number;
  active_offers_count: number;
  inactive_offers_count: number;
  location_count: number;
}

export interface MerchantSale {
  id: string;
  product_id: string;
  discounted_price: number;
  discount_percentage: number;
  badge: string | null;
  promo_price: number | null;
  promo_time_left: number | null;
  promo_end_at: string | null;
  rating: number;
  review_count: number;
  is_active: boolean;
  created_at: string;
  product: {
    id: string;
    name: string;
    image_url: string | null;
    base_price: number;
  };
  image_url: string;
}

export interface RatingDistribution {
  "1": number;
  "2": number;
  "3": number;
  "4": number;
  "5": number;
}


export interface ProductSummaryResponse {
  message: string;
  product: ProductSummary;
  active_offers: ProductSummaryOffer[];
  history_offers: ProductSummaryOffer[];
}

export interface ProductSummary {
  id: string;
  merchant_id: string;
  name: string;
  title: string;
  description: string | null;
  highlights: string[];
  image_url: string | null;
  images: string[];
  base_price: number;
  category_id: string | null;
  subcategory_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category: {
    id: string;
    name: string;
  }
  subcategory: {
    id: string;
    name: string;
  }
}

export interface ProductSummaryOffer {
  id: string;
  discounted_price: number;
  discount_percentage: number;
  badge: string | null;
  promo_price: number | null;
  promo_end_at: string | null;
  duration: string | null;
  features: string[];
  terms: string[];
  is_active: boolean;
  created_at: string;
  location: {
    id: string;
    label: string;
    street: string;
    city: string;
    state: string;
    postal_code: string;
    is_primary: boolean;
    is_active: boolean;
  };
  rating: number;
  review_count: number;
}

export interface MerchantOfferDetailResponse {
  message: string;
  data: MerchantOfferDetail;
}

export interface MerchantOfferDetail {
  id: string;
  product_id: string;

  discounted_price: number;
  promo_price: number | null;
  discount_percentage: number;

  badge: string | null;
  is_active: boolean;

  promo_end_at: string | null;
  promo_time_left: number | null;
  duration: string | null;

  features: string[];
  terms: string[];

  rating: number;
  review_count: number;
  favorite_count: number;

  location: {
    id: string;
    label: string;
    street: string;
    city: string;
    state: string;
  };

  product: {
    title: string;
    name: string;
    image_url: string | null;
    images: string[];
    description: string | null;
    highlights: string[];
    base_price: number;
  };

  category_id: string;
  category_name: string;

  subcategory_id: string;
  subcategory_name: string;

  created_at: string;
  updated_at: string;
}
