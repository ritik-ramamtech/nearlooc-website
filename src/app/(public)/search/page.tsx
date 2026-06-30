"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAiSearch } from "@/features/ai-search/hooks";
import { AiSearchResults } from "@/features/ai-search/components/AiSearchResults";
import type { AiSearchRequest } from "@/features/ai-search/types";

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";

  const [aiParams, setAiParams] = useState<AiSearchRequest | null>(
    q ? { query: q } : null,
  );

  const resultsLoadedRef = useRef(false);

  useEffect(() => {
    if (!q) return;

    resultsLoadedRef.current = false;
    setAiParams({ query: q });

    if (typeof navigator === "undefined" || !navigator.geolocation) return;

    let cancelled = false;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
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

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-surface">
          <div className="mx-auto max-w-container-max px-4 py-16 text-center text-sm text-gray-400">
            Loading…
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
