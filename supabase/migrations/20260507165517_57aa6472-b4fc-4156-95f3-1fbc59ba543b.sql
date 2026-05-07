
create table public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('company','marketing')),
  question text not null,
  options jsonb not null,
  correct_index int not null,
  created_by uuid not null,
  created_at timestamptz not null default now()
);

alter table public.quiz_questions enable row level security;

create policy "auth read questions" on public.quiz_questions
  for select to authenticated using (true);

create policy "auth insert questions" on public.quiz_questions
  for insert to authenticated with check (auth.uid() = created_by);

create policy "owner delete questions" on public.quiz_questions
  for delete to authenticated using (auth.uid() = created_by);
