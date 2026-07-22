import { useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { pb, isPocketBaseConfigured } from "@/lib/pocketbase/client"

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    if (isPocketBaseConfigured) {
      try {
        await pb.collection('users').requestPasswordReset(email)
        setLoading(false)
      } catch (error: any) {
        setLoading(false)
        toast.error(error.message || "Failed to send reset link")
        return
      }
    } else {
      setLoading(false)
    }
    setSubmitted(true)
    toast.success("Password reset instructions sent to your email!")
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1.5 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Reset password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your registered email address to receive a recovery link.
        </p>
      </div>

      {!submitted ? (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending link..." : "Send reset link"}
          </Button>
        </form>
      ) : (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center text-sm text-emerald-400">
          Check your email ({email}) for instructions to reset your password.
        </div>
      )}

      <p className="text-center text-sm text-muted-foreground">
        Remembered your password?{" "}
        <Link to="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
