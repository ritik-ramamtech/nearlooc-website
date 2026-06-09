"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface OfferClaimBarProps {
  price: number;
  isFavorite?: boolean;
  merchantId?: string | null;
  onToggleFavorite?: () => void;
  onClaim?: () => void;
}

export function OfferClaimBar({
  price,
  isFavorite = false,
  merchantId,
  onToggleFavorite,
  onClaim,
}: OfferClaimBarProps) {
  const [isFav, setIsFav] = useState(isFavorite);

  const handleFavorite = () => {
    setIsFav((prev) => !prev);
    onToggleFavorite?.();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-outline-variant bg-surface-container-lowest px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
      <div className="mx-auto flex max-w-container-max items-center gap-3">
        {/* Favorite toggle */}
        <button
          onClick={handleFavorite}
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 transition-all",
            isFav
              ? "border-red-200 bg-red-50 text-red-500"
              : "border-outline-variant bg-white text-on-surface-variant hover:border-red-200 hover:text-red-400"
          )}
        >
          <Heart className={cn("h-5 w-5 transition-all", isFav && "fill-red-500")} />
        </button>

        {/* Claim button */}
        <button
          onClick={onClaim}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-stitch-primary py-3.5 text-label-md font-semibold text-white transition-colors hover:bg-stitch-secondary active:scale-[0.98]"
        >
          Claim Deal
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-label-sm font-bold">
            ₹{price.toLocaleString()}
          </span>
        </button>

        {/* Contact Merchant */}
        {merchantId && (
          <Link
            href={`/vendors/${merchantId}/products`}
            className="flex h-12 shrink-0 items-center justify-center rounded-xl border-2 border-stitch-primary px-3 text-label-sm font-semibold text-stitch-primary transition-colors hover:bg-surface-container"
          >
            Contact
          </Link>
        )}
      </div>
    </div>
  );
}
