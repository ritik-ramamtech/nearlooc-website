export interface MerchantProfile {
  id: string;
  name: string;
  email: string;
  logo_url: string | null;
  description: string | null;
  phone: string | null;
  website: string | null;
}

export interface MerchantOverview {
  total_products: number;
  active_offers: number;
  total_sales: number;
  average_rating: number;
  total_reviews: number;
  revenue: number;
}

export interface MerchantLocation {
  id: string;
  merchant_id: string;
  address: string;
  city: string;
  state: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
  is_active: boolean;
}

export interface Product {
  id: string;
  merchant_id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  price: number;
  is_active: boolean;
  created_at: string;
}
