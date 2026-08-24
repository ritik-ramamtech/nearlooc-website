import { cn } from "@/lib/utils";
import { Product } from "@/types";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function ProductGallery({ product }: { product: Product }) {
  const images = product.images.length
    ? product.images
    : product.image_url
      ? [product.image_url]
      : [];

  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const current = images[active];

  const go = useCallback(
    (dir: number) => {
      setActive((prev) => (prev + dir + images.length) % images.length)
    },
    [images.length],
  )

  useEffect(() => {
    if (!lightboxOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxOpen(false)
      if (e.key === "ArrowRight") go(1)
      if (e.key === "ArrowLeft") go(-1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [lightboxOpen, go])

  return (
    // <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
    //   <img
    //     src={images[selectedImage]}
    //     onClick={() => setPreviewOpen(true)}
    //     className="aspect-square w-full rounded-2xl object-cover"
    //   />

    //   <div className="mt-4 grid grid-cols-4 gap-3">
    //     {images.map((image, index) => (
    //       <button
    //         key={index}
    //         onClick={() => setSelectedImage(index)}
    //         className={cn(
    //           "overflow-hidden rounded-xl border-2 transition",
    //           selectedImage === index
    //             ? "border-stitch-primary"
    //             : "border-gray-200",
    //         )}
    //       >
    //         <img
    //           key={image}
    //           src={image}
    //           className="aspect-square rounded-xl border object-cover"
    //         />
    //       </button>
    //     ))}
    //   </div>

    //   {previewOpen && (
    //     <Dialog.Root open={previewOpen} onOpenChange={setPreviewOpen}>
    //       <Dialog.Portal>
    //         <Dialog.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm" />

    //         <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center p-6 outline-none">
    //           <button
    //             onClick={() => setPreviewOpen(false)}
    //             className="absolute right-6 top-6 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
    //           >
    //             <X className="h-5 w-5" />
    //           </button>

    //           <button
    //             disabled={selectedImage === 0}
    //             onClick={() => setSelectedImage((i) => i - 1)}
    //             className="absolute left-6 rounded-full bg-white/10 p-3 text-white disabled:opacity-30"
    //           >
    //             <ChevronLeft />
    //           </button>

    //           <img
    //             src={images[selectedImage]}
    //             className="max-h-[90vh] max-w-[90vw] rounded-xl object-contain"
    //           />

    //           <button
    //             disabled={selectedImage === images.length - 1}
    //             onClick={() => setSelectedImage((i) => i + 1)}
    //             className="absolute right-6 rounded-full bg-white/10 p-3 text-white disabled:opacity-30"
    //           >
    //             <ChevronRight />
    //           </button>
    //         </Dialog.Content>
    //       </Dialog.Portal>
    //     </Dialog.Root>
    //   )}
    // </div>

    <section className="overflow-hidden rounded-3xl border border-border bg-card p-3 shadow-sm">
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted"
        aria-label="Open image preview"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current || "/placeholder.svg"}
          alt={current}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <span className="absolute inset-0 bg-foreground/0 transition-colors group-hover:bg-foreground/10" />
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-card/90 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm backdrop-blur transition-opacity">
          <Expand className="size-3.5" />
          Preview
        </span>
      </button>

      <div className="mt-3 flex gap-3 overflow-x-auto">
        {images.map((img, i) => (
          <button
            key={img}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              "relative aspect-square w-20 shrink-0 overflow-hidden rounded-xl bg-muted ring-2 transition",
              i === active
                ? "ring-primary"
                : "ring-transparent hover:ring-border",
            )}
            aria-label={`View ${product.title}`}
            aria-current={i === active}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img || "/placeholder.svg"}
              alt=""
              className="size-full object-cover"
            />
            {i !== active && (
              <span className="absolute inset-0 bg-card/30" aria-hidden="true" />
            )}
          </button>
        ))}
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-foreground/70 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-full bg-card text-foreground shadow-md transition hover:bg-muted"
            aria-label="Close preview"
          >
            <X className="size-5" />
          </button>

          <div
            className="relative flex max-h-[80vh] w-full max-w-4xl items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-2 inline-flex size-10 items-center justify-center rounded-full bg-card/90 text-foreground shadow-md transition hover:bg-card"
              aria-label="Previous image"
            >
              <ChevronLeft className="size-5" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current || "/placeholder.svg"}
              alt={current}
              className="max-h-[80vh] w-auto rounded-2xl object-contain shadow-2xl"
            />
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-2 inline-flex size-10 items-center justify-center rounded-full bg-card/90 text-foreground shadow-md transition hover:bg-card"
              aria-label="Next image"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>

          <div
            className="mt-4 flex gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            {images.map((img, i) => (
              <button
                key={img}
                type="button"
                onClick={() => setActive(i)}
                className={cn(
                  "size-2 rounded-full transition",
                  i === active ? "bg-card w-6" : "bg-card/40 hover:bg-card/70",
                )}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
