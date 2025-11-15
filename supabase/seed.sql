insert into public.profiles (id, email, role, subscription_status)
values
  ('user_1', 'admin@esgsnapshot.dev', 'admin', 'active')
  on conflict (id) do nothing;
