"use client";

import Link from "next/link";
import { ArrowRight, User, MapPin, Bell } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-[#f0f7f0]">
      <header className="bg-white border-b border-gray-200 px-6 py-3">
        <h1 className="text-lg font-bold text-gray-900">Settings</h1>
        <p className="text-xs text-gray-400">Manage your account preferences</p>
      </header>

      <div className="p-6 max-w-2xl mx-auto space-y-3">
        {[
          { href: "/settings/profile", Icon: User, label: "Merchant Profile", desc: "Update business details and branding" },
          { href: "/locations", Icon: MapPin, label: "Store Locations", desc: "Manage your physical branches" },
          { href: "#", Icon: Bell, label: "Notifications", desc: "Coming soon" },
        ].map(({ href, Icon, label, desc }) => (
          <Link
            key={label}
            href={href}
            className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 px-5 py-4 hover:border-[#1a5c2a] hover:shadow-sm transition-all group"
          >
            <div className="h-10 w-10 rounded-lg bg-[#f0f7f0] flex items-center justify-center shrink-0">
              <Icon className="h-5 w-5 text-[#1a5c2a]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">{label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-[#1a5c2a] transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}
