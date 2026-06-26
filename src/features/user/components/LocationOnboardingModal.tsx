"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MapPin, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUpdateLocation } from "@/features/user/hooks";
import { useAuthStore } from "@/store/auth.store";

const AUTH_ROUTES = ["/login", "/register"];

const STORAGE_KEY = "nearlooc_location_set";

export function LocationOnboardingModal() {
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { mutate: updateLocation, isPending } = useUpdateLocation();

  const [visible, setVisible] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    const timer = setTimeout(() => setVisible(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible || AUTH_ROUTES.includes(pathname)) return null;

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, "dismissed");
  };

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
        localStorage.setItem(STORAGE_KEY, "set");
        if (isAuthenticated) {
          updateLocation(
            { latitude: pos.coords.latitude, longitude: pos.coords.longitude },
            { onSuccess: () => setVisible(false) }
          );
        } else {
          localStorage.setItem(
            "nearlooc_guest_location",
            JSON.stringify({ lat: pos.coords.latitude, lng: pos.coords.longitude })
          );
          setVisible(false);
        }
      },
      () => {
        setDetecting(false);
        setGeoError("Could not detect location. Please allow location access and try again.");
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={dismiss}
      />

      {/* Sheet */}
      <div className="relative z-10 w-full sm:max-w-sm mx-auto bg-white rounded-t-3xl sm:rounded-2xl shadow-xl p-6 space-y-5">
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Skip"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center gap-3 pt-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-stitch-primary/10">
            <MapPin className="h-7 w-7 text-stitch-primary" />
          </div>
          <div>
            <h2 className="text-title-md font-semibold text-on-surface">
              Set your location
            </h2>
            <p className="mt-1 text-body-sm text-on-surface-variant">
              Allow location access so we can show deals nearest to you.
            </p>
          </div>
        </div>

        {geoError && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 text-center">
            {geoError}
          </p>
        )}

        <div className="space-y-2">
          <Button
            onClick={detectLocation}
            disabled={detecting || isPending}
            className="w-full bg-stitch-primary hover:bg-stitch-secondary text-white rounded-xl h-12"
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

          <button
            onClick={dismiss}
            className="w-full py-3 text-sm text-on-surface-variant hover:text-on-surface transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
