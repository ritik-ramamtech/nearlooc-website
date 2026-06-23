"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Plus, X, Upload, MapPin } from "lucide-react";
import { useCreateProduct } from "@/features/merchant/products/hooks";
import { uploadProductImage } from "@/features/merchant/products/api";
import { useMerchantLocations } from "@/features/merchant/locations/hooks";
import { useCategories } from "@/features/categories/hooks";
import { ROUTES } from "@/lib/constants";

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

      if (imageFile && result.data?.id) {
        await uploadProductImage(result.data.id, imageFile);
      }

      router.push(ROUTES.PRODUCTS);
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(typeof msg === "string" ? msg : "Failed to create product. Please try again.");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-page-bg overflow-hidden">
      {/* Sticky Header with actions */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-4">
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
        </div>

        {/* Action buttons in header */}
        <div className="flex items-center gap-3">
          {error && (
            <p className="text-xs text-red-500 max-w-xs truncate">{error}</p>
          )}
          <button
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={creating}
            className="flex items-center gap-2 px-5 py-2 bg-brand-500 hover:bg-brand-800 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
          >
            {creating ? "Creating..." : "Create Product"}
          </button>
        </div>
      </header>

      {/* Two-column scrollable body */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto grid grid-cols-12 gap-5 h-full">

          {/* ── Left Column ── */}
          <div className="col-span-4 flex flex-col gap-5">

            {/* Image Upload */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <p className="text-sm font-bold text-gray-900 mb-3">Product Image</p>
              <div
                onClick={() => imgRef.current?.click()}
                className="border-2 border-dashed border-brand-200 rounded-xl bg-brand-50 h-52 flex flex-col items-center justify-center cursor-pointer hover:bg-brand-100 transition-colors overflow-hidden relative"
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
                    <Upload className="h-8 w-8 text-brand-500 mb-2" />
                    <p className="text-sm font-semibold text-brand-500">Upload product image</p>
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

            {/* Locations */}
            {locations && locations.length > 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex-1">
                <p className="text-sm font-bold text-gray-900 mb-0.5">Available At</p>
                <p className="text-xs text-gray-400 mb-3">Select which branches carry this product</p>
                <div className="space-y-1">
                  {locations.map((loc) => (
                    <label
                      key={loc.id}
                      onClick={() => toggleLocation(loc.id)}
                      className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-brand-50 transition-colors"
                    >
                      <div
                        className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-colors shrink-0 ${
                          selectedLocations.includes(loc.id)
                            ? "bg-brand-500 border-brand-500"
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
            ) : (
              <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 flex items-start gap-3">
                <MapPin className="h-5 w-5 text-brand-500 shrink-0 mt-0.5" />
                <p className="text-sm text-gray-600">
                  Add store locations first to assign this product to specific branches.{" "}
                  <Link href={ROUTES.LOCATIONS} className="font-semibold text-brand-500 underline">Add locations →</Link>
                </p>
              </div>
            )}
          </div>

          {/* ── Right Column ── */}
          <div className="col-span-8 flex flex-col gap-5">

            {/* Core Product Details */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
              <p className="text-sm font-bold text-gray-900">Product Details</p>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Product Name *">
                  <input
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="e.g. Goa Beach Resort Stay"
                    className={inputCls}
                  />
                </Field>
                <Field label="Base Price (₹) *">
                  <input
                    type="number"
                    min={0}
                    value={form.base_price}
                    onChange={(e) => set("base_price", e.target.value)}
                    placeholder="e.g. 15999"
                    className={inputCls}
                  />
                </Field>
              </div>

              <Field label="Display Title">
                <input
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="e.g. Luxury Beachside Escape — short tagline shown on offer cards"
                  className={inputCls}
                />
              </Field>

              <Field label="Description">
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Describe your product in detail..."
                  className={`${inputCls} resize-none`}
                />
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Category">
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
                <Field label="Sub-Category">
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
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <p className="text-sm font-bold text-gray-900 mb-0.5">Highlights</p>
              <p className="text-xs text-gray-400 mb-3">Key selling points shown on the offer page</p>

              <div className="flex gap-2 mb-3">
                <input
                  value={highlightInput}
                  onChange={(e) => setHighlightInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addHighlight())}
                  placeholder="e.g. Free breakfast included — press Enter to add"
                  className={`${inputCls} flex-1`}
                />
                <button
                  onClick={addHighlight}
                  className="px-3 py-2.5 bg-brand-500 text-white rounded-md hover:bg-brand-800 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {highlights.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {highlights.map((h) => (
                    <span
                      key={h}
                      className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-brand-100 text-brand-500 rounded-full"
                    >
                      {h}
                      <button onClick={() => setHighlights((prev) => prev.filter((x) => x !== h))}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">No highlights added yet. Press Enter or click + to add one.</p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
