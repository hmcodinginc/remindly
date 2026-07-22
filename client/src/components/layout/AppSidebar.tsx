import { ChevronsLeft, ChevronsRight, PanelsTopLeft } from "lucide-react"
import { NavLink } from "react-router-dom"
import { Logo } from "@/components/brand/Logo"
import { mainNavItems } from "@/components/layout/nav-items"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/store/use-app-store"
import { useAuthStore } from "@/store/use-auth-store"
import { useDataStore } from "@/store/use-data-store"

type AppSidebarProps = {
  className?: string
  onNavigate?: () => void
  forceExpanded?: boolean
}

export function AppSidebar({
  className,
  onNavigate,
  forceExpanded = false,
}: AppSidebarProps) {
  const storeCollapsed = useAppStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useAppStore((s) => s.toggleSidebar)
  const user = useAuthStore((s) => s.user)
  const notifications = useDataStore((s) => s.notifications)
  const unreadCount = notifications.filter((n) => n.read_status === 'unread').length

  const collapsed = forceExpanded ? false : storeCollapsed

  const initials = user?.full_name
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "RM"

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-border/60 bg-sidebar/80 backdrop-blur-xl transition-[width] duration-200",
        collapsed ? "w-[72px]" : "w-64",
        className,
      )}
    >
      <div
        className={cn(
          "flex h-14 items-center border-b border-border/60 px-3",
          collapsed ? "justify-center" : "justify-between gap-2",
        )}
      >
        <NavLink
          to="/dashboard"
          onClick={onNavigate}
          className="flex min-w-0 items-center"
        >
          <Logo showWordmark={!collapsed} markClassName="size-7" />
        </NavLink>
        {!collapsed ? (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggleSidebar}
            aria-label="Collapse sidebar"
            className="hidden md:inline-flex"
          >
            <ChevronsLeft className="size-4" />
          </Button>
        ) : null}
      </div>

      <ScrollArea className="flex-1 px-2 py-3">
        <nav className="space-y-0.5" aria-label="Main">
          {mainNavItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={onNavigate}
              title={collapsed ? item.title : undefined}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  collapsed && "justify-center px-2",
                  isActive &&
                    "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm font-semibold",
                )
              }
            >
              <item.icon className="size-4 shrink-0" aria-hidden />
              {!collapsed ? (
                <span className="flex-1 truncate">{item.title}</span>
              ) : null}

              {item.href === "/notifications" && unreadCount > 0 && (
                <span
                  className={cn(
                    "flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground",
                    collapsed && "absolute top-1 right-1 size-2 rounded-full p-0 text-[0px]"
                  )}
                >
                  {!collapsed ? unreadCount : ""}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <Separator className="my-4" />

        <div className={cn("px-2", collapsed && "px-0")}>
          {!collapsed ? (
            <p className="mb-2 px-0.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Workspace
            </p>
          ) : null}
          <div
            className={cn(
              "flex items-center gap-3 rounded-lg border border-border/50 bg-muted/30 px-2.5 py-2",
              collapsed && "justify-center px-2",
            )}
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">
              <PanelsTopLeft className="size-4" aria-hidden />
            </div>
            {!collapsed ? (
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">Personal</p>
                <p className="truncate text-xs text-muted-foreground">
                  Default workspace
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </ScrollArea>

      <div className="border-t border-border/60 p-2">
        {collapsed ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            aria-label="Expand sidebar"
            className="mx-auto hidden md:flex"
          >
            <ChevronsRight className="size-4" />
          </Button>
        ) : null}
        <div
          className={cn(
            "mt-1 flex items-center gap-3 rounded-lg px-2 py-2",
            collapsed && "justify-center",
          )}
        >
          <Avatar className="size-8">
            {user?.avatar_url && <AvatarImage src={user.avatar_url} alt={user.full_name || 'User'} />}
            <AvatarFallback className="bg-primary/15 text-xs text-primary font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          {!collapsed ? (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user?.full_name || 'Remindly User'}</p>
              <p className="truncate text-xs text-muted-foreground">
                {user?.email || 'Personal plan'}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </aside>
  )
}
