import type { LucideIcon } from "lucide-react"
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

export type NavItem = {
  title: string
  href: string
  icon: LucideIcon
}

export const mainNavItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Subscriptions", href: "/subscriptions", icon: CreditCard },
  { title: "Renewals", href: "/renewals", icon: RefreshCw },
  { title: "Calendar", href: "/calendar", icon: CalendarDays },
  { title: "Tasks", href: "/tasks", icon: ListTodo },
  { title: "Daily Routines", href: "/routines", icon: Sparkles },
  { title: "Habits", href: "/habits", icon: Target },
  { title: "Analytics", href: "/analytics", icon: LineChart },
  { title: "Notifications", href: "/notifications", icon: Bell },
  { title: "Documents", href: "/documents", icon: FileText },
  { title: "Settings", href: "/settings", icon: Settings },
]
