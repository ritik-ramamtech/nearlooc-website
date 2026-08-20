import apiClient from "@/lib/api-client";
import type { ApiResponse, AuthData, AuthTokens } from "@/types";
import type { LoginInput, RegisterInput } from "./types";

export async function login(data: LoginInput): Promise<ApiResponse<AuthData>> {
  const res = await apiClient.post<ApiResponse<AuthData>>("/auth/login", data);
  return res.data;
}

export async function register(data: RegisterInput): Promise<ApiResponse<AuthData>> {
  const res = await apiClient.post<ApiResponse<AuthData>>("/auth/register", data);
  return res.data;
}

export async function logout(): Promise<void> {
  await apiClient.post("/auth/logout");
}

export async function refreshTokens(refreshToken: string): Promise<ApiResponse<AuthTokens>> {
  const res = await apiClient.post<ApiResponse<AuthTokens>>("/auth/refresh", {
    refresh_token: refreshToken,
  });
  return res.data;
}

export async function forgotPassword(email: string) {
  await apiClient.post("/auth/forgot-password", {
    email
  });
}

export async function verifyOtp(otp: string, email: string) {
  await apiClient.post("/auth/verify-otp", {
    email, otp
  });
}

export async function resetPassword(email: string, otp: string, new_password: string, confirm_password: string) {
  await apiClient.post("/auth/reset-password", {
    email, otp, new_password, confirm_password
  });
}

export async function verifyEmail(email: string, otp: string): Promise<ApiResponse<AuthData>> {
  const res = await apiClient.post<ApiResponse<AuthData>>("/auth/verify-email", {
    email, otp
  });
  return res.data;
}

export async function resendVerification(email: string) {
  const res = await apiClient.post("/auth/resend-verification", {
    email
  });
}
