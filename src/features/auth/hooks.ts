"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { ROUTES } from "@/lib/constants";
import { login, register, logout, forgotPassword, verifyOtp, resetPassword, verifyEmail, resendVerification } from "./api";
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

  return useMutation({
    mutationFn: (data: RegisterInput) => register(data),
    onSuccess: (res) => {
      router.push(`${ROUTES.VERIFY_EMAIL}?email=${encodeURIComponent(res.data.user.email)}`);
    },
  });
}

export function useVerifyEmail() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) => verifyEmail(email, otp),
    onSuccess: (res) => {
      const { user, tokens } = res.data;
      const merchantId = user.merchant_id ?? null;
      setAuth(user, merchantId, tokens.access_token, tokens.refresh_token);
      router.push(merchantId ? ROUTES.DASHBOARD : ROUTES.HOME);
    },
  });
}

// no built-in navigation — used for the "resend code" action on the verify-email screen
export function useResendVerification() {
  return useMutation({
    mutationFn: (email: string) => resendVerification(email),
  });
}

export function useLogout() {
  const router = useRouter();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      clearAuth();
      queryClient.clear();
      router.push(ROUTES.LOGIN);
    },
  });
}

// no built-in navigation — also used for the "resend code" action on the verify-otp screen
export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => forgotPassword(email),
  });
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) => verifyOtp(otp, email),
  });
}

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: { email: string; otp: string; new_password: string; confirm_password: string }) =>
      resetPassword(data.email, data.otp, data.new_password, data.confirm_password),
    onSuccess: () => {
      router.push(ROUTES.LOGIN);
    },
  });
}
