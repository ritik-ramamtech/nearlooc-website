import apiClient from "@/lib/api-client";
import type { Product } from "@/types/merchant";

interface ApiResponse<T> { message: string; data: T }
interface PaginatedResponse<T> { data: T[]; meta: { total: number; page: number; limit: number; total_pages: number } }

export interface CreateProductInput {
  name: string;
  title?: string;
  description?: string;
  highlights?: string[];
  image_url?: string;
  images?: string[];
  base_price: number;
  category_id?: string;
  subcategory_id?: string;
  location_ids?: string[];
}

export type UpdateProductInput = Partial<CreateProductInput> & { is_active?: boolean };

export async function getMerchantProducts(params?: {
  page?: number; limit?: number; is_active?: boolean;
}): Promise<PaginatedResponse<Product>> {
  const res = await apiClient.get<ApiResponse<PaginatedResponse<Product>>>("/merchant/products", { params });
  return res.data.data;
}

export async function createProduct(data: CreateProductInput): Promise<ApiResponse<Product>> {
  const res = await apiClient.post<ApiResponse<Product>>("/merchant/products", data);
  return res.data;
}

export async function updateProduct(id: string, data: UpdateProductInput): Promise<ApiResponse<Product>> {
  const res = await apiClient.patch<ApiResponse<Product>>(`/merchant/products/${id}`, data);
  return res.data;
}

export async function deactivateProduct(id: string): Promise<ApiResponse<Product>> {
  const res = await apiClient.delete<ApiResponse<Product>>(`/merchant/products/${id}`);
  return res.data;
}

export async function uploadProductImage(productId: string, file: File): Promise<{ success: boolean; url: string }> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await apiClient.post<{ success: boolean; url: string }>(
    `/upload/merchant/product/${productId}`,
    fd,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return res.data;
}
