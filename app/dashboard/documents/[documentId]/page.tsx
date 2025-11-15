import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getDocument } from '@/lib/data/documents';
import { formatDate } from '@/lib/utils/formatters';
import Link from 'next/link';

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
        <div className="chart-placeholder" style={{ marginTop: '2rem' }} />
      </div>
    </section>
  );
}