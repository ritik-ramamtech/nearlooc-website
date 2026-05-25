import type { Metadata } from "next";
import { TopBar } from "@/components/layout/TopBar";
import { OfferDetail } from "@/features/offers/components/OfferDetail";

export const metadata: Metadata = { title: "Offer Details" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OfferDetailPage({ params }: Props) {
  const { id } = await params;
  return (
    <>
      <TopBar title="Offer Details" />
      <div className="pt-14">
        <OfferDetail id={id} />
      </div>
    </>
  );
}
