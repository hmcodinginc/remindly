import { useState } from "react"
import { motion } from "framer-motion"
import {
  Bell,
  CheckCheck,
  Clock,
  Archive,
  Trash2,
  Volume2,
  Send,
  Filter,
  CheckCircle,
  AlertTriangle,
  CreditCard,
  Target,
  Sparkles,
  BarChart,
} from "lucide-react"
import { toast } from "sonner"
import { useDataStore } from "@/store/use-data-store"
import {
  playNotificationSound,
  requestWebPushPermission,
  triggerBrowserPush,
} from "@/hooks/use-notifications-engine"
import { Button } from "@/components/ui/button"

export function NotificationsPage() {
  const notifications = useDataStore((s) => s.notifications)
  const markNotificationStatus = useDataStore((s) => s.markNotificationStatus)
  const markAllNotificationsRead = useDataStore((s) => s.markAllNotificationsRead)
  const snoozeNotification = useDataStore((s) => s.snoozeNotification)
  const deleteNotification = useDataStore((s) => s.deleteNotification)
  const addNotification = useDataStore((s) => s.addNotification)

  const [activeTab, setActiveTab] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  // Filter logic
  const filteredNotifs = notifications.filter((n) => {
    if (activeTab === "unread" && n.read_status !== "unread") return false
    if (activeTab === "archived" && n.read_status !== "archived") return false
    if (activeTab === "snoozed" && !n.snoozed_until) return false

    if (typeFilter !== "all" && n.type !== typeFilter) return false
    return true
  })

  const unreadCount = notifications.filter((n) => n.read_status === "unread").length

  const handleTestWebPush = () => {
    requestWebPushPermission()
    playNotificationSound()
    triggerBrowserPush(
      "Remindly Push Alert Demo",
      "Web push and desktop sound triggers are active and functioning!",
      "/notifications"
    )
    addNotification({
      user_id: "demo-user-123",
      title: "Test Web Push Alert Triggered",
      message: "Browser push notification and audio chime triggered manually.",
      type: "task_reminder",
      read_status: "unread",
      snoozed_until: null,
      action_url: "/notifications",
    })
    toast.success("Test Web Push alert fired!")
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "subscription_renewal":
        return <CreditCard className="size-4 text-amber-400" />
      case "budget_alert":
        return <AlertTriangle className="size-4 text-red-400" />
      case "task_reminder":
        return <CheckCircle className="size-4 text-primary" />
      case "habit_reminder":
        return <Target className="size-4 text-emerald-400" />
      case "weekly_summary":
      case "monthly_summary":
        return <BarChart className="size-4 text-indigo-400" />
      default:
        return <Bell className="size-4 text-primary" />
    }
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Notification Center</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage multi-channel alerts for renewals, budgets, tasks, and summaries.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" onClick={handleTestWebPush}>
            <Send className="size-4" />
            <span>Test Web Push & Audio</span>
          </Button>
          {unreadCount > 0 && (
            <Button className="gap-2" onClick={markAllNotificationsRead}>
              <CheckCheck className="size-4" />
              <span>Mark All Read</span>
            </Button>
          )}
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-card/60 p-4 rounded-2xl border border-border/50">
        <div className="flex items-center gap-1 rounded-xl bg-muted/40 p-1">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              activeTab === "all" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("unread")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              activeTab === "unread" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("snoozed")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              activeTab === "snoozed" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Snoozed
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("archived")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              activeTab === "archived" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Archived
          </button>
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-muted-foreground" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-1.5 text-xs font-semibold"
          >
            <option value="all">All Notification Types</option>
            <option value="subscription_renewal">Subscription Renewals</option>
            <option value="budget_alert">Budget Alerts</option>
            <option value="task_reminder">Task Reminders</option>
            <option value="habit_reminder">Habit Reminders</option>
            <option value="weekly_summary">Weekly Summaries</option>
            <option value="monthly_summary">Monthly Summaries</option>
          </select>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifs.length === 0 ? (
          <div className="py-16 text-center rounded-2xl border border-dashed border-border/60 bg-card/20">
            <Bell className="mx-auto size-10 text-muted-foreground/50 mb-3" />
            <h3 className="text-lg font-bold">No notifications found</h3>
            <p className="mt-1 text-sm text-muted-foreground">You are completely caught up!</p>
          </div>
        ) : (
          filteredNotifs.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl border p-4 backdrop-blur-md transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
                notif.read_status === "unread"
                  ? "border-primary/40 bg-primary/5 shadow-md"
                  : "border-border/60 bg-card/40 opacity-80"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="mt-1 flex size-9 flex-shrink-0 items-center justify-center rounded-xl bg-muted/60">
                  {getTypeIcon(notif.type)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-foreground">{notif.title}</h3>
                    <span className="rounded-full bg-muted/60 px-2 py-0.5 text-[10px] font-semibold uppercase text-muted-foreground">
                      {notif.type.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{notif.message}</p>
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground/70 pt-1">
                    <span>{new Date(notif.created_at).toLocaleString()}</span>
                    {notif.snoozed_until && (
                      <span className="text-amber-400 font-semibold">
                        Snoozed until {new Date(notif.snoozed_until).toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 self-end sm:self-center">
                {notif.read_status === "unread" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs gap-1 text-emerald-500 hover:bg-emerald-500/10"
                    onClick={() => markNotificationStatus(notif.id, "read")}
                  >
                    <CheckCircle className="size-3.5" />
                    <span>Mark Read</span>
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs gap-1"
                  onClick={() => {
                    snoozeNotification(notif.id, 24)
                    toast.success("Snoozed notification for 24 hours")
                  }}
                >
                  <Clock className="size-3.5" />
                  <span>Snooze (24h)</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs gap-1"
                  onClick={() => {
                    markNotificationStatus(notif.id, notif.read_status === "archived" ? "read" : "archived")
                    toast.success(notif.read_status === "archived" ? "Unarchived" : "Archived")
                  }}
                >
                  <Archive className="size-3.5" />
                  <span>{notif.read_status === "archived" ? "Unarchive" : "Archive"}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 text-red-400 hover:bg-red-500/10"
                  onClick={() => {
                    deleteNotification(notif.id)
                    toast.success("Notification deleted")
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
