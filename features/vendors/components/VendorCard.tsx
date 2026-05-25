import Link from "next/link";
import { Star, BadgeCheck, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Vendor } from "../types";

interface VendorCardProps {
  vendor: Vendor;
  className?: string;
}

export function VendorCard({ vendor, className }: VendorCardProps) {
  return (
    <Link
      href={`/vendors/${vendor.id}/products`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      {/* Cover */}
      <div className="relative h-24 w-full overflow-hidden bg-surface-container-low">
        {vendor.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={vendor.cover_url}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-stitch-primary/20 to-stitch-secondary/10" />
        )}

        {/* Logo */}
        <div className="absolute -bottom-5 left-3 h-12 w-12 overflow-hidden rounded-xl border-2 border-surface-container-lowest bg-surface-container-low shadow-sm">
          {vendor.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={vendor.logo_url} alt={vendor.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center bg-stitch-primary/10 text-stitch-primary font-bold text-label-md">
              {vendor.name.charAt(0)}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-3 pb-3 pt-7">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <h3 className="truncate text-body-sm font-semibold text-on-surface">{vendor.name}</h3>
              {vendor.is_verified && (
                <BadgeCheck className="h-4 w-4 shrink-0 text-stitch-primary" />
              )}
            </div>
            {vendor.category_name && (
              <p className="text-label-sm text-on-surface-variant">{vendor.category_name}</p>
            )}
          </div>
          {vendor.is_verified && (
            <Badge variant="secondary" className="shrink-0 text-label-sm">Verified</Badge>
          )}
        </div>

        {vendor.location && (
          <p className="mt-1 truncate text-label-sm text-on-surface-variant">{vendor.location}</p>
        )}

        {/* Stats */}
        <div className="mt-3 flex items-center gap-3 text-label-sm text-on-surface-variant">
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-on-surface">{vendor.rating.toFixed(1)}</span>
            <span>({vendor.review_count})</span>
          </span>
          <span className="flex items-center gap-1">
            <Package className="h-3.5 w-3.5" />
            {vendor.product_count} products
          </span>
        </div>
      </div>
    </Link>
  );
}
