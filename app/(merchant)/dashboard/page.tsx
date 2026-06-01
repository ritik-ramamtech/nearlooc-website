"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Package, MapPin, Star, TrendingUp, ArrowRight, Bell,
  Tag, MessageSquare, Plus,
} from "lucide-react";
import { useMerchantProfile } from "@/features/merchant/profile/hooks";
import { useMerchantOverview } from "@/features/merchant/analytics/hooks";

export default function DashboardPage() {
  const { data: profile, isPending: profileLoading } = useMerchantProfile();
  const { data: overview, isPending: overviewLoading } = useMerchantOverview();

  const loading = profileLoading || overviewLoading;

  return (
    <div className="min-h-screen bg-[#f0f7f0]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-20">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Dashboard</h1>
          <p className="text-xs text-gray-400">Merchant Overview</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell className="h-5 w-5 text-gray-500" />
          </button>
          <div className="h-8 w-8 rounded-full bg-[#1a5c2a] flex items-center justify-center text-white text-sm font-bold">
            {profile?.business_name?.[0]?.toUpperCase() ?? "M"}
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Welcome banner */}
        {loading ? (
          <div className="h-24 rounded-2xl bg-gray-200 animate-pulse" />
        ) : (
          <div className="bg-[#1a5c2a] rounded-2xl p-5 text-white flex items-center justify-between">
            <div>
              <p className="text-sm text-green-200">Welcome back,</p>
              <p className="text-xl font-bold mt-0.5">{profile?.business_name}</p>
              <p className="text-sm text-green-200 mt-1">
                {overview?.products.total === 0
                  ? "Start by adding your first product."
                  : `${overview?.products.active} active product${overview?.products.active !== 1 ? "s" : ""} · ${overview?.offers.active} active offer${overview?.offers.active !== 1 ? "s" : ""}`}
              </p>
            </div>
            {profile?.is_verified && (
              <span className="hidden sm:block bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full shrink-0">
                ✓ Verified
              </span>
            )}
          </div>
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<Package className="h-5 w-5 text-[#1a5c2a]" />}
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
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-gray-900">Rating Breakdown</p>
              <Link href="/reviews" className="text-xs font-semibold text-[#1a5c2a] hover:underline flex items-center gap-1">
                All reviews <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-2">
              {([5, 4, 3, 2, 1] as const).map((star) => {
                const count = overview.reviews.distribution[star] ?? 0;
                const pct = overview.reviews.total > 0 ? (count / overview.reviews.total) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-4 text-right">{star}</span>
                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 shrink-0" />
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 w-5 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Top performing offers */}
        {!loading && overview && overview.top_offers.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-gray-900">Top Offers</p>
              <Link href="/products" className="text-xs font-semibold text-[#1a5c2a] hover:underline flex items-center gap-1">
                Manage <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {overview.top_offers.map((offer) => (
                <div key={offer.id} className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-[#f0f7f0] flex items-center justify-center shrink-0">
                    <Tag className="h-4 w-4 text-[#1a5c2a]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{offer.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-bold text-gray-800">₹{offer.discounted_price.toLocaleString("en-IN")}</span>
                      <span className="text-[10px] font-semibold text-[#1a5c2a] bg-[#e8f5e9] px-1.5 py-0.5 rounded-full">
                        {offer.discount_percentage}% off
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    {offer.rating > 0 ? (
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs font-semibold text-gray-700">{offer.rating}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">No ratings</span>
                    )}
                    <p className="text-[10px] text-gray-400 mt-0.5">{offer.review_count} reviews</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent reviews */}
        {!loading && overview && overview.recent_reviews.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-gray-900">Recent Reviews</p>
              <Link href="/reviews" className="text-xs font-semibold text-[#1a5c2a] hover:underline flex items-center gap-1">
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

        {/* Quick actions */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <QuickAction href="/products/new" icon={<Plus className="h-5 w-5 text-[#1a5c2a]" />} title="Add Product" desc="Expand your catalog" />
            <QuickAction href="/locations" icon={<MapPin className="h-5 w-5 text-[#1a5c2a]" />} title="Manage Locations" desc="Add or update branches" />
            <QuickAction href="/reviews" icon={<MessageSquare className="h-5 w-5 text-[#1a5c2a]" />} title="View Reviews" desc="See customer feedback" />
          </div>
        </div>

        <div className="flex justify-center pb-4">
          <Link href="/home" className="text-sm text-gray-400 hover:text-[#1a5c2a] transition-colors">
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
    return <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 h-28 animate-pulse" />;
  }
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
      <div className="h-9 w-9 rounded-lg bg-[#f0f7f0] flex items-center justify-center">
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-900 mt-3">{value}</p>
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mt-0.5">{label}</p>
      <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>
    </div>
  );
}

function QuickAction({ href, icon, title, desc }: { href: string; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Link
      href={href}
      className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 flex items-center gap-3 hover:border-[#1a5c2a] hover:shadow-md transition-all group"
    >
      <div className="h-10 w-10 rounded-lg bg-[#f0f7f0] flex items-center justify-center shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800">{title}</p>
        <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-[#1a5c2a] transition-colors shrink-0" />
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
      <div className="h-8 w-8 rounded-full bg-[#f0f7f0] shrink-0 overflow-hidden">
        {review.reviewer.avatar_url ? (
          <Image src={review.reviewer.avatar_url} alt={review.reviewer.name} width={32} height={32} className="object-cover h-full w-full" />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-xs font-bold text-[#1a5c2a]">
            {review.reviewer.name[0]?.toUpperCase()}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-gray-900">{review.reviewer.name}</p>
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`}
              />
            ))}
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-0.5">{review.product.name}</p>
        {review.comment && (
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{review.comment}</p>
        )}
      </div>
    </div>
  );
}
