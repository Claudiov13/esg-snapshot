export type Activity = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
};

export function ActivityFeed({ items }: { items: Activity[] }) {
  if (!items.length) {
    return <p style={{ color: 'var(--gray-500)' }}>Nenhuma atividade ainda.</p>;
  }

  return (
    <div className="activity-feed">
      {items.map((item) => (
        <div key={item.id} className="activity-row">
          <div>
            <strong>{item.title}</strong>
            <p style={{ margin: 0, color: 'var(--gray-500)' }}>{item.description}</p>
          </div>
          <small style={{ color: 'var(--gray-500)' }}>{item.timestamp}</small>
        </div>
      ))}
    </div>
  );
}
