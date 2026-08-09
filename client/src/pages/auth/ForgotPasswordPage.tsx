import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthStore } from "@/store/use-auth-store"

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const resetPassword = useAuthStore((s) => s.resetPassword)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !newPassword.trim()) {
      return toast.error("Please fill in all fields.")
    }
    if (newPassword.length < 6) {
      return toast.error("New password must be at least 6 characters.")
    }

    setLoading(true)
    const { error, sentLink } = await resetPassword(email, newPassword)
    setLoading(false)

    if (error) {
      toast.error(error.message || "Failed to reset password.")
    } else if (sentLink) {
      setSubmitted(true)
      toast.success("Password reset instructions sent to your email!")
    } else {
      toast.success("Password updated successfully! Welcome back.")
      navigate("/dashboard")
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1.5 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Reset Account Password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your registered email address and set your new password below.
        </p>
      </div>

      {!submitted ? (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Registered Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password (min. 6 chars)"
              minLength={6}
              required
            />
          </div>

          <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
            {loading ? "Updating Password..." : "Reset Password & Sign In"}
          </Button>
        </form>
      ) : (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center text-sm text-emerald-400 space-y-2">
          <p className="font-semibold">Reset Link Sent!</p>
          <p className="text-xs opacity-90">
            Check your inbox ({email}) for instructions to complete your password reset.
          </p>
        </div>
      )}

      <p className="text-center text-sm text-muted-foreground">
        Remembered your password?{" "}
        <Link to="/login" className="text-primary font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
