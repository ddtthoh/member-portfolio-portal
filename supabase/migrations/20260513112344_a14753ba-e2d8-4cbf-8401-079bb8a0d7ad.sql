
create table if not exists public.monthly_reports (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  period text,
  file_url text not null,
  file_size bigint,
  uploaded_by uuid not null,
  created_at timestamptz not null default now()
);

alter table public.monthly_reports enable row level security;

create policy "anyone authenticated can view monthly reports"
  on public.monthly_reports for select to authenticated using (true);

create policy "authenticated can insert monthly reports"
  on public.monthly_reports for insert to authenticated
  with check (auth.uid() = uploaded_by);

create policy "uploader can delete own monthly reports"
  on public.monthly_reports for delete to authenticated
  using (auth.uid() = uploaded_by);

insert into storage.buckets (id, name, public)
values ('monthly-reports', 'monthly-reports', true)
on conflict (id) do nothing;

create policy "public read monthly-reports"
  on storage.objects for select
  using (bucket_id = 'monthly-reports');

create policy "authenticated upload monthly-reports"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'monthly-reports');

create policy "owner delete monthly-reports"
  on storage.objects for delete to authenticated
  using (bucket_id = 'monthly-reports' and owner = auth.uid());
