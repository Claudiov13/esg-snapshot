import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { DashboardShell } from '@/components/layouts/dashboard-shell';
import { listDocuments } from '@/lib/data/documents';
import { EsgReportForm } from '@/components/forms/esg-report-form';

export default async function NewReportPage() {
  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const documents = await listDocuments(user.id);

  return (
    <DashboardShell title="Novo relatório ESG" description="Preencha os dados da empresa e vincule documentos para gerar o relatório com IA.">
      <EsgReportForm documents={documents.map((doc) => ({ id: doc.id, title: doc.title, status: doc.status }))} />
    </DashboardShell>
  );
}
