-- Run once in the Supabase SQL editor (Project → SQL → New query).

create table if not exists public.dates (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.shared (
  key text primary key,
  value text not null default ''
);

alter table public.dates enable row level security;
alter table public.shared enable row level security;

-- Anyone holding the project's anon key can read and write.
-- Keep the key between the two of you.
create policy "garden access" on public.dates for all using (true) with check (true);
create policy "garden access" on public.shared for all using (true) with check (true);
