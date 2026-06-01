"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Plus, X, Upload, Package } from "lucide-react";
import { useCreateProduct } from "@/features/merchant/products/hooks";
import { uploadProductImage } from "@/features/merchant/products/api";
import { useMerchantLocations } from "@/features/merchant/locations/hooks";
import { useCategories } from "@/features/categories/hooks";

export default function NewProductPage() {
  const router = useRouter();
  const { mutateAsync: createProduct, isPending: creating } = useCreateProduct();
  const { data: locations } = useMerchantLocations();
  const { data: categories } = useCategories();

  const [form, setForm] = useState({
    name: "",
    title: "",
    description: "",
    base_price: "",
    category_id: "",
    subcategory_id: "",
  });
  const [highlights, setHighlights] = useState<string[]>([]);
  const [highlightInput, setHighlightInput] = useState("");
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const imgRef = useRef<HTMLInputElement>(null);

  const set = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const selectedCategory = categories?.find((c) => c.id === form.category_id);
  const subcategories = selectedCategory?.subcategories ?? [];

  const addHighlight = () => {
    const val = highlightInput.trim();
    if (val && !highlights.includes(val)) {
      setHighlights((prev) => [...prev, val]);
    }
    setHighlightInput("");
  };

  const toggleLocation = (id: string) =>
    setSelectedLocations((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );

  const handleImageChange = (file: File) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.base_price) {
      setError("Product name and base price are required.");
      return;
    }
    setError(null);

    try {
      const result = await createProduct({
        name: form.name,
        title: form.title || undefined,
        description: form.description || undefined,
        highlights: highlights.length > 0 ? highlights : undefined,
        base_price: parseFloat(form.base_price),
        category_id: form.category_id || undefined,
        subcategory_id: form.subcategory_id || undefined,
        location_ids: selectedLocations.length > 0 ? selectedLocations : undefined,
      });

      // Upload image if selected
      if (imageFile && result.data?.id) {
        await uploadProductImage(result.data.id, imageFile);
      }

      router.push("/products");
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(typeof msg === "string" ? msg : "Failed to create product. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f7f0]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4 sticky top-0 z-20">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 text-gray-600" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-gray-900">Add New Product</h1>
          <p className="text-xs text-gray-400">Fill in the details to list your product</p>
        </div>
      </header>

      <div className="p-6 max-w-2xl mx-auto space-y-5">
        {/* Image upload */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <p className="text-sm font-bold text-gray-900 mb-4">Product Image</p>
          <div
            onClick={() => imgRef.current?.click()}
            className="border-2 border-dashed border-[#c8e6c9] rounded-xl bg-[#f0f7f0] h-48 flex flex-col items-center justify-center cursor-pointer hover:bg-[#e8f5e9] transition-colors overflow-hidden relative"
          >
            {imagePreview ? (
              <>
                <Image src={imagePreview} alt="Preview" fill className="object-cover rounded-xl" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-xl">
                  <p className="text-white text-sm font-semibold">Change Image</p>
                </div>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-[#1a5c2a] mb-2" />
                <p className="text-sm font-semibold text-[#1a5c2a]">Upload product image</p>
                <p className="text-xs text-gray-400 mt-1">JPG or PNG · Max 5MB</p>
              </>
            )}
          </div>
          <input
            ref={imgRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleImageChange(e.target.files[0])}
          />
        </div>

        {/* Core details */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
          <p className="text-sm font-bold text-gray-900">Product Details</p>

          <Field label="Product Name *" placeholder="e.g. Goa Beach Resort Stay">
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Goa Beach Resort Stay"
              className={inputCls}
            />
          </Field>

          <Field label="Display Title" placeholder="Short tagline shown on offer cards">
            <input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Luxury Beachside Escape"
              className={inputCls}
            />
          </Field>

          <Field label="Description" placeholder="">
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Describe your product in detail..."
              className={`${inputCls} resize-none`}
            />
          </Field>

          <Field label="Base Price (₹) *" placeholder="e.g. 15999">
            <input
              type="number"
              min={0}
              value={form.base_price}
              onChange={(e) => set("base_price", e.target.value)}
              placeholder="e.g. 15999"
              className={inputCls}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Category" placeholder="">
              <select
                value={form.category_id}
                onChange={(e) => { set("category_id", e.target.value); set("subcategory_id", ""); }}
                className={inputCls}
              >
                <option value="">Select category</option>
                {categories?.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Sub-Category" placeholder="">
              <select
                value={form.subcategory_id}
                onChange={(e) => set("subcategory_id", e.target.value)}
                disabled={!form.category_id}
                className={`${inputCls} disabled:opacity-50`}
              >
                <option value="">Select sub-category</option>
                {subcategories.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </Field>
          </div>
        </div>

        {/* Highlights */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <p className="text-sm font-bold text-gray-900 mb-1">Highlights</p>
          <p className="text-xs text-gray-400 mb-3">Key selling points shown on the offer page</p>

          <div className="flex gap-2 mb-3">
            <input
              value={highlightInput}
              onChange={(e) => setHighlightInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addHighlight())}
              placeholder="e.g. Free breakfast included"
              className={`${inputCls} flex-1`}
            />
            <button
              onClick={addHighlight}
              className="px-3 py-2.5 bg-[#1a5c2a] text-white rounded-md hover:bg-[#14471f] transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {highlights.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {highlights.map((h) => (
                <span
                  key={h}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-[#e8f5e9] text-[#1a5c2a] rounded-full"
                >
                  {h}
                  <button onClick={() => setHighlights((prev) => prev.filter((x) => x !== h))}>
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Locations */}
        {locations && locations.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <p className="text-sm font-bold text-gray-900 mb-1">Available At</p>
            <p className="text-xs text-gray-400 mb-3">Select which store branches carry this product</p>

            <div className="space-y-2">
              {locations.map((loc) => (
                <label key={loc.id} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-[#f0f7f0] transition-colors">
                  <div
                    onClick={() => toggleLocation(loc.id)}
                    className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-colors shrink-0 ${
                      selectedLocations.includes(loc.id)
                        ? "bg-[#1a5c2a] border-[#1a5c2a]"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    {selectedLocations.includes(loc.id) && (
                      <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{loc.label}</p>
                    <p className="text-xs text-gray-400">{loc.street}, {loc.city}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {locations?.length === 0 && (
          <div className="bg-[#f0f7f0] border border-[#c8e6c9] rounded-xl p-4 flex items-center gap-3">
            <Package className="h-5 w-5 text-[#1a5c2a] shrink-0" />
            <p className="text-sm text-gray-600">
              Add store locations first to assign this product to specific branches.{" "}
              <a href="/locations" className="text-[#1a5c2a] font-semibold underline">Add locations →</a>
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Submit */}
        <div className="flex gap-3 pb-8">
          <button
            onClick={() => router.back()}
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={creating}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1a5c2a] hover:bg-[#14471f] text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
          >
            {creating ? "Creating..." : "Create Product"}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:border-[#1a5c2a] focus:ring-2 focus:ring-[#1a5c2a]/10 transition";

function Field({ label, children }: { label: string; placeholder?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
