import Link from 'next/link';
import Image from 'next/image';

const featureList = [
  'Relatórios ESG completos gerados com IA a partir de perguntas guiadas',
  'Uploads de PDFs e políticas corporativas para enriquecer os insights',
  'Planos de ação e KPIs calculados automaticamente e salvos no dashboard'
];

export function Hero() {
  return (
    <section className="hero">
      <div className="container" style={{ display: 'grid', gap: '3rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', alignItems: 'center' }}>
        <div>
          <span className="badge" style={{ background: 'rgba(0,133,111,0.12)' }}>SaaS ESG Intelligence</span>
          <h1>Gere relatórios ESG com IA e decisões embasadas</h1>
          <p>
            O ESG Snapshot combina questionários inteligentes e PDFs enviados pela sua empresa para criar análises ESG, matrizes de risco e recomendações práticas em poucos minutos.
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <Link href="/dashboard" className="btn btn-primary">Começar agora</Link>
            <Link href="/contact" className="btn btn-secondary">Falar com vendas</Link>
          </div>
        </div>
        <div className="card" style={{ minHeight: 320 }}>
          <Image src="/logo.svg" alt="ESG Snapshot" width={64} height={64} />
          <p style={{ color: 'var(--gray-500)' }}>
            Relatórios, insights e scorecards gerados automaticamente a partir dos dados fornecidos pela equipe e dos documentos da empresa.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.75rem' }}>
            {featureList.map((item) => (
              <li key={item}>✅ {item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
