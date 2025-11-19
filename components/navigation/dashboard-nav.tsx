'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/dashboard', label: 'Visão Geral' },
  { href: '/dashboard/documents', label: 'Documentos' },
  { href: '/dashboard/reports', label: 'Relatórios' },
  { href: '/dashboard/billing', label: 'Faturamento' }
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      {items.map((item) => {
        const active = pathname === item.href || (pathname?.startsWith(item.href) && item.href !== '/dashboard');
        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              padding: '0.35rem 0.8rem',
              borderRadius: '999px',
              border: '1px solid ' + (active ? 'var(--brand-primary)' : 'transparent'),
              background: active ? 'rgba(0,133,111,0.12)' : 'rgba(15,23,42,0.04)',
              fontWeight: active ? 600 : 500,
              color: active ? 'var(--brand-primary)' : 'var(--gray-700)'
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
