import Link from "next/link";
import { OfferCard } from "./OfferCard";
import type { OfferSection as OfferSectionType } from "@/types";

interface OfferSectionProps {
  section: OfferSectionType;
}

export function OfferSection({ section }: OfferSectionProps) {
  if (!section.offers.length) return null;

  return (
    <section className="py-5">
      {/* Section header */}
      <div className="mb-4 flex items-start justify-between px-4">
        <div>
          <h2 className="flex items-center gap-1.5" style={{ fontSize: 18, fontWeight: 500, color: "#111827" }}>
            {section.type === "top_deals" && <span>🔥</span>}
            {section.title}
          </h2>
          {section.type === "top_deals" && (
            <p style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>
              Limited time — grab before they&apos;re gone!
            </p>
          )}
        </div>
        <Link
          href={`/offers?type=${section.type}`}
          style={{ fontSize: 13, color: "#16a34a", fontWeight: 500, whiteSpace: "nowrap" }}
          className="hover:underline"
        >
          See All ›
        </Link>
      </div>

      {/* Horizontal scroll row */}
      <div
        className="flex gap-4 overflow-x-auto px-4 pb-2"
        style={{ scrollbarWidth: "none" }}
      >
        {section.offers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </section>
  );
}
