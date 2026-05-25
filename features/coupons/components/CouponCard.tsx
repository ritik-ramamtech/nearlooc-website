"use client";

import { useState } from "react";
import { Copy, Check, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Coupon } from "@/types";

interface CouponCardProps {
  coupon: Coupon;
}

export function CouponCard({ coupon }: CouponCardProps) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isExpired = coupon.expires_at
    ? new Date(coupon.expires_at) < new Date()
    : false;

  return (
    <div className="overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest">
      {/* Top strip */}
      <div className="bg-stitch-primary px-4 py-3">
        <p className="text-headline-sm font-bold text-white">{coupon.title}</p>
        {coupon.description && (
          <p className="mt-0.5 text-label-sm text-secondary-fixed">{coupon.description}</p>
        )}
      </div>

      {/* Dashed divider */}
      <div className="flex items-center px-4">
        <div className="h-3 w-3 -ml-7 rounded-full bg-surface" />
        <div className="flex-1 border-t-2 border-dashed border-outline-variant" />
        <div className="h-3 w-3 -mr-7 rounded-full bg-surface" />
      </div>

      {/* Code + actions */}
      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <p className="text-label-sm text-on-surface-variant">Coupon Code</p>
          <p className="mt-0.5 font-mono text-headline-sm font-bold tracking-widest text-on-surface">
            {coupon.code}
          </p>
        </div>
        <button
          onClick={copy}
          disabled={isExpired}
          className="flex items-center gap-1.5 rounded-lg bg-surface-container-low px-3 py-2 text-label-md font-medium text-stitch-primary transition-colors hover:bg-surface-container disabled:opacity-50"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Footer */}
      {coupon.expires_at && (
        <div className="border-t border-outline-variant px-4 py-2">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-on-surface-variant" />
            {isExpired ? (
              <Badge variant="destructive" className="text-label-sm">Expired</Badge>
            ) : (
              <p className="text-label-sm text-on-surface-variant">
                Valid until{" "}
                {new Date(coupon.expires_at).toLocaleDateString("en-IN", {
                  day: "numeric", month: "short", year: "numeric",
                })}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
