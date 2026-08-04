import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { pb, isPocketBaseConfigured } from '@/lib/pocketbase/client'
import { useAuthStore } from './use-auth-store'
import type {
  Subscription,
  TaskItem,
  Habit,
  HabitLog,
  Routine,
  RoutineStep,
  NotificationItem,
  UserSettings,
  NotificationStatus,
} from '@/lib/pocketbase/types'

const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub-1',
    user_id: 'demo-user-123',
    name: 'Netflix Premium',
    provider: 'Netflix Inc.',
    cost: 22.99,
    currency: 'USD',
    billing_cycle: 'monthly',
    category: 'Entertainment',
    payment_method: 'Apple Pay (***4821)',
    next_renewal_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'active',
    auto_renew: true,
    budget_limit: 30,
    notes: 'Shared with family account',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'sub-2',
    user_id: 'demo-user-123',
    name: 'GitHub Copilot & Pro',
    provider: 'GitHub Inc.',
    cost: 10.00,
    currency: 'USD',
    billing_cycle: 'monthly',
    category: 'Software & Cloud',
    payment_method: 'Visa (***9012)',
    next_renewal_date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'active',
    auto_renew: true,
    budget_limit: 15,
    notes: 'Developer tools',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'sub-3',
    user_id: 'demo-user-123',
    name: 'Spotify Family',
    provider: 'Spotify AB',
    cost: 16.99,
    currency: 'USD',
    billing_cycle: 'monthly',
    category: 'Entertainment',
    payment_method: 'MasterCard (***3310)',
    next_renewal_date: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'active',
    auto_renew: true,
    budget_limit: 20,
    notes: 'High fidelity audio tier',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'sub-4',
    user_id: 'demo-user-123',
    name: 'AWS Cloud Infrastructure',
    provider: 'Amazon Web Services',
    cost: 145.50,
    currency: 'USD',
    billing_cycle: 'monthly',
    category: 'Software & Cloud',
    payment_method: 'Corporate AMEX (***1004)',
    next_renewal_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'active',
    auto_renew: true,
    budget_limit: 120.00,
    notes: 'Production server hosting & RDS database',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'task-1',
    user_id: 'demo-user-123',
    title: 'Audit AWS billing & cancel unused EC2 instance',
    description: 'Review monthly cloud expenditure before renewal tomorrow.',
    due_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'urgent',
    status: 'pending',
    category: 'Finance',
    subtasks: [
      { id: 'st-1', title: 'Export AWS Cost Explorer CSV', completed: true },
      { id: 'st-2', title: 'Terminate dev server t3.xlarge', completed: false },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'task-2',
    user_id: 'demo-user-123',
    title: 'Review quarterly subscription software budgets',
    description: 'Compare SaaS expenses against monthly $500 target.',
    due_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'high',
    status: 'pending',
    category: 'Planning',
    subtasks: [
      { id: 'st-3', title: 'Check Adobe Creative Cloud renewal', completed: false },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'task-3',
    user_id: 'demo-user-123',
    title: 'Set up automated Web Push notifications for Remindly',
    description: 'Ensure desktop and mobile push sound triggers fire on schedule.',
    due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'medium',
    status: 'in_progress',
    category: 'Development',
    subtasks: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

const INITIAL_HABITS: Habit[] = [
  {
    id: 'habit-1',
    user_id: 'demo-user-123',
    title: 'Morning Focus & Meditation',
    description: '15 minutes of quiet breathwork before checking email.',
    frequency: 'daily',
    target_days: 7,
    color: '#6366f1',
    category: 'Mindfulness',
    current_streak: 12,
    longest_streak: 21,
    created_at: new Date().toISOString(),
  },
  {
    id: 'habit-2',
    user_id: 'demo-user-123',
    title: 'Review Daily Subscriptions & Expenses',
    description: 'Check bank statement for unexpected recurring charges.',
    frequency: 'daily',
    target_days: 7,
    color: '#10b981',
    category: 'Finance',
    current_streak: 5,
    longest_streak: 14,
    created_at: new Date().toISOString(),
  },
  {
    id: 'habit-3',
    user_id: 'demo-user-123',
    title: 'Hydration (2.5 Liters Daily)',
    description: 'Track daily water intake throughout work routines.',
    frequency: 'daily',
    target_days: 7,
    color: '#3b82f6',
    category: 'Health',
    current_streak: 8,
    longest_streak: 18,
    created_at: new Date().toISOString(),
  },
]

const INITIAL_HABIT_LOGS: HabitLog[] = [
  {
    id: 'hl-1',
    habit_id: 'habit-1',
    user_id: 'demo-user-123',
    completed_date: new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString(),
  },
  {
    id: 'hl-2',
    habit_id: 'habit-2',
    user_id: 'demo-user-123',
    completed_date: new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString(),
  },
]

const INITIAL_ROUTINES: Routine[] = [
  {
    id: 'rt-1',
    user_id: 'demo-user-123',
    title: 'Morning Momentum Protocol',
    time_of_day: 'Morning',
    scheduled_time: '07:30',
    is_active: true,
    steps: [
      { id: 'rts-1', routine_id: 'rt-1', user_id: 'demo-user-123', title: 'Hydrate with lemon water & vitamins', completed: true, step_order: 1, created_at: new Date().toISOString() },
      { id: 'rts-2', routine_id: 'rt-1', user_id: 'demo-user-123', title: '15-min mindfulness focus session', completed: true, step_order: 2, created_at: new Date().toISOString() },
      { id: 'rts-3', routine_id: 'rt-1', user_id: 'demo-user-123', title: 'Review today\'s subscription renewals & urgent tasks', completed: false, step_order: 3, created_at: new Date().toISOString() },
    ],
    created_at: new Date().toISOString(),
  },
  {
    id: 'rt-2',
    user_id: 'demo-user-123',
    title: 'Evening Shutdown & Budget Check',
    time_of_day: 'Evening',
    scheduled_time: '20:00',
    is_active: true,
    steps: [
      { id: 'rts-4', routine_id: 'rt-2', user_id: 'demo-user-123', title: 'Clear inbox and update completed tasks', completed: false, step_order: 1, created_at: new Date().toISOString() },
      { id: 'rts-5', routine_id: 'rt-2', user_id: 'demo-user-123', title: 'Prepare priority task list for tomorrow', completed: false, step_order: 2, created_at: new Date().toISOString() },
    ],
    created_at: new Date().toISOString(),
  },
]

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    user_id: 'demo-user-123',
    title: 'Subscription Renewal Warning',
    message: 'AWS Cloud Infrastructure ($145.50) is scheduled to renew in 1 day via Corporate AMEX.',
    type: 'subscription_renewal',
    read_status: 'unread',
    snoozed_until: null,
    action_url: '/subscriptions',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-2',
    user_id: 'demo-user-123',
    title: 'Budget Threshold Warning',
    message: 'AWS Cloud Infrastructure spend ($145.50) exceeds its set monthly budget limit of $120.00.',
    type: 'budget_alert',
    read_status: 'unread',
    snoozed_until: null,
    action_url: '/subscriptions',
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-3',
    user_id: 'demo-user-123',
    title: 'Task Reminder: Audit AWS Billing',
    message: 'Task "Audit AWS billing & cancel unused EC2 instance" is due tomorrow.',
    type: 'task_reminder',
    read_status: 'unread',
    snoozed_until: null,
    action_url: '/tasks',
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-4',
    user_id: 'demo-user-123',
    title: 'Weekly Productivity Summary',
    message: 'You completed 14 habits and 8 tasks this week! Total subscription expenditure: $195.48.',
    type: 'weekly_summary',
    read_status: 'read',
    snoozed_until: null,
    action_url: '/analytics',
    created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
]

const INITIAL_SETTINGS: UserSettings = {
  user_id: 'demo-user-123',
  monthly_budget_limit: 300,
  web_push_enabled: true,
  desktop_alerts_enabled: true,
  audio_alerts_enabled: true,
  renewal_lead_days: 3,
  theme: 'dark',
  updated_at: new Date().toISOString(),
}

// Payload Sanitizer
function sanitizePayload<T extends object>(data: T): Omit<T, 'id' | 'created_at' | 'updated_at' | 'created' | 'updated'> {
  const { id, created_at, updated_at, created, updated, ...rest } = data as any
  return rest
}

// Record Mappers
const mapSubscription = (r: any): Subscription => ({
  id: r.id,
  user_id: r.user_id,
  name: r.name,
  provider: r.provider,
  cost: Number(r.cost),
  currency: r.currency,
  billing_cycle: r.billing_cycle,
  category: r.category,
  payment_method: r.payment_method,
  next_renewal_date: r.next_renewal_date,
  status: r.status,
  auto_renew: Boolean(r.auto_renew),
  budget_limit: r.budget_limit ? Number(r.budget_limit) : null,
  notes: r.notes || '',
  created_at: r.created || r.created_at || new Date().toISOString(),
  updated_at: r.updated || r.updated_at || new Date().toISOString(),
})

const mapTask = (r: any): TaskItem => ({
  id: r.id,
  user_id: r.user_id,
  title: r.title,
  description: r.description || '',
  due_date: r.due_date || null,
  priority: r.priority,
  status: r.status,
  category: r.category,
  subtasks: Array.isArray(r.subtasks) ? r.subtasks : (typeof r.subtasks === 'string' ? JSON.parse(r.subtasks) : []),
  created_at: r.created || r.created_at || new Date().toISOString(),
  updated_at: r.updated || r.updated_at || new Date().toISOString(),
})

const mapHabit = (r: any): Habit => ({
  id: r.id,
  user_id: r.user_id,
  title: r.title,
  description: r.description || '',
  frequency: r.frequency,
  target_days: Number(r.target_days),
  color: r.color || '#6366f1',
  category: r.category,
  current_streak: Number(r.current_streak || 0),
  longest_streak: Number(r.longest_streak || 0),
  created_at: r.created || r.created_at || new Date().toISOString(),
})

const mapHabitLog = (r: any): HabitLog => ({
  id: r.id,
  habit_id: r.habit_id,
  user_id: r.user_id,
  completed_date: r.completed_date,
  created_at: r.created || r.created_at || new Date().toISOString(),
})

const mapRoutineStep = (s: any): RoutineStep => ({
  id: s.id,
  routine_id: s.routine_id,
  user_id: s.user_id,
  title: s.title,
  completed: Boolean(s.completed),
  step_order: Number(s.step_order || 0),
  created_at: s.created || s.created_at || new Date().toISOString(),
})

const mapRoutine = (r: any, steps: any[] = []): Routine => ({
  id: r.id,
  user_id: r.user_id,
  title: r.title,
  time_of_day: r.time_of_day,
  scheduled_time: r.scheduled_time,
  is_active: Boolean(r.is_active),
  steps: steps.map(mapRoutineStep),
  created_at: r.created || r.created_at || new Date().toISOString(),
})

const mapNotification = (r: any): NotificationItem => ({
  id: r.id,
  user_id: r.user_id,
  title: r.title,
  message: r.message,
  type: r.type,
  read_status: r.read_status,
  snoozed_until: r.snoozed_until || null,
  action_url: r.action_url || null,
  created_at: r.created || r.created_at || new Date().toISOString(),
})

const mapUserSettings = (r: any): UserSettings => ({
  user_id: r.user_id || 'demo-user-123',
  monthly_budget_limit: Number(r.monthly_budget_limit || 300),
  web_push_enabled: Boolean(r.web_push_enabled),
  desktop_alerts_enabled: Boolean(r.desktop_alerts_enabled),
  audio_alerts_enabled: Boolean(r.audio_alerts_enabled),
  renewal_lead_days: Number(r.renewal_lead_days || 3),
  theme: r.theme || 'dark',
  updated_at: r.updated || r.updated_at || new Date().toISOString(),
})

interface DataState {
  subscriptions: Subscription[]
  tasks: TaskItem[]
  habits: Habit[]
  habitLogs: HabitLog[]
  routines: Routine[]
  notifications: NotificationItem[]
  settings: UserSettings

  // Fetch / Sync
  fetchData: () => Promise<void>

  // Subscriptions CRUD
  addSubscription: (sub: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  updateSubscription: (id: string, sub: Partial<Subscription>) => Promise<void>
  deleteSubscription: (id: string) => Promise<void>

  // Tasks CRUD
  addTask: (task: Omit<TaskItem, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  updateTask: (id: string, task: Partial<TaskItem>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  toggleTaskCompleted: (id: string) => Promise<void>
  toggleSubtask: (taskId: string, subtaskId: string) => Promise<void>

  // Habits CRUD
  addHabit: (habit: Omit<Habit, 'id' | 'current_streak' | 'longest_streak' | 'created_at'>) => Promise<void>
  updateHabit: (id: string, habit: Partial<Habit>) => Promise<void>
  deleteHabit: (id: string) => Promise<void>
  toggleHabitLog: (habitId: string, dateStr: string) => Promise<void>

  // Routines CRUD
  addRoutine: (routine: { title: string; time_of_day: Routine['time_of_day']; scheduled_time: string; steps: string[] }) => Promise<void>
  updateRoutine: (id: string, routine: Partial<Routine>) => Promise<void>
  deleteRoutine: (id: string) => Promise<void>
  toggleRoutineStep: (routineId: string, stepId: string) => Promise<void>

  // Notifications Actions
  addNotification: (notif: Omit<NotificationItem, 'id' | 'created_at'>) => Promise<void>
  markNotificationStatus: (id: string, status: any) => Promise<void>
  markAllNotificationsRead: () => Promise<void>
  snoozeNotification: (id: string, hours: number) => Promise<void>
  deleteNotification: (id: string) => Promise<void>

  // Settings
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>

  // Reset/Clear Data
  clearData: () => void
}

export const useDataStore = create<DataState>()(
  persist(
    (set, get) => ({
      subscriptions: INITIAL_SUBSCRIPTIONS,
      tasks: INITIAL_TASKS,
      habits: INITIAL_HABITS,
      habitLogs: INITIAL_HABIT_LOGS,
      routines: INITIAL_ROUTINES,
      notifications: INITIAL_NOTIFICATIONS,
      settings: INITIAL_SETTINGS,

      fetchData: async () => {
        if (!isPocketBaseConfigured) return
        try {
          const [subs, tsks, hbts, hlogs, rtns, ntfs, stgs] = await Promise.all([
            pb.collection('subscriptions').getFullList(),
            pb.collection('tasks').getFullList(),
            pb.collection('habits').getFullList(),
            pb.collection('habit_logs').getFullList(),
            pb.collection('routines').getFullList({ expand: 'routine_steps' }),
            pb.collection('notifications').getFullList(),
            pb.collection('user_settings').getOne(get().settings.user_id).catch(() => null),
          ])

          const mappedSubs = subs.map(mapSubscription)
          const mappedTsks = tsks.map(mapTask)
          const mappedHbts = hbts.map(mapHabit)
          const mappedHlogs = hlogs.map(mapHabitLog)
          const mappedRoutines = rtns.map((r: any) => mapRoutine(r, r.expand?.routine_steps || []))
          const mappedNtfs = ntfs.map(mapNotification)
          const mappedStgs = stgs ? mapUserSettings(stgs) : get().settings

          set({
            subscriptions: mappedSubs.length > 0 ? mappedSubs : get().subscriptions,
            tasks: mappedTsks.length > 0 ? mappedTsks : get().tasks,
            habits: mappedHbts.length > 0 ? mappedHbts : get().habits,
            habitLogs: mappedHlogs.length > 0 ? mappedHlogs : get().habitLogs,
            routines: mappedRoutines.length > 0 ? mappedRoutines : get().routines,
            notifications: mappedNtfs.length > 0 ? mappedNtfs : get().notifications,
            settings: mappedStgs,
          })
        } catch (err) {
          console.warn('PocketBase fetch notice, maintaining local cache:', err)
        }
      },

      // Subscriptions
      addSubscription: async (subData) => {
        let finalSub: Subscription
        const userId = useAuthStore.getState().user?.id || 'demo-user-123'
        const fullSubData = { ...subData, user_id: userId }

        if (isPocketBaseConfigured) {
          try {
            const payload = sanitizePayload(fullSubData)
            const record = await pb.collection('subscriptions').create(payload)
            finalSub = mapSubscription(record)
          } catch (err) {
            console.error('PocketBase create subscription error, falling back:', err)
            finalSub = {
              ...fullSubData,
              id: 'sub-' + Date.now(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
          }
        } else {
          finalSub = {
            ...fullSubData,
            id: 'sub-' + Date.now(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        }

        set((state) => ({ subscriptions: [finalSub, ...state.subscriptions] }))
      },

      updateSubscription: async (id, subData) => {
        set((state) => ({
          subscriptions: state.subscriptions.map((s) =>
            s.id === id ? { ...s, ...subData, updated_at: new Date().toISOString() } : s
          ),
        }))
        if (isPocketBaseConfigured) {
          try {
            const payload = sanitizePayload(subData)
            await pb.collection('subscriptions').update(id, payload)
          } catch (err) {
            console.error('PocketBase update subscription error:', err)
          }
        }
      },

      deleteSubscription: async (id) => {
        set((state) => ({
          subscriptions: state.subscriptions.filter((s) => s.id !== id),
        }))
        if (isPocketBaseConfigured) {
          try {
            await pb.collection('subscriptions').delete(id)
          } catch (err) {
            console.error('PocketBase delete subscription error:', err)
          }
        }
      },

      // Tasks
      addTask: async (taskData) => {
        let finalTask: TaskItem
        const userId = useAuthStore.getState().user?.id || 'demo-user-123'
        const fullTaskData = { ...taskData, user_id: userId }

        if (isPocketBaseConfigured) {
          try {
            const payload = sanitizePayload(fullTaskData)
            const record = await pb.collection('tasks').create(payload)
            finalTask = mapTask(record)
          } catch (err) {
            console.error('PocketBase create task error, falling back:', err)
            finalTask = {
              ...fullTaskData,
              id: 'task-' + Date.now(),
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
          }
        } else {
          finalTask = {
            ...fullTaskData,
            id: 'task-' + Date.now(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        }

        set((state) => ({ tasks: [finalTask, ...state.tasks] }))
      },

      updateTask: async (id, taskData) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...taskData, updated_at: new Date().toISOString() } : t
          ),
        }))
        if (isPocketBaseConfigured) {
          try {
            const payload = sanitizePayload(taskData)
            await pb.collection('tasks').update(id, payload)
          } catch (err) {
            console.error('PocketBase update task error:', err)
          }
        }
      },

      deleteTask: async (id) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }))
        if (isPocketBaseConfigured) {
          try {
            await pb.collection('tasks').delete(id)
          } catch (err) {
            console.error('PocketBase delete task error:', err)
          }
        }
      },

      toggleTaskCompleted: async (id) => {
        const task = get().tasks.find((t) => t.id === id)
        if (!task) return
        const newStatus = task.status === 'completed' ? 'pending' : 'completed'
        await get().updateTask(id, { status: newStatus })
      },

      toggleSubtask: async (taskId, subtaskId) => {
        const task = get().tasks.find((t) => t.id === taskId)
        if (!task) return
        const updatedSubtasks = task.subtasks.map((st) =>
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        )
        await get().updateTask(taskId, { subtasks: updatedSubtasks })
      },

      // Habits
      addHabit: async (habitData) => {
        let finalHabit: Habit
        const userId = useAuthStore.getState().user?.id || 'demo-user-123'
        const fullHabitData = { ...habitData, user_id: userId }

        if (isPocketBaseConfigured) {
          try {
            const payload = sanitizePayload({
              ...fullHabitData,
              current_streak: 0,
              longest_streak: 0,
            })
            const record = await pb.collection('habits').create(payload)
            finalHabit = mapHabit(record)
          } catch (err) {
            console.error('PocketBase create habit error, falling back:', err)
            finalHabit = {
              ...fullHabitData,
              id: 'habit-' + Date.now(),
              current_streak: 0,
              longest_streak: 0,
              created_at: new Date().toISOString(),
            }
          }
        } else {
          finalHabit = {
            ...fullHabitData,
            id: 'habit-' + Date.now(),
            current_streak: 0,
            longest_streak: 0,
            created_at: new Date().toISOString(),
          }
        }

        set((state) => ({ habits: [finalHabit, ...state.habits] }))
      },

      updateHabit: async (id, habitData) => {
        set((state) => ({
          habits: state.habits.map((h) => (h.id === id ? { ...h, ...habitData } : h)),
        }))
        if (isPocketBaseConfigured) {
          try {
            const payload = sanitizePayload(habitData)
            await pb.collection('habits').update(id, payload)
          } catch (err) {
            console.error('PocketBase update habit error:', err)
          }
        }
      },

      deleteHabit: async (id) => {
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
          habitLogs: state.habitLogs.filter((hl) => hl.habit_id !== id),
        }))
        if (isPocketBaseConfigured) {
          try {
            await pb.collection('habits').delete(id)
          } catch (err) {
            console.error('PocketBase delete habit error:', err)
          }
        }
      },

      toggleHabitLog: async (habitId, dateStr) => {
        const existing = get().habitLogs.find(
          (hl) => hl.habit_id === habitId && hl.completed_date === dateStr
        )

        let newLogs = [...get().habitLogs]
        const userId = useAuthStore.getState().user?.id || 'demo-user-123'

        if (existing) {
          newLogs = newLogs.filter((hl) => hl.id !== existing.id)
          if (isPocketBaseConfigured) {
            try {
              await pb.collection('habit_logs').delete(existing.id)
            } catch (err) {
              console.error('PocketBase delete habit log error:', err)
            }
          }
        } else {
          let finalLog: HabitLog
          const logData = {
            habit_id: habitId,
            user_id: userId,
            completed_date: dateStr,
          }

          if (isPocketBaseConfigured) {
            try {
              const record = await pb.collection('habit_logs').create(logData)
              finalLog = mapHabitLog(record)
            } catch (err) {
              console.error('PocketBase create habit log error, falling back:', err)
              finalLog = {
                id: 'hl-' + Date.now(),
                ...logData,
                created_at: new Date().toISOString(),
              }
            }
          } else {
            finalLog = {
              id: 'hl-' + Date.now(),
              ...logData,
              created_at: new Date().toISOString(),
            }
          }
          newLogs.push(finalLog)
        }

        // Recalculate streak
        const habitLogsForHabit = newLogs
          .filter((hl) => hl.habit_id === habitId)
          .map((hl) => hl.completed_date)
          .sort()
          .reverse()

        const streak = habitLogsForHabit.length
        const targetHabit = get().habits.find((h) => h.id === habitId)
        const longest = Math.max(targetHabit?.longest_streak || 0, streak)

        set({ habitLogs: newLogs })
        await get().updateHabit(habitId, { current_streak: streak, longest_streak: longest })
      },

      // Routines
      addRoutine: async ({ title, time_of_day, scheduled_time, steps }) => {
        const id = 'rt-' + Date.now()
        const userId = useAuthStore.getState().user?.id || 'demo-user-123'

        let finalRoutine: Routine

        if (isPocketBaseConfigured) {
          try {
            const rPayload = {
              title,
              time_of_day,
              scheduled_time,
              is_active: true,
              user_id: userId,
            }
            const rRecord = await pb.collection('routines').create(rPayload)

            const routineSteps: RoutineStep[] = []
            for (let idx = 0; idx < steps.length; idx++) {
              const sPayload = {
                routine_id: rRecord.id,
                user_id: userId,
                title: steps[idx],
                completed: false,
                step_order: idx + 1,
              }
              const sRecord = await pb.collection('routine_steps').create(sPayload)
              routineSteps.push(mapRoutineStep(sRecord))
            }

            finalRoutine = mapRoutine(rRecord, routineSteps)
          } catch (err) {
            console.error('PocketBase create routine error, falling back:', err)
            const routineSteps: RoutineStep[] = steps.map((sTitle, idx) => ({
              id: `rts-${Date.now()}-${idx}`,
              routine_id: id,
              user_id: userId,
              title: sTitle,
              completed: false,
              step_order: idx + 1,
              created_at: new Date().toISOString(),
            }))

            finalRoutine = {
              id,
              user_id: userId,
              title,
              time_of_day,
              scheduled_time,
              is_active: true,
              steps: routineSteps,
              created_at: new Date().toISOString(),
            }
          }
        } else {
          const routineSteps: RoutineStep[] = steps.map((sTitle, idx) => ({
            id: `rts-${Date.now()}-${idx}`,
            routine_id: id,
            user_id: userId,
            title: sTitle,
            completed: false,
            step_order: idx + 1,
            created_at: new Date().toISOString(),
          }))

          finalRoutine = {
            id,
            user_id: userId,
            title,
            time_of_day,
            scheduled_time,
            is_active: true,
            steps: routineSteps,
            created_at: new Date().toISOString(),
          }
        }

        set((state) => ({ routines: [finalRoutine, ...state.routines] }))
      },

      updateRoutine: async (id, routineData) => {
        set((state) => ({
          routines: state.routines.map((r) => (r.id === id ? { ...r, ...routineData } : r)),
        }))
        if (isPocketBaseConfigured) {
          try {
            const payload = sanitizePayload(routineData)
            await pb.collection('routines').update(id, payload)
          } catch (err) {
            console.error('PocketBase update routine error:', err)
          }
        }
      },

      deleteRoutine: async (id) => {
        set((state) => ({
          routines: state.routines.filter((r) => r.id !== id),
        }))
        if (isPocketBaseConfigured) {
          try {
            await pb.collection('routines').delete(id)
          } catch (err) {
            console.error('PocketBase delete routine error:', err)
          }
        }
      },

      toggleRoutineStep: async (routineId, stepId) => {
        const routine = get().routines.find((r) => r.id === routineId)
        if (!routine || !routine.steps) return

        const updatedSteps = routine.steps.map((st) =>
          st.id === stepId ? { ...st, completed: !st.completed } : st
        )

        set((state) => ({
          routines: state.routines.map((r) =>
            r.id === routineId ? { ...r, steps: updatedSteps } : r
          ),
        }))

        if (isPocketBaseConfigured) {
          try {
            const step = updatedSteps.find((s) => s.id === stepId)
            if (step) {
              const payload = { completed: step.completed }
              await pb.collection('routine_steps').update(stepId, payload)
            }
          } catch (err) {
            console.error('PocketBase toggle routine step error:', err)
          }
        }
      },

      // Notifications
      addNotification: async (notifData) => {
        let finalNotif: NotificationItem
        const userId = useAuthStore.getState().user?.id || 'demo-user-123'
        const fullNotifData = { ...notifData, user_id: userId }

        if (isPocketBaseConfigured) {
          try {
            const payload = sanitizePayload(fullNotifData)
            const record = await pb.collection('notifications').create(payload)
            finalNotif = mapNotification(record)
          } catch (err) {
            console.error('PocketBase create notification error, falling back:', err)
            finalNotif = {
              ...fullNotifData,
              id: 'notif-' + Date.now(),
              created_at: new Date().toISOString(),
            }
          }
        } else {
          finalNotif = {
            ...fullNotifData,
            id: 'notif-' + Date.now(),
            created_at: new Date().toISOString(),
          }
        }

        set((state) => ({ notifications: [finalNotif, ...state.notifications] }))
      },

      markNotificationStatus: async (id, status) => {
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, read_status: status } : n)),
        }))
        if (isPocketBaseConfigured) {
          try {
            await pb.collection('notifications').update(id, { read_status: status })
          } catch (err) {
            console.error('PocketBase mark notification status error:', err)
          }
        }
      },

      markAllNotificationsRead: async () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read_status: 'read' })),
        }))
        if (isPocketBaseConfigured) {
          try {
            const unreads = get().notifications.filter((n) => n.read_status === 'unread')
            for (const u of unreads) {
              await pb.collection('notifications').update(u.id, { read_status: 'read' })
            }
          } catch (err) {
            console.error('PocketBase mark all read error:', err)
          }
        }
      },

      snoozeNotification: async (id, hours) => {
        const snoozedUntil = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString()
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, snoozed_until: snoozedUntil, read_status: 'read' } : n
          ),
        }))
        if (isPocketBaseConfigured) {
          try {
            await pb.collection('notifications').update(id, { snoozed_until: snoozedUntil, read_status: 'read' })
          } catch (err) {
            console.error('PocketBase snooze notification error:', err)
          }
        }
      },

      deleteNotification: async (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }))
        if (isPocketBaseConfigured) {
          try {
            await pb.collection('notifications').delete(id)
          } catch (err) {
            console.error('PocketBase delete notification error:', err)
          }
        }
      },

      // Settings
      updateSettings: async (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings, updated_at: new Date().toISOString() },
        }))
        if (isPocketBaseConfigured) {
          try {
            const payload = sanitizePayload(newSettings)
            await pb.collection('user_settings').update(get().settings.user_id, payload)
          } catch (err) {
            console.error('PocketBase update settings error:', err)
          }
        }
      },

      clearData: () => {
        set({
          subscriptions: [],
          tasks: [],
          habits: [],
          habitLogs: [],
          routines: [],
          notifications: [],
        })
      },
    }),
    {
      name: 'remindly-app-data',
    }
  )
)
