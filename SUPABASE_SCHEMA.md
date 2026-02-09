# TheLoveMoreApp — Supabase Schema Reference

## Core Concept: couple_id

Almost all data in the app is scoped to a **couple** — a shared record that links two partner accounts. The `couple_id` column is the primary access control mechanism.

### How couple_id Works

1. A user signs up → a `profiles` row is created automatically (via the `handle_new_user` trigger)
2. The user shares their `invite_code` with their partner
3. The partner calls the `link_partner()` RPC function with the code
4. A `couples` row is created, and both `profiles.couple_id` are set to it
5. All shared data (todos, goals, events, etc.) is scoped to this `couple_id`

### RLS Helper Function

```sql
get_user_couple_id(_user_id uuid) RETURNS uuid
```
Returns the `couple_id` from `profiles` for the given user. Used in nearly every RLS policy to verify the requesting user belongs to the couple that owns the data.

---

## Tables

### `couples`

The shared couple record. Created during partner linking.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid (PK) | Auto-generated |
| `created_at` | timestamptz | Default: `now()` |

**RLS:**
- SELECT: Users can view their own couple (`id = get_user_couple_id(auth.uid())`)
- INSERT: Only if user doesn't already have a couple
- UPDATE/DELETE: Not allowed

**Used by:** All couple-scoped features

---

### `profiles`

One row per user. Links users to couples and stores identity info.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid (PK) | Auto-generated |
| `user_id` | uuid | References `auth.users` |
| `display_name` | text (nullable) | Set on signup or editable later |
| `gender` | text (nullable) | Used for theme adaptation |
| `couple_id` | uuid (nullable) | FK → `couples.id`, null until linked |
| `invite_code` | text (nullable) | Random 8-char code for partner linking |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

**RLS:**
- SELECT: Own profile + partner profile (via `couple_id`)
- INSERT/UPDATE: Own profile only
- DELETE: Not allowed

**Used by:** Auth, Settings, partner linking, gender-adaptive theming

---

### `personal_profiles`

Private per-user profile questionnaire data. Not shared with partner.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid (PK) | |
| `user_id` | uuid | Owner |
| `couple_id` | uuid (nullable) | Set when user has a partner |
| `interests` | jsonb | Array of strings |
| `values` | jsonb | Array of strings |
| `communication_style` | text | |
| `relationship_goals` | text | |
| `relationship_strengths` | jsonb | Array of strings |
| `growth_areas` | jsonb | Array of strings |
| `ideal_date` | text | |
| `stress_relief` | text | |
| `appreciation_style` | text | |
| `quality_time_preferences` | jsonb | Array of strings |
| `dreams_and_aspirations` | text | |
| `completed` | boolean | True when questionnaire is finished |
| `created_at` / `updated_at` | timestamptz | |

**RLS:**
- All operations: Own profile only (`user_id = auth.uid()`)

**Used by:** Settings (profile questionnaire), future AI personalization

---

### `todos`

Shared to-do items for the couple.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid (PK) | |
| `couple_id` | uuid | FK → `couples.id` |
| `title` | text | |
| `completed` | boolean | Default: false |
| `category` | text | Default: `'personal'` |
| `created_by` | uuid (nullable) | Which partner created it |
| `created_at` | timestamptz | |

**RLS:** All operations scoped to `couple_id = get_user_couple_id(auth.uid())`

**Used by:** Plan hub → Goals tab

---

### `goals`

Shared relationship goals with milestones and reflections.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid (PK) | |
| `couple_id` | uuid | FK → `couples.id` |
| `title` | text | |
| `category` | text | e.g., communication, financial, intimacy |
| `completed` | boolean | |
| `milestones` | jsonb | Array of `{ id, text, completed }` |
| `reflections` | jsonb | Array of `{ id, text, date }` |
| `target_date` | text (nullable) | |
| `created_by` | uuid (nullable) | |
| `created_at` / `updated_at` | timestamptz | |

**RLS:** All operations scoped to `couple_id`

**Used by:** Plan hub → Goals tab

---

### `calendar_events`

Shared couple calendar.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid (PK) | |
| `couple_id` | uuid | FK → `couples.id` |
| `title` | text | |
| `date` | text | ISO date string (YYYY-MM-DD) |
| `time` | text (nullable) | |
| `category` | text | Default: `'custom'` (date-night, appointment, etc.) |
| `description` | text (nullable) | |
| `recurring` | text (nullable) | `'none'`, `'weekly'`, `'monthly'`, etc. |
| `conversation_prompt` | text (nullable) | Optional prompt tied to the event |
| `completed` | boolean | |
| `created_by` | uuid (nullable) | |
| `created_at` | timestamptz | |

**RLS:** All operations scoped to `couple_id`

**Used by:** Plan hub → Calendar tab, Today page → Upcoming Event

---

### `budgets`

Monthly budget records.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid (PK) | |
| `couple_id` | uuid | FK → `couples.id` |
| `month` | integer | 1–12 |
| `year` | integer | |
| `total_income` | numeric | Combined monthly income |
| `template` | text | Default: `'standard'` |
| `created_by` | uuid (nullable) | |
| `created_at` / `updated_at` | timestamptz | |

**RLS:** All operations scoped to `couple_id`

**Used by:** Plan hub → Budget tab

---

### `budget_items`

Line items within a budget.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid (PK) | |
| `budget_id` | uuid | FK → `budgets.id` |
| `couple_id` | uuid | FK → `couples.id` (denormalized for RLS) |
| `name` | text | |
| `category` | text | e.g., housing, food, savings |
| `type` | text | `'expense'` or `'savings'` |
| `planned_amount` | numeric | |
| `actual_amount` | numeric | |
| `created_at` | timestamptz | |

**RLS:** All operations scoped to `couple_id`

**Used by:** Plan hub → Budget tab

---

### `love_languages`

Per-user love language quiz results.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid (PK) | |
| `user_id` | uuid | Quiz taker |
| `couple_id` | uuid | For partner comparison |
| `words_of_affirmation` | integer | Score |
| `quality_time` | integer | Score |
| `receiving_gifts` | integer | Score |
| `acts_of_service` | integer | Score |
| `physical_touch` | integer | Score |
| `primary_language` | text | Highest-scoring language |
| `secondary_language` | text | Second-highest |
| `created_at` / `updated_at` | timestamptz | |

**RLS:**
- SELECT: Own results + partner results (via `couple_id`)
- INSERT/UPDATE/DELETE: Own results only

**Used by:** Insight hub → Love tab

---

### `trigger_profiles`

Per-user emotional trigger mapping.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid (PK) | |
| `user_id` | uuid | Profile owner |
| `couple_id` | uuid | For partner comparison |
| `emotional_triggers` | jsonb | Array of trigger strings |
| `childhood_triggers` | jsonb | Array of trigger strings |
| `hangups` | jsonb | Array of hangup strings |
| `conflict_style` | text | |
| `stress_response` | text | |
| `needs_when_triggered` | text | |
| `misread_signals` | text | |
| `created_at` / `updated_at` | timestamptz | |

**RLS:**
- SELECT: Own profile + partner profile (via `couple_id`)
- INSERT/UPDATE/DELETE: Own profile only

**Used by:** Insight hub → Triggers tab, `analyze-triggers` edge function

---

### `vision_items`

Shared vision board items.

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid (PK) | |
| `couple_id` | uuid | FK → `couples.id` |
| `type` | text | `'image'`, `'affirmation'`, `'goal'`, `'text'` |
| `content` | text | Item content |
| `image_url` | text (nullable) | URL to uploaded or generated image |
| `timeframe` | text | `'3-month'`, `'1-year'`, `'5-year'` |
| `color` | text (nullable) | CSS class for card styling |
| `created_by` | uuid (nullable) | |
| `created_at` | timestamptz | |

**RLS:** All operations scoped to `couple_id`

**Used by:** Insight hub → Vision tab, `generate-vision-board` edge function

---

## Database Functions

| Function | Purpose |
|----------|---------|
| `get_user_couple_id(uuid)` | Returns the `couple_id` for a user. Used in all RLS policies. |
| `handle_new_user()` | Trigger function: creates a `profiles` row when a new `auth.users` row is inserted. |
| `update_updated_at_column()` | Trigger function: sets `updated_at = now()` before UPDATE. |
| `link_partner(text)` | RPC: Links two users into a couple using an invite code. |

## RLS Summary

| Pattern | Tables |
|---------|--------|
| **Couple-scoped** (both partners see all) | `todos`, `goals`, `calendar_events`, `budgets`, `budget_items`, `vision_items` |
| **User-owned + partner-visible** (owner edits, partner can view) | `love_languages`, `trigger_profiles`, `profiles` |
| **User-private** (only owner can access) | `personal_profiles` |
| **Create-only with restrictions** | `couples` (insert only if no existing couple) |

## Feature → Table Mapping

| Feature | Tables Used |
|---------|------------|
| Auth & Identity | `profiles` |
| Partner Linking | `profiles`, `couples` |
| Personal Profile | `personal_profiles` |
| Todos | `todos` |
| Goals | `goals` |
| Calendar | `calendar_events` |
| Budget | `budgets`, `budget_items` |
| Love Languages | `love_languages` |
| Triggers | `trigger_profiles` |
| Vision Board | `vision_items`, `vision-images` bucket |
| AI Insights | reads from various tables via edge functions |
