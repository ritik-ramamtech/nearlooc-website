"use client";

import { useState, useCallback } from "react";
import {
  MapPin, Plus, Pencil, Trash2, Star, Bell, Search, X, Check,
} from "lucide-react";
import {
  useMerchantLocations,
  useCreateLocation,
  useUpdateLocation,
  useDeleteLocation,
} from "@/features/merchant/locations/hooks";
import { useMerchantProfile } from "@/features/merchant/profile/hooks";
import { SkeletonList } from "@/components/ui/skeleton";
import type { MerchantLocationData } from "@/types/merchant";
import type { CreateLocationInput } from "@/features/merchant/locations/api";
import { LocationPicker, type PickedLocation } from "@/features/merchant/locations/components/LocationPicker";

const EMPTY_FORM: CreateLocationInput = {
  label: "",
  street: "",
  city: "",
  state: "",
  postal_code: "",
  latitude: undefined,
  longitude: undefined,
  is_primary: false,
};

export default function LocationsPage() {
  const { data: locations, isPending } = useMerchantLocations();
  const { data: profile } = useMerchantProfile();
  const { mutate: create, isPending: creating } = useCreateLocation();
  const { mutate: update, isPending: updating } = useUpdateLocation();
  const { mutate: remove } = useDeleteLocation();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<MerchantLocationData | null>(null);
  const [form, setForm] = useState<CreateLocationInput>(EMPTY_FORM);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const set = (field: keyof CreateLocationInput, value: string | boolean | number | undefined) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleLocationPicked = useCallback((loc: PickedLocation) => {
    setForm((prev) => ({
      ...prev,
      latitude: loc.lat,
      longitude: loc.lng,
      ...(loc.street && { street: loc.street }),
      ...(loc.city && { city: loc.city }),
      ...(loc.state && { state: loc.state }),
      ...(loc.postal_code && { postal_code: loc.postal_code }),
    }));
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (loc: MerchantLocationData) => {
    setEditing(loc);
    setForm({
      label: loc.label,
      street: loc.street,
      city: loc.city,
      state: loc.state,
      postal_code: loc.postal_code,
      latitude: loc.latitude ?? undefined,
      longitude: loc.longitude ?? undefined,
      is_primary: loc.is_primary,
    });
    setShowForm(true);
  };

  const handleSubmit = () => {
    if (!form.label || !form.street || !form.city || !form.state || !form.postal_code) return;

    if (editing) {
      update(
        { id: editing.id, data: form },
        { onSuccess: () => { setShowForm(false); setEditing(null); } }
      );
    } else {
      create(form, { onSuccess: () => { setShowForm(false); setForm(EMPTY_FORM); } });
    }
  };

  const count = locations?.length ?? 0;

  return (
    <div className="min-h-screen bg-page-bg">
      {/* Top nav */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-20 sm:px-6">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Store Locations</h1>
          <p className="text-xs text-gray-400">Manage your physical store presence</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              placeholder="Search locations..."
              className="bg-transparent text-sm outline-none text-gray-700 w-32"
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



      <div className="p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          {/* Left stat card */}
          <div className="w-full shrink-0 space-y-4 sm:w-56">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="h-9 w-9 rounded-lg bg-brand-50 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-brand-500" />
                </div>
                {count > 0 && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-brand-100 text-brand-500">
                    Active
                  </span>
                )}
              </div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                Store Locations
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{count}</p>
              <p className="text-xs text-gray-400 mt-1">
                {count === 0
                  ? "No locations added yet"
                  : `Manage all physical branches of your store`}
              </p>
            </div>

            <button
              onClick={openAdd}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-500 hover:bg-brand-800 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Location
            </button>
          </div>

          {/* Right content */}
          <div className="flex-1">
            {isPending ? (
              <SkeletonList itemHeight={96} itemClassName="rounded-xl" min={2} />
            ) : count === 0 && !showForm ? (
              /* Empty state */
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-10 flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-brand-50 flex items-center justify-center mb-4">
                  <MapPin className="h-8 w-8 text-gray-300" />
                </div>
                <p className="text-base font-semibold text-gray-800">No locations added</p>
                <p className="text-sm text-gray-400 mt-1 max-w-xs">
                  Start by pinning your physical branches on the map to help customers find you easily.
                </p>
                <button
                  onClick={openAdd}
                  className="mt-5 flex items-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-800 text-white rounded-lg text-sm font-semibold transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Your First Location
                </button>

                {/* Map placeholder */}
                <div className="mt-6 w-full max-w-md bg-gray-100 rounded-xl h-40 flex items-center justify-center border border-dashed border-gray-300">
                  <p className="text-xs text-gray-400">Map will activate after first location</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Location cards */}
                {locations?.map((loc) => (
                  <LocationCard
                    key={loc.id}
                    loc={loc}
                    deleteConfirm={deleteConfirm}
                    onEdit={() => openEdit(loc)}
                    onDeleteRequest={() => setDeleteConfirm(loc.id)}
                    onDeleteConfirm={() => {
                      remove(loc.id, { onSuccess: () => setDeleteConfirm(null) });
                    }}
                    onDeleteCancel={() => setDeleteConfirm(null)}
                  />
                ))}
              </div>
            )}

            {/* Add / Edit form */}
            {showForm && (
              <div className="mt-4 bg-white rounded-xl border border-brand-500 shadow-sm p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-bold text-gray-900">
                    {editing ? "Edit Location" : "Add New Location"}
                  </h2>
                  <button
                    onClick={() => { setShowForm(false); setEditing(null); }}
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-4">
                  <FormField
                    label="Branch Name *"
                    placeholder="e.g. Main Branch"
                    value={form.label}
                    onChange={(v) => set("label", v)}
                  />
                  <FormField
                    label="Street Address *"
                    placeholder="e.g. 123 Palm Beach Road"
                    value={form.street}
                    onChange={(v) => set("street", v)}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      label="City *"
                      placeholder="e.g. Goa"
                      value={form.city}
                      onChange={(v) => set("city", v)}
                    />
                    <FormField
                      label="Pincode *"
                      placeholder="6 digits"
                      value={form.postal_code}
                      onChange={(v) => set("postal_code", v)}
                    />
                  </div>
                  <FormField
                    label="State *"
                    placeholder="e.g. Goa"
                    value={form.state}
                    onChange={(v) => set("state", v)}
                  />

                  <div>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                      Pin on Map
                    </p>
                    <LocationPicker
                      key={editing?.id ?? "new"}
                      initialLat={form.latitude}
                      initialLng={form.longitude}
                      onLocationChange={handleLocationPicked}
                    />
                    <p className="mt-1.5 text-[11px] text-gray-400">
                      Search for an address or click anywhere on the map — coordinates and address fields will fill automatically.
                    </p>
                  </div>

                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <div
                      onClick={() => set("is_primary", !form.is_primary)}
                      className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-colors ${
                        form.is_primary
                          ? "bg-brand-500 border-brand-500"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {form.is_primary && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <span className="text-sm font-medium text-gray-700">Set as primary location</span>
                  </label>
                </div>

                <div className="flex items-center gap-3 mt-6">
                  <button
                    onClick={() => { setShowForm(false); setEditing(null); }}
                    className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={creating || updating}
                    className="flex items-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-800 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
                  >
                    {creating || updating ? "Saving..." : editing ? "Save Changes" : "Save Location"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LocationCard({
  loc, deleteConfirm, onEdit, onDeleteRequest, onDeleteConfirm, onDeleteCancel,
}: {
  loc: MerchantLocationData;
  deleteConfirm: string | null;
  onEdit: () => void;
  onDeleteRequest: () => void;
  onDeleteConfirm: () => void;
  onDeleteCancel: () => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-lg bg-brand-50 flex items-center justify-center shrink-0 mt-0.5">
            <MapPin className="h-4 w-4 text-brand-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-gray-900">{loc.label}</p>
              {loc.is_primary && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-100 text-brand-500">
                  <Star className="h-2.5 w-2.5" />
                  Primary
                </span>
              )}
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                Active
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">{loc.street}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {loc.city}, {loc.state} — {loc.postal_code}
            </p>
            {loc.latitude && loc.longitude && (
              <p className="text-[11px] text-gray-400 mt-0.5">
                {loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onEdit}
            className="p-2 rounded-lg hover:bg-brand-50 text-gray-400 hover:text-brand-500 transition-colors"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={onDeleteRequest}
            className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {deleteConfirm === loc.id && (
        <div className="mt-4 flex items-center justify-between bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <p className="text-sm text-red-700 font-medium">Delete this location?</p>
          <div className="flex gap-2">
            <button
              onClick={onDeleteCancel}
              className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onDeleteConfirm}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FormField({
  label, placeholder, value, onChange, type = "text",
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition"
      />
    </div>
  );
}
