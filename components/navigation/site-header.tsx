import Link from 'next/link';
import { MainNav } from '@/components/navigation/main-nav';

export function SiteHeader() {
  return (
    <header style={{ padding: '1.5rem 0', borderBottom: '1px solid rgba(15,23,42,0.06)' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
          <img src="/logo.svg" width={32} height={32} alt="ESG Snapshot" />
          ESG Snapshot
        </Link>
        <MainNav />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link href="/sign-in" className="btn btn-ghost" style={{ padding: '0.5rem 1rem' }}>Entrar</Link>
          <Link href="/sign-up" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem' }}>Criar conta</Link>
        </div>
      </div>
    </header>
  );
}
