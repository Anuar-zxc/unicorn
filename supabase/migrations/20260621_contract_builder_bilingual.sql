alter table public.profiles
  add column if not exists ai_language text not null default 'en';

alter table public.profiles
  drop constraint if exists profiles_ai_language_check;

alter table public.profiles
  add constraint profiles_ai_language_check
  check (ai_language in ('en', 'ru'));

create table if not exists public.contract_types (
  id text primary key,
  name text not null,
  name_ru text not null,
  description text,
  description_ru text,
  available_for text[] not null default array['lawyer', 'individual'],
  complexity text not null default 'medium'
    check (complexity in ('simple', 'medium', 'complex')),
  icon text,
  category text,
  sort_order integer not null default 0
);

insert into public.contract_types
  (id, name, name_ru, description, description_ru, available_for, complexity, icon, category, sort_order)
values
  ('nda', 'NDA / Non-Disclosure Agreement', 'Соглашение о неразглашении', 'Protect confidential information shared between parties.', 'Защитите конфиденциальную информацию сторон.', array['lawyer','individual'], 'simple', '🤐', 'business', 1),
  ('freelance_agreement', 'Freelance / Service Agreement', 'Договор оказания услуг', 'Define scope, payment, deadlines, and ownership.', 'Зафиксируйте объём работ, оплату, сроки и права.', array['lawyer','individual'], 'simple', '💼', 'business', 2),
  ('rental_agreement', 'Rental / Lease Agreement', 'Договор аренды', 'Set terms between a landlord and tenant.', 'Определите условия между арендодателем и арендатором.', array['lawyer','individual'], 'medium', '🏠', 'real_estate', 3),
  ('employment_contract', 'Employment Contract', 'Трудовой договор', 'Draft a formal employer-employee agreement.', 'Подготовьте трудовой договор работодателя и работника.', array['lawyer'], 'complex', '👔', 'employment', 4),
  ('partnership_agreement', 'Partnership / Co-Founder Agreement', 'Партнёрское соглашение', 'Define roles, equity, decisions, and exits.', 'Определите роли, доли, решения и выход партнёров.', array['lawyer'], 'complex', '🤝', 'business', 5),
  ('saas_terms', 'SaaS Terms of Service', 'Условия использования SaaS', 'Create terms governing a software service.', 'Создайте условия использования программного сервиса.', array['lawyer'], 'complex', '☁️', 'business', 6),
  ('loan_agreement', 'Simple Loan Agreement', 'Договор займа', 'Document a loan between people or businesses.', 'Оформите передачу денег в долг.', array['lawyer','individual'], 'simple', '💵', 'personal', 7),
  ('roommate_agreement', 'Roommate Agreement', 'Соглашение о совместном проживании', 'Agree on rent, bills, responsibilities, and house rules.', 'Зафиксируйте аренду, счета, обязанности и бытовые правила.', array['individual'], 'simple', '🏡', 'personal', 8),
  ('sale_of_goods', 'Sale of Goods Agreement', 'Договор купли-продажи', 'Document the sale of a car, equipment, or other property.', 'Оформите продажу автомобиля, оборудования или другого имущества.', array['lawyer','individual'], 'simple', '📦', 'personal', 9),
  ('demand_letter', 'Demand Letter', 'Претензионное письмо', 'Demand payment or action before escalation.', 'Потребуйте оплату или действие до дальнейшего спора.', array['lawyer','individual'], 'medium', '📨', 'business', 10)
on conflict (id) do update set
  name = excluded.name,
  name_ru = excluded.name_ru,
  description = excluded.description,
  description_ru = excluded.description_ru,
  available_for = excluded.available_for,
  complexity = excluded.complexity,
  icon = excluded.icon,
  category = excluded.category,
  sort_order = excluded.sort_order;

create table if not exists public.draft_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  contract_type text not null references public.contract_types(id),
  account_type text not null check (account_type in ('lawyer', 'individual')),
  ai_language text not null default 'en' check (ai_language in ('en', 'ru')),
  conversation jsonb not null default '[]'::jsonb,
  collected_data jsonb not null default '{}'::jsonb,
  current_draft text,
  status text not null default 'in_progress'
    check (status in ('in_progress', 'complete', 'abandoned')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_draft_sessions_user_created
  on public.draft_sessions(user_id, created_at desc);

alter table public.contract_types enable row level security;
alter table public.draft_sessions enable row level security;

drop policy if exists "Contract types are readable" on public.contract_types;
create policy "Contract types are readable"
  on public.contract_types for select
  using (true);

drop policy if exists "Users read own draft sessions" on public.draft_sessions;
create policy "Users read own draft sessions"
  on public.draft_sessions for select
  using (auth.uid() = user_id);

drop policy if exists "Users create own draft sessions" on public.draft_sessions;
create policy "Users create own draft sessions"
  on public.draft_sessions for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users update own draft sessions" on public.draft_sessions;
create policy "Users update own draft sessions"
  on public.draft_sessions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users delete own draft sessions" on public.draft_sessions;
create policy "Users delete own draft sessions"
  on public.draft_sessions for delete
  using (auth.uid() = user_id);
