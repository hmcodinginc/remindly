import { motion } from "framer-motion"
import {
  CreditCard,
  Target,
  Bell,
  Sparkles,
  ListTodo,
  TrendingUp,
  Clock,
  ArrowRight,
  PiggyBank,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react"
import { Link } from "react-router-dom"
import { useDataStore } from "@/store/use-data-store"
import { useNotificationsEngine } from "@/hooks/use-notifications-engine"
import { CreateItemModal } from "@/components/modals/CreateItemModal"

export function DashboardPage() {
  useNotificationsEngine()

  const subscriptions = useDataStore((s) => s.subscriptions)
  const tasks = useDataStore((s) => s.tasks)
  const habits = useDataStore((s) => s.habits)
  const habitLogs = useDataStore((s) => s.habitLogs)
  const routines = useDataStore((s) => s.routines)
  const notifications = useDataStore((s) => s.notifications)

  const todayStr = new Date().toISOString().split("T")[0]

  // Financial calculations
  const activeSubs = subscriptions.filter((s) => s.status === "active")
  const totalMonthlySpend = activeSubs.reduce((acc, s) => {
    if (s.billing_cycle === "monthly") return acc + s.cost
    if (s.billing_cycle === "yearly") return acc + s.cost / 12
    if (s.billing_cycle === "weekly") return acc + s.cost * 4.33
    return acc
  }, 0)

  const totalAnnualSpend = totalMonthlySpend * 12

  // Upcoming Renewals (next 30 days)
  const nowMs = Date.now()
  const thirtyDaysMs = 30 * 86400000
  const upcomingRenewals = activeSubs.filter((s) => {
    if (!s.next_renewal_date) return false
    const renewalMs = new Date(s.next_renewal_date).getTime()
    return renewalMs >= nowMs && renewalMs <= nowMs + thirtyDaysMs
  })

  const upcomingCost = upcomingRenewals.reduce((acc, s) => acc + s.cost, 0)

  // Budget & Savings
  const totalBudgetLimit = subscriptions.reduce((acc, s) => acc + (s.budget_limit || 0), 0)
  const monthlySavings = Math.max(0, totalBudgetLimit - totalMonthlySpend)

  // Task metrics
  const completedTasksCount = tasks.filter((t) => t.status === "completed").length
  const pendingTasks = tasks.filter((t) => t.status !== "completed")
  const urgentTasksCount = pendingTasks.filter((t) => t.priority === "urgent" || t.priority === "high").length
  const taskCompletionRate = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0

  // Habit metrics
  const activeHabitsCheckedToday = habits.filter((h) =>
    habitLogs.some((hl) => hl.habit_id === h.id && hl.completed_date === todayStr)
  )
  const habitCompletionRate = habits.length > 0 ? Math.round((activeHabitsCheckedToday.length / habits.length) * 100) : 0

  // Routine metrics
  const totalRoutineSteps = routines.reduce((acc, r) => acc + (r.steps?.length || 0), 0)
  const completedRoutineSteps = routines.reduce(
    (acc, r) => acc + (r.steps?.filter((st) => st.completed).length || 0),
    0
  )
  const routineCompletionRate = totalRoutineSteps > 0 ? Math.round((completedRoutineSteps / totalRoutineSteps) * 100) : 0

  // Unread Alerts
  const unreadNotifs = notifications.filter((n) => n.read_status === "unread")

  return (
    <div className="space-y-8 pb-10">
      {/* Header & Quick Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Executive summary of spending, renewals, habits, and productivity.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CreateItemModal triggerText="Quick Add Entry" />
        </div>
      </div>

      {/* Primary Financial & Renewal Summary Metrics */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Monthly Spending */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm backdrop-blur-md flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Monthly Spending
              </span>
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CreditCard className="size-5" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-black">${totalMonthlySpend.toFixed(2)}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Est. ${totalAnnualSpend.toFixed(0)}/yr projected
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Subscriptions</span>
            <Link to="/subscriptions" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
              <span>View All</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </motion.div>

        {/* Metric 2: Total Active Subscriptions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm backdrop-blur-md flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Active Subscriptions
              </span>
              <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
                <ShieldCheck className="size-5" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-black">{activeSubs.length}</p>
            <p className="mt-1 text-xs text-emerald-500 font-semibold">
              {subscriptions.length - activeSubs.length} paused or inactive
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Manage List</span>
            <Link to="/subscriptions" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
              <span>Subscriptions</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </motion.div>

        {/* Metric 3: Upcoming Renewals */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm backdrop-blur-md flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Upcoming Renewals
              </span>
              <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                <Clock className="size-5" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-black">{upcomingRenewals.length}</p>
            <p className="mt-1 text-xs text-amber-400 font-semibold">
              ${upcomingCost.toFixed(2)} due within 30 days
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Renewal Schedule</span>
            <Link to="/subscriptions" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
              <span>View Renewals</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </motion.div>

        {/* Metric 4: Monthly Savings / Budget Target */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm backdrop-blur-md flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Monthly Savings
              </span>
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                <PiggyBank className="size-5" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-black text-emerald-400">
              ${monthlySavings.toFixed(2)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {totalBudgetLimit > 0 ? `Limit target: $${totalBudgetLimit.toFixed(2)}` : "Budget caps active"}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Financial Analytics</span>
            <Link to="/analytics" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
              <span>Analytics</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Secondary Productivity Summary Overview Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Productivity Summary 1: Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm backdrop-blur-md space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ListTodo className="size-5 text-amber-500" />
              <h3 className="font-bold text-base">Pending Tasks</h3>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-400">
              {urgentTasksCount} Urgent
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-muted-foreground">Completion Rate</span>
              <span className="font-bold">{taskCompletionRate}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all duration-300"
                style={{ width: `${taskCompletionRate}%` }}
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs border-t border-border/40">
            <span className="text-muted-foreground">{pendingTasks.length} tasks remaining</span>
            <Link to="/tasks" className="font-bold text-primary hover:underline">
              Task Board →
            </Link>
          </div>
        </motion.div>

        {/* Productivity Summary 2: Habits */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm backdrop-blur-md space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="size-5 text-emerald-500" />
              <h3 className="font-bold text-base">Habits Today</h3>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400">
              {activeHabitsCheckedToday.length} / {habits.length}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-muted-foreground">Today's Progress</span>
              <span className="font-bold">{habitCompletionRate}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${habitCompletionRate}%` }}
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs border-t border-border/40">
            <span className="text-muted-foreground">Streaks active</span>
            <Link to="/habits" className="font-bold text-primary hover:underline">
              Habits Grid →
            </Link>
          </div>
        </motion.div>

        {/* Productivity Summary 3: Routines */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm backdrop-blur-md space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="size-5 text-indigo-500" />
              <h3 className="font-bold text-base">Daily Routines</h3>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-400">
              {routines.length} Routines
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-muted-foreground">Steps Done</span>
              <span className="font-bold">{routineCompletionRate}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-indigo-500 transition-all duration-300"
                style={{ width: `${routineCompletionRate}%` }}
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs border-t border-border/40">
            <span className="text-muted-foreground">{completedRoutineSteps} of {totalRoutineSteps} steps</span>
            <Link to="/routines" className="font-bold text-primary hover:underline">
              Routines →
            </Link>
          </div>
        </motion.div>

        {/* Productivity Summary 4: Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm backdrop-blur-md space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="size-5 text-purple-500" />
              <h3 className="font-bold text-base">System Alerts</h3>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-500/15 text-purple-400">
              {unreadNotifs.length} Unread
            </span>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            {unreadNotifs.length > 0
              ? `${unreadNotifs.length} active alerts requiring your attention for upcoming renewals or task deadlines.`
              : "All system alerts and notifications have been reviewed."}
          </p>

          <div className="pt-2 flex items-center justify-between text-xs border-t border-border/40">
            <span className="text-muted-foreground">{notifications.length} total logs</span>
            <Link to="/notifications" className="font-bold text-primary hover:underline">
              Alert Center →
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
