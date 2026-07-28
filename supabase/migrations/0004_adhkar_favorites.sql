-- Wird — favorite (saved) adhkar. Run in the Supabase SQL Editor.
create table if not exists public.adhkar_favorites (
  user_id uuid not null references auth.users (id) on delete cascade,
  adhkar_id int not null references public.adhkar (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, adhkar_id)
);
alter table public.adhkar_favorites enable row level security;
create policy "adhkar_fav_own" on public.adhkar_favorites for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
