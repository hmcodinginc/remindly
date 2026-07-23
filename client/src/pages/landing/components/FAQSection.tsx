import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.45, ease: "easeOut" as const },
}

const faqItems = [
  {
    question: "How does Remindly track subscription renewals?",
    answer: "You add your subscriptions with their billing cycle (monthly, yearly, weekly) and renewal date. Remindly evaluates these automatically and alerts you via in-app notifications, web push, or audio chimes days before charging occurs.",
  },
  {
    question: "What types of notifications does Remindly support?",
    answer: "Remindly supports Subscription Renewals, Task Deadlines, Habit Reminders, Budget Alerts, Weekly Summaries, and Monthly Summaries. It includes an in-app center (read/unread, snooze, archive, delete) plus browser Web Push API and audio chimes.",
  },
  {
    question: "Can I manage habits, tasks, and routines together?",
    answer: "Absolutely. Remindly combines all recurring elements of your life in one calm workspace, rendering upcoming events side-by-side on your unified calendar.",
  },
]

export function FAQSection() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0)

  return (
    <section id="faq" className="scroll-mt-24 border-t border-border/50 bg-muted/10 py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <motion.div className="text-center" {...fadeUp}>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">Got Questions?</span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-muted-foreground">
            Everything you need to know about Remindly and push notifications.
          </p>
        </motion.div>

        <div className="mt-12 space-y-4">
          {faqItems.map((item, index) => (
            <motion.div
              key={index}
              className="overflow-hidden rounded-2xl border border-border/60 bg-card/60 transition-colors"
              {...fadeUp}
            >
              <button
                type="button"
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className="flex w-full items-center justify-between p-5 text-left text-base font-semibold md:p-6"
              >
                <span>{item.question}</span>
                <ChevronDown
                  className={`size-5 text-muted-foreground transition-transform duration-200 ${
                    expandedFaq === index ? 'rotate-180 text-primary' : ''
                  }`}
                />
              </button>
              {expandedFaq === index && (
                <div className="border-t border-border/40 px-5 pb-5 pt-3 text-sm leading-relaxed text-muted-foreground md:px-6 md:pb-6">
                  {item.answer}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
