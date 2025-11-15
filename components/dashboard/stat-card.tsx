import { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
  icon?: ReactNode;
}

export function StatCard({ label, value, delta, icon }: StatCardProps) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>{label}</span>
        {icon}
      </div>
      <strong style={{ fontSize: '2rem' }}>{value}</strong>
      {delta && <span className="badge" style={{ background: 'rgba(0,184,148,0.18)', color: '#00856f' }}>{delta}</span>}
    </div>
  );
}
