# Remindly

Premium productivity SaaS for subscriptions, renewals, reminders, habits, routines, tasks, analytics, and notifications.

## Repository Structure

```text
Remindly/
├── client/      # React frontend (Vite + TypeScript)
├── supabase/    # Reserved for future Supabase integration
├── Plan.md      # Detailed implementation plan (local only)
├── README.md
└── LICENSE
```

## Getting Started (Frontend)

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Scripts (from `client/`)

| Command           | Description                       |
| ----------------- | --------------------------------- |
| `npm run dev`     | Start Vite development server     |
| `npm run build`   | Production build                  |
| `npm run preview` | Preview production build          |
| `npm run lint`    | Run ESLint                        |
| `npm run format`  | Format with Prettier              |

## Tech Stack (Client)

- React 19, TypeScript, Vite
- Tailwind CSS v4, shadcn/ui, Framer Motion
- React Router, TanStack Query, Zustand
- React Hook Form, Zod, Lucide React, Sonner

## License

MIT
