import { Offer } from "@/types";
import { OfferCard } from "./OfferCard";
import { OffersListResponse } from "@/features/offers";
import { Skeleton } from "@/components/ui/skeleton";
import { OfferCardSkeleton } from "./OfferCardSkeleton";
import { Sort } from "./FiltersSidebar";
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2, SlidersHorizontal } from "lucide-react";
import { OffersMapView } from "./OffersMapView";
import { Dispatch, SetStateAction, useState } from "react";
import { cn } from "@/lib/utils";

const SORT_DROPDOWN_OPTIONS: { label: string; value: Sort | "" }[] = [
  { label: "Recommended", value: Sort.recommended },
  { label: "Rating", value: Sort.rating },
  { label: "Price: Low to High", value: Sort.priceLowToHigh },
  { label: "Price: High To Low", value: Sort.priceHighToLow },
  { label: "Discount", value: Sort.discount },
];

interface CategoryOffersResultsProps {
  title: string;
  offers: Offer[];
  meta?: OffersListResponse["meta"];
  isFirstLoad: boolean;
  isError: boolean;
  sort: Sort | null;
  onSortChange: (sort: Sort | null) => void;
  onOpenMobileFilters?: () => void;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  isFetching: boolean;
  showSkeleton: boolean;
  showSpinner: boolean;
}

export function CategoryOffersResults({
  title,
  offers,
  meta,
  isFirstLoad,
  isError,
  sort,
  onSortChange,
  onOpenMobileFilters,
  page,
  setPage,
  isFetching,
  showSkeleton,
  showSpinner,
}: CategoryOffersResultsProps) {
  const [showMap, setShowMap] = useState(false);

  const totalPages = Math.ceil((meta?.total ?? 0) / (meta?.limit ?? 20));

  if (isFirstLoad || showSkeleton) return <CategoryOffersResultsSkeleton />;
  if (isError && offers.length === 0)
    return (
      <div className="p-4 text-center text-body-md text-on-surface-variant">
        Failed to load offers.
      </div>
    );

  return (
    <section>
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold">{title}</h1>
          {meta && (
            <p className="text-body-sm text-on-surface-variant">
              {meta.total} offers
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onOpenMobileFilters && (
            <button
              onClick={onOpenMobileFilters}
              className="flex md:hidden items-center gap-1.5 h-9 rounded-lg border border-outline-variant bg-surface-container-low px-3 text-[12px] text-on-surface font-medium hover:bg-surface-variant"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-on-surface-variant" />
              Filters
            </button>
          )}

          {/* Hidden for now until maps sdk is enabled */}
          {/* <button
            onClick={() => setShowMap((prev) => !prev)}
            className="cursor-pointer"
          >
            Show Map
          </button> */}

          {/* hidden on extra small screens for now */}
          <select
            className="pl-4 pr-1 py-1 hidden sm:block border border-gray-400 rounded-md text-sm outline-none bg-white h-9"
            value={sort ?? ""}
            onChange={(e) =>
              onSortChange(e.target.value ? (e.target.value as Sort) : null)
            }
          >
            {SORT_DROPDOWN_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="text-sm">
                Sort by {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!isFetching && offers.length === 0 ? (
        <p className="py-12 text-center text-body-md text-on-surface-variant">
          No offers found.
        </p>
      ) : showMap ? (
        <div className="sticky top-20 h-[calc(100vh-6rem)]">
          <OffersMapView offers={offers} />
        </div>
      ) : (
        <>
          <div className="relative">
            {isFetching && page > 1 && (
              <div className="flex items-center justify-center gap-2 py-4">
                <Loader2 className="h-5 w-5 animate-spin text-stitch-primary" />
                <span className="text-sm text-gray-500">
                  Loading page {page}...
                </span>
              </div>
            )}
            <div
              className={cn(
                "grid grid-cols-2 sm:gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:px-2",
              )}
            >
              {offers.map((offer) => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  fluid
                  isFetching={isFetching}
                />
              ))}
            </div>
          </div>
          {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onChange={setPage} />}
        </>
      )}
    </section>
  );
}

export function CategoryOffersResultsSkeleton() {
  return (
    <section>
      <div className="flex items-center justify-between px-4 py-4">
        <div>
          <Skeleton className="h-7 w-40" />
          <Skeleton className="mt-2 h-3.5 w-56" />
        </div>
        <Skeleton className="h-4 w-20" />
      </div>

      <div className="grid grid-cols-2 sm:gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:px-2">
        {Array.from({ length: 10 }).map((_, index) => (
          <OfferCardSkeleton key={index} fluid />
        ))}
      </div>
    </section>
  );
}

export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  return (
    <div className="flex justify-center py-8">
      <span className="border px-2 rounded-lg flex gap-4 text-sm shadow">
        <button disabled={page === 1} onClick={() => onChange(page - 1)} className={`flex items-center gap-2 ${page === 1 ? "text-gray-500": ""}`}>
          <ChevronLeft/>
          Previous
        </button>

        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => onChange(i + 1)}
            className={page === i + 1 ? "border border-black px-5 py-2.5" : ""}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={page === totalPages}
          onClick={() => onChange(page + 1)}
          className={`flex items-center gap-2 ${ page === totalPages ? "text-gray-500" : ""}`}
        >
          Next
          <ChevronRight/>
        </button>
      </span>
    </div>
  );
}
