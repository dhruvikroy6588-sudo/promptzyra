-- Newsletter subscribers: anyone can subscribe (insert only); only the admin can read/delete.
create table if not exists public.pz_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and length(email) <= 200),
  source text not null default 'site',
  created_at timestamptz not null default now()
);
alter table public.pz_subscribers enable row level security;
grant insert on public.pz_subscribers to anon, authenticated;
grant select, delete on public.pz_subscribers to authenticated;
drop policy if exists "pz anyone subscribe" on public.pz_subscribers;
create policy "pz anyone subscribe" on public.pz_subscribers for insert to anon, authenticated with check (true);
drop policy if exists "pz admin read subscribers" on public.pz_subscribers;
create policy "pz admin read subscribers" on public.pz_subscribers for select to authenticated using (public.pz_is_admin());
drop policy if exists "pz admin delete subscribers" on public.pz_subscribers;
create policy "pz admin delete subscribers" on public.pz_subscribers for delete to authenticated using (public.pz_is_admin());
