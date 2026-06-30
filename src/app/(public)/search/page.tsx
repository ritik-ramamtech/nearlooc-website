"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAiSearch } from "@/features/ai-search/hooks";
import { AiSearchResults } from "@/features/ai-search/components/AiSearchResults";
import type { AiSearchRequest } from "@/features/ai-search/types";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";

  // Start search immediately with just the query — don't block on geolocation
  const [aiParams, setAiParams] = useState<AiSearchRequest | null>(
    q ? { query: q } : null,
  );

  // Track whether the first results for this query have already loaded.
  // If geolocation resolves after results are shown, skip the re-fire to avoid
  // jarring result replacement.
  const resultsLoadedRef = useRef(false);

  useEffect(() => {
    if (!q) return;

    // Reset for new query
    resultsLoadedRef.current = false;
    setAiParams({ query: q });

    if (typeof navigator === "undefined" || !navigator.geolocation) return;

    let cancelled = false;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // Only enrich with location if results haven't been shown yet
        if (!cancelled && !resultsLoadedRef.current) {
          setAiParams({
            query: q,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        }
      },
      () => { /* denied — keep query-only params */ },
      { timeout: 4000, maximumAge: 60_000 },
    );

    return () => { cancelled = true; };
  }, [q]);

  const { data, isPending, isError, refetch } = useAiSearch(aiParams);

  // Mark results as loaded so geolocation won't replace them
  useEffect(() => {
    if (data) resultsLoadedRef.current = true;
  }, [data]);

  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-container-max">
        {!q ? (
          <div className="px-4 py-16 text-center text-sm text-gray-400">
            Type something in the search bar above to find deals
          </div>
        ) : (
          <AiSearchResults
            query={q}
            data={data}
            isPending={isPending}
            isError={isError}
            onRetry={refetch}
          />
        )}
      </div>
    </div>
  );
}
