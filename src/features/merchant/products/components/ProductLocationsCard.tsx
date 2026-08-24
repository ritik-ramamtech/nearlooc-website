import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { Product } from "@/types";
import { MapPin, Pause, Play } from "lucide-react";
import { useDeactivateProductAtLocation } from "../hooks";
import ConfirmDialog from "./ConfirmDialog";
import { useState } from "react";
import { StatusPill } from "@/components/product/status-pill";

export default function ProductLocationsCard({
  product,
}: {
  product: Product;
}) {
  const { mutate, isPending } = useDeactivateProductAtLocation();

  const [pausingLocationId, setPausingLocationId] = useState<string | null>(
    null,
  );

  const pausingLocation = product?.locations?.find(
    (location) => location.id === pausingLocationId,
  );

  const locations = product.locations ?? [];

  return (
    // <div className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm">
    //   <div className="mb-5 flex items-center gap-2">
    //     <MapPin className="h-5 w-5 text-brand-500" />

    //     <h2 className="text-lg font-semibold">Available Locations</h2>
    //   </div>

    //   <div className="mt-5 space-y-3">
    //     {product?.locations?.map((location) => (
    //       <div
    //         key={location.id}
    //         className="flex items-center justify-between rounded-2xl border border-stone-200 bg-stone-50/60 p-4 transition hover:border-emerald-200 hover:bg-white"
    //       >
    //         <div className="flex items-start gap-3">
    //           <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
    //             <MapPin className="h-5 w-5 text-emerald-600" />
    //           </div>

    //           <div>
    //             <p className="font-semibold text-gray-900">{location.label}</p>

    //             <p className="text-sm text-gray-500">{location.city}</p>
    //           </div>
    //         </div>

    //         <div className="flex items-center gap-4">
    //           <span
    //             className={cn(
    //               "rounded-full px-3 py-1 text-xs font-semibold",
    //               location.is_active
    //                 ? "bg-green-50 text-green-700"
    //                 : "bg-orange-50 text-orange-700",
    //             )}
    //           >
    //             {location.is_active ? "Active" : "Paused"}
    //           </span>

    //           {!product.is_active ? (
    //             <span className="text-xs text-gray-400 italic">
    //               Product is deactivated
    //             </span>
    //           ) : location.is_active ? (
    //             <Button
    //               variant="outline"
    //               onClick={() => setPausingLocationId(location.id)}
    //               disabled={isPending}
    //             >
    //               Pause
    //             </Button>
    //           ) : (
    //             <Button
    //               onClick={() =>
    //                 mutate({
    //                   id: product.id,
    //                   locationId: location.id,
    //                   is_active: true,
    //                 })
    //               }
    //               disabled={isPending}
    //             >
    //               Resume
    //             </Button>
    //           )}
    //         </div>
    //       </div>
    //     ))}
    //   </div>

    //   <ConfirmDialog
    //     open={!!pausingLocationId}
    //     onOpenChange={(open) => !open && setPausingLocationId(null)}
    //     title={`Deactivate this product at ${pausingLocation?.label ?? ""}`}
    //     description={`${product.name} will no longer be available at this location.`}
    //     onConfirm={() => {
    //       if (!pausingLocationId) return;

    //       mutate({
    //         id: product.id,
    //         locationId: pausingLocationId,
    //         is_active: false,
    //       });
    //       setPausingLocationId(null);
    //     }}
    //   >
    //     <div className="rounded-2xl border border-amber-200 bg-white p-4">
    //       <p className="mb-3 font-semibold text-sm text-amber-900">
    //         What happens next?
    //       </p>

    //       <ul className="space-y-2 text-xs text-amber-800">
    //         <li>• Customers won't be able to view the product at this location</li>
    //         <li>• New offers for this product can't be created at this location</li>
    //         <li>• All Existing offers for this product in this location will be de-activated. You will have to create offers again for those locations</li>
    //         <li>• You can reactivate it anytime but de-activated offers won't be reactivated again.</li>
    //       </ul>
    //     </div>
    //   </ConfirmDialog>
    // </div>

    <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between px-6 pt-5 pb-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <MapPin className="size-4 text-primary" />
          Available at
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {locations.length}
          </span>
        </h2>
      </div>

      <ul className="divide-y divide-border border-t border-border">
        {locations.map((loc) => {
          const isActive = loc.is_active;
          return (
            <li
              key={loc.id}
              className="flex items-center gap-3 px-6 py-4 transition-colors hover:bg-muted/40"
            >
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-xl text-xs font-semibold",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground",
                )}
                aria-hidden="true"
              >
                {loc.city.slice(0, 2).toUpperCase()}
              </span>

              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-foreground">
                  {loc.label}
                </div>
                <div className="truncate text-xs text-muted-foreground">
                  {loc.street} · {loc.city}
                </div>
              </div>

              <StatusPill
                tone={isActive ? "active" : "paused"}
                label={isActive ? "Active" : "Paused"}
              />

              {product.is_active && (
                <Button
                  variant={isActive ? "ghost" : "secondary"}
                  size="sm"
                  disabled={isPending}
                  onClick={() => {
                    if(isActive) {
                      setPausingLocationId(loc.id);
                    }
                    else {
                      mutate({
                        id: product.id,
                        locationId: loc.id,
                        is_active: true
                      })
                    }
                  }
                  }
                  aria-label={
                    isActive ? `Pause ${loc.label}` : `Resume ${loc.label}`
                  }
                >
                  {isActive ? <Pause /> : <Play />}
                  {isActive ? "Pause" : "Resume"}
                </Button>
              )}
            </li>
          );
        })}
      </ul>

      {!product.is_active && (
        <p className="border-t border-border bg-muted/30 px-6 py-3 text-xs text-muted-foreground">
          This product is deactivated. Reactivate it to manage location
          availability.
        </p>
      )}

      <ConfirmDialog
        open={!!pausingLocationId}
        onOpenChange={(open) => !open && setPausingLocationId(null)}
        title={`Deactivate this product at ${pausingLocation?.label ?? ""}`}
        description={`${product.name} will no longer be available at this location.`}
        onConfirm={() => {
          if (!pausingLocationId) return;

          mutate({
            id: product.id,
            locationId: pausingLocationId,
            is_active: false,
          });
          setPausingLocationId(null);
        }}
      >
        <div className="rounded-2xl border border-amber-200 bg-white p-4">
          <p className="mb-3 font-semibold text-sm text-amber-900">
            What happens next?
          </p>

          <ul className="space-y-2 text-xs text-amber-800">
            <li>
              • Customers won't be able to view the product at this location
            </li>
            <li>
              • New offers for this product can't be created at this location
            </li>
            <li>
              • All Existing offers for this product in this location will be
              de-activated. You will have to create offers again for those
              locations
            </li>
            <li>
              • You can reactivate it anytime but de-activated offers won't be
              reactivated again.
            </li>
          </ul>
        </div>
      </ConfirmDialog>
    </section>
  );
}
