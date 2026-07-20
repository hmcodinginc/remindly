import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"
import type { ComponentProps } from "react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const statusBadgeVariants = cva("", {
  variants: {
    status: {
      default: "",
      success:
        "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
      warning:
        "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
      danger: "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-300",
      info: "border-primary/20 bg-primary/10 text-primary",
      muted: "border-border bg-muted text-muted-foreground",
    },
  },
  defaultVariants: {
    status: "default",
  },
})

type StatusBadgeProps = ComponentProps<typeof Badge> &
  VariantProps<typeof statusBadgeVariants>

export function StatusBadge({ className, status, ...props }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(statusBadgeVariants({ status }), className)}
      {...props}
    />
  )
}
