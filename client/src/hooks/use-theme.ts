import { useEffect } from "react"

import { useAppStore } from "@/store/use-app-store"

/** Applies persisted theme on first paint / hydration. */
export function useThemeInit() {
  const theme = useAppStore((s) => s.theme)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    document.documentElement.classList.toggle("light", theme === "light")
  }, [theme])
}
