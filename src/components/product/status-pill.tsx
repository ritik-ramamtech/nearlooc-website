import { cn } from "@/lib/utils"

type Tone = "active" | "paused" | "neutral"

const toneStyles: Record<Tone, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  paused: "bg-orange-50 text-orange-700 ring-orange-200",
  neutral: "bg-gray-100 text-gray-600 ring-gray-200",
}

export function StatusPill({
  tone,
  label,
  className,
}: {
  tone: Tone
  label: string
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset",
        toneStyles[tone],
        className,
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          tone === "active" && "bg-emerald-500",
          tone === "paused" && "bg-orange-500",
          tone === "neutral" && "bg-gray-400",
        )}
        aria-hidden="true"
      />
      {label}
    </span>
  )
}
