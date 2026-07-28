-- Wird — tables for streak, favorites, support, and hadith search.
-- Run this in the Supabase SQL Editor.

-- Streak: one row per (user, routine topic, day) — idempotent via PK.
create table if not exists public.completions (
  user_id uuid not null references auth.users (id) on delete cascade,
  topic_id int not null references public.topics (id) on delete cascade,
  completed_date date not null,
  created_at timestamptz not null default now(),
  primary key (user_id, topic_id, completed_date)
);
alter table public.completions enable row level security;
create policy "completions_select_own" on public.completions for select using (auth.uid() = user_id);
create policy "completions_insert_own" on public.completions for insert with check (auth.uid() = user_id);

-- Favorites (saved hadith).
create table if not exists public.favorites (
  user_id uuid not null references auth.users (id) on delete cascade,
  hadith_id int not null,
  created_at timestamptz not null default now(),
  primary key (user_id, hadith_id)
);
alter table public.favorites enable row level security;
create policy "favorites_own" on public.favorites for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Support / contact messages (anyone may submit; reads are service-role only).
create table if not exists public.support_messages (
  id serial primary key,
  user_id uuid references auth.users (id) on delete set null,
  name text,
  email text,
  message text not null,
  created_at timestamptz not null default now()
);
alter table public.support_messages enable row level security;
create policy "support_insert" on public.support_messages for insert with check (true);

-- Hadiths (for topic search).
create table if not exists public.hadiths (
  id serial primary key,
  collection text not null,
  reference text,
  arabic_text text not null,
  english_text text,
  created_at timestamptz not null default now()
);
alter table public.hadiths enable row level security;
create policy "hadiths_read" on public.hadiths for select using (true);
