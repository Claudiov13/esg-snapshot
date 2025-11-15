import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.warn('Missing Supabase service env vars');
}

export const supabaseServer = () => createClient(url ?? '', serviceKey ?? '');
