import apiClient from "@/lib/api-client";
import type { ApiResponse, HomeFeed } from "@/types";

export interface HomeFeedQuery {
  category_id?: string;
  latitude?: number;
  longitude?: number;
  page?: number;
  limit?: number;
}

export async function getHomeFeed(query?: HomeFeedQuery): Promise<ApiResponse<HomeFeed>> {
  const res = await apiClient.get<ApiResponse<HomeFeed>>("/home/feed", { params: query });
  return res.data;
}
