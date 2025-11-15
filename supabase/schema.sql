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

alter table public.profiles enable row level security;
alter table public.documents enable row level security;
alter table public.subscriptions enable row level security;

create policy "Profiles are viewable by owner" on public.profiles for select using (auth.uid() = id);
create policy "Documents are viewable by owner" on public.documents for select using (auth.uid() = user_id);
create policy "Documents insert" on public.documents for insert with check (auth.uid() = user_id);
