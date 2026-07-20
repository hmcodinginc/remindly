import { cn } from "@/lib/utils"

import { LogoMark } from "./LogoMark"

type LogoProps = {
  className?: string
  markClassName?: string
  showWordmark?: boolean
}

export function Logo({
  className,
  markClassName,
  showWordmark = true,
}: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoMark className={markClassName} />
      {showWordmark ? (
        <span className="text-lg font-semibold tracking-tight text-foreground">
          Remindly
        </span>
      ) : null}
    </div>
  )
}
