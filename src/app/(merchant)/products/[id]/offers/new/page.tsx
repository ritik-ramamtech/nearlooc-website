import { Suspense } from "react";
import OfferForm from "@/features/merchant/products/components/OfferForm";

export default async function Page({params}: {params: Promise<{ id: string, offerId: string}>}) {
    const { id: productId, offerId} = await params;

    return (
        <Suspense fallback={null}>
            <OfferForm mode="create" id={offerId} productId={productId}/>
        </Suspense>
    );
}