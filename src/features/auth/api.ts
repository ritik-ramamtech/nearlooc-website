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
