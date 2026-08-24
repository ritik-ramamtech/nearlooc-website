import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Pencil,
  Plus,
  Power,
} from "lucide-react";
import { Product } from "@/types";
import {
  formatLocalDate,
  formatLocalDateShort,
  formatRelativeTime,
} from "@/lib/utils";
import { StatusPill } from "@/components/product/status-pill";
import { Button } from "@/components/ui";
import { useDeactivateProduct } from "../hooks";
import ConfirmDialog from "./ConfirmDialog";
import { useState } from "react";

export default function ProductHeader({ product }: { product: Product }) {
  const { mutate, isPending } = useDeactivateProduct();

  const [open, setOpen] = useState(false);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
      <div
        className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-emerald-50 to-transparent"
        aria-hidden="true"
      />

      <div className="relative flex flex-col gap-6 p-6 lg:flex-row lg:items-start lg:justify-between lg:p-6">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
              {product.category_name}
            </span>
            <span className="text-gray-300" aria-hidden="true">
              /
            </span>
            <span className="text-xs font-medium text-gray-500">
              {product.subcategory_name}
            </span>
            <StatusPill
              tone={product.is_active ? "active" : "neutral"}
              label={product.is_active ? "Active" : "Deactivated"}
              className="ml-1"
            />
          </div>

          <h1 className="mt-3 text-pretty text-2xl font-semibold tracking-tight text-gray-900 lg:text-3xl">
            {product.name}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-2xl font-semibold tracking-tight text-gray-900">
                ₹{product.base_price.toLocaleString("en-IN")}
              </span>
              <span className="text-sm text-gray-500">base price</span>
            </div>
            <span
              className="hidden h-4 w-px bg-gray-200 sm:block"
              aria-hidden="true"
            />
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-4 text-gray-400" />
                Created {formatLocalDateShort(product.created_at)}
              </span>
              {product.updated_at !== product.created_at && (
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-4 text-gray-400" />
                  Updated {formatRelativeTime(product.updated_at)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <Link href={`/products/${product.id}/edit`}>
            <Button variant="outline" className="h-9">
              <Pencil />
              Edit Product
            </Button>
          </Link>

          <Link href={`/products/${product.id}/offers/new`}>
            <Button className="h-9 bg-primary">
              <Plus />
              Create Offer
            </Button>
          </Link>

          {product.is_active && (
            <Button variant="destructive" className="h-9" onClick={() => setOpen(true)}>
              <Power />
              Deactivate
            </Button>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Deactivate Product?"
        description={`"${product.name}" will become inactive and won't be available for creating new offers.`}
        loading={isPending}
        confirmText="Deactivate Product"
        onConfirm={() => {
          mutate(product.id);
          setOpen(false);
        }}
      >
        <div className="rounded-2xl border border-amber-200 bg-white p-4">
          <p className="mb-3 font-semibold text-amber-900">
            What happens next?
          </p>

          <ul className="space-y-2 text-sm text-amber-800">
            <li>• Customers won't be able to view this product.</li>
            <li>• New offers can't be created for this product.</li>
            <li>• Existing offers may become unavailable.</li>
          </ul>
        </div>
      </ConfirmDialog>
    </section>
  );
}
