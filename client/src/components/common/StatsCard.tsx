import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type StatsCardProps = {
  title: string
  value: string
  description?: string
  icon?: LucideIcon
  trend?: ReactNode
  className?: string
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 bg-card/60 p-5 shadow-sm backdrop-blur-md transition-colors hover:border-primary/30",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
        </div>
        {Icon ? (
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="size-4" aria-hidden />
          </div>
        ) : null}
      </div>
      {(description || trend) && (
        <div className="mt-3 flex items-center justify-between gap-2 text-xs text-muted-foreground">
          {description ? <span>{description}</span> : <span />}
          {trend}
        </div>
      )}
    </div>
  )
}
