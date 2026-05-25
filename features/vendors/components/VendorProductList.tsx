"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useVendorProducts } from "../hooks";
import type { VendorProduct } from "../types";

interface VendorProductListProps {
  vendorId: string;
}

function ProductItem({ product }: { product: VendorProduct }) {
  return (
    <div className="flex gap-3 rounded-xl border border-outline-variant bg-surface-container-lowest p-3">
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-surface-container-low">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-on-surface-variant text-label-sm">
            No img
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div>
          <h3 className="truncate text-body-sm font-semibold text-on-surface">{product.name}</h3>
          {product.category_name && (
            <p className="text-label-sm text-on-surface-variant">{product.category_name}</p>
          )}
        </div>
        <p className="text-body-sm font-bold text-stitch-primary">
          ₹{product.price.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export function VendorProductList({ vendorId }: VendorProductListProps) {
  const [search, setSearch] = useState("");
  const { data, isPending, isError } = useVendorProducts(vendorId);

  const filtered = data?.products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
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
          className="w-full rounded-xl border border-outline-variant bg-surface-container-low py-2.5 pl-10 pr-4 text-body-sm focus:outline-none focus:ring-1 focus:ring-stitch-primary"
        />
      </div>

      {isPending && (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-3 rounded-xl border border-outline-variant p-3">
              <div className="h-16 w-16 shrink-0 rounded-lg bg-surface-container" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-4 w-3/4 rounded bg-surface-container" />
                <div className="h-3 w-1/2 rounded bg-surface-container" />
              </div>
            </div>
          ))}
        </div>
      )}

      {isError && (
        <p className="py-6 text-center text-body-sm text-on-surface-variant">
          Failed to load products.
        </p>
      )}

      {!isPending && !isError && filtered.length === 0 && (
        <p className="py-6 text-center text-body-sm text-on-surface-variant">
          {search ? "No products match your search." : "No products available."}
        </p>
      )}

      <div className="space-y-3">
        {filtered.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>

      {data && (
        <p className="text-center text-label-sm text-on-surface-variant">
          {data.products.length} of {data.meta.total} products
        </p>
      )}
    </div>
  );
}
