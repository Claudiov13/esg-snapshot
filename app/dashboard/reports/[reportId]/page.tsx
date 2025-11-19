import Link from 'next/link';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getReport } from '@/lib/data/reports';
import { formatDate } from '@/lib/utils/formatters';
import { ReportSection } from '@/components/reports/report-section';
import { ScoreBoard } from '@/components/reports/score-board';

type DocumentLink = {
  document_id: string;
  documents?: {
    id: string;
    title: string;
    status: string;
  } | null;
};

type ReportScore = {
  environment?: number;
  social?: number;
  governance?: number;
};

export default async function ReportDetailPage({ params }: { params: { reportId: string } }) {
  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const report = await getReport(user.id, params.reportId);

  const ods = (report?.ods as any[]) ?? [];
  const gri = (report?.gri_topics as any[]) ?? [];
  const risks = (report?.risk_matrix as any[]) ?? [];
  const actions = (report?.action_plan as any[]) ?? [];
  const kpis = (report?.kpis as any[]) ?? [];
  const documents: DocumentLink[] = (report?.esg_report_documents as DocumentLink[]) ?? [];
  const score = (report?.score as ReportScore) ?? {};
  const supplierSummary = (report?.supplier_summary as string) ?? '';
  const inputs = (report?.inputs as any) ?? {};
  const questionnaire = inputs.questionnaire ?? {};
  const companyInputs = inputs.company ?? {};

  return (
    <section className="dashboard-shell">
      <div className="container" style={{ display: 'grid', gap: '1.5rem' }}>
        <div className="card" style={{ display: 'grid', gap: '0.75rem' }}>
          <Link href="/dashboard/reports" style={{ display: 'inline-flex' }}>
            &larr; Voltar
          </Link>
          <div>
            <h1 style={{ marginBottom: '0.25rem' }}>{report.company_name ?? 'Relatório ESG'}</h1>
            <p style={{ color: 'var(--gray-500)', margin: 0 }}>
              {(report.industry ?? 'Setor não informado')} • {(report.maturity ?? 'Maturidade indefinida')} • {formatDate(report.created_at)}
            </p>
          </div>
          <p>{report.executive_summary ?? 'Nenhum resumo disponível.'}</p>
        </div>

        <div className="card" style={{ display: 'grid', gap: '0.75rem' }}>
          <div>
            <h3 style={{ margin: 0 }}>Saúde ESG</h3>
            <p style={{ color: 'var(--gray-500)', margin: 0 }}>Percentuais definidos pela IA (0-100).</p>
          </div>
          <ScoreBoard score={score} />
        </div>

        <ReportSection title="ODS relevantes" emptyText="Nenhuma recomendação disponível." isEmpty={!ods.length}>
          <ul>
            {ods.map((item, index) => (
              <li key={index}>
                <strong>{item.goal}</strong>: {item.reason}
              </li>
            ))}
          </ul>
        </ReportSection>

        <ReportSection title="Tópicos GRI simplificados" emptyText="Sem tópicos listados." isEmpty={!gri.length}>
          <ul>
            {gri.map((item, index) => (
              <li key={index}>
                <strong>{item.topic}</strong>: {item.explanation ?? item.description}
              </li>
            ))}
          </ul>
        </ReportSection>

        <ReportSection title="Matriz de risco ESG" emptyText="Sem riscos registrados." isEmpty={!risks.length}>
          <table className="table">
            <thead>
              <tr>
                <th>Risco</th>
                <th>Probabilidade</th>
                <th>Impacto</th>
                <th>Prioridade</th>
              </tr>
            </thead>
            <tbody>
              {risks.map((risk, index) => (
                <tr key={index}>
                  <td>{risk.risk}</td>
                  <td>{risk.probability}</td>
                  <td>{risk.impact}</td>
                  <td>{risk.priority}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ReportSection>

        <ReportSection title="Plano de ação" emptyText="Sem ações sugeridas." isEmpty={!actions.length}>
          <ul>
            {actions.map((action, index) => (
              <li key={index}>
                <strong>{action.horizon ?? 'Plano'}</strong>: {action.actions ?? action.description}
              </li>
            ))}
          </ul>
        </ReportSection>

        <ReportSection title="Indicadores sugeridos (KPIs)" emptyText="Sem KPIs sugeridos." isEmpty={!kpis.length}>
          <ul>
            {kpis.map((kpi, index) => (
              <li key={index}>
                <strong>{kpi.name}</strong>: {kpi.description}
              </li>
            ))}
          </ul>
        </ReportSection>

        <ReportSection title="Contexto dos fornecedores" emptyText="Sem observações geradas." isEmpty={!supplierSummary.trim()}>
          <p style={{ margin: 0 }}>{supplierSummary}</p>
        </ReportSection>

        <ReportSection title="Respostas fornecidas" emptyText="Nenhuma resposta registrada." isEmpty={!Object.keys(questionnaire).length}>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {Object.entries(companyInputs).map(([key, value]) => (
              <div key={key} style={{ fontSize: '0.95rem' }}>
                <strong>{formatInputLabel(key)}</strong>: {String(value || '—')}
              </div>
            ))}
            {Object.entries(questionnaire).map(([key, value]) => (
              <div key={key} style={{ fontSize: '0.95rem' }}>
                <strong>{formatInputLabel(key)}</strong>: {String(value || '—')}
              </div>
            ))}
          </div>
        </ReportSection>

        <ReportSection title="Documentos relacionados" emptyText="Nenhum documento foi vinculado a este relatório." isEmpty={!documents.length}>
          <ul>
            {documents.map((item) => (
              <li key={item.document_id}>
                <Link href={`/dashboard/documents/${item.document_id}`}>{item.documents?.title ?? 'Documento'}</Link>
              </li>
            ))}
          </ul>
        </ReportSection>
      </div>
    </section>
  );
}

function formatInputLabel(key: string) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^./, (char) => char.toUpperCase());
}