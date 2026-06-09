"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

function shouldRetry(failureCount: number, error: unknown): boolean {
  // Never retry on 4xx — the request was wrong, retrying won't help
  const status = (error as { response?: { status?: number } })?.response?.status;
  if (status !== undefined && status >= 400 && status < 500) return false;
  return failureCount < 1;
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60,
            retry: shouldRetry,
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
