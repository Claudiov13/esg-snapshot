import { ReactNode } from 'react';
import clsx from 'clsx';

type CardProps = {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function Card({ title, description, children, className }: CardProps) {
  return (
    <section className={clsx('card', className)}>
      {(title || description) && (
        <header style={{ marginBottom: '1rem' }}>
          {title && <h3 style={{ margin: 0 }}>{title}</h3>}
          {description && (
            <p style={{ margin: 0, color: 'var(--gray-500)', fontSize: '0.95rem' }}>{description}</p>
          )}
        </header>
      )}
      {children}
    </section>
  );
}
