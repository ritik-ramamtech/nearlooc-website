"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  MapPin,
  Settings,
  Menu,
  X,
  Store,
  Plus,
  HelpCircle,
  LogOut,
  ShoppingBag,
  MessageSquare,
} from "lucide-react";
import { MerchantSidebar } from "@/components/layout/MerchantSidebar";
import { useLogout } from "@/features/auth/hooks";
import { ROUTES } from "@/lib/constants";

const NAV_ITEMS = [
  { href: ROUTES.DASHBOARD, label: "Overview",  Icon: LayoutDashboard },
  { href: ROUTES.PRODUCTS,  label: "Products",  Icon: Package },
  { href: ROUTES.LOCATIONS, label: "Locations", Icon: MapPin },
  { href: ROUTES.REVIEWS,   label: "Reviews",   Icon: MessageSquare },
  { href: ROUTES.SETTINGS,  label: "Settings",  Icon: Settings },
];

export default function MerchantLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { mutate: logout, isPending: loggingOut } = useLogout();

  return (
    <div className="min-h-screen bg-brand-50">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <MerchantSidebar />
      </div>

      {/* Mobile top bar */}
      <header className="fixed left-0 right-0 top-0 z-40 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500">
            <Store className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-sm font-bold text-gray-900">Merchant Portal</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={ROUTES.HOME}
            className="flex items-center gap-1.5 rounded-full border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-600 transition-colors hover:border-brand-500 hover:text-brand-500"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Customer
          </Link>
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            className="rounded-lg p-2 transition-colors hover:bg-gray-100"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </header>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="absolute left-0 top-0 flex h-full w-64 flex-col bg-brand-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-brand-200 px-4 py-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500">
                  <Store className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Merchant Portal</p>
                  <p className="text-[11px] text-gray-500">Manage your business</p>
                </div>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation menu"
                className="rounded-lg p-1.5 transition-colors hover:bg-brand-200"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>
            </div>

            <nav className="flex-1 space-y-1 px-3 py-4">
              {NAV_ITEMS.map(({ href, label, Icon }) => {
                const active = pathname === href || pathname.startsWith(href + "/");
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-brand-500 text-white"
                        : "text-gray-600 hover:bg-brand-200 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {label}
                  </Link>
                );
              })}
            </nav>

            <div className="space-y-2 border-t border-brand-200 px-3 py-4">
              <button
                onClick={() => { router.push(ROUTES.PRODUCTS_NEW); setMobileOpen(false); }}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
              >
                <Plus className="h-4 w-4" />
                Add New Product
              </button>
              <Link
                href={ROUTES.HELP}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-brand-200"
              >
                <HelpCircle className="h-4 w-4" />
                Help Center
              </Link>
              <button
                onClick={() => logout()}
                disabled={loggingOut}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="h-4 w-4" />
                {loggingOut ? "Signing out..." : "Log Out"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page content */}
      <div className="min-h-screen pt-14 md:ml-52 md:pt-0">
        {children}
      </div>
    </div>
  );
}
