import apiClient from "@/lib/api-client";
import type { ApiResponse } from "@/types";
import type { Category } from "@/types";

export async function getCategories(): Promise<ApiResponse<Category[]>> {
  const res = await apiClient.get<ApiResponse<Category[]>>("/categories");
  return res.data;
}
