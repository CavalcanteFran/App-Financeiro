-- Regional preferences belong to a shared finance space, not one browser.
create table if not exists public.finance_space_preferences (
  space_id uuid primary key references public.finance_spaces(id) on delete cascade,
  currency text not null default 'USD' check (currency in ('USD', 'BRL', 'EUR')),
  date_format text not null default 'MM/DD/YYYY' check (date_format in ('MM/DD/YYYY', 'DD/MM/YYYY')),
  updated_at timestamptz not null default now()
);

alter table public.finance_space_preferences enable row level security;

grant select, insert, update on table public.finance_space_preferences to authenticated;

drop policy if exists "space members can manage preferences" on public.finance_space_preferences;
create policy "space members can manage preferences"
  on public.finance_space_preferences
  for all
  to authenticated
  using (public.has_space_access(space_id))
  with check (public.has_space_access(space_id));
