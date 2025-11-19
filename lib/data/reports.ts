import { supabaseServer } from '@/lib/supabase/server';

type PostgrestErrorLike = {
  code?: string;
  message?: string;
};

function getClientOrNull() {
  try {
    return supabaseServer();
  } catch (error) {
    console.error('[Supabase] configuração ausente:', error);
    return null;
  }
}

function handleError<T>(error: PostgrestErrorLike | null, fallback: T, context: string) {
  if (!error) {
    return fallback;
  }
  if (error.code === '42P01') {
    console.warn(`[Supabase] ${context}: tabela não existe. Rode supabase/schema.sql.`);
    return fallback;
  }
  console.error(`[Supabase] ${context}:`, error.message ?? error);
  return fallback;
}

export async function listReports(userId: string) {
  const supabase = getClientOrNull();
  if (!supabase) {
    return [];
  }
  const { data, error } = await supabase
    .from('esg_reports')
    .select('id, company_name, industry, maturity, status, created_at, score')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return handleError(error, data ?? [], 'esg_reports');
}

export async function getReport(userId: string, reportId: string) {
  const supabase = getClientOrNull();
  if (!supabase) {
    throw new Error('Supabase não configurado. Informe NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.');
  }
  const { data, error } = await supabase
    .from('esg_reports')
    .select('*, esg_report_documents(document_id, documents(id, title, status))')
    .eq('user_id', userId)
    .eq('id', reportId)
    .single();

  if (error) {
    if (error.code === '42P01') {
      throw new Error('Tabela esg_reports não encontrada. Execute supabase/schema.sql.');
    }
    throw error;
  }

  return data;
}
