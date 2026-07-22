import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, Sun, Sunset, Moon, Clock, CheckSquare, Square, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useDataStore } from "@/store/use-data-store"
import { CreateItemModal } from "@/components/modals/CreateItemModal"
import { Button } from "@/components/ui/button"

export function RoutinesPage() {
  const routines = useDataStore((s) => s.routines)
  const toggleRoutineStep = useDataStore((s) => s.toggleRoutineStep)
  const deleteRoutine = useDataStore((s) => s.deleteRoutine)

  const getTimeIcon = (timeOfDay: string) => {
    switch (timeOfDay) {
      case "Morning":
        return <Sun className="size-5 text-amber-400" />
      case "Afternoon":
        return <Sun className="size-5 text-yellow-400" />
      case "Evening":
        return <Sunset className="size-5 text-orange-400" />
      case "Night":
        return <Moon className="size-5 text-indigo-400" />
      default:
        return <Sparkles className="size-5 text-primary" />
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Delete routine "${title}"?`)) {
      await deleteRoutine(id)
      toast.success("Routine deleted")
    }
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Time-Blocked Daily Routines</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Design structured morning, afternoon, evening, and night checklists.
          </p>
        </div>
        <CreateItemModal defaultType="routine" triggerText="New Routine" />
      </div>

      {/* Routines Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {routines.map((rt) => {
          const completedCount = rt.steps?.filter((s) => s.completed).length || 0
          const totalCount = rt.steps?.length || 0
          const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

          return (
            <motion.div
              key={rt.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm backdrop-blur-md space-y-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-muted/60">
                    {getTimeIcon(rt.time_of_day)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{rt.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {rt.time_of_day} • Target Time {rt.scheduled_time}
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-red-400 hover:bg-red-500/10"
                  onClick={() => handleDelete(rt.id, rt.title)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">Routine Progress</span>
                  <span className="text-primary">
                    {completedCount} / {totalCount} ({percent}%)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              {/* Checklist steps */}
              <div className="space-y-2.5 bg-background/50 p-4 rounded-xl border border-border/40">
                {rt.steps && rt.steps.length > 0 ? (
                  rt.steps.map((st) => (
                    <div key={st.id} className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => toggleRoutineStep(rt.id, st.id)}
                        className={`flex size-5 items-center justify-center rounded border transition-all ${
                          st.completed
                            ? "border-emerald-500 bg-emerald-500 text-white"
                            : "border-border hover:border-primary text-muted-foreground"
                        }`}
                      >
                        {st.completed ? <CheckSquare className="size-3.5" /> : <Square className="size-3.5" />}
                      </button>
                      <span
                        className={`text-sm ${
                          st.completed ? "line-through text-muted-foreground" : "font-medium"
                        }`}
                      >
                        {st.title}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground italic">No checklist steps added yet.</p>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
