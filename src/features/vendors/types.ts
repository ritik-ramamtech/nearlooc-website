export interface VendorLocation {
  id: string;
  label: string | null;
  street: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  latitude: number | null;
  longitude: number | null;
  is_primary: boolean;
}

export interface Vendor {
  id: string;
  business_name: string;
  bio: string | null;
  logo_url: string | null;
  stores_imgs_url: string[];
  phone: string | null;
  website: string | null;
  category_id: string | null;
  category_name: string | null;
  subcategory_id: string | null;
  subcategory_name: string | null;
  rating: number;
  review_count: number;
  is_verified: boolean;
  product_count: number;
  created_at: string;
  locations: VendorLocation[];
}

// Subset returned by GET /vendors/:id/products
export interface VendorSummary {
  id: string;
  business_name: string;
  logo_url: string | null;
  stores_imgs_url: string[];
  rating: number;
  review_count: number;
  is_verified: boolean;
}

export interface ActiveOffer {
  id: string;
  discounted_price: number;
  discount_percentage: number;
  badge: string | null;
  promo_price: number | null;
  promo_time_left: string | null;
  promo_end_at: string | null;
  rating: number;
  review_count: number;
}

export interface VendorProduct {
  id: string;
  name: string;
  title: string | null;
  description: string | null;
  image_url: string | null;
  images: string[];
  base_price: number;
  category_id: string | null;
  category_name: string | null;
  subcategory_id: string | null;
  subcategory_name: string | null;
  has_active_offer: boolean;
  active_offer: ActiveOffer | null;
  locations: VendorLocation[];
}

export interface GetVendorsQuery {
  page?: number;
  limit?: number;
  search?: string;
  category_id?: string;
  subcategory_id?: string;
  is_verified?: boolean;
}

export interface GetVendorProductsQuery {
  page?: number;
  limit?: number;
  category_id?: string;
  subcategory_id?: string;
}
