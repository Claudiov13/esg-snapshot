import Link from 'next/link';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { DashboardShell } from '@/components/layouts/dashboard-shell';
import { StatCard } from '@/components/dashboard/stat-card';
import { UploadCard } from '@/components/dashboard/upload-card';
import { PdfUploadForm } from '@/components/forms/pdf-upload-form';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { getDashboardStats } from '@/lib/data/dashboard';
import { ScoreBoard } from '@/components/reports/score-board';

type ReportScore = {
  environment?: number;
  social?: number;
  governance?: number;
};

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const stats = await getDashboardStats(user.id);
  const latestScore = (stats.latestReports[0]?.score as ReportScore) ?? null;

  return (
    <DashboardShell title="Visão geral" description="Uploads, relatórios e assinaturas.">
      <div className="dashboard-grid">
        <StatCard label="Documentos" value={String(stats.totalDocuments)} delta="+4 esta semana" />
        <StatCard label="Relatórios ESG" value={String(stats.totalReports)} />
        <StatCard label="Plano" value={stats.plan} />
        <StatCard label="Status" value={stats.status} />
      </div>
      <div style={{ marginTop: '2rem', display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        <UploadCard>
          <h3>Upload de PDF</h3>
          <p style={{ color: 'var(--gray-500)' }}>Envie relatórios ESG em PDF e organizamos tudo no Supabase.</p>
          <PdfUploadForm />
        </UploadCard>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
            <div>
              <h3>Relatórios ESG</h3>
              <p style={{ color: 'var(--gray-500)', margin: 0 }}>Gere relatórios inteligentes com IA.</p>
            </div>
            <Link href="/dashboard/reports/new" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
              Gerar relatório ESG
            </Link>
          </div>
          <div>
            {stats.latestReports.length === 0 && <p style={{ color: 'var(--gray-500)' }}>Nenhum relatório gerado ainda.</p>}
            {stats.latestReports.length > 0 && (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.5rem' }}>
                {stats.latestReports.map((report) => (
                  <li key={report.id}>
                    <Link href={`/dashboard/reports/${report.id}`} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--gray-700)' }}>
                      <span>{report.company_name ?? 'Relatório'}</span>
                      <small>{new Date(report.created_at ?? Date.now()).toLocaleDateString('pt-BR')}</small>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        {latestScore && (
          <div className="card" style={{ display: 'grid', gap: '0.75rem' }}>
            <div>
              <h3 style={{ margin: 0 }}>Saúde ESG recente</h3>
              <p style={{ color: 'var(--gray-500)', margin: 0 }}>Último relatório enviado.</p>
            </div>
            <ScoreBoard score={latestScore} />
          </div>
        )}
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
