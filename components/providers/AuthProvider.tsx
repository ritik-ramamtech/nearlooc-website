"use client";

import { useEffect } from "react";
import { tokenStorage } from "@/lib/token";
import { useAuthStore } from "@/store/auth.store";
import type { User } from "@/types";

function decodeJwt(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setAuth, clearAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) return;

    const accessToken = tokenStorage.getAccessToken();
    const refreshToken = tokenStorage.getRefreshToken();

    if (!accessToken || !refreshToken) {
      clearAuth();
      return;
    }

    const payload = decodeJwt(accessToken);
    if (!payload) {
      clearAuth();
      return;
    }

    // Check token expiry
    const exp = payload.exp as number | undefined;
    if (exp && Date.now() / 1000 > exp) {
      // Expired — let the Axios interceptor handle refresh on next request
      // Still mark as authenticated so the nav renders correctly
    }

    const user: User = {
      id: payload.sub as string,
      name: (payload.name as string) ?? "",
      email: (payload.email as string) ?? "",
      phone: (payload.phone as string) ?? null,
      avatar_url: (payload.avatar_url as string) ?? null,
      member_since: (payload.member_since as string) ?? "",
    };

    const merchant_id = (payload.merchant_id as string) ?? null;

    setAuth(user, merchant_id, accessToken, refreshToken);
  }, []);

  return <>{children}</>;
}
