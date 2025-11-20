import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { DashboardShell } from '@/components/layouts/dashboard-shell';
import { CheckoutButton } from './checkout-button';
import { getDashboardStats } from '@/lib/data/dashboard';

const planLabels: Record<string, string> = {
  trial: 'Teste gratuito',
  trialing: 'Teste gratuito',
  free: 'Teste gratuito',
  pro: 'Mensal (5 relatorios + 5 uploads)',
  avulso: 'Relatorio avulso'
};

export default async function BillingPage() {
  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const stats = await getDashboardStats(user.id);
  const readablePlan = planLabels[stats.plan] ?? stats.plan ?? 'desconhecido';
  const readableStatus = stats.status ?? 'desconhecido';

  return (
    <DashboardShell title="Faturamento" description="Defina como quer gerar seus relatorios ESG.">
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <h3 style={{ margin: 0 }}>Seu status</h3>
        <p style={{ margin: 0 }}>Plano atual: {readablePlan}</p>
        <p style={{ margin: 0 }}>Status: {readableStatus}</p>
        <p style={{ color: 'var(--gray-500)', margin: 0 }}>
          O primeiro relatorio e gratuito. Se precisar de mais profundidade ou volume, escolha um dos planos abaixo.
        </p>
      </div>

      <div className="pricing-grid" style={{ marginTop: '1.5rem' }}>
        <article className="pricing-card pricing-card--featured">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.5rem' }}>
            <div>
              <h3 style={{ margin: 0 }}>Mensal</h3>
              <p style={{ margin: 0, color: 'var(--gray-500)' }}>Ate 5 relatorios completos e 5 uploads por mes</p>
            </div>
            <strong style={{ fontSize: '1.5rem' }}>R$250/mes</strong>
          </div>
          <ul>
            <li>Relatorios ESG completos com IA</li>
            <li>Inclui ate 5 anexos distribuidos nos relatorios</li>
            <li>Suporte prioritario do time ESG Snapshot</li>
          </ul>
          <CheckoutButton plan="pro" label="Assinar mensal" />
        </article>

        <article className="pricing-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.5rem' }}>
            <div>
              <h3 style={{ margin: 0 }}>Avulso</h3>
              <p style={{ margin: 0, color: 'var(--gray-500)' }}>Um relatorio completo depois do teste</p>
            </div>
            <strong style={{ fontSize: '1.5rem' }}>R$99</strong>
          </div>
          <ul>
            <li>Compra isolada de 1 relatorio ESG</li>
            <li>Permite anexar arquivos para enriquecer a analise</li>
            <li>Ideal para projetos pontuais ou pilotos</li>
          </ul>
          <CheckoutButton plan="avulso" label="Comprar relatorio avulso" />
        </article>
      </div>

      <div className="card" style={{ marginTop: '1.5rem', display: 'grid', gap: '0.5rem' }}>
        <h3 style={{ margin: 0 }}>Como funciona</h3>
        <ul style={{ margin: 0 }}>
          <li>Seu primeiro relatorio ESG e gratuito ao entrar na plataforma.</li>
          <li>Se quiser mais profundidade e volume (5 relatorios e 5 uploads), escolha o plano mensal.</li>
          <li>Para casos pontuais, compre um relatorio avulso de R$99 depois de usar o teste.</li>
        </ul>
        <p style={{ color: 'var(--gray-500)', margin: 0 }}>
          Dica: mantenha seus documentos mais relevantes anexados ao gerar o relatorio para receber recomendacoes melhores.
        </p>
      </div>
    </DashboardShell>
  );
}
