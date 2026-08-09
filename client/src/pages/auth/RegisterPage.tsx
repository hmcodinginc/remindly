import { useState } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthStore } from "@/store/use-auth-store"

export function RegisterPage() {
  const [searchParams] = useSearchParams()
  const plan = searchParams.get("plan") || "free"

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [existingUserNotice, setExistingUserNotice] = useState(false)

  const signUp = useAuthStore((s) => s.signUp)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setExistingUserNotice(false)

    const { error } = await signUp(email, password, fullName)
    setLoading(false)

    if (error) {
      const isDuplicate = error.message.toLowerCase().includes("already exists") || error.message.toLowerCase().includes("unique")
      if (isDuplicate) {
        setExistingUserNotice(true)
      }
      toast.error(error.message || "Registration failed")
    } else {
      toast.success(`Account created successfully (${plan.toUpperCase()} Plan)!`)
      navigate("/dashboard")
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1.5 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
        <p className="text-sm text-muted-foreground">
          Start tracking renewals, tasks, and daily habits with Remindly.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Alex Morgan"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
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
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            minLength={6}
            required
          />
        </div>

        {existingUserNotice && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-400 text-center space-y-1.5">
            <p className="font-semibold">Account Already Exists!</p>
            <p>An account with <span className="font-bold">{email}</span> is already registered.</p>
            <div className="pt-1 flex items-center justify-center gap-3 font-bold underline">
              <Link to="/login" className="hover:text-amber-200">Sign In Now →</Link>
              <Link to="/forgot-password" className="hover:text-amber-200">Reset Password →</Link>
            </div>
          </div>
        )}

        <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
          {loading ? "Creating Account..." : `Sign Up (${plan.toUpperCase()} Plan)`}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="text-primary font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
