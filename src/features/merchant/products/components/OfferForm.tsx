"use client";

import { useOffer } from "@/features/offers";
import { ArrowLeft, MapPin, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  useCreateOffer,
  useMerchantOfferDetail,
  useUpdateOffer,
} from "../../sales/hooks";
import { ROUTES } from "@/lib/constants";
import { useRouter, useSearchParams } from "next/navigation";
import { useMerchantProduct } from "../hooks";
import Link from "next/link";

interface OfferFormParams {
  mode: "create" | "edit";
  id?: string;
  productId: string;
}

const getMinPromoTime = () => {
  const date = new Date(Date.now() + 15 * 60 * 1000);
  const offset = date.getTimezoneOffset();

  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16);
};

export default function OfferForm(params: OfferFormParams) {
  const { mode, id, productId } = params;

  const router = useRouter();
  const searchParams = useSearchParams();
  const relaunchFromId = mode === "create" ? searchParams.get("from") : null;

  const { data: productData } = useMerchantProduct(productId);
  const { data } = useOffer(id ?? "");
  const { data: relaunchSource } = useMerchantOfferDetail(relaunchFromId ?? "");
  const { mutateAsync: createOffer, isPending: creating } = useCreateOffer();
  const { mutateAsync: updateOffer, isPending: updating } = useUpdateOffer();

  const product = productData?.data;
  const locations = productData?.data.locations ?? [];

  const [form, setForm] = useState({
    discounted_price: "",
    promo_end_at: "",
  });
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");
  const [terms, setTerms] = useState<string[]>([]);
  const [termInput, setTermInput] = useState("");
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  //   const [imageFile, setImageFile] = useState<File | null>(null);
  //   const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<{
    discounted_price?: string;
    promo_end_at?: string;
    general?: string;
  }>({});

  const basePrice = product?.base_price ?? 0;
  const discountedPrice = Number(form.discounted_price || 0);

  const savedAmount =
    discountedPrice > 0 ? Math.max(basePrice - discountedPrice, 0) : 0;

  const discountPercentage =
    discountedPrice > 0 && basePrice > 0
      ? Math.round(((basePrice - discountedPrice) / basePrice) * 100)
      : 0;

  //   const imgRef = useRef<HTMLInputElement>(null);

  const set = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const addFeature = () => {
    const val = featureInput.trim();
    if (val && !features.includes(val)) {
      setFeatures((prev) => [...prev, val]);
    }
    setFeatureInput("");
  };
  const addTerm = () => {
    const val = termInput.trim();
    if (val && !terms.includes(val)) {
      setTerms((prev) => [...prev, val]);
    }
    setTermInput("");
  };

  const toggleLocation = (id: string) =>
    setSelectedLocations((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id],
    );

  //   const handleImageChange = (file: File) => {
  //     setImageFile(file);
  //     setImagePreview(URL.createObjectURL(file));
  //   };

  const handleSubmit = async () => {
    setError({});

    const newErrors: typeof error = {};
    if (!form.discounted_price) {
      newErrors.discounted_price = "Discounted price is required";
    }

    const promoEndAt = new Date(form.promo_end_at);

    if (!form.promo_end_at || Number.isNaN(promoEndAt.getTime())) {
      newErrors.promo_end_at =
        "Please select a valid promotional date and time";
    } else {
      const minimumEndTime = new Date(Date.now() + 15 * 60 * 1000);

      if (promoEndAt <= minimumEndTime) {
        newErrors.promo_end_at =
          "Promotional time must be at least 15 minutes from now.";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      return;
    }

    try {
      const payload = {
        discounted_price: parseFloat(form.discounted_price),
        promo_end_at: form.promo_end_at,
        terms: terms,
        features: features,
        location_ids: selectedLocations,
      };
      if (mode === "create") {
        await createOffer({ ...payload, product_id: productId });
      } else {
        if (!id) return;

        const { location_ids, ...editPayload } = payload;

        await updateOffer({ id: id, data: editPayload });
      }

      //   if (imageFile && result.data?.id) {
      //     await uploadProductImage(result.data.id, imageFile);
      //   }

      router.push(ROUTES.PRODUCTS);
    } catch (e: unknown) {
      const data = (
        e as {
          response?: {
            data?: { message?: string; errors?: Record<string, string[]> };
          };
        }
      )?.response?.data;

      const fieldErrors = data?.errors
        ? Object.values(data.errors).flat()
        : [];

      setError({
        general:
          fieldErrors.length > 0
            ? fieldErrors.join(" ")
            : typeof data?.message === "string"
              ? data.message
              : "Failed to create offer. Please try again.",
      });
    }
  };

  useEffect(() => {
    if (mode !== "edit" || !data) return;

    setForm({
      discounted_price: data.discounted_price.toString(),
      promo_end_at: data.promo_end_at ?? "",
    });

    setFeatures(data.features ?? []);
    setTerms(data.terms ?? []);
  }, [data]);

  useEffect(() => {
    if (mode !== "create" || !relaunchSource || !product) return;

    setForm((prev) => ({
      ...prev,
      discounted_price: relaunchSource.discounted_price.toString(),
    }));

    setFeatures(relaunchSource.features ?? []);
    setTerms(relaunchSource.terms ?? []);

    const stillActiveLocation = locations.find(
      (loc) => loc.id === relaunchSource.location.id && loc.is_active,
    );

    if (stillActiveLocation) {
      setSelectedLocations([stillActiveLocation.id]);
    }
  }, [relaunchSource, product]);

  return (
    <div className="min-h-screen flex flex-col bg-page-bg">
      {/* Sticky Header with actions */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shrink-0 z-20 sm:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-gray-600" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              {mode === "create" ? "Launch Sale" : "Edit Offer"}
            </h1>
          </div>
        </div>

        {/* Action buttons in header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={creating || updating}
            className="flex items-center gap-2 px-5 py-2 bg-brand-500 hover:bg-brand-800 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
          >
            {mode === "create"
              ? creating
                ? "Creating..."
                : "Create Offer"
              : updating
                ? "Updating..."
                : "Update Offer"}
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {error.general && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error.general}
            </div>
          )}
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 gap-5 md:grid-cols-12">
          {/* ── Left Column ── */}
          <div className="flex flex-col gap-5 md:col-span-4">
            {/* Image Upload */}
            {/* <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                  <p className="text-sm font-bold text-gray-900 mb-3">
                    Product Image
                  </p>
                  <div
                    onClick={() => imgRef.current?.click()}
                    className="border-2 border-dashed border-brand-200 rounded-xl bg-brand-50 h-52 flex flex-col items-center justify-center cursor-pointer hover:bg-brand-100 transition-colors overflow-hidden relative"
                  >
                    {imagePreview ? (
                      <>
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          fill
                          className="object-cover rounded-xl"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-xl">
                          <p className="text-white text-sm font-semibold">
                            Change Image
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-brand-500 mb-2" />
                        <p className="text-sm font-semibold text-brand-500">
                          Upload product image
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          JPG or PNG · Max 5MB
                        </p>
                      </>
                    )}
                  </div>
                  <input
                    ref={imgRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      e.target.files?.[0] && handleImageChange(e.target.files[0])
                    }
                  />
                </div> */}

            {product && (
              <div className="sticky top-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-2 text-lg font-semibold text-gray-900">
                  Product Summary
                </h2>

                <div className="mb-6 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
                  {product.image_url || product.images.length > 0 ? (
                    <img
                      src={product.image_url || product.images[0]}
                      alt={product.name}
                      className="h-48 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-52 items-center justify-center text-sm text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                      Product
                    </p>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {product.name}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Base Price
                      </p>
                      <p className="mt-1 font-semibold text-gray-900">
                        ₹{product.base_price.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Discount
                      </p>

                      {form.discounted_price ? (
                        <p className="mt-1 font-semibold text-green-600">
                          {discountPercentage}% OFF
                        </p>
                      ) : (
                        <p className="mt-1 text-gray-400">—</p>
                      )}
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Category
                      </p>
                      <p className="mt-1 text-gray-700">
                        {product.category_name ?? "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        Subcategory
                      </p>
                      <p className="mt-1 text-gray-700">
                        {product.subcategory_name ?? "-"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 rounded-2xl bg-green-50 p-4">
                  <p className="text-sm font-medium text-green-700">
                    Customer Saves
                  </p>

                  <p className="mt-2 text-3xl font-bold text-green-700">
                    ₹{savedAmount.toLocaleString()}
                  </p>

                  <p className="mt-1 text-sm text-green-600">
                    {discountPercentage}% off the original price
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ── Right Column ── */}
          <div className="flex flex-col gap-5 md:col-span-8">
            {/* Core Offer Details */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-4">
              <p className="text-sm font-bold text-gray-900">Product Details</p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Discounted Price (₹) *">
                  <input
                    type="number"
                    min={0}
                    max={productData?.data.base_price}
                    value={form.discounted_price}
                    onChange={(e) => set("discounted_price", e.target.value)}
                    placeholder="e.g. 15999"
                    className={`${inputCls} ${
                      error.discounted_price
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                        : ""
                    }`}
                  />
                  {error.discounted_price && (
                    <p className="mt-1 text-sm text-red-600">
                      {error.discounted_price}
                    </p>
                  )}
                </Field>
                <Field label="Offer Ends At *">
                  <input
                    type="datetime-local"
                    value={form.promo_end_at}
                    min={getMinPromoTime()}
                    onChange={(e) => {
                      set("promo_end_at", e.target.value);

                      if (error.promo_end_at) {
                        setError((prev) => ({
                          ...prev,
                          promo_end_at: undefined,
                        }));
                      }
                    }}
                    className={`${inputCls} ${
                      error.promo_end_at
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                        : ""
                    }`}
                  />
                  {error.promo_end_at && (
                    <p className="mt-1 text-sm text-red-600">
                      {error.promo_end_at}
                    </p>
                  )}
                </Field>
              </div>
            </div>

            {/* Locations */}
            {locations && locations.length > 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex-1">
                <p className="text-sm font-bold text-gray-900 mb-0.5">
                  Available At
                </p>
                <p className="text-xs text-gray-400 mb-3">
                  Select which branches carry this product
                </p>
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
                          <svg
                            className="h-3 w-3 text-white"
                            viewBox="0 0 12 12"
                            fill="none"
                          >
                            <path
                              d="M2 6l3 3 5-5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {loc.label}
                        </p>
                        <p className="text-xs text-gray-400">
                          {loc.street}, {loc.city}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 flex items-start gap-3">
                <MapPin className="h-5 w-5 text-brand-500 shrink-0 mt-0.5" />
                <p className="text-sm text-gray-600">
                  Add store locations first to assign this product to specific
                  branches.{" "}
                  <Link
                    href={ROUTES.LOCATIONS}
                    className="font-semibold text-brand-500 underline"
                  >
                    Add locations →
                  </Link>
                </p>
              </div>
            )}

            {/* Features */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <p className="text-sm font-bold text-gray-900 mb-0.5">
                Features (optional)
              </p>
              <p className="text-xs text-gray-400 mb-3">
                Key selling points shown on the offer page
              </p>

              <div className="flex gap-2 mb-3">
                <input
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addFeature())
                  }
                  placeholder="e.g. Free breakfast included — press Enter to add"
                  className={`${inputCls} flex-1`}
                />
                <button
                  onClick={addFeature}
                  className="px-3 py-2.5 bg-brand-500 text-white rounded-md hover:bg-brand-800 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {features.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {features.map((h) => (
                    <span
                      key={h}
                      className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-brand-100 text-brand-500 rounded-full"
                    >
                      {h}
                      <button
                        onClick={() =>
                          setFeatures((prev) => prev.filter((x) => x !== h))
                        }
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">
                  No highlights added yet. Press Enter or click + to add one.
                </p>
              )}
            </div>

            {/* Terms */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <p className="text-sm font-bold text-gray-900 mb-0.5">
                Terms (optional)
              </p>
              <p className="text-xs text-gray-400 mb-3">
                Key selling points shown on the offer page
              </p>

              <div className="flex gap-2 mb-3">
                <input
                  value={termInput}
                  onChange={(e) => setTermInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTerm())
                  }
                  placeholder="e.g. Free breakfast included — press Enter to add"
                  className={`${inputCls} flex-1`}
                />
                <button
                  onClick={addTerm}
                  className="px-3 py-2.5 bg-brand-500 text-white rounded-md hover:bg-brand-800 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {terms.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {terms.map((h) => (
                    <span
                      key={h}
                      className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-brand-100 text-brand-500 rounded-full"
                    >
                      {h}
                      <button
                        onClick={() =>
                          setTerms((prev) => prev.filter((x) => x !== h))
                        }
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">
                  No terms added yet. Press Enter or click + to add one.
                </p>
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

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
