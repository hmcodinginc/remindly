import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

import { AppBreadcrumb } from "@/components/common/AppBreadcrumb"
import { EmptyState } from "@/components/common/EmptyState"
import { PageHeader } from "@/components/common/PageHeader"

type FeaturePageProps = {
  title: string
  description: string
  emptyTitle: string
  emptyDescription: string
  icon: LucideIcon
  action?: ReactNode
}

export function FeaturePage({
  title,
  description,
  emptyTitle,
  emptyDescription,
  icon,
  action,
}: FeaturePageProps) {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <div className="space-y-4">
        <AppBreadcrumb
          items={[{ label: "App", href: "/dashboard" }, { label: title }]}
        />
        <PageHeader title={title} description={description} />
      </div>
      <EmptyState
        icon={icon}
        title={emptyTitle}
        description={emptyDescription}
        action={action}
      />
    </div>
  )
}
