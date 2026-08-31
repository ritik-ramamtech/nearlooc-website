"use client";

import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductSummary } from "@/types/merchant";

interface Props {
  product: ProductSummary;

  form: {
    discounted_price: string;
    promo_price: string;
    promo_end_at: string;
    badge: string;
    duration: string;
  };

  set: (field: keyof Props["form"], value: string) => void;

  features: string[];
  featureInput: string;
  setFeatureInput: (value: string) => void;
  addFeature: () => void;
  removeFeature: (index: number) => void;

  terms: string[];
  termInput: string;
  setTermInput: (value: string) => void;
  addTerm: () => void;
  removeTerm: (index: number) => void;

  locations: {
    id: string;
    label: string;
    city: string;
  }[];

  selectedLocations: string[];

  toggleLocation: (id: string) => void;

  creating: boolean;

  onCancel: () => void;

  onSubmit: () => void;
}

export default function CreateOfferForm({
  product,
  form,
  set,

  features,
  featureInput,
  setFeatureInput,
  addFeature,
  removeFeature,

  terms,
  termInput,
  setTermInput,
  addTerm,
  removeTerm,

  locations,
  selectedLocations,
  toggleLocation,

  creating,

  onCancel,
  onSubmit,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      {/* HEADER */}

      <div className="border-b px-6 py-5">
        <h2 className="text-xl font-bold">Create Offer</h2>

        <p className="mt-1 text-sm text-gray-500">
          Create a promotional offer for{" "}
          <span className="font-medium">{product.title}</span>
        </p>
      </div>

      <div className="space-y-8 p-6">
        {/* PRICE */}

        <section>
          <h3 className="mb-4 font-semibold">Pricing</h3>

          <div className="grid grid-cols-2 gap-5">
            <Input
              label="Discounted Price"
              value={form.discounted_price}
              onChange={(v) => set("discounted_price", v)}
            />

            <Input
              label="Promo Price"
              value={form.promo_price}
              onChange={(v) => set("promo_price", v)}
            />
          </div>
        </section>

        {/* DETAILS */}

        <section>
          <h3 className="mb-4 font-semibold">Offer Details</h3>

          <div className="grid grid-cols-2 gap-5">
            <Input
              label="Badge"
              value={form.badge}
              onChange={(v) => set("badge", v)}
            />

            <Input
              label="Duration"
              value={form.duration}
              onChange={(v) => set("duration", v)}
            />

            <div className="col-span-2">
              <label className="mb-2 block text-sm font-medium">
                Promo End Date
              </label>

              <input
                type="datetime-local"
                className="w-full rounded-lg border px-3 py-2"
                value={form.promo_end_at}
                onChange={(e) => set("promo_end_at", e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* FEATURES */}

        <TagSection
          title="Features"
          items={features}
          input={featureInput}
          setInput={setFeatureInput}
          onAdd={addFeature}
          onRemove={removeFeature}
        />

        {/* TERMS */}

        <TagSection
          title="Terms"
          items={terms}
          input={termInput}
          setInput={setTermInput}
          onAdd={addTerm}
          onRemove={removeTerm}
        />

        {/* LOCATIONS */}

        <section>
          <h3 className="mb-4 font-semibold">Locations</h3>

          <div className="grid grid-cols-2 gap-3">
            {locations.map((location) => (
              <button
                key={location.id}
                type="button"
                onClick={() => toggleLocation(location.id)}
                className={`rounded-xl border p-4 text-left transition ${
                  selectedLocations.includes(location.id)
                    ? "border-brand-500 bg-brand-50"
                    : "hover:bg-gray-50"
                }`}
              >
                <p className="font-medium">{location.label}</p>

                <p className="text-sm text-gray-500">{location.city}</p>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* FOOTER */}

      <div className="flex justify-end gap-3 border-t bg-gray-50 px-6 py-5">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>

        <Button disabled={creating} onClick={onSubmit}>
          {creating ? "Creating..." : "Create Offer"}
        </Button>
      </div>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium">{label}</label>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border px-3 py-2"
      />
    </div>
  );
}

function TagSection({
  title,
  items,
  input,
  setInput,
  onAdd,
  onRemove,
}: {
  title: string;
  items: string[];
  input: string;
  setInput: (v: string) => void;
  onAdd: () => void;
  onRemove: (i: number) => void;
}) {
  return (
    <section>
      <h3 className="mb-4 font-semibold">{title}</h3>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 rounded-lg border px-3 py-2"
        />

        <Button type="button" onClick={onAdd}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {items.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1"
            >
              {item}

              <button onClick={() => onRemove(index)}>
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
