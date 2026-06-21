alter table public.profiles
  add column if not exists account_type text not null default 'individual';

alter table public.profiles
  add column if not exists onboarding_completed boolean not null default false;

update public.profiles
set account_type = 'lawyer'
where role = 'lawyer' and onboarding_completed = true;

alter table public.profiles
  drop constraint if exists profiles_account_type_check;

alter table public.profiles
  add constraint profiles_account_type_check
  check (account_type in ('lawyer', 'individual'));

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
  on conflict (id) do update set
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    company = coalesce(excluded.company, public.profiles.company),
    account_type = coalesce(excluded.account_type, public.profiles.account_type);
  return new;
end;
$$;
