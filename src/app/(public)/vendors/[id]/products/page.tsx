"use client";

import { use, useState } from "react";
import {
  BadgeCheck,
  Star,
  MapPin,
  Globe,
  Phone,
  Images,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { VendorProductList } from "@/features/vendors/components/VendorProductList";
import {
  useVendorProducts,
  useVendorById,
  useVendorReviews,
} from "@/features/vendors/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { LocationMap, type LocationPin } from "@/components/LocationMap";
import { ReviewSummary } from "@/features/reviews/components/ReviewSummary";
import { ReviewItem } from "@/features/reviews/components/ReviewItem";
import { useRouter } from "next/navigation";
import ReviewSummarySkeleton from "@/features/reviews/components/ReviewSummarySkeleton";
import ReviewItemSkeleton from "@/features/reviews/components/ReviewItemSkeleton";

interface Props {
  params: Promise<{ id: string }>;
}

const EMPTY_DISTRIBUTION = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 } as const;

function StoreGallery({
  images,
  businessName,
}: {
  images: string[];
  businessName: string;
}) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  if (images.length === 0) return null;

  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  return (
    <>
      <button
        onClick={() => {
          setIdx(0);
          setOpen(true);
        }}
        className="inline-flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2 text-[13px] font-medium text-on-surface hover:bg-surface-container transition-colors"
      >
        <Images className="h-4 w-4 text-stitch-primary" />
        Store Photos
        <span className="rounded-full bg-stitch-primary/10 px-1.5 py-0.5 text-[11px] font-semibold text-stitch-primary">
          {images.length}
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black"
          onClick={() => setOpen(false)}
        >
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
                  className={`h-14 w-14 shrink-0 cursor-pointer rounded-lg object-cover transition-all ${
                    i === idx
                      ? "ring-2 ring-white opacity-100"
                      : "opacity-50 hover:opacity-80"
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
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"products" | "reviews" | "photos">(
    "products",
  );

  const { data, isPending } = useVendorProducts(id);
  const { data: fullVendor } = useVendorById(id);
  console.log("vendor->",fullVendor)
  const {
    data: reviewdata,
    isPending: isReviewPending,
    isFetching,
  } = useVendorReviews(id);

  const summary = data?.vendor;
  const storeImages = summary?.stores_imgs_url ?? [];
  const primaryLocation = fullVendor?.primaryLocation[0];
  const reviewSummary = reviewdata?.summary;
  const reviews = reviewdata?.data;
  const previewReviews = reviews?.slice(0, 3);

  // const locationPins: LocationPin[] = (fullVendor?.locations ?? [])
  //   .filter((l) => l.latitude != null && l.longitude != null)
  //   .map((l) => ({
  //     lat: l.latitude as number,
  //     lng: l.longitude as number,
  //     label: l.label ?? l.city ?? l.street ?? "Store",
  //     isPrimary: l.is_primary,
  //   }));

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-surface">
      {/* Cover — always full width */}
      <div className="h-36 w-full bg-gradient-to-br from-stitch-primary/20 to-stitch-secondary/10 sm:h-44 md:h-52" />

      <div className="mx-auto md:-mt-16 mb-4 max-w-container-max px-2">
        <div className="rounded-2xl bg-white md:shadow-sm md:border md:border-gray-200 px-2 md:px-6 py-4">
          <div className="flex flex-col lg:flex-row gap-6 lg:justify-between items-start">
            <div className="flex  flex-col items-start text-center md:flex-row lg:text-left lg:items-start gap-5">
              <div className="h-24 w-24 md:h-28 md:w-28 overflow-hidden rounded-full border bg-white">
                {summary?.logo_url ? (
                  <img
                    src={summary.logo_url}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-stitch-primary/10 text-4xl font-bold">
                    {summary?.business_name.charAt(0)}
                  </div>
                )}
              </div>

              <div className="">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">
                    {summary?.business_name}
                  </h1>

                  {summary?.is_verified && (
                    <BadgeCheck className="h-6 w-6 text-stitch-primary fill-stitch-primary/20" />
                  )}
                </div>

                <div className="mt-2.5 flex items-center gap-2 text-sm">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />

                  <span className="font-semibold">
                    {summary?.rating.toFixed(1)}
                  </span>

                  <span className="text-gray-500">
                    ({summary?.review_count} Reviews)
                  </span>
                </div>

                <div className="mt-2.5 flex gap-4 text-gray-500">
                  <span>{fullVendor?.category_name}</span>

                  <span>•</span>

                  <span>{fullVendor?.subcategory_name}</span>
                </div>

                {primaryLocation && (
                  <div className="mt-2 flex items-center gap-2 text-gray-500 text-sm">
                    <MapPin className="h-4 w-4" />

                    {[primaryLocation.city, primaryLocation.state]
                      .filter(Boolean)
                      .join(", ")}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 lg:flex lg:gap-14">
              <div className="text-center">
                <p className="text-3xl font-bold">
                  {fullVendor?.active_offer_count ?? 0}
                </p>
                <p className="text-sm text-gray-500">Active Deals</p>
              </div>

              <div className="text-center">
                <p className="text-3xl font-bold">{summary?.review_count}</p>
                <p className="text-sm text-gray-500">Reviews</p>
              </div>

              <div className="text-center">
                <p className="text-3xl font-bold">{storeImages.length}</p>
                <p className="text-sm text-gray-500">Photos</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-16 z-20 mt-6 flex lg:hidden border-b bg-white">
        {[
          { key: "products", label: "Products" },
          { key: "reviews", label: "Reviews" },
          { key: "photos", label: "Photos" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`flex-1 border-b-2 py-3 text-sm font-medium transition ${
              activeTab === tab.key
                ? "border-stitch-primary text-stitch-primary"
                : "border-transparent text-gray-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Constrained content */}
      <div className="mx-auto max-w-container-max px-4">
        <div className="lg:hidden mt-6">
          {activeTab === "products" && <VendorProductList vendorId={id} />}

          {activeTab === "reviews" && (
            <div className="sm:px-4">
              <ReviewSummary
                total_reviews={reviewSummary?.total_reviews ?? 0}
                avg_rating={reviewSummary?.avg_rating ?? 0}
                distribution={reviewSummary?.rating_distribution ?? EMPTY_DISTRIBUTION}
              />

              <div className="sm:pl-36 pt-4">
                {reviews?.map((review) => (
                  <ReviewItem key={review.id} review={review} />
                ))}
              </div>
            </div>
          )}

          {activeTab === "photos" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {storeImages.map((img) => (
                <img
                  key={img}
                  src={img}
                  className="aspect-square rounded-xl object-cover"
                />
              ))}
            </div>
          )}
        </div>
        <div className="hidden lg:flex md:gap-8 md:items-start">
          {/* ── Left: vendor info ── */}
          {/* <div className="py-4 md:w-72 md:shrink-0 md:py-6 md:sticky md:top-20">

            {isPending && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-14 w-14 shrink-0 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            )}

            {summary && (
              <div className="space-y-3">
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
                      <h2 className="truncate text-[15px] font-bold text-on-surface sm:text-[17px]">
                        {summary.business_name}
                      </h2>
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

                {fullVendor?.bio && (
                  <p className="text-[13px] leading-relaxed text-on-surface-variant">
                    {fullVendor.bio}
                  </p>
                )}

                {(primaryLocation || fullVendor?.website || fullVendor?.phone) && (
                  <div className="flex flex-col gap-2">
                    {primaryLocation && (
                      <div className="flex items-start gap-2 text-[13px] text-on-surface-variant">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-stitch-primary" />
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
                          className="truncate text-stitch-primary hover:underline"
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

                {fullVendor?.locations && fullVendor.locations.length > 1 && (
                  <div>
                    <p className="mb-1.5 text-[12px] font-medium text-on-surface-variant">
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

                {locationPins.length > 0 && (
                  <LocationMap locations={locationPins} heightClass="h-[160px] sm:h-[180px]" />
                )}

                {storeImages.length > 0 && (
                  <StoreGallery images={storeImages} businessName={summary.business_name} />
                )}
              </div>
            )}
          </div> */}

          {/* ── Right: products ── */}
          <div className="flex-1 border-outline-variant">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-2xl font-bold">Active Deals</h2>

                <p className="text-sm text-gray-500">
                  {data?.products.length ?? 0} products available
                </p>
              </div>
            </div>
            <VendorProductList vendorId={id} />
          </div>

          <div className="md:w-[30%] flex gap-6 flex-col">
            <div className=" rounded-2xl shadow py-4 px-4">
              {isReviewPending ? (
                <ReviewSummarySkeleton />
              ) : (
                <ReviewSummary
                  total_reviews={reviewSummary?.total_reviews ?? 0}
                  avg_rating={reviewSummary?.avg_rating ?? 0}
                  distribution={reviewSummary?.rating_distribution ?? EMPTY_DISTRIBUTION}
                />
              )}

              <div className="mt-8">
                <div className="flex justify-between font-medium">
                  <p>Recent reviews</p>
                  <button
                    onClick={() => router.push(`/vendors/${id}/reviews`)}
                    className="text-sm text-blue-500 hover:underline hover:font-semibold"
                  >
                    View All
                  </button>
                </div>
                {isReviewPending ? (
                  <>
                    <ReviewItemSkeleton />
                    <ReviewItemSkeleton />
                    <ReviewItemSkeleton />
                  </>
                ) : (
                  previewReviews?.map((review) => (
                    <ReviewItem review={review} key={review.id} />
                  ))
                )}
              </div>
            </div>

            <div className="w-full flex flex-col border-gray-600 shadow px-4 py-4 rounded-xl gap-4">
              <h3 className="font-medium">Store Photos</h3>
              <div className="grid grid-cols-2 gap-3">
                {storeImages.slice(0, 4).map((img, index) => {
                  const isLast = index === 3 && storeImages.length > 4;

                  return (
                    <div
                      key={index}
                      onClick={() => {
                        if (isLast) {
                          router.push(`/vendors/${id}/photos`);
                        }
                      }}
                      className={`relative aspect-square overflow-hidden rounded-xl ${
                        isLast ? "cursor-pointer" : ""
                      }`}
                    >
                      <img
                        src={img}
                        className="h-full w-full object-cover"
                        alt=""
                      />

                      {isLast && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                          <div className="text-center text-white">
                            <p className="text-3xl font-bold">
                              +{storeImages.length - 4}
                            </p>
                            <p className="text-sm">View all</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
