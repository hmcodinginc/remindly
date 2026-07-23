import { motion } from "framer-motion"
import { ArrowRight, Sparkles, CreditCard, Target, Bell, Clock, TrendingUp } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.45, ease: "easeOut" as const },
}

export function HeroSection() {
  return (
    <section className="relative mx-auto max-w-6xl px-4 pt-16 md:px-6 md:pt-24">
      <motion.div
        className="mx-auto max-w-3xl text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary backdrop-blur-md">
          <Sparkles className="size-3.5" />
          <span>Next-Gen Subscription & Habit Management</span>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-7xl">
          Never miss a renewal, routine, or task again.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:text-xl">
          Remindly unifies your subscriptions, budgets, daily habits, tasks, routines, and multi-channel notifications in one calm, high-performance workspace.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button size="lg" className="gap-2 text-base px-6 py-6 shadow-lg shadow-primary/25" render={<Link to="/register" />}>
            Get Started Free <ArrowRight className="size-4" />
          </Button>
          <Button size="lg" variant="outline" className="text-base px-6 py-6" render={<Link to="/dashboard" />}>
            Explore Live Dashboard
          </Button>
        </div>
      </motion.div>

      {/* Live Interactive Product Preview Card */}
      <motion.div
        className="mx-auto mt-16 max-w-5xl"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
      >
        <ProductPreviewCard />
      </motion.div>
    </section>
  )
}

function ProductPreviewCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/70 shadow-2xl backdrop-blur-2xl">
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-3 bg-muted/30">
        <div className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-red-500/80" />
          <span className="size-3 rounded-full bg-amber-500/80" />
          <span className="size-3 rounded-full bg-emerald-500/80" />
          <span className="ml-3 text-xs font-mono text-muted-foreground">remindly.app/dashboard</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-500">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live Data Sync</span>
        </div>
      </div>

      <div className="p-6 grid gap-6 md:grid-cols-3">
        {/* Sample Stat 1 */}
        <div className="rounded-xl border border-border/60 bg-background/50 p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Monthly Subscriptions</span>
            <CreditCard className="size-4 text-primary" />
          </div>
          <p className="mt-2 text-2xl font-bold">$195.48</p>
          <div className="mt-2 flex items-center gap-1 text-xs text-emerald-500">
            <TrendingUp className="size-3.5" /> 4 Active Services
          </div>
        </div>

        {/* Sample Stat 2 */}
        <div className="rounded-xl border border-border/60 bg-background/50 p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Habit Streaks</span>
            <Target className="size-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-bold">12 Days</p>
          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <Sparkles className="size-3.5 text-amber-500" /> 3 Habits Checked Today
          </div>
        </div>

        {/* Sample Stat 3 */}
        <div className="rounded-xl border border-border/60 bg-background/50 p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Active Notifications</span>
            <Bell className="size-4 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-bold">3 Unread</p>
          <div className="mt-2 flex items-center gap-1 text-xs text-amber-500">
            <Clock className="size-3.5" /> AWS Renewal in 1 day
          </div>
        </div>
      </div>
    </div>
  )
}
