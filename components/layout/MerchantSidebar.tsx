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

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", Icon: LayoutDashboard },
  { href: "/products", label: "Products", Icon: Package },
  { href: "/locations", label: "Locations", Icon: MapPin },
  { href: "/reviews", label: "Reviews", Icon: MessageSquare },
  { href: "/settings", label: "Settings", Icon: Settings },
];

export function MerchantSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { mutate: logout, isPending: loggingOut } = useLogout();
  const { data: profile } = useMerchantProfile();

  return (
    <aside className="fixed left-0 top-0 h-screen w-52 bg-[#e8f5e9] flex flex-col z-30 border-r border-[#c8e6c9]">
      {/* Header */}
      <div className="px-4 py-5 border-b border-[#c8e6c9]">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-[#1a5c2a] flex items-center justify-center">
            <Store className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 leading-tight">Merchant Portal</p>
            <p className="text-[11px] text-gray-500 leading-tight">Manage your business</p>
          </div>
        </div>
        {profile && (
          <p className="mt-2 text-xs font-medium text-[#1a5c2a] truncate">{profile.business_name}</p>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-[#1a5c2a] text-white"
                  : "text-gray-600 hover:bg-[#c8e6c9] hover:text-gray-900"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-3 py-4 space-y-2 border-t border-[#c8e6c9]">
        {/* Add New Product CTA */}
        <button
          onClick={() => router.push("/products/new")}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-[#1a5c2a] hover:bg-[#14471f] text-white rounded-lg text-sm font-semibold transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add New Product
        </button>

        <Link
          href="/home"
          className="flex items-center gap-2.5 px-3 py-2 rounded-full border border-[#c8e6c9] text-sm font-semibold text-[#1a5c2a] hover:bg-white transition-colors justify-center"
        >
          <ShoppingBag className="h-4 w-4" />
          Customer Mode
        </Link>

        <Link
          href="/help"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-[#c8e6c9] hover:text-gray-900 transition-colors"
        >
          <HelpCircle className="h-4 w-4" />
          Help Center
        </Link>

        <button
          onClick={() => logout()}
          disabled={loggingOut}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          {loggingOut ? "Signing out..." : "Log Out"}
        </button>
      </div>
    </aside>
  );
}
