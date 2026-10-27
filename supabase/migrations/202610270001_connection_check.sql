-- Safe, read-only connectivity probe. Contains no financial or user data.
create table if not exists public.connection_check (
  id text primary key,
  checked_at timestamptz not null default now()
);

insert into public.connection_check (id)
values ('horizonte-ready')
on conflict (id) do update set checked_at = now();

alter table public.connection_check enable row level security;

grant select on table public.connection_check to anon, authenticated;

drop policy if exists "connection check is publicly readable" on public.connection_check;
create policy "connection check is publicly readable"
  on public.connection_check
  for select
  to anon, authenticated
  using (true);
