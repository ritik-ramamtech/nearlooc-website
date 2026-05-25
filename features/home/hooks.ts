"use client";

import { useQuery } from "@tanstack/react-query";
import { getHomeFeed, type HomeFeedQuery } from "./api";

export function useHomeFeed(query?: HomeFeedQuery) {
  return useQuery({
    queryKey: ["home", "feed", query],
    queryFn: () => getHomeFeed(query),
    select: (res) => res.data,
  });
}
