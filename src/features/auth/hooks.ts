"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { login, register, logout } from "./api";
import type { LoginInput, RegisterInput } from "./types";

export function useLogin() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (data: LoginInput) => login(data),
    onSuccess: (res) => {
      const { user, tokens } = res.data;
      const merchantId = (user as { merchant_id?: string }).merchant_id ?? null;
      setAuth(user, merchantId, tokens.access_token, tokens.refresh_token);
      router.push(merchantId ? "/dashboard" : "/home");
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
      router.push("/home");
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
      router.push("/login");
    },
  });
}
