"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Star, Clock, Heart, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Offer } from "@/types";

interface OfferCardProps {
  offer: Offer & { merchant?: { id: string; name: string; logo_url: string | null } };
  className?: string;
}

function calcTimeLeft(endAt: string | null): string | null {
  if (!endAt) return null;
  const diff = new Date(endAt).getTime() - Date.now();
  if (diff <= 0) return "00 : 00 : 00";
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return `${String(h).padStart(2, "0")} : ${String(m).padStart(2, "0")} : ${String(s).padStart(2, "0")}`;
}

function useCountdown(endAt: string | null) {
  const [timeLeft, setTimeLeft] = useState(() => calcTimeLeft(endAt));
  useEffect(() => {
    if (!endAt) return;
    const id = setInterval(() => setTimeLeft(calcTimeLeft(endAt)), 1000);
    return () => clearInterval(id);
  }, [endAt]);
  return timeLeft ?? null;
}

function getMockedViews(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const val = (Math.abs(hash % 20) + 8) / 10;
  return `${val.toFixed(1)}k`;
}

export function OfferCard({ offer, className }: OfferCardProps) {
  const merchantName = offer.merchant?.name ?? offer.merchant_name ?? null;
  const [isFav, setIsFav] = useState(!!offer.is_favorite);
  const countdown = useCountdown(offer.promo_end_at);
  const displayTimer = countdown ?? offer.promo_time_left ?? null;
  const mockViews = getMockedViews(offer.id);

  return (
    <div className={cn("w-[300px] flex-shrink-0", className)}>
      <Link
        href={`/offers/${offer.id}`}
        className="group flex flex-col overflow-hidden rounded-[14px] bg-white transition-shadow hover:shadow-lg"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
      >
        {/* Image — 65% of card */}
        <div className="relative h-[305px] w-full overflow-hidden bg-gray-100">
          {offer.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={offer.image_url}
              alt={offer.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">
              No image
            </div>
          )}

          {/* Discount badge — top left */}
          {offer.discount_percentage > 0 && (
            <span
              className="absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 text-[12px] font-bold text-white leading-none"
              style={{ backgroundColor: "#ef4444" }}
            >
              {Math.round(offer.discount_percentage)}%
            </span>
          )}

          {/* Views badge — top right */}
          <span
            className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-medium text-white leading-none"
            style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
          >
            <Eye className="h-3.5 w-3.5" />
            {mockViews}
          </span>

          {/* Favorite button — bottom right */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsFav((v) => !v);
            }}
            className="absolute bottom-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-transform active:scale-90"
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-colors",
                isFav ? "fill-red-500 text-red-500" : "text-gray-400"
              )}
            />
          </button>
        </div>

        {/* Card body — 35% */}
        <div className="flex flex-col gap-2" style={{ padding: "12px 14px" }}>
          {/* Product name */}
          <h3
            className="line-clamp-2 leading-snug"
            style={{ fontSize: 15, fontWeight: 500, color: "#111827" }}
          >
            {offer.title}
          </h3>

          {/* Price row */}
          <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
            {offer.original_price > offer.discounted_price && (
              <span className="line-through" style={{ fontSize: 13, color: "#9ca3af" }}>
                ₹{offer.original_price.toLocaleString()}
              </span>
            )}
            <span style={{ fontSize: 16, fontWeight: 500, color: "#111827" }}>
              ₹{offer.discounted_price.toLocaleString()}
            </span>
            {offer.discount_percentage > 0 && (
              <span
                className="rounded-full px-2 py-0.5 leading-none"
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  backgroundColor: "#dcfce7",
                  color: "#16a34a",
                }}
              >
                {Math.round(offer.discount_percentage)}% off
              </span>
            )}
          </div>

          {/* Seller row */}
          {merchantName && (
            <div className="flex items-center gap-1 overflow-hidden">
              <span className="h-2 w-2 flex-shrink-0 rounded-full bg-green-500" />
              <span className="truncate" style={{ fontSize: 12, color: "#6b7280" }}>
                {merchantName}
              </span>
              <Star className="h-3 w-3 flex-shrink-0 fill-amber-400 text-amber-400" />
              <span style={{ fontSize: 12, color: "#374151" }}>{offer.rating.toFixed(1)}</span>
              <span style={{ fontSize: 12, color: "#9ca3af" }}>({offer.review_count})</span>
            </div>
          )}

          {/* Timer */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-2">
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-gray-400" />
              <span
                className="uppercase tracking-wide"
                style={{ fontSize: 10, color: "#9ca3af" }}
              >
                Ends in
              </span>
            </div>
            {displayTimer ? (
              <span
                className="tabular-nums"
                style={{ fontSize: 14, fontWeight: 500, color: "#16a34a" }}
              >
                {displayTimer}
              </span>
            ) : (
              <span style={{ fontSize: 12, color: "#9ca3af" }}>—</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
