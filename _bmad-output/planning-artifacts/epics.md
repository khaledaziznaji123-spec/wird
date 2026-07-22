---
stepsCompleted: [step-01-validate-prerequisites, step-02-design-epics, step-03-create-stories]
inputDocuments:
  - _bmad-output/planning-artifacts/briefs/brief-wird-2026-07-23/brief.md
  - _bmad-output/planning-artifacts/prds/prd-wird-2026-07-23/prd.md
  - _bmad-output/planning-artifacts/architecture/architecture-wird-2026-07-23/ARCHITECTURE-SPINE.md
---

# Wird - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for **Wird**, decomposing the requirements from the PRD and Architecture spine into implementable stories. (No standalone UX design contract; UI is designed during build.)

## Requirements Inventory

### Functional Requirements

- **FR-1:** A visitor can create an account with email + password (min 8 chars); duplicates rejected.
- **FR-2:** A registered user can log in and log out; wrong credentials error; logout redirects protected pages.
- **FR-3:** A logged-in user stays logged in across refresh/revisit until logout; protected routes blocked when logged out.
- **FR-4:** A user can see a list of Topics and open any to view its Dhikr (≥ Morning, Evening + 3 situational).
- **FR-5:** A user can read a Dhikr's Arabic text (RTL, legible) and its recommended repetition count.
- **FR-6:** A user can tap a Dhikr to count down repetitions; at zero it's done; cannot go below zero.
- **FR-7:** A user can view a Dhikr's supporting Hadith with its Citation; every hadith is from the sourced dataset.
- **FR-8:** Finishing all Dhikr in a Daily-Routine Topic marks that Topic Day Complete for today; no double-count.
- **FR-9:** Streak increments on the first Day Complete of a new day and resets after a missed day; longest retained.
- **FR-10:** A user can see current Streak, longest Streak, and a simple history of completed days.
- **FR-11:** A user can enter any free-text topic and get authentic Hadith results (semantic search) with Citations; no-match shows a clear empty state, never a fabricated answer.
- **FR-12:** A user can save/remove a Hadith to/from Favorites; Favorites persist across sessions.
- **FR-13:** A logged-in user can view their profile: account info + stats (current/longest Streak, days completed, Favorites count).
- **FR-14:** A user can edit basic profile info (display name, preferred language, reminder times); changes persist.
- **FR-15:** A user/visitor can submit a support/contact message; valid form confirms success; invalid fields rejected.
- **FR-16:** A user can toggle UI language Arabic (RTL) ↔ English (LTR); choice persists; content stays Arabic.
- **FR-17:** A user can set/change/clear morning + evening reminder times and grant notification permission; times persist.
- **FR-18:** At each set time the user receives a push notification (Android + iPhone) that opens Wird at that Topic; suppressed if already Day Complete.
- **FR-19:** A user can read the full Quran by page (604 pages, Uthmani), navigating next/prev and jumping to a page/surah; page bounds respected.
- **FR-20:** A user can tap to play reciter audio (Mishary Alafasy) for the current page/ayah; pause/stop works.
- **FR-21:** The app remembers the user's last-read Quran page so they can resume.

### NonFunctional Requirements

- **NFR-1 (Authenticity):** All religious text (adhkar + hadith) comes from sourced datasets; ZERO AI-generated religious content; every hadith displays its collection + reference number.
- **NFR-2 (Security/Privacy):** All user-owned data protected by Supabase Row Level Security keyed to `auth.uid()`; service-role key and secrets never shipped to the client.
- **NFR-3 (Bilingual/RTL):** UI fully switchable AR (RTL) / EN (LTR); `dir` set at layout root from locale; no hardcoded UI strings.
- **NFR-4 (Mobile-first PWA):** Responsive, mobile-first; installable PWA working on Android and iPhone (iOS 16.4+ via Add-to-Home-Screen).
- **NFR-5 (Search performance):** Semantic search returns relevant results quickly using an HNSW index on 384-dim vectors.
- **NFR-6 (Notification reliability):** At most one reminder per (user, routine topic, day); suppressed when Day Complete; fires within a few minutes of the set time; send endpoint secret-guarded.
- **NFR-7 (Streak integrity):** Streak derived from `completions` rows (not a stored counter); completion idempotent per (user, topic, date).
- **NFR-8 (Arabic legibility):** Arabic content renders in a clear Naskh/Quranic-style font at readable size.

### Additional Requirements

*(From the Architecture spine — technical/setup work needed to deliver the FRs.)*

- **Scaffold:** Next.js 16.2 app (App Router, TypeScript, Tailwind) via `create-next-app` (no special starter template); connect to GitHub; deploy to Vercel early to validate the pipeline. *(→ Epic 1, Story 1.)*
- **Supabase setup:** create project; SQL migrations for all tables; enable `pgvector`; RLS policies on user-owned tables; a SQL function for streak computation.
- **Embeddings/search:** Supabase Edge Function `embed` running `gte-small` (384-dim); `hadiths.embedding vector(384)` with HNSW index; RPC similarity-search function.
- **Data seeding:** scripts to import adhkar (Hisn al-Muslim JSON), import hadith (`AhmedBaset/hadith-json`), generate hadith embeddings, and build the dhikr→proof-hadith mapping + topic tagging (authenticity-verified).
- **i18n:** `next-intl`; `messages/ar.json` + `messages/en.json`; `[locale]` routing; layout sets direction.
- **PWA/push:** Serwist (`@serwist/next`) service worker + `manifest.json` + icons; iOS Add-to-Home-Screen prompt; VAPID keys + `web-push`; `push_subscriptions` table; subscribe endpoint.
- **Scheduler:** Vercel Cron endpoint (secret-guarded) that sends due reminders.
- **Quran integration:** Al Quran Cloud API (free, no key) for page text (`/page/{n}/quran-uthmani`) + Mishary Alafasy audio; cache pages where practical; store last-read page on profile.
- **Deploy/config:** GitHub → Vercel; env vars (Supabase URL/anon/service keys, VAPID keys, CRON_SECRET); submit live URL.

### UX Design Requirements

*None — no standalone UX design contract was produced. UI/interaction design is handled inline during story implementation, guided by NFR-3 (bilingual/RTL), NFR-4 (mobile-first PWA), and NFR-8 (Arabic legibility).*

### FR Coverage Map

| FR | Story | FR | Story |
| --- | --- | --- | --- |
| FR-1 | 2.2 | FR-12 | 5.4 |
| FR-2 | 2.3 | FR-13 | 7.1 |
| FR-3 | 2.4 | FR-14 | 7.2 |
| FR-4 | 3.2 | FR-15 | 7.3 |
| FR-5 | 3.3 | FR-16 | 1.2 |
| FR-6 | 3.4 | FR-17 | 8.1, 8.2 |
| FR-7 | 3.5 | FR-18 | 8.3 |
| FR-8 | 4.1 | FR-19 | 6.1 |
| FR-9 | 4.2 | FR-20 | 6.2 |
| FR-10 | 4.3 | FR-21 | 6.3 |
| FR-11 | 5.3 | | |

## Epic List

1. **Epic 1 — Foundation & Deploy Pipeline:** scaffold Next.js, bilingual skeleton, PWA base, GitHub + Vercel live URL.
2. **Epic 2 — Accounts & Auth:** Supabase, sign up / log in / stay logged in, profiles + RLS.
3. **Epic 3 — Adhkar by Topic + Proof Hadith:** data model, seed sourced content, browse, counter, proof.
4. **Epic 4 — Daily Streak:** completions, streak logic, status + history.
5. **Epic 5 — Semantic Hadith Search + Favorites:** pgvector + gte-small, search UI, favorites.
6. **Epic 6 — Quran Reader:** read by page, reciter audio, resume last page.
7. **Epic 7 — Profile & Support:** profile view/edit, support form.
8. **Epic 8 — Reminders & Push Notifications:** permission + subscribe, set times, Cron sender (Android + iPhone).
9. **Epic 9 — Polish & Ship:** RTL/mobile polish, final deploy, submit URL.

---

## Epic 1: Foundation & Deploy Pipeline

**Goal:** A running, bilingual, installable Next.js app deployed live on Vercel — the skeleton everything else builds on. Deploy early so the pipeline is proven before features pile up.

### Story 1.1: Scaffold the Next.js app
As a developer, I want a Next.js 16.2 app (App Router, TypeScript, Tailwind), so that I have a clean base to build Wird on.
**Acceptance Criteria:**
**Given** an empty project **When** the app is scaffolded and started **Then** the dev server runs and shows a starter page.
**And** TypeScript + Tailwind are configured and working.

### Story 1.2: Bilingual skeleton (Arabic/English toggle) — FR-16
As a user, I want to switch the whole interface between Arabic (RTL) and English (LTR) in one press, so that I can use Wird in my language.
**Acceptance Criteria:**
**Given** the app open **When** I tap the language toggle **Then** all UI labels switch language and layout flips RTL↔LTR.
**And** the choice persists across refresh (stored locally, later tied to profile).
**And** UI strings come from `messages/ar.json` + `messages/en.json` (no hardcoded text).

### Story 1.3: PWA base (installable) — NFR-4
As a user, I want to install Wird to my home screen, so that it feels like an app (and can later send notifications).
**Acceptance Criteria:**
**Given** a supported browser **When** I visit Wird **Then** a manifest + service worker (Serwist) register and the app is installable.
**And** app icons + name show on install.

### Story 1.4: GitHub + Vercel deploy (live URL)
As a developer, I want the app on GitHub and auto-deployed to Vercel, so that I have a live URL to submit and every push ships.
**Acceptance Criteria:**
**Given** the repo pushed to GitHub **When** it's connected to Vercel **Then** the app builds and is reachable at a public Vercel URL.
**And** a new push triggers a new deploy.

## Epic 2: Accounts & Auth

**Goal:** Users can create an account, log in, and stay logged in; each user's data is protected.

### Story 2.1: Supabase project + client setup
As a developer, I want Supabase wired into the app, so that auth and data have a backend.
**Acceptance Criteria:**
**Given** a Supabase project **When** env vars + server/browser clients are configured **Then** the app can talk to Supabase without exposing the service-role key to the client.

### Story 2.2: Sign up — FR-1
As a visitor, I want to create an account with email + password, so that I can use Wird.
**Acceptance Criteria:**
**Given** the sign-up form **When** I submit a valid, unused email + password (≥8 chars) **Then** an account is created and I'm signed in.
**And** a duplicate email or short password is rejected with a clear message.

### Story 2.3: Log in / log out — FR-2
As a registered user, I want to log in and out, so that I can access and secure my account.
**Acceptance Criteria:**
**Given** valid credentials **When** I log in **Then** an authenticated session starts; wrong credentials show an error.
**And** logging out ends the session and protected pages redirect to login.

### Story 2.4: Stay logged in + protected routes — FR-3
As a user who signed in before, I want to stay logged in, so that I don't re-enter my password every time.
**Acceptance Criteria:**
**Given** I logged in earlier **When** I refresh or revisit **Then** I'm still authenticated until I log out.
**And** protected routes are blocked when logged out.

### Story 2.5: Profiles table + RLS
As a developer, I want a profile row per user, protected by RLS, so that user data is private and ready for stats/settings.
**Acceptance Criteria:**
**Given** a new signup **When** the account is created **Then** a `profiles` row is created for that user.
**And** RLS ensures a user can only read/write their own profile.

## Epic 3: Adhkar by Topic + Proof Hadith

**Goal:** Browse authentic adhkar organized by topic, count repetitions, and see the proof hadith for each.

### Story 3.1: Content schema + seed sourced data — NFR-1
As a developer, I want topics/adhkar/hadiths seeded from the sourced datasets, so that the app has authentic content.
**Acceptance Criteria:**
**Given** the seed scripts **When** they run **Then** `topics`, `adhkar`, `hadiths`, `adhkar_topics`, `adhkar_proof` are populated from Hisn al-Muslim + the hadith dataset.
**And** no content is AI-generated; each hadith has collection + reference number.
**And** these tables are read-only to app users.

### Story 3.2: Browse topics — FR-4
As a user, I want to see topics and open one, so that I can find the adhkar I need.
**Acceptance Criteria:**
**Given** the adhkar area **When** I open it **Then** I see topics including Morning, Evening, and situational ones (e.g., Anxiety, Sleep, Travel).
**And** opening a topic lists its dhikr in order.

### Story 3.3: View a dhikr — FR-5
As a user, I want to read a dhikr's Arabic text and repetition count, so that I can recite it correctly.
**Acceptance Criteria:**
**Given** a topic open **When** I view a dhikr **Then** its Arabic text renders RTL and legible with its repeat count (e.g., ×3, ×33).

### Story 3.4: Tap counter — FR-6
As a user, I want to tap to count repetitions, so that I can track each dhikr.
**Acceptance Criteria:**
**Given** a dhikr with a count **When** I tap **Then** the remaining count decrements; at zero it's marked done; it never goes below zero.

### Story 3.5: Proof hadith — FR-7
As a user, I want to see the hadith that proves a dhikr, so that I trust it's authentic.
**Acceptance Criteria:**
**Given** a dhikr **When** I view/expand its proof **Then** its supporting hadith + citation (collection + number) is shown, drawn from the dataset.

## Epic 4: Daily Streak

**Goal:** Completing the morning/evening routine builds a streak that rewards consistency.

### Story 4.1: Mark day complete — FR-8
As a user, I want finishing a routine topic to mark today done, so that my consistency is recorded.
**Acceptance Criteria:**
**Given** all dhikr in Morning (or Evening) done **When** I finish **Then** that topic is Day Complete for today (one `completions` row).
**And** re-opening it the same day shows done and does not double-count (idempotent).

### Story 4.2: Streak increment / reset — FR-9
As a user, I want my streak to grow each day and reset if I miss, so that it means something.
**Acceptance Criteria:**
**Given** past completions **When** streak is computed **Then** the first Day Complete of a new day increments current streak; a missed day resets it to 0; longest streak only increases.

### Story 4.3: Streak status + history — FR-10
As a user, I want to see my streak and history, so that I feel my momentum.
**Acceptance Criteria:**
**Given** I'm logged in **When** I view home/profile **Then** current streak, longest streak, and a simple recent-days history are shown.

## Epic 5: Semantic Hadith Search + Favorites

**Goal:** Type any topic and get authentic, cited hadiths by meaning; save favorites.

### Story 5.1: Vectors + embeddings seed — NFR-5
As a developer, I want hadith embeddings stored in pgvector, so that meaning-based search is possible.
**Acceptance Criteria:**
**Given** pgvector enabled **When** the embed-seed script runs **Then** each hadith has a `vector(384)` embedding (gte-small) and an HNSW index exists.

### Story 5.2: Embed-query edge function + similarity RPC
As a developer, I want a query embedded with the same model and matched, so that search results are relevant.
**Acceptance Criteria:**
**Given** the Supabase Edge Function (gte-small) **When** a query is embedded and passed to the similarity RPC **Then** the closest hadiths are returned.
**And** the query uses the same 384-dim model as stored vectors.

### Story 5.3: Search UI — FR-11
As a user, I want to search any topic and get authentic cited hadiths, so that I can reflect on the right one.
**Acceptance Criteria:**
**Given** the search box **When** I type a topic (e.g., "patience", "stress") **Then** relevant hadiths with citations appear.
**And** a no-match query shows a clear empty state — never a fabricated answer.

### Story 5.4: Favorites — FR-12
As a user, I want to save hadiths, so that I can revisit them.
**Acceptance Criteria:**
**Given** a hadith result **When** I save it **Then** it appears in my Favorites and persists; removing it takes it out. (RLS: only mine.)

## Epic 6: Quran Reader

**Goal:** Read the whole Quran page by page with reciter audio, and resume where you left off.

### Story 6.1: Read by page — FR-19
As a user, I want to read the Quran page by page, so that I can do my daily portion.
**Acceptance Criteria:**
**Given** the Quran reader **When** I open it **Then** the Uthmani text of a page renders RTL and legible.
**And** next/previous move by one page; jumping to a page/surah lands correctly; bounds 1–604 respected.

### Story 6.2: Reciter audio — FR-20
As a user, I want to hear the sheikh recite, so that I can listen and follow.
**Acceptance Criteria:**
**Given** a page open **When** I tap play **Then** Mishary Alafasy's recitation streams; pause/stop works; changing page stops/updates audio.

### Story 6.3: Resume last page — FR-21
As a user, I want Wird to remember my last page, so that I can continue my portion.
**Acceptance Criteria:**
**Given** I read to a page **When** I reopen the Quran **Then** I return to my last-read page (stored on profile).

## Epic 7: Profile & Support

**Goal:** The two remaining required features — a profile with stats, and a support/contact form.

### Story 7.1: Profile view — FR-13
As a user, I want a profile showing my info and stats, so that I can see my progress.
**Acceptance Criteria:**
**Given** I'm logged in **When** I open Profile **Then** I see my email/display name and stats (current/longest streak, days completed, favorites count).
**And** Profile is inaccessible when logged out.

### Story 7.2: Edit profile — FR-14
As a user, I want to edit my display name, language, and reminder times, so that Wird fits me.
**Acceptance Criteria:**
**Given** the profile editor **When** I change name/language/reminder times **Then** the changes persist and reflect across the app.

### Story 7.3: Support form — FR-15
As a user, I want to send a support/contact message, so that I can get help or give feedback.
**Acceptance Criteria:**
**Given** the support page **When** I submit a valid form (name/email/message) **Then** it's saved to `support_messages` and I see a success confirmation.
**And** empty/invalid required fields are rejected with clear messages.

## Epic 8: Reminders & Push Notifications

**Goal:** Real phone notifications at the user's set times, on Android and iPhone.

### Story 8.1: Permission + subscribe — FR-17 (part)
As a user, I want to allow notifications, so that Wird can remind me.
**Acceptance Criteria:**
**Given** the reminders setting **When** I enable notifications **Then** the app requests permission and stores my push subscription (`push_subscriptions`, RLS-protected).
**And** if denied, it explains how to enable and still saves my time preference.

### Story 8.2: Set reminder times — FR-17
As a user, I want to set morning + evening reminder times, so that I get nudged.
**Acceptance Criteria:**
**Given** the profile/reminders UI **When** I set/change/clear a time **Then** it persists to my profile.

### Story 8.3: Cron sender — FR-18
As a user, I want a notification at my set time, so that I don't forget my adhkar.
**Acceptance Criteria:**
**Given** a due time and granted permission **When** the Vercel Cron sender runs **Then** I receive one push (opening Wird at that topic) — at most once per topic per day, and never if already Day Complete.
**And** the send endpoint is secret-guarded (only Cron can call it).

### Story 8.4: iPhone install prompt — NFR-4
As an iPhone user, I want a prompt to Add-to-Home-Screen, so that notifications work on iOS.
**Acceptance Criteria:**
**Given** an iOS Safari visitor **When** notifications are unavailable **Then** an in-app prompt explains the one-time Add-to-Home-Screen step.

## Epic 9: Polish & Ship

**Goal:** Final quality pass and a submitted live URL.

### Story 9.1: RTL + mobile polish
As a user, I want the app to look clean on my phone in both languages, so that it feels finished.
**Acceptance Criteria:**
**Given** a phone-sized screen **When** I use Wird in Arabic and English **Then** layout, spacing, and RTL/LTR look correct across all pages.

### Story 9.2: Final deploy + smoke test
As a developer, I want a verified live deploy, so that I can submit the URL confidently.
**Acceptance Criteria:**
**Given** the final build on Vercel **When** I run the happy path (sign up → complete a routine → streak increments → search → Quran → set reminder) **Then** it works end-to-end on the live URL.
