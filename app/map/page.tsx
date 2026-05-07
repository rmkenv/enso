'use client';
import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { getENSOSummary, PHASE_COLORS } from '@/lib/enso';
import { REGIONS, RegionFeature } from '@/lib/regions';
import { TickerTape } from '@/components/TickerTape';

// Leaflet must not SSR
const ENSOMap = dynamic(
  () => import('@/components/ENSOMap').then(m => m.ENSOMap),
  { ssr: false, loading: () => (
    <div style={{
      width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0a0c0f', color: '#3d4455', fontFamily: 'IBM Plex Mono', fontSize: 12,
    }}>
      Loading map…
    </div>
  )}
);

type SectorFilter = 'all' | 'agri' | 'energy';
type PhaseTab = 'current' | 'el-nino' | 'neutral' | 'la-nina';

const LEGEND_ITEMS = [
  { color: '#10b981', label: 'Bullish signal', dash: false },
  { color: '#ef4444', label: 'Bearish signal', dash: false },
  { color: '#6b7280', label: 'Neutral / noise', dash: true  },
];

const SCALE_ITEMS = [
  { opacity: 0.35, label: 'Strong' },
  { opacity: 0.22, label: 'Moderate' },
  { opacity: 0.10, label: 'Weak' },
];

export default function MapPage() {
  const summary = getENSOSummary();
  const [phaseTab,      setPhaseTab]      = useState<PhaseTab>('current');
  const [sectorFilter,  setSectorFilter]  = useState<SectorFilter>('all');
  const [selectedRegion, setSelectedRegion] = useState<RegionFeature | null>(null);
  const [sstOpacity,    setSstOpacity]    = useState(55);

  const activePhase = phaseTab === 'current' ? summary.currentPhase :
                      phaseTab === 'el-nino' ? 'el-nino' :
                      phaseTab === 'la-nina' ? 'la-nina' : 'neutral';

  const phaseColor = PHASE_COLORS[activePhase];
  const phaseName  = activePhase === 'el-nino' ? 'EL NIÑO' :
                     activePhase === 'la-nina'  ? 'LA NIÑA' : 'NEUTRAL';

  const onRegionSelect = useCallback((r: RegionFeature | null) => setSelectedRegion(r), []);

  const selectedSignal = selectedRegion ? selectedRegion.getSignal(activePhase) : null;
  const sigColor = selectedSignal
    ? selectedSignal.direction === 'bullish' ? '#10b981'
    : selectedSignal.direction === 'bearish' ? '#ef4444'
    : '#6b7280'
    : '#7a8499';

  // Summary stats for sidebar
  const allSignals = REGIONS
    .filter(r => r.id !== 'nino34')
    .filter(r => sectorFilter === 'all' || r.sector === sectorFilter || r.sector === 'both')
    .map(r => ({ region: r, signal: r.getSignal(activePhase) }));

  const bullishCount = allSignals.filter(s => s.signal.direction === 'bullish').length;
  const bearishCount = allSignals.filter(s => s.signal.direction === 'bearish').length;
  const neutralCount = allSignals.filter(s => s.signal.direction === 'neutral').length;

  return (
    <div style={{ height: 'calc(100vh - 44px)', display: 'flex', flexDirection: 'column' }}>
      <TickerTape />

      {/* Map toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 0,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: '#0c1015', padding: '0 16px', height: 38, flexShrink: 0,
      }}>
        {/* Phase selector */}
        <div style={{ display: 'flex', gap: 2, background: 'rgba(255,255,255,0.04)', borderRadius: 4, padding: 2, marginRight: 16 }}>
          {([
            { key: 'current', label: `CURRENT (${phaseName})` },
            { key: 'el-nino', label: 'EL NIÑO' },
            { key: 'neutral', label: 'NEUTRAL' },
            { key: 'la-nina', label: 'LA NIÑA' },
          ] as { key: PhaseTab; label: string }[]).map(t => {
            const tColor = t.key === 'current' ? phaseColor :
                           t.key === 'el-nino'  ? '#f59e0b' :
                           t.key === 'la-nina'  ? '#3b82f6' : '#6b7280';
            return (
              <button key={t.key} onClick={() => setPhaseTab(t.key)} style={{
                padding: '3px 10px', borderRadius: 3, border: 'none', cursor: 'pointer',
                fontSize: 9, fontFamily: 'IBM Plex Mono', fontWeight: 600, letterSpacing: '0.08em',
                background: phaseTab === t.key ? `${tColor}20` : 'transparent',
                color: phaseTab === t.key ? tColor : '#3d4455',
                transition: 'all 0.15s',
              }}>{t.label}</button>
            );
          })}
        </div>

        {/* Sector filter */}
        <div style={{ display: 'flex', gap: 2, background: 'rgba(255,255,255,0.04)', borderRadius: 4, padding: 2, marginRight: 'auto' }}>
          {(['all', 'agri', 'energy'] as SectorFilter[]).map(s => (
            <button key={s} onClick={() => setSectorFilter(s)} style={{
              padding: '3px 10px', borderRadius: 3, border: 'none', cursor: 'pointer',
              fontSize: 9, fontFamily: 'IBM Plex Mono', fontWeight: 600, letterSpacing: '0.08em',
              background: sectorFilter === s ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: sectorFilter === s ? '#e8eaf0' : '#3d4455',
            }}>{s.toUpperCase()}</button>
          ))}
        </div>

        {/* SST opacity slider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10, color: '#3d4455', fontFamily: 'IBM Plex Mono' }}>
          <span>SST</span>
          <input
            type="range" min={0} max={80} value={sstOpacity}
            onChange={e => setSstOpacity(Number(e.target.value))}
            style={{ width: 80, accentColor: phaseColor, cursor: 'pointer' }}
          />
          <span>{sstOpacity}%</span>
        </div>
      </div>

      {/* Main: map + sidebar */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 280px', minHeight: 0, height: '100%' }}>

        {/* Map */}
        <div style={{ position: 'relative', overflow: 'hidden', height: '100%' }}>
          <ENSOMap
            phase={activePhase}
            sectorFilter={sectorFilter}
            onRegionSelect={onRegionSelect}
          />

          {/* Legend overlay */}
          <div style={{
            position: 'absolute', bottom: 32, right: 8, zIndex: 1000,
            background: 'rgba(10,12,15,0.88)', border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 4, padding: '10px 12px',
            fontFamily: 'IBM Plex Mono', fontSize: 10,
          }}>
            <div style={{ color: '#3d4455', fontSize: 9, letterSpacing: '0.1em', marginBottom: 8 }}>SIGNAL</div>
            {LEGEND_ITEMS.map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                <div style={{
                  width: 20, height: 10, borderRadius: 2,
                  background: item.color,
                  opacity: 0.7,
                  border: `1px solid ${item.color}`,
                  borderStyle: item.dash ? 'dashed' : 'solid',
                }} />
                <span style={{ color: '#7a8499' }}>{item.label}</span>
              </div>
            ))}
            <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '8px 0' }} />
            <div style={{ color: '#3d4455', fontSize: 9, letterSpacing: '0.1em', marginBottom: 6 }}>CONVICTION</div>
            {SCALE_ITEMS.map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <div style={{ width: 20, height: 10, borderRadius: 2, background: `rgba(255,255,255,${s.opacity})` }} />
                <span style={{ color: '#7a8499' }}>{s.label}</span>
              </div>
            ))}
            <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '8px 0' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 20, height: 10, borderRadius: 2, background: 'rgba(59,130,246,0.4)' }} />
              <span style={{ color: '#7a8499', fontSize: 9 }}>Niño 3.4 SST zone</span>
            </div>
          </div>

          {/* Scenario watermark when not current */}
          {phaseTab !== 'current' && (
            <div style={{
              position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)',
              zIndex: 1000, background: 'rgba(245,158,11,0.12)',
              border: '1px solid rgba(245,158,11,0.3)', borderRadius: 3,
              padding: '4px 14px', fontSize: 10, color: '#f59e0b',
              fontFamily: 'IBM Plex Mono', fontWeight: 600, letterSpacing: '0.06em',
            }}>
              ⚠ SCENARIO — {phaseName} · Not current conditions
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div style={{
          borderLeft: '1px solid rgba(255,255,255,0.06)',
          background: '#0c1015', display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}>

          {/* Signal count summary */}
          <div style={{ padding: '14px 14px 10px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: 9, letterSpacing: '0.12em', color: '#3d4455', marginBottom: 10 }}>
              SIGNAL SUMMARY · {sectorFilter.toUpperCase()}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
              {[
                { label: 'Bullish', count: bullishCount, color: '#10b981' },
                { label: 'Bearish', count: bearishCount, color: '#ef4444' },
                { label: 'Neutral', count: neutralCount, color: '#6b7280' },
              ].map(s => (
                <div key={s.label} style={{
                  background: `${s.color}10`, border: `1px solid ${s.color}25`,
                  borderRadius: 4, padding: '8px 6px', textAlign: 'center',
                }}>
                  <div style={{ fontSize: 20, fontWeight: 300, color: s.color, fontFamily: 'IBM Plex Mono' }}>{s.count}</div>
                  <div style={{ fontSize: 9, color: '#3d4455', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected region detail */}
          {selectedRegion && selectedSignal ? (
            <div style={{ padding: '14px', borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ fontSize: 9, letterSpacing: '0.12em', color: '#3d4455' }}>SELECTED REGION</div>
                <button onClick={() => setSelectedRegion(null)} style={{
                  background: 'none', border: 'none', color: '#3d4455', cursor: 'pointer', fontSize: 14, lineHeight: 1,
                }}>×</button>
              </div>
              <div style={{ fontSize: 13, color: '#e8eaf0', fontWeight: 500, marginBottom: 4 }}>
                {selectedRegion.name}
              </div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: 10, padding: '2px 8px', borderRadius: 3,
                  background: `${sigColor}15`, color: sigColor, fontWeight: 600,
                }}>
                  {selectedSignal.direction === 'bullish' ? '▲' : selectedSignal.direction === 'bearish' ? '▼' : '—'}
                  {' '}{selectedSignal.direction.toUpperCase()}
                </span>
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 3, background: 'rgba(255,255,255,0.05)', color: '#7a8499' }}>
                  {selectedSignal.magnitude}
                </span>
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 3, background: 'rgba(255,255,255,0.05)', color: '#7a8499' }}>
                  {selectedRegion.sector}
                </span>
              </div>
              <div style={{ fontSize: 11, color: '#e8eaf0', fontWeight: 500, marginBottom: 6, lineHeight: 1.4 }}>
                {selectedSignal.headline}
              </div>
              <div style={{ fontSize: 10, color: '#7a8499', lineHeight: 1.6 }}>
                {selectedSignal.detail}
              </div>
              {selectedRegion.commodities.length > 0 && (
                <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {selectedRegion.commodities.map(c => (
                    <span key={c} style={{
                      fontSize: 10, padding: '2px 8px', borderRadius: 3,
                      background: 'rgba(245,158,11,0.1)', color: '#f59e0b',
                      fontWeight: 600, letterSpacing: '0.05em',
                    }}>{c}</span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div style={{ padding: '14px', borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
              <div style={{ fontSize: 9, letterSpacing: '0.12em', color: '#3d4455', marginBottom: 8 }}>SELECTED REGION</div>
              <div style={{ fontSize: 10, color: '#3d4455', lineHeight: 1.6 }}>
                Click a region on the map to see signal detail, commodities, and ENSO driver.
              </div>
            </div>
          )}

          {/* Region list */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px 14px' }}>
            <div style={{ fontSize: 9, letterSpacing: '0.12em', color: '#3d4455', marginBottom: 8 }}>ALL REGIONS</div>
            {allSignals.map(({ region, signal }) => {
              const col = signal.direction === 'bullish' ? '#10b981' :
                          signal.direction === 'bearish' ? '#ef4444' : '#6b7280';
              const arrow = signal.direction === 'bullish' ? '▲' :
                            signal.direction === 'bearish' ? '▼' : '—';
              const isSelected = selectedRegion?.id === region.id;
              return (
                <div
                  key={region.id}
                  onClick={() => setSelectedRegion(region)}
                  style={{
                    padding: '8px 8px',
                    borderRadius: 4,
                    marginBottom: 3,
                    cursor: 'pointer',
                    background: isSelected ? 'rgba(255,255,255,0.04)' : 'transparent',
                    border: isSelected ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
                    transition: 'all 0.1s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                  onMouseLeave={e => (e.currentTarget.style.background = isSelected ? 'rgba(255,255,255,0.04)' : 'transparent')}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                    <span style={{ fontSize: 11, color: '#e8eaf0', fontWeight: 500 }}>{region.name}</span>
                    <span style={{ fontSize: 11, color: col, fontWeight: 600 }}>{arrow}</span>
                  </div>
                  <div style={{ fontSize: 9, color: '#3d4455', lineHeight: 1.4 }}>
                    {signal.headline}
                  </div>
                  {region.commodities.length > 0 && (
                    <div style={{ marginTop: 4, display: 'flex', gap: 4 }}>
                      {region.commodities.slice(0, 3).map(c => (
                        <span key={c} style={{ fontSize: 9, color: '#f59e0b', opacity: 0.7 }}>{c}</span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ONI status */}
          <div style={{ padding: '10px 14px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 9, color: '#3d4455' }}>CURRENT ONI</span>
              <span style={{ fontSize: 13, color: phaseColor, fontWeight: 600, fontFamily: 'IBM Plex Mono', marginLeft: 'auto' }}>
                {summary.currentONI > 0 ? '+' : ''}{summary.currentONI.toFixed(1)}°C
              </span>
              <span style={{
                fontSize: 9, marginLeft: 8, padding: '2px 6px', borderRadius: 3,
                background: `${PHASE_COLORS[summary.currentPhase]}20`,
                color: PHASE_COLORS[summary.currentPhase],
                fontWeight: 600,
              }}>
                {summary.currentPhase === 'el-nino' ? 'EL NIÑO' : summary.currentPhase === 'la-nina' ? 'LA NIÑA' : 'NEUTRAL'}
              </span>
            </div>
            <div style={{ fontSize: 9, color: '#3d4455', marginTop: 4 }}>
              {summary.consecutiveMonths} consecutive months · NOAA CPC
            </div>
          </div>
        </div>
      </div>

      {/* Leaflet CSS — inject globally */}
      <style>{`
        .leaflet-container { background: #0a0c0f !important; }
        .leaflet-control-zoom { border: 1px solid rgba(255,255,255,0.1) !important; }
        .leaflet-control-zoom a {
          background: rgba(15,19,24,0.95) !important;
          color: #7a8499 !important;
          border-bottom: 1px solid rgba(255,255,255,0.06) !important;
        }
        .leaflet-control-zoom a:hover { background: rgba(26,34,48,0.95) !important; color: #e8eaf0 !important; }
        .leaflet-control-attribution {
          background: rgba(10,12,15,0.7) !important;
          color: #3d4455 !important;
          font-family: IBM Plex Mono, monospace !important;
          font-size: 9px !important;
        }
        .leaflet-control-attribution a { color: #3d4455 !important; }
      `}</style>
    </div>
  );
}
