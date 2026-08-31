"use client";

import { useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { Package, Plus, Search, Bell, Tag, History } from "lucide-react";
import { useDeactivateProduct } from "@/features/merchant/products/hooks";
import { useDeactivateOffer } from "@/features/merchant/sales/hooks";
import { useMerchantProfile } from "@/features/merchant/profile/hooks";
import { useCategories } from "@/features/categories";
import ProductsTab from "@/features/merchant/products/components/ProductsTab";
import SalesTab from "@/features/merchant/products/components/SalesTab";
import { useRouter, useSearchParams } from "next/navigation";

type Tab = "products" | "active" | "history";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab" as Tab) ?? 'products';

  const [search, setSearch] = useState("");

  const router = useRouter();

  const { data: profile } = useMerchantProfile();
  const { mutate: deactivateProduct } = useDeactivateProduct();
  const { mutate: deactivateOffer } = useDeactivateOffer();
  const { data: catgeories = [] } = useCategories();

  const handleTabChange = (nextTab: Tab) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("tab", nextTab);
    router.replace(`?${params.toString()}`);;
  };

  return (
    <div className="min-h-screen bg-slate-100/80">
      {/* Top nav */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-20 sm:px-6">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Product Inventory</h1>
          <p className="text-xs text-gray-400">
            View and manage all your products in one place
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="bg-transparent text-sm outline-none text-gray-700 w-36"
            />
          </div>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell className="h-5 w-5 text-gray-500" />
          </button>
          <div className="h-8 w-8 rounded-full bg-brand-500 flex items-center justify-center text-white text-sm font-bold">
            {profile?.business_name?.[0]?.toUpperCase() ?? "M"}
          </div>
        </div>
      </header>

      {/* Tab bar */}
      <div className="border-b border-gray-200 bg-white px-4 flex items-center justify-between overflow-x-auto sm:px-6">
        <div className="flex gap-1">
          {(
            [
              { key: "products", label: "Products", Icon: Package },
              { key: "active", label: "Active Sales", Icon: Tag },
              { key: "history", label: "History", Icon: History },
            ] as { key: Tab; label: string; Icon: React.ElementType }[]
          ).map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => handleTabChange(key)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === key
                  ? "border-brand-500 text-brand-500"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>

        <Link
          href={ROUTES.PRODUCTS_NEW}
          className="flex items-center gap-1.5 px-4 py-2 bg-brand-500 hover:bg-brand-800 text-white rounded-lg text-sm font-semibold transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add New Product
        </Link>
      </div>

      <div className="p-4 sm:p-6">
        {tab === "products" ? (
          <ProductsTab
            onDeactivate={(id) => deactivateProduct(id)}
            categories={catgeories}
          />
        ) : tab === "active" ? (
          <SalesTab
            emptyLabel="No active offers yet"
            emptyDesc="Go to a product and create your first offer."
            onDeactivate={(id) => deactivateOffer(id)}
            categories={catgeories}
            active
          />
        ) : (
          <SalesTab
            emptyLabel="No sales history yet"
            emptyDesc="Deactivated or expired offers will appear here."
            onDeactivate={() => {}}
            categories={catgeories}
            active={false}
          />
        )}
      </div>
    </div>
  );
}
