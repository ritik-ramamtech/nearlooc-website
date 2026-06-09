"use client";

import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { ROUTES } from "@/lib/constants";

interface ErrorFallbackProps {
  error: Error & { digest?: string };
  reset: () => void;
  /** Pass true when rendering inside global-error.tsx (no nav available) */
  global?: boolean;
}

export function ErrorFallback({ error, reset, global: isGlobal }: ErrorFallbackProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 mb-6">
        <AlertTriangle className="h-8 w-8 text-red-500" />
      </div>

      <h1 className="text-headline-sm font-bold text-on-surface">Something went wrong</h1>
      <p className="mt-2 max-w-sm text-body-sm text-on-surface-variant">
        An unexpected error occurred. You can try again or go back to the home page.
      </p>

      {/* Show error message in development only */}
      {process.env.NODE_ENV === "development" && error?.message && (
        <p className="mt-3 max-w-sm rounded-lg bg-red-50 px-4 py-2 font-mono text-xs text-red-600 text-left break-all">
          {error.message}
        </p>
      )}

      <div className="mt-8 flex items-center gap-3">
        <button
          onClick={reset}
          className="flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
        >
          <RotateCcw className="h-4 w-4" />
          Try again
        </button>

        {!isGlobal && (
          <Link
            href={ROUTES.HOME}
            className="flex items-center gap-2 rounded-xl border border-outline-variant px-5 py-2.5 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container"
          >
            <Home className="h-4 w-4" />
            Go home
          </Link>
        )}
      </div>
    </div>
  );
}
