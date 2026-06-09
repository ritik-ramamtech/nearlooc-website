import axios from "axios";
import { tokenStorage } from "./token";
import { ROUTES } from "./constants";

const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000/api/v1";

let parsedUrl: URL;
try {
  parsedUrl = new URL(rawBaseUrl);
} catch {
  throw new Error(
    `[api-client] NEXT_PUBLIC_API_URL is not a valid URL: "${rawBaseUrl}". ` +
    `Check your .env file.`
  );
}

const API_ORIGIN = parsedUrl.origin;
const API_PREFIX = parsedUrl.pathname.replace(/\/$/, "");

const apiClient = axios.create({
  baseURL: API_ORIGIN,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
};

const redirectToLogin = () => {
  if (typeof window !== "undefined") {
    window.location.href = ROUTES.LOGIN;
  }
};

apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.url && !config.url.startsWith(API_PREFIX)) {
    config.url = `${API_PREFIX}${config.url}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return apiClient(original);
        })
        .catch((err) => Promise.reject(err));
    }

    original._retry = true;
    isRefreshing = true;

    const refreshToken = tokenStorage.getRefreshToken();

    if (!refreshToken) {
      tokenStorage.clearTokens();
      redirectToLogin();
      return Promise.reject(error);
    }

    try {
      const { data } = await axios.post(
        `${API_ORIGIN}${API_PREFIX}/auth/refresh`,
        { refresh_token: refreshToken }
      );
      const { access_token, refresh_token } = data.data;
      tokenStorage.setTokens(access_token, refresh_token);
      apiClient.defaults.headers.common.Authorization = `Bearer ${access_token}`;
      processQueue(null, access_token);
      original.headers.Authorization = `Bearer ${access_token}`;
      return apiClient(original);
    } catch (refreshError) {
      processQueue(refreshError, null);
      tokenStorage.clearTokens();
      redirectToLogin();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;
