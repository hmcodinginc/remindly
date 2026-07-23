import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { type ReactNode, useEffect, useState } from "react"
import { BrowserRouter } from "react-router-dom"
import { Toaster } from "sonner"

import { TooltipProvider } from "@/components/ui/tooltip"
import { useThemeInit } from "@/hooks/use-theme"
import { useAuthStore } from "@/store/use-auth-store"
import { useDataStore } from "@/store/use-data-store"

type AppProvidersProps = {
  children: ReactNode
}

function ThemeBootstrap({ children }: { children: ReactNode }) {
  useThemeInit()
  const initializeAuth = useAuthStore((s) => s.initializeAuth)
  const fetchData = useDataStore((s) => s.fetchData)

  useEffect(() => {
    initializeAuth()
    fetchData()
  }, [initializeAuth, fetchData])

  return children
}

export function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <ThemeBootstrap>
            {children}
            <Toaster richColors position="top-right" />
          </ThemeBootstrap>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
