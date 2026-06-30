import Link from "next/link";
import { Star, BadgeCheck, Package, MapPin, Globe, Image as ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
        "group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_8px_22px_rgba(20,27,43,0.06)] transition-shadow hover:shadow-[0_12px_28px_rgba(20,27,43,0.10)]",
        className
      )}
    >
      {/* Cover placeholder - no cover_url from backend */}
      <div className="relative h-32 w-full bg-gradient-to-br from-emerald-100 to-slate-100">
        {/* Logo */}
        <div className="absolute -bottom-6 left-3 h-14 w-14 overflow-hidden rounded-xl border-2 border-surface-container-lowest bg-surface-container-low shadow-sm">
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
      <div className="flex flex-1 flex-col px-3 pb-3 pt-8">
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
            <Badge variant="secondary" className="hidden shrink-0 text-label-sm sm:inline-flex">Verified</Badge>
          )}
        </div>

        {locationLabel && (
          <p className="mt-1 flex items-center gap-1 truncate text-label-sm text-on-surface-variant">
            <MapPin className="h-3 w-3 shrink-0" />
            {locationLabel}
          </p>
        )}

        {/* Stats */}
        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-3 text-label-sm text-on-surface-variant">
          <span className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-on-surface">{(vendor.rating ?? 0).toFixed(1)}</span>
            <span className="hidden sm:inline">({vendor.review_count ?? 0})</span>
          </span>
          <span className="flex items-center gap-1">
            <Package className="h-3.5 w-3.5" />
            <span>{vendor.product_count ?? 0}</span>
            <span className="hidden sm:inline">products</span>
          </span>
        </div>

        {/* Action Buttons */}
        {(vendor.website || (vendor.stores_imgs_url && vendor.stores_imgs_url.length > 0)) && (
          <div className="mt-4 flex items-center gap-2">
            {vendor.website && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-8 px-2 text-[11px] sm:text-xs font-medium z-10 hover:bg-slate-50 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(vendor.website!, "_blank", "noopener,noreferrer");
                }}
              >
                <Globe className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                <span className="truncate">Website</span>
              </Button>
            )}
            {vendor.stores_imgs_url && vendor.stores_imgs_url.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-8 px-2 text-[11px] sm:text-xs font-medium z-10 hover:bg-slate-50 transition-colors"
                onClick={() => {
                  // The parent <Link> will handle the navigation to the vendor products page
                }}
              >
                <ImageIcon className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                <span className="truncate">Store</span>
              </Button>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}


