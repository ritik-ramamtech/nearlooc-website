"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Plus, Tag, Power, Percent, Clock, Star, X } from "lucide-react";
import { useMerchantProducts } from "@/features/merchant/products/hooks";
import { useActiveSales, useSalesHistory, useCreateOffer, useDeactivateOffer } from "@/features/merchant/sales/hooks";
import { useMerchantLocations } from "@/features/merchant/locations/hooks";
import { SkeletonList } from "@/components/ui/skeleton";

const inputCls = "w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition";
const labelCls = "block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5";

export default function ProductOffersPage() {
  const { id: productId } = useParams<{ id: string }>();
  const router = useRouter();

  const { data: productsData } = useMerchantProducts();
  const { data: activeSalesData, isPending: loadingActive } = useActiveSales();
  const { data: historyData } = useSalesHistory();
  const { data: locations } = useMerchantLocations();
  const { mutate: createOffer, isPending: creating } = useCreateOffer();
  const { mutate: deactivateOffer } = useDeactivateOffer();

  const product = productsData?.data?.find((p) => p.id === productId);
  const productOffers = (activeSalesData?.data ?? []).filter((o) => o.product?.id === productId);
  const productHistory = (historyData?.data ?? []).filter((o) => o.product?.id === productId);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    discounted_price: "",
    badge: "",
    promo_price: "",
    promo_end_at: "",
    duration: "",
  });
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");
  const [terms, setTerms] = useState<string[]>([]);
  const [termInput, setTermInput] = useState("");
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const set = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const addTag = (list: string[], setList: (v: string[]) => void, val: string) => {
    const v = val.trim();
    if (v && !list.includes(v)) setList([...list, v]);
  };

  const toggleLocation = (id: string) =>
    setSelectedLocations((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );

  const handleCreate = () => {
    const dp = parseFloat(form.discounted_price);
    if (!form.discounted_price || isNaN(dp)) {
      setError("Discounted price is required.");
      return;
    }
    if (product && dp > product.base_price) {
      setError(`Discounted price cannot exceed base price of ₹${product.base_price}.`);
      return;
    }
    setError(null);
    createOffer(
      {
        product_id: productId,
        discounted_price: dp,
        badge: form.badge || undefined,
        promo_price: form.promo_price ? parseFloat(form.promo_price) : undefined,
        promo_end_at: form.promo_end_at || undefined,
        duration: form.duration || undefined,
        features: features.length > 0 ? features : undefined,
        terms: terms.length > 0 ? terms : undefined,
        location_ids: selectedLocations.length > 0 ? selectedLocations : undefined,
      },
      {
        onSuccess: () => {
          setShowForm(false);
          setForm({ discounted_price: "", badge: "", promo_price: "", promo_end_at: "", duration: "" });
          setFeatures([]);
          setTerms([]);
          setSelectedLocations([]);
        },
        onError: (e: unknown) => {
          const msg = (e as { response?: { data?: { message?: string } } })?.response?.data?.message;
          setError(typeof msg === "string" ? msg : "Failed to create offer.");
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-page-bg">
      {/* Sticky Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4 sticky top-0 z-20 sm:px-6">
        <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <ArrowLeft className="h-4 w-4 text-gray-600" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-gray-900 truncate">{product?.name ?? "Product Offers"}</h1>
          <p className="text-xs text-gray-400">Manage promotional offers for this product</p>
        </div>
        {error && <p className="text-xs text-red-500 max-w-xs truncate">{error}</p>}
        {showForm ? (
          <>
            <button onClick={() => { setShowForm(false); setError(null); }} className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button onClick={handleCreate} disabled={creating} className="px-5 py-2 bg-brand-500 hover:bg-brand-800 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-60">
              {creating ? "Creating..." : "Create Offer"}
            </button>
          </>
        ) : (
          <button onClick={() => setShowForm(true)} className="flex items-center gap-1.5 px-4 py-2 bg-brand-500 hover:bg-brand-800 text-white rounded-lg text-sm font-semibold transition-colors">
            <Plus className="h-4 w-4" />Create Offer
          </button>
        )}
      </header>

      {/* Main Content */}
      <div className="flex-1 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 gap-6 md:grid-cols-12">
          {/* Left Column */}
          <div className="flex flex-col gap-4 md:col-span-4">
            {/* Product Summary */}
            {product && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center gap-4 shrink-0">
                <div className="h-14 w-14 rounded-xl bg-brand-50 shrink-0 overflow-hidden">
                  {product.image_url ? (
                    <Image src={product.image_url} alt={product.name} width={56} height={56} className="object-cover h-full w-full" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Tag className="h-5 w-5 text-gray-300" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                  <p className="text-sm font-bold text-brand-500 mt-0.5">Base price: ₹{product.base_price.toLocaleString("en-IN")}</p>
                  {product.category_name && <p className="text-xs text-gray-400 mt-0.5">{product.category_name}</p>}
                </div>
              </div>
            )}

            {/* Locations */}
            {product && locations && locations.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 shrink-0">
                <p className="text-sm font-bold text-gray-900 mb-0.5">Available At</p>
                <p className="text-xs text-gray-400 mb-3">Select which branches carry this product</p>
                <div className="space-y-1">
                  {locations.map((loc) => (
                    <label key={loc.id} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-brand-50 transition-colors">
                      <div onClick={() => toggleLocation(loc.id)} className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-colors shrink-0 ${selectedLocations.includes(loc.id) ? "bg-brand-500 border-brand-500" : "border-gray-300 bg-white"}`}>
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

            {/* Active Offers */}
            <Section title="Active Offers" count={productOffers.length} loading={loadingActive}>
              {productOffers.length === 0 ? (
                <EmptyOffers label="No active offers" desc="Use the form to create your first offer." />
              ) : (
                productOffers.map((o) => (
                  <OfferCard key={o.id} offer={o} onDeactivate={() => deactivateOffer(o.id)} showDeactivate />
                ))
              )}
            </Section>

            {/* History */}
            {productHistory.length > 0 && (
              <Section title="Offer History" count={productHistory.length}>
                {productHistory.map((o) => (
                  <OfferCard key={o.id} offer={o} onDeactivate={() => {}} showDeactivate={false} />
                ))}
              </Section>
            )}
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-5 md:col-span-8">
            {/* Create Offer Form */}
            {showForm ? (
              <div className="bg-white rounded-2xl border border-brand-500 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-gray-900">Create New Offer</h2>
                  <button onClick={() => { setShowForm(false); setError(null); }} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>Discounted Price (₹) *</label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="number"
                        min={0}
                        value={form.discounted_price}
                        onChange={(e) => set("discounted_price", e.target.value)}
                        placeholder={product ? `Max ₹${product.base_price}` : "e.g. 7999"}
                        className={`${inputCls} pl-9`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Badge (Optional)</label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={form.badge}
                        onChange={(e) => set("badge", e.target.value)}
                        placeholder="e.g. Best Seller"
                        className={`${inputCls} pl-9`}
                      />
                    </div>
                  </div>
                </div>

                {/* Promo */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>Promo Price (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={form.promo_price}
                      onChange={(e) => set("promo_price", e.target.value)}
                      placeholder="Flash price (optional)"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Promo End Date</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="datetime-local"
                        value={form.promo_end_at}
                        onChange={(e) => set("promo_end_at", e.target.value)}
                        className={`${inputCls} pl-9`}
                      />
                    </div>
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className={labelCls}>Duration (Optional)</label>
                  <input
                    value={form.duration}
                    onChange={(e) => set("duration", e.target.value)}
                    placeholder="e.g. 2 nights / 3 days"
                    className={inputCls}
                  />
                </div>

                {/* Features */}
                <div>
                  <label className={labelCls}>Features / Inclusions</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(features, setFeatures, featureInput); setFeatureInput(""); } }}
                      placeholder="e.g. Free breakfast"
                      className={`${inputCls} flex-1`}
                    />
                    <button onClick={() => { addTag(features, setFeatures, featureInput); setFeatureInput(""); }} className="px-3 py-2.5 bg-brand-500 text-white rounded-md hover:bg-brand-800 transition-colors">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  {features.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {features.map((f) => (
                        <span key={f} className="flex items-center gap-1 text-xs px-2.5 py-1 bg-brand-100 text-brand-500 rounded-full font-medium">
                          {f}
                          <button onClick={() => setFeatures(features.filter((x) => x !== f))}>
                            <X className="h-2.5 w-2.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Terms */}
                <div>
                  <label className={labelCls}>Terms & Conditions</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      value={termInput}
                      onChange={(e) => setTermInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(terms, setTerms, termInput); setTermInput(""); } }}
                      placeholder="e.g. Non-refundable"
                      className={`${inputCls} flex-1`}
                    />
                    <button onClick={() => { addTag(terms, setTerms, termInput); setTermInput(""); }} className="px-3 py-2.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  {terms.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {terms.map((t) => (
                        <span key={t} className="flex items-center gap-1 text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full font-medium">
                          {t}
                          <button onClick={() => setTerms(terms.filter((x) => x !== t))}>
                            <X className="h-2.5 w-2.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Locations */}
                {product && locations && locations.length > 0 && (
                  <div>
                    <label className={labelCls}>Redeemable At (leave empty for all)</label>
                    <div className="space-y-1 mt-1">
                      {product.locations?.map((pl) => {
                        const loc = locations.find((l) => l.id === pl.id);
                        if (!loc) return null;
                        return (
                          <label key={loc.id} className="flex items-center gap-2.5 cursor-pointer p-2 rounded-lg hover:bg-brand-50 transition-colors">
                            <div onClick={() => toggleLocation(loc.id)} className={`h-4 w-4 rounded border-2 flex items-center justify-center transition-colors shrink-0 ${selectedLocations.includes(loc.id) ? "bg-brand-500 border-brand-500" : "border-gray-300 bg-white"}`}>
                              {selectedLocations.includes(loc.id) && (
                                <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 12 12" fill="none">
                                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </div>
                            <span className="text-sm text-gray-700">{loc.label} — {loc.city}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 bg-white rounded-2xl border border-dashed border-gray-200">
                <div className="h-14 w-14 rounded-full bg-brand-50 flex items-center justify-center">
                  <Tag className="h-6 w-6 text-brand-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-700">No offer in progress</p>
                  <p className="text-xs text-gray-400 mt-1">Click <span className="font-semibold text-brand-500">Create Offer</span> to set up a new promotional offer for this product.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, count, loading, children }: { title: string; count: number; loading?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-sm font-bold text-gray-700">{title}</h2>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{count}</span>
      </div>
      {loading ? (
        <SkeletonList itemHeight={80} gap={8} itemClassName="rounded-xl" min={2} max={4} />
      ) : (
        <div className="space-y-2">{children}</div>
      )}
    </div>
  );
}

function EmptyOffers({ label, desc }: { label: string; desc: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
      <Tag className="h-8 w-8 text-gray-200 mx-auto mb-2" />
      <p className="text-sm font-semibold text-gray-700">{label}</p>
      <p className="text-xs text-gray-400 mt-1">{desc}</p>
    </div>
  );
}

function OfferCard({ offer, onDeactivate, showDeactivate }: { offer: import("@/types/merchant").MerchantSale; onDeactivate: () => void; showDeactivate: boolean }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-brand-100 flex items-center justify-center shrink-0">
          <Percent className="h-4 w-4 text-brand-500" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-900">₹{offer.discounted_price.toLocaleString("en-IN")}</span>
            <span className="text-xs text-gray-400 line-through">₹{offer.product?.base_price?.toLocaleString("en-IN")}</span>
            <span className="text-xs font-semibold text-brand-500">{offer.discount_percentage}% off</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            {offer.badge && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-600">{offer.badge}</span>}
            {offer.promo_end_at && (
              <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                <Clock className="h-3 w-3" /> Ends {new Date(offer.promo_end_at).toLocaleDateString("en-IN")}
              </span>
            )}
            {offer.rating > 0 && (
              <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />{offer.rating}
              </span>
            )}
          </div>
        </div>
      </div>
      {showDeactivate && offer.is_active && (
        <button onClick={onDeactivate} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors shrink-0">
          <Power className="h-3.5 w-3.5" />Deactivate
        </button>
      )}
      {!offer.is_active && <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-400">Inactive</span>}
    </div>
  );
}
