import { Hero } from '@/components/marketing/hero';
import { FeatureGrid } from '@/components/marketing/feature-grid';

export default function Page() {
  return (
    <>
      <Hero />
      <FeatureGrid />
      <section style={{ padding: '4rem 0' }}>
        <div className="container card" style={{ textAlign: 'center' }}>
          <h2>Pronto para lançar seu SaaS ESG?</h2>
          <p style={{ color: 'var(--gray-500)' }}>
            Framework completo com Next.js App Router, Clerk, Supabase, Stripe e uploads de PDF.
          </p>
          <a href="/sign-up" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Criar conta</a>
        </div>
      </section>
    </>
  );
}
