type Score = {
  environment?: number | null;
  social?: number | null;
  governance?: number | null;
};

const CATEGORIES = [
  { key: 'environment', label: 'Ambiental', color: '#00856f' },
  { key: 'social', label: 'Social', color: '#00b894' },
  { key: 'governance', label: 'Governança', color: '#ffd166' }
] as const;

function normalize(value: unknown) {
  const num = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(num)) {
    return 0;
  }
  return Math.min(100, Math.max(0, num));
}

export function ScoreBoard({ score }: { score?: Score | null }) {
  const resolved = score ?? {};

  return (
    <div style={{ display: 'grid', gap: '0.75rem' }}>
      {CATEGORIES.map((category) => {
        const value = normalize((resolved as Record<string, number | null>)[category.key]);
        return (
          <div key={category.key} style={{ display: 'grid', gap: '0.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
              <span>{category.label}</span>
              <span>{value}%</span>
            </div>
            <div style={{ height: 8, borderRadius: 999, background: 'rgba(15,23,42,0.08)' }}>
              <div style={{ width: `${value}%`, height: '100%', borderRadius: 999, background: category.color, transition: 'width 0.2s ease' }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
