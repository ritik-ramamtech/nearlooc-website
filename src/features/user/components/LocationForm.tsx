"use client";

import { Field } from "@/components/form/field";
import { useAddAdress, useSavedAddresses, useUpdateAddress } from "../hooks";
import { useEffect, useState } from "react";
import { Button, Input } from "@/components/ui";
import { geocode, reverseGeocode } from "@/lib/location";
import { useRouter } from "next/navigation";

interface LocationFormParams {
  mode: "create" | "edit";
  id?: string;
}

export default function LocationForm(params: LocationFormParams) {
  const { mode, id } = params;
  const { data = [], isLoading } = useSavedAddresses();
  const { mutate: updateAddress, isPending: isUpdating } = useUpdateAddress();
  const { mutate: addAddress, isPending } = useAddAdress();
  const address = data.find((a) => a.id === id);

  const router = useRouter();

  const [form, setForm] = useState({
    label: "",
    street: "",
    city: "",
    state: "",
    postal_code: "",
  });
  const [detecting, setDetecting] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<{
    latitude: number;
    longitude: number;
  } | null>(
    address
      ? { latitude: address.latitude, longitude: address.longitude }
      : null,
  );

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation not supported by your browser");
      return;
    }

    setDetecting(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const location = await reverseGeocode(
            pos.coords.latitude,
            pos.coords.longitude,
          );
          setForm((prev) => ({
            ...prev,
            street: location.street,
            city: location.city,
            state: location.state,
            postal_code: location.postalCode,
          }));
          setCoordinates({
            latitude: location.latitude,
            longitude: location.longitude,
          });
        } finally {
          setDetecting(false);
        }
      },
      () => {
        setDetecting(false);
        //Show an error later
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5 * 60 * 1000,
      },
    );
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { latitude, longitude } = await geocode(form);
      if (mode === "edit") {
        if (!id) return;
        updateAddress(
          { id, data: { ...form, latitude, longitude } },
          {
            onSuccess: () => router.replace("/profile/location"),
          },
        );
      } else {
        addAddress(
          { data: { ...form, latitude, longitude } },
          {
            onSuccess: () => router.replace("/profile/location"),
          },
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!address) return;

    setForm({
      label: address.label,
      street: address.street,
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
    });
    setCoordinates({
      latitude: address.latitude,
      longitude: address.longitude,
    });
  }, [address]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="mx-auto my-8 max-w-3xl rounded-2xl border bg-white shadow-sm">
      {/* Header */}
      <div className="border-b px-8 py-6">
        <h1 className="text-2xl font-semibold">Edit Address</h1>

        <p className="mt-1 text-sm text-gray-500">
          Update your delivery address details.
        </p>
      </div>

      {/* Form */}
      <form className="space-y-6 p-8" onSubmit={(e) => handleSubmit(e)}>
        <Field label="Address Label">
          <Input
            value={form.label}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                label: e.target.value,
              }))
            }
            placeholder="eg. Home"
            className=" placeholder:text-gray-500"
          />
        </Field>

        <Field label="Street Address">
          <Input
            value={form.street}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                street: e.target.value,
              }))
            }
          />
        </Field>

        <div className="grid grid-cols-2 gap-5">
          <Field label="City">
            <Input
              value={form.city}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  city: e.target.value,
                }))
              }
            />
          </Field>

          <Field label="State">
            <Input
              value={form.state}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  state: e.target.value,
                }))
              }
            />
          </Field>
        </div>

        <Field label="Postal Code">
          <Input
            value={form.postal_code}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                postal_code: e.target.value,
              }))
            }
          />
        </Field>

        <div className="rounded-xl border border-dashed bg-gray-50 p-4">
          <p className="text-sm font-medium">Detected Location</p>

          {coordinates ? (
            <p className="mt-1 text-sm text-gray-500">
              {address?.latitude?.toFixed(6)}, {address?.longitude?.toFixed(6)}
            </p>
          ) : (
            <p className="mt-1 text-sm text-gray-500">
              No coordinates detected yet.
            </p>
          )}

          <Button type="button" variant="outline" className="mt-4">
            Detect Current Location
          </Button>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" type="button">
            Cancel
          </Button>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
