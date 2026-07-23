import { motion } from "framer-motion"
import {
  CreditCard,
  Target,
  Bell,
  Sparkles,
  ListTodo,
  CalendarDays,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
} from "lucide-react"
import { Link } from "react-router-dom"
import { useDataStore } from "@/store/use-data-store"
import { useNotificationsEngine } from "@/hooks/use-notifications-engine"
import { CreateItemModal } from "@/components/modals/CreateItemModal"
import { Button } from "@/components/ui/button"

export function DashboardPage() {
  useNotificationsEngine()

  const subscriptions = useDataStore((s) => s.subscriptions)
  const tasks = useDataStore((s) => s.tasks)
  const habits = useDataStore((s) => s.habits)
  const habitLogs = useDataStore((s) => s.habitLogs)
  const routines = useDataStore((s) => s.routines)
  const notifications = useDataStore((s) => s.notifications)
  const toggleTaskCompleted = useDataStore((s) => s.toggleTaskCompleted)
  const toggleHabitLog = useDataStore((s) => s.toggleHabitLog)
  const toggleRoutineStep = useDataStore((s) => s.toggleRoutineStep)

  const todayStr = new Date().toISOString().split("T")[0]

  // Stats calculations
  const totalMonthlySpend = subscriptions
    .filter((s) => s.status === "active")
    .reduce((acc, s) => {
      if (s.billing_cycle === "monthly") return acc + s.cost
      if (s.billing_cycle === "yearly") return acc + s.cost / 12
      if (s.billing_cycle === "weekly") return acc + s.cost * 4.33
      return acc
    }, 0)

  const pendingTasks = tasks.filter((t) => t.status !== "completed")
  const urgentTasks = pendingTasks.filter((t) => t.priority === "urgent" || t.priority === "high")

  const activeHabitsCheckedToday = habits.filter((h) =>
    habitLogs.some((hl) => hl.habit_id === h.id && hl.completed_date === todayStr)
  )

  const unreadNotifs = notifications.filter((n) => n.read_status === "unread")

  return (
    <div className="space-y-8 pb-10">
      {/* Header & Quick Action */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your real-time command center for renewals, tasks, habits, and alerts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CreateItemModal triggerText="Quick Add" />
        </div>
      </div>

      {/* Top Summary Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Subscriptions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border/60 bg-card/60 p-5 shadow-sm backdrop-blur-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Monthly Subscriptions
            </span>
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CreditCard className="size-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black">${totalMonthlySpend.toFixed(2)}</p>
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>{subscriptions.length} active services</span>
            <Link to="/subscriptions" className="font-semibold text-primary hover:underline">
              View all →
            </Link>
          </div>
        </motion.div>

        {/* Metric 2: Pending Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl border border-border/60 bg-card/60 p-5 shadow-sm backdrop-blur-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Pending Priorities
            </span>
            <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
              <ListTodo className="size-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black">{pendingTasks.length}</p>
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span className="text-amber-400 font-semibold">{urgentTasks.length} urgent</span>
            <Link to="/tasks" className="font-semibold text-primary hover:underline">
              Task board →
            </Link>
          </div>
        </motion.div>

        {/* Metric 3: Habits Check-ins */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-border/60 bg-card/60 p-5 shadow-sm backdrop-blur-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Today's Habit Progress
            </span>
            <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <Target className="size-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black">
            {activeHabitsCheckedToday.length} / {habits.length}
          </p>
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {habits.length > 0
                ? `${Math.round((activeHabitsCheckedToday.length / habits.length) * 100)}% complete`
                : "No habits set"}
            </span>
            <Link to="/habits" className="font-semibold text-primary hover:underline">
              Habit grid →
            </Link>
          </div>
        </motion.div>

        {/* Metric 4: Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-border/60 bg-card/60 p-5 shadow-sm backdrop-blur-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Active Alerts
            </span>
            <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500">
              <Bell className="size-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black">{unreadNotifs.length}</p>
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>{notifications.length} total history</span>
            <Link to="/notifications" className="font-semibold text-primary hover:underline">
              Alert center →
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Main Grid Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left 2 Columns: Subscriptions & Tasks */}
        <div className="space-y-6 lg:col-span-2">
          {/* Upcoming Renewal Countdown */}
          <div className="rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold">Upcoming Subscriptions & Renewals</h3>
                <p className="text-xs text-muted-foreground">Services scheduled for auto-renewal soon</p>
              </div>
              <Link to="/subscriptions" className="text-xs font-semibold text-primary hover:underline">
                Manage Subscriptions
              </Link>
            </div>

            <div className="divide-y divide-border/40">
              {subscriptions.slice(0, 4).map((sub) => {
                const isOverBudget = sub.budget_limit && sub.cost > sub.budget_limit
                return (
                  <div key={sub.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary text-sm">
                        {sub.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{sub.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {sub.category} • {sub.payment_method}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">${sub.cost.toFixed(2)}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="size-3 text-amber-400" />
                        <span>Due {sub.next_renewal_date}</span>
                      </div>
                      {isOverBudget && (
                        <span className="mt-0.5 inline-block text-[10px] font-bold text-red-400">
                          Over Limit (${sub.budget_limit?.toFixed(2)})
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Urgent Tasks Checklist */}
          <div className="rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold">Pending Tasks & Priorities</h3>
                <p className="text-xs text-muted-foreground">Inline check off your top to-dos</p>
              </div>
              <CreateItemModal defaultType="task" triggerText="New Task" triggerVariant="outline" />
            </div>

            <div className="space-y-2.5">
              {tasks.slice(0, 4).map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between rounded-xl border border-border/50 bg-background/40 p-3.5 transition-colors hover:border-primary/40"
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleTaskCompleted(t.id)}
                      className={`flex size-5 items-center justify-center rounded-md border transition-all ${
                        t.status === "completed"
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : "border-border hover:border-primary"
                      }`}
                    >
                      {t.status === "completed" && <CheckCircle2 className="size-3.5" />}
                    </button>
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          t.status === "completed" ? "line-through text-muted-foreground" : ""
                        }`}
                      >
                        {t.title}
                      </p>
                      {t.due_date && (
                        <p className="text-xs text-muted-foreground">
                          Due {new Date(t.due_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      t.priority === "urgent"
                        ? "bg-red-500/15 text-red-400"
                        : t.priority === "high"
                        ? "bg-amber-500/15 text-amber-400"
                        : "bg-primary/15 text-primary"
                    }`}
                  >
                    {t.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Habit Streaks & Routines */}
        <div className="space-y-6">
          {/* Daily Habit Streaks */}
          <div className="rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold">Daily Habit Tracker</h3>
                <p className="text-xs text-muted-foreground">Click to log today's streak</p>
              </div>
              <Link to="/habits" className="text-xs font-semibold text-primary hover:underline">
                All habits →
              </Link>
            </div>

            <div className="space-y-3">
              {habits.map((h) => {
                const isChecked = habitLogs.some(
                  (hl) => hl.habit_id === h.id && hl.completed_date === todayStr
                )
                return (
                  <div
                    key={h.id}
                    className="flex items-center justify-between rounded-xl border border-border/50 p-3 bg-background/40"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="size-3 rounded-full"
                        style={{ backgroundColor: h.color || "#6366f1" }}
                      />
                      <div>
                        <p className="text-sm font-semibold">{h.title}</p>
                        <p className="text-xs text-muted-foreground">
                          🔥 {h.current_streak} day streak
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={isChecked ? "default" : "outline"}
                      className={isChecked ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}
                      onClick={() => toggleHabitLog(h.id, todayStr)}
                    >
                      {isChecked ? "Done ✓" : "Check-in"}
                    </Button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Daily Routine Checklists */}
          <div className="rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold">Today's Routines</h3>
                <p className="text-xs text-muted-foreground">Time-blocked daily checklist</p>
              </div>
              <Link to="/routines" className="text-xs font-semibold text-primary hover:underline">
                Routines →
              </Link>
            </div>

            <div className="space-y-4">
              {routines.slice(0, 2).map((rt) => (
                <div key={rt.id} className="space-y-2 border-b border-border/40 pb-3 last:border-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      {rt.time_of_day} • {rt.scheduled_time}
                    </span>
                    <span className="text-xs font-medium">{rt.title}</span>
                  </div>
                  {rt.steps?.map((step) => (
                    <div key={step.id} className="flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        checked={step.completed}
                        onChange={() => toggleRoutineStep(rt.id, step.id)}
                        className="rounded border-border"
                      />
                      <span className={step.completed ? "line-through text-muted-foreground" : ""}>
                        {step.title}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
