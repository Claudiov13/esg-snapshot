import Link from 'next/link';
import { ReactNode } from 'react';
import { UserButton } from '@clerk/nextjs';
import { DashboardNav } from '@/components/navigation/dashboard-nav';

export function DashboardShell({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <section className="dashboard-shell">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <Link href="/" style={{ color: 'var(--gray-500)', fontWeight: 600 }}>
            ← Voltar para o site
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link href="/" className="btn btn-ghost" style={{ padding: '0.35rem 0.8rem' }}>
              Início
            </Link>
            <UserButton appearance={{ elements: { userButtonAvatarBox: { width: 36, height: 36 } } }} afterSignOutUrl="/" />
          </div>
        </div>
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
