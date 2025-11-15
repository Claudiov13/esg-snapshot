import Link from 'next/link';
import Image from 'next/image';

export function Hero() {
  return (
    <section className="hero">
      <div className="container" style={{ display: 'grid', gap: '3rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', alignItems: 'center' }}>
        <div>
          <span className="badge" style={{ background: 'rgba(0,133,111,0.12)' }}>SaaS ESG Intelligence</span>
          <h1>Centralize relatórios ESG e acelere decisões</h1>
          <p>
            O ESG Snapshot conecta seus documentos, valida informações e cria insights em tempo real para times de sustentabilidade.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <Link href="/dashboard" className="btn btn-primary">Começar agora</Link>
            <Link href="/contact" className="btn btn-secondary">Falar com vendas</Link>
          </div>
        </div>
        <div className="card" style={{ minHeight: 320 }}>
          <Image src="/logo.svg" alt="ESG Snapshot" width={64} height={64} />
          <p style={{ color: 'var(--gray-500)' }}>
            Dashboard com upload inteligente de PDFs, classificação automática e integrações financeiras.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
            <li>✔️ Upload ilimitado de documentos</li>
            <li>✔️ Insights em tempo real conectados ao Supabase</li>
            <li>✔️ Pagamentos recorrentes com Stripe</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
