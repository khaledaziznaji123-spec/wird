---
title: "Product Brief: Wird — A Daily Worship Companion"
status: approved
created: 2026-07-23
updated: 2026-07-23
author: Khalid Aziz
---

# Product Brief: Wird

## Executive Summary

**Wird** is a bilingual (Arabic/English) web app that helps Muslims stay *consistent* with their daily morning and evening adhkar. Almost everyone knows the adhkar are important and almost everyone means to say them every day — yet the habit quietly slips: a busy morning, a forgotten evening, and the streak is gone. Wird treats daily dhikr the way a fitness app treats daily training: a clear list to work through, a tap-counter for each dhikr, and a **streak** that rewards showing up every day and gently stings when you miss.

The adhkar are organized **by topic** — morning, evening, and situations like anxiety, travel, or sleep — and **each dhikr carries the authentic hadith that proves it**, so trust is built in rather than assumed. A companion search extends this: type *any* topic and get a real, **sourced** hadith to reflect on. Every part serves one mission: **a daily, consistent, and trustworthy connection to worship.**

Wird is being built as a graded school project using a professional workflow (BMad-Method planning, Next.js + Supabase, deployed on Vercel). The goal is a small, genuinely useful product done *well* — not a feature pile.

## The Problem

The pain is **inconsistency**, not ignorance.

- People already believe in the value of morning/evening adhkar. What they lack is a system that makes doing it *every day* frictionless and rewarding.
- Today they cope with paper booklets (easy to put down and forget), generic phone reminders (easy to swipe away), or memory alone (the first thing to fail on a busy day).
- None of these give **feedback** — no sense of momentum, no visible record of "I've done this 12 days straight," nothing that makes breaking the chain feel costly. So the habit stays fragile.

A second, smaller friction: when someone *does* want to ground a feeling or a moment in the words of the Prophet ﷺ — "what did he say about patience?" — finding a **trustworthy, sourced** hadith fast is harder than it should be, and the web is full of unattributed or fabricated quotes.

## The Solution

A focused web app with two connected parts:

1. **Adhkar by topic, with proof (the core).** Adhkar are organized into **topics/situations** — morning, evening, and specific needs like anxiety, sleep, travel, distress, gratitude — so the user jumps straight to the dhikr they need right now. Each dhikr shows its Arabic text, recommended repetition count, and a tap-counter — **and its supporting hadith with source citation**, so the user can see the *evidence* that the dhikr is authentic, not just take it on faith. This is what ties the two ideas into one product: the hadith isn't a bolt-on, it's the *proof* behind the dhikr.

2. **Daily streak (the habit engine).** The morning + evening adhkar form the daily routine: complete them and the day is marked done. A **streak** counts consecutive days with a visible "flame" and a longest-streak record. Optional reminders nudge the user at their chosen morning/evening times. (Situational adhkar are available whenever needed; the streak is built on the daily routine so it stays meaningful.)

3. **Topic → hadith search (companion).** Beyond the adhkar, a single search box lets the user type **any** topic and get a relevant **authentic hadith with its source citation** (collection + number). Favorites can be saved. Every hadith — both the proofs behind adhkar and standalone search results — comes from a real, sourced dataset, **never AI-generated**, so nothing fabricated is attributed to the Prophet ﷺ.

Wrapping both: **accounts** (so your streak and favorites are *yours* and follow you across devices), a **profile** page showing your stats, and a **support** page for contact/feedback.

## What Makes This Different

Honest version — the edge here is **focus and feedback**, not a technical moat:

- **Habit-first, not content-first.** Most Islamic apps are big content libraries (full Quran + hadith + qibla + prayer times + tasbih + …). Wird deliberately does *one job* — daily adhkar consistency — and does it with the streak/feedback loop those apps lack.
- **Feedback loop borrowed from fitness/streak apps** applied to worship: momentum you can see, a chain you don't want to break.
- **Trust by construction** on the hadith side: every result is sourced; nothing is invented.
- Its "unfair advantage" is simply **execution and restraint** — a small, polished, specialized tool beats a bloated one for the person who just wants to keep their adhkar going.

## Who This Serves

**Primary user:** any practicing Muslim who *wants* to keep up daily morning/evening adhkar but keeps losing consistency. Any age, phone-and-web comfortable, motivated but busy. Success for them = "I've kept my streak, and it feels good to protect it."

**Secondary:** someone who occasionally wants a quick, trustworthy hadith on a topic to reflect on or share — served by the companion search without needing to be a daily streak user.

## Success Criteria

For a school project, success is a working, useful product plus evidence of a real process:

- A deployed, public Vercel URL where a visitor can sign up, complete a day's adhkar, and **see a streak increment** the next day.
- Topic search returns a **sourced** hadith for a range of everyday topics.
- All three required features work end-to-end: **auth, profile, support**.
- User data (streak, history, favorites) persists per-account in Supabase.
- The BMad planning artifacts (this brief → PRD → architecture → stories) exist and show the work.
- *User signal (aspirational):* a test user comes back a second and third day because the streak pulls them.

## Scope

**In (v1 — the graded build):**
- Email/password auth (sign up, log in, log out)
- Adhkar organized **by topic/situation** (Arabic): morning, evening + situational categories; each dhikr has a repetition counter **and its supporting/source hadith**
- Mark-day-complete on the morning/evening routine
- Daily streak: current streak, longest streak, simple history
- Topic → authentic hadith search with source citation; save favorites
- Profile page (user info + streak stats); Support/contact page
- Bilingual UI toggle (Arabic RTL / English LTR)
- Responsive, mobile-first web

**Out (v1 — explicitly not now):**
- Full Quran, prayer times, qibla, full hadith-collection browsing
- Social features / friends / leaderboards
- Native mobile apps (web only)
- Audio recitation of adhkar `[ASSUMPTION — could be a nice v2 add]`
- Custom user-authored adhkar lists

**Assumptions to confirm (Fast-path tags):**
- Adhkar content set = the well-known morning/evening adhkar (e.g. Hisn al-Muslim / Fortress of the Muslim). `[ASSUMPTION]`
- Reminders = in-app plus optional browser notifications (not SMS/email push). `[ASSUMPTION]`
- Hadith data = a free, openly-licensed, **sourced** hadith dataset/API; exact source decided in the Architecture step. `[ASSUMPTION]`
- "Any topic" search = matching over the hadith dataset (keyword and/or meaning-based); precise method decided in Architecture. `[ASSUMPTION]`

## Vision

If it succeeds beyond the assignment, Wird grows into a trusted daily-worship habit companion: audio adhkar, a tasbih mode, gentle streak "freezes" for travel/illness, richer reflection prompts tied to the day's hadith, and eventually a broader habit set (Quran page-a-day, sunnah fasts) — always keeping the same discipline: **help people be consistent, without becoming bloated.**

---

*Open questions for Khalid: confirm the four `[ASSUMPTION]` items above, and whether reminders are must-have for v1 or a stretch goal.*
