"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMapsLibrary,
  useMap,
} from "@vis.gl/react-google-maps";
import { Search, MapPin } from "lucide-react";

type LatLng = { lat: number; lng: number };

export interface PickedLocation {
  lat: number;
  lng: number;
  street: string;
  city: string;
  state: string;
  postal_code: string;
}

interface Props {
  initialLat?: number;
  initialLng?: number;
  onLocationChange: (loc: PickedLocation) => void;
}

function parseAddressComponents(
  components: google.maps.GeocoderAddressComponent[]
): Omit<PickedLocation, "lat" | "lng"> {
  const get = (type: string) => components.find((c) => c.types.includes(type));
  const streetNumber = get("street_number")?.long_name ?? "";
  const route = get("route")?.long_name ?? "";
  return {
    street: [streetNumber, route].filter(Boolean).join(" "),
    city:
      get("locality")?.long_name ??
      get("administrative_area_level_2")?.long_name ??
      "",
    state: get("administrative_area_level_1")?.long_name ?? "",
    postal_code: get("postal_code")?.long_name ?? "",
  };
}

function PlacesInput({
  onPlacePicked,
}: {
  onPlacePicked: (loc: PickedLocation) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary("places");
  const callbackRef = useRef(onPlacePicked);
  callbackRef.current = onPlacePicked;

  useEffect(() => {
    if (!places || !inputRef.current) return;
    const autocomplete = new places.Autocomplete(inputRef.current, {
      fields: ["geometry", "address_components"],
    });
    const listener = autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.geometry?.location) return;
      callbackRef.current({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        ...parseAddressComponents(place.address_components ?? []),
      });
    });
    return () => google.maps.event.removeListener(listener);
  }, [places]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        placeholder="Search address or place…"
        className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10 transition"
      />
    </div>
  );
}

function MapClickHandler({
  onMapClick,
}: {
  onMapClick: (lat: number, lng: number) => void;
}) {
  const map = useMap();
  const callbackRef = useRef(onMapClick);
  callbackRef.current = onMapClick;

  useEffect(() => {
    if (!map) return;
    const listener = map.addListener(
      "click",
      (e: google.maps.MapMouseEvent) => {
        if (e.latLng) callbackRef.current(e.latLng.lat(), e.latLng.lng());
      }
    );
    return () => google.maps.event.removeListener(listener);
  }, [map]);

  return null;
}

function MapPanner({ pos }: { pos: LatLng | null }) {
  const map = useMap();
  const prevPos = useRef<LatLng | null>(null);

  useEffect(() => {
    if (!map || !pos) return;
    if (prevPos.current?.lat === pos.lat && prevPos.current?.lng === pos.lng)
      return;
    prevPos.current = pos;
    map.panTo(pos);
    map.setZoom(15);
  }, [map, pos]);

  return null;
}

function ReverseGeocoder({
  pos,
  onResult,
}: {
  pos: LatLng | null;
  onResult: (loc: PickedLocation) => void;
}) {
  const geocoding = useMapsLibrary("geocoding");
  const callbackRef = useRef(onResult);
  callbackRef.current = onResult;

  useEffect(() => {
    if (!geocoding || !pos) return;
    let cancelled = false;
    const geocoder = new geocoding.Geocoder();
    geocoder.geocode({ location: pos }, (results, status) => {
      if (cancelled) return;
      if (status === "OK" && results?.[0]) {
        callbackRef.current({
          lat: pos.lat,
          lng: pos.lng,
          ...parseAddressComponents(results[0].address_components ?? []),
        });
      } else {
        callbackRef.current({
          lat: pos.lat,
          lng: pos.lng,
          street: "",
          city: "",
          state: "",
          postal_code: "",
        });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [geocoding, pos]);

  return null;
}

export function LocationPicker({
  initialLat,
  initialLng,
  onLocationChange,
}: Props) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

  const hasInitial =
    typeof initialLat === "number" && typeof initialLng === "number";
  const defaultCenter: LatLng = hasInitial
    ? { lat: initialLat!, lng: initialLng! }
    : { lat: 20.5937, lng: 78.9629 };

  const [markerPos, setMarkerPos] = useState<LatLng | null>(
    hasInitial ? { lat: initialLat!, lng: initialLng! } : null
  );
  const [pendingGeoPos, setPendingGeoPos] = useState<LatLng | null>(null);

  const handlePlacePicked = useCallback(
    (loc: PickedLocation) => {
      setMarkerPos({ lat: loc.lat, lng: loc.lng });
      onLocationChange(loc);
    },
    [onLocationChange]
  );

  const handleMapClick = useCallback((lat: number, lng: number) => {
    const pos = { lat, lng };
    setMarkerPos(pos);
    setPendingGeoPos(pos);
  }, []);

  const handleGeoResult = useCallback(
    (loc: PickedLocation) => {
      onLocationChange(loc);
    },
    [onLocationChange]
  );

  if (!apiKey) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center">
        <MapPin className="h-6 w-6 text-gray-300 mx-auto mb-2" />
        <p className="text-xs text-gray-400">
          Set{" "}
          <code className="rounded bg-gray-100 px-1 font-mono">
            NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
          </code>{" "}
          to enable the map picker
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <APIProvider apiKey={apiKey}>
        <PlacesInput onPlacePicked={handlePlacePicked} />
        <ReverseGeocoder pos={pendingGeoPos} onResult={handleGeoResult} />
        <div
          className="relative overflow-hidden rounded-lg border border-gray-200"
          style={{ height: 280 }}
        >
          <Map
            defaultCenter={defaultCenter}
            defaultZoom={hasInitial ? 15 : 5}
            gestureHandling="greedy"
            disableDefaultUI
            className="h-full w-full"
          >
            <MapClickHandler onMapClick={handleMapClick} />
            <MapPanner pos={markerPos} />
            {markerPos && (
              <AdvancedMarker position={markerPos}>
                <div className="flex flex-col items-center drop-shadow-md">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500">
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  <div className="h-2 w-0.5 rounded-b bg-brand-500" />
                </div>
              </AdvancedMarker>
            )}
          </Map>
          {!markerPos && (
            <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-4">
              <div className="rounded-full bg-white/90 px-4 py-1.5 text-xs text-gray-600 shadow backdrop-blur-sm">
                Click anywhere on the map to pin your location
              </div>
            </div>
          )}
        </div>
        {markerPos && (
          <p className="text-center text-[11px] text-gray-400">
            {markerPos.lat.toFixed(5)}, {markerPos.lng.toFixed(5)}
          </p>
        )}
      </APIProvider>
    </div>
  );
}
