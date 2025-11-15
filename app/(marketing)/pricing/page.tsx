const plans = [
  {
    name: 'Starter',
    price: 'R$99/mês',
    cta: 'Começar',
    features: ['5 usuários', '20 uploads/mês', 'Suporte prioritário']
  },
  {
    name: 'Pro',
    price: 'R$249/mês',
    cta: 'Assinar Pro',
    featured: true,
    features: ['Usuários ilimitados', 'Upload ilimitado', 'Webhook Stripe configurado']
  },
  {
    name: 'Enterprise',
    price: 'Fale conosco',
    cta: 'Contato vendas',
    features: ['SLA dedicado', 'Admin avançado', 'Integração BI']
  }
];

export default function PricingPage() {
  return (
    <section style={{ padding: '4rem 0' }}>
      <div className="container">
        <h1>Planos claros para seu SaaS ESG</h1>
        <div className="pricing-grid">
          {plans.map((plan) => (
            <article key={plan.name} className={`pricing-card ${plan.featured ? 'pricing-card--featured' : ''}`}>
              <h3>{plan.name}</h3>
              <p style={{ fontSize: '2rem', margin: '1rem 0' }}>{plan.price}</p>
              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>
              <a href={plan.featured ? '/dashboard/billing' : '/contact'} className="btn btn-primary">
                {plan.cta}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
