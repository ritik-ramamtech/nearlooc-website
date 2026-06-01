"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, Bell, User, Heart, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import { useLogout } from "@/features/auth/hooks";

export function PublicNav() {
  const { isAuthenticated, merchant_id } = useAuthStore();
  const { mutate: logout, isPending } = useLogout();

  return (
    <header className="fixed top-0 z-50 w-full border-b border-outline-variant bg-surface/90 backdrop-blur-md">
      <div className="px-4 mx-auto flex h-16 max-w-container-max items-center justify-between">
        <Link href="/home">
          <Image src="/logo.svg" alt="Nearlooc" width={120} height={31} priority />
        </Link>

        <div className="hidden flex-1 max-w-sm mx-8 md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant" />
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
              {/* Mode switcher — only visible for merchants */}
              {merchant_id && (
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1a5c2a] hover:bg-[#14471f] text-white text-xs font-semibold transition-colors"
                >
                  <Store className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Merchant Portal</span>
                  <span className="sm:hidden">Portal</span>
                </Link>
              )}
              <Link href="/favorites">
                <Heart className="h-5 w-5 text-on-surface-variant hover:text-stitch-primary transition-colors" />
              </Link>
              <Link href="/notifications">
                <Bell className="h-5 w-5 text-on-surface-variant hover:text-stitch-primary transition-colors" />
              </Link>
              <Link href="/profile">
                <User className="h-5 w-5 text-on-surface-variant hover:text-stitch-primary transition-colors" />
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
              <Link href="/favorites">
                <Heart className="h-5 w-5 text-on-surface-variant hover:text-stitch-primary transition-colors" />
              </Link>
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign in</Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-stitch-primary hover:bg-stitch-secondary text-white">
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
