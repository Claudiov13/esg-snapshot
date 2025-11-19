import { ReactNode } from 'react';

interface ReportSectionProps {
  title: string;
  description?: string;
  emptyText: string;
  children: ReactNode;
  isEmpty: boolean;
}

export function ReportSection({ title, description, emptyText, children, isEmpty }: ReportSectionProps) {
  return (
    <div className="card" style={{ display: 'grid', gap: '0.75rem' }}>
      <div>
        <h3 style={{ margin: 0 }}>{title}</h3>
        {description && <p style={{ color: 'var(--gray-500)', margin: 0 }}>{description}</p>}
      </div>
      {isEmpty ? <p style={{ color: 'var(--gray-500)', margin: 0 }}>{emptyText}</p> : children}
    </div>
  );
}
