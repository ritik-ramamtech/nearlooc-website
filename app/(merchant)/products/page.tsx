"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Package, Plus, Search, Bell, Tag, TrendingDown, History,
  Pencil, Power, ArrowRight, Star,
} from "lucide-react";
import { useMerchantProducts, useDeactivateProduct } from "@/features/merchant/products/hooks";
import { useActiveSales, useSalesHistory, useDeactivateOffer } from "@/features/merchant/sales/hooks";
import { useMerchantProfile } from "@/features/merchant/profile/hooks";
import type { Product, MerchantSale } from "@/types/merchant";

type Tab = "products" | "active" | "history";

export default function ProductsPage() {
  const [tab, setTab] = useState<Tab>("products");
  const [search, setSearch] = useState("");

  const { data: profile } = useMerchantProfile();
  const { data: productsData, isPending: loadingProducts } = useMerchantProducts();
  const { data: activeSalesData, isPending: loadingActive } = useActiveSales();
  const { data: historyData, isPending: loadingHistory } = useSalesHistory();
  const { mutate: deactivateProduct } = useDeactivateProduct();
  const { mutate: deactivateOffer } = useDeactivateOffer();

  const products = (productsData?.data ?? []).filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );
  const activeSales = activeSalesData?.data ?? [];
  const history = historyData?.data ?? [];

  const isLoading = tab === "products" ? loadingProducts : tab === "active" ? loadingActive : loadingHistory;

  return (
    <div className="min-h-screen bg-[#f0f7f0]">
      {/* Top nav */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-20">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Product Inventory</h1>
          <p className="text-xs text-gray-400">View and manage all your products in one place</p>
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
          <div className="h-8 w-8 rounded-full bg-[#1a5c2a] flex items-center justify-center text-white text-sm font-bold">
            {profile?.business_name?.[0]?.toUpperCase() ?? "M"}
          </div>
        </div>
      </header>

      {/* Tab bar */}
      <div className="bg-white border-b border-gray-200 px-6 flex items-center justify-between">
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
              onClick={() => setTab(key)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === key
                  ? "border-[#1a5c2a] text-[#1a5c2a]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>

        <Link
          href="/products/new"
          className="flex items-center gap-1.5 px-4 py-2 bg-[#1a5c2a] hover:bg-[#14471f] text-white rounded-lg text-sm font-semibold transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add New Product
        </Link>
      </div>

      <div className="p-6">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 h-24 animate-pulse" />
            ))}
          </div>
        ) : tab === "products" ? (
          <ProductsTab
            products={products}
            onDeactivate={(id) => deactivateProduct(id)}
          />
        ) : tab === "active" ? (
          <SalesTab
            offers={activeSales}
            emptyLabel="No active offers yet"
            emptyDesc="Go to a product and create your first offer."
            onDeactivate={(id) => deactivateOffer(id)}
            showDeactivate
          />
        ) : (
          <SalesTab
            offers={history}
            emptyLabel="No sales history yet"
            emptyDesc="Deactivated or expired offers will appear here."
            onDeactivate={() => {}}
            showDeactivate={false}
          />
        )}
      </div>
    </div>
  );
}

/* ─── Products tab ────────────────────────────────────────────────────── */
function ProductsTab({ products, onDeactivate }: { products: Product[]; onDeactivate: (id: string) => void }) {
  if (products.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 flex flex-col items-center text-center">
        <div className="h-16 w-16 rounded-full bg-[#f0f7f0] flex items-center justify-center mb-4">
          <Package className="h-8 w-8 text-gray-300" />
        </div>
        <p className="text-base font-semibold text-gray-800">No products yet</p>
        <p className="text-sm text-gray-400 mt-1">
          Start building your catalog by adding your first offering.
        </p>
        <Link
          href="/products/new"
          className="mt-5 flex items-center gap-2 px-5 py-2.5 bg-[#1a5c2a] hover:bg-[#14471f] text-white rounded-lg text-sm font-semibold transition-colors"
        >
          Get Started
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {products.map((p) => (
        <div
          key={p.id}
          className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center gap-4"
        >
          {/* Image */}
          <div className="h-16 w-16 rounded-xl bg-[#f0f7f0] shrink-0 overflow-hidden">
            {p.image_url ? (
              <Image src={p.image_url} alt={p.name} width={64} height={64} className="object-cover h-full w-full" />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <Package className="h-6 w-6 text-gray-300" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-gray-900 truncate">{p.name}</p>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  p.is_active
                    ? "bg-[#e8f5e9] text-[#1a5c2a]"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {p.is_active ? "Active" : "Inactive"}
              </span>
            </div>
            {p.title && <p className="text-xs text-gray-400 mt-0.5 truncate">{p.title}</p>}
            <p className="text-sm font-bold text-gray-800 mt-1">₹{p.base_price.toLocaleString("en-IN")}</p>
            {p.category_name && (
              <p className="text-[11px] text-gray-400 mt-0.5">{p.category_name}{p.subcategory_name ? ` › ${p.subcategory_name}` : ""}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0">
            <Link
              href={`/products/${p.id}/offers`}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#1a5c2a] bg-[#e8f5e9] rounded-lg hover:bg-[#c8e6c9] transition-colors"
            >
              <Tag className="h-3 w-3" />
              Offers
            </Link>
            <button
              title="Edit"
              className="p-2 rounded-lg hover:bg-[#f0f7f0] text-gray-400 hover:text-[#1a5c2a] transition-colors"
            >
              <Pencil className="h-4 w-4" />
            </button>
            {p.is_active && (
              <button
                title="Deactivate"
                onClick={() => onDeactivate(p.id)}
                className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Power className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Sales tab (active + history) ───────────────────────────────────── */
function SalesTab({
  offers, emptyLabel, emptyDesc, onDeactivate, showDeactivate,
}: {
  offers: MerchantSale[];
  emptyLabel: string;
  emptyDesc: string;
  onDeactivate: (id: string) => void;
  showDeactivate: boolean;
}) {
  if (offers.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 flex flex-col items-center text-center">
        <div className="h-16 w-16 rounded-full bg-[#f0f7f0] flex items-center justify-center mb-4">
          <TrendingDown className="h-8 w-8 text-gray-300" />
        </div>
        <p className="text-base font-semibold text-gray-800">{emptyLabel}</p>
        <p className="text-sm text-gray-400 mt-1 max-w-xs">{emptyDesc}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {offers.map((o) => (
        <div key={o.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center gap-4">
          {/* Image */}
          <div className="h-14 w-14 rounded-xl bg-[#f0f7f0] shrink-0 overflow-hidden">
            {o.product?.image_url ? (
              <Image src={o.product.image_url} alt={o.product.name} width={56} height={56} className="object-cover h-full w-full" />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <Tag className="h-5 w-5 text-gray-300" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-gray-900 truncate">{o.product?.name}</p>
              {o.badge && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-600">
                  {o.badge}
                </span>
              )}
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${o.is_active ? "bg-[#e8f5e9] text-[#1a5c2a]" : "bg-gray-100 text-gray-400"}`}>
                {o.is_active ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm font-bold text-gray-900">₹{o.discounted_price.toLocaleString("en-IN")}</span>
              <span className="text-xs text-gray-400 line-through">₹{o.product?.base_price?.toLocaleString("en-IN")}</span>
              <span className="text-xs font-semibold text-[#1a5c2a]">{o.discount_percentage}% off</span>
            </div>

            {o.rating > 0 && (
              <div className="flex items-center gap-1 mt-0.5">
                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                <span className="text-xs text-gray-500">{o.rating} ({o.review_count})</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Link
              href={`/products/${o.product?.id}/offers`}
              className="p-2 rounded-lg hover:bg-[#f0f7f0] text-gray-400 hover:text-[#1a5c2a] transition-colors"
            >
              <ArrowRight className="h-4 w-4" />
            </Link>
            {showDeactivate && o.is_active && (
              <button
                onClick={() => onDeactivate(o.id)}
                className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                title="Deactivate offer"
              >
                <Power className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
