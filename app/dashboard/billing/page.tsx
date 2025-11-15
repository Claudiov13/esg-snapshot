import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { DashboardShell } from '@/components/layouts/dashboard-shell';
import { CheckoutButton } from './checkout-button';
import { getDashboardStats } from '@/lib/data/dashboard';

export default async function BillingPage() {
  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const stats = await getDashboardStats(user.id);

  return (
    <DashboardShell title="Faturamento" description="Gerencie assinaturas via Stripe.">
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <h3>Status atual</h3>
          <p>Plano: {stats.plan}</p>
          <p>Status: {stats.status}</p>
        </div>
        <CheckoutButton plan="pro" />
      </div>
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h3>Vantagens do Pro</h3>
        <ul>
          <li>Uploads ilimitados</li>
          <li>Time admin dedicado</li>
          <li>Integração com BI</li>
        </ul>
      </div>
    </DashboardShell>
  );
}