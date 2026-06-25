"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { VendorCard } from "@/features/vendors/components/VendorCard";
import { VendorCardSkeleton } from "@/features/vendors/components/VendorCardSkeleton";
import { useVendors } from "@/features/vendors/hooks";

export function FeaturedVendors() {
  const { data, isPending, isError } = useVendors({ limit: 8 });

  if (isError) return null;

  const vendors = data
    ? Array.from(new Map(data.items.map((v) => [v.id, v])).values())
    : [];

  if (!isPending && vendors.length === 0) return null;

  return (
    <section className="bg-[#f7faf8] px-4 py-8 sm:px-6 lg:px-16">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[28px] font-extrabold leading-tight text-on-surface sm:text-[32px]">
            Featured Vendors
          </h2>
          <p className="mt-2 text-[13px] text-on-surface-variant">
            Trusted businesses near you
          </p>
        </div>

        <Link
          href="/vendors"
          className="flex shrink-0 items-center gap-1 pt-1 text-[13px] font-bold text-stitch-secondary hover:underline"
        >
          See All <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div
        className="scrollbar-hide overflow-x-auto pb-3"
        style={{ WebkitOverflowScrolling: "touch", scrollSnapType: "x mandatory" }}
      >
        <div className="flex gap-4">
          {isPending
            ? [1, 2, 3, 4].map((i) => (
                <div key={i} className="w-[208px] shrink-0 sm:w-[224px]">
                  <VendorCardSkeleton count={1} className="grid-cols-1" />
                </div>
              ))
            : vendors.map((vendor) => (
                <div
                  key={vendor.id}
                  className="w-[208px] shrink-0 sm:w-[224px]"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <VendorCard vendor={vendor} className="h-full min-h-[318px]" />
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
