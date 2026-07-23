import { motion } from "framer-motion"
import { LineChart, PieChart, TrendingUp, DollarSign, Target, CheckCircle2 } from "lucide-react"
import { useDataStore } from "@/store/use-data-store"

export function AnalyticsPage() {
  const subscriptions = useDataStore((s) => s.subscriptions)
  const tasks = useDataStore((s) => s.tasks)
  const habits = useDataStore((s) => s.habits)
  const habitLogs = useDataStore((s) => s.habitLogs)

  // Category spending breakdown
  const categoryTotals: Record<string, number> = {}
  subscriptions.forEach((sub) => {
    if (sub.status !== "active") return
    const cost = sub.billing_cycle === "monthly" ? sub.cost : sub.billing_cycle === "yearly" ? sub.cost / 12 : sub.cost * 4.33
    categoryTotals[sub.category] = (categoryTotals[sub.category] || 0) + cost
  })

  const totalSpend = Object.values(categoryTotals).reduce((a, b) => a + b, 0)

  // Completion metrics
  const completedTasksCount = tasks.filter((t) => t.status === "completed").length
  const taskCompletionRate = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Analytics & Expenditure</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Visual metrics for subscription budgets, habit streaks, and task completions.
        </p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border/60 bg-card/60 p-5 shadow-sm backdrop-blur-md">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Total Monthly Spend
          </span>
          <p className="mt-2 text-3xl font-black">${totalSpend.toFixed(2)}</p>
          <p className="mt-1 text-xs text-muted-foreground">Across {subscriptions.length} recurring services</p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/60 p-5 shadow-sm backdrop-blur-md">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Task Completion Rate
          </span>
          <p className="mt-2 text-3xl font-black text-emerald-500">{taskCompletionRate}%</p>
          <p className="mt-1 text-xs text-muted-foreground">{completedTasksCount} of {tasks.length} tasks completed</p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/60 p-5 shadow-sm backdrop-blur-md">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Total Habit Logs
          </span>
          <p className="mt-2 text-3xl font-black text-primary">{habitLogs.length}</p>
          <p className="mt-1 text-xs text-muted-foreground">Recorded check-in instances</p>
        </div>
      </div>

      {/* Category Breakdown Progress */}
      <div className="rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm backdrop-blur-md space-y-6">
        <div>
          <h3 className="text-lg font-bold">Category Spending Breakdown</h3>
          <p className="text-xs text-muted-foreground">Distribution of your monthly subscription expenses</p>
        </div>

        <div className="space-y-4">
          {Object.entries(categoryTotals).map(([catName, amount]) => {
            const pct = totalSpend > 0 ? Math.round((amount / totalSpend) * 100) : 0
            return (
              <div key={catName} className="space-y-1.5">
                <div className="flex justify-between text-sm font-semibold">
                  <span>{catName}</span>
                  <span className="text-primary">${amount.toFixed(2)} ({pct}%)</span>
                </div>
                <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
