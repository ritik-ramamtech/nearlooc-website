import CustomerReviewsPage from "@/features/reviews/components/ReviewsPage";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OfferReviewsPage ({params}: Props) {
    const {id} = await params;

    return <CustomerReviewsPage offerId={id}/>
}