"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Bell, User, Heart, Store, Smartphone, ChevronDown, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import { useLogout } from "@/features/auth/hooks";
import { ROUTES } from "@/lib/constants";

export function PublicNav() {
  const { isAuthenticated, merchant_id, user } = useAuthStore();
  const { mutate: logout, isPending } = useLogout();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => mobileSearchRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  return (
    <>
      {/* Mobile search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-white md:hidden">
          <div className="flex h-16 shrink-0 items-center gap-3 border-b border-gray-100 px-4">
            <button
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
              className="p-1.5 text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="relative flex flex-1 items-center">
              <Search className="absolute left-4 h-4 w-4 text-gray-400" />
              <input
                ref={mobileSearchRef}
                className="w-full h-11 bg-gray-50/50 rounded-full border border-gray-200/80 py-2 pl-11 pr-12 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-stitch-secondary focus:ring-1 focus:ring-stitch-secondary transition-all"
                placeholder="Search deals, vendors, products..."
                type="text"
              />
              <button className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-stitch-secondary text-white hover:bg-stitch-primary transition-colors">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="fixed top-0 z-50 w-full border-b border-gray-100 bg-white px-4">
        <div className="mx-auto flex h-16 max-w-container-max items-center justify-between gap-4">
          {/* Left: Logo */}
          <Link href={ROUTES.HOME} className="flex items-center shrink-0">
            <Image src="/logo.svg" alt="Nearlooc" width={160} height={42} priority className="h-8 w-auto sm:h-10" />
          </Link>

          {/* Search Bar - desktop only */}
          <div className="flex-1 max-w-[420px] ml-4 mr-auto hidden md:block">
            <div className="relative flex items-center w-full">
              <Search className="absolute left-4 h-4 w-4 text-gray-400" />
              <input
                className="w-full h-11 bg-gray-50/50 rounded-full border border-gray-200/80 py-2 pl-11 pr-12 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-stitch-secondary focus:ring-1 focus:ring-stitch-secondary transition-all"
                placeholder="Search deals, vendors, products..."
                type="text"
              />
              <button className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-stitch-secondary text-white hover:bg-stitch-primary transition-colors">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-4">
          {/* Mobile search button */}
          <button
            onClick={() => setSearchOpen(true)}
            aria-label="Search"
            className="p-1.5 text-gray-700 hover:text-stitch-secondary transition-colors md:hidden"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* App link — icon on all screens, text on lg+ */}
          <Link
            href="#"
            className="flex items-center gap-1.5 text-stitch-secondary font-semibold text-sm hover:opacity-80 transition-opacity"
            aria-label="Download mobile app"
          >
            <Smartphone className="h-5 w-5 text-stitch-secondary" />
            <span className="hidden lg:inline">App</span>
          </Link>

          {/* Sell on NearLooc (desktop only) - hidden if the user is already a merchant */}
          {!merchant_id && (
            <>
              {/* Divider (desktop only) */}
              <div className="hidden lg:block h-4 w-px bg-gray-200" />

              <Link
                href={ROUTES.PROFILE_BECOME_MERCHANT}
                className="hidden lg:flex items-center gap-1.5 text-stitch-secondary font-semibold text-sm hover:opacity-80 transition-opacity"
              >
                <Store className="h-4.5 w-4.5 text-stitch-secondary" />
                <span>Sell on NearLooc</span>
              </Link>
            </>
          )}

          {/* Divider (desktop only) */}
          <div className="hidden lg:block h-4 w-px bg-gray-200" />

          {/* Wishlist (desktop: text+icon, tablet: icon only, mobile: hidden) */}
          <Link
            href={ROUTES.FAVORITES}
            className="hidden sm:flex items-center gap-1.5 text-gray-700 font-semibold text-sm hover:text-stitch-secondary transition-colors"
            aria-label="Favorites"
          >
            <Heart className="h-5 w-5 sm:h-4.5 sm:w-4.5 text-gray-700" />
            <span className="hidden lg:inline">Wishlist</span>
          </Link>

          {/* Notifications */}
          <Link
            href={ROUTES.NOTIFICATIONS}
            className="relative p-1.5 text-gray-700 hover:text-stitch-secondary transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </Link>

          {/* User Section */}
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-full bg-gray-50 hover:bg-gray-100/80 px-3 py-1.5 text-sm font-semibold text-gray-700 transition-colors focus:outline-none"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-gray-600">
                  <User className="h-3.5 w-3.5" />
                </div>
                <span className="max-w-[80px] truncate hidden sm:inline">
                  Hi, {user?.name.split(" ")[0] ?? "User"}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-gray-500 hidden sm:inline" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-gray-100 bg-white p-1 shadow-lg ring-1 ring-black/5 z-50 animate-in fade-in slide-in-from-top-2 duration-100">
                  <Link
                    href={ROUTES.PROFILE}
                    onClick={() => setDropdownOpen(false)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User className="h-4 w-4" />
                    My Profile
                  </Link>
                  {merchant_id ? (
                    <Link
                      href={ROUTES.DASHBOARD}
                      onClick={() => setDropdownOpen(false)}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Store className="h-4 w-4" />
                      Merchant Portal
                    </Link>
                  ) : (
                    <Link
                      href={ROUTES.PROFILE_BECOME_MERCHANT}
                      onClick={() => setDropdownOpen(false)}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Store className="h-4 w-4" />
                      Sell on NearLooc
                    </Link>
                  )}
                  <div className="my-1 border-t border-gray-100" />
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    disabled={isPending}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link href={ROUTES.LOGIN} className="hidden sm:block">
                <Button variant="ghost" size="sm" className="text-gray-700 font-semibold text-sm">
                  Sign in
                </Button>
              </Link>
              <Link href={ROUTES.REGISTER}>
                <Button size="sm" className="bg-stitch-secondary text-white hover:bg-stitch-primary px-3 sm:px-4 rounded-full font-semibold text-xs sm:text-sm">
                  Get started
                </Button>
              </Link>
            </div>
          )}
        </div>
        </div>
      </header>
    </>
  );
}
