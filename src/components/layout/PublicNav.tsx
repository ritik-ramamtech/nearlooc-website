"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, Bell, User, Heart, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import { useLogout } from "@/features/auth/hooks";
import { ROUTES } from "@/lib/constants";

export function PublicNav() {
  const { isAuthenticated, merchant_id } = useAuthStore();
  const { mutate: logout, isPending } = useLogout();

  return (
    <header className="fixed top-0 z-50 w-full border-b border-outline-variant bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-container-max items-center justify-between px-4">
        <Link href={ROUTES.HOME}>
          <Image src="/logo.svg" alt="Nearlooc" width={120} height={31} priority />
        </Link>

        <div className="mx-8 hidden max-w-sm flex-1 md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
            <input
              className="w-full rounded-lg border border-outline-variant bg-surface-container-low py-2 pl-10 pr-4 text-body-sm focus:outline-none focus:ring-1 focus:ring-stitch-primary"
              placeholder="Search deals, vendors..."
              type="text"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {merchant_id && (
                <Link
                  href={ROUTES.DASHBOARD}
                  className="flex items-center gap-1.5 rounded-full bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-800"
                >
                  <Store className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Merchant Portal</span>
                  <span className="sm:hidden">Portal</span>
                </Link>
              )}
              <Link href={ROUTES.FAVORITES} aria-label="Favorites">
                <Heart className="h-5 w-5 text-on-surface-variant transition-colors hover:text-stitch-primary" />
              </Link>
              <Link href={ROUTES.NOTIFICATIONS} aria-label="Notifications">
                <Bell className="h-5 w-5 text-on-surface-variant transition-colors hover:text-stitch-primary" />
              </Link>
              <Link href={ROUTES.PROFILE} aria-label="Profile">
                <User className="h-5 w-5 text-on-surface-variant transition-colors hover:text-stitch-primary" />
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => logout()}
                disabled={isPending}
                className="text-on-surface-variant"
              >
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link href={ROUTES.FAVORITES} aria-label="Favorites">
                <Heart className="h-5 w-5 text-on-surface-variant transition-colors hover:text-stitch-primary" />
              </Link>
              <Link href={ROUTES.LOGIN}>
                <Button variant="ghost" size="sm">Sign in</Button>
              </Link>
              <Link href={ROUTES.REGISTER}>
                <Button size="sm" className="bg-stitch-primary text-white hover:bg-stitch-secondary">
                  Get started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
