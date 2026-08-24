"use client";

import { useVendorProducts } from "@/features/vendors";
import { use } from "react";

interface Props {
  params: Promise<{ id: string }>;
}

export default function StorePhotos({ params }: Props) {
  const { id } = use(params);
  const { data } = useVendorProducts(id);

  const storeImages = data?.vendor.stores_imgs_url ?? [];
  return (
    <div className="mx-auto max-w-container-max px-4 py-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <button className="mb-3 text-sm text-stitch-primary hover:underline">
            ← Back
          </button>

          <h1 className="text-3xl font-bold">Store Photos</h1>

          <p className="mt-1 text-sm text-on-surface-variant">
            {storeImages.length} customer photos
          </p>
        </div>

        <button>Upload Photo</button>
      </div>

      {/* Upload button */}

      {/* Gallery */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {storeImages.map((img) => (
          <div className="group relative aspect-square overflow-hidden rounded-xl"  key={img}>
            <img
              src={img}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
