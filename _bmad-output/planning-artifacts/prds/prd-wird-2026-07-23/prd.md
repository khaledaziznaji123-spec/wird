---
title: Wird
status: final
created: 2026-07-23
updated: 2026-07-23
---

# PRD: Wird
*Working title — confirm.*

## 0. Document Purpose

This PRD is for Khalid (builder/PM) and the downstream BMad workflows (Architecture, Epics & Stories) that turn it into code. It builds on the approved Product Brief (`_bmad-output/planning-artifacts/briefs/brief-wird-2026-07-23/brief.md`) — read that for the "why." Here we define *what the product does*: features grouped, functional requirements (FRs) nested and globally numbered for stable references, vocabulary anchored in a Glossary, and inferred decisions tagged inline as `[ASSUMPTION]` and indexed in §9. Technology choices (Next.js, Supabase, Vercel, data sources) are capabilities' *how* — they live in `addendum.md`, not here.

## 1. Vision

Wird is a bilingual (Arabic/English) web app that makes daily adhkar a habit that *sticks*. Most Muslims already believe in the value of morning and evening adhkar; what fails is consistency. Wird borrows the feedback loop of a streak/fitness app — a visible chain of days you don't want to break — and applies it to worship.

Two things make Wird more than a checklist. First, adhkar are organized **by topic and situation** (morning, evening, anxiety, sleep, travel, gratitude…), so the user finds exactly the dhikr they need in the moment. Second, **every dhikr carries the authentic hadith that proves it** — trust is built in, not assumed. A companion search lets the user type any topic and receive a real, sourced hadith to reflect on.

It matters because the gap Wird closes is small but universal: the distance between *meaning to* keep up adhkar and *actually* doing it every day. Done well, Wird is the nudge that turns intention into a streak.

## 2. Target User

### 2.1 Jobs To Be Done
- **Functional:** "Help me actually do my morning/evening adhkar every day without forgetting."
- **Functional:** "When I'm anxious / travelling / going to sleep, get me straight to the right dhikr."
- **Emotional:** "Make me *feel* my consistency — give me momentum I don't want to lose."
- **Social/spiritual:** "Let me trust what I'm reading — show me it's authentic, with its source."
- **Contextual:** "Work on my phone in a few taps, in Arabic or English."

### 2.2 Non-Users (v1)
- Scholars/students wanting a full searchable hadith *library* or Quran study tool — Wird is a habit tool, not a reference corpus.
- Users who want social/community features (friends, sharing streaks, leaderboards).

### 2.3 Key User Journeys

- **UJ-1. Adam protects his streak before bed.**
  - **Persona + context:** Adam, 20, university student, prays but keeps forgetting his evening adhkar in the rush of the day.
  - **Entry state:** authenticated on his phone, opens Wird at night from a reminder notification.
  - **Path:** taps **Evening** topic → works through each dhikr, tapping the counter down to zero for each → the set completes → the day is marked done.
  - **Climax:** his streak ticks from 6 → **7 days**, the flame animates; he sees "longest streak: 7."
  - **Resolution:** closes the app satisfied, not wanting to break the chain tomorrow.
  - **Edge case:** if he already completed evening adhkar today, the set shows as done and the streak does not double-count.

- **UJ-2. Sara looks up a dhikr for anxiety — and checks it's real.**
  - **Persona + context:** Sara, feeling anxious before an exam, wants a dua/dhikr for distress.
  - **Entry state:** authenticated, opens Wird.
  - **Path:** opens the **Anxiety/Distress** topic → reads the dhikr in Arabic → taps "**proof**" and sees the supporting hadith with its collection + number.
  - **Climax:** she recites it, reassured it's authentic, not something invented.
  - **Resolution:** optionally saves it to favorites for next time.

- **UJ-3. Adam searches any topic for a hadith.**
  - Adam wonders what the Prophet ﷺ said about *patience*; from the search box he types "patience," gets an authentic hadith with its source, and saves it to favorites.

## 3. Glossary

- **Dhikr** — a single remembrance/supplication entry: Arabic text, recommended repetition count, and a supporting Hadith. Belongs to one or more Topics.
- **Adhkar** — the plural/collection of Dhikr.
- **Topic** — a category grouping Dhikr by situation or theme (e.g., Morning, Evening, Anxiety, Sleep, Travel, Gratitude). One Topic has many Dhikr; one Dhikr may appear in more than one Topic.
- **Daily Routine** — the specific Topics that count toward the streak: Morning and Evening. Situational Topics do not affect the streak.
- **Day Complete** — a user has finished all Dhikr in a Daily-Routine Topic for the calendar day (per the user's timezone).
- **Streak** — count of consecutive days with at least one Day Complete. Resets when a day is missed.
- **Hadith** — an authentic narration with a source Citation, drawn from a real sourced dataset. Used both as a Dhikr's proof and as a Search result. Never AI-generated.
- **Citation** — the Hadith's origin: collection name + reference number (e.g., "Sahih al-Bukhari 6405").
- **Favorite** — a Hadith the user saved to revisit.
- **Reminder** — an optional user-scheduled nudge to complete a Daily-Routine Topic.

## 4. Features

### 4.1 Authentication
**Description:** Users create an account and sign in so their Streak, history, and Favorites are theirs and persist across devices. Email/password for v1. Realizes the persistence behind UJ-1, UJ-2, UJ-3.

**Functional Requirements:**

#### FR-1: Sign up
A visitor can create an account with email + password.
**Consequences (testable):**
- A valid, unused email + password (min 8 chars) creates an account and signs the user in.
- A duplicate email is rejected with a clear message.
- Password below the minimum is rejected before submission.

#### FR-2: Log in / Log out
A registered user can log in and log out.
**Consequences (testable):**
- Correct credentials start an authenticated session; wrong credentials show an error and do not.
- Logging out ends the session; protected pages (Profile, streak data) then redirect to login.

#### FR-3: Session persistence
A logged-in user stays logged in across browser refreshes and revisits until they log out.
**Consequences (testable):**
- Refreshing the page keeps the user authenticated.
- Protected routes are inaccessible when logged out.

**Feature-specific NFRs:** Passwords never stored in plaintext (handled by the auth provider). `[ASSUMPTION: email/password only for v1; no social login, no email verification step required for the grade.]`

### 4.2 Adhkar by Topic (with proof)
**Description:** The heart of Wird. Adhkar are browsable by Topic. Each Dhikr shows its Arabic text, its recommended repetition count with a tap-counter, and its supporting Hadith (proof) with Citation. Realizes UJ-1, UJ-2.

**Functional Requirements:**

#### FR-4: Browse topics
A user can see a list of Topics and open any one to view its Dhikr.
**Consequences (testable):**
- Topics include at least: Morning, Evening, and 3+ situational Topics (e.g., Anxiety/Distress, Sleep, Travel). `[ASSUMPTION: exact topic list finalized from Hisn al-Muslim during content prep.]`
- Opening a Topic lists all its Dhikr in order.

#### FR-5: View a dhikr
A user can read a Dhikr's Arabic text and its recommended repetition count.
**Consequences (testable):**
- Arabic text renders correctly (RTL, legible font size).
- The repetition count (e.g., ×3, ×33, ×100) is shown.

#### FR-6: Tap counter per dhikr
A user can tap a Dhikr to count down its repetitions.
**Consequences (testable):**
- Each tap decrements the remaining count by one; at zero the Dhikr is marked done for the session.
- The counter cannot go below zero.

#### FR-7: View the proof hadith
A user can view the supporting Hadith for a Dhikr, with its Citation.
**Consequences (testable):**
- Each Dhikr displays (or expands to show) its supporting Hadith text and Citation.
- Every displayed Hadith comes from the sourced dataset — none are AI-generated.

**Feature-specific NFRs:** Arabic content must render in a clear Quranic/Naskh-style font at readable size. `[ASSUMPTION: content seeded from Hisn al-Muslim; each dhikr mapped to one supporting hadith during content prep.]`

**Notes:** `[NOTE FOR PM] Sourcing an accurate dhikr→hadith mapping is the biggest content task; scope the topic/dhikr count to what can be verified.`

### 4.3 Daily Streak (habit engine)
**Description:** Completing a Daily-Routine Topic marks the day done and advances the Streak. Realizes UJ-1.

**Functional Requirements:**

#### FR-8: Mark day complete
When a user finishes all Dhikr in a Daily-Routine Topic (Morning or Evening), that Topic is marked Day Complete for the current day.
**Consequences (testable):**
- Completing all Dhikr in Morning (or Evening) sets Day Complete for today.
- Re-opening a completed Topic the same day shows it as done and does not double-count.

#### FR-9: Advance / reset streak
The Streak increments on the first Day Complete of a new day and resets after a missed day.
**Consequences (testable):**
- First Day Complete on a new calendar day increments current Streak by 1.
- A calendar day with no Day Complete resets current Streak to 0 the next time the app evaluates it.
- Longest Streak is retained and only increases.

#### FR-10: View streak status
A user can see current Streak, longest Streak, and a simple history of completed days.
**Consequences (testable):**
- Current and longest streak values are visible on the home and/or profile.
- A basic history (e.g., last N days completed) is viewable.

**Feature-specific NFRs:** Day boundaries evaluated in the user's local timezone. `[ASSUMPTION: a "day" = calendar day in the browser's timezone; no streak-freeze/grace feature in v1.]`

### 4.4 Hadith Topic Search (companion)
**Description:** A search box where the user types any topic and receives a relevant, authentic Hadith with Citation, which they can favorite. Realizes UJ-3.

**Functional Requirements:**

#### FR-11: Search by topic
A user can enter any free-text topic and receive one or more authentic Hadith results with Citations.
**Consequences (testable):**
- A common topic (e.g., "patience," "gratitude") returns at least one Hadith with its Citation.
- Every result is from the sourced dataset; none are AI-generated.
- A topic with no match shows a clear "no results" state rather than a fabricated answer.

#### FR-12: Save / remove favorite
A user can save a Hadith to Favorites and remove it.
**Consequences (testable):**
- Saving adds the Hadith to the user's Favorites; it appears in their Favorites list.
- Removing takes it out; Favorites persist across sessions.

**Feature-specific NFRs:** Search must not invent or paraphrase Hadith; it only retrieves from the dataset. `[ASSUMPTION: search method (keyword vs. semantic) decided in Architecture; results ranked by relevance.]`

### 4.5 Profile
**Description:** Shows the user's personal data and worship stats. Satisfies the required Profile feature.

**Functional Requirements:**

#### FR-13: View profile
A logged-in user can view their profile: account info (email/display name) and stats (current + longest Streak, days completed, Favorites count).
**Consequences (testable):**
- Profile shows the user's email/display name and streak stats.
- Profile is only accessible when authenticated.

#### FR-14: Edit basic profile
A user can edit basic profile info (e.g., display name, preferred language, reminder times).
**Consequences (testable):**
- Changing display name / language / reminder time persists and reflects across the app.

### 4.6 Support
**Description:** A page for contact, complaints, and feedback. Satisfies the required Support feature.

**Functional Requirements:**

#### FR-15: Submit a support message
A user (or visitor) can submit a support/contact message via a form.
**Consequences (testable):**
- Submitting a valid form (name/email/message) records the message and shows a success confirmation.
- Invalid/empty required fields are rejected with clear messages.

**Feature-specific NFRs:** `[ASSUMPTION: messages stored in the database and/or emailed to the project owner; exact delivery decided in Architecture.]`

### 4.7 Bilingual Interface
**Description:** The UI can switch between Arabic (RTL) and English (LTR). Adhkar/Hadith content remains Arabic.

**Functional Requirements:**

#### FR-16: Toggle language
A user can switch the interface language between Arabic and English; the choice persists.
**Consequences (testable):**
- Toggling to Arabic switches UI labels to Arabic and layout to RTL; English switches back to LTR.
- The chosen language persists across sessions (tied to profile when logged in).

### 4.8 Reminders & Notifications
**Description:** The user sets morning/evening reminder times and receives a real push notification on their phone at those times — even when Wird isn't open. Delivered via Web Push (Wird as an installable PWA). Realizes the "don't let me forget" job behind UJ-1.

**Functional Requirements:**

#### FR-17: Set reminder times
A user can set (and change/clear) a morning and an evening reminder time, and grant notification permission.
**Consequences (testable):**
- Chosen reminder times persist to the user's profile.
- The app requests OS notification permission; if denied, it explains how to enable it and still saves the time preference.

#### FR-18: Receive push notification
At each set time, the user receives a push notification prompting them to complete that Daily-Routine Topic; tapping it opens Wird at that Topic.
**Consequences (testable):**
- With permission granted and a time set, a notification is delivered at (approximately) that time on a supported device.
- Tapping the notification opens Wird to the relevant Topic.
- If the day's Topic is already Day Complete, no reminder for it is sent that day. `[ASSUMPTION: suppress reminder once the topic is done for the day.]`

**Feature-specific NFRs:** Requires PWA install + service worker; on iOS, web push requires the user to Add-to-Home-Screen (iOS 16.4+). Scheduled delivery driven by a server-side scheduler (Vercel Cron) — see addendum. `[ASSUMPTION: reminder fires within a few minutes of the set time, not to-the-second.]`

### 4.9 Quran Reader
**Description:** The full Quran, read page by page, with a reciter you can play. Fits the meaning of *wird* (a daily recited portion). Text and audio come from a free, sourced Quran API (Al Quran Cloud) — read-only, never generated.

**Functional Requirements:**

#### FR-19: Read the Quran by page
A user can open the Quran and read it page by page (Madani Mushaf, 604 pages), navigating next/previous and jumping to a specific page or surah.
**Consequences (testable):**
- The Uthmani Arabic text of the requested page renders correctly (RTL, legible).
- Next/previous move by one page; jumping to a surah/page number lands on it.
- Page bounds are respected (no page < 1 or > 604).

#### FR-20: Play recitation
A user can tap a button to hear the page/ayah recited (Mishary Alafasy); they can pause/stop.
**Consequences (testable):**
- Tapping play streams the reciter audio for the current page/ayah.
- Pause/stop works; navigating pages stops or updates the audio.

#### FR-21: Resume last-read page
The app remembers the user's last-read Quran page so they can resume.
**Consequences (testable):**
- Reopening the Quran returns the logged-in user to their last-read page. `[ASSUMPTION: last page stored on the profile.]`

**Feature-specific NFRs:** Quran text + audio fetched from the Al Quran Cloud API/CDN (free, no key); cache pages where practical for speed and lighter data use. `[ASSUMPTION: online fetch acceptable for v1; offline Quran caching is a later enhancement.]`

## 5. Non-Goals (Explicit)
- Not a prayer-times app or qibla finder. (A Quran *reader* is in scope — FR-19–21 — but not full tafsir/word-by-word study.)
- Not a searchable hadith *library* / full-collection browser — search returns focused results, not a corpus explorer.
- No social features: no friends, sharing, or leaderboards.
- No native mobile apps — responsive web only.
- No AI-generated religious content of any kind.

## 6. MVP Scope

### 6.1 In Scope
- Email/password auth (FR-1–3)
- Adhkar browsable by Topic, tap counter, proof hadith per dhikr (FR-4–7)
- Daily streak on Morning/Evening routine (FR-8–10)
- Topic → authentic hadith search + favorites (FR-11–12)
- Profile with stats + basic edit (FR-13–14)
- Support/contact form (FR-15)
- Bilingual Arabic/English toggle (FR-16)
- **Reminders with real push notifications** via PWA/Web Push (FR-17–18)
- **Quran reader** — read by page + reciter audio + resume last page (FR-19–21)
- Responsive, mobile-first web (installable PWA)

### 6.2 Out of Scope for MVP
- Audio recitation of adhkar (v2)
- Custom user-authored adhkar lists (v2)
- Streak "freeze"/grace days (v2)
- Full hadith-collection browsing (out)

## 7. Success Metrics

**Primary**
- **SM-1:** A new user can sign up, complete a Daily-Routine Topic, and see the streak increment the next day. Target: works end-to-end on the deployed Vercel site. Validates FR-1, FR-8, FR-9.
- **SM-2:** Topic search returns an authentic, cited Hadith for a set of common topics. Target: 8/10 sample topics return a sensible cited result. Validates FR-11.

**Secondary**
- **SM-3:** All three required features (auth, profile, support) work end-to-end. Validates FR-1–3, FR-13, FR-15.

**Counter-metrics (do not optimize)**
- **SM-C1:** Don't inflate topic/dhikr *count* at the expense of authenticity — every dhikr's proof hadith must be correctly sourced. Counterbalances the temptation behind SM-2.

## 8. Open Questions
1. Final list of Topics and how many Dhikr per Topic for v1 (bounded by verifiable content).
2. Exact hadith dataset/source and licensing (decided in Architecture).
3. Search approach — RESOLVED: **semantic / meaning-based** (embeddings + vector search); exact model + tooling decided in Architecture.
4. Support message delivery: stored in DB, emailed, or both.
5. Reminders scope — RESOLVED: real push notifications (Web Push / PWA) are in scope (FR-17–18).
6. Platform support — RESOLVED: both Android **and** iPhone required. Design supports both via PWA/Web Push; iPhone users get an in-app "Add to Home Screen" prompt to enable notifications (iOS 16.4+).

## 9. Assumptions Index
- §4.1 — Email/password only for v1; no social login or email verification required.
- §4.2 — Content seeded from Hisn al-Muslim; each dhikr mapped to one supporting hadith during content prep; exact topic list finalized then.
- §4.3 — A "day" = calendar day in the browser's timezone; no streak-freeze in v1.
- §4.4 — Search is **semantic/meaning-based** (embeddings + vector search); retrieval only, never generation; exact model/tooling decided in Architecture.
- §4.6 — Support messages stored in DB and/or emailed; delivery decided in Architecture.
- §4.8 — Reminders fire within a few minutes (server cron), not to-the-second; reminder suppressed once the topic is Day Complete; iOS requires PWA install for push.
