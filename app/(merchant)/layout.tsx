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

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", Icon: LayoutDashboard },
  { href: "/products", label: "Products", Icon: Package },
  { href: "/locations", label: "Locations", Icon: MapPin },
  { href: "/reviews", label: "Reviews", Icon: MessageSquare },
  { href: "/settings", label: "Settings", Icon: Settings },
];

export default function MerchantLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { mutate: logout, isPending: loggingOut } = useLogout();

  return (
    <div className="min-h-screen bg-[#f0f7f0]">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <MerchantSidebar />
      </div>

      {/* Mobile top bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 h-14 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-[#1a5c2a] flex items-center justify-center">
            <Store className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-sm font-bold text-gray-900">Merchant Portal</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/home"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-gray-200 text-gray-600 text-xs font-semibold hover:border-[#1a5c2a] hover:text-[#1a5c2a] transition-colors"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Customer
          </Link>
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </header>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/40"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="absolute left-0 top-0 h-full w-64 bg-[#e8f5e9] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-4 border-b border-[#c8e6c9]">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-[#1a5c2a] flex items-center justify-center">
                  <Store className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Merchant Portal</p>
                  <p className="text-[11px] text-gray-500">Manage your business</p>
                </div>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg hover:bg-[#c8e6c9] transition-colors"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1">
              {NAV_ITEMS.map(({ href, label, Icon }) => {
                const active = pathname === href || pathname.startsWith(href + "/");
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
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

            <div className="px-3 py-4 space-y-2 border-t border-[#c8e6c9]">
              <button
                onClick={() => { router.push("/products/new"); setMobileOpen(false); }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-[#1a5c2a] hover:bg-[#14471f] text-white rounded-lg text-sm font-semibold transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add New Product
              </button>
              <Link
                href="/help"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-[#c8e6c9] transition-colors"
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
          </div>
        </div>
      )}

      {/* Page content */}
      <div className="md:ml-52 pt-14 md:pt-0 min-h-screen">
        {children}
      </div>
    </div>
  );
}
