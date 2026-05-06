'use client';

interface ProbGaugeProps {
  elNino: number;
  neutral: number;
  laNina: number;
}

export function ProbGauge({ elNino, neutral, laNina }: ProbGaugeProps) {
  const bars = [
    { label: 'El Niño', value: elNino,  color: '#f59e0b' },
    { label: 'Neutral', value: neutral,  color: '#6b7280' },
    { label: 'La Niña', value: laNina,   color: '#3b82f6' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {bars.map(b => (
        <div key={b.label}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 10, color: '#7a8499', fontFamily: 'IBM Plex Mono' }}>{b.label}</span>
            <span style={{ fontSize: 11, color: b.color, fontWeight: 600, fontFamily: 'IBM Plex Mono' }}>{b.value}%</span>
          </div>
          <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${b.value}%`,
              background: b.color,
              borderRadius: 2,
              opacity: 0.8,
            }} />
          </div>
        </div>
      ))}
      <div style={{ fontSize: 9, color: '#3d4455', marginTop: 4, fontFamily: 'IBM Plex Mono' }}>
        IRI/CPC Jun–Aug 2025 outlook
      </div>
    </div>
  );
}
