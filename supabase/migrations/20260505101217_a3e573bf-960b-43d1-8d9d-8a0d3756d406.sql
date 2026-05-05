
-- PROFILES
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  account_number text unique default ('IV-' || upper(substr(md5(random()::text), 1, 8))),
  member_since date default current_date,
  advisor_name text default 'Henry Whitfield',
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "own profile select" on public.profiles for select using (auth.uid() = id);
create policy "own profile update" on public.profiles for update using (auth.uid() = id);
create policy "own profile insert" on public.profiles for insert with check (auth.uid() = id);

-- HOLDINGS
create table public.holdings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  asset_name text not null,
  ticker text,
  asset_class text not null default 'Equity',
  quantity numeric not null default 0,
  avg_cost numeric not null default 0,
  current_price numeric not null default 0,
  currency text not null default 'USD',
  created_at timestamptz not null default now()
);
alter table public.holdings enable row level security;
create policy "own holdings" on public.holdings for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- TRANSACTIONS
create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  asset text,
  amount numeric not null default 0,
  quantity numeric,
  price numeric,
  status text not null default 'completed',
  occurred_at timestamptz not null default now()
);
alter table public.transactions enable row level security;
create policy "own transactions" on public.transactions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- DOCUMENTS
create table public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  category text not null default 'Statement',
  period text,
  file_url text,
  size_bytes bigint,
  created_at timestamptz not null default now()
);
alter table public.documents enable row level security;
create policy "own documents" on public.documents for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- REPORTS
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  period text,
  summary text,
  file_url text,
  published_at timestamptz not null default now()
);
alter table public.reports enable row level security;
create policy "own reports" on public.reports for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- NETWORK
create table public.network_contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  role text,
  firm text,
  email text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now()
);
alter table public.network_contacts enable row level security;
create policy "own network" on public.network_contacts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- QNA
create table public.qna (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question text not null,
  answer text,
  status text not null default 'pending',
  asked_at timestamptz not null default now(),
  answered_at timestamptz
);
alter table public.qna enable row level security;
create policy "own qna" on public.qna for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- SUPPORT TICKETS
create table public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text not null,
  message text not null,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.support_tickets enable row level security;
create policy "own tickets" on public.support_tickets for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
