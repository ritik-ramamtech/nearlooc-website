"use client";

import RecentActivity from "@/features/merchant/products/components/ProductActivity";
import ProductGallery from "@/features/merchant/products/components/ProductGallery";
import ProductHeader from "@/features/merchant/products/components/ProductHeader";
import ProductInfoCard from "@/features/merchant/products/components/ProductInfoCard";
import ProductLocationsCard from "@/features/merchant/products/components/ProductLocationsCard";
import ProductStats from "@/features/merchant/products/components/ProductStats";
import { useMerchantProduct } from "@/features/merchant/products/hooks";
import ProductDetailSkeleton from "./ProductDetailSkeleton";
import { ArrowLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function ProductDetailPage({ id }: { id: string }) {
  const { data, isPending } = useMerchantProduct(id);

  if (isPending || !data?.data) {
    return <ProductDetailSkeleton />;
  }

  const product = data.data;
  const summary = data.summary;
  const activity = data.activities;

  return (
    <div className="min-h-screen bg-[oklch(0.985_0.006_145)]">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:py-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <nav
            className="flex items-center gap-1.5 text-sm text-muted-foreground"
            aria-label="Breadcrumb"
          >
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 font-medium text-foreground transition-colors hover:bg-muted"
            >
              <ArrowLeft className="size-4" />
              Products
            </Link>
            <ChevronRight className="size-3.5 text-muted-foreground/50" />
            <span className="truncate text-muted-foreground">
              {product.name}
            </span>
          </nav>

          <span className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm sm:inline-flex">
            <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              V
            </span>
            Verde Merchant
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <ProductHeader product={product} />
          <ProductStats summary={summary} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="flex flex-col gap-6 lg:col-span-6">
              <ProductGallery product={product} />
              <ProductInfoCard product={product} />
            </div>

            <div className="flex flex-col gap-6 lg:col-span-6">
              <ProductLocationsCard product={product} />
              <RecentActivity activities={activity}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
