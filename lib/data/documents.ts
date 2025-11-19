import { supabaseServer } from '@/lib/supabase/server';

type DocumentRow = {
  id: string;
  title: string;
  status: string;
  created_at: string;
};

type ReportSummary = {
  id: string;
  company_name: string | null;
  status: string | null;
};

export type DocumentWithReports = DocumentRow & {
  reports: ReportSummary[];
};

function getClientOrNull() {
  try {
    return supabaseServer();
  } catch (error) {
    console.error('[Supabase] configuração ausente:', error);
    return null;
  }
}

function handleError<T>(error: { code?: string; message?: string } | null, fallback: T, context: string) {
  if (!error) {
    return fallback;
  }
  if (error.code === '42P01') {
    console.warn(`[Supabase] ${context}: tabela não existe. Execute supabase/schema.sql.`);
    return fallback;
  }
  console.error(`[Supabase] ${context}:`, error.message ?? error);
  return fallback;
}

function attachReports(
  documents: DocumentRow[],
  linkRows: Array<{ document_id: string; esg_reports: ReportSummary | ReportSummary[] | null }>
): DocumentWithReports[] {
  const map = new Map<string, ReportSummary[]>();
  linkRows.forEach((link) => {
    if (!link.document_id || !link.esg_reports) {
      return;
    }
    const reports = Array.isArray(link.esg_reports) ? link.esg_reports : [link.esg_reports];
    reports.forEach((report) => {
      if (!report) {
        return;
      }
      const list = map.get(link.document_id) ?? [];
      list.push(report);
      map.set(link.document_id, list);
    });
  });

  return documents.map((doc) => ({
    ...doc,
    reports: map.get(doc.id) ?? []
  }));
}

export async function listDocuments(userId: string): Promise<DocumentWithReports[]> {
  const supabase = getClientOrNull();
  if (!supabase) {
    return [];
  }
  const { data, error } = await supabase
    .from('documents')
    .select('id, title, status, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  const documents = handleError(error, data ?? [], 'documents');
  if (!documents.length) {
    return [];
  }

  const { data: links, error: linksError } = await supabase
    .from('esg_report_documents')
    .select('document_id, esg_reports(id, company_name, status)')
    .in(
      'document_id',
      documents.map((doc) => doc.id)
    );

  const linkRows = handleError(linksError, links ?? [], 'esg_report_documents');

  return attachReports(documents, linkRows);
}

export async function getDocument(userId: string, documentId: string): Promise<DocumentWithReports> {
  const supabase = getClientOrNull();
  if (!supabase) {
    throw new Error('Supabase não configurado. Informe NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.');
  }
  const { data, error } = await supabase
    .from('documents')
    .select('id, title, status, created_at')
    .eq('user_id', userId)
    .eq('id', documentId)
    .single();

  if (error) {
    if (error.code === '42P01') {
      throw new Error('Tabela documents não encontrada. Execute supabase/schema.sql.');
    }
    throw error;
  }

  if (!data) {
    throw new Error('Document not found');
  }

  const { data: links, error: linksError } = await supabase
    .from('esg_report_documents')
    .select('document_id, esg_reports(id, company_name, status)')
    .eq('document_id', documentId);

  const linkRows = handleError(linksError, links ?? [], 'esg_report_documents');

  const [documentWithReports] = attachReports([data], linkRows);
  return documentWithReports;
}
