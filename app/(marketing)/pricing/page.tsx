const plans = [
  {
    name: 'Teste gratuito',
    price: 'R$0',
    cta: 'Comecar gratis',
    href: '/dashboard',
    features: ['1 relatorio ESG completo para prova de valor', 'Adicione documentos de apoio ao relatorio', 'Sem cartao de credito para testar']
  },
  {
    name: 'Mensal',
    price: 'R$250/mes',
    cta: 'Assinar mensal',
    href: '/dashboard/billing?plan=pro',
    featured: true,
    features: ['Ate 5 relatorios por mes com IA', 'Ate 5 uploads anexados aos relatorios', 'Suporte prioritario para sustentabilidade']
  },
  {
    name: 'Avulso',
    price: 'R$99/relatorio',
    cta: 'Comprar relatorio avulso',
    href: '/dashboard/billing?plan=avulso',
    features: ['1 relatorio completo apos o teste', 'Inclui anexos para dar contexto', 'Ideal para projetos pontuais']
  }
];

export default function PricingPage() {
  return (
    <section style={{ padding: '4rem 0' }}>
      <div className="container">
        <h1>Planos para gerar relatorios ESG</h1>
        <div className="pricing-grid">
          {plans.map((plan) => (
            <article key={plan.name} className={`pricing-card ${plan.featured ? 'pricing-card--featured' : ''}`}>
              <h3>{plan.name}</h3>
              <p style={{ fontSize: '2rem', margin: '1rem 0' }}>{plan.price}</p>
              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <a href={plan.href} className="btn btn-primary">
                {plan.cta}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
