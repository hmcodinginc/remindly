import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { pb, isPocketBaseConfigured } from '@/lib/pocketbase/client'
import type { Profile } from '@/lib/pocketbase/types'

function formatPocketBaseError(error: any, defaultMsg: string): string {
  if (!error) return defaultMsg
  if (error.status === 0 || error.message === 'Failed to fetch') {
    return 'Database server is unreachable. Please check your network connection.'
  }
  const data = error.data?.data || error.response?.data
  if (data && typeof data === 'object') {
    const keys = Object.keys(data)
    if (keys.length > 0) {
      const firstKey = keys[0]
      const msg = data[firstKey]?.message
      if (msg) return `${firstKey}: ${msg}`
    }
  }
  return error.message || defaultMsg
}

export interface UserSession {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
}

interface AuthState {
  user: UserSession | null
  loading: boolean
  initialized: boolean
  setUser: (user: UserSession | null) => void
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: Error | null }>
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  deleteAccount: () => Promise<{ error: Error | null }>
  initializeAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      initialized: false,

      setUser: (user) => set({ user }),

      initializeAuth: async () => {
        if (!isPocketBaseConfigured) {
          set({ initialized: true })
          return
        }

        try {
          if (pb.authStore.isValid && pb.authStore.model) {
            const model = pb.authStore.model
            set({
              user: {
                id: model.id,
                email: model.email,
                full_name: model.full_name || model.name || model.email.split('@')[0],
                avatar_url: model.avatar ? pb.files.getUrl(model, model.avatar) : undefined,
              },
              initialized: true,
            })
          } else {
            set({ user: null, initialized: true })
          }
        } catch (err) {
          console.warn('PocketBase auth init notice:', err)
          set({ initialized: true })
        }
      },

      signUp: async (email, password, fullName) => {
        set({ loading: true })
        if (isPocketBaseConfigured) {
          try {
            await pb.collection('users').create({
              email,
              password,
              passwordConfirm: password,
              name: fullName,
            })
            // Authenticate immediately after register
            const authData = await pb.collection('users').authWithPassword(email, password)
            set({
              user: {
                id: authData.record.id,
                email: authData.record.email,
                full_name: authData.record.name || fullName,
              },
              loading: false,
            })
            return { error: null }
          } catch (error: any) {
            set({ loading: false })
            const msg = formatPocketBaseError(error, 'Registration failed')
            return { error: new Error(msg) }
          }
        } else {
          const user: UserSession = {
            id: 'user-' + Date.now(),
            email,
            full_name: fullName,
          }
          set({ user, loading: false })
          return { error: null }
        }
      },

      signIn: async (email, password) => {
        set({ loading: true })
        if (isPocketBaseConfigured) {
          try {
            const authData = await pb.collection('users').authWithPassword(email, password)
            const record = authData.record
            set({
              user: {
                id: record.id,
                email: record.email,
                full_name: record.full_name || record.name || record.email.split('@')[0],
              },
              loading: false,
            })
            return { error: null }
          } catch (error: any) {
            set({ loading: false })
            const msg = formatPocketBaseError(error, 'Invalid email or password')
            return { error: new Error(msg) }
          }
        } else {
          const user: UserSession = {
            id: 'user-' + Date.now(),
            email,
            full_name: email.split('@')[0],
          }
          set({ user, loading: false })
          return { error: null }
        }
      },

      signOut: async () => {
        if (isPocketBaseConfigured) {
          pb.authStore.clear()
        }
        set({ user: null })
      },

      deleteAccount: async () => {
        const user = get().user
        if (!user) return { error: new Error("No active user session found.") }

        set({ loading: true })
        if (isPocketBaseConfigured) {
          try {
            await pb.collection("users").delete(user.id)
            pb.authStore.clear()
            set({ user: null, loading: false })
            return { error: null }
          } catch (err: any) {
            set({ loading: false })
            const msg = formatPocketBaseError(err, 'Failed to delete account from PocketBase.')
            return { error: new Error(msg) }
          }
        } else {
          set({ user: null, loading: false })
          return { error: null }
        }
      },
    }),
    {
      name: 'remindly-auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
)
