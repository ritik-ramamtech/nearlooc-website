import { Category, Product } from "@/types";
import { Search } from "lucide-react";

type InventoryFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;

  categories: Category[];
  selectedCategoryId: string;
  onCategoryChange: (id: string) => void;

  selectedSubCategoryId: string;
  onSubCategoryChange: (id: string) => void;

  products?: Product[];
  selectedProductId?: string;
  onProductChange?: (id: string) => void;

  status?: string;
  onStatusChange?: (value: string) => void;

  minPrice?: string;
  maxPrice?: string;
  onMinPriceChange?: (value: string) => void;
  onMaxPriceChange?: (value: string) => void;

  showStatus?: boolean;
  showProduct?: boolean;
  showPrice?: boolean;
};

export default function InventoryFilters({
  search,
  onSearchChange,

  categories,
  selectedCategoryId,
  onCategoryChange,

  selectedSubCategoryId,
  onSubCategoryChange,

  products = [],
  selectedProductId = "",
  onProductChange,

  status = "",
  onStatusChange,

  minPrice = "",
  maxPrice = "",
  onMinPriceChange,
  onMaxPriceChange,

  showStatus = false,
  showProduct = false,
  showPrice = false,
}: InventoryFiltersProps) {
  const selectedCategory = categories.find(
    (c) => c.id === selectedCategoryId
  );

  const subcategories = selectedCategory?.subcategories ?? [];

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 md:border-b md:border-gray-200">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search..."
          className="w-64 rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm"
        />
      </div>

      <select
        value={selectedCategoryId}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
      >
        <option value="">All Categories</option>

        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <select
        disabled={!selectedCategoryId}
        value={selectedSubCategoryId}
        onChange={(e) => onSubCategoryChange(e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
      >
        <option value="">All Subcategories</option>

        {subcategories.map((sub) => (
          <option key={sub.id} value={sub.id}>
            {sub.name}
          </option>
        ))}
      </select>

      {showProduct && (
        <select
          value={selectedProductId}
          onChange={(e) => onProductChange?.(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">All Products</option>

          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
      )}

      {showStatus && (
        <select
          value={status}
          onChange={(e) => onStatusChange?.(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      )}

      {showPrice && (
        <>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => onMinPriceChange?.(e.target.value)}
            placeholder="Min Price"
            className="w-28 rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />

          <input
            type="number"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange?.(e.target.value)}
            placeholder="Max Price"
            className="w-28 rounded-lg border border-gray-300 px-3 py-2 text-sm"
          />
        </>
      )}
    </div>
  );
}