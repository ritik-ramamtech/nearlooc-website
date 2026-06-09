"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Package, MapPin, Star, TrendingUp, ArrowRight, Bell,
  Tag, MessageSquare, Plus,
} from "lucide-react";
import { useMerchantProfile } from "@/features/merchant/profile/hooks";
import { useMerchantOverview } from "@/features/merchant/analytics/hooks";
import { ROUTES } from "@/lib/constants";

export default function DashboardPage() {
  const { data: profile, isPending: profileLoading } = useMerchantProfile();
  const { data: overview, isPending: overviewLoading } = useMerchantOverview();

  const loading = profileLoading || overviewLoading;

  return (
    <div className="min-h-screen bg-page-bg">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200/60 bg-white/80 px-6 py-3 backdrop-blur-md transition-all">
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

      <div className="space-y-6 p-6">
        {/* Welcome banner */}
        {loading ? (
          <div className="h-24 animate-pulse rounded-2xl bg-gray-200" />
        ) : (
          <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-brand-500 to-brand-400 p-6 text-white shadow-lg shadow-green-900/10">
            <div>
              <p className="text-sm font-medium text-green-100/90">Welcome back,</p>
              <p className="mt-1 text-2xl font-bold">{profile?.business_name}</p>
              <p className="mt-2 text-sm text-green-100/90">
                {overview?.products.total === 0
                  ? "Start by adding your first product."
                  : `${overview?.products.active} active product${overview?.products.active !== 1 ? "s" : ""} · ${overview?.offers.active} active offer${overview?.offers.active !== 1 ? "s" : ""}`}
              </p>
            </div>
            {profile?.is_verified && (
              <span className="hidden shrink-0 rounded-full border border-white/10 bg-white/20 px-4 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur-sm sm:block">
                ✓ Verified
              </span>
            )}
          </div>
        )}

        {/* Quick actions */}
        {!loading && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <QuickAction href={ROUTES.PRODUCTS_NEW} icon={<Plus className="h-5 w-5 text-brand-500" />}  title="Add Product"      desc="Expand your catalog" />
            <QuickAction href={ROUTES.LOCATIONS}    icon={<MapPin className="h-5 w-5 text-brand-500" />} title="Manage Locations" desc="Add or update branches" />
            <QuickAction href={ROUTES.REVIEWS}      icon={<MessageSquare className="h-5 w-5 text-brand-500" />} title="View Reviews" desc="See customer feedback" />
          </div>
        )}

        {/* Empty state — 0 products */}
        {!loading && overview?.products.total === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
              <Package className="h-8 w-8 text-brand-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Your catalog is empty</h3>
            <p className="mb-6 mt-2 max-w-sm text-sm text-gray-500">
              Add products and start creating offers to attract customers to your store.
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
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            icon={<Package className="h-5 w-5 text-brand-500" />}
            value={loading ? null : String(overview?.products.total ?? 0)}
            label="Products"
            sub={loading ? "" : `${overview?.products.active ?? 0} active · ${overview?.products.inactive ?? 0} inactive`}
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
            icon={<Star className="h-5 w-5 text-yellow-500" />}
            value={loading ? null : overview?.reviews.avg_rating ? overview.reviews.avg_rating.toFixed(1) : "—"}
            label="Avg Rating"
            sub={loading ? "" : `Based on ${overview?.reviews.total ?? 0} review${overview?.reviews.total !== 1 ? "s" : ""}`}
            loading={loading}
          />
          <StatCard
            icon={<MapPin className="h-5 w-5 text-blue-500" />}
            value={loading ? null : String(overview?.locations.total ?? 0)}
            label="Locations"
            sub={loading ? "" : (overview?.locations.total ?? 0) > 0 ? "Store branches" : "No locations added"}
            loading={loading}
          />
        </div>

        {/* Rating distribution */}
        {!loading && overview && overview.reviews.total > 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-bold text-gray-900">Rating Breakdown</p>
              <Link href={ROUTES.REVIEWS} className="flex items-center gap-1 text-xs font-semibold text-brand-500 hover:underline">
                All reviews <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {([5, 4, 3, 2, 1] as const).map((star) => {
                const count = overview.reviews.distribution[star] ?? 0;
                const pct = overview.reviews.total > 0 ? (count / overview.reviews.total) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-3">
                    <span className="w-4 text-right text-xs text-gray-500">{star}</span>
                    <Star className="h-3 w-3 shrink-0 fill-yellow-400 text-yellow-400" />
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                      <div className="h-full rounded-full bg-yellow-400 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-5 text-right text-xs text-gray-400">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Top performing offers */}
        {!loading && overview && overview.top_offers.length > 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-bold text-gray-900">Top Offers</p>
              <Link href={ROUTES.PRODUCTS} className="flex items-center gap-1 text-xs font-semibold text-brand-500 hover:underline">
                Manage <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {overview.top_offers.map((offer) => (
                <div key={offer.id} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50">
                    <Tag className="h-4 w-4 text-brand-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900">{offer.title}</p>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-800">₹{offer.discounted_price.toLocaleString("en-IN")}</span>
                      <span className="rounded-full bg-brand-100 px-1.5 py-0.5 text-[10px] font-semibold text-brand-500">
                        {offer.discount_percentage}% off
                      </span>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    {offer.rating > 0 ? (
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-semibold text-gray-700">{offer.rating}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">No ratings</span>
                    )}
                    <p className="mt-0.5 text-[10px] text-gray-400">{offer.review_count} reviews</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent reviews */}
        {!loading && overview && overview.recent_reviews.length > 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-bold text-gray-900">Recent Reviews</p>
              <Link href={ROUTES.REVIEWS} className="flex items-center gap-1 text-xs font-semibold text-brand-500 hover:underline">
                See all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-4">
              {overview.recent_reviews.map((review) => (
                <ReviewRow key={review.id} review={review} />
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center pb-4">
          <Link href={ROUTES.HOME} className="text-sm text-gray-400 transition-colors hover:text-brand-500">
            ← Switch to Customer Mode
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon, value, label, sub, loading,
}: {
  icon: React.ReactNode;
  value: string | null;
  label: string;
  sub: string;
  loading: boolean;
}) {
  if (loading) {
    return <div className="h-28 animate-pulse rounded-xl border border-gray-200 bg-white p-5 shadow-sm" />;
  }
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/20 hover:shadow-md">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-50 to-green-100/50">
        {icon}
      </div>
      <p className="mt-4 text-2xl font-bold tracking-tight text-gray-900">{value}</p>
      <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-gray-500">{label}</p>
      <p className="mt-0.5 text-[11px] text-gray-400">{sub}</p>
    </div>
  );
}

function QuickAction({ href, icon, title, desc }: { href: string; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/30 hover:shadow-md"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-50 to-green-100/50 transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-900 transition-colors group-hover:text-brand-500">{title}</p>
        <p className="mt-0.5 text-xs text-gray-500">{desc}</p>
      </div>
      <ArrowRight className="h-5 w-5 shrink-0 text-gray-300 transition-all group-hover:translate-x-1 group-hover:text-brand-500" />
    </Link>
  );
}

function ReviewRow({ review }: {
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
      <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-brand-50">
        {review.reviewer.avatar_url ? (
          <Image src={review.reviewer.avatar_url} alt={review.reviewer.name} width={32} height={32} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs font-bold text-brand-500">
            {review.reviewer.name[0]?.toUpperCase()}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-gray-900">{review.reviewer.name}</p>
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
              />
            ))}
          </div>
        </div>
        <p className="mt-0.5 text-xs text-gray-400">{review.product.name}</p>
        {review.comment && (
          <p className="mt-1 line-clamp-2 text-sm text-gray-600">{review.comment}</p>
        )}
      </div>
    </div>
  );
}
