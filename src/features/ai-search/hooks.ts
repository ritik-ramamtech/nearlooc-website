import { useQuery } from "@tanstack/react-query";
import { aiSearch } from "./api";
import type { AiSearchRequest } from "./types";

export function useAiSearch(params: AiSearchRequest | null) {
  return useQuery({
    queryKey: ["ai-search", params?.query, params?.latitude, params?.longitude],
    queryFn: () => aiSearch(params!),
    enabled: !!params?.query,
    staleTime: 60_000,
  });
}
