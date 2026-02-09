# TheLoveMoreApp

A relationship engagement app for couples — built to strengthen emotional connection through daily rituals, deep conversation starters, shared planning tools, and AI-powered insights.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS + shadcn/ui component library |
| Backend | Supabase (Postgres, Auth, Realtime, Storage, Edge Functions) |
| State | React Query, React Context (AuthContext) |
| Charts | Recharts (budget visualizations) |
| AI | Lovable AI Gateway (Gemini) via Supabase Edge Functions |
| Routing | React Router v6 |

## App Structure

The app is organized into **five main areas** accessible from a bottom navigation bar:

### Today (`/`)
The daily starting screen. Shows:
- Personalized greeting with hero image
- Partner link banner (if not yet linked)
- Profile setup prompt (if profile incomplete)
- **Connection Ritual** — a daily 3-question flow drawn from conversation decks
- **Daily Check-In** — quick mood selection (stored in localStorage)
- **Suggested Action** — links into Plan, Date Night, Budget, or Vision Board
- **Upcoming Event** — next calendar event
- **Daily Reflection** — short free-text journal entry (localStorage)
- **Streak Counter** — days of consecutive engagement

### Engage (`/engage`)
All interactive engagement features in three tabs:
- **Talk** — Conversation decks (15+ themed decks, 1000+ questions), browsable and filterable
- **Play** — Activities & games (One-Word Check-In, Appreciation Shower, 5-Minute Repair, etc.)
- **Date** — AI-powered Date Night Generator with optional geolocation for local suggestions

### Plan (`/plan`)
Shared logistics and planning tools (requires partner link):
- **Calendar** — Shared couple calendar with categories, recurring events, and conversation prompts
- **Budget** — Monthly budget management with templates, category breakdown, and trend charts
- **Goals** — Shared goals with milestones and reflections, organized by category

### Insight (`/insight`)
Reflection and understanding tools:
- **Insights** — AI Conversation Analyzer (paste a conversation, get themed analysis and tool suggestions)
- **Love Languages** — Take the quiz, see results, compare with partner
- **Triggers** — Map emotional triggers, conflict styles; AI analysis of how triggers interact
- **Vision Board** — Shared vision items by timeframe (3-month, 1-year, 5-year) with AI-generated board images

### Settings (`/settings`)
- Account info and display name
- Partner invite code (copy/share) and partner linking
- Personal profile questionnaire (11-step flow that silently personalizes the AI experience)
- Sign out

### Legacy Redirects
- `/grow` → `/insight`
- `/partner` → `/settings`
- `/profile` → `/settings`

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `HomePage` | Today / daily starting screen |
| `/engage` | `EngagePage` | Talk, Play, Date tabs |
| `/plan` | `PlanHubPage` | Calendar, Budget, Goals tabs |
| `/insight` | `InsightPage` | Insights, Love, Triggers, Vision tabs |
| `/settings` | `SettingsPage` | Account, partner link, profile, sign out |
| `/auth` | `AuthPage` | Email sign up / sign in (redirects if already authed) |

## Supabase Tables

See [SUPABASE_SCHEMA.md](./SUPABASE_SCHEMA.md) for detailed column listings.

| Table | Purpose |
|-------|---------|
| `profiles` | User identity — display name, gender, invite code, couple link |
| `couples` | Shared couple record — all couple-scoped data references this |
| `personal_profiles` | Private per-user profile (interests, values, communication style, etc.) — used by AI |
| `todos` | Shared to-do items scoped to couple |
| `goals` | Shared goals with JSONB milestones and reflections |
| `calendar_events` | Shared calendar events with categories and recurrence |
| `budgets` | Monthly budget records with template and income |
| `budget_items` | Line items within a budget (expenses, savings) |
| `love_languages` | Per-user love language quiz scores and primary/secondary results |
| `trigger_profiles` | Per-user emotional trigger mapping (conflict style, hangups, etc.) |
| `vision_items` | Shared vision board items (images, goals, affirmations, notes) |

## Edge Functions

All edge functions are registered in `supabase/config.toml` and deployed automatically.

| Function | Purpose | Key Secret |
|----------|---------|------------|
| `analyze-conversation` | AI analysis of couple conversation text → themes, activities, tool suggestions | `LOVABLE_API_KEY` |
| `suggest-dates` | AI date night generator with optional geolocation | `LOVABLE_API_KEY` |
| `analyze-triggers` | AI analysis of both partners' trigger profiles → insights, misunderstandings | `LOVABLE_API_KEY` |
| `generate-vision-board` | AI-generated vision board summary + image from couple's vision items | `LOVABLE_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY` |

All edge functions gracefully handle rate limits (429), credit exhaustion (402), and missing configuration.

## Storage Buckets

| Bucket | Public | Purpose |
|--------|--------|---------|
| `vision-images` | Yes | User-uploaded and AI-generated vision board images |

## Running Locally

```bash
# 1. Clone and install
git clone <repo-url>
cd <project-dir>
npm install

# 2. Set environment variables
# Create a .env file with:
VITE_SUPABASE_URL=https://<project-id>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your-anon-key>

# 3. Start dev server
npm run dev
# App runs at http://localhost:8080
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | Yes | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Yes | Supabase anon/public key |

### Supabase Secrets (configured in Supabase dashboard)

| Secret | Required For |
|--------|-------------|
| `LOVABLE_API_KEY` | All AI edge functions |
| `SUPABASE_SERVICE_ROLE_KEY` | `generate-vision-board` (server-side DB reads) |
| `SUPABASE_URL` | `generate-vision-board` (server-side Supabase client) |

## Special Setup Notes

### Authentication
- Email/password auth is configured and working
- Google OAuth can be enabled via the [Supabase Auth Providers dashboard](https://supabase.com/dashboard/project/ddilxlabiifszdsfyqqk/auth/providers)
- A `handle_new_user` trigger auto-creates a `profiles` row on signup

### Partner Linking
- Each user gets a random 8-character invite code on signup
- The `link_partner` RPC function handles creating a `couples` record and linking both profiles
- All couple-scoped data uses a `get_user_couple_id()` helper function in RLS policies

### Realtime
- All couple-scoped hooks (todos, goals, calendar, budget, vision, love languages, triggers) subscribe to Supabase Realtime channels filtered by `couple_id`
- Channels are properly cleaned up on unmount via `supabase.removeChannel()`

### Placeholder / Future Work
- **Streak Counter**: Currently uses localStorage only — not persisted to Supabase
- **Daily Check-In & Reflection**: Currently localStorage-based — could be migrated to a Supabase table for cross-device sync
- **Profile questionnaire AI integration**: Personal profiles are stored but not yet queried by edge functions — a future enhancement would have AI functions read `personal_profiles` to personalize suggestions
- **Push notifications**: Not implemented — would require a service worker and notification table
