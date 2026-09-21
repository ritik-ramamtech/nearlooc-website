import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROUTES } from "@/lib/constants";

const CONSUMER_ROUTES = [ROUTES.FAVORITES, ROUTES.NOTIFICATIONS, ROUTES.COUPONS, ROUTES.PROFILE, ROUTES.MY_REVIEWS];
const MERCHANT_ROUTES = [ROUTES.DASHBOARD, ROUTES.PRODUCTS, ROUTES.LOCATIONS, ROUTES.REVIEWS, ROUTES.SETTINGS, ROUTES.HELP];
const AUTH_ROUTES = [ROUTES.LOGIN, ROUTES.REGISTER, ROUTES.VERIFY_EMAIL];

function isSiteAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Basic ")) return false;

  const [user, pass] = atob(authHeader.slice("Basic ".length)).split(":");
  return user === process.env.SITE_AUTH_USER && pass === process.env.SITE_AUTH_PASSWORD;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isSiteAuthorized(request)) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Nearlooc"' },
    });
  }

  const isAuthenticated = request.cookies.has("nearlooc_auth");

  // Redirect logged-in users away from auth pages
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL(ROUTES.HOME, request.url));
    }
    return NextResponse.next();
  }

  // Protect consumer routes
  if (CONSUMER_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const loginUrl = new URL(ROUTES.LOGIN, request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Protect merchant routes — require auth AND merchant role
  if (MERCHANT_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!isAuthenticated) {
      const loginUrl = new URL(ROUTES.LOGIN, request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    const isMerchant = request.cookies.has("nearlooc_merchant");
    if (!isMerchant) {
      return NextResponse.redirect(new URL(ROUTES.HOME, request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
