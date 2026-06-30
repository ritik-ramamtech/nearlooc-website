"use client";

import { Sparkles } from "lucide-react";
import { OfferCard } from "@/features/home/components/OfferCard";
import { OfferCardSkeleton } from "@/features/home/components/OfferCardSkeleton";
import type { AiSearchResponse } from "../types";

interface Props {
  query: string;
  data: AiSearchResponse | undefined;
  isPending: boolean;
  isError: boolean;
  onRetry?: () => void;
}

export function AiSearchResults({ query, data, isPending, isError, onRetry }: Props) {
  if (isPending) {
    return (
      <div className="px-4 py-8">
        <div className="mb-5 flex items-center gap-2 rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3">
          <Sparkles className="h-4 w-4 shrink-0 animate-pulse text-violet-500" />
          <span className="text-sm text-violet-700">AI is finding the best deals for you...</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <OfferCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="px-4 py-16 text-center">
        <Sparkles className="mx-auto mb-3 h-6 w-6 text-gray-300" />
        <p className="text-sm font-medium text-gray-700">Something went wrong</p>
        <p className="mt-1 text-xs text-gray-400">Please try again in a moment.</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 rounded-full bg-violet-600 px-5 py-2 text-xs font-medium text-white hover:bg-violet-700 active:scale-95 transition-transform"
          >
            Try again
          </button>
        )}
      </div>
    );
  }

  if (!data) return null;

  const { intent_summary, response_message, offers } = data;

  return (
    <div className="px-4 py-6">
      {/* AI natural language response */}
      <div className="mb-6 flex items-start gap-3 rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3.5">
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-600">
          <Sparkles className="h-3.5 w-3.5 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-violet-900">{intent_summary}</p>
          <p className="mt-0.5 text-sm text-violet-700">{response_message}</p>
        </div>
      </div>

      {offers.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-sm text-gray-500">No deals found for &ldquo;{query}&rdquo;</p>
          <p className="mt-1 text-xs text-gray-400">Try different keywords or browse our categories.</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {offers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      )}
    </div>
  );
}
