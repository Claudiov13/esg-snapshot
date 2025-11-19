create table if not exists public.profiles (
  id text primary key,
  email text not null,
  role text not null default 'user',
  documents_uploaded integer not null default 0,
  subscription_status text not null default 'trialing',
  created_at timestamp with time zone default timezone('utc', now())
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id text references public.profiles(id) on delete cascade,
  title text not null,
  storage_path text not null,
  status text not null default 'processing',
  created_at timestamp with time zone default timezone('utc', now())
);

create table if not exists public.subscriptions (
  id text primary key,
  user_id text references public.profiles(id) on delete cascade,
  plan text not null,
  status text not null,
  current_period_end timestamp with time zone,
  created_at timestamp with time zone default timezone('utc', now())
);

create table if not exists public.esg_reports (
  id uuid primary key default gen_random_uuid(),
  user_id text references public.profiles(id) on delete cascade,
  company_name text,
  industry text,
  company_size text,
  region text,
  maturity text,
  themes text,
  website text,
  status text not null default 'generated',
  executive_summary text,
  ods jsonb,
  gri_topics jsonb,
  risk_matrix jsonb,
  action_plan jsonb,
  kpis jsonb,
  score jsonb default '{}'::jsonb,
  inputs jsonb default '{}'::jsonb,
  supplier_summary text,
  created_at timestamp with time zone default timezone('utc', now()),
  updated_at timestamp with time zone default timezone('utc', now())
);

create table if not exists public.esg_report_documents (
  report_id uuid references public.esg_reports(id) on delete cascade,
  document_id uuid references public.documents(id) on delete cascade,
  primary key (report_id, document_id)
);

alter table if exists public.profiles disable row level security;
alter table if exists public.documents disable row level security;
alter table if exists public.subscriptions disable row level security;
alter table if exists public.esg_reports disable row level security;
alter table if exists public.esg_report_documents disable row level security;

create policy if not exists "Profiles are viewable by owner" on public.profiles for select using (auth.uid()::text = id);
create policy if not exists "Documents are viewable by owner" on public.documents for select using (auth.uid()::text = user_id);
create policy if not exists "Documents insert" on public.documents for insert with check (auth.uid()::text = user_id);
create policy if not exists "Reports are viewable by owner" on public.esg_reports for select using (auth.uid()::text = user_id);
create policy if not exists "Reports insert" on public.esg_reports for insert with check (auth.uid()::text = user_id);
create policy if not exists "Reports update" on public.esg_reports for update using (auth.uid()::text = user_id);
create policy if not exists "Report documents view" on public.esg_report_documents for select using (
  exists (select 1 from public.esg_reports r where r.id = report_id and auth.uid()::text = r.user_id)
);
create policy if not exists "Report documents insert" on public.esg_report_documents for insert with check (
  exists (select 1 from public.esg_reports r where r.id = report_id and auth.uid()::text = r.user_id)
);

alter table public.profiles enable row level security;
alter table public.documents enable row level security;
alter table public.subscriptions enable row level security;
alter table public.esg_reports enable row level security;
alter table public.esg_report_documents enable row level security;
