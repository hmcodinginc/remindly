import { useState } from "react"
import { motion } from "framer-motion"
import { CreditCard, Plus, Trash2, Edit2, AlertCircle, CheckCircle, PauseCircle, Search, Filter } from "lucide-react"
import { toast } from "sonner"
import { useDataStore } from "@/store/use-data-store"
import { CreateItemModal } from "@/components/modals/CreateItemModal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SubscriptionsPage() {
  const subscriptions = useDataStore((s) => s.subscriptions)
  const deleteSubscription = useDataStore((s) => s.deleteSubscription)
  const updateSubscription = useDataStore((s) => s.updateSubscription)

  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const categories = Array.from(new Set(subscriptions.map((s) => s.category)))

  const filteredSubs = subscriptions.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || (s.provider || "").toLowerCase().includes(search.toLowerCase())
    const matchesCat = categoryFilter === "all" || s.category === categoryFilter
    return matchesSearch && matchesCat
  })

  const totalMonthlyCost = subscriptions
    .filter((s) => s.status === "active")
    .reduce((acc, s) => {
      if (s.billing_cycle === "monthly") return acc + s.cost
      if (s.billing_cycle === "yearly") return acc + s.cost / 12
      if (s.billing_cycle === "weekly") return acc + s.cost * 4.33
      return acc
    }, 0)

  const totalAnnualCost = totalMonthlyCost * 12

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete subscription "${name}"?`)) {
      await deleteSubscription(id)
      toast.success(`Subscription "${name}" deleted`)
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "active" ? "paused" : "active"
    await updateSubscription(id, { status: nextStatus as any })
    toast.success(`Subscription status updated to ${nextStatus}`)
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Subscriptions & Recurring Payments</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track, analyze, and optimize all software, media, and cloud expenditures.
          </p>
        </div>
        <CreateItemModal defaultType="subscription" triggerText="Add Subscription" />
      </div>

      {/* Spending Overview Metric Bar */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border/60 bg-card/60 p-5 shadow-sm backdrop-blur-md">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Monthly Spend
          </span>
          <p className="mt-2 text-3xl font-extrabold">${totalMonthlyCost.toFixed(2)}</p>
          <p className="mt-1 text-xs text-muted-foreground">Active recurring subscriptions</p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/60 p-5 shadow-sm backdrop-blur-md">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Annual Projection
          </span>
          <p className="mt-2 text-3xl font-extrabold text-primary">${totalAnnualCost.toFixed(2)}</p>
          <p className="mt-1 text-xs text-muted-foreground">Projected yearly expenditure</p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/60 p-5 shadow-sm backdrop-blur-md">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Tracked Services
          </span>
          <p className="mt-2 text-3xl font-extrabold">{subscriptions.length}</p>
          <p className="mt-1 text-xs text-emerald-500 font-semibold">
            {subscriptions.filter((s) => s.status === "active").length} Active • {subscriptions.filter((s) => s.status === "paused").length} Paused
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search subscriptions by name or provider..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="size-4 text-muted-foreground" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm font-medium"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Subscriptions Grid / Table */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredSubs.length === 0 ? (
          <div className="col-span-full py-16 text-center rounded-2xl border border-dashed border-border/60 bg-card/20">
            <CreditCard className="mx-auto size-10 text-muted-foreground/50 mb-3" />
            <h3 className="text-lg font-bold">No subscriptions found</h3>
            <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filter or search criteria.</p>
          </div>
        ) : (
          filteredSubs.map((sub) => {
            const isOverBudget = sub.budget_limit && sub.cost > sub.budget_limit
            return (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-border/60 bg-card/60 p-5 shadow-sm backdrop-blur-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 font-bold text-primary text-base">
                        {sub.name[0]}
                      </div>
                      <div>
                        <h3 className="font-bold text-base">{sub.name}</h3>
                        <p className="text-xs text-muted-foreground">{sub.provider || sub.category}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleStatus(sub.id, sub.status)}
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        sub.status === "active"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-amber-500/15 text-amber-400"
                      }`}
                    >
                      {sub.status === "active" ? <CheckCircle className="size-3" /> : <PauseCircle className="size-3" />}
                      <span>{sub.status}</span>
                    </button>
                  </div>

                  <div className="mt-6 flex items-baseline justify-between border-t border-border/40 pt-4">
                    <div>
                      <span className="text-xs text-muted-foreground">Cost / Billing</span>
                      <p className="text-2xl font-black">${sub.cost.toFixed(2)} <span className="text-xs font-normal text-muted-foreground">/{sub.billing_cycle}</span></p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-muted-foreground">Next Renewal</span>
                      <p className="text-sm font-semibold">{sub.next_renewal_date}</p>
                    </div>
                  </div>

                  {sub.budget_limit && (
                    <div className="mt-4 space-y-1.5">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-muted-foreground">Budget Limit</span>
                        <span className={isOverBudget ? "text-red-400 font-bold" : "text-emerald-400"}>
                          ${sub.cost.toFixed(2)} / ${sub.budget_limit.toFixed(2)}
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            isOverBudget ? "bg-red-500" : "bg-emerald-500"
                          }`}
                          style={{
                            width: `${Math.min((sub.cost / sub.budget_limit) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-border/40 pt-3">
                  <span className="text-xs font-medium text-muted-foreground">{sub.payment_method}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-red-400 hover:bg-red-500/10"
                    onClick={() => handleDelete(sub.id, sub.name)}
                    title="Delete Subscription"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </motion.div>
            )
          })
        )}
      </div>
    </div>
  )
}
