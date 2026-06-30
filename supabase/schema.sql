-- Execute este script no SQL Editor do Supabase (Project > SQL Editor > New query)

create table if not exists public.queries (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  sql text not null,
  created_at timestamptz not null default now()
);

create index if not exists queries_title_idx on public.queries (title);

-- Acesso aberto (sem login): permite leitura e escrita públicas via API key anon.
alter table public.queries enable row level security;

create policy "Permitir leitura pública" on public.queries
  for select using (true);

create policy "Permitir cadastro público" on public.queries
  for insert with check (true);
