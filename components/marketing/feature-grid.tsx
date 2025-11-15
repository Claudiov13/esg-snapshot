const FEATURES = [
  {
    title: 'Clerk + Supabase',
    description: 'Autenticação segura com Clerk e dados persistidos no Supabase Postgres.'
  },
  {
    title: 'Stripe SaaS billing',
    description: 'Assinaturas mensais com webhooks prontos para rastrear upgrades.'
  },
  {
    title: 'Uploads inteligentes',
    description: 'Armazenamento de PDFs e metadados versionados e prontos para busca.'
  },
  {
    title: 'Painel e Admin',
    description: 'Dashboard para clientes e console administrativo com gestão de usuários.'
  }
];

export function FeatureGrid() {
  return (
    <section style={{ padding: '4rem 0' }}>
      <div className="container">
        <h2>Infraestrutura completa SaaS B2B</h2>
        <div className="pricing-grid" style={{ marginTop: '2.5rem' }}>
          {FEATURES.map((feature) => (
            <article key={feature.title} className="card" style={{ minHeight: 180 }}>
              <h3>{feature.title}</h3>
              <p style={{ color: 'var(--gray-500)' }}>{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
