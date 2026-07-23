import { motion } from "framer-motion"
import {
  Bell,
  CalendarDays,
  CreditCard,
  Sparkles,
  Target,
  ListTodo,
} from "lucide-react"

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

export function FeaturesSection() {
  return (
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
  className="group rounded-2xl border border-border/60 bg-card/60 p-6 text-center backdrop-blur-md transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
  {...fadeUp}
  transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
>
  <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
    <feat.icon className="size-6" />
  </div>
  <h3 className="text-xl font-semibold tracking-tight">{feat.title}</h3>
  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feat.description}</p>
</motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
