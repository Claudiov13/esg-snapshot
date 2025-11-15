'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Inicio' },
  { href: '/pricing', label: 'Planos' },
  { href: '/contact', label: 'Contato' }
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav style={{ display: 'flex', gap: '1.25rem' }}>
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            style={{ fontWeight: isActive ? 700 : 500, color: isActive ? 'var(--brand-primary)' : undefined }}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}