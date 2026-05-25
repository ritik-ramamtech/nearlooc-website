"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { VendorCard } from "@/features/vendors/components/VendorCard";
import { useVendors } from "@/features/vendors/hooks";

export default function VendorsPage() {
  const [search, setSearch] = useState("");
  const { data, isPending, isError } = useVendors(
    search ? { search } : undefined
  );

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="border-b border-outline-variant bg-surface-container-lowest px-4 py-4">
        <h1 className="text-headline-md font-bold text-on-surface">Vendors</h1>
        <p className="mt-0.5 text-body-sm text-on-surface-variant">
          Discover local businesses near you
        </p>

        {/* Search */}
        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search vendors..."
            className="w-full rounded-xl border border-outline-variant bg-surface-container-low py-2.5 pl-10 pr-4 text-body-sm focus:outline-none focus:ring-1 focus:ring-stitch-primary"
          />
        </div>
      </div>

      <div className="px-4 py-4">
        {isPending && (
          <div className="grid grid-cols-2 gap-3 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="overflow-hidden rounded-2xl border border-outline-variant">
                <div className="h-24 w-full bg-surface-container" />
                <div className="space-y-2 p-3 pt-7">
                  <div className="h-4 w-3/4 rounded bg-surface-container" />
                  <div className="h-3 w-1/2 rounded bg-surface-container" />
                </div>
              </div>
            ))}
          </div>
        )}

        {isError && (
          <p className="py-10 text-center text-body-sm text-on-surface-variant">
            Failed to load vendors.
          </p>
        )}

        {data && data.items.length === 0 && (
          <p className="py-10 text-center text-body-sm text-on-surface-variant">
            No vendors found.
          </p>
        )}

        {data && data.items.length > 0 && (
          <>
            <p className="mb-3 text-label-sm text-on-surface-variant">
              {data.meta.total} vendors found
            </p>
            <div className="grid grid-cols-2 gap-3">
              {data.items.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
