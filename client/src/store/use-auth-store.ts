import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { pb, isPocketBaseConfigured } from '@/lib/pocketbase/client'
import type { Profile } from '@/lib/pocketbase/types'

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
  initializeAuth: () => Promise<void>
}

const DEFAULT_DEMO_USER: UserSession = {
  id: 'demo-user-123',
  email: 'alex.remindly@example.com',
  full_name: 'Alex Morgan',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: DEFAULT_DEMO_USER,
      loading: false,
      initialized: false,

      setUser: (user) => set({ user }),

      initializeAuth: async () => {
        if (!isPocketBaseConfigured) {
          if (!get().user) {
            set({ user: DEFAULT_DEMO_USER, initialized: true })
          } else {
            set({ initialized: true })
          }
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
              full_name: fullName,
            })
            // Authenticate immediately after register
            const authData = await pb.collection('users').authWithPassword(email, password)
            set({
              user: {
                id: authData.record.id,
                email: authData.record.email,
                full_name: fullName,
              },
              loading: false,
            })
            return { error: null }
          } catch (error: any) {
            set({ loading: false })
            return { error: new Error(error.message || 'Registration failed') }
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
            return { error: new Error(error.message || 'Invalid email or password') }
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
    }),
    {
      name: 'remindly-auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
)
