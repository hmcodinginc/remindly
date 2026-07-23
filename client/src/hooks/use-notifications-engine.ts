import { useEffect } from 'react'
import { useDataStore } from '@/store/use-data-store'

// Synthesize pleasant notification audio chime using Web Audio API
export function playNotificationSound() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(587.33, ctx.currentTime) // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15) // A5

    gain.gain.setValueAtTime(0.1, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.35)
  } catch (e) {
    // ignore audio block
  }
}

export function requestWebPushPermission() {
  if ('Notification' in window) {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        new Notification('Remindly Push Notifications Active', {
          body: 'You will receive real-time web push alerts for upcoming subscription renewals and task reminders.',
          icon: '/favicon.ico',
        })
      }
    })
  }
}

export function triggerBrowserPush(title: string, body: string, actionUrl?: string) {
  if ('Notification' in window && Notification.permission === 'granted') {
    const notif = new Notification(title, {
      body,
      icon: '/favicon.ico',
    })
    if (actionUrl) {
      notif.onclick = () => {
        window.focus()
        window.location.href = actionUrl
      }
    }
  }
}

export function useNotificationsEngine() {
  const subscriptions = useDataStore((s) => s.subscriptions)
  const tasks = useDataStore((s) => s.tasks)
  const notifications = useDataStore((s) => s.notifications)
  const settings = useDataStore((s) => s.settings)
  const addNotification = useDataStore((s) => s.addNotification)

  useEffect(() => {
    const checkEngineRules = () => {
      const todayStr = new Date().toISOString().split('T')[0]
      const now = new Date()

      // 1. Subscription Renewal Alert Engine
      subscriptions.forEach((sub) => {
        if (sub.status !== 'active') return
        const renewalDate = new Date(sub.next_renewal_date)
        const diffDays = Math.ceil((renewalDate.getTime() - now.getTime()) / (1000 * 3600 * 24))

        if (diffDays >= 0 && diffDays <= (settings.renewal_lead_days || 3)) {
          const exists = notifications.some(
            (n) => n.type === 'subscription_renewal' && n.message.includes(sub.name)
          )
          if (!exists) {
            const title = `Renewal Notice: ${sub.name}`
            const message = `${sub.name} ($${sub.cost.toFixed(2)}) is due for renewal on ${sub.next_renewal_date} via ${sub.payment_method}.`
            addNotification({
              user_id: sub.user_id,
              title,
              message,
              type: 'subscription_renewal',
              read_status: 'unread',
              snoozed_until: null,
              action_url: '/subscriptions',
            })
            if (settings.audio_alerts_enabled) playNotificationSound()
            if (settings.web_push_enabled) triggerBrowserPush(title, message, '/subscriptions')
          }
        }

        // Budget Limit alert per subscription
        if (sub.budget_limit && sub.cost > sub.budget_limit) {
          const budgetExists = notifications.some(
            (n) => n.type === 'budget_alert' && n.message.includes(sub.name)
          )
          if (!budgetExists) {
            const title = `Budget Exceeded: ${sub.name}`
            const message = `${sub.name} cost ($${sub.cost.toFixed(2)}) exceeds set limit ($${sub.budget_limit.toFixed(2)}).`
            addNotification({
              user_id: sub.user_id,
              title,
              message,
              type: 'budget_alert',
              read_status: 'unread',
              snoozed_until: null,
              action_url: '/subscriptions',
            })
          }
        }
      })

      // 2. Task Due Date Alert Engine
      tasks.forEach((t) => {
        if (t.status === 'completed' || !t.due_date) return
        const dueDate = new Date(t.due_date)
        const isDueTodayOrOverdue = dueDate <= new Date(now.getTime() + 24 * 3600 * 1000)

        if (isDueTodayOrOverdue) {
          const exists = notifications.some(
            (n) => n.type === 'task_reminder' && n.message.includes(t.title)
          )
          if (!exists) {
            const title = `Task Deadline: ${t.title}`
            const message = `Priority task "${t.title}" is due soon.`
            addNotification({
              user_id: t.user_id,
              title,
              message,
              type: 'task_reminder',
              read_status: 'unread',
              snoozed_until: null,
              action_url: '/tasks',
            })
          }
        }
      })
    }

    checkEngineRules()
    const interval = setInterval(checkEngineRules, 60000) // check every minute
    return () => clearInterval(interval)
  }, [subscriptions, tasks, settings])
}
