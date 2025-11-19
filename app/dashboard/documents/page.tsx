import Link from 'next/link';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { DashboardShell } from '@/components/layouts/dashboard-shell';
import { listDocuments } from '@/lib/data/documents';
import { formatDate } from '@/lib/utils/formatters';

export default async function DocumentsPage() {
  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const documents = await listDocuments(user.id);

  return (
    <DashboardShell title="Documentos" description="Uploads em PDF registrados no Supabase.">
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Status</th>
              <th>Enviado em</th>
              <th>Relatórios</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id}>
                <td>
                  <Link href={`/dashboard/documents/${doc.id}`}>{doc.title}</Link>
                </td>
                <td>{doc.status}</td>
                <td>{formatDate(doc.created_at)}</td>
                <td>
                  {doc.reports.length ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {doc.reports.map((report) => (
                        <Link key={report.id} href={`/dashboard/reports/${report.id}`} className="badge" style={{ background: 'rgba(0,133,111,0.12)' }}>
                          {report.company_name ?? 'Relatório'}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <span style={{ color: 'var(--gray-400)' }}>-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardShell>
  );
}
