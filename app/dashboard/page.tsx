import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { DashboardShell } from '@/components/layouts/dashboard-shell';
import { StatCard } from '@/components/dashboard/stat-card';
import { UploadCard } from '@/components/dashboard/upload-card';
import { PdfUploadForm } from '@/components/forms/pdf-upload-form';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { getDashboardStats } from '@/lib/data/dashboard';

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const stats = await getDashboardStats(user.id);

  return (
    <DashboardShell title="Visão geral" description="Uploads, insights e assinaturas.">
      <div className="dashboard-grid">
        <StatCard label="Documentos" value={String(stats.totalDocuments)} delta="+4 esta semana" />
        <StatCard label="Plano" value={stats.plan} />
        <StatCard label="Status" value={stats.status} />
      </div>
      <div style={{ marginTop: '2rem', display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        <UploadCard>
          <h3>Upload de PDF</h3>
          <p style={{ color: 'var(--gray-500)' }}>Envie relatórios ESG em PDF e organizamos tudo no Supabase.</p>
          <PdfUploadForm />
        </UploadCard>
        <div className="card">
          <h3>Atividades recentes</h3>
          <ActivityFeed
            items={stats.latestDocuments.map((doc, index) => ({
              id: doc.id ?? String(index),
              title: doc.title ?? 'Documento',
              description: doc.status ?? 'processing',
              timestamp: new Date(doc.created_at ?? Date.now()).toLocaleDateString('pt-BR')
            }))}
          />
        </div>
      </div>
    </DashboardShell>
  );
}