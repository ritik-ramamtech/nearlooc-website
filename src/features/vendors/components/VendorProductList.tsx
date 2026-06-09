"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { useVendorProducts } from "../hooks";
import { useFavorites } from "@/features/favorites";
import { OfferCard } from "@/features/home";
import type { Offer } from "@/types";
import type { VendorProduct, VendorSummary } from "../types";

interface VendorProductListProps {
  vendorId: string;
}

function adaptToOffer(
  product: VendorProduct,
  vendor: VendorSummary,
  favoriteIds: Set<string>
): Offer & { merchant: { id: string; name: string; logo_url: string | null } } {
  const offer = product.active_offer;
  // Mirror home feed logic: prefer images[0] over image_url
  const imageUrl = product.images?.[0] ?? product.image_url ?? null;

  return {
    id: offer?.id ?? product.id,
    title: product.title ?? product.name,
    description: product.description,
    image_url: imageUrl,
    images: product.images ?? [],
    category_id: product.category_id ?? "",
    subcategory_id: product.subcategory_id ?? null,
    category_name: product.category_name ?? null,
    merchant_id: vendor.id,
    merchant_name: vendor.business_name,
    merchant_logo_url: vendor.logo_url,
    original_price: product.base_price,
    discounted_price: offer?.discounted_price ?? product.base_price,
    discount_percentage: offer?.discount_percentage ?? 0,
    rating: offer?.rating ?? 0,
    review_count: offer?.review_count ?? 0,
    badge: offer?.badge ?? null,
    promo_price: offer?.promo_price ?? null,
    promo_end_at: offer?.promo_end_at ?? null,
    promo_time_left: offer?.promo_time_left ?? null,
    duration: null,
    features: null,
    highlights: null,
    terms: null,
    share_url: null,
    latitude: null,
    longitude: null,
    is_favorite: offer ? favoriteIds.has(offer.id) : false,
    merchant: {
      id: vendor.id,
      name: vendor.business_name,
      logo_url: vendor.logo_url,
    },
  };
}

export function VendorProductList({ vendorId }: VendorProductListProps) {
  const [search, setSearch] = useState("");
  const { data, isPending, isError } = useVendorProducts(vendorId);
  const { data: favData } = useFavorites();

  const favoriteIds = useMemo(() => {
    const items = favData?.items ?? [];
    return new Set(items.map((o) => o.id));
  }, [favData]);

  const filtered = data?.products?.filter((p) =>
    (p.title ?? p.name).toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full rounded-xl border border-outline-variant bg-surface-container-low py-2.5 pl-10 pr-4 text-[13px] focus:outline-none focus:ring-1 focus:ring-stitch-primary"
        />
      </div>

      {/* Skeleton — same 240px width as OfferCard */}
      {isPending && (
        <div className="flex flex-wrap gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse overflow-hidden rounded-2xl border border-outline-variant" style={{ width: 240 }}>
              <div className="bg-surface-container" style={{ height: 190 }} />
              <div className="space-y-2 p-2.5">
                <div className="h-3 w-3/4 rounded bg-surface-container" />
                <div className="h-3 w-1/2 rounded bg-surface-container" />
                <div className="h-4 w-1/3 rounded bg-surface-container" />
              </div>
            </div>
          ))}
        </div>
      )}

      {isError && (
        <p className="py-10 text-center text-[13px] text-on-surface-variant">
          Failed to load products.
        </p>
      )}

      {!isPending && !isError && filtered.length === 0 && (
        <p className="py-10 text-center text-[13px] text-on-surface-variant">
          {search ? "No products match your search." : "No products available."}
        </p>
      )}

      {/* Cards — exact same size/shape as home feed */}
      {!isPending && filtered.length > 0 && data?.vendor && (
        <div className="flex flex-wrap gap-3">
          {filtered.map((product) => (
            <OfferCard
              key={product.id}
              offer={adaptToOffer(product, data.vendor, favoriteIds)}
            />
          ))}
        </div>
      )}

      {data && data.products.length > 0 && (
        <p className="py-1 text-center text-[11px] text-on-surface-variant">
          Showing {filtered.length} of {data.meta.total} products
        </p>
      )}
    </div>
  );
}
