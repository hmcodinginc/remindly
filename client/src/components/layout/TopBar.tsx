import { Menu } from "lucide-react"

import { NotificationDropdown } from "@/components/common/NotificationDropdown"
import { SearchInput } from "@/components/common/SearchInput"
import { ThemeToggle } from "@/components/common/ThemeToggle"
import { UserDropdown } from "@/components/common/UserDropdown"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/store/use-app-store"

export function TopBar() {
  const setMobileNavOpen = useAppStore((s) => s.setMobileNavOpen)

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/60 bg-background/70 px-4 backdrop-blur-xl md:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        aria-label="Open navigation"
        onClick={() => setMobileNavOpen(true)}
      >
        <Menu className="size-4" />
      </Button>

      <SearchInput containerClassName="hidden sm:block flex-1" />

      <div className="ml-auto flex items-center gap-1">
        <NotificationDropdown />
        <ThemeToggle />
        <UserDropdown />
      </div>
    </header>
  )
}
