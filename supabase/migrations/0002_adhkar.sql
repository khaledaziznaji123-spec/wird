-- Wird — adhkar content tables (topics, adhkar, and their link).
-- Content is READ-ONLY to users (seeded from Hisn al-Muslim). Public read.
-- Run this in the Supabase SQL Editor.

create table if not exists public.topics (
  id serial primary key,
  slug text unique not null,
  name_ar text not null,
  name_en text not null,
  kind text not null default 'routine',
  sort_order int not null default 0
);

create table if not exists public.adhkar (
  id serial primary key,
  arabic_text text not null,
  repeat_count int not null default 1,
  count_description text,
  virtue text,          -- fadl (benefit)
  source_proof text,    -- the proof: hadith source + citation
  created_at timestamptz not null default now()
);

create table if not exists public.adhkar_topics (
  adhkar_id int not null references public.adhkar (id) on delete cascade,
  topic_id int not null references public.topics (id) on delete cascade,
  sort_order int not null default 0,
  primary key (adhkar_id, topic_id)
);

-- Content is public to read; nobody writes except the seed (service_role bypasses RLS).
alter table public.topics enable row level security;
alter table public.adhkar enable row level security;
alter table public.adhkar_topics enable row level security;

drop policy if exists "topics_read" on public.topics;
create policy "topics_read" on public.topics for select using (true);

drop policy if exists "adhkar_read" on public.adhkar;
create policy "adhkar_read" on public.adhkar for select using (true);

drop policy if exists "adhkar_topics_read" on public.adhkar_topics;
create policy "adhkar_topics_read" on public.adhkar_topics for select using (true);
