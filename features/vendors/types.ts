export interface Vendor {
  id: string;
  name: string;
  logo_url: string | null;
  cover_url: string | null;
  description: string | null;
  category_id: string | null;
  category_name: string | null;
  is_verified: boolean;
  rating: number;
  review_count: number;
  product_count: number;
  location: string | null;
}

export interface VendorProduct {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  price: number;
  category_id: string | null;
  category_name: string | null;
  subcategory_id: string | null;
  is_active: boolean;
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
