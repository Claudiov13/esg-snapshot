import { supabaseServer } from '@/lib/supabase/server';

export async function listDocuments(userId: string) {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('documents')
    .select('id, title, status, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function getDocument(userId: string, documentId: string) {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('user_id', userId)
    .eq('id', documentId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}
