import { Product } from "@/types";
import { Tag, CircleDollarSign, Layers, FileText, Sparkles } from "lucide-react";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function ProductInfoCard({ product }: { product: Product }) {
  const hasDescription = !!product.description;
  const hasHighlights = !!product.highlights && product.highlights.length > 0;

  return (
    // <div className="rounded-3xl border border-stone-200 bg-white p-7 shadow-sm">
    //   <div className="mb-5 flex items-center gap-3">
    //     <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
    //       <FileText className="h-5 w-5" />
    //     </div>

    //     <div>
    //       <h2 className="text-lg font-semibold text-gray-900">
    //         Product Details
    //       </h2>
    //       <p className="text-sm text-gray-500">
    //         Information shown to customers about this product.
    //       </p>
    //     </div>
    //   </div>

    //   {hasDescription && (
    //     <div className="rounded-2xl border border-stone-200 bg-stone-50/60 p-6">
    //       <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-7 prose-li:text-gray-600 prose-strong:text-gray-900">
    //         <ReactMarkdown remarkPlugins={[remarkGfm]}>
    //           {product.description as string}
    //         </ReactMarkdown>
    //       </div>
    //     </div>
    //   )}

    //   {hasHighlights && (
    //     <div className={hasDescription ? "mt-6" : ""}>
    //       <p className="mb-3 text-sm font-semibold text-gray-900">
    //         Highlights
    //       </p>
    //       <ul className="space-y-2">
    //         {product.highlights!.map((highlight) => (
    //           <li
    //             key={highlight}
    //             className="flex items-start gap-3 text-sm text-gray-600"
    //           >
    //             <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
    //             <span>{highlight}</span>
    //           </li>
    //         ))}
    //       </ul>
    //     </div>
    //   )}

    //   {!hasDescription && !hasHighlights && (
    //     <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-stone-300 bg-white">
    //       <p className="text-sm text-gray-500">
    //         No description has been added yet.
    //       </p>
    //     </div>
    //   )}
    // </div>

    <section className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:p-7">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        About this product
      </h2>

      {hasDescription && (
        <div className="prose-product mt-4">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{product.description as string}</ReactMarkdown>
        </div>
      )}

      {hasDescription && hasHighlights && (
        <div className="my-6 h-px bg-border" aria-hidden="true" />
      )}

      {hasHighlights && (
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="size-3.5" />
            </span>
            <h3 className="text-sm font-semibold text-foreground">Highlights</h3>
          </div>

          <ul className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2">
            {product.highlights?.map((h) => (
              <li key={h} className="flex gap-3">
                <span
                  className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary"
                  aria-hidden="true"
                />
                <div>
                  {/* <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {h.title}
                  </div> */}
                  <div className="mt-0.5 text-sm font-medium text-foreground">
                    {h}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function InfoRow({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <div className="rounded-xl w-12 flex items-center justify-center h-12 bg-brand-50 p-3 text-brand-500">
        {icon}
      </div>

      <div>
        <p className="text-sm text-gray-500">{title}</p>

        <p className="mt-1 font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}
