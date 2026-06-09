"use client";

// Catches errors thrown by the root layout itself.
// Must include its own <html> and <body> since it replaces the entire document.
import { ErrorFallback } from "@/components/ui/error-fallback";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <ErrorFallback error={error} reset={reset} global />
      </body>
    </html>
  );
}
