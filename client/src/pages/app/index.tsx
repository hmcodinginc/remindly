import {
  Bell,
  CalendarDays,
  CreditCard,
  FileText,
  LayoutDashboard,
  LineChart,
  ListTodo,
  RefreshCw,
  Settings,
  Sparkles,
  Target,
} from "lucide-react"

import { FeaturePage } from "@/components/common/FeaturePage"
import { Button } from "@/components/ui/button"

export function DashboardPage() {
  return (
    <FeaturePage
      icon={LayoutDashboard}
      title="Dashboard"
      description="Your command center for renewals, routines, and daily focus."
      emptyTitle="Dashboard is ready"
      emptyDescription="Widgets for upcoming renewals, tasks, and habit streaks will appear here once features are connected."
    />
  )
}

export function SubscriptionsPage() {
  return (
    <FeaturePage
      icon={CreditCard}
      title="Subscriptions"
      description="Track every recurring service in one calm, organized place."
      emptyTitle="No subscriptions yet"
      emptyDescription="When you add subscriptions, they will show up here with billing cycles and renewal dates."
      action={<Button disabled>Add subscription</Button>}
    />
  )
}

export function RenewalsPage() {
  return (
    <FeaturePage
      icon={RefreshCw}
      title="Renewals"
      description="Stay ahead of renewals with timelines and reminder windows."
      emptyTitle="No renewals scheduled"
      emptyDescription="Upcoming and expired renewals will be listed here as soon as subscriptions are connected."
    />
  )
}

export function CalendarPage() {
  return (
    <FeaturePage
      icon={CalendarDays}
      title="Calendar"
      description="See renewals, tasks, and routines across month, week, and day views."
      emptyTitle="Calendar is empty"
      emptyDescription="Events and reminders will populate this view when your schedule data is available."
    />
  )
}

export function TasksPage() {
  return (
    <FeaturePage
      icon={ListTodo}
      title="Tasks"
      description="Capture priorities with due dates, labels, and clear status."
      emptyTitle="No tasks yet"
      emptyDescription="Create tasks to organize follow-ups around renewals, habits, and day-to-day work."
      action={<Button disabled>New task</Button>}
    />
  )
}

export function RoutinesPage() {
  return (
    <FeaturePage
      icon={Sparkles}
      title="Daily Routines"
      description="Design morning, afternoon, evening, and night checklists that stick."
      emptyTitle="No routines configured"
      emptyDescription="Build structured daily routines here to keep your day intentional and measurable."
    />
  )
}

export function HabitsPage() {
  return (
    <FeaturePage
      icon={Target}
      title="Habits"
      description="Build streaks and track consistency without noise."
      emptyTitle="No habits tracked"
      emptyDescription="Start habits here to measure consistency and keep momentum visible."
      action={<Button disabled>Add habit</Button>}
    />
  )
}

export function AnalyticsPage() {
  return (
    <FeaturePage
      icon={LineChart}
      title="Analytics"
      description="Understand spending, completion, and renewal patterns over time."
      emptyTitle="Analytics coming soon"
      emptyDescription="Charts for spending, habits, and renewals will live here once data is flowing."
    />
  )
}

export function NotificationsPage() {
  return (
    <FeaturePage
      icon={Bell}
      title="Notifications"
      description="Review in-app alerts for renewals, tasks, routines, and habits."
      emptyTitle="No notifications"
      emptyDescription="When reminders fire, they will collect here so you can review, snooze, or archive them."
    />
  )
}

export function DocumentsPage() {
  return (
    <FeaturePage
      icon={FileText}
      title="Documents"
      description="Keep invoices, receipts, and license keys close to each subscription."
      emptyTitle="No documents uploaded"
      emptyDescription="Store and preview files here once document management is enabled."
      action={<Button disabled>Upload</Button>}
    />
  )
}

export function SettingsPage() {
  return (
    <FeaturePage
      icon={Settings}
      title="Settings"
      description="Theme, notifications, currency, language, and security preferences."
      emptyTitle="Preferences ready"
      emptyDescription="Account and preference controls will be wired here without changing the shell layout."
    />
  )
}
