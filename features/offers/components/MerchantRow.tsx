import Link from "next/link";
import { ChevronRight, MapPin, Star, BadgeCheck } from "lucide-react";

interface MerchantRowProps {
  merchantId: string | null;
  merchantName: string;
  merchantLogoUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export function MerchantRow({
  merchantId,
  merchantName,
  merchantLogoUrl,
  latitude,
  longitude,
}: MerchantRowProps) {
  const content = (
    <div className="flex items-center gap-3 rounded-xl border border-outline-variant bg-surface-container-lowest p-3 transition-colors hover:bg-surface-container">
      {/* Logo */}
      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full border border-outline-variant bg-surface-container-low">
        {merchantLogoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={merchantLogoUrl} alt={merchantName} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-label-sm font-bold text-stitch-primary">
            {merchantName.slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="truncate text-label-md font-semibold text-on-surface">{merchantName}</p>
          <BadgeCheck className="h-4 w-4 shrink-0 text-stitch-secondary" />
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-label-sm text-on-surface-variant">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span>Verified Merchant</span>
          {(latitude || longitude) && (
            <>
              <span>·</span>
              <MapPin className="h-3 w-3" />
              <span>Nearby</span>
            </>
          )}
        </div>
      </div>

      <ChevronRight className="h-4 w-4 shrink-0 text-on-surface-variant" />
    </div>
  );

  if (!merchantId) return <div>{content}</div>;

  return (
    <Link href={`/vendors/${merchantId}/products`}>
      {content}
    </Link>
  );
}
