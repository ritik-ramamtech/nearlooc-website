import { Category, Product } from "@/types";
import { useState } from "react";
import { useMerchantProducts } from "../hooks";
import { Package, Pencil, Plus, Power, Table } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import Link from "next/link";
import Image from "next/image";
import { ProductsTabSkeleton } from "./ProductsTabSkeleton";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import ConfirmDialog from "./ConfirmDialog";
import InventoryFilters from "./InventoryFilters";
import { TableSkeleton } from "./SalesTab";
import { EmptyState } from "@/components/ui";

export default function ProductsTab({
  onDeactivate,
  categories,
}: {
  onDeactivate: (id: string) => void;
  categories: Category[];
}) {
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedCategoryId = searchParams.get("category_id") ?? "";
  const selectedSubCategoryId = searchParams.get("subcategory_id") ?? "";
  const search = searchParams.get("search") ?? "";
  const isActive = searchParams.get("is_active") ?? null;

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

  const query = {
    ...(selectedCategoryId && { category_id: selectedCategoryId }),
    ...(selectedSubCategoryId && {
      subcategory_id: selectedSubCategoryId,
    }),
    ...(isActive !== null && { is_active: isActive === "true" }),
  };

  const { data: productsData, isPending } = useMerchantProducts(query);

  const products = (productsData?.data ?? []).filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const selectedCategories = categories.find(
    (cat) => cat.id === selectedCategoryId,
  );
  const subCategories = selectedCategories?.subcategories;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 shadow-sm">
      <InventoryFilters
        search={search}
        onSearchChange={(value) => updateParams({ search: value })}
        categories={categories}
        selectedCategoryId={selectedCategoryId}
        onCategoryChange={(value) =>
          updateParams({
            category_id: value,
            subcategory_id: "",
          })
        }
        selectedSubCategoryId={selectedSubCategoryId}
        onSubCategoryChange={(value) => updateParams({ subcategory_id: value })}
        showStatus
        status={isActive ?? ""}
        onStatusChange={(value) => updateParams({ is_active: value })}
      />

      <>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              <th className="px-6 py-4">Product</th>
              <th className="px-4 py-4">Category</th>
              <th className="px-4 py-4">Base Price</th>
              <th className="px-4 py-4">Locations</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {isPending ? (
              <TableSkeleton rows={6} />
            ) : products.length > 0 ? (
              products.map((p) => (
                <tr key={p.id} className="transition-colors hover:bg-gray-50">
                  {/* Product */}
                  <td className="w-[40%] px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 overflow-hidden rounded-xl bg-brand-50">
                        {p.image_url || p.images.length > 0 ? (
                          <Image
                            src={p.image_url || p.images[0]}
                            alt={p.name}
                            width={56}
                            height={56}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Package className="h-5 w-5 text-gray-300" />
                          </div>
                        )}
                      </div>
                        
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/products/${p.id}`}
                          className="font-semibold text-gray-900 hover:text-brand-500 line-clamp-2 block"
                        >
                          {p.name}
                        </Link>

                        {/* {p.title && (
                          <p className="mt-1 truncate text-sm text-gray-500">
                            {p.title}
                          </p>
                        )} */}
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-4">
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">
                        {p.category_name ?? "-"}
                      </p>

                      {p.subcategory_name && (
                        <p className="text-gray-500">{p.subcategory_name}</p>
                      )}
                    </div>
                  </td>

                  {/* Price */}
                  <td className="px-4 py-4">
                    <span className="font-semibold text-gray-900">
                      ₹{p.base_price.toLocaleString("en-IN")}
                    </span>
                  </td>

                  {/* Locations */}
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-600">{p.locations?.length} Locations</span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        p.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {p.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Link
                      href={`/products/${p.id}/edit`}
                        title="Edit"
                        className="rounded-lg border border-gray-200 p-2 text-gray-500 hover:bg-brand-50 hover:text-brand-500"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>

                      {p.is_active && (
                        <button
                          onClick={() => {
                            setSelectedProduct(p);
                            setOpen(true);
                          }}
                          title="Deactivate"
                          className="rounded-lg border border-red-100 p-2 text-red-500 hover:bg-red-50"
                        >
                          <Power className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
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
          title="Deactivate Product?"
          description={
            selectedProduct
              ? `"${selectedProduct.name}" will become inactive and won't be available for creating new offers.`
              : ""
          }
          loading={isPending}
          confirmText="Deactivate Product"
          onConfirm={() => {
            if (!selectedProduct) return;

            onDeactivate(selectedProduct.id);
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
              <li>• You can reactivate it anytime.</li>
            </ul>
          </div>
        </ConfirmDialog>
      </>
    </div>
  );
}
