import { EmptyState } from "@/components/ui";
import { formatLocalDateShort } from "@/lib/utils";
import { MerchantSale } from "@/types/merchant";
import { RotateCcw, Star, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ConfirmDialog from "./ConfirmDialog";
import InventoryFilters from "./InventoryFilters";
import { useRouter, useSearchParams } from "next/navigation";
import { Category } from "@/types";
import { useActiveSales, useSalesHistory } from "../../sales/hooks";
import { Skeleton } from "@/components/ui/skeleton";

type SalesTabProps = {
  emptyLabel: string;
  emptyDesc: string;
  onDeactivate: (id: string) => void;
  active: boolean;
  categories: Category[];
};

export default function SalesTab({
  emptyLabel,
  emptyDesc,
  onDeactivate,
  categories,
  active,
}: SalesTabProps) {
  const [open, setOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<MerchantSale | null>();

  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedCategoryId = searchParams.get("category_id") ?? "";
  const selectedSubCategoryId = searchParams.get("subcategory_id") ?? "";
  const search = searchParams.get("search") ?? "";
  const isActive = searchParams.get("is_active") ?? null;
  const maxPrice = searchParams.get("max_price") ?? undefined;
  const minPrice = searchParams.get("min_price") ?? undefined;

  const query = {
    ...(selectedCategoryId && { category_id: selectedCategoryId }),
    ...(selectedSubCategoryId && {
      subcategory_id: selectedSubCategoryId,
    }),
    ...(isActive !== null && { is_active: isActive === "true" }),
    ...(maxPrice && { max_price: Number(maxPrice) }),
    ...(minPrice && { min_price: Number(minPrice) }),
  };

  const { data: activeSalesData, isPending } = useActiveSales(active, query);
  const { data: historySalesData, isPending: loadingHistory } = useSalesHistory(!active, query);

  const isLoading = active ? isPending : loadingHistory;

  const offers = active
    ? (activeSalesData?.data ?? [])
    : (historySalesData?.data ?? []);

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    router.replace(`?${params.toString()}`);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <InventoryFilters
        search={search}
        onSearchChange={(value) => updateParams({ search: value })}
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onCategoryChange={(value) => updateParams({ category_id: value })}
        selectedSubCategoryId={selectedSubCategoryId}
        onSubCategoryChange={(value) => updateParams({ subcategory_id: value })}
        showPrice
        minPrice={minPrice}
        maxPrice={maxPrice}
        onMinPriceChange={(value) => updateParams({ min_price: value })}
        onMaxPriceChange={(value) => updateParams({ max_price: value })}
      />

      <table className="w-full">
        <thead className="bg-gray-50">
          <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
            <th className="px-6 py-4">Product</th>
            <th className="px-4 py-4">Sale</th>
            <th className="px-4 py-4">Rating</th>
            <th className="px-4 py-4">Ends</th>
            <th className="px-4 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {isLoading ? (
            <TableSkeleton rows={6} />
          ) : offers.length > 0 ? (
            offers.map((o) => {
              const now = new Date();

              const hasEnded = o.promo_end_at ? new Date(o.promo_end_at) <= now : false;

              const status = !o.is_active
                ? "ended_early"
                : hasEnded
                  ? "ended"
                  : "active";
              return (
                <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                  {/* Product */}
                  <td className="px-6 py-4 w-[40%]">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 overflow-hidden rounded-xl bg-brand-50">
                        {o.image_url ? (
                          <Image
                            src={o.image_url}
                            alt={o.product.name}
                            width={56}
                            height={56}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Tag className="h-5 w-5 text-gray-300" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 block font-semibold text-gray-900">
                          {o.product.name}
                        </p>

                        {o.badge && (
                          <span className="mt-1 inline-flex rounded-full bg-orange-100 px-2 py-1 text-[11px] font-semibold text-orange-600">
                            {o.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Sale */}
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-semibold">₹{o.discounted_price}</p>

                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-400 line-through">
                          ₹{o.product.base_price}
                        </span>

                        <span className="font-medium text-green-600 text-md">
                          {o.discount_percentage}% OFF
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Rating */}
                  <td className="px-4 py-4">
                    {o.rating > 0 ? (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />

                        <span className="text-sm">
                          {o.rating}

                          <span className="text-gray-500">
                            {" "}
                            ({o.review_count})
                          </span>
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>

                  {/* Ends */}
                  <td className="px-4 py-4 text-gray-600">
                    {formatLocalDateShort(o.promo_end_at)}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        status === "active"
                          ? "bg-green-100 text-green-700"
                          : status === "ended"
                            ? "bg-gray-100 text-gray-600"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {status === "active"
                        ? "Active"
                        : status === "ended"
                          ? "Ended"
                          : "Ended Early"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/products/${o.product.id}/offers/${o.id}`}
                        className="rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
                      >
                        View
                      </Link>

                      {active && o.is_active && (
                        <button
                          onClick={() => {
                            setOpen(true);
                            setSelectedOffer(o);
                          }}
                          className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                        >
                          Deactivate
                        </button>
                      )}

                      {!active && (
                        <Link
                          href={`/products/${o.product.id}/offers/new?from=${o.id}`}
                          className="flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-2 text-sm font-medium text-brand-600 hover:bg-brand-100"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                          Launch Sale Again
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={6}>
                <EmptyState
                  title="No products yet"
                  subtitle="Start building your catalog..."
                />
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="End Offer Early"
        description={
          selectedOffer
            ? `"${selectedOffer.product.name}" will become inactive and won't be visible to users anymore.`
            : ""
        }
        confirmText="Deactivate Offer"
        onConfirm={() => {
          if (!selectedOffer) return;

          onDeactivate(selectedOffer.id);
          setOpen(false);
        }}
      ></ConfirmDialog>
    </div>
  );
}

type TableSkeletonProps = {
  rows?: number;
  showActions?: boolean;
};

export function TableSkeleton({
  rows = 6,
  showActions = true,
}: TableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, index) => (
        <tr
          key={index}
          className="animate-pulse border-b border-gray-100 last:border-b-0"
        >
          {/* First column (image + title) */}
          <td className="px-6 py-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-14 w-14 rounded-xl" />

              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </td>

          {/* Second column */}
          <td className="px-4 py-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </td>

          {/* Third column */}
          <td className="px-4 py-4">
            <Skeleton className="h-4 w-16" />
          </td>

          {/* Fourth column */}
          <td className="px-4 py-4">
            <Skeleton className="h-4 w-20" />
          </td>

          {/* Fifth column */}
          <td className="px-4 py-4">
            <Skeleton className="h-7 w-20 rounded-full" />
          </td>

          {/* Actions */}
          {showActions && (
            <td className="px-6 py-4">
              <div className="flex justify-end gap-2">
                <Skeleton className="h-9 w-16 rounded-lg" />
                <Skeleton className="h-9 w-9 rounded-lg" />
                <Skeleton className="h-9 w-9 rounded-lg" />
              </div>
            </td>
          )}
        </tr>
      ))}
    </>
  );
}
