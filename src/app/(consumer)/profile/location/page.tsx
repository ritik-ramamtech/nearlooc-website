"use client";

import { useState } from "react";
import { MapPin, Loader2, Plus } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/button";
import { useSavedAddresses, useUpdateActiveAddress, useUpdateLocation } from "@/features/user/hooks";
import { Home, Briefcase, Heart } from "lucide-react";
import { useLocationStore } from "@/store/location.store";
import Link from "next/link";

const getIcon = (label: string) => {
  switch (label.toLowerCase()) {
    case "home":
      return Home;

    case "office":
      return Briefcase;

    case "current location":
      return MapPin;

    default:
      return Heart;
  }
};

export default function LocationPage() {
  const { mutate: updateLocation, isPending, isSuccess } = useUpdateLocation();
  const [detecting, setDetecting] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }
    setDetecting(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setDetecting(false);
        updateLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      () => {
        setDetecting(false);
        setGeoError("Unable to detect location. Please allow location access.");
      },
    );
  };

  const { location: current } = useLocationStore();
  const { data: addresses } = useSavedAddresses();
  const { mutate: updateActive, isPending: isUpdating} = useUpdateActiveAddress();

  return (
    <div className=" max-w-6xl mx-auto">
      <TopBar title="Preferred Location" />
      <div className="pt-14 px-4 py-6 space-y-6">
        {/* Current location */}
        {current ? (
          <div className="rounded-2xl border border-stitch-primary/20 bg-stitch-primary/5 p-4">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-stitch-primary" />
              <div>
                <p className="text-label-sm font-medium text-stitch-primary">
                  Current Location
                </p>
                <p className="text-body-sm text-on-surface">
                  {current.address ?? `${current.display_name}`}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-outline-variant bg-surface-container-low p-4">
            <p className="text-body-sm text-on-surface-variant text-center">
              No preferred location set yet.
            </p>
          </div>
        )}

        {isSuccess && (
          <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 text-center">
            Location updated successfully!
          </p>
        )}

        {geoError && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {geoError}
          </p>
        )}

        <Button
          onClick={detectLocation}
          disabled={detecting || isPending}
          className="w-full bg-stitch-primary hover:bg-stitch-secondary text-white"
        >
          {detecting || isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <MapPin className="mr-2 h-4 w-4" />
              Use My Current Location
            </>
          )}
        </Button>

        <p className="text-center text-label-sm text-on-surface-variant">
          Your location helps us show deals nearest to you.
        </p>
      </div>
      <div className="space-y-3 px-4">
        <h2 className="text-title-md font-semibold">Saved Addresses</h2>

        <div className="grid grid-cols-3 gap-4">
          <Link
            className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 p-6 transition hover:border-stitch-primary hover:bg-stitch-primary/5"
            href={`/profile/location/new`}
          >
            <Plus className="mb-3 h-10 w-10 text-gray-400" />
            <p className="font-semibold">Add Address</p>
          </Link>
          {addresses?.map((address) => {
            const Icon = getIcon(address.label);
            return (
              <div
                key={address.id}
                className="rounded-2xl border border-outline-variant bg-white p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-3">
                    <Icon className="h-5 w-5 text-stitch-primary" />

                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{address.label}</p>

                        {address.is_active && (
                          <span className="rounded-full bg-stitch-primary/10 px-2 py-0.5 text-xs font-medium text-stitch-primary">
                            Current
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-sm text-on-surface">
                        {address.street}
                      </p>

                      <p className="text-xs text-on-surface-variant">
                        {address.city}, {address.state} {address.postal_code}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => updateActive(address.id)} disabled={isUpdating}>
                    Use
                  </Button>

                  <Link href={`/profile/location/${address.id}/edit`}>
                    <Button variant="outline" size="sm">Edit</Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
