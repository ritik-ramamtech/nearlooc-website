import { ReviewForm } from "@/features/reviews";

export default async function Page({params}: { params: Promise<{id: string }>}) {
    const { id } = await params;

    return <ReviewForm offerId={id}/>
}