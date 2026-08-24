import OfferForm from "@/features/merchant/products/components/OfferForm";

export default async function Page({ params }: {params: Promise<{ id: string, offerId: string }>}) {
    const { id: productId, offerId } = await params;

    return <OfferForm mode="edit" id={offerId} productId={productId}/>
}