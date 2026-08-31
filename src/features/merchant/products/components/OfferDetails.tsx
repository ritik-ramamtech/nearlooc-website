"use client";

import {
  Clock,
  MapPin,
  Percent,
  Power,
  Star,
  Tag,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ProductSummary, ProductSummaryOffer } from "@/types/merchant";

interface Props {
  product: ProductSummary;
  offer: ProductSummaryOffer;
  onDeactivate?: () => void;
}

export default function OfferDetails({ product, offer, onDeactivate }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}

      <div className="flex items-start justify-between border-b px-6 py-5">
        <div>
          <h2 className="text-xl font-bold">Offer Details</h2>

          <p className="mt-1 text-sm text-gray-500">{offer.location.label}</p>
        </div>

        {offer.is_active && (
          <Button variant="destructive" onClick={onDeactivate}>
            <Power className="mr-2 h-4 w-4" />
            Deactivate
          </Button>
        )}
      </div>

      {/* Stats */}

      <div className="grid grid-cols-4 gap-4 p-6">
        <StatCard
          title="Selling Price"
          value={`₹${offer.discounted_price.toLocaleString("en-IN")}`}
          icon={<Tag className="h-4 w-4" />}
        />

        <StatCard
          title="Original Price"
          value={`₹${product.base_price.toLocaleString("en-IN")}`}
          icon={<Percent className="h-4 w-4" />}
        />

        <StatCard
          title="Discount"
          value={`${offer.discount_percentage}%`}
          icon={<Percent className="h-4 w-4" />}
        />

        <StatCard
          title="Rating"
          value={`${offer.rating}`}
          subtitle={`${offer.review_count} reviews`}
          icon={<Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
        />
      </div>

      <Separator />

      <Tabs defaultValue="overview" className="p-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>

          <TabsTrigger value="features">Features</TabsTrigger>

          <TabsTrigger value="terms">Terms</TabsTrigger>

          <TabsTrigger value="location">Location</TabsTrigger>
        </TabsList>

        {/* OVERVIEW */}

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-2 gap-5">
            <InfoCard
              title="Promo Price"
              value={offer.promo_price ? `₹${offer.promo_price}` : "-"}
            />

            <InfoCard title="Badge" value={offer.badge || "-"} />

            <InfoCard title="Duration" value={offer.duration || "-"} />

            <InfoCard
              title="Ends On"
              value={
                offer.promo_end_at
                  ? new Date(offer.promo_end_at).toLocaleString()
                  : "-"
              }
            />
          </div>
        </TabsContent>

        {/* FEATURES */}

        <TabsContent value="features">
          <div className="space-y-3">
            {offer.features.length ? (
              offer.features.map((feature) => (
                <div
                  key={feature}
                  className="rounded-xl border bg-gray-50 px-4 py-3"
                >
                  {feature}
                </div>
              ))
            ) : (
              <EmptyState label="No features added." />
            )}
          </div>
        </TabsContent>

        {/* TERMS */}

        <TabsContent value="terms">
          <div className="space-y-3">
            {offer.terms.length ? (
              offer.terms.map((term) => (
                <div
                  key={term}
                  className="rounded-xl border bg-gray-50 px-4 py-3"
                >
                  {term}
                </div>
              ))
            ) : (
              <EmptyState label="No terms added." />
            )}
          </div>
        </TabsContent>

        {/* LOCATION */}

        <TabsContent value="location">
          <div className="rounded-xl border p-5">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-brand-500" />

              <h3 className="font-semibold">{offer.location.label}</h3>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-5">
              <InfoCard title="Street" value={offer.location.street} />

              <InfoCard title="City" value={offer.location.city} />

              <InfoCard title="State" value={offer.location.state} />

              <InfoCard
                title="Postal Code"
                value={offer.location.postal_code}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-gray-50 p-4">
      <div className="mb-3 flex items-center gap-2 text-gray-500">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wide">
          {title}
        </span>
      </div>

      <div className="text-2xl font-bold">{value}</div>

      {subtitle && <p className="mt-1 text-xs text-gray-400">{subtitle}</p>}
    </div>
  );
}

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl border p-4">
      <p className="text-xs uppercase tracking-wide text-gray-400">{title}</p>

      <p className="mt-2 font-medium">{value}</p>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed p-8 text-center text-sm text-gray-400">
      {label}
    </div>
  );
}
