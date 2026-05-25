"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Store, Heart, Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home",          href: "/home",          icon: Home },
  { label: "Vendors",       href: "/vendors",        icon: Store },
  { label: "Favorites",     href: "/favorites",      icon: Heart },
  { label: "Notifications", href: "/notifications",  icon: Bell },
  { label: "Profile",       href: "/profile",        icon: User },
];

export function ConsumerNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 z-50 w-full border-t border-outline-variant bg-surface-container-lowest">
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-0.5 rounded-xl py-1 transition-colors",
                active ? "text-stitch-primary" : "text-on-surface-variant hover:text-on-surface"
              )}
            >
              <Icon className={cn("h-5 w-5", active && "fill-stitch-primary/10")} />
              <span className="text-label-sm">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
