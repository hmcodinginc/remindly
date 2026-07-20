import { Outlet } from "react-router-dom"

import { Logo } from "@/components/brand/Logo"
import { ThemeToggle } from "@/components/common/ThemeToggle"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export function PublicLayout() {
  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,oklch(0.55_0.2_285_/_0.18),transparent_55%),radial-gradient(ellipse_at_bottom_right,oklch(0.6_0.16_250_/_0.12),transparent_50%)]"
      />
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/60 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
          <Link to="/">
            <Logo />
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" render={<Link to="/login" />}>
              Log in
            </Button>
            <Button render={<Link to="/register" />}>Get started</Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
