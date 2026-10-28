-- supabase.sql — à exécuter dans Supabase → SQL Editor (une fois par projet)
-- Tables de la plateforme Shift180

create table if not exists public.day_progress (
  user_id        uuid        not null references auth.users(id) on delete cascade,
  day            smallint    not null check (day between 1 and 180),
  completed_date date        not null,
  code           text        check (length(code) <= 20000),
  updated_at     timestamptz not null default now(),
  primary key (user_id, day)
);

alter table public.day_progress enable row level security;

create policy "Lecture de SA progression"
  on public.day_progress for select
  using (auth.uid() = user_id);

create policy "Écriture de SA progression"
  on public.day_progress for insert
  with check (auth.uid() = user_id);

create policy "Mise à jour de SA progression"
  on public.day_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- (optionnel) supprimer les jours si l'utilisateur est supprimé : géré par le cascade
