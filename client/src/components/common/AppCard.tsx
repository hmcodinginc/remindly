import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type AppCardProps = {
  children: ReactNode
  className?: string
  padding?: "none" | "sm" | "md" | "lg"
}

const paddingMap = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
}

export function AppCard({ children, className, padding = "md" }: AppCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 bg-card/60 shadow-sm backdrop-blur-md",
        paddingMap[padding],
        className,
      )}
    >
      {children}
    </div>
  )
}
