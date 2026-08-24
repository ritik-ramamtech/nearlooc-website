import { MapPin, Pencil, Ticket, TicketSlash } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { cn, formatRelativeTime } from "@/lib/utils"
import { Product } from "@/types"
import { ActivityType, ProductActivity } from "@/types/merchant"

  

const iconMap: Record<ActivityType, { icon: LucideIcon; tone: string }> = {
  offer_created: { icon: Ticket, tone: "bg-primary/10 text-primary ring-primary/20" },
  offer_ended: { icon: TicketSlash, tone: "bg-muted text-muted-foreground ring-border" },
  product_updated: { icon: Pencil, tone: "bg-accent text-accent-foreground ring-primary/20" },
  product_created: { icon: Pencil, tone: "bg-accent text-accent-foreground ring-primary/20" },
  location_added: { icon: MapPin, tone: "bg-primary/10 text-primary ring-primary/20" },
  offer_deactivated: { icon: MapPin, tone: "bg-primary/10 text-primary ring-primary/20" },
}

export default function RecentActivity({ activities }: { activities: ProductActivity[] }) {
  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-sm font-semibold text-foreground">Recent activity</h2>

      <ol className="mt-5">
        {activities.map((event, i) => {
          console.log(typeof event.date, " ", event.type);
          const { icon: Icon, tone } = iconMap[event.type]
          const isLast = i === activities.length - 1
          return (
            <li key={i} className="relative flex gap-3.5 pb-6 last:pb-0">
              {!isLast && (
                <span
                  className="absolute left-[15px] top-8 bottom-0 w-px bg-border"
                  aria-hidden="true"
                />
              )}
              <span
                className={cn(
                  "z-10 flex size-8 shrink-0 items-center justify-center rounded-full ring-1 ring-inset",
                  tone,
                )}
              >
                <Icon className="size-4" />
              </span>
              <div className="min-w-0 pt-1">
                <div className="text-sm font-medium text-foreground">{event.type}</div>
                {/* {event.meta && (
                  <div className="truncate text-sm text-muted-foreground">{event.meta}</div>
                )} */}
                <div className="mt-0.5 text-xs text-muted-foreground/80">{formatRelativeTime(event.date)}</div>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
