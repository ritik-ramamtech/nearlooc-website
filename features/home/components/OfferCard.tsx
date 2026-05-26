"use client";

import Link from "next/link";
import { Star, Clock, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Offer } from "@/types";

interface OfferCardProps {
  offer: Offer & { merchant?: { id: string; name: string; logo_url: string | null } };
  className?: string;
}

export function OfferCard({ offer, className }: OfferCardProps) {
  const merchantName = offer.merchant?.name ?? offer.merchant_name ?? null;

  return (
    <div style={{ width: 240 }} className={cn(className)}>
      <Link
        href={`/offers/${offer.id}`}
        className="group block overflow-hidden rounded-xl bg-white transition-all duration-200 hover:-translate-y-0.5"
        style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05)" }}
      >
        {/* Image — hard 190px */}
        <div style={{ height: 190, position: "relative", overflow: "hidden" }} className="bg-gray-100">
          {offer.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={offer.image_url}
              alt={offer.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              className="transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-gray-400">
              No image
            </div>
          )}

          {offer.discount_percentage > 0 && (
            <span
              style={{
                position: "absolute",
                top: 10,
                left: 10,
                background: "#ef4444",
                color: "#fff",
                fontSize: 11,
                fontWeight: 700,
                borderRadius: 999,
                padding: "3px 8px",
                lineHeight: 1,
              }}
            >
              {Math.round(offer.discount_percentage)}%
            </span>
          )}

          <button
            onClick={(e) => e.preventDefault()}
            style={{
              position: "absolute",
              bottom: 10,
              right: 10,
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
              border: "none",
              cursor: "pointer",
            }}
          >
            <Heart
              style={{ width: 14, height: 14 }}
              className={cn(offer.is_favorite ? "fill-red-500 text-red-500" : "text-gray-400")}
            />
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            padding: "10px 12px",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          {/* Title — 1 line hard clip */}
          <p
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "#111827",
              lineHeight: "1.35",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              margin: 0,
            }}
          >
            {offer.title}
          </p>

          {/* Price */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "nowrap" }}>
            {offer.original_price > offer.discounted_price && (
              <span style={{ fontSize: 11, color: "#9ca3af", textDecoration: "line-through" }}>
                ₹{offer.original_price.toLocaleString()}
              </span>
            )}
            <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>
              ₹{offer.discounted_price.toLocaleString()}
            </span>
            {offer.discount_percentage > 0 && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: "#16a34a",
                  background: "#dcfce7",
                  borderRadius: 999,
                  padding: "2px 6px",
                  lineHeight: 1.4,
                  whiteSpace: "nowrap",
                }}
              >
                {Math.round(offer.discount_percentage)}% off
              </span>
            )}
          </div>

          {/* Merchant */}
          {merchantName && (
            <div style={{ display: "flex", alignItems: "center", gap: 4, overflow: "hidden" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {merchantName}
              </span>
              <Star style={{ width: 10, height: 10, flexShrink: 0, fill: "#fbbf24", color: "#fbbf24" }} />
              <span style={{ fontSize: 11, color: "#374151" }}>{offer.rating.toFixed(1)}</span>
              <span style={{ fontSize: 11, color: "#9ca3af" }}>({offer.review_count})</span>
            </div>
          )}

          {/* Timer */}
          {offer.promo_time_left && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderTop: "1px solid #f3f4f6",
                paddingTop: 6,
                marginTop: "auto",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Clock style={{ width: 11, height: 11, color: "#9ca3af" }} />
                <span style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 500 }}>
                  Ends in
                </span>
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#16a34a", fontVariantNumeric: "tabular-nums" }}>
                {offer.promo_time_left}
              </span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
