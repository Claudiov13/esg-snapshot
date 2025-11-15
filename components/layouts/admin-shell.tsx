import { ReactNode } from 'react';

export function AdminShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="dashboard-shell">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <span className="badge" style={{ background: 'rgba(255,209,102,0.35)' }}>Admin</span>
            <h1>{title}</h1>
            <p style={{ color: 'var(--gray-500)' }}>Relatórios financeiros, usuários e assinaturas.</p>
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}
