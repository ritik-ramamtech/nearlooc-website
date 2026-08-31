"use client";

import {
  BarChart3,
  FileText,
  Heart,
  MapPin,
  MessageSquare,
  Pencil,
  ScrollText,
  ShieldCheck,
  Sparkles,
  Star,
  Tag,
} from "lucide-react";
import { useMerchantOfferDetail } from "../hooks";
import Image from "next/image";
import { formatLocalDate } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import OfferDetailSkeleton from "./OfferDetailSkeleton";
import Link from "next/link";

type StatusEnum = "ended_early" | "ended" | "active";

export default function OfferDetail({ id }: { id: string }) {
  const { data, isPending } = useMerchantOfferDetail(id);
  const offer = data;

  if (isPending) return <OfferDetailSkeleton />;

  if (!offer) return null;
  const now = new Date();
  const hasEnded = offer.promo_end_at
    ? new Date(offer.promo_end_at) <= now
    : false;
  const status: StatusEnum = offer.is_active
    ? "active"
    : hasEnded
      ? "ended"
      : "ended_early";

  return (
    <div className="w-full py-4 min-h-screen bg-gray-100">
      <div className="px-6 mx-auto">
        <div className="flex justify-between items-center">
          <div className="">
            <h1 className="text-xl font-semibold">Offer Details</h1>
            <p className="text-sm text-gray-500">View and manage your offer</p>
          </div>
          {status === "active" && (
            <Link
              href={`/products/${data.product_id}/offers/${id}/edit`}
              className="border border-blue-500 text-blue-500 rounded flex items-center px-3 text-sm h-10 gap-2 font-semibold"
            >
              <Pencil size={16} />
              <p>Edit Offer</p>
            </Link>
          )}
        </div>

        <div className="shadow rounded-2xl px-6 py-5 flex gap-10 mt-4 bg-white">
          <div className="relative h-36 w-36 overflow-hidden rounded-xl">
            <Image
              src={offer?.product.image_url || offer.product.images[0]}
              alt={offer?.product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold">
              {offer?.product.name || offer?.product.title}
            </h2>
            <div className="flex gap-2 text-sm text-green-600">
              <p>{offer?.category_name} . </p>
              <p>{offer?.subcategory_name}</p>
            </div>
            <div className="flex gap-2">
              <Star className=" fill-yellow-300 text-yellow-300" />
              {offer?.rating}{" "}
              <span className="text-gray-500">
                ({offer?.review_count} reviews){" "}
              </span>
              |
              <span className="flex items-center gap-2 text-gray-600">
                <Heart size={16} className="text-red-500 fill-red-100" />
                {offer?.favorite_count} Favorites
              </span>
            </div>
            <div className="flex gap-4 items-center">
              <span className=" text-xl font-semibold">
                ₹{offer?.discounted_price}
              </span>
              <span className=" line-through text-gray-500 text-lg">
                ₹{offer?.product.base_price}
              </span>
              <div className="px-2 py-1 bg-orange-200/40 border border-orange-300 rounded text-sm text-orange-600">
                {offer?.discount_percentage}% OFF
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
          {/* Offer Details */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50">
                <Tag className="h-5 w-5 text-indigo-600" />
              </div>

              <h2 className="text-xl font-semibold text-gray-900">
                Offer Details
              </h2>
            </div>

            <div className="space-y-4 text-[15px]">
              <div className="flex justify-between items-center   ">
                <span className="text-gray-600">Promo Price</span>
                <span className="font-medium">₹{offer?.discounted_price}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Original Price</span>
                <span className="font-medium">
                  ₹{offer?.product.base_price}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Discount</span>
                <span className="font-semibold text-orange-500">
                  {offer?.discount_percentage}% OFF
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Created At</span>
                <span className="font-medium">
                  {formatLocalDate(offer?.created_at)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Updated At</span>
                <span className="font-medium">
                  {formatLocalDate(offer?.updated_at)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-500">Offer Status</span>

                <span className="inline-flex w-fit rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                  {status}
                </span>
              </div>
            </div>
          </div>

          {/* Performance */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50">
                <BarChart3 className="h-5 w-5 text-indigo-600" />
              </div>

              <h2 className="text-xl font-semibold text-gray-900">
                Performance
              </h2>
            </div>

            <div className="space-y-6 text-[15px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-gray-600">Rating</span>
                </div>

                <span className="font-semibold">{offer?.rating} / 5</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-indigo-500" />
                  <span className="text-gray-600">Review Count</span>
                </div>

                <span className="font-semibold">{offer?.review_count}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                  <span className="text-gray-600">Favorite Count</span>
                </div>

                <span className="font-semibold">{offer?.favorite_count}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-green-600" />
                  <span className="text-gray-600">Status</span>
                </div>

                <span className="font-semibold">
                  {status}
                </span>
              </div>
            </div>
          </div>

          {offer.location && <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <header className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50">
                <MapPin className="h-5 w-5 text-indigo-600" />
              </div>

              <h2 className="text-xl font-semibold text-gray-900">Location</h2>
            </header>

            <dl className="space-y-4">
              <div className="grid grid-cols-[120px_1fr]">
                <dt className="text-gray-500">Store</dt>
                <dd className="font-medium">{offer?.location.label}</dd>
              </div>

              <div className="grid grid-cols-[120px_1fr]">
                <dt className="text-gray-500">Street</dt>
                <dd>{offer?.location.street}</dd>
              </div>

              <div className="grid grid-cols-[120px_1fr]">
                <dt className="text-gray-500">City</dt>
                <dd>{offer?.location.city}</dd>
              </div>

              <div className="grid grid-cols-[120px_1fr]">
                <dt className="text-gray-500">State</dt>
                <dd>{offer?.location.state}</dd>
              </div>
            </dl>
          </section>}
        </div>

        {/* Description + Location */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Description */}
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <header className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50">
                <FileText className="h-5 w-5 text-indigo-600" />
              </div>

              <h2 className="text-xl font-semibold text-gray-900">
                Description
              </h2>
            </header>

            {offer?.product.description ? (
              <div className="text-[15px] leading-7 text-gray-600">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => (
                      <h1 className="mt-8 mb-4 text-2xl font-bold text-gray-900">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="mt-6 mb-3 text-xl font-semibold text-gray-900">
                        {children}
                      </h2>
                    ),
                  }}
                >
                  {offer.product.description ?? ""}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-sm italic text-gray-400">
                No description available.
              </p>
            )}
          </section>
        </div>

        {/* Terms + Highlights */}
        {(offer?.terms.length || offer?.product.highlights.length) > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Terms */}
            {offer?.terms.length > 0 && (
              <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <header className="mb-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50">
                    <ScrollText className="h-5 w-5 text-indigo-600" />
                  </div>

                  <h2 className="text-xl font-semibold text-gray-900">
                    Terms & Conditions
                  </h2>
                </header>

                <ul className="space-y-3">
                  {offer.terms.map((term, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-gray-600"
                    >
                      <span className="mt-2 h-2 w-2 rounded-full bg-gray-400" />
                      <span>{term}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Highlights */}
            {offer?.product.highlights.length > 0 && (
              <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <header className="mb-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50">
                    <Sparkles className="h-5 w-5 text-indigo-600" />
                  </div>

                  <h2 className="text-xl font-semibold text-gray-900">
                    Highlights
                  </h2>
                </header>

                <div className="flex flex-wrap gap-3">
                  {offer.product.highlights.map((highlight) => (
                    <span
                      key={highlight}
                      className="rounded-full bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

         {(offer?.features.length || offer?.product.highlights.length) > 0 && (
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Features */}
            {offer?.features.length > 0 && (
              <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <header className="mb-5 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50">
                    <ScrollText className="h-5 w-5 text-indigo-600" />
                  </div>

                  <h2 className="text-xl font-semibold text-gray-900">
                    Features
                  </h2>
                </header>

                <ul className="space-y-3">
                  {offer.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-gray-600"
                    >
                      <span className="mt-2 h-2 w-2 rounded-full bg-gray-400" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
