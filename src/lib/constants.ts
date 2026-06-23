export const APP_NAME = "Nearlooc";
export const APP_DESCRIPTION = "Discover the best deals and offers near you";
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export const ROUTES = {
  HOME: "/home",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  PRODUCTS: "/products",
  PRODUCTS_NEW: "/products/new",
  LOCATIONS: "/locations",
  REVIEWS: "/reviews",
  SETTINGS: "/settings",
  HELP: "/help",
  FAVORITES: "/favorites",
  NOTIFICATIONS: "/notifications",
  COUPONS: "/coupons",
  PROFILE: "/profile",
  PROFILE_LOCATION: "/profile/location",
  PROFILE_BECOME_MERCHANT: "/profile/become-merchant",
  MY_REVIEWS: "/my-reviews",
} as const;
