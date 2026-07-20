import { Link, Outlet } from "react-router-dom"

import { Logo } from "@/components/brand/Logo"
import { ThemeToggle } from "@/components/common/ThemeToggle"

export function AuthLayout() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center px-4 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,oklch(0.55_0.2_285_/_0.22),transparent_50%),radial-gradient(ellipse_at_bottom,oklch(0.45_0.12_286_/_0.15),transparent_55%)]"
      />
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Link to="/" className="mb-8">
        <Logo />
      </Link>
      <div className="w-full max-w-md rounded-2xl border border-border/60 bg-card/70 p-6 shadow-xl backdrop-blur-xl md:p-8">
        <Outlet />
      </div>
    </div>
  )
}
