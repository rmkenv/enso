'use client';
import { RegionalDemandImpact } from '@/lib/energy';

const DIR_STYLES = {
  higher:  { color: '#10b981', icon: '▲', bg: 'rgba(16,185,129,0.08)' },
  lower:   { color: '#ef4444', icon: '▼', bg: 'rgba(239,68,68,0.08)' },
  neutral: { color: '#6b7280', icon: '—', bg: 'rgba(107,114,128,0.08)' },
};

export function RegionalDemandGrid({ impacts }: { impacts: RegionalDemandImpact[] }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: 8,
    }}>
      {impacts.map((imp, i) => {
        const d = DIR_STYLES[imp.direction];
        return (
          <div key={i} style={{
            background: '#0f1318',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: 6,
            padding: '10px 12px',
            borderLeft: `2px solid ${d.color}50`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <div>
                <div style={{ fontSize: 11, color: '#e8eaf0', fontWeight: 500, marginBottom: 1 }}>{imp.region}</div>
                <div style={{ fontSize: 9, color: '#3d4455', letterSpacing: '0.06em' }}>{imp.fuel} · {imp.season}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{
                  fontSize: 10, padding: '1px 7px', borderRadius: 3,
                  background: d.bg, color: d.color, fontWeight: 600,
                }}>{d.icon} {imp.direction.toUpperCase()}</span>
              </div>
            </div>
            <div style={{
              display: 'inline-block',
              fontSize: 10, color: d.color,
              background: d.bg, padding: '1px 8px', borderRadius: 3,
              marginBottom: 6, fontFamily: 'IBM Plex Mono',
            }}>{imp.hddCdd}</div>
            <div style={{ fontSize: 10, color: '#7a8499', lineHeight: 1.5 }}>{imp.note}</div>
          </div>
        );
      })}
    </div>
  );
}
