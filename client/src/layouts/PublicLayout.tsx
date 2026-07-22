import { Outlet, Link, useLocation } from "react-router-dom"
import { Logo } from "@/components/brand/Logo"
import { ThemeToggle } from "@/components/common/ThemeToggle"
import { Button } from "@/components/ui/button"

export function PublicLayout() {
  const location = useLocation()
  const isHomePage = location.pathname === "/"

  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden bg-background">
      {/* Background ambient lighting */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,oklch(0.55_0.2_285_/_0.18),transparent_55%),radial-gradient(ellipse_at_bottom_right,oklch(0.6_0.16_250_/_0.12),transparent_50%)]"
      />
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
          <Link to="/" className="flex items-center gap-2">
            <Logo />
          </Link>

          {/* User directive: Navbar MUST contain ONLY Features, Pricing, and FAQ */}
          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            {isHomePage ? (
              <>
                <a
                  href="#features"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Features
                </a>
                <a
                  href="#pricing"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Pricing
                </a>
                <a
                  href="#faq"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  FAQ
                </a>
              </>
            ) : (
              <>
                <Link
                  to="/#features"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Features
                </Link>
                <Link
                  to="/#pricing"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Pricing
                </Link>
                <Link
                  to="/#faq"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  FAQ
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" render={<Link to="/login" />}>
              Sign in
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
