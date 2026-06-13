# RealtorAI

RealtorAI is a premium SaaS web application for real estate agents, teams, brokerages, and property investment firms. It contacts new leads in under 60 seconds, qualifies them with an AI voice agent, books appointments, and gives agents a clean operating dashboard.

## Stack

- Next.js App Router
- React
- Tailwind CSS
- Supabase Auth and database
- Calendly embed
- Integration-ready placeholders for Vapi, Twilio, Resend, and n8n

## Run

```bash
npm install
npm run dev
```

Create `.env.local` from `.env.example`, then add your Supabase, Calendly,
Vapi, Twilio, Resend, and n8n values. `SUPABASE_SERVICE_ROLE_KEY` is used only
by server routes such as `/api/leads`.

## Supabase

Run `lib/supabase/schema.sql` in the Supabase SQL editor. The UI is already wired to Supabase client helpers and includes the required tables:

- `users`
- `leads`
- `appointments`
- `calls`

New leads can be posted to `/api/leads`. The route stores the lead in Supabase
and triggers the n8n webhook defined by `N8N_WEBHOOK_URL`.

## Routes

- `/`
- `/pricing`
- `/demo`
- `/login`
- `/signup`
- `/forgot-password`
- `/profile`
- `/dashboard`
- `/dashboard/leads`
- `/dashboard/leads/[id]`
- `/dashboard/appointments`
- `/dashboard/analytics`
- `/dashboard/settings`
- `/dashboard/admin`
