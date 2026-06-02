"use client";

import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface OfferImageGalleryProps {
  images: string[];
  title: string;
  discountPercentage?: number;
  badge?: string | null;
}

export function OfferImageGallery({
  images,
  title,
  discountPercentage,
  badge,
}: OfferImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Sync dot indicator when user swipes on mobile
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      const index = Math.round(el.scrollLeft / el.offsetWidth);
      setActiveIndex(index);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  function scrollToIndex(index: number) {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.offsetWidth, behavior: "smooth" });
    setActiveIndex(index);
  }

  if (images.length === 0) {
    return (
      <div className="aspect-[4/3] w-full bg-surface-container-low flex items-center justify-center md:rounded-xl">
        <span className="text-body-sm text-on-surface-variant">No image</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row md:gap-3">

      {/* ── Desktop: vertical thumbnail strip (left) ── */}
      {images.length > 1 && (
        <div className="hidden md:flex md:flex-col md:gap-2 md:w-[72px] md:shrink-0">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              className={cn(
                "w-[72px] h-[72px] rounded-lg overflow-hidden border-2 transition-all shrink-0",
                activeIndex === i
                  ? "border-stitch-primary shadow-sm"
                  : "border-outline-variant hover:border-stitch-primary/50"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${title} ${i + 1}`}
                className="h-full w-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </button>
          ))}
        </div>
      )}

      {/* ── Main image area ── */}
      <div className="relative flex-1 min-w-0">

        {/* Swipeable image strip */}
        <div
          ref={scrollRef}
          className="no-scrollbar flex overflow-x-auto md:overflow-hidden"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {images.map((src, i) => (
            <div
              key={i}
              className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-surface-container-low md:rounded-xl"
              style={{ scrollSnapAlign: "start" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${title} ${i + 1}`}
                className="h-full w-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </div>
          ))}
        </div>

        {/* Discount badge — top left */}
        {(discountPercentage && discountPercentage > 0) && (
          <div className="absolute left-3 top-3 z-10">
            <span className="rounded-full bg-error px-2.5 py-1 text-label-sm font-bold text-white shadow">
              {badge ?? `${Math.round(discountPercentage)}% OFF`}
            </span>
          </div>
        )}

        {/* Mobile dot indicators — bottom center */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 md:hidden">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToIndex(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-200",
                  activeIndex === i ? "w-5 bg-white" : "w-1.5 bg-white/50"
                )}
              />
            ))}
          </div>
        )}

        {/* Mobile: image count badge — top right */}
        {images.length > 1 && (
          <div className="absolute right-3 top-3 z-10 rounded-full bg-black/40 px-2 py-0.5 text-label-sm text-white md:hidden">
            {activeIndex + 1}/{images.length}
          </div>
        )}
      </div>

      {/* ── Mobile: horizontal thumbnail strip (below main image) ── */}
      {images.length > 1 && (
        <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto px-4 md:hidden">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              className={cn(
                "h-14 w-14 shrink-0 rounded-lg overflow-hidden border-2 transition-all",
                activeIndex === i
                  ? "border-stitch-primary"
                  : "border-outline-variant"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${title} ${i + 1}`}
                className="h-full w-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </button>
          ))}
        </div>
      )}

    </div>
  );
}
