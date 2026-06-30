import apiClient from "@/lib/api-client";
import type { AiSearchRequest, AiSearchResponse } from "./types";

interface AiSearchApiResponse {
  success: boolean;
  message: string;
  data: AiSearchResponse;
}

export async function aiSearch(params: AiSearchRequest): Promise<AiSearchResponse> {
  const res = await apiClient.post<AiSearchApiResponse>("/ai-search", params);
  return res.data.data;
}
