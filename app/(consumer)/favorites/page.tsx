"use client";

import { TopBar } from "@/components/layout/TopBar";
import { OfferCard } from "@/features/home/components/OfferCard";
import { useFavorites } from "@/features/favorites/hooks";

export default function FavoritesPage() {
  const { data, isPending, isError } = useFavorites();

  return (
    <>
      <TopBar title="My Favorites" showBack={false} />
      <div className="pt-14 px-4 py-4">
        {isPending && (
          <div className="grid grid-cols-2 gap-3 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[4/3] rounded-2xl bg-surface-container" />
            ))}
          </div>
        )}

        {isError && (
          <p className="py-10 text-center text-body-sm text-on-surface-variant">
            Failed to load favorites.
          </p>
        )}

        {data && !data.items?.length && (
          <div className="py-16 text-center">
            <p className="text-headline-sm font-semibold text-on-surface">No favorites yet</p>
            <p className="mt-1 text-body-sm text-on-surface-variant">
              Tap the heart on any offer to save it here.
            </p>
          </div>
        )}

        {data && data.items?.length > 0 && (
          <>
            <p className="mb-3 text-label-sm text-on-surface-variant">{data.meta?.total} saved</p>
            <div className="grid grid-cols-2 gap-3">
              {data.items.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
