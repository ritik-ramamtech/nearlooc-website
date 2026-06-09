"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { ROUTES } from "@/lib/constants";
import { login, register, logout } from "./api";
import type { LoginInput, RegisterInput } from "./types";

export function useLogin() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (data: LoginInput) => login(data),
    onSuccess: (res) => {
      const { user, tokens } = res.data;
      const merchantId = user.merchant_id ?? null;
      setAuth(user, merchantId, tokens.access_token, tokens.refresh_token);
      router.push(merchantId ? ROUTES.DASHBOARD : ROUTES.HOME);
    },
  });
}

export function useRegister() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (data: RegisterInput) => register(data),
    onSuccess: (res) => {
      const { user, tokens } = res.data;
      setAuth(user, null, tokens.access_token, tokens.refresh_token);
      router.push(ROUTES.HOME);
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      clearAuth();
      router.push(ROUTES.LOGIN);
    },
  });
}
