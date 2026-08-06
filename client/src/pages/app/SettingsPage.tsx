import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { User, Bell, Volume2, Shield, Database, Save, LogOut, Trash2, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import { useAuthStore } from "@/store/use-auth-store"
import { useDataStore } from "@/store/use-data-store"
import { isPocketBaseConfigured } from "@/lib/pocketbase/client"
import { requestWebPushPermission, playNotificationSound } from "@/hooks/use-notifications-engine"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SettingsPage() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const setUser = useAuthStore((s) => s.setUser)
  const signOut = useAuthStore((s) => s.signOut)
  const deleteAccount = useAuthStore((s) => s.deleteAccount)

  const settings = useDataStore((s) => s.settings)
  const updateSettings = useDataStore((s) => s.updateSettings)
  const clearData = useDataStore((s) => s.clearData)

  const [fullName, setFullName] = useState(user?.full_name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [budgetLimit, setBudgetLimit] = useState(settings?.monthly_budget_limit?.toString() || "300")
  const [webPush, setWebPush] = useState(settings?.web_push_enabled ?? true)
  const [desktopAlerts, setDesktopAlerts] = useState(settings?.desktop_alerts_enabled ?? true)
  const [audioAlerts, setAudioAlerts] = useState(settings?.audio_alerts_enabled ?? true)
  const [leadDays, setLeadDays] = useState(settings?.renewal_lead_days?.toString() || "3")

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

  const handleSignOut = async () => {
    await signOut()
    clearData()
    toast.success("Signed out successfully.")
    navigate("/login")
  }

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Are you sure you want to PERMANENTLY delete your account and all associated data? This action cannot be undone."
      )
    ) {
      return
    }

    const { error } = await deleteAccount()
    if (error) {
      toast.error(error.message || "Failed to delete account.")
    } else {
      clearData()
      toast.success("Account and workspace data permanently deleted.")
      navigate("/login")
    }
  }

  return (
    <div className="space-y-8 pb-10 max-w-4xl">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Settings & Preferences</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account profile, cloud sync status, and multi-channel notification rules.
        </p>
      </div>

      {/* Cloud Database Status Banner */}
      <div
        className={`p-4 rounded-2xl border flex items-center justify-between ${
          isPocketBaseConfigured
            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
            : "border-primary/30 bg-primary/10 text-primary"
        }`}
      >
        <div className="flex items-center gap-3">
          <Database className="size-5" />
          <div>
            <p className="font-bold text-sm">
              {isPocketBaseConfigured ? "Cloud Database Connected" : "Local Persistent Storage Active"}
            </p>
            <p className="text-xs opacity-80">
              {isPocketBaseConfigured
                ? "All user data, auth sessions, and workspace items are synchronized live with cloud storage."
                : "App is running in persistent storage mode."}
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

      {/* Account Management & Danger Zone */}
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 shadow-sm backdrop-blur-md space-y-4">
        <div className="flex items-center gap-2 border-b border-destructive/20 pb-3">
          <Shield className="size-5 text-destructive" />
          <h3 className="text-lg font-bold text-destructive">Account Management & Security</h3>
        </div>

        <p className="text-xs text-muted-foreground">
          Manage your session status or permanently remove your account from Remindly.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-2">
          <div className="space-y-0.5">
            <p className="font-semibold text-sm">Sign Out of Account</p>
            <p className="text-xs text-muted-foreground">Log out of your current session on this device</p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleSignOut}
            className="gap-2 border-border/80 hover:bg-background"
          >
            <LogOut className="size-4" />
            <span>Sign Out</span>
          </Button>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-destructive/20 pt-4">
          <div className="space-y-0.5">
            <p className="font-semibold text-sm text-destructive">Delete Remindly Account</p>
            <p className="text-xs text-muted-foreground">Permanently delete your user profile and clear all synced data</p>
          </div>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDeleteAccount}
            className="gap-2"
          >
            <Trash2 className="size-4" />
            <span>Delete Account</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
