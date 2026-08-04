import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { LogOut, Settings, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuthStore } from "@/store/use-auth-store"
import { useDataStore } from "@/store/use-data-store"

export function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const user = useAuthStore((s) => s.user)
  const signOut = useAuthStore((s) => s.signOut)
  const clearData = useDataStore((s) => s.clearData)

  const handleSignOut = async () => {
    setIsOpen(false)
    await signOut()
    clearData()
    navigate("/login", { replace: true })
  }

  const handleNavigateSettings = () => {
    setIsOpen(false)
    navigate("/settings")
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const initials = user?.full_name
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "RM"

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Avatar Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-center rounded-full p-0.5 outline-none transition-all hover:opacity-80 focus:ring-2 focus:ring-primary/40 cursor-pointer"
        aria-label="User profile menu"
        aria-expanded={isOpen}
      >
        <Avatar className="size-8 border border-border/50">
          {user?.avatar_url && <AvatarImage src={user.avatar_url} alt={user.full_name || 'User'} />}
          <AvatarFallback className="bg-primary/15 text-xs font-bold text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
      </button>

      {/* Dropdown Menu Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-border/80 bg-popover p-2 text-popover-foreground shadow-2xl backdrop-blur-xl z-50"
          >
            {/* User Details */}
            <div className="px-3 py-2.5 border-b border-border/50">
              <p className="text-sm font-bold truncate">{user?.full_name || 'Remindly User'}</p>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {user?.email || 'you@remindly.app'}
              </p>
            </div>

            {/* Navigation Options */}
            <div className="py-1">
              <button
                type="button"
                onClick={handleNavigateSettings}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted cursor-pointer"
              >
                <User className="size-4 text-primary" />
                <span>Profile & Preferences</span>
              </button>

              <button
                type="button"
                onClick={handleNavigateSettings}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-muted cursor-pointer"
              >
                <Settings className="size-4 text-primary" />
                <span>Settings & Notifications</span>
              </button>
            </div>

            <div className="border-t border-border/50 my-1" />

            {/* Log Out Option */}
            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/10 cursor-pointer"
            >
              <LogOut className="size-4" />
              <span>Log Out</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
