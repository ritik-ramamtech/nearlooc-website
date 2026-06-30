import type { Offer } from "@/types";

export interface AiSearchRequest {
  query: string;
  latitude?: number;
  longitude?: number;
}

export interface AiSearchResponse {
  intent_summary: string;
  response_message: string;
  offers: Offer[];
  total: number;
}
