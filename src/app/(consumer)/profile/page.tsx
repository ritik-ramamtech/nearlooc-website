"use client";

import Link from "next/link";
import {
  MapPin, Heart, Star, LogOut, ChevronRight,
  Store, LayoutDashboard, Calendar, Shield,
} from "lucide-react";
import { AvatarUpload } from "@/features/user/components/AvatarUpload";
import { ProfileForm } from "@/features/user/components/ProfileForm";
import { useProfile } from "@/features/user/hooks";
import { useLogout } from "@/features/auth/hooks";
import { useAuthStore } from "@/store/auth.store";

export default function ProfilePage() {
  const { data: profile, isPending } = useProfile();
  const { mutate: logout, isPending: loggingOut } = useLogout();
  const { merchant_id } = useAuthStore();
  const isMerchant = !!merchant_id;

  if (isPending) {
    return (
      <div className="flex h-screen">
        <div className="w-72 shrink-0 bg-gradient-to-b from-[#1a5c2a] to-[#0d3318] animate-pulse" />
        <div className="flex-1 bg-[#f4f9f4] p-10 space-y-6 animate-pulse">
          <div className="h-8 w-48 rounded-lg bg-gray-200" />
          <div className="flex gap-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-16 w-32 rounded-2xl bg-gray-200" />)}
          </div>
          <div className="h-64 rounded-2xl bg-gray-200 max-w-xl" />
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const memberSince = new Date(profile.member_since).toLocaleDateString("en-IN", {
    month: "short", year: "numeric",
  });

  const locationLabel = profile.preferred_location?.address
    ? profile.preferred_location.address.split(",")[0]
    : null;

  const isPremium = profile.membership_type === "premium";

  return (
    <div className="flex h-screen overflow-hidden">

      {/* ── Left Sidebar ── */}
      <aside className="w-72 shrink-0 bg-gradient-to-b from-[#1a5c2a] via-[#154d23] to-[#0d3318] flex flex-col overflow-y-auto">

        {/* Identity block */}
        <div className="px-6 pt-10 pb-8 flex flex-col items-center gap-4">
          {/* Avatar with camera overlay styled for dark bg */}
          <div className="ring-4 ring-white/20 rounded-full">
            <AvatarUpload name={profile.name} avatarUrl={profile.avatar_url} />
          </div>

          <div className="text-center">
            <p className="text-lg font-bold text-white leading-tight">{profile.name}</p>
            <p className="text-sm text-green-200/70 mt-0.5">{profile.email}</p>
          </div>

          <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1 rounded-full ${isPremium ? "bg-amber-400/20 text-amber-300 ring-1 ring-amber-400/30" : "bg-white/10 text-green-100 ring-1 ring-white/20"}`}>
            <Shield className="h-3 w-3" />
            {profile.membership_type.charAt(0).toUpperCase() + profile.membership_type.slice(1)} Member
          </span>
        </div>

        {/* Divider */}
        <div className="mx-6 border-t border-white/10" />

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest px-3 mb-3">Menu</p>
          <SideNavLink href="/favorites" icon={<Heart className="h-4 w-4" />} label="My Favorites" />
          <SideNavLink href="/profile/location" icon={<MapPin className="h-4 w-4" />} label="Preferred Location" />
          <SideNavLink href="/reviews" icon={<Star className="h-4 w-4" />} label="My Reviews" />
        </nav>

        {/* Divider */}
        <div className="mx-6 border-t border-white/10" />

        {/* Bottom actions */}
        <div className="px-4 py-6 space-y-2">
          {isMerchant ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 bg-white/10 hover:bg-white/20 transition-colors group"
            >
              <LayoutDashboard className="h-4 w-4 text-white shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">Merchant Dashboard</p>
                <p className="text-[11px] text-green-300/70">Switch to merchant mode</p>
              </div>
              <ChevronRight className="h-4 w-4 text-white/40 group-hover:text-white/70 transition-colors shrink-0" />
            </Link>
          ) : (
            <Link
              href="/profile/become-merchant"
              className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 bg-white/10 hover:bg-white/20 transition-colors group"
            >
              <Store className="h-4 w-4 text-white shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">Become a Merchant</p>
                <p className="text-[11px] text-green-300/70">List your products & offers</p>
              </div>
              <ChevronRight className="h-4 w-4 text-white/40 group-hover:text-white/70 transition-colors shrink-0" />
            </Link>
          )}

          <button
            onClick={() => logout()}
            disabled={loggingOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-red-300 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span className="text-sm font-medium">{loggingOut ? "Signing out…" : "Sign Out"}</span>
          </button>
        </div>
      </aside>

      {/* ── Right Panel ── */}
      <main className="flex-1 bg-[#f4f9f4] overflow-y-auto">
        <div className="max-w-2xl mx-auto px-8 py-10 space-y-6">

          {/* Welcome header */}
          <div>
            <p className="text-xs font-semibold text-[#1a5c2a] uppercase tracking-widest mb-1">Your Profile</p>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {profile.name.split(" ")[0]} 👋
            </h1>
          </div>

          {/* Stat pills */}
          <div className="flex gap-3 flex-wrap">
            <StatPill
              icon={<Calendar className="h-4 w-4 text-[#1a5c2a]" />}
              label="Member since"
              value={memberSince}
            />
            <StatPill
              icon={<MapPin className="h-4 w-4 text-blue-500" />}
              label="Location"
              value={locationLabel ?? "Not set"}
              muted={!locationLabel}
            />
            <StatPill
              icon={<Shield className="h-4 w-4 text-amber-500" />}
              label="Plan"
              value={`${profile.membership_type.charAt(0).toUpperCase() + profile.membership_type.slice(1)} Plan`}
            />
          </div>

          {/* Personal Info card */}
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-gray-900">Personal Information</h2>
                <p className="text-xs text-gray-400 mt-0.5">Update your name and contact details</p>
              </div>
            </div>
            <div className="px-6 py-5">
              <ProfileForm profile={profile} />
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}

function SideNavLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-green-100/70 hover:text-white hover:bg-white/10 transition-colors group"
    >
      <span className="shrink-0 group-hover:scale-110 transition-transform">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}

function StatPill({ icon, label, value, muted }: { icon: React.ReactNode; label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
      <div className="h-8 w-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
        <p className={`text-sm font-bold mt-0.5 ${muted ? "text-gray-400" : "text-gray-800"}`}>{value}</p>
      </div>
    </div>
  );
}

