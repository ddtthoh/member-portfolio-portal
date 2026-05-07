create table if not exists public.quiz_passes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  category text not null,
  score integer not null,
  total integer not null,
  passed_at timestamptz not null default now(),
  unique (user_id, category)
);

alter table public.quiz_passes enable row level security;

create policy "users view own quiz passes"
  on public.quiz_passes for select
  to authenticated
  using (auth.uid() = user_id);

create policy "users insert own quiz passes"
  on public.quiz_passes for insert
  to authenticated
  with check (auth.uid() = user_id);
