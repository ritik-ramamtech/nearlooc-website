"use client";

import { use, useState } from "react";
import { BadgeCheck, Star, MapPin, Globe, Phone, Images, X, ChevronLeft, ChevronRight } from "lucide-react";
import { VendorProductList } from "@/features/vendors/components/VendorProductList";
import { useVendorProducts, useVendorById } from "@/features/vendors/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { LocationMap, type LocationPin } from "@/components/LocationMap";

interface Props {
  params: Promise<{ id: string }>;
}

function StoreGallery({ images, businessName }: { images: string[]; businessName: string }) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  if (images.length === 0) return null;

  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  return (
    <>
      <button
        onClick={() => { setIdx(0); setOpen(true); }}
        className="inline-flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-[13px] font-medium text-on-surface hover:bg-surface-container transition-colors"
      >
        <Images className="h-4 w-4 text-stitch-primary" />
        Store Photos
        <span className="rounded-full bg-stitch-primary/10 px-1.5 py-0.5 text-[11px] font-semibold text-stitch-primary">
          {images.length}
        </span>
      </button>

      {/* Lightbox */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black"
          onClick={() => setOpen(false)}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-[13px] font-medium text-white/80">
              {businessName} &nbsp;·&nbsp; {idx + 1} / {images.length}
            </span>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full p-1.5 text-white hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Image */}
          <div
            className="relative flex flex-1 items-center justify-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[idx]}
              alt={`${businessName} store ${idx + 1}`}
              className="max-h-full max-w-full object-contain"
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-3 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-3 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div
              className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide"
              onClick={(e) => e.stopPropagation()}
            >
              {images.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={src}
                  alt=""
                  onClick={() => setIdx(i)}
                  className={`h-14 w-14 shrink-0 cursor-pointer rounded-lg object-cover transition-all ${i === idx ? "ring-2 ring-white opacity-100" : "opacity-50 hover:opacity-80"
                    }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default function VendorProductsPage({ params }: Props) {
  const { id } = use(params);
  const { data, isPending } = useVendorProducts(id);
  const { data: fullVendor } = useVendorById(id);

  const summary = data?.vendor;
  const storeImages = summary?.stores_imgs_url ?? [];
  const primaryLocation =
    fullVendor?.locations?.find((l) => l.is_primary) ?? fullVendor?.locations?.[0];

  const locationPins: LocationPin[] = (fullVendor?.locations ?? [])
    .filter((l) => l.latitude != null && l.longitude != null)
    .map((l) => ({
      lat: l.latitude as number,
      lng: l.longitude as number,
      label: l.label ?? l.city ?? l.street ?? "Store",
      isPrimary: l.is_primary,
    }));

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-surface">

      {/* Skeleton */}
      {isPending && (
        <div>
          <div className="h-44 w-full bg-gradient-to-br from-stitch-primary/20 to-stitch-secondary/10" />
          <div className="px-4 py-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-14 w-14 shrink-0 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="mt-3 space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        </div>
      )}

      {/* Vendor hero */}
      {summary && (
        <div>
          {/* Cover — gradient only, no image */}
          <div className="h-44 w-full bg-gradient-to-br from-stitch-primary/20 to-stitch-secondary/10" />

          <div className="px-4 pt-4 pb-4">
            {/* Logo + name row */}
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low shadow-sm">
                {summary.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={summary.logo_url}
                    alt={summary.business_name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-stitch-primary/10 text-lg font-bold text-stitch-primary">
                    {summary.business_name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <h2 className="text-[15px] font-bold text-on-surface truncate">{summary.business_name}</h2>
                  {summary.is_verified && (
                    <BadgeCheck className="h-4 w-4 shrink-0 text-stitch-primary" />
                  )}
                </div>
                <div className="flex items-center gap-1 text-[12px] text-on-surface-variant">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-on-surface">{summary.rating.toFixed(1)}</span>
                  <span>· {summary.review_count} reviews</span>
                </div>
              </div>
            </div>

            {/* Bio */}
            {fullVendor?.bio && (
              <p className="mt-3 text-[13px] text-on-surface-variant leading-relaxed">
                {fullVendor.bio}
              </p>
            )}

            {/* Contact info */}
            {(primaryLocation || fullVendor?.website || fullVendor?.phone) && (
              <div className="mt-3 flex flex-col gap-2">
                {primaryLocation && (
                  <div className="flex items-start gap-2 text-[13px] text-on-surface-variant">
                    <MapPin className="h-4 w-4 shrink-0 text-stitch-primary mt-0.5" />
                    <span>
                      {[
                        primaryLocation.street,
                        primaryLocation.city,
                        primaryLocation.state,
                        primaryLocation.postal_code,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </div>
                )}

                {fullVendor?.website && (
                  <div className="flex items-center gap-2 text-[13px]">
                    <Globe className="h-4 w-4 shrink-0 text-stitch-primary" />
                    <a
                      href={fullVendor.website.startsWith("http") ? fullVendor.website : `https://${fullVendor.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-stitch-primary hover:underline truncate"
                    >
                      {fullVendor.website.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                )}

                {fullVendor?.phone && (
                  <div className="flex items-center gap-2 text-[13px] text-on-surface-variant">
                    <Phone className="h-4 w-4 shrink-0 text-stitch-primary" />
                    <a href={`tel:${fullVendor.phone}`} className="hover:text-stitch-primary">
                      {fullVendor.phone}
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Additional locations */}
            {fullVendor?.locations && fullVendor.locations.length > 1 && (
              <div className="mt-3">
                <p className="text-[12px] font-medium text-on-surface-variant mb-1.5">
                  {fullVendor.locations.length} locations
                </p>
                <div className="flex flex-wrap gap-2">
                  {fullVendor.locations.map((loc) => (
                    <span
                      key={loc.id}
                      className="inline-flex items-center gap-1 rounded-full bg-surface-container-low px-2.5 py-1 text-[11px] text-on-surface-variant"
                    >
                      <MapPin className="h-3 w-3" />
                      {loc.label ?? loc.city ?? loc.street ?? "Location"}
                      {loc.is_primary && (
                        <span className="ml-0.5 text-stitch-primary">· Primary</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Embedded location map */}
            {locationPins.length > 0 && (
              <div className="mt-3">
                <LocationMap locations={locationPins} height={200} />
              </div>
            )}

            {/* Store Photos button — after location info */}
            {storeImages.length > 0 && (
              <div className="mt-3">
                <StoreGallery images={storeImages} businessName={summary.business_name} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Products */}
      <div className="border-t border-outline-variant px-4 py-4">
        <h3 className="mb-4 text-[15px] font-semibold text-on-surface">All Products</h3>
        <VendorProductList vendorId={id} />
      </div>
    </div>
  );
}
