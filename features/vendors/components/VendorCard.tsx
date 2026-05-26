import Link from "next/link";
import { Star, BadgeCheck, Package, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Vendor } from "../types";

interface VendorCardProps {
  vendor: Vendor;
  className?: string;
}

function getPrimaryLocation(vendor: Vendor): string | null {
  const primary = vendor.locations?.find((l) => l.is_primary) ?? vendor.locations?.[0];
  if (!primary) return null;
  return [primary.city, primary.state].filter(Boolean).join(", ") || null;
}

export function VendorCard({ vendor, className }: VendorCardProps) {
  const locationLabel = getPrimaryLocation(vendor);

  return (
    <Link
      href={`/vendors/${vendor.id}/products`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      {/* Cover placeholder — backend has no cover_url */}
      <div className="relative h-24 w-full overflow-hidden bg-gradient-to-br from-stitch-primary/20 to-stitch-secondary/10">
        {/* Logo */}
        <div className="absolute -bottom-5 left-3 h-12 w-12 overflow-hidden rounded-xl border-2 border-surface-container-lowest bg-surface-container-low shadow-sm">
          {vendor.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={vendor.logo_url} alt={vendor.business_name ?? ""} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center bg-stitch-primary/10 text-stitch-primary font-bold text-label-md">
              {vendor.business_name?.charAt(0) ?? "?"}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-3 pb-3 pt-7">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <h3 className="truncate text-body-sm font-semibold text-on-surface">
                {vendor.business_name ?? "Unnamed Vendor"}
              </h3>
              {vendor.is_verified && (
                <BadgeCheck className="h-4 w-4 shrink-0 text-stitch-primary" />
              )}
            </div>
            {vendor.bio && (
              <p className="mt-0.5 line-clamp-1 text-label-sm text-on-surface-variant">{vendor.bio}</p>
            )}
          </div>
          {vendor.is_verified && (
            <Badge variant="secondary" className="shrink-0 text-label-sm">Verified</Badge>
          )}
        </div>

        {locationLabel && (
          <p className="mt-1 flex items-center gap-1 truncate text-label-sm text-on-surface-variant">
            <MapPin className="h-3 w-3 shrink-0" />
            {locationLabel}
          </p>
        )}

        {/* Stats */}
        <div className="mt-3 flex items-center gap-3 text-label-sm text-on-surface-variant">
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-on-surface">{(vendor.rating ?? 0).toFixed(1)}</span>
            <span>({vendor.review_count ?? 0})</span>
          </span>
          <span className="flex items-center gap-1">
            <Package className="h-3.5 w-3.5" />
            {vendor.product_count ?? 0} products
          </span>
        </div>
      </div>
    </Link>
  );
}
