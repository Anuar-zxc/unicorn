-- ============================================================
-- Lexo — Supabase Schema
-- Run this entire file in Supabase SQL Editor
-- ============================================================

-- Tables
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  company text,
  account_type text not null default 'individual' check (account_type in ('lawyer', 'individual')),
  role text default 'lawyer',
  bar_number text,
  practice_areas text[],
  firm_name text,
  jurisdiction text,
  firm_size text,
  biggest_time_sink text,
  onboarding_completed boolean not null default false,
  plan text not null default 'free' check (plan in ('free', 'solo', 'firm', 'enterprise')),
  stripe_customer_id text,
  stripe_subscription_id text,
  polar_customer_id text,
  polar_subscription_id text,
  subscription_status text not null default 'none',
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null default 'review',
  matter_name text,
  tool_type text,
  client_name text,
  tags text[],
  title text,
  file_name text,
  file_path text,
  file_url text,
  input_text text,
  extracted_text text,
  output_text text,
  result jsonb,
  status text not null default 'complete',
  created_at timestamptz not null default now()
);

create table if not exists public.lawyers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique,
  bio text,
  specialties text[] not null default '{}',
  jurisdictions text[] not null default '{}',
  price_per_session integer not null,
  rating numeric not null default 0,
  review_count integer not null default 0,
  avatar_color text not null default '#1A56E8',
  verified boolean not null default false,
  available boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  lawyer_id uuid references public.lawyers(id) on delete set null,
  analysis_id uuid references public.analyses(id) on delete set null,
  scheduled_at timestamptz,
  duration_minutes integer not null default 30,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  stripe_session_id text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  firm_owner_id uuid references public.profiles(id) on delete cascade,
  member_id uuid references public.profiles(id) on delete cascade,
  role text default 'member' check (role in ('admin', 'member')),
  invited_at timestamptz default now(),
  joined_at timestamptz,
  unique (firm_owner_id, member_id)
);

-- Existing-project migration (safe to run repeatedly)
alter table public.profiles add column if not exists role text default 'lawyer';
alter table public.profiles add column if not exists account_type text not null default 'individual';
alter table public.profiles add column if not exists bar_number text;
alter table public.profiles add column if not exists practice_areas text[];
alter table public.profiles add column if not exists firm_name text;
alter table public.profiles add column if not exists jurisdiction text;
alter table public.profiles add column if not exists firm_size text;
alter table public.profiles add column if not exists biggest_time_sink text;
alter table public.profiles add column if not exists onboarding_completed boolean not null default false;
alter table public.profiles add column if not exists polar_customer_id text;
alter table public.profiles add column if not exists polar_subscription_id text;
alter table public.profiles add column if not exists subscription_status text not null default 'none';
alter table public.profiles add column if not exists current_period_end timestamptz;
alter table public.profiles add column if not exists cancel_at_period_end boolean not null default false;
update public.profiles
set account_type = 'lawyer'
where role = 'lawyer' and onboarding_completed = true;
alter table public.profiles drop constraint if exists profiles_account_type_check;
alter table public.profiles add constraint profiles_account_type_check check (account_type in ('lawyer', 'individual'));
alter table public.analyses add column if not exists matter_name text;
alter table public.analyses add column if not exists tool_type text;
alter table public.analyses add column if not exists client_name text;
alter table public.analyses add column if not exists tags text[];

do $$
begin
  if exists (
    select 1 from pg_constraint
    where conname = 'profiles_plan_check'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles drop constraint profiles_plan_check;
  end if;
end $$;

update public.profiles
set plan = case plan when 'pro' then 'solo' when 'business' then 'firm' else plan end;

alter table public.profiles alter column plan set default 'free';
alter table public.profiles add constraint profiles_plan_check check (plan in ('free', 'solo', 'firm', 'enterprise'));

create index if not exists idx_profiles_polar_customer
  on public.profiles(polar_customer_id);

create unique index if not exists idx_profiles_polar_subscription
  on public.profiles(polar_subscription_id)
  where polar_subscription_id is not null;

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.analyses enable row level security;
alter table public.lawyers enable row level security;
alter table public.bookings enable row level security;
alter table public.team_members enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can read own analyses"
  on public.analyses for select
  using (auth.uid() = user_id);

create policy "Users can insert own analyses"
  on public.analyses for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own analyses"
  on public.analyses for delete
  using (auth.uid() = user_id);

create policy "Verified lawyers are publicly readable"
  on public.lawyers for select
  using (verified = true and available = true);

create policy "Users can read own bookings"
  on public.bookings for select
  using (auth.uid() = user_id);

create policy "Users can create own bookings"
  on public.bookings for insert
  with check (auth.uid() = user_id);

create policy "Firm owners can manage team members"
  on public.team_members for all
  using (auth.uid() = firm_owner_id)
  with check (auth.uid() = firm_owner_id);

create policy "Members can read own membership"
  on public.team_members for select
  using (auth.uid() = member_id);

-- Storage
insert into storage.buckets (id, name, public)
values ('contracts', 'contracts', false)
on conflict (id) do nothing;

create policy "Users can upload own contracts"
  on storage.objects for insert
  with check (bucket_id = 'contracts' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can read own contracts"
  on storage.objects for select
  using (bucket_id = 'contracts' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can delete own contracts"
  on storage.objects for delete
  using (bucket_id = 'contracts' and auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================================
-- Auto-create profile row on new user signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, company, account_type)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'company',
    coalesce(new.raw_user_meta_data->>'account_type', 'individual')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Drop existing trigger first (idempotent)
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- Seed verified lawyers
-- ============================================================
insert into public.lawyers (name, email, bio, specialties, jurisdictions, price_per_session, rating, review_count, verified, avatar_color)
values
('Sarah Mitchell', 'sarah.mitchell@lexo.ai', 'Former BigLaw attorney with 8 years in business contracts and employment law. Now helping SMBs get enterprise-quality legal advice.', array['Employment', 'Business Contracts', 'NDAs'], array['California', 'New York', 'Federal'], 7900, 4.9, 47, true, '#7C3AED'),
('James Chen', 'james.chen@lexo.ai', 'IP and tech law specialist. Worked with 50+ startups on founder agreements, SaaS terms, and GDPR compliance.', array['IP & Copyright', 'SaaS Contracts', 'GDPR'], array['California', 'EU', 'Federal'], 8900, 4.8, 31, true, '#0D7A4E'),
('Elena Vasquez', 'elena.vasquez@lexo.ai', 'Bilingual attorney specializing in cross-border business law and real estate contracts across US and Latin America.', array['Real Estate', 'Cross-border', 'Business Law'], array['Texas', 'Florida', 'Federal'], 6900, 4.9, 52, true, '#C2410C'),
('David Park', 'david.park@lexo.ai', 'Employment law expert focused on protecting employees and freelancers. Former public defender turned business advocate.', array['Employment', 'Freelance', 'Disputes'], array['New York', 'New Jersey', 'Federal'], 7400, 4.7, 28, true, '#1A56E8'),
('Anna Kowalski', 'anna.kowalski@lexo.ai', 'EU law specialist covering GDPR, consumer protection, and cross-border commercial contracts for European businesses.', array['GDPR', 'EU Law', 'Consumer Protection'], array['EU', 'UK', 'Germany'], 6500, 4.8, 19, true, '#B45309'),
('Michael Torres', 'michael.torres@lexo.ai', 'Real estate and landlord-tenant specialist with 12 years handling commercial leases and property disputes.', array['Real Estate', 'Landlord-Tenant', 'Disputes'], array['California', 'Arizona', 'Nevada'], 7900, 5.0, 63, true, '#065F46')
on conflict (email) do update set
  bio = excluded.bio,
  specialties = excluded.specialties,
  jurisdictions = excluded.jurisdictions,
  price_per_session = excluded.price_per_session,
  rating = excluded.rating,
  review_count = excluded.review_count,
  verified = excluded.verified,
  avatar_color = excluded.avatar_color;
