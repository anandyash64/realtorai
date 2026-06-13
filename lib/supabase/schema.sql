create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null unique,
  company text,
  created_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  name text not null,
  phone text,
  email text,
  source text,
  budget text,
  timeline text,
  status text not null default 'New',
  qualification_answers jsonb not null default '{}'::jsonb,
  ai_notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  date timestamptz not null,
  status text not null check (status in ('Booked', 'Completed', 'Cancelled', 'No Show')),
  calendly_event_uri text,
  created_at timestamptz not null default now()
);

create table if not exists public.calls (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  transcript text,
  outcome text,
  recording_url text,
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;
alter table public.leads enable row level security;
alter table public.appointments enable row level security;
alter table public.calls enable row level security;

create policy "Users can manage own profile"
on public.users for all
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Users can manage own leads"
on public.leads for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can manage own appointments"
on public.appointments for all
using (
  exists (
    select 1 from public.leads
    where leads.id = appointments.lead_id
    and leads.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.leads
    where leads.id = appointments.lead_id
    and leads.user_id = auth.uid()
  )
);

create policy "Users can manage own calls"
on public.calls for all
using (
  exists (
    select 1 from public.leads
    where leads.id = calls.lead_id
    and leads.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.leads
    where leads.id = calls.lead_id
    and leads.user_id = auth.uid()
  )
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, name, email, company)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'company'
  )
  on conflict (id) do update
  set
    name = excluded.name,
    email = excluded.email,
    company = excluded.company;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
