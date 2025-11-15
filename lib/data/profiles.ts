import { supabaseServer } from '@/lib/supabase/server';

export async function getProfile(userId: string) {
  const supabase = supabaseServer();
  const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
  return data;
}