"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { tokenStorage } from "@/lib/token";
import { ROUTES } from "@/lib/constants";

function GoogleCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      router.replace(`${ROUTES.LOGIN}?error=${error}`);
      return;
    }

    const accessToken = searchParams.get("access_token");
    const refreshToken = searchParams.get("refresh_token");

    if (!accessToken || !refreshToken) {
      router.replace(`${ROUTES.LOGIN}?error=google_login_failed`);
      return;
    }

    tokenStorage.setTokens(accessToken, refreshToken);
    // Hard navigation so AuthProvider re-runs and hydrates user from the new tokens
    window.location.href = ROUTES.HOME;
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-stitch-primary" />
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-stitch-primary" />
        </div>
      }
    >
      <GoogleCallbackHandler />
    </Suspense>
  );
}
