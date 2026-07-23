import { useState } from "react"
import { motion } from "framer-motion"
import { ListTodo, CheckCircle2, Circle, Clock, Trash2, Plus, LayoutGrid, List } from "lucide-react"
import { toast } from "sonner"
import { useDataStore } from "@/store/use-data-store"
import { CreateItemModal } from "@/components/modals/CreateItemModal"
import { Button } from "@/components/ui/button"

export function TasksPage() {
  const tasks = useDataStore((s) => s.tasks)
  const toggleTaskCompleted = useDataStore((s) => s.toggleTaskCompleted)
  const toggleSubtask = useDataStore((s) => s.toggleSubtask)
  const deleteTask = useDataStore((s) => s.deleteTask)

  const [filterPriority, setFilterPriority] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"list" | "board">("list")

  const filteredTasks = tasks.filter((t) => {
    const matchesPriority = filterPriority === "all" || t.priority === filterPriority
    const matchesStatus = filterStatus === "all" || t.status === filterStatus
    return matchesPriority && matchesStatus
  })

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Delete task "${title}"?`)) {
      await deleteTask(id)
      toast.success("Task deleted")
    }
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Tasks & Priorities</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Organize work, recurring action items, and renewal follow-ups.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg border border-border p-1 bg-card">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md ${viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
              title="List View"
            >
              <List className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("board")}
              className={`p-1.5 rounded-md ${viewMode === "board" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
              title="Board View"
            >
              <LayoutGrid className="size-4" />
            </button>
          </div>
          <CreateItemModal defaultType="task" triggerText="New Task" />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-card/40 p-4 rounded-2xl border border-border/50">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Filter By:</span>

        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-semibold"
        >
          <option value="all">All Priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-semibold"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <span className="ml-auto text-xs text-muted-foreground font-medium">
          Showing {filteredTasks.length} tasks
        </span>
      </div>

      {/* Task Content */}
      {viewMode === "list" ? (
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="py-16 text-center rounded-2xl border border-dashed border-border/60 bg-card/20">
              <ListTodo className="mx-auto size-10 text-muted-foreground/50 mb-3" />
              <h3 className="text-lg font-bold">No tasks matching criteria</h3>
              <p className="mt-1 text-sm text-muted-foreground">Create a new task to get started.</p>
            </div>
          ) : (
            filteredTasks.map((t) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/60 p-4 shadow-sm backdrop-blur-md sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3.5">
                  <button
                    type="button"
                    onClick={() => toggleTaskCompleted(t.id)}
                    className={`mt-0.5 flex size-6 flex-shrink-0 items-center justify-center rounded-lg border transition-all ${
                      t.status === "completed"
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-border hover:border-primary"
                    }`}
                  >
                    {t.status === "completed" ? <CheckCircle2 className="size-4" /> : <Circle className="size-4 text-muted-foreground" />}
                  </button>
                  <div className="space-y-1">
                    <h3 className={`font-semibold text-base ${t.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
                      {t.title}
                    </h3>
                    {t.description && <p className="text-xs text-muted-foreground">{t.description}</p>}

                    {/* Subtasks */}
                    {t.subtasks && t.subtasks.length > 0 && (
                      <div className="mt-2 space-y-1 pl-1">
                        {t.subtasks.map((st) => (
                          <div key={st.id} className="flex items-center gap-2 text-xs">
                            <input
                              type="checkbox"
                              checked={st.completed}
                              onChange={() => toggleSubtask(t.id, st.id)}
                              className="rounded border-border"
                            />
                            <span className={st.completed ? "line-through text-muted-foreground" : ""}>{st.title}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  {t.due_date && (
                    <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                      <Clock className="size-3.5 text-amber-400" />
                      <span>{new Date(t.due_date).toLocaleDateString()}</span>
                    </div>
                  )}

                  <span
                    className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                      t.priority === "urgent"
                        ? "bg-red-500/15 text-red-400"
                        : t.priority === "high"
                        ? "bg-amber-500/15 text-amber-400"
                        : "bg-primary/15 text-primary"
                    }`}
                  >
                    {t.priority}
                  </span>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-red-400 hover:bg-red-500/10"
                    onClick={() => handleDelete(t.id, t.title)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      ) : (
        /* Board View */
        <div className="grid gap-6 md:grid-cols-3">
          {["pending", "in_progress", "completed"].map((statusKey) => {
            const columnTasks = filteredTasks.filter((t) => t.status === statusKey)
            return (
              <div key={statusKey} className="rounded-2xl border border-border/60 bg-card/40 p-4 min-h-[350px]">
                <div className="flex items-center justify-between mb-4 border-b border-border/50 pb-2">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
                    {statusKey.replace("_", " ")} ({columnTasks.length})
                  </h3>
                </div>
                <div className="space-y-3">
                  {columnTasks.map((t) => (
                    <div key={t.id} className="rounded-xl border border-border/60 bg-background/60 p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-sm">{t.title}</span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-primary/10 text-primary">
                          {t.priority}
                        </span>
                      </div>
                      {t.description && <p className="text-xs text-muted-foreground">{t.description}</p>}
                      <div className="pt-2 flex items-center justify-between border-t border-border/30 text-xs">
                        <button
                          type="button"
                          onClick={() => toggleTaskCompleted(t.id)}
                          className="text-primary font-semibold hover:underline"
                        >
                          {t.status === "completed" ? "Mark Pending" : "Mark Complete"}
                        </button>
                        <Button variant="ghost" size="icon" className="size-6 text-red-400" onClick={() => handleDelete(t.id, t.title)}>
                          <Trash2 className="size-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
