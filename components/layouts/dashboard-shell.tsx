import { ReactNode } from 'react';
import { DashboardNav } from '@/components/navigation/dashboard-nav';

export function DashboardShell({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="dashboard-shell">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <span className="badge" style={{ background: 'rgba(0,133,111,0.12)' }}>Painel</span>
            <h1>{title}</h1>
            {description && <p style={{ color: 'var(--gray-500)' }}>{description}</p>}
          </div>
        </div>
        <DashboardNav />
        <div style={{ marginTop: '2rem' }}>{children}</div>
      </div>
    </section>
  );
}
