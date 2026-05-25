"use client";

import { useState } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/button";
import { useProfile, useUpdateLocation } from "@/features/user/hooks";

export default function LocationPage() {
  const { data: profile } = useProfile();
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
      }
    );
  };

  const current = profile?.preferred_location;

  return (
    <>
      <TopBar title="Preferred Location" />
      <div className="pt-14 px-4 py-6 space-y-6">
        {/* Current location */}
        {current ? (
          <div className="rounded-2xl border border-stitch-primary/20 bg-stitch-primary/5 p-4">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-stitch-primary" />
              <div>
                <p className="text-label-sm font-medium text-stitch-primary">Current Location</p>
                <p className="text-body-sm text-on-surface">
                  {current.address ?? `${current.latitude.toFixed(4)}, ${current.longitude.toFixed(4)}`}
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
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{geoError}</p>
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
    </>
  );
}
