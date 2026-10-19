-- Run in the Supabase SQL editor (Project → SQL → New query). Safe to run again after updates.

create table if not exists public.dates (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.shared (
  key text primary key,
  value text not null default ''
);

create table if not exists public.messages (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.dates enable row level security;
alter table public.shared enable row level security;
alter table public.messages enable row level security;

-- Anyone holding the project's anon key can read and write.
-- Keep the key between the two of you.
drop policy if exists "garden access" on public.dates;
create policy "garden access" on public.dates for all using (true) with check (true);
drop policy if exists "garden access" on public.shared;
create policy "garden access" on public.shared for all using (true) with check (true);
drop policy if exists "garden access" on public.messages;
create policy "garden access" on public.messages for all using (true) with check (true);
