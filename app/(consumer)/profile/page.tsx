"use client";

import Link from "next/link";
import { MapPin, Heart, Star, LogOut, ChevronRight, Store, LayoutDashboard } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { AvatarUpload } from "@/features/user/components/AvatarUpload";
import { ProfileForm } from "@/features/user/components/ProfileForm";
import { useProfile } from "@/features/user/hooks";
import { useLogout } from "@/features/auth/hooks";
import { useAuthStore } from "@/store/auth.store";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
  const { data: profile, isPending } = useProfile();
  const { mutate: logout, isPending: loggingOut } = useLogout();
  const { merchant_id } = useAuthStore();
  const isMerchant = !!merchant_id;

  if (isPending) {
    return (
      <>
        <TopBar title="My Profile" showBack={false} />
        <div className="pt-14 px-4 py-6 space-y-4 animate-pulse">
          <div className="flex flex-col items-center gap-3">
            <div className="h-20 w-20 rounded-full bg-surface-container" />
            <div className="h-4 w-32 rounded bg-surface-container" />
          </div>
          <div className="h-40 rounded-2xl bg-surface-container" />
        </div>
      </>
    );
  }

  if (!profile) return null;

  return (
    <>
      <TopBar title="My Profile" showBack={false} />
      <div className="pt-14 pb-6 space-y-6">
        {/* Avatar */}
        <div className="px-4 pt-4">
          <AvatarUpload name={profile.name} avatarUrl={profile.avatar_url} />
        </div>

        {/* Membership badge */}
        <div className="flex justify-center">
          <Badge className="bg-stitch-primary text-white capitalize px-3 py-1">
            {profile.membership_type} Member
          </Badge>
        </div>

        <Separator />

        {/* Profile form */}
        <div className="px-4 space-y-2">
          <h2 className="text-headline-sm font-semibold text-on-surface">Personal Info</h2>
          <ProfileForm profile={profile} />
        </div>

        <Separator />

        {/* Quick links */}
        <div className="px-4 space-y-1">
          <h2 className="mb-3 text-headline-sm font-semibold text-on-surface">Account</h2>

          <Link
            href="/favorites"
            className="flex items-center justify-between rounded-xl px-3 py-3 hover:bg-surface-container-low transition-colors"
          >
            <div className="flex items-center gap-3">
              <Heart className="h-5 w-5 text-on-surface-variant" />
              <span className="text-body-sm text-on-surface">My Favorites</span>
            </div>
            <ChevronRight className="h-4 w-4 text-on-surface-variant" />
          </Link>

          <Link
            href="/profile/location"
            className="flex items-center justify-between rounded-xl px-3 py-3 hover:bg-surface-container-low transition-colors"
          >
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-on-surface-variant" />
              <span className="text-body-sm text-on-surface">Preferred Location</span>
            </div>
            <ChevronRight className="h-4 w-4 text-on-surface-variant" />
          </Link>

          <Link
            href="/reviews"
            className="flex items-center justify-between rounded-xl px-3 py-3 hover:bg-surface-container-low transition-colors"
          >
            <div className="flex items-center gap-3">
              <Star className="h-5 w-5 text-on-surface-variant" />
              <span className="text-body-sm text-on-surface">My Reviews</span>
            </div>
            <ChevronRight className="h-4 w-4 text-on-surface-variant" />
          </Link>
        </div>

        <Separator />

        {/* Merchant section */}
        <div className="px-4">
          {isMerchant ? (
            <Link
              href="/dashboard"
              className="flex items-center justify-between w-full rounded-xl px-3 py-3 bg-[#1a5c2a] hover:bg-[#14471f] transition-colors"
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="h-5 w-5 text-white" />
                <div>
                  <span className="text-body-sm font-semibold text-white block">
                    Merchant Dashboard
                  </span>
                  <span className="text-[11px] text-green-200">Switch to merchant mode</span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-white" />
            </Link>
          ) : (
            <Link
              href="/profile/become-merchant"
              className="flex items-center justify-between w-full rounded-xl px-3 py-3 bg-[#e8f5e9] border border-[#c8e6c9] hover:bg-[#c8e6c9] transition-colors"
            >
              <div className="flex items-center gap-3">
                <Store className="h-5 w-5 text-[#1a5c2a]" />
                <div>
                  <span className="text-body-sm font-semibold text-[#1a5c2a] block">
                    Become a Merchant
                  </span>
                  <span className="text-[11px] text-gray-500">List your products & offers</span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-[#1a5c2a]" />
            </Link>
          )}
        </div>

        <Separator />

        {/* Sign out */}
        <div className="px-4">
          <button
            onClick={() => logout()}
            disabled={loggingOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-body-sm font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
}
