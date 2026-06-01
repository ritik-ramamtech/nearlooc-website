"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Store, Phone, MapPin, CheckCircle, Check } from "lucide-react";
import { useCategories } from "@/features/categories/hooks";
import { saveMerchantProfile } from "@/features/merchant/profile/api";
import { useAuthStore } from "@/store/auth.store";

interface FormData {
  business_name: string;
  category_id: string;
  subcategory_id: string;
  bio: string;
  phone: string;
  website: string;
}

const STEPS = [
  { id: 1, label: "Store Identity", sublabel: "Business basics", Icon: Store },
  { id: 2, label: "Contact Details", sublabel: "How to reach you", Icon: Phone },
  { id: 3, label: "Location", sublabel: "Store physical address", Icon: MapPin },
  { id: 4, label: "Review & Submit", sublabel: "Confirm and go live", Icon: CheckCircle },
];

export default function BecomeMerchantPage() {
  const router = useRouter();
  const { data: categories } = useCategories();
  const { user, merchant_id } = useAuthStore();

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
    if (merchant_id) router.replace("/dashboard");
  }, [merchant_id, router]);

  if (merchant_id) return null;

  const selectedCategory = categories?.find((c) => c.id === form.category_id);
  const subcategories = selectedCategory?.subcategories ?? [];

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
      await saveMerchantProfile({
        business_name: form.business_name,
        bio: form.bio || undefined,
        phone: form.phone || undefined,
        website: form.website || undefined,
        category_id: form.category_id || undefined,
        subcategory_id: form.subcategory_id || undefined,
      });
      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e8f5e9] flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <span className="text-sm font-semibold text-gray-800">Become a Supplier</span>
        <span className="text-xs text-gray-400">Complete Account Details</span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left step panel */}
        <aside className="hidden md:flex flex-col w-56 bg-[#e8f5e9] p-6 shrink-0">
          <div className="flex flex-col gap-0 flex-1">
            {STEPS.map((s, i) => {
              const done = step > s.id;
              const active = step === s.id;
              return (
                <div key={s.id} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${
                        done
                          ? "bg-[#1a5c2a] border-[#1a5c2a]"
                          : active
                          ? "bg-[#1a5c2a] border-[#1a5c2a]"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      {done ? (
                        <Check className="h-4 w-4 text-white" />
                      ) : (
                        <span
                          className={`text-xs font-bold ${
                            active ? "text-white" : "text-gray-400"
                          }`}
                        >
                          {String(s.id).padStart(2, "0")}
                        </span>
                      )}
                    </div>
                    {i < STEPS.length - 1 && (
                      <div
                        className={`w-0.5 h-10 mt-1 ${
                          done ? "bg-[#1a5c2a]" : "bg-gray-300"
                        }`}
                      />
                    )}
                  </div>
                  <div className="pt-1 pb-10">
                    <p
                      className={`text-xs font-semibold uppercase tracking-wide ${
                        active ? "text-[#1a5c2a]" : done ? "text-[#1a5c2a]" : "text-gray-400"
                      }`}
                    >
                      Step {String(s.id).padStart(2, "0")}
                    </p>
                    <p
                      className={`text-sm font-semibold mt-0.5 ${
                        active || done ? "text-gray-800" : "text-gray-400"
                      }`}
                    >
                      {s.label}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.sublabel}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tip box */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <p className="text-xs font-semibold text-[#1a5c2a] mb-1">Need help?</p>
            <p className="text-xs text-gray-500">
              Our supplier support team is available 24/7 to assist with your onboarding.
            </p>
          </div>
        </aside>

        {/* Mobile step indicator */}
        <div className="md:hidden fixed top-[57px] left-0 right-0 z-10 bg-[#e8f5e9] px-4 py-3 flex items-center gap-2">
          {STEPS.map((s) => (
            <div
              key={s.id}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                step >= s.id ? "bg-[#1a5c2a]" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Right form panel */}
        <main className="flex-1 flex items-start justify-center p-4 md:p-10 overflow-y-auto mt-8 md:mt-0">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
            {/* Step 1 — Store Identity */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Store Identity</h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Tell us about your business to help customers find you.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                      Store Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Goa Beach Resort"
                      value={form.business_name}
                      onChange={(e) => set("business_name", e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:border-[#1a5c2a] focus:ring-2 focus:ring-[#1a5c2a]/10 transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                        Business Category *
                      </label>
                      <select
                        value={form.category_id}
                        onChange={(e) => {
                          set("category_id", e.target.value);
                          set("subcategory_id", "");
                        }}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:border-[#1a5c2a] focus:ring-2 focus:ring-[#1a5c2a]/10 transition"
                      >
                        <option value="">Select category</option>
                        {categories?.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                        Sub-Category
                      </label>
                      <select
                        value={form.subcategory_id}
                        onChange={(e) => set("subcategory_id", e.target.value)}
                        disabled={!form.category_id}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:border-[#1a5c2a] focus:ring-2 focus:ring-[#1a5c2a]/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="">
                          {form.category_id ? "Select a category first" : "Select a category first"}
                        </option>
                        {subcategories.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                      Store Description (Optional)
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Briefly describe what you sell, your specialties, and your brand story."
                      value={form.bio}
                      onChange={(e) => set("bio", e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:border-[#1a5c2a] focus:ring-2 focus:ring-[#1a5c2a]/10 transition resize-none"
                    />
                  </div>
                </div>

                {/* Info cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#f0f7f0] rounded-xl p-3 flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-[#1a5c2a] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-gray-800">Verified Badge</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Complete the form to earn your &quot;Trusted Supplier&quot; badge and gain 2× visibility.
                      </p>
                    </div>
                  </div>
                  <div className="bg-[#f0f7f0] rounded-xl p-3 flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 text-[#1a5c2a] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-gray-800">Go Live Faster</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Accurate details speed up the manual verification process by up to 48 hours.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 — Contact Details */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Contact Details</h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Provide the primary contact information for your business.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user?.email ?? ""}
                      disabled
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-[11px] text-gray-400 mt-1">Linked to your account — cannot be changed here.</p>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 00000 00000"
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:border-[#1a5c2a] focus:ring-2 focus:ring-[#1a5c2a]/10 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                      Website (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://www.yourbusiness.com"
                      value={form.website}
                      onChange={(e) => set("website", e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:border-[#1a5c2a] focus:ring-2 focus:ring-[#1a5c2a]/10 transition"
                    />
                  </div>
                </div>

                <div className="bg-[#f0f7f0] rounded-xl p-3 flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-[#1a5c2a] mt-0.5 shrink-0" />
                  <p className="text-xs text-gray-600">
                    Adding a website increases trust with potential customers by 40%.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3 — Location */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Establish your Presence</h1>
                  <p className="text-sm text-gray-500 mt-1">
                    You can add your store locations from your merchant dashboard after your account is created.
                  </p>
                </div>

                <div className="bg-[#f0f7f0] border border-[#c8e6c9] rounded-2xl p-6 flex flex-col items-center text-center gap-3">
                  <div className="h-14 w-14 rounded-full bg-[#1a5c2a]/10 flex items-center justify-center">
                    <MapPin className="h-7 w-7 text-[#1a5c2a]" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Add Locations After Sign-up</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Once your merchant profile is created, go to{" "}
                      <span className="font-medium text-[#1a5c2a]">Dashboard → Locations</span> to
                      pin your physical branches on the map and help customers find you easily.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white border border-gray-200 rounded-xl p-3">
                    <p className="text-xs font-semibold text-gray-800">Secure Merchant Portal</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Your data is encrypted and safe.</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl p-3">
                    <p className="text-xs font-semibold text-gray-800">Auto-saving Progress</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">Your details are saved as you go.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4 — Review & Submit */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Review & Submit</h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Check your details before going live.
                  </p>
                </div>

                <div className="space-y-3">
                  <ReviewRow label="Store Name" value={form.business_name} />
                  <ReviewRow
                    label="Category"
                    value={categories?.find((c) => c.id === form.category_id)?.name ?? "—"}
                  />
                  <ReviewRow
                    label="Sub-Category"
                    value={
                      subcategories.find((s) => s.id === form.subcategory_id)?.name ?? "—"
                    }
                  />
                  <ReviewRow label="Description" value={form.bio || "—"} />
                  <ReviewRow label="Phone" value={form.phone || "—"} />
                  <ReviewRow label="Website" value={form.website || "—"} />
                  <ReviewRow label="Email" value={user?.email ?? "—"} />
                </div>

                {error && (
                  <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <div className="bg-[#1a5c2a] rounded-xl p-4 text-white">
                  <p className="text-sm font-semibold">Almost there!</p>
                  <p className="text-xs mt-1 text-green-200">
                    By submitting you agree to our Supplier Terms of Service. Your account will be
                    reviewed within 48 hours.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              {step > 1 ? (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <div className="flex items-center gap-3">
                  {step === 1 && (
                    <button
                      onClick={() => router.back()}
                      className="px-5 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      Save as Draft
                    </button>
                  )}
                  <button
                    onClick={() => setStep((s) => s + 1)}
                    disabled={!canAdvance()}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#1a5c2a] hover:bg-[#14471f] text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#1a5c2a] hover:bg-[#14471f] text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
                >
                  {submitting ? "Submitting..." : "Submit & Go Live"}
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

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between py-2.5 border-b border-gray-100 last:border-0">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide w-32 shrink-0">
        {label}
      </span>
      <span className="text-sm text-gray-800 text-right flex-1 break-words">{value}</span>
    </div>
  );
}
