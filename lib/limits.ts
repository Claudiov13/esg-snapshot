import { supabaseServer } from '@/lib/supabase/server';

type PlanLimits = {
  plan: string;
  status: string;
  allowedReports: number;
  allowedDocuments: number;
  remainingReports: number;
  remainingDocuments: number;
  bypassed?: boolean;
};

const ACTIVE_STATUSES = ['active', 'trialing', 'trial', 'succeeded', 'paid'];
const ONE_OFF_STATUSES = ['paid', 'succeeded', 'complete', 'completed'];
const BASE_FREE_ALLOWANCE = 1;

function getMonthRange() {
  const start = new Date();
  start.setUTCDate(1);
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setUTCMonth(start.getUTCMonth() + 1);
  return { start: start.toISOString(), end: end.toISOString() };
}

async function isSuperUser(userId: string, userEmail?: string): Promise<boolean> {
  const superEmails = (process.env.SUPERUSER_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const superIds = (process.env.SUPERUSER_IDS ?? '')
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean);

  if (superEmails.includes(userEmail?.toLowerCase() ?? '') || superIds.includes(userId)) {
    return true;
  }

  if (superEmails.length === 0) {
    return false;
  }

  // Fallback: tenta buscar email na tabela profiles, se houver.
  const supabase = supabaseServer();
  const { data } = await supabase.from('profiles').select('email').eq('id', userId).maybeSingle();
  const email = data?.email?.toLowerCase();
  return Boolean(email && superEmails.includes(email));
}

export async function getUsageLimits(userId: string, userEmail?: string): Promise<PlanLimits> {
  const supabase = supabaseServer();

  if (await isSuperUser(userId, userEmail)) {
    return {
      plan: 'super',
      status: 'active',
      allowedReports: Number.MAX_SAFE_INTEGER,
      allowedDocuments: Number.MAX_SAFE_INTEGER,
      remainingReports: Number.MAX_SAFE_INTEGER,
      remainingDocuments: Number.MAX_SAFE_INTEGER,
      bypassed: true
    };
  }

  const { data: subsData = [] } = await supabase
    .from('subscriptions')
    .select('plan,status')
    .eq('user_id', userId);

  const subs = subsData ?? [];
  const proSub = subs.find((item) => item.plan === 'pro' && ACTIVE_STATUSES.includes(item.status));
  const avulsoCount = subs.filter((item) => item.plan === 'avulso' && ONE_OFF_STATUSES.includes(item.status)).length;

  const plan = proSub ? 'pro' : avulsoCount > 0 ? 'avulso' : 'trial';
  const status = proSub?.status ?? (avulsoCount > 0 ? 'paid' : 'trial');

  const allowedReports = proSub ? 5 : avulsoCount > 0 ? BASE_FREE_ALLOWANCE + avulsoCount : BASE_FREE_ALLOWANCE;
  const allowedDocuments = proSub ? 5 : avulsoCount > 0 ? BASE_FREE_ALLOWANCE + avulsoCount : BASE_FREE_ALLOWANCE;

  const { start } = getMonthRange();
  const reportQuery = supabase
    .from('esg_reports')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId);
  const docQuery = supabase
    .from('documents')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId);

  // Para plano pro, conta só itens do mês corrente; para trial/avulso, conta histórico.
  if (plan === 'pro') {
    reportQuery.gte('created_at', start);
    docQuery.gte('created_at', start);
  }

  const [{ count: reportsCountRaw = 0 }, { count: documentsCountRaw = 0 }] = await Promise.all([reportQuery, docQuery]);
  const reportsCount = reportsCountRaw ?? 0;
  const documentsCount = documentsCountRaw ?? 0;

  return {
    plan,
    status,
    allowedReports,
    allowedDocuments,
    remainingReports: Math.max(allowedReports - reportsCount, 0),
    remainingDocuments: Math.max(allowedDocuments - documentsCount, 0)
  };
}
