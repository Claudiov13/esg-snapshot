import { ReactNode } from 'react';
import clsx from 'clsx';

type BadgeProps = {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'info' | 'default';
};

export function Badge({ children, variant = 'default' }: BadgeProps) {
  const variants: Record<typeof variant, string> = {
    default: 'var(--gray-100)',
    info: 'rgba(0,133,111,0.15)',
    success: 'rgba(0,184,148,0.15)',
    warning: 'rgba(255,209,102,0.3)'
  };

  return (
    <span className="badge" style={{ background: variants[variant] }}>
      {children}
    </span>
  );
}
