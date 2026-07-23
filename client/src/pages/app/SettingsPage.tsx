import { useState } from "react"
import { motion } from "framer-motion"
import { User, Bell, Volume2, Shield, Database, Save, Check } from "lucide-react"
import { toast } from "sonner"
import { useAuthStore } from "@/store/use-auth-store"
import { useDataStore } from "@/store/use-data-store"
import { isPocketBaseConfigured } from "@/lib/pocketbase/client"
import { requestWebPushPermission, playNotificationSound } from "@/hooks/use-notifications-engine"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SettingsPage() {
  const user = useAuthStore((s) => s.user)
  const setUser = useAuthStore((s) => s.setUser)
  const settings = useDataStore((s) => s.settings)
  const updateSettings = useDataStore((s) => s.updateSettings)

  const [fullName, setFullName] = useState(user?.full_name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [budgetLimit, setBudgetLimit] = useState(settings.monthly_budget_limit.toString())
  const [webPush, setWebPush] = useState(settings.web_push_enabled)
  const [desktopAlerts, setDesktopAlerts] = useState(settings.desktop_alerts_enabled)
  const [audioAlerts, setAudioAlerts] = useState(settings.audio_alerts_enabled)
  const [leadDays, setLeadDays] = useState(settings.renewal_lead_days.toString())

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (user) {
      setUser({ ...user, full_name: fullName, email })
    }
    await updateSettings({
      monthly_budget_limit: parseFloat(budgetLimit) || 300,
      web_push_enabled: webPush,
      desktop_alerts_enabled: desktopAlerts,
      audio_alerts_enabled: audioAlerts,
      renewal_lead_days: parseInt(leadDays) || 3,
    })
    toast.success("Settings & Profile saved successfully!")
  }

  const handleToggleWebPush = (enabled: boolean) => {
    setWebPush(enabled)
    if (enabled) {
      requestWebPushPermission()
    }
  }

  return (
    <div className="space-y-8 pb-10 max-w-4xl">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Settings & Preferences</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account profile, PocketBase sync status, and multi-channel notification rules.
        </p>
      </div>

      {/* PocketBase Status Banner */}
      <div className={`p-4 rounded-2xl border flex items-center justify-between ${
        isPocketBaseConfigured
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
          : "border-primary/30 bg-primary/10 text-primary"
      }`}>
        <div className="flex items-center gap-3">
          <Database className="size-5" />
          <div>
            <p className="font-bold text-sm">
              {isPocketBaseConfigured ? "PocketBase Cloud Database Connected" : "Local Persistent Storage Active"}
            </p>
            <p className="text-xs opacity-80">
              {isPocketBaseConfigured
                ? "All user data, auth sessions, and CRUD operations are synchronized live with PocketBase cloud."
                : "App is running in persistent storage mode. Add VITE_POCKETBASE_URL to .env to connect cloud database."}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-8">
        {/* Profile Details */}
        <div className="rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 border-b border-border/40 pb-3">
            <User className="size-5 text-primary" />
            <h3 className="text-lg font-bold">Profile Details</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Full Name</Label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label>Email Address</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 border-b border-border/40 pb-3">
            <Bell className="size-5 text-primary" />
            <h3 className="text-lg font-bold">Multi-Channel Notifications</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm">Browser Web Push Notifications</p>
                <p className="text-xs text-muted-foreground">Receive real-time push alerts on desktop & mobile</p>
              </div>
              <input
                type="checkbox"
                checked={webPush}
                onChange={(e) => handleToggleWebPush(e.target.checked)}
                className="size-5 rounded border-border text-primary focus:ring-primary"
              />
            </div>

            <div className="flex items-center justify-between border-t border-border/30 pt-3">
              <div>
                <p className="font-semibold text-sm">Desktop In-App Banners</p>
                <p className="text-xs text-muted-foreground">Display active alert badges in TopBar and Notification Center</p>
              </div>
              <input
                type="checkbox"
                checked={desktopAlerts}
                onChange={(e) => setDesktopAlerts(e.target.checked)}
                className="size-5 rounded border-border text-primary focus:ring-primary"
              />
            </div>

            <div className="flex items-center justify-between border-t border-border/30 pt-3">
              <div className="flex items-center gap-2">
                <div>
                  <p className="font-semibold text-sm">Web Audio Chimes</p>
                  <p className="text-xs text-muted-foreground">Play a subtle audio tone when new notifications fire</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7 text-muted-foreground"
                  title="Test Sound"
                  onClick={playNotificationSound}
                >
                  <Volume2 className="size-3.5" />
                </Button>
              </div>
              <input
                type="checkbox"
                checked={audioAlerts}
                onChange={(e) => setAudioAlerts(e.target.checked)}
                className="size-5 rounded border-border text-primary focus:ring-primary"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 border-t border-border/30 pt-4">
              <div className="space-y-1.5">
                <Label>Renewal Alert Advance Days</Label>
                <Input
                  type="number"
                  min="1"
                  max="14"
                  value={leadDays}
                  onChange={(e) => setLeadDays(e.target.value)}
                />
                <p className="text-[11px] text-muted-foreground">Send renewal warnings N days before billing</p>
              </div>

              <div className="space-y-1.5">
                <Label>Monthly Spend Limit Target ($)</Label>
                <Input
                  type="number"
                  step="10"
                  value={budgetLimit}
                  onChange={(e) => setBudgetLimit(e.target.value)}
                />
                <p className="text-[11px] text-muted-foreground">Triggers budget limit alert when exceeded</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" size="lg" className="gap-2 px-6">
            <Save className="size-4" />
            <span>Save Preferences</span>
          </Button>
        </div>
      </form>
    </div>
  )
}
