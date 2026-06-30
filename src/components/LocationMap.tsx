"use client";

import { useMemo, useState } from "react";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import { MapPin, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LocationPin {
  lat: number;
  lng: number;
  label?: string;
  isPrimary?: boolean;
}

interface LocationMapProps {
  locations: LocationPin[];
  height?: number;
  heightClass?: string;
  className?: string;
}

export function LocationMap({ locations, height = 200, heightClass, className }: LocationMapProps) {
  const [mapError, setMapError] = useState(false);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const keyMissing = !apiKey || apiKey === "YOUR_GOOGLE_MAPS_API_KEY_HERE";

  const validLocations = locations.filter((l) => l.lat != null && l.lng != null);

  const center = useMemo(() => {
    if (validLocations.length === 0) return { lat: 20.5937, lng: 78.9629 };
    const lat = validLocations.reduce((s, l) => s + l.lat, 0) / validLocations.length;
    const lng = validLocations.reduce((s, l) => s + l.lng, 0) / validLocations.length;
    return { lat, lng };
  }, [validLocations]);

  const primary = validLocations.find((l) => l.isPrimary) ?? validLocations[0];
  const directionsUrl = primary
    ? `https://www.google.com/maps/dir/?api=1&destination=${primary.lat},${primary.lng}`
    : null;

  if (keyMissing || mapError || validLocations.length === 0) return null;

  return (
    <div className={cn("overflow-hidden rounded-xl border border-outline-variant", heightClass, className)}>
      <APIProvider apiKey={apiKey} onError={() => setMapError(true)}>
        <Map
          defaultCenter={center}
          defaultZoom={validLocations.length === 1 ? 15 : 13}
          gestureHandling="cooperative"
          disableDefaultUI
          style={{ height: heightClass ? "100%" : height }}
          className={cn("w-full", heightClass && "h-full")}
        >
          {validLocations.map((loc, i) => (
            <AdvancedMarker key={i} position={{ lat: loc.lat, lng: loc.lng }}>
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full shadow-md ring-2",
                  loc.isPrimary || i === 0
                    ? "bg-stitch-primary ring-white text-white"
                    : "bg-white ring-stitch-primary text-stitch-primary"
                )}
              >
                <MapPin className="h-4 w-4" />
              </div>
            </AdvancedMarker>
          ))}
        </Map>
      </APIProvider>

      {directionsUrl && (
        <div className="flex items-center justify-between px-3 py-2 bg-surface-container-lowest">
          <p className="flex items-center gap-1.5 text-[12px] text-on-surface-variant truncate min-w-0">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-stitch-primary" />
            <span className="truncate">{primary?.label ?? "Store location"}</span>
          </p>
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 shrink-0 inline-flex items-center gap-1 rounded-full bg-stitch-primary/10 px-2.5 py-1 text-[11px] font-semibold text-stitch-primary hover:bg-stitch-primary/20 transition-colors"
          >
            <Navigation className="h-3 w-3" />
            Directions
          </a>
        </div>
      )}
    </div>
  );
}
