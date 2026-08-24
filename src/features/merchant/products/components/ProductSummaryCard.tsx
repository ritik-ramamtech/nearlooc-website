"use client";

import Image from "next/image";
import { BadgeCheck, Package, Tag } from "lucide-react";
import { ProductSummary } from "@/types/merchant";

interface ProductSummaryCardProps {
  product: ProductSummary;
}

export default function ProductSummaryCard({
  product,
}: ProductSummaryCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Image */}

      <div className="relative h-48 w-full bg-gray-100">
        <Image
          src={product.image_url ?? product.images[0]}
          alt={product.title ?? "Offer Cover"}
          fill
          className="object-cover"
        />

        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold shadow">
          {product.category?.name}
        </div>
      </div>

      <div className="space-y-5 p-5">
        <div>
          <h2 className="line-clamp-2 text-lg font-bold text-gray-900">
            {product.title}
          </h2>

          <p className="mt-2 line-clamp-2 text-sm text-gray-500">
            {product.description}
          </p>
        </div>

        {/* Price */}

        <div className="rounded-xl bg-gray-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Base Price
          </p>

          <p className="mt-1 text-3xl font-bold text-gray-900">
            ₹{product.base_price.toLocaleString("en-IN")}
          </p>
        </div>

        {/* Stats */}

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-gray-200 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Package className="h-4 w-4 text-brand-500" />
              <span className="text-xs font-medium text-gray-500">
                Category
              </span>
            </div>

            <p className="font-semibold">{product.category?.name}</p>
          </div>

          <div className="rounded-xl border border-gray-200 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Tag className="h-4 w-4 text-brand-500" />
              <span className="text-xs font-medium text-gray-500">
                Subcategory
              </span>
            </div>

            <p className="font-semibold">{product.subcategory?.name ?? "-"}</p>
          </div>
        </div>

        {/* Status */}

        <div className="flex items-center justify-between rounded-xl border border-gray-200 p-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Status
            </p>

            <p className="mt-1 font-semibold">
              {product.is_active ? "Currently Active" : "Inactive"}
            </p>
          </div>

          <div
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              product.is_active
                ? "bg-emerald-100 text-emerald-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {product.is_active ? (
              <div className="flex items-center gap-1">
                <BadgeCheck className="h-3.5 w-3.5" />
                Active
              </div>
            ) : (
              "Inactive"
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
