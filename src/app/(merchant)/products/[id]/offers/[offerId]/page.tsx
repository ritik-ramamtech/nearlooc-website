import OfferDetail from "@/features/merchant/sales/components/OfferDetail";

export default async function ProductOffersPage({ params }: {params: Promise<{ offerId: string }>}) {
  const { offerId } = await params;

  return (
    <OfferDetail id={ offerId }/>
  );
}

