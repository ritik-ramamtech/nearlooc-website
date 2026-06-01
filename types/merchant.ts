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
  image_url: string | null;
  images: string[];
  base_price: number;
  category_id: string | null;
  subcategory_id: string | null;
  category_name: string | null;
  subcategory_name: string | null;
  is_active: boolean;
  created_at: string;
  locations?: { id: string; label: string; city: string }[];
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
}
