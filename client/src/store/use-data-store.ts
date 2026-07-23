import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { pb, isPocketBaseConfigured } from '@/lib/pocketbase/client'
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
  NotificationType,
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
  markNotificationStatus: (id: string, status: NotificationStatus) => Promise<void>
  markAllNotificationsRead: () => Promise<void>
  snoozeNotification: (id: string, hours: number) => Promise<void>
  deleteNotification: (id: string) => Promise<void>

  // Settings
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>
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
            pb.collection('subscriptions').getFullList<Subscription>(),
            pb.collection('tasks').getFullList<TaskItem>(),
            pb.collection('habits').getFullList<Habit>(),
            pb.collection('habit_logs').getFullList<HabitLog>(),
            pb.collection('routines').getFullList<Routine>({ expand: 'routine_steps' }),
            pb.collection('notifications').getFullList<NotificationItem>(),
            pb.collection('user_settings').getOne<UserSettings>(get().settings.user_id).catch(() => null),
          ])

          // Map routines with expanded steps
          const mappedRoutines = rtns.map((r: any) => ({
            ...r,
            steps: r.expand?.routine_steps || [],
          }))

          set({
            subscriptions: subs && subs.length > 0 ? subs : get().subscriptions,
            tasks: tsks && tsks.length > 0 ? tsks : get().tasks,
            habits: hbts && hbts.length > 0 ? hbts : get().habits,
            habitLogs: hlogs && hlogs.length > 0 ? hlogs : get().habitLogs,
            routines: rtns && rtns.length > 0 ? mappedRoutines : get().routines,
            notifications: ntfs && ntfs.length > 0 ? ntfs : get().notifications,
            settings: stgs || get().settings,
          })
        } catch (err) {
          console.warn('PocketBase fetch notice, maintaining local cache:', err)
        }
      },

      // Subscriptions
      addSubscription: async (subData) => {
        const id = 'sub-' + Date.now()
        const newSub: Subscription = {
          ...subData,
          id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        set((state) => ({ subscriptions: [newSub, ...state.subscriptions] }))

        if (isPocketBaseConfigured) {
          await pb.collection('subscriptions').create(newSub)
        }
      },

      updateSubscription: async (id, subData) => {
        set((state) => ({
          subscriptions: state.subscriptions.map((s) =>
            s.id === id ? { ...s, ...subData, updated_at: new Date().toISOString() } : s
          ),
        }))
        if (isPocketBaseConfigured) {
          await pb.collection('subscriptions').update(id, subData)
        }
      },

      deleteSubscription: async (id) => {
        set((state) => ({
          subscriptions: state.subscriptions.filter((s) => s.id !== id),
        }))
        if (isPocketBaseConfigured) {
          await pb.collection('subscriptions').delete(id)
        }
      },

      // Tasks
      addTask: async (taskData) => {
        const id = 'task-' + Date.now()
        const newTask: TaskItem = {
          ...taskData,
          id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        set((state) => ({ tasks: [newTask, ...state.tasks] }))

        if (isPocketBaseConfigured) {
          await pb.collection('tasks').create(newTask)
        }
      },

      updateTask: async (id, taskData) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...taskData, updated_at: new Date().toISOString() } : t
          ),
        }))
        if (isPocketBaseConfigured) {
          await pb.collection('tasks').update(id, taskData)
        }
      },

      deleteTask: async (id) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }))
        if (isPocketBaseConfigured) {
          await pb.collection('tasks').delete(id)
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
        const id = 'habit-' + Date.now()
        const newHabit: Habit = {
          ...habitData,
          id,
          current_streak: 0,
          longest_streak: 0,
          created_at: new Date().toISOString(),
        }
        set((state) => ({ habits: [newHabit, ...state.habits] }))

        if (isPocketBaseConfigured) {
          await pb.collection('habits').create(newHabit)
        }
      },

      updateHabit: async (id, habitData) => {
        set((state) => ({
          habits: state.habits.map((h) => (h.id === id ? { ...h, ...habitData } : h)),
        }))
        if (isPocketBaseConfigured) {
          await pb.collection('habits').update(id, habitData)
        }
      },

      deleteHabit: async (id) => {
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
          habitLogs: state.habitLogs.filter((hl) => hl.habit_id !== id),
        }))
        if (isPocketBaseConfigured) {
          await pb.collection('habits').delete(id)
        }
      },

      toggleHabitLog: async (habitId, dateStr) => {
        const existing = get().habitLogs.find(
          (hl) => hl.habit_id === habitId && hl.completed_date === dateStr
        )

        let newLogs = [...get().habitLogs]
        if (existing) {
          newLogs = newLogs.filter((hl) => hl.id !== existing.id)
          if (isPocketBaseConfigured) {
            await pb.collection('habit_logs').delete(existing.id)
          }
        } else {
          const newLog: HabitLog = {
            id: 'hl-' + Date.now(),
            habit_id: habitId,
            user_id: get().habits.find((h) => h.id === habitId)?.user_id || 'demo-user-123',
            completed_date: dateStr,
            created_at: new Date().toISOString(),
          }
          newLogs.push(newLog)
          if (isPocketBaseConfigured) {
            await pb.collection('habit_logs').create(newLog)
          }
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
        const routineSteps: RoutineStep[] = steps.map((sTitle, idx) => ({
          id: `rts-${Date.now()}-${idx}`,
          routine_id: id,
          user_id: 'demo-user-123',
          title: sTitle,
          completed: false,
          step_order: idx + 1,
          created_at: new Date().toISOString(),
        }))

        const newRoutine: Routine = {
          id,
          user_id: 'demo-user-123',
          title,
          time_of_day,
          scheduled_time,
          is_active: true,
          steps: routineSteps,
          created_at: new Date().toISOString(),
        }

        set((state) => ({ routines: [newRoutine, ...state.routines] }))

        if (isPocketBaseConfigured) {
          await pb.collection('routines').create({
            id,
            user_id: 'demo-user-123',
            title,
            time_of_day,
            scheduled_time,
            is_active: true,
          })
          for (const step of routineSteps) {
            await pb.collection('routine_steps').create(step)
          }
        }
      },

      updateRoutine: async (id, routineData) => {
        set((state) => ({
          routines: state.routines.map((r) => (r.id === id ? { ...r, ...routineData } : r)),
        }))
        if (isPocketBaseConfigured) {
          await pb.collection('routines').update(id, routineData)
        }
      },

      deleteRoutine: async (id) => {
        set((state) => ({
          routines: state.routines.filter((r) => r.id !== id),
        }))
        if (isPocketBaseConfigured) {
          await pb.collection('routines').delete(id)
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
          const step = updatedSteps.find((s) => s.id === stepId)
          if (step) {
            await pb.collection('routine_steps').update(stepId, { completed: step.completed })
          }
        }
      },

      // Notifications
      addNotification: async (notifData) => {
        const id = 'notif-' + Date.now()
        const newNotif: NotificationItem = {
          ...notifData,
          id,
          created_at: new Date().toISOString(),
        }
        set((state) => ({ notifications: [newNotif, ...state.notifications] }))
        if (isPocketBaseConfigured) {
          await pb.collection('notifications').create(newNotif)
        }
      },

      markNotificationStatus: async (id, status) => {
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, read_status: status } : n)),
        }))
        if (isPocketBaseConfigured) {
          await pb.collection('notifications').update(id, { read_status: status })
        }
      },

      markAllNotificationsRead: async () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read_status: 'read' })),
        }))
        if (isPocketBaseConfigured) {
          const unreads = get().notifications.filter((n) => n.read_status === 'unread')
          for (const u of unreads) {
            await pb.collection('notifications').update(u.id, { read_status: 'read' })
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
          await pb.collection('notifications').update(id, { snoozed_until: snoozedUntil, read_status: 'read' })
        }
      },

      deleteNotification: async (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }))
        if (isPocketBaseConfigured) {
          await pb.collection('notifications').delete(id)
        }
      },

      // Settings
      updateSettings: async (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings, updated_at: new Date().toISOString() },
        }))
        if (isPocketBaseConfigured) {
          await pb.collection('user_settings').update(get().settings.user_id, {
            ...newSettings,
            updated_at: new Date().toISOString(),
          })
        }
      },
    }),
    {
      name: 'remindly-app-data',
    }
  )
)
