import { Suspense } from "react";
import { OffersView } from "@/features/offers/components/OffersView";
import type { OffersInitialParams } from "@/features/offers/components/OffersView";

interface Props {
  searchParams: Promise<OffersInitialParams>;
}

export default async function OffersPage({ searchParams }: Props) {
  const params = await searchParams;
  return (
    <Suspense fallback={null}>
      <OffersView initialParams={params} />
    </Suspense>
  );
}
