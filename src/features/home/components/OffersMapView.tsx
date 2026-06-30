"use client";

import { useMemo, useState, useCallback } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
} from "@vis.gl/react-google-maps";
import { MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Offer } from "@/types";
import { formatPrice, cn } from "@/lib/utils";

type GeoOffer = Offer & { latitude: number; longitude: number };

function PricePin({
  offer,
  active,
  onClick,
}: {
  offer: GeoOffer;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <AdvancedMarker
      position={{ lat: offer.latitude, lng: offer.longitude }}
      onClick={onClick}
    >
      <div
        className={cn(
          "cursor-pointer rounded-full px-2.5 py-1 text-[11px] font-bold shadow-md ring-1 transition-all",
          active
            ? "scale-110 bg-stitch-primary text-white ring-stitch-primary"
            : "bg-white text-gray-900 ring-black/10 hover:scale-105 hover:bg-stitch-primary hover:text-white hover:ring-stitch-primary"
        )}
      >
        {formatPrice(offer.discounted_price)}
      </div>
    </AdvancedMarker>
  );
}

function OfferInfoWindow({
  offer,
  onClose,
}: {
  offer: GeoOffer;
  onClose: () => void;
}) {
  return (
    <InfoWindow
      position={{ lat: offer.latitude, lng: offer.longitude }}
      onCloseClick={onClose}
      pixelOffset={[0, -36]}
    >
      <div className="w-52 overflow-hidden">
        {offer.image_url && (
          <div className="relative -mx-3 -mt-3 mb-2.5 h-28 w-[calc(100%+1.5rem)]">
            <Image
              src={offer.image_url}
              alt={offer.title}
              fill
              className="object-cover"
              sizes="208px"
            />
          </div>
        )}

        {offer.badge && (
          <span className="mb-1 inline-block rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-semibold text-orange-700">
            {offer.badge}
          </span>
        )}

        <p className="line-clamp-2 text-[13px] font-semibold leading-snug text-gray-900">
          {offer.title}
        </p>

        <div className="mt-1.5 flex items-baseline gap-1.5">
          <span className="text-[14px] font-bold text-stitch-secondary">
            {formatPrice(offer.discounted_price)}
          </span>
          {offer.original_price > offer.discounted_price && (
            <span className="text-[11px] text-gray-400 line-through">
              {formatPrice(offer.original_price)}
            </span>
          )}
          {offer.discount_percentage > 0 && (
            <span className="ml-auto text-[11px] font-semibold text-green-600">
              -{offer.discount_percentage}%
            </span>
          )}
        </div>

        <Link
          href={`/offers/${offer.id}`}
          className="mt-3 block rounded-md bg-stitch-primary px-3 py-1.5 text-center text-[12px] font-semibold text-white hover:opacity-90"
        >
          View offer
        </Link>
      </div>
    </InfoWindow>
  );
}

export function OffersMapView({ offers }: { offers: Offer[] }) {
  const [activeOffer, setActiveOffer] = useState<GeoOffer | null>(null);
  const [mapError, setMapError] = useState(false);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
  const keyMissing = !apiKey || apiKey === "YOUR_GOOGLE_MAPS_API_KEY_HERE";

  const geoOffers = useMemo(
    () =>
      offers.filter(
        (o): o is GeoOffer => o.latitude != null && o.longitude != null
      ),
    [offers]
  );

  const hiddenCount = offers.length - geoOffers.length;

  // Centre on the average of visible offer coordinates; India fallback if none.
  const defaultCenter = useMemo(() => {
    if (geoOffers.length === 0) return { lat: 20.5937, lng: 78.9629 };
    const lat = geoOffers.reduce((s, o) => s + o.latitude, 0) / geoOffers.length;
    const lng = geoOffers.reduce((s, o) => s + o.longitude, 0) / geoOffers.length;
    return { lat, lng };
  }, [geoOffers]);

  const handleMarkerClick = useCallback(
    (offer: GeoOffer) => {
      setActiveOffer((prev) => (prev?.id === offer.id ? null : offer));
    },
    []
  );

  if (keyMissing || mapError) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gray-200 bg-gray-50 text-center h-[60vh] sm:h-[calc(100svh-13rem)]"
      >
        <MapPin className="h-8 w-8 text-gray-300" />
        <p className="text-[14px] font-semibold text-gray-500">Map view unavailable</p>
        <p className="text-[12px] text-gray-400">
          Add a valid{" "}
          <code className="rounded bg-gray-100 px-1 py-0.5 font-mono">
            NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
          </code>{" "}
          to{" "}
          <code className="rounded bg-gray-100 px-1 py-0.5 font-mono">.env.local</code>
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-[60vh] sm:h-[calc(100svh-13rem)]">
      {hiddenCount > 0 && (
        <div className="absolute left-1/2 top-3 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/90 px-4 py-1.5 text-[12px] text-gray-600 shadow backdrop-blur-sm">
          {hiddenCount} offer{hiddenCount !== 1 ? "s" : ""} without a location are not shown
        </div>
      )}

      {geoOffers.length === 0 && (
        <div className="flex h-full items-center justify-center">
          <p className="text-[14px] text-gray-500">No offers with location data to display.</p>
        </div>
      )}

      <APIProvider apiKey={apiKey} onError={() => setMapError(true)}>
        <Map
          defaultCenter={defaultCenter}
          defaultZoom={12}
          gestureHandling="greedy"
          className="h-full w-full"
          disableDefaultUI={false}
        >
          {geoOffers.map((offer) => (
            <PricePin
              key={offer.id}
              offer={offer}
              active={activeOffer?.id === offer.id}
              onClick={() => handleMarkerClick(offer)}
            />
          ))}

          {activeOffer && (
            <OfferInfoWindow
              offer={activeOffer}
              onClose={() => setActiveOffer(null)}
            />
          )}
        </Map>
      </APIProvider>
    </div>
  );
}
