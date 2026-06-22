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
import { ROUTES } from "@/lib/constants";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
  const { data: profile, isPending } = useProfile();
  const { mutate: logout, isPending: loggingOut } = useLogout();
  const { merchant_id } = useAuthStore();
  const isMerchant = !!merchant_id;

  if (isPending) {
    return (
      <div className="flex h-screen">
        <div className="w-72 shrink-0 bg-white border-r border-gray-100 p-4 space-y-4">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-9 w-full rounded-lg" />
          <Skeleton className="h-9 w-full rounded-lg" />
          <Skeleton className="h-9 w-2/3 rounded-lg" />
        </div>
        <div className="flex-1 space-y-6 bg-page-bg p-10">
          <Skeleton className="h-8 w-48 rounded-lg" />
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 rounded-2xl" />)}
          </div>
          <Skeleton className="h-64 max-w-xl rounded-2xl" />
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
  const membershipLabel =
    profile.membership_type.charAt(0).toUpperCase() + profile.membership_type.slice(1);

  return (
    <div className="flex h-screen overflow-hidden">

      {/* ── Left Sidebar ── */}
      <aside className="flex w-72 shrink-0 flex-col overflow-y-auto border-r border-gray-100 bg-white">

        {/* App branding */}
        <div className="flex items-center gap-2.5 px-6 py-5 border-b border-gray-100">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500">
            <span className="text-xs font-bold text-white">N</span>
          </div>
          <span className="text-sm font-bold text-gray-900">Nearlooc</span>
        </div>

        {/* Identity block */}
        <div className="flex flex-col items-center gap-3 px-6 pb-6 pt-6">
          <AvatarUpload name={profile.name} avatarUrl={profile.avatar_url} />

          <div className="text-center">
            <p className="text-base font-bold leading-tight text-gray-900">{profile.name}</p>
            <p className="mt-0.5 text-xs text-gray-400">{profile.email}</p>
          </div>

          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ring-1 ${isPremium ? "bg-amber-50 text-amber-700 ring-amber-200" : "bg-brand-50 text-brand-700 ring-brand-200"}`}>
            <Shield className="h-3 w-3" />
            {membershipLabel} Member
          </span>
        </div>

        <div className="mx-6 border-t border-gray-100" />

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 px-4 py-4">
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">Menu</p>
          <SideNavLink href={ROUTES.FAVORITES}        icon={<Heart className="h-4 w-4" />}   label="My Favorites" />
          <SideNavLink href={ROUTES.PROFILE_LOCATION} icon={<MapPin className="h-4 w-4" />}  label="Preferred Location" />
          <SideNavLink href={ROUTES.MY_REVIEWS}       icon={<Star className="h-4 w-4" />}    label="My Reviews" />
        </nav>

        <div className="mx-6 border-t border-gray-100" />

        {/* Bottom actions */}
        <div className="space-y-1.5 px-4 py-5">
          {isMerchant ? (
            <Link
              href={ROUTES.DASHBOARD}
              className="group flex w-full items-center gap-3 rounded-xl bg-brand-500 px-3 py-2.5 transition-colors hover:bg-brand-600"
            >
              <LayoutDashboard className="h-4 w-4 shrink-0 text-white" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white">Merchant Dashboard</p>
                <p className="text-[11px] text-green-200/80">Switch to merchant mode</p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-white/60 transition-colors group-hover:text-white" />
            </Link>
          ) : (
            <Link
              href={ROUTES.PROFILE_BECOME_MERCHANT}
              className="group flex w-full items-center gap-3 rounded-xl border border-brand-200 bg-brand-50 px-3 py-2.5 transition-colors hover:bg-brand-100"
            >
              <Store className="h-4 w-4 shrink-0 text-brand-600" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-brand-700">Become a Merchant</p>
                <p className="text-[11px] text-brand-500/70">List your products &amp; offers</p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-brand-300 transition-colors group-hover:text-brand-500" />
            </Link>
          )}

          <button
            onClick={() => logout()}
            disabled={loggingOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-red-500 transition-colors hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span className="text-sm font-medium">{loggingOut ? "Signing out…" : "Sign Out"}</span>
          </button>
        </div>
      </aside>

      {/* ── Right Panel ── */}
      <main className="flex-1 overflow-y-auto bg-page-bg">
        <div className="mx-auto max-w-2xl space-y-5 px-8 py-8">

          {/* Welcome header */}
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-brand-500">Your Profile</p>
            <h1 className="text-headline-md font-bold text-gray-900">
              Welcome back, {profile.name.split(" ")[0]} 👋
            </h1>
          </div>

          {/* Stat pills */}
          <div className="grid grid-cols-3 gap-3">
            <StatPill
              icon={<Calendar className="h-4 w-4 text-brand-500" />}
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
              value={`${membershipLabel} Plan`}
            />
          </div>

          {/* Personal Info card */}
          <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <h2 className="text-sm font-bold text-gray-900">Personal Information</h2>
                <p className="mt-0.5 text-xs text-gray-400">Update your name and contact details</p>
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
      className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-gray-500 transition-colors hover:bg-brand-50 hover:text-brand-700"
    >
      <span className="shrink-0 transition-transform group-hover:scale-110">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}

function StatPill({ icon, label, value, muted }: { icon: React.ReactNode; label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-50">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{label}</p>
        <p className={`mt-0.5 truncate text-sm font-bold ${muted ? "text-gray-400" : "text-gray-800"}`}>{value}</p>
      </div>
    </div>
  );
}
