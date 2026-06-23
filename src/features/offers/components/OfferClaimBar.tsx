"use client";

import Link from "next/link";

interface OfferClaimBarProps {
  merchantId?: string | null;
}

export function OfferClaimBar({ merchantId }: OfferClaimBarProps) {
  if (!merchantId) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-outline-variant bg-surface-container-lowest px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
      <div className="mx-auto flex max-w-container-max items-center gap-3">
        <Link
          href={`/vendors/${merchantId}/products`}
          className="flex h-12 flex-1 items-center justify-center rounded-xl border-2 border-stitch-primary text-label-md font-semibold text-stitch-primary transition-colors hover:bg-surface-container"
        >
          View Vendor Deals
        </Link>
      </div>
    </div>
  );
}
