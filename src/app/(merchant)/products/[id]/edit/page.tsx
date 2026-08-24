"use client"

import ProductForm from "@/features/merchant/products/components/ProductForm";
import { useMerchantProduct } from "@/features/merchant/products/hooks";
import { useParams } from "next/navigation";

export default function Page() {
    const {id} = useParams<{id: string}>();
    console.log(id)

    const {data}  = useMerchantProduct(id)

    return <ProductForm mode="edit" initialData={data?.data}/>
}