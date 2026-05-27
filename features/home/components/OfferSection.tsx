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
    <section className="py-6 w-full">
      {/* Header — same responsive padding as container edges */}
      <div className="mb-4 flex items-center justify-between px-4">
        <div>
          <h2 className="text-[16px] font-bold text-on-surface">{section.title}</h2>
          {section.type === "top_deals" && (
            <p className="mt-0.5 text-[12px] text-on-surface-variant">
              Limited time — grab before they&apos;re gone!
            </p>
          )}
        </div>
        <Link
          href={getSeeAllHref(section)}
          className="flex items-center gap-0.5 text-[13px] font-semibold text-stitch-primary hover:underline"
        >
          See All <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Scroll row — left edge aligns with header; right overflows for scroll */}
      <div
        className="scrollbar-hide overflow-x-auto pb-2"
        style={{
          WebkitOverflowScrolling: "touch",
          scrollSnapType: "x mandatory",
        }}
      >
        <div className="flex gap-4 px-4">
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
