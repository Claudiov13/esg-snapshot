import Link from 'next/link';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { DashboardShell } from '@/components/layouts/dashboard-shell';
import { listReports } from '@/lib/data/reports';
import { formatDate } from '@/lib/utils/formatters';

function formatScore(score: any) {
  if (!score) {
    return '—';
  }
  const values = ['environment', 'social', 'governance']
    .map((key) => Number(score?.[key]))
    .filter((value) => !Number.isNaN(value));
  if (!values.length) {
    return '—';
  }
  const avg = Math.round(values.reduce((acc, value) => acc + value, 0) / values.length);
  return `${avg}%`;
}

export default async function ReportsPage() {
  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const reports = await listReports(user.id);

  return (
    <DashboardShell title="Relatórios ESG" description="Histórico de relatórios inteligentes gerados para sua empresa.">
      <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0 }}>Gerar novo relatório</h3>
          <p style={{ color: 'var(--gray-500)', margin: 0 }}>Conecte documentos e dados da empresa e deixe a IA trabalhar.</p>
        </div>
        <Link href="/dashboard/reports/new" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>
          Novo relatório ESG
        </Link>
      </div>
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Empresa</th>
              <th>Setor</th>
              <th>Maturidade</th>
              <th>Status</th>
              <th>Saúde ESG</th>
              <th>Criado em</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td>
                  <Link href={`/dashboard/reports/${report.id}`}>{report.company_name ?? 'Relatório ESG'}</Link>
                </td>
                <td>{report.industry ?? '—'}</td>
                <td>{report.maturity ?? '—'}</td>
                <td>{report.status}</td>
                <td>{formatScore(report.score)}</td>
                <td>{formatDate(report.created_at)}</td>
              </tr>
            ))}
            {reports.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: 'var(--gray-500)' }}>
                  Nenhum relatório ainda. Clique em &quot;Novo relatório ESG&quot; para começar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
