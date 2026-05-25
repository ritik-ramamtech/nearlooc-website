export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string | null;
  is_read: boolean;
  created_at: string;
}

export interface Coupon {
  id: string;
  title: string;
  code: string;
  description: string | null;
  expires_at: string | null;
  is_active: boolean;
}

export interface Favorite {
  id: string;
  user_id: string;
  offer_id: string;
  created_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  offer_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user?: {
    name: string;
    avatar_url: string | null;
  };
}

export interface Address {
  id: string;
  label: string;
  address: string;
  latitude: number;
  longitude: number;
}

export interface LocationSearchResult {
  place_id: string;
  display_name: string;
  latitude: number;
  longitude: number;
}
