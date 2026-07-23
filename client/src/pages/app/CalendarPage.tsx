import { useState } from "react"
import { motion } from "framer-motion"
import { CalendarDays, ChevronLeft, ChevronRight, Plus, CreditCard, ListTodo, Sparkles } from "lucide-react"
import { useDataStore } from "@/store/use-data-store"
import { CreateItemModal } from "@/components/modals/CreateItemModal"
import { Button } from "@/components/ui/button"

export function CalendarPage() {
  const subscriptions = useDataStore((s) => s.subscriptions)
  const tasks = useDataStore((s) => s.tasks)
  const routines = useDataStore((s) => s.routines)

  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month")

  // Month navigation helpers
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startDayOfWeek = firstDayOfMonth.getDay() // 0 = Sun

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))
  const todayMonth = () => setCurrentDate(new Date())

  // Generate calendar grid cells
  const calendarCells = []
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarCells.push(null)
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarCells.push(day)
  }

  // Get events for a specific date day number
  const getEventsForDay = (dayNum: number) => {
    const formattedDateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`

    const subsEvents = subscriptions
      .filter((s) => s.next_renewal_date === formattedDateStr)
      .map((s) => ({ id: s.id, title: `${s.name} ($${s.cost.toFixed(2)})`, type: "subscription" }))

    const taskEvents = tasks
      .filter((t) => t.due_date && t.due_date.startsWith(formattedDateStr))
      .map((t) => ({ id: t.id, title: t.title, type: "task", priority: t.priority }))

    return [...subsEvents, ...taskEvents]
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Unified Calendar</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Renewals, tasks, and routines mapped together in interactive views.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg border border-border p-1 bg-card">
            <button
              type="button"
              onClick={() => setViewMode("month")}
              className={`px-3 py-1 text-xs font-semibold rounded-md ${
                viewMode === "month" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              Month
            </button>
            <button
              type="button"
              onClick={() => setViewMode("week")}
              className={`px-3 py-1 text-xs font-semibold rounded-md ${
                viewMode === "week" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              Week
            </button>
            <button
              type="button"
              onClick={() => setViewMode("day")}
              className={`px-3 py-1 text-xs font-semibold rounded-md ${
                viewMode === "day" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              Day
            </button>
          </div>
          <CreateItemModal triggerText="Add Event" />
        </div>
      </div>

      {/* Month Header Controller */}
      <div className="flex items-center justify-between bg-card/60 p-4 rounded-2xl border border-border/50">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold">
            {monthNames[month]} {year}
          </h2>
          <Button variant="outline" size="sm" onClick={todayMonth}>
            Today
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={prevMonth}>
            <ChevronLeft className="size-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={nextMonth}>
            <ChevronRight className="size-5" />
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="size-3 rounded bg-amber-500" />
          <span>Subscription Renewals</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-3 rounded bg-primary" />
          <span>Priority Tasks</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="size-3 rounded bg-indigo-500" />
          <span>Daily Routines</span>
        </div>
      </div>

      {/* Calendar Grid (Month View) */}
      {viewMode === "month" ? (
        <div className="rounded-2xl border border-border/60 bg-card/60 overflow-hidden shadow-sm">
          {/* Day Names Bar */}
          <div className="grid grid-cols-7 border-b border-border/50 bg-muted/30 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground py-3">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Grid Cells */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-border/40 min-h-[500px]">
            {calendarCells.map((dayNum, idx) => {
              if (dayNum === null) {
                return <div key={`empty-${idx}`} className="bg-muted/10 p-2 min-h-[90px]" />
              }

              const events = getEventsForDay(dayNum)
              const isToday =
                dayNum === new Date().getDate() &&
                month === new Date().getMonth() &&
                year === new Date().getFullYear()

              return (
                <div
                  key={`day-${dayNum}`}
                  className={`p-2 min-h-[100px] transition-colors hover:bg-muted/30 flex flex-col justify-between ${
                    isToday ? "bg-primary/5 font-bold" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex size-6 items-center justify-center rounded-full text-xs font-semibold ${
                        isToday ? "bg-primary text-primary-foreground" : "text-foreground"
                      }`}
                    >
                      {dayNum}
                    </span>
                  </div>

                  <div className="mt-1.5 space-y-1 overflow-hidden">
                    {events.map((ev, eIdx) => (
                      <div
                        key={eIdx}
                        className={`truncate rounded px-1.5 py-0.5 text-[10px] font-semibold text-white ${
                          ev.type === "subscription"
                            ? "bg-amber-500"
                            : ev.priority === "urgent"
                            ? "bg-red-500"
                            : "bg-primary"
                        }`}
                        title={ev.title}
                      >
                        {ev.title}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        /* Week/Day View Detailed List */
        <div className="rounded-2xl border border-border/60 bg-card/60 p-6 space-y-4">
          <h3 className="font-bold text-lg">Scheduled Events Overview</h3>
          <div className="space-y-3">
            {subscriptions.map((s) => (
              <div key={s.id} className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-background/40">
                <div className="flex items-center gap-3">
                  <CreditCard className="size-4 text-amber-500" />
                  <div>
                    <p className="font-semibold text-sm">{s.name} Renewal</p>
                    <p className="text-xs text-muted-foreground">Renewal Date: {s.next_renewal_date}</p>
                  </div>
                </div>
                <span className="font-bold text-sm">${s.cost.toFixed(2)}</span>
              </div>
            ))}

            {tasks.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-background/40">
                <div className="flex items-center gap-3">
                  <ListTodo className="size-4 text-primary" />
                  <div>
                    <p className="font-semibold text-sm">{t.title}</p>
                    <p className="text-xs text-muted-foreground">Due: {t.due_date ? new Date(t.due_date).toLocaleDateString() : 'No date'}</p>
                  </div>
                </div>
                <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-primary/10 text-primary">
                  {t.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
