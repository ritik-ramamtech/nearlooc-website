"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { OfferCard } from "./OfferCard";
import type { OfferSection as OfferSectionType } from "@/types";

interface OfferSectionProps {
  section: OfferSectionType;
}

const NAMED_TYPES = ["top_deals", "recommended", "new_arrivals", "nearby"];

function getSeeAllHref(section: OfferSectionType): string {
  const { type, title, parent_category } = section;
  const encoded = encodeURIComponent(title);

  if (NAMED_TYPES.includes(type)) {
    return `/offers?type=${type}&title=${encoded}`;
  }
  if (type.startsWith("subcat_") && parent_category) {
    const subcategoryId = type.replace("subcat_", "");
    return `/offers?category_id=${parent_category}&subcategory_id=${subcategoryId}&title=${encoded}`;
  }
  if (parent_category) {
    return `/offers?category_id=${parent_category}&title=${encoded}`;
  }
  return `/offers?title=${encoded}`;
}

export function OfferSection({ section }: OfferSectionProps) {
  if (!section.offers.length) return null;

  return (
    <section className="w-full bg-[#f7faf8] py-8">
      <div className="mb-5 flex items-start justify-between gap-4 px-4 sm:px-6 lg:px-16">
        <div>
          <h2 className="text-[28px] font-extrabold leading-tight text-on-surface sm:text-[32px]">
            {section.title}
          </h2>
          {section.type === "top_deals" && (
            <p className="mt-2 text-[13px] text-on-surface-variant">
              Limited time offers on top products - grab them before they&apos;re gone!
            </p>
          )}
        </div>

        <Link
          href={getSeeAllHref(section)}
          className="flex shrink-0 items-center gap-1 pt-1 text-[13px] font-bold text-stitch-secondary hover:underline"
        >
          See All <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div
        className="scrollbar-hide overflow-x-auto pb-3"
        style={{
          WebkitOverflowScrolling: "touch",
          scrollSnapType: "x mandatory",
        }}
      >
        <div className="flex gap-4 px-4 sm:px-6 lg:px-16">
          {section.offers.map((offer) => (
            <div key={offer.id} style={{ scrollSnapAlign: "start", flexShrink: 0 }}>
              <OfferCard offer={offer} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
