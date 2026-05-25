export interface Offer {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  images: string[] | null;
  category_id: string;
  subcategory_id: string | null;
  category_name: string | null;
  merchant_id: string | null;
  merchant_name: string | null;
  merchant_logo_url: string | null;
  original_price: number;
  discounted_price: number;
  discount_percentage: number;
  rating: number;
  review_count: number;
  badge: string | null;
  promo_price: number | null;
  promo_end_at: string | null;
  promo_time_left: string | null;
  duration: string | null;
  features: string[] | null;
  highlights: string[] | null;
  terms: string[] | null;
  share_url: string | null;
  latitude: number | null;
  longitude: number | null;
  is_favorite?: boolean;
}

export interface OfferSection {
  type: string;
  title: string;
  parent_category: string;
  offers: Offer[];
}

export interface HomeFeed {
  categories: Category[];
  sections: OfferSection[];
}

export interface Category {
  id: string;
  name: string;
  image_url: string | null;
}

export interface Subcategory {
  id: string;
  name: string;
  icon_key: string | null;
  category_id: string;
}
