import { Link } from "react-router-dom"
import { toast } from "sonner"
import { Logo } from "@/components/brand/Logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function FooterSection() {
  return (
    <footer className="border-t border-border/50 bg-card/30 pt-16 pb-12 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand & Newsletter Column */}
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center gap-3">
              <Logo markClassName="size-7" />
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground max-w-sm">
              The calm, unified workspace for subscription renewals, financial budgets, daily habits, tasks, and intelligent multi-channel notifications.
            </p>

            {/* Newsletter Signup Form */}
            <form
              className="mt-4 flex max-w-sm items-center gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                const form = e.currentTarget
                const input = form.querySelector('input') as HTMLInputElement
                if (input && input.value) {
                  toast.success('Thank you for subscribing to Remindly updates!')
                  input.value = ''
                }
              }}
            >
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-background/80 text-sm"
                required
              />
              <Button type="submit" size="sm" className="shrink-0">
                Subscribe
              </Button>
            </form>
          </div>

          {/* Column 1: Product */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/subscriptions" className="transition-colors hover:text-foreground">Subscriptions</Link></li>
              <li><Link to="/tasks" className="transition-colors hover:text-foreground">Tasks & Priorities</Link></li>
              <li><Link to="/habits" className="transition-colors hover:text-foreground">Habits Tracker</Link></li>
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#features" className="transition-colors hover:text-foreground">Features</a></li>
              <li><a href="#pricing" className="transition-colors hover:text-foreground">Pricing Tiers</a></li>
              <li><a href="#faq" className="transition-colors hover:text-foreground">FAQ & Support</a></li>
            </ul>
          </div>

          {/* Column 3: Company & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Company & Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/login" className="transition-colors hover:text-foreground">Sign in</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-8 sm:flex-row text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Remindly Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
