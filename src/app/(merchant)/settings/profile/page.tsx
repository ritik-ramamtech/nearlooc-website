"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Camera, Upload, X, Plus, Bell, Globe, Phone, FileText,
  Store, CheckCircle, Trash2,
} from "lucide-react";
import { useMerchantProfile, useSaveMerchantProfile } from "@/features/merchant/profile/hooks";
import { useCategories } from "@/features/categories/hooks";
import apiClient from "@/lib/api-client";

export default function MerchantProfilePage() {
  const { data: profile, isPending } = useMerchantProfile();
  const { mutate: save, isPending: saving } = useSaveMerchantProfile();
  const { data: categories } = useCategories();

  const [form, setForm] = useState({
    business_name: "",
    bio: "",
    phone: "",
    website: "",
    category_id: "",
    subcategory_id: "",
  });
  const [saved, setSaved] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [storeImgUploading, setStoreImgUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const logoRef = useRef<HTMLInputElement>(null);
  const storeImgRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setForm({
        business_name: profile.business_name ?? "",
        bio: profile.bio ?? "",
        phone: profile.phone ?? "",
        website: profile.website ?? "",
        category_id: profile.category_id ?? "",
        subcategory_id: profile.subcategory_id ?? "",
      });
    }
  }, [profile]);

  const set = (field: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const selectedCategory = categories?.find((c) => c.id === form.category_id);
  const subcategories = selectedCategory?.subcategories ?? [];

  const handleSave = () => {
    save(
      {
        business_name: form.business_name || undefined,
        bio: form.bio || undefined,
        phone: form.phone || undefined,
        website: form.website || undefined,
        category_id: form.category_id || undefined,
        subcategory_id: form.subcategory_id || undefined,
      },
      {
        onSuccess: () => {
          setSaved(true);
          setTimeout(() => setSaved(false), 2500);
        },
      }
    );
  };

  const uploadLogo = async (file: File) => {
    setLogoUploading(true);
    setUploadError(null);
    try {
      const fd = new FormData();
      fd.append("files", file);
      fd.append("flag", "logo");
      await apiClient.post("/upload/merchant/logo", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Re-fetch profile to get new logo_url
      window.location.reload();
    } catch {
      setUploadError("Logo upload failed. Please try again.");
    } finally {
      setLogoUploading(false);
    }
  };

  const uploadStoreImages = async (files: FileList) => {
    setStoreImgUploading(true);
    setUploadError(null);
    try {
      const fd = new FormData();
      Array.from(files).forEach((f) => fd.append("files", f));
      fd.append("flag", "store_images");
      await apiClient.post("/upload/merchant/logo", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      window.location.reload();
    } catch {
      setUploadError("Store image upload failed. Please try again.");
    } finally {
      setStoreImgUploading(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-[#f0f7f0] p-6 space-y-4 animate-pulse">
        <div className="h-10 w-48 bg-gray-200 rounded-xl" />
        <div className="h-64 bg-gray-200 rounded-2xl" />
        <div className="h-96 bg-gray-200 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f7f0]">
      {/* Top nav */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-20">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Merchant Profile</h1>
          <p className="text-xs text-gray-400">Manage your business details and branding</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell className="h-5 w-5 text-gray-500" />
          </button>
          <div className="h-8 w-8 rounded-full bg-[#1a5c2a] flex items-center justify-center text-white text-sm font-bold">
            {profile?.business_name?.[0]?.toUpperCase() ?? "M"}
          </div>
        </div>
      </header>

      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Logo & branding card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base font-bold text-gray-900 mb-1">Brand Identity</h2>
          <p className="text-sm text-gray-400 mb-5">Your logo and store photos</p>

          {/* Logo upload */}
          <div className="flex items-center gap-5 mb-6 pb-6 border-b border-gray-100">
            <div className="relative">
              <div className="relative h-20 w-20 rounded-xl bg-[#f0f7f0] border-2 border-dashed border-[#c8e6c9] flex items-center justify-center overflow-hidden">
                {profile?.logo_url ? (
                  <Image
                    src={profile.logo_url}
                    alt="Logo"
                    fill
                    className="object-cover rounded-xl"
                  />
                ) : (
                  <Store className="h-8 w-8 text-gray-300" />
                )}
              </div>
              <button
                onClick={() => logoRef.current?.click()}
                disabled={logoUploading}
                className="absolute -bottom-2 -right-2 h-7 w-7 rounded-full bg-[#1a5c2a] flex items-center justify-center shadow-md hover:bg-[#14471f] transition-colors"
              >
                <Camera className="h-3.5 w-3.5 text-white" />
              </button>
              <input
                ref={logoRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && uploadLogo(e.target.files[0])}
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Business Logo</p>
              <p className="text-xs text-gray-400 mt-0.5">JPG or PNG · Max 5MB · Recommended 400×400</p>
              <button
                onClick={() => logoRef.current?.click()}
                disabled={logoUploading}
                className="mt-2 text-xs font-semibold text-[#1a5c2a] hover:underline disabled:opacity-50"
              >
                {logoUploading ? "Uploading..." : profile?.logo_url ? "Change Logo" : "Upload Logo"}
              </button>
            </div>
          </div>

          {/* Store images */}
          <div>
            <p className="text-sm font-semibold text-gray-800 mb-1">Store Photos</p>
            <p className="text-xs text-gray-400 mb-3">
              Upload multiple photos of your store. Users are 40% more likely to engage with stores
              that have at least 5 photos.
            </p>

            <div className="flex flex-wrap gap-3">
              {profile?.stores_imgs_url?.map((url, i) => (
                <div
                  key={i}
                  className="relative h-24 w-24 rounded-xl overflow-hidden border border-gray-200"
                >
                  <Image src={url} alt={`Store ${i + 1}`} fill className="object-cover" />
                </div>
              ))}

              {/* Add photos button */}
              <button
                onClick={() => storeImgRef.current?.click()}
                disabled={storeImgUploading}
                className="h-24 w-24 rounded-xl border-2 border-dashed border-[#c8e6c9] bg-[#f0f7f0] flex flex-col items-center justify-center gap-1 hover:bg-[#e8f5e9] transition-colors disabled:opacity-50"
              >
                {storeImgUploading ? (
                  <Upload className="h-5 w-5 text-gray-400 animate-bounce" />
                ) : (
                  <>
                    <Plus className="h-5 w-5 text-[#1a5c2a]" />
                    <span className="text-[10px] font-semibold text-[#1a5c2a]">Add Photos</span>
                  </>
                )}
              </button>
              <input
                ref={storeImgRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => e.target.files?.length && uploadStoreImages(e.target.files)}
              />
            </div>

            {uploadError && (
              <p className="mt-2 text-xs text-red-500 flex items-center gap-1">
                <X className="h-3.5 w-3.5" />
                {uploadError}
              </p>
            )}
          </div>
        </div>

        {/* Business details card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base font-bold text-gray-900 mb-1">Business Details</h2>
          <p className="text-sm text-gray-400 mb-5">Update your store information</p>

          <div className="space-y-4">
            {/* Business name */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                Store Name *
              </label>
              <div className="relative">
                <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={form.business_name}
                  onChange={(e) => set("business_name", e.target.value)}
                  placeholder="Your business name"
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:border-[#1a5c2a] focus:ring-2 focus:ring-[#1a5c2a]/10 transition"
                />
              </div>
            </div>

            {/* Category + subcategory */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                  Business Category
                </label>
                <select
                  value={form.category_id}
                  onChange={(e) => { set("category_id", e.target.value); set("subcategory_id", ""); }}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:border-[#1a5c2a] focus:ring-2 focus:ring-[#1a5c2a]/10 transition"
                >
                  <option value="">Select category</option>
                  {categories?.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
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
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:border-[#1a5c2a] focus:ring-2 focus:ring-[#1a5c2a]/10 transition disabled:opacity-50"
                >
                  <option value="">Select sub-category</option>
                  {subcategories.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                Store Description
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <textarea
                  rows={4}
                  value={form.bio}
                  onChange={(e) => set("bio", e.target.value)}
                  placeholder="Describe your business, specialties, and what makes you unique..."
                  className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:border-[#1a5c2a] focus:ring-2 focus:ring-[#1a5c2a]/10 transition resize-none"
                />
              </div>
            </div>

            {/* Phone + Website */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="+91 00000 00000"
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:border-[#1a5c2a] focus:ring-2 focus:ring-[#1a5c2a]/10 transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                  Website
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="url"
                    value={form.website}
                    onChange={(e) => set("website", e.target.value)}
                    placeholder="https://yoursite.com"
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:border-[#1a5c2a] focus:ring-2 focus:ring-[#1a5c2a]/10 transition"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Save button */}
          <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-100">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#1a5c2a] hover:bg-[#14471f] text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            {saved && (
              <span className="flex items-center gap-1.5 text-sm text-[#1a5c2a] font-medium">
                <CheckCircle className="h-4 w-4" />
                Saved successfully
              </span>
            )}
          </div>
        </div>

        {/* Read-only account info */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base font-bold text-gray-900 mb-1">Account Info</h2>
          <p className="text-sm text-gray-400 mb-5">Read-only details linked to your account</p>

          <div className="space-y-3">
            <ReadOnlyField label="Owner Name" value={profile?.owner?.name ?? "—"} />
            <ReadOnlyField label="Email" value={profile?.owner?.email ?? "—"} />
            <ReadOnlyField
              label="Verification Status"
              value={profile?.is_verified ? "Verified ✓" : "Pending verification"}
              highlight={profile?.is_verified}
            />
            <ReadOnlyField
              label="Member Since"
              value={profile?.created_at ? new Date(profile.created_at).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }) : "—"}
            />
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-6">
          <h2 className="text-base font-bold text-red-600 mb-1">Danger Zone</h2>
          <p className="text-sm text-gray-400 mb-4">
            Deactivating your merchant account will hide all your products and offers.
          </p>
          <button className="flex items-center gap-2 px-5 py-2.5 border border-red-300 text-red-500 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors">
            <Trash2 className="h-4 w-4" />
            Deactivate Merchant Account
          </button>
        </div>
      </div>
    </div>
  );
}

function ReadOnlyField({
  label, value, highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{label}</span>
      <span className={`text-sm font-medium ${highlight ? "text-[#1a5c2a]" : "text-gray-700"}`}>
        {value}
      </span>
    </div>
  );
}
