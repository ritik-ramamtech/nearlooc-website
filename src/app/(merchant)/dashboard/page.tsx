"use client";

import Link from "next/link";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Package,
  MapPin,
  Star,
  TrendingUp,
  ArrowRight,
  Bell,
  Plus,
  Heart,
} from "lucide-react";
import { useMerchantProfile } from "@/features/merchant/profile/hooks";
import { useMerchantOverview } from "@/features/merchant/analytics/hooks";
import { ROUTES } from "@/lib/constants";
import { formatLocalDateShort } from "@/lib/utils";
import { DashboardSkeleton } from "@/features/merchant/analytics/components/DashboardSkeleton";

const greeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  if (hour < 21) return "Good Evening";
  return "Good Night";
};

export default function DashboardPage() {
  const { data: profile, isPending: profileLoading } = useMerchantProfile();
  const { data: overview, isPending: overviewLoading } = useMerchantOverview();

  const loading = profileLoading || overviewLoading;

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="min-h-screen bg-slate-100/80">
      {/* Header */}
      <header className="hidden sm:flex sticky top-0 z-20 items-center justify-between border-b border-brand-200 bg-white/80 px-6 py-3 backdrop-blur-md transition-all">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Dashboard</h1>
          <p className="text-xs text-gray-400">Merchant Overview</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            aria-label="Notifications"
            className="relative rounded-lg p-2 transition-colors hover:bg-gray-100"
          >
            <Bell className="h-5 w-5 text-gray-500" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-400 text-sm font-bold text-white shadow-sm">
            {profile?.business_name?.[0]?.toUpperCase() ?? "M"}
          </div>
        </div>
      </header>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-[320px] overflow-hidden">
        <div className="absolute right-14 -top-16 h-[13rem] w-[13rem] rounded-full bg-emerald-200/40" />
        <div className="absolute -right-20 top-0 h-64 w-64 rounded-full bg-emerald-200/60" />
      </div>

      <main className="relative  z-10 mx-auto mx-w-7xl px-3">
        <div className="space-y-4 py-4 sm:space-y-6 sm:p-6">
          {/* Welcome banner */}
          {loading ? (
            <Skeleton className="h-24 rounded-2xl" />
          ) : (
            <div className="sm:px-8 px-4">
              {/* <div className="absolute right-14 -top-12 h-32 w-32 rounded-full bg-green-200/50" /> */}
              <div className="relative z-10 flex items-center">
                <div>
                  <p className="text-sm font-medium text-green-600">
                    {greeting()},
                  </p>
                  <p className="mt-1 text-2xl tracking-tight font-bold sm:text-3xl">
                    {profile?.business_name}
                  </p>
                  <p className="mt-1 text-sm text-green-600/90 sm:mt-2">
                    Here's what's happening with your store today.
                  </p>
                </div>
                {profile?.is_verified && (
                  <span className="self-start shrink-0 rounded-full border border-white/10 bg-emerald-200/20 px-4 py-1.5 text-xs font-semibold text-black shadow-sm backdrop-blur-sm sm:self-auto">
                    ✓ Verified
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Empty state — 0 products */}
          {!loading && overview?.products.total === 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                <Package className="h-8 w-8 text-brand-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Your catalog is empty
              </h3>
              <p className="mb-6 mt-2 max-w-sm text-sm text-gray-500">
                Add products and start creating offers to attract customers to
                your store.
              </p>
              <Link
                href={ROUTES.PRODUCTS_NEW}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 font-semibold text-white shadow-md shadow-green-900/10 transition-all hover:-translate-y-0.5 hover:bg-brand-800"
              >
                <Plus className="h-4 w-4" /> Add Your First Product
              </Link>
            </div>
          )}

          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard
              icon={<Package className="h-5 w-5 text-brand-500" />}
              value={loading ? null : String(overview?.products.total ?? 0)}
              label="Products"
              sub={
                loading
                  ? ""
                  : `${overview?.products.active ?? 0} active · ${overview?.products.inactive ?? 0} inactive`
              }
              loading={loading}
            />
            <StatCard
              icon={<TrendingUp className="h-5 w-5 text-orange-500" />}
              value={loading ? null : String(overview?.offers.active ?? 0)}
              label="Active Offers"
              sub={loading ? "" : `${overview?.offers.total ?? 0} total offers`}
              loading={loading}
            />
            <StatCard
              icon={<Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />}
              value={
                loading
                  ? null
                  : overview?.ratingTrend.currentRating
                    ? overview.ratingTrend.currentRating.toFixed(2)
                    : "-"
              }
              label="Avg Rating"
              sub={
                overview?.ratingTrend.direction === "up"
                  ? `↑ ${overview.ratingTrend.difference.toFixed(1)} this week`
                  : overview?.ratingTrend.direction === "down"
                    ? `↓ ${Math.abs(overview.ratingTrend.difference).toFixed(1)} this week`
                    : "No change this week"
              }
              loading={loading}
            />
            <StatCard
              icon={<Heart className="h-5 w-5 text-red-500 fill-red-400" />}
              value={loading ? null : String(overview?.fav_count ?? 0)}
              label="Favorites"
              sub={loading ? "" : "Total offer saves"}
              loading={loading}
            />
          </div>

          {!loading && overview && (overview.top_offers.length > 0 || overview.reviews.total > 0) && (
            <div className="grid gap-4 xl:grid-cols-2">
              {overview.top_offers.length > 0 && (
                <div
                  className={`relative overflow-hidden rounded-[28px] border border-stone-200/80 bg-[#FBFAF6] px-4 pt-2 shadow-sm hover:shadow-[0_8px_24px_-12px_rgba(16,24,40,0.08)] group ${overview.reviews.total === 0 ? "xl:col-span-2" : ""}`}
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 via-green-400 to-teal-300"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -left-10 top-16 h-56 w-56 rounded-full bg-emerald-300/30 blur-3xl"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:radial-gradient(rgba(16,185,129,0.12)_1px,transparent_1px)] [background-size:18px_18px]"
                  />

                  <div className="relative z-10">
                    <div className="mb-2 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          Top Performing Offer
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Highest rated offer
                        </p>
                      </div>
                    </div>

                    <div className="flex rounded-2xl gap-2">
                      <div className="w-32 h-30 rounded-2xl overflow-hidden shadow-[0_12px_28px_-10px_rgba(6,95,70,0.35)] transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:-rotate-2">
                        <img
                          src={overview.top_offers[0].image_url}
                          className=" object-cover rounded-2xl w-full h-full"
                        />
                      </div>

                      <div className="px-2 py-2">
                        <h3 className="mt-2 text-lg font-bold text-gray-900">
                          {overview.top_offers[0].title}
                        </h3>

                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-xl font-bold text-brand-600">
                            ₹
                            {overview.top_offers[0].discounted_price.toLocaleString(
                              "en-IN",
                            )}
                          </span>

                          <span className="rounded-lg bg-green-400 px-2 py-1 text-xs font-semibold text-white">
                            {overview.top_offers[0].discount_percentage}% OFF
                          </span>
                        </div>

                        <div className="flex gap-2 items-center mt-2">
                          <div className="flex gap-1 items-center">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${i < overview.top_offers[0].rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
                              />
                            ))}
                            {overview.top_offers[0].rating.toFixed(1)}
                          </div>
                          <div>
                            <p className="text-gray-700">
                              ({overview.top_offers[0].review_count} reviews)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {overview.reviews.total > 0 && (
                <div
                  className={`rounded-2xl border border-gray-200 bg-white p-5 shadow-sm ${overview.top_offers.length === 0 ? "xl:col-span-2" : ""}`}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-900">
                      Rating Breakdown
                    </p>
                    <Link
                      href={ROUTES.REVIEWS}
                      className="flex items-center gap-1 text-xs font-semibold text-brand-500 hover:underline"
                    >
                      All reviews <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                  <div className="space-y-2">
                    {([5, 4, 3, 2, 1] as const).map((star) => {
                      const count = overview.reviews.distribution[star] ?? 0;
                      const pct =
                        overview.reviews.total > 0
                          ? (count / overview.reviews.total) * 100
                          : 0;
                      return (
                        <div key={star} className="flex items-center gap-3">
                          <span className="w-4 text-right text-xs text-gray-500">
                            {star}
                          </span>
                          <Star className="h-3 w-3 shrink-0 fill-yellow-400 text-yellow-400" />
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                            <div
                              className="h-full rounded-full bg-yellow-400 transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="w-5 text-right text-xs text-gray-400">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="grid gap-6 xl:grid-cols-2">
            {/* Top performing offers */}
            {!loading && overview && (
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-bold text-gray-900">Top Offers</p>
                  <Link
                    href={`/products?tab=active`}
                    className="flex items-center gap-1 text-xs font-semibold text-brand-500 hover:underline"
                  >
                    Manage <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
                {overview.top_offers.length === 0 ? (
                  <div className="flex h-32 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gray-300 text-center">
                    <p className="text-sm text-gray-500">No offers yet</p>
                    <Link
                      href={ROUTES.PRODUCTS}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-600"
                    >
                      <Plus className="h-3.5 w-3.5" /> Create Offer
                    </Link>
                  </div>
                ) : (
                <div className="space-y-3">
                  {overview.top_offers.map((offer) => (
                    <div
                      key={offer.id}
                      className="flex items-center min-h-24 gap-2 border border-gray-200 rounded-xl p-2"
                    >
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                        <img
                          src={offer.image_url}
                          className="object-cover h-full w-full"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm font-semibold text-gray-900">
                          {offer.title}
                        </p>
                        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="text-sm font-bold text-gray-800">
                            ₹{offer.discounted_price.toLocaleString("en-IN")}
                          </span>
                          <span className="text-xs font-bold text-gray-400 line-through">
                            ₹
                            {offer.product.original_price.toLocaleString(
                              "en-IN",
                            )}
                          </span>
                          <span className="rounded-full bg-brand-100 px-1.5 py-0.5 text-[10px] font-semibold text-brand-500">
                            {offer.discount_percentage}% off
                          </span>
                        </div>
                      </div>
                      <div className="w-16 shrink-0 text-right">
                        {offer.rating > 0 ? (
                          <div className="flex items-center justify-end gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-semibold text-gray-700">
                              {offer.rating}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">
                            No ratings
                          </span>
                        )}
                        <p className="mt-0.5 text-[10px] text-gray-400">
                          {offer.review_count} reviews
                        </p>

                      </div>
                    </div>
                  ))}
                </div>
                )}
              </div>
            )}

            {/* Recent reviews */}
            {!loading && overview && (
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-bold text-gray-900">
                    Recent Reviews
                  </p>
                  <Link
                    href={ROUTES.REVIEWS}
                    className="flex items-center gap-1 text-xs font-semibold text-brand-500 hover:underline"
                  >
                    See all <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
                {overview.recent_reviews.length > 0 ? (
                  <div className="gap-x-4 grid grid-cols-2 w-full">
                    {overview.recent_reviews.map((review) => (
                      <ReviewRow key={review.id} review={review} />
                    ))}
                  </div>
                ) : (
                  <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 text-center">
                    <Star className="h-6 w-6 text-gray-300" />
                    <p className="text-sm text-gray-500">No reviews yet</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-center pb-4">
            <Link
              href={ROUTES.HOME}
              className="text-sm text-gray-400 transition-colors hover:text-brand-500"
            >
              ← Switch to Customer Mode
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
  sub,
  loading,
}: {
  icon: React.ReactNode;
  value: string | null;
  label: string;
  sub: string;
  loading: boolean;
}) {
  if (loading) {
    return <Skeleton className="h-28 rounded-xl" />;
  }
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/20 hover:shadow-md">
      <div className="grid grid-cols-[40px_1fr] gap-x-4">
        {/* Icon */}
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-50 to-green-100/50">
          {icon}
        </div>

        {/* Content */}
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-wider text-gray-600">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
            {value}
          </p>

          <p className="mt-1 text-[12px] text-gray-500">{sub}</p>
        </div>
      </div>
    </div>
  );
}

function ReviewRow({
  review,
}: {
  review: {
    id: string;
    rating: number;
    comment: string | null;
    reviewer: { id: string; name: string; avatar_url: string | null };
    product: { id: string; name: string };
    created_at: string;
  };
}) {
  return (
    <div className="flex gap-3">
      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-200">
        {review.reviewer.avatar_url ? (
          <Image
            src={review.reviewer.avatar_url}
            alt={review.reviewer.name}
            width={32}
            height={32}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs font-bold">
            {review.reviewer.name[0]?.toUpperCase()}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-gray-900">
            {review.reviewer.name}
          </p>
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
              />
            ))}
          </div>
        </div>
        <p className="mt-0.5 text-xs text-slate-600 font-medium line-clamp-2">
          {review.product.name}
        </p>
        {review.comment ? (
          <p className="mt-1 line-clamp-3 leading-6 text-[15px] font-medium">
            {review.comment}
          </p>
        ) : (
          <p className=" text-gray-600 italic text-sm">----</p>
        )}
        <p className="text-xs text-gray-500 mt-0.5">
          Posted on {formatLocalDateShort(review.created_at)}
        </p>
      </div>
    </div>
  );
}
