'use client';
import { EnergySignal } from '@/lib/energy';

const SIGNAL_STYLES = {
  bullish: { color: '#10b981', bg: 'rgba(16,185,129,0.08)', label: '▲ BULLISH' },
  bearish: { color: '#ef4444', bg: 'rgba(239,68,68,0.08)',   label: '▼ BEARISH' },
  neutral: { color: '#6b7280', bg: 'rgba(107,114,128,0.08)', label: '— NEUTRAL' },
};

const DRIVER_STYLES = {
  demand: { color: '#3b82f6', label: 'DEMAND' },
  supply: { color: '#8b5cf6', label: 'SUPPLY' },
  both:   { color: '#f59e0b', label: 'D+S' },
};

const MAG_COUNT = { strong: 3, moderate: 2, weak: 1 };

function MagDots({ magnitude }: { magnitude: EnergySignal['magnitude'] }) {
  const n = MAG_COUNT[magnitude];
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {[1,2,3].map(i => (
        <div key={i} style={{
          width: 5, height: 5, borderRadius: '50%',
          background: i <= n ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.07)',
        }} />
      ))}
    </div>
  );
}

export function EnergyMatrix({ signals }: { signals: EnergySignal[] }) {
  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            {['COMMODITY', 'TICKER', 'HUB / MARKET', 'SIGNAL', 'DRIVER', 'CONVICTION', 'LAG', 'ENSO DRIVER'].map(h => (
              <th key={h} style={{
                padding: '6px 10px', textAlign: 'left',
                color: '#3d4455', fontWeight: 500, fontSize: 10,
                letterSpacing: '0.08em', fontFamily: 'IBM Plex Mono',
                whiteSpace: 'nowrap',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {signals.map((s, i) => {
            const sig = SIGNAL_STYLES[s.signal];
            const drv = DRIVER_STYLES[s.driver];
            return (
              <tr key={i}
                style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <td style={{ padding: '9px 10px', color: '#e8eaf0', fontWeight: 500 }}>{s.commodity}</td>
                <td style={{ padding: '9px 10px' }}>
                  {s.ticker !== '—'
                    ? <span style={{ color: '#f59e0b', fontSize: 10, fontWeight: 600, letterSpacing: '0.05em' }}>{s.ticker}</span>
                    : <span style={{ color: '#3d4455' }}>—</span>
                  }
                </td>
                <td style={{ padding: '9px 10px', color: '#7a8499' }}>{s.hub}</td>
                <td style={{ padding: '9px 10px' }}>
                  <span style={{
                    display: 'inline-block', padding: '2px 8px', borderRadius: 3,
                    background: sig.bg, color: sig.color,
                    fontSize: 10, fontWeight: 600, letterSpacing: '0.06em',
                  }}>{sig.label}</span>
                </td>
                <td style={{ padding: '9px 10px' }}>
                  <span style={{
                    display: 'inline-block', padding: '1px 6px', borderRadius: 3,
                    background: `${drv.color}15`, color: drv.color,
                    fontSize: 9, fontWeight: 600, letterSpacing: '0.06em',
                  }}>{drv.label}</span>
                </td>
                <td style={{ padding: '9px 10px' }}><MagDots magnitude={s.magnitude} /></td>
                <td style={{ padding: '9px 10px', color: '#3d4455', whiteSpace: 'nowrap', fontSize: 10 }}>{s.lag}</td>
                <td style={{ padding: '9px 10px', color: '#7a8499', maxWidth: 280, lineHeight: 1.5 }}>{s.note}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
