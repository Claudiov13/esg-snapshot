import { supabaseServer } from '@/lib/supabase/server';

type PostgrestErrorLike = {
  code?: string;
  message?: string;
};

function handleSupabaseError<T>(error: PostgrestErrorLike | null, fallback: T, context: string): T {
  if (!error) {
    return fallback;
  }
  const isMissingTable = error.code === '42P01';
  const prefix = '[Supabase]';
  if (isMissingTable) {
    console.warn(`${prefix} ${context}: tabela não encontrada. Execute as migrações em supabase/schema.sql.`);
  } else {
    console.error(`${prefix} ${context}:`, error.message ?? error);
  }
  return fallback;
}

export async function getDashboardStats(userId: string) {
  let supabase;
  try {
    supabase = supabaseServer();
  } catch (error) {
    console.error('[Supabase] configuração ausente:', error);
    return {
      totalDocuments: 0,
      latestDocuments: [],
      totalReports: 0,
      latestReports: [],
      plan: 'free',
      status: 'trialing'
    };
  }
  const [documentsResult, reportsResult, subscriptionResult] = await Promise.all([
    supabase
      .from('documents')
      .select('id, title, status, created_at', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('esg_reports')
      .select('id, company_name, status, score, created_at', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('subscriptions')
      .select('status, plan')
      .eq('user_id', userId)
      .maybeSingle()
  ]);

  const documentsData = handleSupabaseError(documentsResult.error, documentsResult.data ?? [], 'documents');
  const reportsData = handleSupabaseError(reportsResult.error, reportsResult.data ?? [], 'esg_reports');
  const subscriptionData = subscriptionResult.error ? handleSupabaseError(subscriptionResult.error, null, 'subscriptions') : subscriptionResult.data;

  const totalDocuments = documentsResult.count ?? documentsData.length;
  const totalReports = reportsResult.count ?? reportsData.length;
  const plan = subscriptionData?.plan ?? 'free';
  const status = subscriptionData?.status ?? 'trialing';

  return {
    totalDocuments,
    latestDocuments: documentsData,
    totalReports,
    latestReports: reportsData,
    plan,
    status
  };
}

export async function getAdminUsers() {
  const supabase = supabaseServer();
  const { data } = await supabase
    .from('profiles')
    .select('id, email, role, documents_uploaded, subscription_status');
  return data ?? [];
}
