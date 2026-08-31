import { ProductSummaryStats } from "@/types/merchant";

// export default function ProductStats({ summary }: { summary: ProductSummaryStats }) {
//   const stats = [
//     {
//       label: "Favorites",
//       value: summary.total_favorite_count,
//       icon: Heart,
//     },
//     {
//       label: "Active Offers",
//       value: summary.active_offers_count,
//       icon: Tag,
//     },
//     {
//       label: "Inactive Offers",
//       value: summary.inactive_offers_count,
//       icon: XCircle,
//     },
//     {
//       label: "Locations",
//       value: summary.location_count,
//       icon: MapPin,
//     },
//   ];

//   return (
//     <div className="grid grid-cols-4 gap-6">
//       {stats.map((stat) => (
//         <div
//           key={stat.label}
//           className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
//         >
//           <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50">
//             <stat.icon className="h-6 w-6 text-brand-500" />
//           </div>

//           <p className="text-3xl font-bold">{stat.value}</p>

//           <p className="mt-2 text-sm text-gray-500">
//             {stat.label}
//           </p>
//         </div>
//       ))}
//     </div>
//   );
// }


import { Heart, MapPin, Ticket, TicketSlash } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
type Tile = {
  label: string
  value: number
  icon: LucideIcon
  muted?: boolean
}

export default function ProductStats({ summary }: { summary: ProductSummaryStats }) {
  const tiles: Tile[] = [
    { label: "Favorites", value: summary.total_favorite_count, icon: Heart },
    { label: "Active Offers", value: summary.active_offers_count, icon: Ticket },
    { label: "Inactive Offers", value: summary.inactive_offers_count, icon: TicketSlash, muted: true },
    { label: "Locations", value: summary.location_count, icon: MapPin },
  ]

  return (
    <section className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-border shadow-sm lg:grid-cols-4">
      {tiles.map((tile) => (
        <div key={tile.label} className="flex items-center gap-3.5 bg-card p-5">
          <span
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-2xl",
              tile.muted ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary",
            )}
          >
            <tile.icon className="size-5" />
          </span>
          <div className="min-w-0">
            <div className="font-mono text-2xl font-semibold leading-none tracking-tight text-foreground">
              {tile.value.toLocaleString("en-US")}
            </div>
            <div className="mt-1.5 text-sm text-muted-foreground">{tile.label}</div>
          </div>
        </div>
      ))}
    </section>
  )
}

