import logoMark from "@/assets/logo.png"
import { cn } from "@/lib/utils"

type LogoMarkProps = {
  className?: string
  alt?: string
}

export function LogoMark({ className, alt = "Remindly" }: LogoMarkProps) {
  return (
    <img
      src={logoMark}
      alt={alt}
      className={cn("size-8 object-contain", className)}
      draggable={false}
    />
  )
}
