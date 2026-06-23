"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Store, Phone, MapPin, CheckCircle, Check, Lightbulb, ChevronDown } from "lucide-react";
import { useCategories } from "@/features/categories/hooks";
import { useProfile } from "@/features/user/hooks";
import { saveMerchantProfile } from "@/features/merchant/profile/api";
import { useAuthStore } from "@/store/auth.store";
import { tokenStorage } from "@/lib/token";
import { ROUTES } from "@/lib/constants";

interface FormData {
  business_name: string;
  category_id: string;
  subcategory_id: string;
  bio: string;
  phone: string;
  website: string;
}

const STEPS = [
  {
    id: 1,
    label: "Store Identity",
    sublabel: "Business basics",
    Icon: Store,
    tip: "Complete details get 2× more visibility and earn your Verified badge.",
  },
  {
    id: 2,
    label: "Contact Details",
    sublabel: "How to reach you",
    Icon: Phone,
    tip: "Adding a website increases trust with potential customers by 40%.",
  },
  {
    id: 3,
    label: "Location",
    sublabel: "Store physical address",
    Icon: MapPin,
    tip: "You can add multiple branches from your dashboard after your account is live.",
  },
  {
    id: 4,
    label: "Review & Submit",
    sublabel: "Confirm and go live",
    Icon: CheckCircle,
    tip: "Your account will be reviewed and activated within 48 hours of submission.",
  },
];

const inputCls =
  "w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition";
const labelCls =
  "block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5";

export default function BecomeMerchantPage() {
  const router = useRouter();
  const { data: categories } = useCategories();
  const { data: profile } = useProfile();
  const { user, merchant_id, setMerchantId } = useAuthStore();

  // A deactivated merchant has no merchant_id, so this page is reachable via back
  // button / stale link. Send them to the Profile page's Reactivate flow instead of
  // the blank create form, which would otherwise overwrite their preserved data.
  const isDeactivatedMerchant = profile?.merchant_status === "inactive";

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>({
    business_name: "",
    category_id: "",
    subcategory_id: "",
    bio: "",
    phone: "",
    website: "",
  });

  useEffect(() => {
    if (merchant_id) router.replace(ROUTES.DASHBOARD);
    else if (isDeactivatedMerchant) router.replace(ROUTES.PROFILE);
  }, [merchant_id, isDeactivatedMerchant, router]);

  if (merchant_id || isDeactivatedMerchant) return null;

  const selectedCategory = categories?.find((c) => c.id === form.category_id);
  const subcategories = selectedCategory?.subcategories ?? [];
  const currentStep = STEPS[step - 1];

  const set = (field: keyof FormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const canAdvance = () => {
    if (step === 1) return form.business_name.trim().length > 0 && form.category_id.length > 0;
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const { data } = await saveMerchantProfile({
        business_name: form.business_name,
        bio: form.bio || undefined,
        phone: form.phone || undefined,
        website: form.website || undefined,
        category_id: form.category_id || undefined,
        subcategory_id: form.subcategory_id || undefined,
      });
      // Reflect the new merchant role immediately so the Merchant Portal toggle
      // shows and middleware allows /dashboard — without waiting for a full reload.
      setMerchantId(data.merchant_id);
      tokenStorage.setMerchantCookie(true);
      router.push(ROUTES.DASHBOARD);
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-page-bg">

      {/* ── Top Bar ── */}
      <header className="shrink-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between px-6 py-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <span className="text-sm font-bold text-gray-900">Become a Merchant</span>
          <span className="text-xs font-semibold text-gray-400 tabular-nums">
            {step} / {STEPS.length}
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-0.5 bg-gray-100">
          <div
            className="h-full bg-brand-500 transition-all duration-500"
            style={{ width: `${(step / STEPS.length) * 100}%` }}
          />
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left Sidebar ── */}
        <aside className="hidden md:flex w-64 shrink-0 bg-gradient-to-b from-brand-500 via-brand-600 to-brand-700 flex-col px-6 py-8">

          {/* Step list */}
          <div className="flex-1 flex flex-col gap-0">
            {STEPS.map((s, i) => {
              const done = step > s.id;
              const active = step === s.id;
              return (
                <div key={s.id} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                      done ? "bg-white border-white" : active ? "bg-white/20 border-white" : "bg-transparent border-white/20"
                    }`}>
                      {done ? (
                        <Check className="h-3.5 w-3.5 text-brand-500" />
                      ) : (
                        <span className={`text-[11px] font-bold ${active ? "text-white" : "text-white/30"}`}>
                          {s.id}
                        </span>
                      )}
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={`w-px h-10 mt-1 transition-colors ${done ? "bg-white/60" : "bg-white/10"}`} />
                    )}
                  </div>
                  <div className="pt-0.5 pb-10">
                    <p className={`text-[11px] font-bold uppercase tracking-wider ${active ? "text-white" : done ? "text-white/60" : "text-white/25"}`}>
                      Step {s.id}
                    </p>
                    <p className={`text-sm font-semibold mt-0.5 ${active || done ? "text-white" : "text-white/25"}`}>
                      {s.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Step tip */}
          <div className="bg-white/10 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="h-4 w-4 text-amber-300 shrink-0" />
              <p className="text-xs font-bold text-white">Pro tip</p>
            </div>
            <p className="text-xs text-green-100/80 leading-relaxed">
              {currentStep.tip}
            </p>
          </div>
        </aside>

        {/* ── Right Panel ── */}
        <main className="flex-1 overflow-y-auto p-8 flex items-center justify-center">
          <div className="flex flex-col max-w-xl w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            {/* Step heading */}
            <div className="shrink-0 px-8 pt-8 pb-6 border-b border-gray-100">
              <h1 className="text-xl font-bold text-gray-900">{currentStep.label}</h1>
              <p className="text-sm text-gray-400 mt-1">{currentStep.sublabel}</p>
            </div>

            {/* Form content */}
            <div className="px-8 py-6 space-y-4">

              {/* Step 1 — Store Identity */}
              {step === 1 && (
                <>
                  <div>
                    <label className={labelCls}>Store Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Goa Beach Resort"
                      value={form.business_name}
                      onChange={(e) => set("business_name", e.target.value)}
                      className={inputCls}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Business Category *</label>
                      <CustomSelect
                        placeholder="Select category"
                        value={form.category_id}
                        options={categories?.map((c) => ({ value: c.id, label: c.name })) ?? []}
                        onChange={(val) => { set("category_id", val); set("subcategory_id", ""); }}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Sub-Category</label>
                      <CustomSelect
                        placeholder="Select sub-category"
                        value={form.subcategory_id}
                        options={subcategories.map((s) => ({ value: s.id, label: s.name }))}
                        onChange={(val) => set("subcategory_id", val)}
                        disabled={!form.category_id}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Store Description <span className="normal-case text-gray-300 font-normal">(optional)</span></label>
                    <textarea
                      rows={2}
                      placeholder="Briefly describe what you sell, your specialties, and your brand story."
                      value={form.bio}
                      onChange={(e) => set("bio", e.target.value)}
                      className={`${inputCls} resize-none`}
                    />
                  </div>
                </>
              )}

              {/* Step 2 — Contact Details */}
              {step === 2 && (
                <>
                  <div>
                    <label className={labelCls}>Email Address</label>
                    <input
                      type="email"
                      value={user?.email ?? ""}
                      disabled
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                    />
                    <p className="text-[11px] text-gray-400 mt-1">Linked to your account — cannot be changed here.</p>
                  </div>

                  <div>
                    <label className={labelCls}>Mobile Number</label>
                    <input
                      type="tel"
                      placeholder="+91 00000 00000"
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      className={inputCls}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>Website <span className="normal-case text-gray-300 font-normal">(optional)</span></label>
                    <input
                      type="url"
                      placeholder="https://www.yourbusiness.com"
                      value={form.website}
                      onChange={(e) => set("website", e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </>
              )}

              {/* Step 3 — Location */}
              {step === 3 && (
                <div className="bg-brand-50 border border-brand-200 rounded-2xl p-6 flex items-start gap-5">
                  <div className="h-12 w-12 rounded-full bg-brand-500/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-6 w-6 text-brand-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">Add Locations After Sign-up</p>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                      Once your merchant profile is live, go to{" "}
                      <span className="font-semibold text-brand-500">Dashboard → Locations</span>{" "}
                      to pin your physical branches on the map and make it easy for nearby customers to find you.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 4 — Review & Submit */}
              {step === 4 && (
                <>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50 overflow-hidden">
                    <ReviewRow label="Store Name" value={form.business_name} />
                    <ReviewRow label="Category" value={categories?.find((c) => c.id === form.category_id)?.name ?? "—"} />
                    <ReviewRow label="Sub-Category" value={subcategories.find((s) => s.id === form.subcategory_id)?.name ?? "—"} />
                    <ReviewRow label="Description" value={form.bio || "—"} />
                    <ReviewRow label="Phone" value={form.phone || "—"} />
                    <ReviewRow label="Website" value={form.website || "—"} />
                    <ReviewRow label="Email" value={user?.email ?? "—"} />
                  </div>

                  {error && (
                    <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                      {error}
                    </p>
                  )}

                  <div className="bg-gradient-to-r from-brand-500 to-brand-400 rounded-xl px-4 py-3 flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-white shrink-0" />
                    <p className="text-xs text-green-100 leading-relaxed">
                      By submitting you agree to our Supplier Terms of Service. Your account will be reviewed within 48 hours.
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* ── Navigation (inside card, pinned to bottom) ── */}
            <div className="shrink-0 flex items-center justify-between px-8 py-5 border-t border-gray-100">
              {step > 1 ? (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
              ) : (
                <button
                  onClick={() => router.back()}
                  className="text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Cancel
                </button>
              )}

              {step < 4 ? (
                <button
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canAdvance()}
                  className="flex items-center gap-2 px-6 py-2.5 bg-brand-500 hover:bg-brand-800 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-2.5 bg-brand-500 hover:bg-brand-800 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
                >
                  {submitting ? "Submitting…" : "Submit & Go Live"}
                  {!submitting && <ArrowRight className="h-4 w-4" />}
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

interface SelectOption { value: string; label: string }

function CustomSelect({
  placeholder,
  value,
  options,
  onChange,
  disabled,
}: {
  placeholder: string;
  value: string;
  options: SelectOption[];
  onChange: (val: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        className={`w-full flex items-center justify-between px-3 py-2.5 border rounded-md text-sm bg-white transition-all ${
          open
            ? "border-brand-500 ring-2 ring-brand-500/10"
            : "border-gray-300 hover:border-gray-400"
        } ${disabled ? "opacity-40 cursor-not-allowed bg-gray-50" : "cursor-pointer"}`}
      >
        <span className={selected ? "text-gray-900" : "text-gray-400"}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && options.length > 0 && (
        <div className="absolute z-50 mt-1.5 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          <div className="max-h-48 overflow-y-auto py-1">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                  opt.value === value
                    ? "bg-brand-50 text-brand-500 font-semibold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {opt.label}
                {opt.value === value && <Check className="h-3.5 w-3.5 text-brand-500" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between px-5 py-3">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide w-28 shrink-0">{label}</span>
      <span className="text-sm text-gray-800 text-right flex-1 break-words">{value}</span>
    </div>
  );
}
