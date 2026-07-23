export type SubscriptionBillingCycle = 'monthly' | 'yearly' | 'weekly'
export type SubscriptionStatus = 'active' | 'paused' | 'cancelled'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'
export type TaskStatus = 'pending' | 'in_progress' | 'completed'
export type HabitFrequency = 'daily' | 'weekly'
export type RoutineTimeOfDay = 'Morning' | 'Afternoon' | 'Evening' | 'Night'
export type NotificationType =
  | 'subscription_renewal'
  | 'task_reminder'
  | 'habit_reminder'
  | 'budget_alert'
  | 'weekly_summary'
  | 'monthly_summary'
export type NotificationStatus = 'unread' | 'read' | 'archived'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: string
  name: string
  provider: string | null
  cost: number
  currency: string
  billing_cycle: SubscriptionBillingCycle
  category: string
  payment_method: string
  next_renewal_date: string
  status: SubscriptionStatus
  auto_renew: boolean
  budget_limit: number | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface SubTask {
  id: string
  title: string
  completed: boolean
}

export interface TaskItem {
  id: string
  user_id: string
  title: string
  description: string | null
  due_date: string | null
  priority: TaskPriority
  status: TaskStatus
  category: string
  subtasks: SubTask[]
  created_at: string
  updated_at: string
}

export interface Habit {
  id: string
  user_id: string
  title: string
  description: string | null
  frequency: HabitFrequency
  target_days: number
  color: string
  category: string
  current_streak: number
  longest_streak: number
  created_at: string
}

export interface HabitLog {
  id: string
  habit_id: string
  user_id: string
  completed_date: string
  created_at: string
}

export interface RoutineStep {
  id: string
  routine_id: string
  user_id: string
  title: string
  completed: boolean
  step_order: number
  created_at: string
}

export interface Routine {
  id: string
  user_id: string
  title: string
  time_of_day: RoutineTimeOfDay
  scheduled_time: string
  is_active: boolean
  steps?: RoutineStep[]
  created_at: string
}

export interface NotificationItem {
  id: string
  user_id: string
  title: string
  message: string
  type: NotificationType
  read_status: NotificationStatus
  snoozed_until: string | null
  action_url: string | null
  created_at: string
}

export interface UserSettings {
  user_id: string
  monthly_budget_limit: number
  web_push_enabled: boolean
  desktop_alerts_enabled: boolean
  audio_alerts_enabled: boolean
  renewal_lead_days: number
  theme: string
  updated_at: string
}
