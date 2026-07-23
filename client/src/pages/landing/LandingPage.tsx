import { useState } from "react"
import { motion } from "framer-motion"
import {
  Bell,
  CalendarDays,
  CreditCard,
  Check,
  ChevronDown,
  Sparkles,
  Target,
  Zap,
  Shield,
  ArrowRight,
  TrendingUp,
  Clock,
  Layers,
  ListTodo,
} from "lucide-react"
import { Link } from "react-router-dom"
import { Logo } from "@/components/brand/Logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.45, ease: "easeOut" as const },
}

const featuresList = [
  {
    icon: CreditCard,
    title: "Subscription & Renewal Engine",
    description: "Track all recurring services with automatic renewal notifications, payment details, and category budgets.",
  },
  {
    icon: ListTodo,
    title: "Prioritized Tasks & Subtasks",
    description: "Structure tasks with urgent priority badges, subtask checklists, and due dates linked directly to your calendar.",
  },
  {
    icon: Target,
    title: "Streak-Based Habit Tracking",
    description: "Build daily consistency with visual streak counters, completion history logs, and instant check-ins.",
  },
  {
    icon: Sparkles,
    title: "Time-Blocked Daily Routines",
    description: "Organize morning, afternoon, evening, and night routines with step-by-step progress tracking.",
  },
  {
    icon: CalendarDays,
    title: "Unified Multi-View Calendar",
    description: "View renewal dates, task deadlines, and habit schedules together in Month, Week, or Day views.",
  },
  {
    icon: Bell,
    title: "Complete Notification Center",
    description: "In-app alerts with Read/Unread, Snooze (+1h, +1d), Archive, Web Push notifications, and Web Audio chimes.",
  },
]

const faqItems = [
  {
    question: "How does Remindly track subscription renewals?",
    answer: "You add your subscriptions with their billing cycle (monthly, yearly, weekly) and renewal date. Remindly evaluates these automatically and alerts you via in-app notifications, web push, or audio chimes days before charging occurs.",
  },
  {
    question: "What types of notifications does Remindly support?",
    answer: "Remindly supports Subscription Renewals, Task Deadlines, Habit Reminders, Budget Alerts, Weekly Summaries, and Monthly Summaries. It includes an in-app center (read/unread, snooze, archive, delete) plus browser Web Push API and audio chimes.",
  },
  {
    question: "Can I manage habits, tasks, and routines together?",
    answer: "Absolutely. Remindly combines all recurring elements of your life in one calm workspace, rendering upcoming events side-by-side on your unified calendar.",
  },
]

export function LandingPage() {
  const [annualBilling, setAnnualBilling] = useState(true)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0)

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
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

      {/* Features Section */}
      <section id="features" className="scroll-mt-24 border-y border-border/50 bg-muted/20 py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <motion.div className="mx-auto max-w-2xl text-center" {...fadeUp}>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Core Modules</span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-5xl">
              Everything recurring, perfectly organized.
            </h2>
            <p className="mt-4 text-muted-foreground md:text-lg">
              Designed with precision for software renewals, financial budgets, daily habits, and focused routines.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuresList.map((feat, index) => (
              <motion.div
                key={feat.title}
                className="group rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-md transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
                {...fadeUp}
                transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
              >
                <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
                  <feat.icon className="size-6" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight">{feat.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
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
                    <Check className="size-4 text-primary" /> Complete Supabase Cloud Sync
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

      {/* FAQ Section */}
      <section id="faq" className="scroll-mt-24 border-t border-border/50 bg-muted/10 py-20 md:py-28">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          <motion.div className="text-center" {...fadeUp}>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">Got Questions?</span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-muted-foreground">
              Everything you need to know about Remindly, Supabase data layer, and push notifications.
            </p>
          </motion.div>

          <div className="mt-12 space-y-4">
            {faqItems.map((item, index) => (
              <motion.div
                key={index}
                className="overflow-hidden rounded-2xl border border-border/60 bg-card/60 transition-colors"
                {...fadeUp}
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="flex w-full items-center justify-between p-5 text-left text-base font-semibold md:p-6"
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    className={`size-5 text-muted-foreground transition-transform duration-200 ${
                      expandedFaq === index ? 'rotate-180 text-primary' : ''
                    }`}
                  />
                </button>
                {expandedFaq === index && (
                  <div className="border-t border-border/40 px-5 pb-5 pt-3 text-sm leading-relaxed text-muted-foreground md:px-6 md:pb-6">
                    {item.answer}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 pt-16 pb-12 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
            {/* Brand & Newsletter Column */}
            <div className="space-y-4 lg:col-span-2">
              <div className="flex items-center gap-3">
                <Logo markClassName="size-7" />
                <span className="text-xl font-extrabold tracking-tight">Remindly</span>
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
                <li><Link to="/routines" className="transition-colors hover:text-foreground">Daily Routines</Link></li>
                <li><Link to="/calendar" className="transition-colors hover:text-foreground">Unified Calendar</Link></li>
                <li><Link to="/notifications" className="transition-colors hover:text-foreground">Notifications Engine</Link></li>
              </ul>
            </div>

            {/* Column 2: Resources */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="transition-colors hover:text-foreground">Features</a></li>
                <li><a href="#pricing" className="transition-colors hover:text-foreground">Pricing Tiers</a></li>
                <li><a href="#faq" className="transition-colors hover:text-foreground">FAQ & Support</a></li>
                <li><Link to="/settings" className="transition-colors hover:text-foreground">Supabase Setup</Link></li>
                <li><Link to="/analytics" className="transition-colors hover:text-foreground">Spend Analytics</Link></li>
                <li><Link to="/documents" className="transition-colors hover:text-foreground">Invoices & Vault</Link></li>
              </ul>
            </div>

            {/* Column 3: Company & Legal */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Company & Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/login" className="transition-colors hover:text-foreground">Sign in</Link></li>
                <li><Link to="/register" className="transition-colors hover:text-foreground">Create Account</Link></li>
                <li><span className="cursor-pointer transition-colors hover:text-foreground" onClick={() => toast.info('Privacy policy is enforced via Supabase RLS policies.')}>Privacy Policy</span></li>
                <li><span className="cursor-pointer transition-colors hover:text-foreground" onClick={() => toast.info('Terms of Service: Standard SaaS terms apply.')}>Terms of Service</span></li>
                <li><span className="cursor-pointer transition-colors hover:text-foreground" onClick={() => toast.info('Security: End-to-end Row Level Security enabled.')}>Security Overview</span></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-8 sm:flex-row text-xs text-muted-foreground">
            <p>© {new Date().getFullYear()} Remindly Inc. All rights reserved.</p>

            <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-medium text-emerald-400">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Systems Operational</span>
            </div>

            <div className="flex gap-4 font-medium">
              <span className="cursor-pointer hover:text-foreground" onClick={() => toast.info('Twitter / X: @remindlyapp')}>Twitter</span>
              <span className="cursor-pointer hover:text-foreground" onClick={() => toast.info('GitHub: github.com/remindly')}>GitHub</span>
              <span className="cursor-pointer hover:text-foreground" onClick={() => toast.info('Discord: discord.gg/remindly')}>Discord</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
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
