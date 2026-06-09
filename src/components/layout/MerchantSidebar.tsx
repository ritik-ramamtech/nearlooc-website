"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  MapPin,
  Settings,
  HelpCircle,
  LogOut,
  Plus,
  Store,
  MessageSquare,
  ShoppingBag,
} from "lucide-react";
import { useLogout } from "@/features/auth/hooks";
import { useMerchantProfile } from "@/features/merchant/profile/hooks";
import { ROUTES } from "@/lib/constants";

const NAV_ITEMS = [
  { href: ROUTES.DASHBOARD, label: "Overview", Icon: LayoutDashboard },
  { href: ROUTES.PRODUCTS,  label: "Products",  Icon: Package },
  { href: ROUTES.LOCATIONS, label: "Locations", Icon: MapPin },
  { href: ROUTES.REVIEWS,   label: "Reviews",   Icon: MessageSquare },
  { href: ROUTES.SETTINGS,  label: "Settings",  Icon: Settings },
];

export function MerchantSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { mutate: logout, isPending: loggingOut } = useLogout();
  const { data: profile } = useMerchantProfile();

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-52 flex-col border-r border-brand-200 bg-brand-100">
      {/* Header */}
      <div className="border-b border-brand-200 px-4 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500">
            <Store className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold leading-tight text-gray-900">Merchant Portal</p>
            <p className="text-[11px] leading-tight text-gray-500">Manage your business</p>
          </div>
        </div>
        {profile && (
          <p className="mt-2 truncate text-xs font-medium text-brand-500">{profile.business_name}</p>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
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

      {/* Bottom section */}
      <div className="space-y-2 border-t border-brand-200 px-3 py-4">
        <button
          onClick={() => router.push(ROUTES.PRODUCTS_NEW)}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
        >
          <Plus className="h-4 w-4" />
          Add New Product
        </button>

        <Link
          href={ROUTES.HOME}
          className="flex items-center justify-center gap-2.5 rounded-full border border-brand-200 px-3 py-2 text-sm font-semibold text-brand-500 transition-colors hover:bg-white"
        >
          <ShoppingBag className="h-4 w-4" />
          Customer Mode
        </Link>

        <Link
          href={ROUTES.HELP}
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-brand-200 hover:text-gray-900"
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
    </aside>
  );
}
