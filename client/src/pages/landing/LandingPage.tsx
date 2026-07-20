import { motion } from "framer-motion"
import {
  Bell,
  CalendarDays,
  CreditCard,
  LineChart,
  Shield,
  Sparkles,
  Target,
  Zap,
} from "lucide-react"
import { Link } from "react-router-dom"

import { Logo } from "@/components/brand/Logo"
import { Button } from "@/components/ui/button"

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.45, ease: "easeOut" as const },
}

const features = [
  {
    icon: CreditCard,
    title: "Subscriptions",
    description:
      "Track every recurring service with billing cycles, categories, and renewal context.",
  },
  {
    icon: Bell,
    title: "Smart reminders",
    description:
      "Never miss a renewal, routine, or task with timely in-app and push-ready alerts.",
  },
  {
    icon: Sparkles,
    title: "Daily routines",
    description:
      "Structure mornings and evenings with checklists that keep momentum visible.",
  },
  {
    icon: Target,
    title: "Habits",
    description:
      "Build consistency with streak-friendly habit tracking that stays out of the way.",
  },
  {
    icon: CalendarDays,
    title: "Unified calendar",
    description:
      "See renewals, tasks, and routines together across month, week, and day views.",
  },
  {
    icon: LineChart,
    title: "Clear analytics",
    description:
      "Understand spending and completion trends without drowning in dashboards.",
  },
]

const benefits = [
  {
    icon: Zap,
    title: "One calm workspace",
    description:
      "Subscriptions, tasks, habits, and reminders live together instead of across five apps.",
  },
  {
    icon: Shield,
    title: "Built for focus",
    description:
      "Large spacing, quiet chrome, and intentional hierarchy keep attention on what matters.",
  },
  {
    icon: Sparkles,
    title: "Ready to grow",
    description:
      "A modular shell designed so authentication, data, and workflows plug in cleanly.",
  },
]

export function LandingPage() {
  return (
    <div>
      <section className="relative mx-auto max-w-6xl px-4 pt-16 pb-20 md:px-6 md:pt-24 md:pb-28">
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <p className="mb-4 text-sm font-medium tracking-wide text-primary">
            Premium productivity for renewals & routines
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl">
            Stay ahead of every renewal, habit, and reminder
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
            Remindly brings subscriptions, calendars, tasks, routines, and
            notifications into one premium workspace — designed for clarity, not
            clutter.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" render={<Link to="/register" />}>
              Start free
            </Button>
            <Button size="lg" variant="outline" render={<Link to="/login" />}>
              Sign in
            </Button>
          </div>
        </motion.div>

        <motion.div
          className="mx-auto mt-16 max-w-5xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
        >
          <ProductPreview />
        </motion.div>
      </section>

      <section className="border-y border-border/50 bg-muted/20 py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <motion.div className="mx-auto max-w-2xl text-center" {...fadeUp}>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Everything you manage, in one place
            </h2>
            <p className="mt-3 text-muted-foreground">
              A focused toolkit for the recurring parts of life and work.
            </p>
          </motion.div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="rounded-2xl border border-border/60 bg-card/50 p-5 backdrop-blur-md transition-colors hover:border-primary/35"
                {...fadeUp}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                  ease: "easeOut",
                }}
              >
                <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <feature.icon className="size-5" aria-hidden />
                </div>
                <h3 className="font-medium tracking-tight">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <motion.div className="mx-auto max-w-2xl text-center" {...fadeUp}>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Designed like the tools you already trust
            </h2>
            <p className="mt-3 text-muted-foreground">
              Inspired by Linear, Vercel, Stripe, and Notion — without the
              noise.
            </p>
          </motion.div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {benefits.map((benefit) => (
              <motion.div key={benefit.title} className="space-y-3" {...fadeUp}>
                <div className="flex size-10 items-center justify-center rounded-xl border border-border/60 bg-background/60 text-primary">
                  <benefit.icon className="size-5" aria-hidden />
                </div>
                <h3 className="text-lg font-medium tracking-tight">
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/50 py-20 md:py-24">
        <motion.div
          className="mx-auto max-w-3xl rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/15 via-card/60 to-indigo-500/10 px-6 py-14 text-center shadow-lg backdrop-blur-xl md:px-12"
          {...fadeUp}
        >
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Ready when your stack is
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Explore the shell today. Authentication, data, and workflows will
            connect into this foundation without redesigning the product.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" render={<Link to="/register" />}>
              Create account
            </Button>
            <Button
              size="lg"
              variant="outline"
              render={<Link to="/dashboard" />}
            >
              View dashboard
            </Button>
          </div>
        </motion.div>
      </section>

      <footer className="border-t border-border/50 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row md:px-6">
          <Logo markClassName="size-6" />
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} HM Coding. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link to="/login" className="hover:text-foreground">
              Sign in
            </Link>
            <Link to="/register" className="hover:text-foreground">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function ProductPreview() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/40 shadow-2xl shadow-primary/5 backdrop-blur-xl">
      <div className="flex items-center gap-2 border-b border-border/50 px-4 py-3">
        <span className="size-2.5 rounded-full bg-red-400/80" />
        <span className="size-2.5 rounded-full bg-amber-400/80" />
        <span className="size-2.5 rounded-full bg-emerald-400/80" />
        <span className="ml-3 text-xs text-muted-foreground">
          remindly.app / dashboard
        </span>
      </div>
      <div className="grid min-h-[280px] md:grid-cols-[200px_1fr]">
        <div className="hidden border-r border-border/50 bg-sidebar/50 p-4 md:block">
          <div className="mb-6 flex items-center gap-2">
            <div className="size-6 rounded-md bg-primary/80" />
            <div className="h-3 w-20 rounded bg-foreground/20" />
          </div>
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`h-8 rounded-lg ${i === 0 ? "bg-primary/20" : "bg-muted/50"}`}
              />
            ))}
          </div>
        </div>
        <div className="space-y-4 p-5 md:p-6">
          <div className="space-y-2">
            <div className="h-6 w-40 rounded-md bg-foreground/15" />
            <div className="h-3 w-64 max-w-full rounded bg-muted-foreground/20" />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-24 rounded-xl border border-border/50 bg-background/40"
              />
            ))}
          </div>
          <div className="h-36 rounded-xl border border-dashed border-border/60 bg-muted/20" />
        </div>
      </div>
    </div>
  )
}
