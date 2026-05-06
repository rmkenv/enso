'use client';
import { CropImpact } from '@/lib/enso';

const SIGNAL_STYLES = {
  bullish: { color: '#10b981', bg: 'rgba(16,185,129,0.08)', label: '▲ BULLISH' },
  bearish: { color: '#ef4444', bg: 'rgba(239,68,68,0.08)',   label: '▼ BEARISH' },
  neutral: { color: '#6b7280', bg: 'rgba(107,114,128,0.08)', label: '— NEUTRAL' },
};

const MAG_DOTS = {
  strong:   3,
  moderate: 2,
  weak:     1,
};

function MagDots({ magnitude }: { magnitude: CropImpact['magnitude'] }) {
  const n = MAG_DOTS[magnitude];
  return (
    <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
      {[1,2,3].map(i => (
        <div key={i} style={{
          width: 5, height: 5, borderRadius: '50%',
          background: i <= n ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.08)',
        }} />
      ))}
    </div>
  );
}

export function CropMatrix({ impacts }: { impacts: CropImpact[] }) {
  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            {['COMMODITY', 'TICKER', 'REGION', 'SIGNAL', 'CONVICTION', 'ENSO DRIVER'].map(h => (
              <th key={h} style={{
                padding: '6px 10px',
                textAlign: 'left',
                color: '#3d4455',
                fontWeight: 500,
                fontSize: 10,
                letterSpacing: '0.08em',
                fontFamily: 'IBM Plex Mono, monospace',
                whiteSpace: 'nowrap',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {impacts.map((imp, i) => {
            const s = SIGNAL_STYLES[imp.signal];
            return (
              <tr key={i} style={{
                borderBottom: '1px solid rgba(255,255,255,0.03)',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <td style={{ padding: '9px 10px', color: '#e8eaf0', fontWeight: 500 }}>{imp.crop}</td>
                <td style={{ padding: '9px 10px' }}>
                  <span style={{
                    color: '#f59e0b',
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                  }}>{imp.ticker}</span>
                </td>
                <td style={{ padding: '9px 10px', color: '#7a8499' }}>{imp.region}</td>
                <td style={{ padding: '9px 10px' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: 3,
                    background: s.bg,
                    color: s.color,
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                  }}>{s.label}</span>
                </td>
                <td style={{ padding: '9px 10px' }}>
                  <MagDots magnitude={imp.magnitude} />
                </td>
                <td style={{ padding: '9px 10px', color: '#7a8499', maxWidth: 300, lineHeight: 1.5 }}>
                  {imp.note}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
