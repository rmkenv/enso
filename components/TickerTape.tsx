'use client';
import { getCropImpacts, getENSOSummary } from '@/lib/enso';

export function TickerTape() {
  const summary = getENSOSummary();
  const impacts = getCropImpacts(summary.currentPhase);

  const items = impacts.map(i => ({
    ticker: i.ticker,
    signal: i.signal,
    label: i.signal === 'bullish' ? '▲' : i.signal === 'bearish' ? '▼' : '—',
  }));

  const doubled = [...items, ...items]; // for seamless loop

  return (
    <div style={{
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      background: '#0c1015',
      overflow: 'hidden',
      height: 28,
      display: 'flex',
      alignItems: 'center',
    }}>
      <div style={{
        display: 'flex',
        width: 'max-content',
        animation: 'ticker 32s linear infinite',
        gap: 0,
      }}>
        {doubled.map((item, i) => (
          <span key={i} style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '0 20px',
            fontSize: 11,
            fontFamily: 'IBM Plex Mono, monospace',
            color: item.signal === 'bullish' ? '#10b981' : item.signal === 'bearish' ? '#ef4444' : '#6b7280',
            borderRight: '1px solid rgba(255,255,255,0.04)',
            whiteSpace: 'nowrap',
          }}>
            <span style={{ color: '#7a8499', fontSize: 10 }}>{item.ticker}</span>
            <span>{item.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
