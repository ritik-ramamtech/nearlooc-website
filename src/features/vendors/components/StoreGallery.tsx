"use client";

import { useState } from "react";
import { Images, X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface StoreGalleryProps {
  images: string[];
  businessName: string;
  trigger?: React.ReactNode;
}

export function StoreGallery({ images, businessName, trigger }: StoreGalleryProps) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);

  if (images.length === 0) return null;

  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  return (
    <>
      {trigger ? (
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIdx(0);
            setOpen(true);
          }}
        >
          {trigger}
        </div>
      ) : (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
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
      )}

      {/* Lightbox */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen(false);
          }}
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
