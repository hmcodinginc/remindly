import { useState } from "react"
import { motion } from "framer-motion"
import { Target, Flame, Calendar, Trash2, CheckCircle2, Award } from "lucide-react"
import { toast } from "sonner"
import { useDataStore } from "@/store/use-data-store"
import { CreateItemModal } from "@/components/modals/CreateItemModal"
import { Button } from "@/components/ui/button"

export function HabitsPage() {
  const habits = useDataStore((s) => s.habits)
  const habitLogs = useDataStore((s) => s.habitLogs)
  const toggleHabitLog = useDataStore((s) => s.toggleHabitLog)
  const deleteHabit = useDataStore((s) => s.deleteHabit)

  const todayStr = new Date().toISOString().split("T")[0]

  // Generate last 7 days
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().split("T")[0]
  })

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Delete habit "${title}"?`)) {
      await deleteHabit(id)
      toast.success("Habit deleted")
    }
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Habits & Consistency Tracker</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Build streaks and track daily consistency with visual logs.
          </p>
        </div>
        <CreateItemModal defaultType="habit" triggerText="New Habit" />
      </div>

      {/* Habits Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {habits.map((h) => {
          const isTodayDone = habitLogs.some((hl) => hl.habit_id === h.id && hl.completed_date === todayStr)

          return (
            <motion.div
              key={h.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm backdrop-blur-md space-y-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="size-4 rounded-full"
                    style={{ backgroundColor: h.color || "#6366f1" }}
                  />
                  <div>
                    <h3 className="font-bold text-lg">{h.title}</h3>
                    <p className="text-xs text-muted-foreground">{h.category} • {h.description}</p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-red-400 hover:bg-red-500/10"
                  onClick={() => handleDelete(h.id, h.title)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>

              {/* Streak Info */}
              <div className="grid grid-cols-2 gap-3 bg-background/50 p-3.5 rounded-xl border border-border/40">
                <div className="flex items-center gap-2">
                  <Flame className="size-5 text-amber-500" />
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Current Streak</p>
                    <p className="text-lg font-black">{h.current_streak} Days</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="size-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Longest Record</p>
                    <p className="text-lg font-black">{h.longest_streak} Days</p>
                  </div>
                </div>
              </div>

              {/* 7-Day History Calendar Grid */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Past 7 Days Check-ins
                </span>
                <div className="grid grid-cols-7 gap-2">
                  {last7Days.map((dStr) => {
                    const isDone = habitLogs.some((hl) => hl.habit_id === h.id && hl.completed_date === dStr)
                    const dayLabel = new Date(dStr).toLocaleDateString("en-US", { weekday: "short" })

                    return (
                      <button
                        key={dStr}
                        type="button"
                        onClick={() => toggleHabitLog(h.id, dStr)}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs transition-all ${
                          isDone
                            ? "border-emerald-500 bg-emerald-500/20 text-emerald-400 font-bold"
                            : "border-border/50 bg-background/40 hover:border-primary text-muted-foreground"
                        }`}
                      >
                        <span className="text-[10px] uppercase font-mono">{dayLabel}</span>
                        <span className="mt-1 text-xs">{isDone ? "✓" : "•"}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Button
                  className={`w-full ${isTodayDone ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}`}
                  variant={isTodayDone ? "default" : "outline"}
                  onClick={() => toggleHabitLog(h.id, todayStr)}
                >
                  {isTodayDone ? "Check-in Complete ✓" : "Log Check-in for Today"}
                </Button>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
