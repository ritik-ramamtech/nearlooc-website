import { create } from "zustand";
import type { User } from "@/types";
import { tokenStorage } from "@/lib/token";

interface AuthState {
  user: User | null;
  merchant_id: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, merchant_id: string | null, accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  merchant_id: null,
  isAuthenticated: false,

  setAuth: (user, merchant_id, accessToken, refreshToken) => {
    tokenStorage.setTokens(accessToken, refreshToken);
    set({ user, merchant_id, isAuthenticated: true });
  },

  clearAuth: () => {
    tokenStorage.clearTokens();
    set({ user: null, merchant_id: null, isAuthenticated: false });
  },
}));
