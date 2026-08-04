import { useState } from "react"
import { motion } from "framer-motion"
import { Sparkles, Sun, Sunset, Moon, Clock, CheckSquare, Square, Trash2, Edit2, Search } from "lucide-react"
import { toast } from "sonner"
import { useDataStore } from "@/store/use-data-store"
import { CreateItemModal } from "@/components/modals/CreateItemModal"
import { EditItemModal } from "@/components/modals/EditItemModal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Routine } from "@/lib/pocketbase/types"

export function RoutinesPage() {
  const routines = useDataStore((s) => s.routines)
  const toggleRoutineStep = useDataStore((s) => s.toggleRoutineStep)
  const deleteRoutine = useDataStore((s) => s.deleteRoutine)

  const [search, setSearch] = useState("")
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null)
  const [editModalOpen, setEditModalOpen] = useState(false)

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

  const handleEditClick = (routine: Routine) => {
    setEditingRoutine(routine)
    setEditModalOpen(true)
  }

  const filteredRoutines = routines.filter((rt) => {
    return rt.title.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <div className="space-y-6 pb-10">
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

      {/* Prominent Search Bar at the Top */}
      <div className="relative max-w-md bg-card/40 p-4 rounded-2xl border border-border/50">
        <Search className="absolute left-7 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search routines by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-background"
        />
      </div>

      {/* Routines Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredRoutines.length === 0 ? (
          <div className="col-span-full py-16 text-center rounded-2xl border border-dashed border-border/60 bg-card/20">
            <Sparkles className="mx-auto size-10 text-muted-foreground/50 mb-3" />
            <h3 className="text-lg font-bold">No routines found</h3>
            <p className="mt-1 text-sm text-muted-foreground">Create a new daily routine checklist.</p>
          </div>
        ) : (
          filteredRoutines.map((rt) => {
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

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                      onClick={() => handleEditClick(rt)}
                      title="Edit Routine"
                    >
                      <Edit2 className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-red-400 hover:bg-red-500/10"
                      onClick={() => handleDelete(rt.id, rt.title)}
                      title="Delete Routine"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
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
                          className={`flex size-5 items-center justify-center rounded border transition-all cursor-pointer ${
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
          })
        )}
      </div>

      {/* Edit Routine Modal */}
      <EditItemModal
        type="routine"
        item={editingRoutine}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
      />
    </div>
  )
}
