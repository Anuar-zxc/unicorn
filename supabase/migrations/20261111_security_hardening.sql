-- ============================================================
-- Lexo — security hardening (2026-11-11)
-- Safe to run repeatedly in the Supabase SQL editor.
--
-- 1. Users can no longer change their own plan / billing fields.
--    Before this, any signed-in user could run
--      supabase.from('profiles').update({ plan: 'enterprise' })
--    from the browser console and unlock every paid feature.
-- 2. Monthly quotas are counted from an append-only usage_events table,
--    so deleting reports from history no longer resets the limit.
-- 3. Users can only create bookings in the 'pending' state.
-- ============================================================

-- 1. Billing columns are writable only by the service role (Polar webhook)
--    or by the database owner (SQL editor). The function runs as the caller
--    (security invoker), so current_user is 'authenticated' for app users.
create or replace function public.protect_profile_billing_columns()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if current_user in ('authenticated', 'anon') then
    new.id := old.id;
    new.email := old.email;
    new.plan := old.plan;
    new.stripe_customer_id := old.stripe_customer_id;
    new.stripe_subscription_id := old.stripe_subscription_id;
    new.polar_customer_id := old.polar_customer_id;
    new.polar_subscription_id := old.polar_subscription_id;
    new.subscription_status := old.subscription_status;
    new.current_period_end := old.current_period_end;
    new.cancel_at_period_end := old.cancel_at_period_end;
    new.created_at := old.created_at;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_billing_columns on public.profiles;
create trigger protect_profile_billing_columns
  before update on public.profiles
  for each row execute function public.protect_profile_billing_columns();

-- The update policy also needs a WITH CHECK so a row cannot be re-pointed.
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 2. Append-only usage ledger used for monthly quotas.
create table if not exists public.usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tool_type text not null check (char_length(tool_type) between 1 and 40),
  created_at timestamptz not null default now()
);

create index if not exists idx_usage_events_user_month
  on public.usage_events(user_id, tool_type, created_at desc);

alter table public.usage_events enable row level security;

drop policy if exists "Users read own usage" on public.usage_events;
create policy "Users read own usage"
  on public.usage_events for select
  using (auth.uid() = user_id);

drop policy if exists "Users append own usage" on public.usage_events;
create policy "Users append own usage"
  on public.usage_events for insert
  with check (auth.uid() = user_id);
-- No update/delete policies on purpose: the ledger is append-only for users.

-- Backfill the current month once so nobody gets a fresh quota mid-month.
insert into public.usage_events (user_id, tool_type, created_at)
select a.user_id, coalesce(a.tool_type, 'review'), a.created_at
from public.analyses a
where a.created_at >= date_trunc('month', now())
  and not exists (
    select 1 from public.usage_events u
    where u.user_id = a.user_id and u.created_at = a.created_at
  );

-- 3. Bookings can only be created as pending; confirmation comes from the webhook.
drop policy if exists "Users can create own bookings" on public.bookings;
create policy "Users can create own bookings"
  on public.bookings for insert
  with check (auth.uid() = user_id and status = 'pending');
