import { supabaseServer } from '@/lib/supabase/server';

export async function getDashboardStats(userId: string) {
  const supabase = supabaseServer();
  const [documentsResult, subscriptionResult] = await Promise.all([
    supabase
      .from('documents')
      .select('id, title, status, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('subscriptions')
      .select('status, plan')
      .eq('user_id', userId)
      .maybeSingle()
  ]);

  const totalDocuments = documentsResult.data?.length ?? 0;
  const plan = subscriptionResult.data?.plan ?? 'free';
  const status = subscriptionResult.data?.status ?? 'trialing';

  return {
    totalDocuments,
    latestDocuments: documentsResult.data ?? [],
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