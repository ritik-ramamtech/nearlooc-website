import LocationForm from "@/features/user/components/LocationForm";

export default async function Page({params}: {params: Promise<{ id: string }>}) {
    const { id } = await params;

    return <LocationForm id={id} mode="edit"/>
}