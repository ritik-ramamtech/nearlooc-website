"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MapPin, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSavedAddresses, useUpdateLocation } from "@/features/user/hooks";
import { useAuthStore } from "@/store/auth.store";
import { useLocationStore } from "@/store/location.store";
import {reverseGeocode} from "@/lib/location";

const AUTH_ROUTES = ["/login", "/register", "/forgot-password", "/verify-otp", "/reset-password", "/verify-email"];

const STORAGE_KEY = "nearlooc_location_set";

export function LocationOnboardingModal() {
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { mutate: updateLocation, isPending } = useUpdateLocation();
  const { data: addresses = []} = useSavedAddresses(isAuthenticated);
  const { location, setLocation } = useLocationStore();

  const [visible, setVisible] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const activeAddress = addresses.find((a) => a.is_active);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) || location) return;
    const timer = setTimeout(() => setVisible(true), 5000);
    return () => clearTimeout(timer);
  }, [location]);

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
      async (pos) => {
        try {
          const location = await reverseGeocode(
            pos.coords.latitude,
            pos.coords.longitude,
          );
          setLocation({
            latitude: location.latitude,
            longitude: location.longitude,
            display_name: location.displayName,
            address: [location.street, location.city, location.state, location.postalCode].join(", "),
            source: "gps"
          });
          localStorage.setItem(STORAGE_KEY, "set");
          if (isAuthenticated) {
            updateLocation(
              {
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
                display_name: location.displayName,

              },
              { onSuccess: () => setVisible(false) },
            );
          } else {
            setVisible(false);
          }
        } catch {
          setGeoError("Couldn't detect your location. Please try again.");
        } finally {
          setDetecting(false);
        }
      },
      async () => {
        setDetecting(false);
        if(activeAddress) {
          setLocation({
            latitude: activeAddress.latitude,
            longitude: activeAddress.longitude,
            display_name: activeAddress.label,
            address: [activeAddress.street, activeAddress.city, activeAddress.state].join(", "),
            source: "saved",
            address_id: activeAddress.id
          })

          localStorage.setItem(STORAGE_KEY, "address");
          setVisible(false);
          return;
        }

        localStorage.setItem(STORAGE_KEY, "dismissed");
        setVisible(false);
        // setGeoError(
        //   "Could not detect location. Please allow location access and try again.",
        // );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5 * 60 * 1000, // reuse GPS for 5 mins if available
      },
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
