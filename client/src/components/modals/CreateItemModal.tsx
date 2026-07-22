import { useState } from 'react'
import { Plus, CreditCard, ListTodo, Target, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useDataStore } from '@/store/use-data-store'
import { useAuthStore } from '@/store/use-auth-store'

export function CreateItemModal({
  defaultType = 'subscription',
  triggerText = 'Add Item',
  triggerVariant = 'default',
}: {
  defaultType?: 'subscription' | 'task' | 'habit' | 'routine'
  triggerText?: string
  triggerVariant?: 'default' | 'outline' | 'ghost' | 'secondary'
}) {
  const [open, setOpen] = useState(false)
  const [type, setType] = useState(defaultType)
  const user = useAuthStore((s) => s.user)
  const userId = user?.id || 'demo-user-123'

  // Subscriptions form
  const [subName, setSubName] = useState('')
  const [subProvider, setSubProvider] = useState('')
  const [subCost, setSubCost] = useState('14.99')
  const [subCycle, setSubCycle] = useState<'monthly' | 'yearly' | 'weekly'>('monthly')
  const [subCategory, setSubCategory] = useState('Software')
  const [subPayment, setSubPayment] = useState('Credit Card')
  const [subRenewal, setSubRenewal] = useState(new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0])
  const [subBudget, setSubBudget] = useState('30')

  // Task form
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDesc, setTaskDesc] = useState('')
  const [taskPriority, setTaskPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium')
  const [taskCategory, setTaskCategory] = useState('General')
  const [taskDueDate, setTaskDueDate] = useState(new Date(Date.now() + 86400000).toISOString().split('T')[0])

  // Habit form
  const [habitTitle, setHabitTitle] = useState('')
  const [habitDesc, setHabitDesc] = useState('')
  const [habitColor, setHabitColor] = useState('#6366f1')
  const [habitCategory, setHabitCategory] = useState('Health')

  // Routine form
  const [routineTitle, setRoutineTitle] = useState('')
  const [routineTimeOfDay, setRoutineTimeOfDay] = useState<'Morning' | 'Afternoon' | 'Evening' | 'Night'>('Morning')
  const [routineTime, setRoutineTime] = useState('08:00')
  const [routineStepsRaw, setRoutineStepsRaw] = useState('Drink lemon water\nMeditate 10 mins\nReview top priorities')

  const addSubscription = useDataStore((s) => s.addSubscription)
  const addTask = useDataStore((s) => s.addTask)
  const addHabit = useDataStore((s) => s.addHabit)
  const addRoutine = useDataStore((s) => s.addRoutine)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (type === 'subscription') {
        if (!subName.trim()) return toast.error('Subscription name required')
        await addSubscription({
          user_id: userId,
          name: subName,
          provider: subProvider || subName,
          cost: parseFloat(subCost) || 0,
          currency: 'USD',
          billing_cycle: subCycle,
          category: subCategory,
          payment_method: subPayment,
          next_renewal_date: subRenewal,
          status: 'active',
          auto_renew: true,
          budget_limit: parseFloat(subBudget) || null,
          notes: '',
        })
        toast.success(`Subscription "${subName}" added!`)
      } else if (type === 'task') {
        if (!taskTitle.trim()) return toast.error('Task title required')
        await addTask({
          user_id: userId,
          title: taskTitle,
          description: taskDesc,
          due_date: new Date(taskDueDate).toISOString(),
          priority: taskPriority,
          status: 'pending',
          category: taskCategory,
          subtasks: [],
        })
        toast.success(`Task "${taskTitle}" created!`)
      } else if (type === 'habit') {
        if (!habitTitle.trim()) return toast.error('Habit title required')
        await addHabit({
          user_id: userId,
          title: habitTitle,
          description: habitDesc,
          frequency: 'daily',
          target_days: 7,
          color: habitColor,
          category: habitCategory,
        })
        toast.success(`Habit "${habitTitle}" created!`)
      } else if (type === 'routine') {
        if (!routineTitle.trim()) return toast.error('Routine title required')
        const steps = routineStepsRaw.split('\n').filter((s) => s.trim().length > 0)
        await addRoutine({
          title: routineTitle,
          time_of_day: routineTimeOfDay,
          scheduled_time: routineTime,
          steps,
        })
        toast.success(`Routine "${routineTitle}" created!`)
      }

      setOpen(false)
    } catch (err) {
      toast.error('Failed to create item')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant={triggerVariant} className="gap-2">
            <Plus className="size-4" />
            <span>{triggerText}</span>
          </Button>
        }
      />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add New Entry</DialogTitle>
        </DialogHeader>

        {/* Type Selector */}
        <div className="grid grid-cols-4 gap-2 pt-2">
          <button
            type="button"
            onClick={() => setType('subscription')}
            className={`flex flex-col items-center gap-1.5 rounded-xl border p-2.5 text-xs font-medium transition-all ${
              type === 'subscription'
                ? 'border-primary bg-primary/10 text-primary font-semibold'
                : 'border-border/60 hover:bg-muted/50 text-muted-foreground'
            }`}
          >
            <CreditCard className="size-4" />
            <span>Subscription</span>
          </button>
          <button
            type="button"
            onClick={() => setType('task')}
            className={`flex flex-col items-center gap-1.5 rounded-xl border p-2.5 text-xs font-medium transition-all ${
              type === 'task'
                ? 'border-primary bg-primary/10 text-primary font-semibold'
                : 'border-border/60 hover:bg-muted/50 text-muted-foreground'
            }`}
          >
            <ListTodo className="size-4" />
            <span>Task</span>
          </button>
          <button
            type="button"
            onClick={() => setType('habit')}
            className={`flex flex-col items-center gap-1.5 rounded-xl border p-2.5 text-xs font-medium transition-all ${
              type === 'habit'
                ? 'border-primary bg-primary/10 text-primary font-semibold'
                : 'border-border/60 hover:bg-muted/50 text-muted-foreground'
            }`}
          >
            <Target className="size-4" />
            <span>Habit</span>
          </button>
          <button
            type="button"
            onClick={() => setType('routine')}
            className={`flex flex-col items-center gap-1.5 rounded-xl border p-2.5 text-xs font-medium transition-all ${
              type === 'routine'
                ? 'border-primary bg-primary/10 text-primary font-semibold'
                : 'border-border/60 hover:bg-muted/50 text-muted-foreground'
            }`}
          >
            <Sparkles className="size-4" />
            <span>Routine</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {type === 'subscription' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Service Name</Label>
                  <Input placeholder="e.g. Netflix, Figma" value={subName} onChange={(e) => setSubName(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label>Provider</Label>
                  <Input placeholder="e.g. Figma Inc." value={subProvider} onChange={(e) => setSubProvider(e.target.value)} />
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
                  <Input value={subCategory} onChange={(e) => setSubCategory(e.target.value)} placeholder="Software, Cloud, Entertainment" />
                </div>
              </div>
            </>
          )}

          {type === 'task' && (
            <>
              <div className="space-y-1.5">
                <Label>Task Title</Label>
                <Input placeholder="e.g. Cancel unused SaaS trial" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Input placeholder="Brief task details..." value={taskDesc} onChange={(e) => setTaskDesc(e.target.value)} />
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
                  <Input type="date" value={taskDueDate} onChange={(e) => setTaskDueDate(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label>Category</Label>
                  <Input value={taskCategory} onChange={(e) => setTaskCategory(e.target.value)} placeholder="Finance, Dev" />
                </div>
              </div>
            </>
          )}

          {type === 'habit' && (
            <>
              <div className="space-y-1.5">
                <Label>Habit Name</Label>
                <Input placeholder="e.g. Morning Mindfulness" value={habitTitle} onChange={(e) => setHabitTitle(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Input placeholder="15 mins daily..." value={habitDesc} onChange={(e) => setHabitDesc(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Badge Color</Label>
                  <Input type="color" value={habitColor} onChange={(e) => setHabitColor(e.target.value)} className="h-10" />
                </div>
                <div className="space-y-1.5">
                  <Label>Category</Label>
                  <Input value={habitCategory} onChange={(e) => setHabitCategory(e.target.value)} placeholder="Health, Mindset" />
                </div>
              </div>
            </>
          )}

          {type === 'routine' && (
            <>
              <div className="space-y-1.5">
                <Label>Routine Name</Label>
                <Input placeholder="e.g. Morning Protocol" value={routineTitle} onChange={(e) => setRoutineTitle(e.target.value)} required />
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
              <div className="space-y-1.5">
                <Label>Checklist Steps (one per line)</Label>
                <textarea
                  className="w-full rounded-md border border-input bg-background p-3 text-sm min-h-[90px]"
                  value={routineStepsRaw}
                  onChange={(e) => setRoutineStepsRaw(e.target.value)}
                  placeholder="Step 1&#10;Step 2&#10;Step 3"
                />
              </div>
            </>
          )}

          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Entry</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
