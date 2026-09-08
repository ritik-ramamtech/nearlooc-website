# Nearlooc Client — CLAUDE.md

> This file is the single source of truth for Claude. Update it every time files are added, removed, or significantly changed.

---

## Project Overview

**Name:** Nearlooc  
**Type:** Location-based deals & offers marketplace — Consumer app + Merchant dashboard  
**Backend:** NestJS + Prisma + PostgreSQL (lives in `../server/`)  
**Stack:** Next.js 15.3.2 (App Router) · TypeScript 5 · Tailwind CSS 3 · shadcn/Radix UI  
**Auth:** JWT (access token + refresh token) via `POST /auth/login` and `POST /auth/refresh`  
**Two user roles:** `consumer` (regular user) and `merchant` (business owner)  
**Font:** Inter (via `next/font/google`)

---

## Backend Base URL

```
http://localhost:3000   (development)
```

All API calls go through `lib/api-client.ts` — never call fetch/axios directly in components or pages.

---

## Architecture — Feature-Based with App Router

### Route Groups

| Group | Path Prefix | Protection |
|---|---|---|
| Public | `(public)/` | None — open to all |
| Auth | `(auth)/` | Redirect to `/home` if already logged in |
| Consumer | `(consumer)/` | Redirect to `/login` if no valid token |
| Merchant | `(merchant)/` | Redirect to `/login` if not merchant role |

Route protection is handled entirely in `middleware.ts` — not in individual pages.

---

## File Structure

```
client/
│
├── app/
│   ├── layout.tsx                          Root layout (Inter font, QueryProvider, AuthProvider)
│   ├── page.tsx                            Redirects to /home
│   ├── globals.css                         Tailwind base + CSS variables + utility classes
│   │
│   ├── (public)/
│   │   ├── home/page.tsx                   GET /home/feed
│   │   ├── vendors/
│   │   │   ├── page.tsx                    GET /vendors
│   │   │   └── [id]/
│   │   │       ├── products/page.tsx       GET /vendors/:id/products
│   │   │       └── photos/page.tsx         Vendor photo gallery [NEW]
│   │   ├── offers/
│   │   │   ├── page.tsx                    General offers search/listing [NEW]
│   │   │   └── [id]/
│   │   │       ├── page.tsx                Offer detail page
│   │   │       ├── loading.tsx             [NEW]
│   │   │       └── create-review/page.tsx  Leave a review for an offer [NEW]
│   │   ├── search/page.tsx                 Search page [NEW]
│   │   └── customer-reviews/[id]/page.tsx  Public customer review detail [NEW]
│   │
│   ├── (auth)/
│   │   ├── login/page.tsx                  POST /auth/login
│   │   ├── register/page.tsx              POST /auth/register
│   │   ├── forgot-password/page.tsx       Request password reset [NEW]
│   │   ├── reset-password/page.tsx        Set new password from reset link [NEW]
│   │   ├── verify-otp/page.tsx            OTP verification step [NEW]
│   │   └── verify-email/page.tsx          Email verification step [NEW]
│   ├── auth/callback/page.tsx              OAuth callback — outside route groups [NEW]
│   │
│   ├── (consumer)/
│   │   ├── layout.tsx                      Consumer shell
│   │   ├── favorites/page.tsx             User favorites list
│   │   ├── notifications/page.tsx         GET /notifications
│   │   ├── coupons/page.tsx               GET /coupons
│   │   ├── my-reviews/page.tsx            Reviews the current user has written [NEW]
│   │   └── profile/
│   │       ├── page.tsx                    GET + PATCH /users/profile
│   │       ├── become-merchant/page.tsx   Consumer → merchant onboarding [NEW]
│   │       └── location/
│   │           ├── page.tsx                PATCH /users/location
│   │           ├── new/page.tsx           Add a new saved location [NEW]
│   │           └── [id]/edit/page.tsx     Edit a saved location [NEW]
│   │
│   └── (merchant)/
│       ├── layout.tsx                      Merchant shell + sidebar navigation
│       ├── dashboard/page.tsx             GET /merchant/overview
│       ├── products/
│       │   ├── page.tsx                    GET /merchant/products
│       │   ├── new/page.tsx               POST /merchant/products
│       │   └── [id]/
│       │       ├── page.tsx                Product detail [NEW]
│       │       ├── edit/page.tsx          PATCH /merchant/products/:id
│       │       └── offers/                 Sales/offers, now nested per-product [REPLACES old sales/* routes]
│       │           ├── new/page.tsx       POST /merchant/sales
│       │           └── [offerId]/
│       │               ├── page.tsx        Offer detail [NEW]
│       │               └── edit/page.tsx  PATCH /merchant/sales/:id
│       ├── locations/page.tsx             GET /merchant/locations
│       ├── reviews/page.tsx               GET /merchant/reviews
│       └── settings/
│           ├── page.tsx                    Merchant settings [NEW]
│           └── profile/page.tsx           GET + PATCH /merchant/profile [MOVED from profile/page.tsx]
│
├── features/                               Domain logic — one folder per backend module
│   ├── auth/
│   │   ├── api.ts                          login, register, refresh, logout
│   │   ├── hooks.ts                        useLogin, useRegister, useLogout
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── ForgotPasswordForm.tsx      [NEW]
│   │   │   ├── ResetPasswordForm.tsx       [NEW]
│   │   │   └── VerifyOtpForm.tsx           [NEW]
│   │   └── types.ts                        AuthUser, Tokens, LoginDto, RegisterDto
│   │
│   ├── ai-search/                          [NEW]
│   │   ├── api.ts
│   │   ├── hooks.ts
│   │   ├── types.ts
│   │   └── components/
│   │       ├── AiSearchBar.tsx
│   │       └── AiSearchResults.tsx
│   │
│   ├── categories/                         [NEW] Category/subcategory data
│   │   ├── api.ts
│   │   ├── hooks.ts
│   │   └── index.ts
│   │
│   ├── home/
│   │   ├── api.ts                          getHomeFeed(query)
│   │   ├── hooks.ts                        useHomeFeed
│   │   └── components/
│   │       ├── CategoryBar.tsx             Horizontal scrollable category pills
│   │       ├── SubcategoryBar.tsx          Subcategory pills for selected category
│   │       ├── OfferSection.tsx            Renders a feed section (top_deals, recommended, etc.)
│   │       ├── OfferCard.tsx               Single offer card with price, badge, promo timer
│   │       ├── OfferCardSkeleton.tsx       [NEW]
│   │       ├── HeroBanner.tsx              [NEW]
│   │       ├── FeaturedVendors.tsx         [NEW]
│   │       ├── OffersMapView.tsx           [NEW]
│   │       ├── FiltersSidebar.tsx          [NEW] Shared price/rating/category filter panel
│   │       ├── MobileFilterModal.tsx       [NEW] Mobile slide-over filter drawer
│   │       ├── PriceRangeFilter.tsx        [NEW]
│   │       ├── CategoryOffersResult.tsx    [NEW] Result grid + "Load more" for category pages
│   │       └── layout/
│   │           └── CategoryOffersLayout.tsx [NEW] Layout for /home/[id] category detail page
│   │
│   ├── offers/
│   │   ├── api.ts                          getOffer, getOffers
│   │   ├── hooks.ts                        useOffer, useOffers
│   │   └── components/
│   │       ├── OfferDetail.tsx
│   │       ├── OfferDetailSkeleton.tsx     [NEW]
│   │       ├── OfferImageGallery.tsx       [NEW]
│   │       ├── OfferAccordion.tsx          [NEW]
│   │       ├── OfferClaimBar.tsx           [NEW]
│   │       ├── OffersView.tsx              [NEW] General /offers search page view
│   │       ├── MerchantRow.tsx             [NEW]
│   │       ├── RelatedOffers.tsx           [NEW]
│   │       ├── PriceBlock.tsx              original / discounted / promo price display
│   │       └── PromoTimer.tsx              countdown for promo_end_at
│   │
│   ├── vendors/
│   │   ├── api.ts                          getAllVendors, getVendorProducts
│   │   ├── hooks.ts                        useVendors, useVendorProducts
│   │   └── components/
│   │       ├── VendorCard.tsx
│   │       ├── VendorCardSkeleton.tsx      [NEW]
│   │       ├── StoreGallery.tsx            [NEW]
│   │       └── VendorProductList.tsx
│   │
│   ├── favorites/
│   │   ├── api.ts                          addFavorite, removeFavorite, getFavorites
│   │   ├── hooks.ts                        useFavorites, useToggleFavorite
│   │   └── components/
│   │       ├── FavoriteButton.tsx          Heart toggle — optimistic update via TanStack Query
│   │       └── FavoriteCard.tsx            [CORRECTED — was documented as FavoritesList.tsx, which doesn't exist]
│   │
│   ├── notifications/
│   │   ├── api.ts                          getNotifications, markRead
│   │   ├── hooks.ts                        useNotifications
│   │   └── components/
│   │       └── NotificationItem.tsx
│   │
│   ├── coupons/
│   │   ├── api.ts                          getCoupons
│   │   ├── hooks.ts                        useCoupons
│   │   └── components/
│   │       └── CouponCard.tsx
│   │
│   ├── reviews/
│   │   ├── api.ts                          createReview, getReviews
│   │   ├── hooks.ts                        useReviews, useCreateReview
│   │   └── components/
│   │       ├── ReviewForm.tsx
│   │       ├── ReviewList.tsx
│   │       ├── ReviewItem.tsx              [NEW]
│   │       ├── ReviewItemSkeleton.tsx      [NEW]
│   │       ├── ReviewsPage.tsx             [NEW] Used by (consumer)/my-reviews
│   │       ├── ReviewSummary.tsx           [NEW]
│   │       └── ReviewSummarySkeleton.tsx   [NEW]
│   │
│   ├── locations/
│   │   ├── api.ts                          searchLocation, reverseGeocode, createAddress
│   │   ├── hooks.ts                        useLocationSearch
│   │   └── components/
│   │       └── LocationPicker.tsx
│   │
│   ├── user/
│   │   ├── api.ts                          getProfile, updateProfile, updateLocation
│   │   ├── hooks.ts                        useProfile, useUpdateProfile
│   │   └── components/
│   │       ├── ProfileForm.tsx
│   │       ├── AvatarUpload.tsx            POST /upload
│   │       ├── LocationForm.tsx            [NEW] Used by profile/location new/edit pages
│   │       └── LocationOnboardingModal.tsx [NEW]
│   │
│   └── merchant/
│       ├── analytics/                      [RENAMED from overview/]
│       │   ├── api.ts                      getMerchantOverview
│       │   ├── hooks.ts                    useOverview
│       │   └── components/
│       │       └── DashboardSkeleton.tsx
│       ├── products/                       Also owns per-product offer/sale forms now
│       │   ├── api.ts                      getProducts, addProduct, editProduct, deleteProduct, toggleAtLocation
│       │   ├── hooks.ts                    useProducts, useAddProduct, useEditProduct
│       │   └── components/
│       │       ├── ProductForm.tsx
│       │       ├── ProductDetailPage.tsx   [NEW]
│       │       ├── ProductDetailSkeleton.tsx [NEW]
│       │       ├── ProductHeader.tsx       [NEW]
│       │       ├── ProductInfoCard.tsx     [NEW]
│       │       ├── ProductGallery.tsx      [NEW]
│       │       ├── ProductStats.tsx        [NEW]
│       │       ├── ProductActivity.tsx     [NEW]
│       │       ├── ProductSummaryCard.tsx  [NEW]
│       │       ├── ProductLocationsCard.tsx [NEW]
│       │       ├── ProductsTab.tsx         [NEW]
│       │       ├── ProductsTabSkeleton.tsx [NEW]
│       │       ├── SalesTab.tsx            [NEW]
│       │       ├── OfferForm.tsx           Create/edit form for a product's offer
│       │       ├── OfferDetails.tsx        [NEW]
│       │       ├── OfferListItem.tsx       [NEW]
│       │       ├── OfferHistoryTable.tsx   [NEW]
│       │       ├── ActiveOffersList.tsx    [NEW]
│       │       ├── InventoryFilters.tsx    [NEW]
│       │       └── ConfirmDialog.tsx       [NEW]
│       ├── sales/                          Offer/sale API + detail view (routes now live under products/[id]/offers/*)
│       │   ├── api.ts                      createOffer, updateOffer, deactivateOffer, getActiveSales, getHistorySales, getAllActiveDeals
│       │   ├── hooks.ts                    useSales, useCreateOffer, useUpdateOffer
│       │   └── components/
│       │       ├── OfferDetail.tsx         [NEW]
│       │       └── OfferDetailSkeleton.tsx [NEW]
│       ├── locations/
│       │   ├── api.ts                      getMerchantLocations, createLocation, updateLocation
│       │   ├── hooks.ts                    useMerchantLocations
│       │   └── components/
│       │       └── LocationPicker.tsx      [CORRECTED — was documented as LocationForm.tsx]
│       ├── reviews/
│       │   ├── api.ts                      getMerchantReviews
│       │   └── hooks.ts                    useMerchantReviews
│       │       [CORRECTED — no components/ dir currently; ReviewsTable.tsx does not exist]
│       └── profile/
│           ├── api.ts                      getMerchantProfile, saveProfile
│           └── hooks.ts                    useMerchantProfile
│               [CORRECTED — no components/ dir currently; MerchantProfileForm.tsx does not exist,
│                form lives in (merchant)/settings/profile/page.tsx directly]
│
├── components/                             Shared global UI only — no domain logic here
│   ├── ui/                                 shadcn/Radix primitives (kept from previous setup)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── input.tsx
│   │   ├── separator.tsx
│   │   ├── tabs.tsx
│   │   ├── avatar.tsx
│   │   ├── skeleton.tsx
│   │   └── pagination.tsx
│   ├── layout/
│   │   ├── MerchantSidebar.tsx            Sidebar nav (Dashboard, Products, Sales, Locations, Reviews, Profile)
│   │   └── TopBar.tsx                      Shared top bar with back button + title
│   ├── form/                               [NEW]
│   │   └── field.tsx                       Shared RHF field wrapper
│   ├── product/                            [NEW]
│   │   └── status-pill.tsx
│   └── providers/                          [NEW]
│       ├── AuthProvider.tsx
│       └── QueryProvider.tsx
│
├── lib/
│   ├── api-client.ts                       Axios instance — base URL, JWT header, auto refresh on 401
│   ├── token.ts                            get/set/clear access_token + refresh_token (localStorage)
│   ├── constants.ts                        [NEW] ROUTES and other app-wide constants
│   ├── location.ts                         [NEW] Location/geocoding helpers
│   └── utils.ts                            cn, formatPrice, formatNumber, truncate (kept from previous)
│
├── store/
│   ├── auth.store.ts                       Zustand — { user, merchant_id, isAuthenticated, setAuth, clearAuth }
│   └── location.store.ts                   [NEW] Zustand — selected/saved location state
│
├── hooks/
│   ├── useUpload.ts                        Shared file upload hook — POST /upload
│   └── useFitCount.ts                      [NEW]
│
├── types/
│   ├── api.ts                              ApiResponse<T> wrapper — { success, message, data }
│   ├── offer.ts                            Offer, OfferSection, HomeFeed
│   ├── user.ts                             User, UserProfile
│   ├── merchant.ts                         Merchant, MerchantProfile, MerchantOverview
│   ├── common.ts                          Category, Subcategory, Notification, Coupon, Review, Favorite
│   └── index.ts                           [NEW] Barrel export
│
├── middleware.ts                           Route protection for (consumer) and (merchant) groups
├── tailwind.config.ts                      MD3 color tokens + typography scale + spacing tokens
├── next.config.ts                          Image remote patterns for CDN
├── postcss.config.js                       tailwindcss + autoprefixer
└── CLAUDE.md                              This file
```

---

## Pages

| Route | Auth | Backend Endpoint |
|---|---|---|
| `/home` | Public (optional auth) | `GET /home/feed` |
| `/vendors` | Public | `GET /vendors` |
| `/vendors/[id]/products` | Public | `GET /vendors/:id/products` |
| `/offers/[id]` | Public | `GET /offers/:id` |
| `/login` | Guest only | `POST /auth/login` |
| `/register` | Guest only | `POST /auth/register` |
| `/favorites` | Consumer | Favorites API |
| `/notifications` | Consumer | `GET /notifications` |
| `/coupons` | Consumer | `GET /coupons` |
| `/profile` | Consumer | `GET + PATCH /users/profile` |
| `/profile/location` | Consumer | `PATCH /users/location` |
| `/dashboard` | Merchant | `GET /merchant/overview` |
| `/products` | Merchant | `GET /merchant/products` |
| `/products/new` | Merchant | `POST /merchant/products` |
| `/products/[id]/edit` | Merchant | `PATCH /merchant/products/:id` |
| `/sales/active` | Merchant | `GET /merchant/sales/active` |
| `/sales/history` | Merchant | `GET /merchant/sales/history` |
| `/sales/deals` | Merchant | `GET /merchant/deals/active` |
| `/sales/new` | Merchant | `POST /merchant/sales` |
| `/locations` | Merchant | Merchant locations API |
| `/reviews` | Merchant | `GET /merchant/reviews` |
| `/merchant/profile` | Merchant | `GET + PATCH /merchant/profile` |

---

## Auth Flow

1. User logs in → backend returns `{ access_token, refresh_token, expires_in }`
2. Tokens stored via `lib/token.ts` in `localStorage`
3. `store/auth.store.ts` hydrates user + merchant_id from token on app load
4. `lib/api-client.ts` attaches `Authorization: Bearer <access_token>` to every request
5. On 401 response → interceptor calls `POST /auth/refresh` → retries original request
6. On refresh failure → `clearAuth()` + redirect to `/login`
7. `middleware.ts` reads token from cookie (set alongside localStorage) for SSR route protection

---

## Data Fetching Rules

- **Always use TanStack Query** (`useQuery`, `useMutation`) — never raw fetch in components
- Query keys follow the pattern: `['feature', 'action', ...params]` e.g. `['offers', 'detail', id]`
- Mutations invalidate relevant queries on success
- Pagination uses `{ page, limit }` query params matching backend `PaginationDto`
- All API response shapes follow: `{ success: boolean, message: string, data: T }`

---

## Forms

- **React Hook Form + Zod** for all forms — no uncontrolled inputs
- Zod schemas live in `features/[feature]/types.ts` alongside the TypeScript types
- Show field-level errors inline, server errors via toast

---

## Key Rules

- **No file over 500 lines** — split into sub-components if approaching limit
- **No dark mode** — light theme only
- **`"use client"` only when needed** — interactivity, hooks, browser APIs. Pages default to Server Components
- **Never call the API directly in pages** — always go through `features/[feature]/api.ts`
- **Never import from `features/` in `components/`** — `components/` is domain-agnostic
- **`merchant_id` present in auth store** = user is a merchant = can access `/merchant/*` routes
- **`@radix-ui/react-badge` does not exist** as a package — Badge is a pure CVA component
- **No hardcoded data** — everything comes from the backend API

---

## Tech Stack

| Concern | Package |
|---|---|
| Framework | Next.js 15.3.2 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 + shadcn/Radix UI |
| HTTP client | Axios |
| Data fetching | TanStack Query (React Query v5) |
| Global state | Zustand |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |

---

## Commands

```bash
npm run dev       # Start dev server (http://localhost:3001 — backend runs on :3000)
npm run build     # Production build
npm run start     # Start production server
npm run lint      # ESLint check
```

---

## Backend Data Models (for reference)

### User
`id · name · email · phone · avatar_url · membership_type · preferred_location`

### Offer
`id · title · description · image_url · images · category_id · subcategory_id · merchant_id · original_price · discounted_price · discount_percentage · rating · review_count · badge · promo_price · promo_end_at · duration · features · highlights · terms · latitude · longitude`

### Category
`id · name · image_url` → has many `Subcategory (id · name · icon_key)`

### Favorite
`id · user_id · offer_id`

### Notification
`id · user_id · title · body · is_read`

### Coupon
`id · title · code · description · expires_at · is_active`
