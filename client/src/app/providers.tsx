import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { type ReactNode, useState } from "react"
import { BrowserRouter } from "react-router-dom"
import { Toaster } from "sonner"

import { TooltipProvider } from "@/components/ui/tooltip"
import { useThemeInit } from "@/hooks/use-theme"

type AppProvidersProps = {
  children: ReactNode
}

function ThemeBootstrap({ children }: { children: ReactNode }) {
  useThemeInit()
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
