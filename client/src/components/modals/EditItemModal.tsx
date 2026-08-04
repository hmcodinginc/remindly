import { useState, useEffect } from 'react'
import { Edit2, CreditCard, ListTodo, Target, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useDataStore } from '@/store/use-data-store'
import type { Subscription, TaskItem, Habit, Routine } from '@/lib/pocketbase/types'

type EditItemModalProps = {
  type: 'subscription' | 'task' | 'habit' | 'routine'
  item: Subscription | TaskItem | Habit | Routine | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditItemModal({ type, item, open, onOpenChange }: EditItemModalProps) {
  const updateSubscription = useDataStore((s) => s.updateSubscription)
  const updateTask = useDataStore((s) => s.updateTask)
  const updateHabit = useDataStore((s) => s.updateHabit)
  const updateRoutine = useDataStore((s) => s.updateRoutine)

  // Subscription state
  const [subName, setSubName] = useState('')
  const [subProvider, setSubProvider] = useState('')
  const [subCost, setSubCost] = useState('')
  const [subCycle, setSubCycle] = useState<'monthly' | 'yearly' | 'weekly'>('monthly')
  const [subCategory, setSubCategory] = useState('')
  const [subPayment, setSubPayment] = useState('')
  const [subRenewal, setSubRenewal] = useState('')
  const [subBudget, setSubBudget] = useState('')
  const [subNotes, setSubNotes] = useState('')

  // Task state
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDesc, setTaskDesc] = useState('')
  const [taskPriority, setTaskPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium')
  const [taskCategory, setTaskCategory] = useState('')
  const [taskDueDate, setTaskDueDate] = useState('')

  // Habit state
  const [habitTitle, setHabitTitle] = useState('')
  const [habitDesc, setHabitDesc] = useState('')
  const [habitColor, setHabitColor] = useState('#6366f1')
  const [habitCategory, setHabitCategory] = useState('')

  // Routine state
  const [routineTitle, setRoutineTitle] = useState('')
  const [routineTimeOfDay, setRoutineTimeOfDay] = useState<'Morning' | 'Afternoon' | 'Evening' | 'Night'>('Morning')
  const [routineTime, setRoutineTime] = useState('')

  useEffect(() => {
    if (!item) return
    if (type === 'subscription') {
      const sub = item as Subscription
      setSubName(sub.name || '')
      setSubProvider(sub.provider || '')
      setSubCost(sub.cost?.toString() || '0')
      setSubCycle(sub.billing_cycle || 'monthly')
      setSubCategory(sub.category || '')
      setSubPayment(sub.payment_method || '')
      setSubRenewal(sub.next_renewal_date || '')
      setSubBudget(sub.budget_limit?.toString() || '')
      setSubNotes(sub.notes || '')
    } else if (type === 'task') {
      const t = item as TaskItem
      setTaskTitle(t.title || '')
      setTaskDesc(t.description || '')
      setTaskPriority(t.priority || 'medium')
      setTaskCategory(t.category || '')
      setTaskDueDate(t.due_date ? new Date(t.due_date).toISOString().split('T')[0] : '')
    } else if (type === 'habit') {
      const h = item as Habit
      setHabitTitle(h.title || '')
      setHabitDesc(h.description || '')
      setHabitColor(h.color || '#6366f1')
      setHabitCategory(h.category || '')
    } else if (type === 'routine') {
      const r = item as Routine
      setRoutineTitle(r.title || '')
      setRoutineTimeOfDay(r.time_of_day || 'Morning')
      setRoutineTime(r.scheduled_time || '')
    }
  }, [item, type, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!item) return

    try {
      if (type === 'subscription') {
        if (!subName.trim()) return toast.error('Subscription name required')
        await updateSubscription(item.id, {
          name: subName,
          provider: subProvider,
          cost: parseFloat(subCost) || 0,
          billing_cycle: subCycle,
          category: subCategory,
          payment_method: subPayment,
          next_renewal_date: subRenewal,
          budget_limit: subBudget ? parseFloat(subBudget) : null,
          notes: subNotes,
        })
        toast.success(`Subscription "${subName}" updated!`)
      } else if (type === 'task') {
        if (!taskTitle.trim()) return toast.error('Task title required')
        await updateTask(item.id, {
          title: taskTitle,
          description: taskDesc,
          priority: taskPriority,
          category: taskCategory,
          due_date: taskDueDate ? new Date(taskDueDate).toISOString() : null,
        })
        toast.success(`Task "${taskTitle}" updated!`)
      } else if (type === 'habit') {
        if (!habitTitle.trim()) return toast.error('Habit title required')
        await updateHabit(item.id, {
          title: habitTitle,
          description: habitDesc,
          color: habitColor,
          category: habitCategory,
        })
        toast.success(`Habit "${habitTitle}" updated!`)
      } else if (type === 'routine') {
        if (!routineTitle.trim()) return toast.error('Routine title required')
        await updateRoutine(item.id, {
          title: routineTitle,
          time_of_day: routineTimeOfDay,
          scheduled_time: routineTime,
        })
        toast.success(`Routine "${routineTitle}" updated!`)
      }

      onOpenChange(false)
    } catch (err) {
      toast.error('Failed to update item')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Edit2 className="size-5 text-primary" />
            <span>Edit {type.charAt(0).toUpperCase() + type.slice(1)}</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {type === 'subscription' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Service Name</Label>
                  <Input value={subName} onChange={(e) => setSubName(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label>Provider</Label>
                  <Input value={subProvider} onChange={(e) => setSubProvider(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label>Cost ($)</Label>
                  <Input type="number" step="0.01" value={subCost} onChange={(e) => setSubCost(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label>Billing Cycle</Label>
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={subCycle}
                    onChange={(e: any) => setSubCycle(e.target.value)}
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label>Budget Limit ($)</Label>
                  <Input type="number" step="0.01" value={subBudget} onChange={(e) => setSubBudget(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Next Renewal Date</Label>
                  <Input type="date" value={subRenewal} onChange={(e) => setSubRenewal(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label>Category</Label>
                  <Input value={subCategory} onChange={(e) => setSubCategory(e.target.value)} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Payment Method</Label>
                <Input value={subPayment} onChange={(e) => setSubPayment(e.target.value)} />
              </div>

              <div className="space-y-1.5">
                <Label>Notes</Label>
                <Input value={subNotes} onChange={(e) => setSubNotes(e.target.value)} placeholder="Additional notes..." />
              </div>
            </>
          )}

          {type === 'task' && (
            <>
              <div className="space-y-1.5">
                <Label>Task Title</Label>
                <Input value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Input value={taskDesc} onChange={(e) => setTaskDesc(e.target.value)} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label>Priority</Label>
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={taskPriority}
                    onChange={(e: any) => setTaskPriority(e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label>Due Date</Label>
                  <Input type="date" value={taskDueDate} onChange={(e) => setTaskDueDate(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Category</Label>
                  <Input value={taskCategory} onChange={(e) => setTaskCategory(e.target.value)} />
                </div>
              </div>
            </>
          )}

          {type === 'habit' && (
            <>
              <div className="space-y-1.5">
                <Label>Habit Name</Label>
                <Input value={habitTitle} onChange={(e) => setHabitTitle(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Input value={habitDesc} onChange={(e) => setHabitDesc(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Badge Color</Label>
                  <Input type="color" value={habitColor} onChange={(e) => setHabitColor(e.target.value)} className="h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label>Category</Label>
                  <Input value={habitCategory} onChange={(e) => setHabitCategory(e.target.value)} />
                </div>
              </div>
            </>
          )}

          {type === 'routine' && (
            <>
              <div className="space-y-1.5">
                <Label>Routine Name</Label>
                <Input value={routineTitle} onChange={(e) => setRoutineTitle(e.target.value)} required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Time of Day</Label>
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={routineTimeOfDay}
                    onChange={(e: any) => setRoutineTimeOfDay(e.target.value)}
                  >
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                    <option value="Night">Night</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label>Target Time</Label>
                  <Input type="time" value={routineTime} onChange={(e) => setRoutineTime(e.target.value)} />
                </div>
              </div>
            </>
          )}

          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Update Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
