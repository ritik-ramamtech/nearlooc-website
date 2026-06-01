"use client";

import { useEffect } from "react";
import { tokenStorage } from "@/lib/token";
import { useAuthStore } from "@/store/auth.store";
import apiClient from "@/lib/api-client";
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

    // Bootstrap user from JWT immediately so the UI isn't blank
    const user: User = {
      id: payload.sub as string,
      name: (payload.name as string) ?? "",
      email: (payload.email as string) ?? "",
      phone: (payload.phone as string) ?? null,
      avatar_url: (payload.avatar_url as string) ?? null,
      member_since: (payload.member_since as string) ?? "",
    };

    const merchantIdFromToken = (payload.merchant_id as string) ?? null;
    setAuth(user, merchantIdFromToken, accessToken, refreshToken);

    // Always fetch /users/me to get the authoritative merchant_id
    // (old JWTs don't contain it; this also handles role upgrades without re-login)
    apiClient
      .get<{ data: { merchant_id: string | null } & User }>("/users/me")
      .then((res) => {
        const me = res.data.data;
        const freshMerchantId = me.merchant_id ?? null;
        if (freshMerchantId !== merchantIdFromToken) {
          setAuth(
            { id: me.id, name: me.name, email: me.email, phone: me.phone ?? null, avatar_url: me.avatar_url ?? null, member_since: me.member_since ?? "" },
            freshMerchantId,
            accessToken,
            refreshToken,
          );
        }
      })
      .catch(() => {
        // Token may be expired — Axios interceptor will refresh; ignore here
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <>{children}</>;
}
