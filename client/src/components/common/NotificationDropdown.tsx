import { Bell, Check, Clock, Trash2, Archive, Volume2 } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDataStore } from "@/store/use-data-store"
import { playNotificationSound } from "@/hooks/use-notifications-engine"

export function NotificationDropdown() {
  const notifications = useDataStore((s) => s.notifications)
  const markNotificationStatus = useDataStore((s) => s.markNotificationStatus)
  const markAllNotificationsRead = useDataStore((s) => s.markAllNotificationsRead)
  const snoozeNotification = useDataStore((s) => s.snoozeNotification)
  const deleteNotification = useDataStore((s) => s.deleteNotification)

  const unreadList = notifications.filter((n) => n.read_status === 'unread')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Notifications"
            className="relative"
          />
        }
      >
        <Bell className="size-4" />
        {unreadList.length > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            {unreadList.length}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-88 p-0 shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">Notifications</span>
            {unreadList.length > 0 && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                {unreadList.length} unread
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="size-7 text-muted-foreground hover:text-foreground"
              title="Test Sound"
              onClick={playNotificationSound}
            >
              <Volume2 className="size-3.5" />
            </Button>
            {unreadList.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={markAllNotificationsRead}
              >
                Mark all read
              </Button>
            )}
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto divide-y divide-border/40">
          {notifications.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm font-medium">You're all caught up!</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Renewal alerts and reminders will appear here.
              </p>
            </div>
          ) : (
            notifications.slice(0, 5).map((notif) => (
              <div
                key={notif.id}
                className={`p-3.5 text-xs transition-colors hover:bg-muted/40 ${
                  notif.read_status === 'unread' ? 'bg-primary/5 font-medium' : 'opacity-80'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-1.5 font-semibold text-foreground">
                      <span
                        className={`size-2 rounded-full ${
                          notif.type === 'subscription_renewal'
                            ? 'bg-amber-500'
                            : notif.type === 'budget_alert'
                            ? 'bg-red-500'
                            : 'bg-primary'
                        }`}
                      />
                      <span>{notif.title}</span>
                    </div>
                    <p className="text-muted-foreground leading-snug">{notif.message}</p>
                    <span className="text-[10px] text-muted-foreground/70 block">
                      {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-0.5 opacity-80 hover:opacity-100">
                    {notif.read_status === 'unread' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-6 text-emerald-500 hover:bg-emerald-500/10"
                        title="Mark as Read"
                        onClick={() => markNotificationStatus(notif.id, 'read')}
                      >
                        <Check className="size-3" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6 text-muted-foreground hover:bg-muted"
                      title="Snooze 1 Hour"
                      onClick={() => snoozeNotification(notif.id, 1)}
                    >
                      <Clock className="size-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6 text-red-400 hover:bg-red-500/10"
                      title="Delete"
                      onClick={() => deleteNotification(notif.id)}
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <DropdownMenuSeparator className="m-0" />
        <div className="p-2 text-center bg-muted/20">
          <Link
            to="/notifications"
            className="text-xs font-semibold text-primary hover:underline block py-1"
          >
            View all notifications center →
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
