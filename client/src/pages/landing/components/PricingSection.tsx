import { useState } from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.45, ease: "easeOut" as const },
}

export function PricingSection() {
  const [annualBilling, setAnnualBilling] = useState(true)

  return (
    <section id="pricing" className="scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <motion.div className="mx-auto max-w-2xl text-center" {...fadeUp}>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">Simple Transparent Pricing</span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">
            Start free, upgrade as you grow
          </h2>
          <p className="mt-4 text-muted-foreground md:text-lg">
            No hidden fees. Full access to subscription analytics and notification triggers.
          </p>

          {/* Annual / Monthly Toggle */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <span className={`text-sm font-medium ${!annualBilling ? 'text-foreground' : 'text-muted-foreground'}`}>
              Monthly billing
            </span>
            <button
              type="button"
              onClick={() => setAnnualBilling(!annualBilling)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                annualBilling ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out ${
                  annualBilling ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${annualBilling ? 'text-foreground' : 'text-muted-foreground'}`}>
              Annual billing <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-500">Save 20%</span>
            </span>
          </div>
        </motion.div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {/* Free Plan */}
          <motion.div
            className="rounded-3xl border border-border/70 bg-card/50 p-8 shadow-sm backdrop-blur-md flex flex-col justify-between"
            {...fadeUp}
          >
            <div>
              <h3 className="text-xl font-bold">Starter</h3>
              <p className="mt-2 text-sm text-muted-foreground">Perfect for personal subscription tracking.</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold">$0</span>
                <span className="text-muted-foreground">/ forever</span>
              </div>

              <ul className="mt-8 space-y-3.5 text-sm">
                <li className="flex items-center gap-2.5">
                  <Check className="size-4 text-emerald-500" /> Up to 5 Active Subscriptions
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-4 text-emerald-500" /> Daily Habits & Task Board
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-4 text-emerald-500" /> In-App Notification Center
                </li>
                <li className="flex items-center gap-2.5 text-muted-foreground">
                  <Check className="size-4 text-muted-foreground/40" /> Web Push & Audio Alerts
                </li>
              </ul>
            </div>
            <Button className="mt-8 w-full" variant="outline" render={<Link to="/register?plan=free" />}>
              Get Started Free
            </Button>
          </motion.div>

          {/* Pro Plan (Highlighted) */}
          <motion.div
            className="relative rounded-3xl border-2 border-primary bg-card p-8 shadow-2xl shadow-primary/10 flex flex-col justify-between"
            {...fadeUp}
            transition={{ delay: 0.1 }}
          >
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
              MOST POPULAR
            </div>
            <div>
              <h3 className="text-xl font-bold">Pro Specialist</h3>
              <p className="mt-2 text-sm text-muted-foreground">Full automation for renewals, budgets & notifications.</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold">${annualBilling ? '9' : '12'}</span>
                <span className="text-muted-foreground">/ month</span>
              </div>

              <ul className="mt-8 space-y-3.5 text-sm">
                <li className="flex items-center gap-2.5">
                  <Check className="size-4 text-primary" /> Unlimited Subscriptions & Budgets
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-4 text-primary" /> Unified Month/Week/Day Calendar
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-4 text-primary" /> Real-time Web Push & Sound Chimes
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-4 text-primary" /> Complete Cloud Sync
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-4 text-primary" /> Multi-channel Snooze & Archive
                </li>
              </ul>
            </div>
            <Button className="mt-8 w-full shadow-lg shadow-primary/20" render={<Link to="/register?plan=pro" />}>
              Start Pro 14-Day Trial
            </Button>
          </motion.div>

          {/* Team Plan */}
          <motion.div
            className="rounded-3xl border border-border/70 bg-card/50 p-8 shadow-sm backdrop-blur-md flex flex-col justify-between"
            {...fadeUp}
            transition={{ delay: 0.2 }}
          >
            <div>
              <h3 className="text-xl font-bold">Teams & SaaS</h3>
              <p className="mt-2 text-sm text-muted-foreground">Shared workspace for cloud & team expenditure.</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold">${annualBilling ? '19' : '24'}</span>
                <span className="text-muted-foreground">/ month</span>
              </div>

              <ul className="mt-8 space-y-3.5 text-sm">
                <li className="flex items-center gap-2.5">
                  <Check className="size-4 text-emerald-500" /> Everything in Pro Plan
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-4 text-emerald-500" /> Multi-User Team Workspaces
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-4 text-emerald-500" /> Department Spend Analytics
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="size-4 text-emerald-500" /> Priority Support & Data Export
                </li>
              </ul>
            </div>
            <Button className="mt-8 w-full" variant="outline" render={<Link to="/register?plan=team" />}>
              Contact Sales
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
