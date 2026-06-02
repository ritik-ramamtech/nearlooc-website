"use client";

import { useState } from "react";
import { ChevronDown, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItemProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

function AccordionItem({ title, defaultOpen = false, children }: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-outline-variant last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-3.5 text-left"
      >
        <span className="text-label-md font-semibold text-on-surface">{title}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-on-surface-variant transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-200",
          open ? "max-h-[600px] pb-4 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        {children}
      </div>
    </div>
  );
}

interface OfferAccordionProps {
  description?: string | null;
  features?: string[] | null;
  highlights?: string[] | null;
  terms?: string[] | null;
}

export function OfferAccordion({ description, features, highlights, terms }: OfferAccordionProps) {
  const hasOverview = description || (features && features.length > 0);
  const hasHighlights = highlights && highlights.length > 0;
  const hasTerms = terms && terms.length > 0;

  if (!hasOverview && !hasHighlights && !hasTerms) return null;

  return (
    <div className="rounded-xl border border-outline-variant bg-surface-container-lowest px-4">
      {hasOverview && (
        <AccordionItem title="About this offer" defaultOpen>
          <div className="space-y-3">
            {description && (
              <p className="text-body-sm leading-relaxed text-on-surface-variant">{description}</p>
            )}
            {features && features.length > 0 && (
              <ul className="space-y-2">
                {features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-body-sm text-on-surface">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-stitch-secondary" />
                    {f}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </AccordionItem>
      )}

      {hasHighlights && (
        <AccordionItem title="Highlights">
          <ul className="space-y-2">
            {highlights!.map((h, i) => (
              <li key={i} className="flex items-start gap-2 text-body-sm text-on-surface">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-stitch-primary" />
                {h}
              </li>
            ))}
          </ul>
        </AccordionItem>
      )}

      {hasTerms && (
        <AccordionItem title="Terms & Conditions">
          <ul className="space-y-2">
            {terms!.map((t, i) => (
              <li key={i} className="flex items-start gap-1.5 text-body-sm text-on-surface-variant">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-on-surface-variant" />
                {t}
              </li>
            ))}
          </ul>
        </AccordionItem>
      )}
    </div>
  );
}
