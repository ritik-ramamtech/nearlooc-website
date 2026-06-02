"use client";

import { use } from "react";
import { BadgeCheck, Star } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { VendorProductList } from "@/features/vendors/components/VendorProductList";
import { useVendorProducts } from "@/features/vendors/hooks";

interface Props {
  params: Promise<{ id: string }>;
}

export default function VendorProductsPage({ params }: Props) {
  const { id } = use(params);
  const { data } = useVendorProducts(id);
  const vendor = data?.vendor;

  return (
    <>
      <TopBar title={vendor?.business_name ?? "Vendor"} />
      <div className="pt-14">
        {/* Vendor hero */}
        {vendor && (
          <div className="relative">
            <div className="h-28 w-full bg-gradient-to-br from-stitch-primary/20 to-stitch-secondary/10" />

            <div className="px-4 pb-4">
              <div className="flex items-end gap-3 -mt-6">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border-2 border-surface bg-surface-container-low shadow-sm">
                  {vendor.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={vendor.logo_url}
                      alt={vendor.business_name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-stitch-primary/10 text-lg font-bold text-stitch-primary">
                      {vendor.business_name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="pb-1">
                  <div className="flex items-center gap-1">
                    <h2 className="text-[15px] font-bold text-on-surface">{vendor.business_name}</h2>
                    {vendor.is_verified && (
                      <BadgeCheck className="h-4 w-4 text-stitch-primary" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[12px] text-on-surface-variant">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-on-surface">{vendor.rating.toFixed(1)}</span>
                    <span>· {vendor.review_count} reviews</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products */}
        <div className="border-t border-outline-variant px-4 py-4">
          <h3 className="mb-4 text-[15px] font-semibold text-on-surface">All Products</h3>
          <VendorProductList vendorId={id} />
        </div>
      </div>
    </>
  );
}
