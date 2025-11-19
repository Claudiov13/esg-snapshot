import Link from 'next/link';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getDocument } from '@/lib/data/documents';
import { formatDate } from '@/lib/utils/formatters';

export default async function DocumentDetail({ params }: { params: { documentId: string } }) {
  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const document = await getDocument(user.id, params.documentId);

  return (
    <section className="dashboard-shell">
      <div className="container card">
        <Link href="/dashboard/documents" style={{ display: 'inline-flex', marginBottom: '1rem' }}>
          &larr; Voltar
        </Link>
        <h1>{document.title}</h1>
        <p>Status: {document.status}</p>
        <p>Enviado em {formatDate(document.created_at)}</p>
        <div style={{ marginTop: '1.5rem' }}>
          <h3>Relatórios vinculados</h3>
          {document.reports.length ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {document.reports.map((report) => (
                <li key={report.id}>
                  <Link href={`/dashboard/reports/${report.id}`}>{report.company_name ?? 'Relatório ESG'}</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: 'var(--gray-500)' }}>Nenhum relatório gerado com este documento.</p>
          )}
        </div>
        <div className="chart-placeholder" style={{ marginTop: '2rem' }} />
      </div>
    </section>
  );
}
