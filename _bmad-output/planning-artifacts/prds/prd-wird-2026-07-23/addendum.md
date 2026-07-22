---
title: Wird PRD — Addendum (technical context for downstream)
created: 2026-07-23
updated: 2026-07-23
---

# Addendum — Wird

Depth that belongs downstream (Architecture, UX) rather than in the capability-focused PRD.

## Mandated tech stack (from the assignment)
- **Frontend:** Next.js (React).
- **Database + Auth:** Supabase (Postgres; Supabase Auth for email/password).
- **Hosting/Deploy:** Vercel, connected to a GitHub repo. Submit the live Vercel URL.
- **Process:** Claude connected via MCP to GitHub + Vercel; BMad-Method used throughout (artifacts inspected).

## Data model (first sketch — confirm/expand in Architecture)
- `topics` (id, slug, name_ar, name_en, kind: routine|situational, sort_order)
- `adhkar` (id, arabic_text, transliteration?, repeat_count, source_note)
- `adhkar_topics` (adhkar_id, topic_id) — many-to-many so a dhikr can appear in multiple topics
- `hadiths` (id, arabic_text, translation?, collection, reference_number, topics/tags)
- `adhkar_proof` (adhkar_id, hadith_id) — the proof hadith behind each dhikr
- `profiles` (user_id → Supabase auth user, display_name, language_pref, morning_reminder, evening_reminder)
- `completions` (user_id, topic_id, completed_date) — one row per routine-topic per day → drives streak
- `favorites` (user_id, hadith_id)
- `support_messages` (id, name, email, message, created_at)

## Streak logic notes
- Streak derived from `completions` (distinct completed_date where a routine topic was done).
- Evaluate "day" in the user's local timezone; compute current streak = consecutive days ending today/yesterday; longest = max run ever.
- No streak-freeze in v1.

## Hadith data / search (decide in Architecture)
- Need a real, openly-licensed, **sourced** hadith dataset (candidates to evaluate: open hadith datasets/APIs that include collection + number; must allow local seeding into Supabase). NEVER AI-generated.
- Search options to weigh:
  - **Keyword / full-text** via Postgres `tsvector` (simple, reliable; matches words in the translation/text).
  - **Semantic** via Supabase `pgvector` + embeddings (better for "any topic," more effort — good for the effort grade).
- The dhikr→proof-hadith mapping and the topic tagging of hadiths is a content-prep task, verified for authenticity.

## Reminders / push notifications (now in scope — FR-17–18)
Real phone notifications from a web app = **Web Push**, which requires Wird to be a **PWA**:
- **Service worker** registered; `manifest.json` so the app is installable.
- **Push subscription** per user/device stored in a `push_subscriptions` table (endpoint + keys).
- **VAPID keys** (public/private) for signing pushes; use the `web-push` library server-side.
- **Scheduler:** a **Vercel Cron** endpoint runs every minute/few-minutes, finds users whose reminder time matches (in their timezone) and whose routine topic isn't Day Complete, and sends the push.
- **Platform caveats:** Android/Chrome push works after permission grant. **iOS 16.4+ only delivers web push if the user Adds-to-Home-Screen** (installs the PWA). Note this for the demo device.
- Store timezone (or compute offset) per user so cron matches local time.
- New table: `push_subscriptions` (user_id, endpoint, p256dh, auth, created_at).

## i18n
- Bilingual UI (AR RTL / EN LTR). Use a lightweight i18n approach in Next.js; content (adhkar/hadith) stays Arabic regardless of UI language.

## Rejected / parked
- Native mobile apps — parked (web only).
- Real push notifications — parked to v2; v1 stores reminder-time preference only.
- Full hadith library browser — rejected (out of focus).
