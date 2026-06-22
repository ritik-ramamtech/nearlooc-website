const ACCESS_TOKEN_KEY = "nearlooc_access_token";
const REFRESH_TOKEN_KEY = "nearlooc_refresh_token";

function isBrowser(): boolean {
  try {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
  } catch {
    return false;
  }
}

function safeGet(key: string): string | null {
  try {
    return isBrowser() ? window.localStorage.getItem(key) : null;
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): void {
  try {
    if (isBrowser()) window.localStorage.setItem(key, value);
  } catch { /* noop */ }
}

function safeRemove(key: string): void {
  try {
    if (isBrowser()) window.localStorage.removeItem(key);
  } catch { /* noop */ }
}

export const tokenStorage = {
  getAccessToken: () => safeGet(ACCESS_TOKEN_KEY),
  getRefreshToken: () => safeGet(REFRESH_TOKEN_KEY),

  setTokens: (accessToken: string, refreshToken: string) => {
    safeSet(ACCESS_TOKEN_KEY, accessToken);
    safeSet(REFRESH_TOKEN_KEY, refreshToken);
    if (isBrowser()) {
      document.cookie = `nearlooc_auth=1; path=/; max-age=604800; SameSite=Lax`;
    }
  },

  setMerchantCookie: (isMerchant: boolean) => {
    if (isBrowser()) {
      if (isMerchant) {
        document.cookie = `nearlooc_merchant=1; path=/; max-age=604800; SameSite=Lax`;
      } else {
        document.cookie = "nearlooc_merchant=; path=/; max-age=0";
      }
    }
  },

  clearTokens: () => {
    safeRemove(ACCESS_TOKEN_KEY);
    safeRemove(REFRESH_TOKEN_KEY);
    if (isBrowser()) {
      document.cookie = "nearlooc_auth=; path=/; max-age=0";
      document.cookie = "nearlooc_merchant=; path=/; max-age=0";
    }
  },
};
