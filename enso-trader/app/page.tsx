'use client';
import { useState } from 'react';
import { getCropImpacts, getENSOSummary, PHASE_COLORS } from '@/lib/enso';
import { TickerTape } from '@/components/TickerTape';
import { ONIChart } from '@/components/ONIChart';
import { CropMatrix } from '@/components/CropMatrix';
import { ProbGauge } from '@/components/ProbGauge';

export default function Home() {
  const summary = getENSOSummary();
  const [activePhase, setActivePhase] = useState(summary.currentPhase);
  const displayImpacts = getCropImpacts(activePhase);

  const phaseColor = PHASE_COLORS[summary.currentPhase];
  const phaseName = summary.currentPhase === 'el-nino' ? 'EL NIÑO' :
                    summary.currentPhase === 'la-nina' ? 'LA NIÑA' : 'NEUTRAL';
  const trendArrow = summary.trend === 'strengthening' ? '↓' :
                     summary.trend === 'weakening' ? '↑' : '→';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: '#0c1015', position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="11" r="10" stroke={phaseColor} strokeWidth="1.5" opacity="0.6"/>
              <path d="M3 11 Q11 2 19 11 Q11 20 3 11Z" fill={phaseColor} opacity="0.3"/>
              <circle cx="11" cy="11" r="3" fill={phaseColor}/>
            </svg>
            <span style={{ fontFamily: 'IBM Plex Mono', fontWeight: 600, fontSize: 13, letterSpacing: '0.15em', color: '#e8eaf0' }}>
              ENSO<span style={{ color: phaseColor }}>AGRI</span>
            </span>
          </div>
          <div style={{ height: 16, width: 1, background: 'rgba(255,255,255,0.08)' }} />
          <span style={{ fontSize: 10, color: '#3d4455', fontFamily: 'IBM Plex Mono', letterSpacing: '0.08em' }}>
            CLIMATE SIGNAL · COMMODITY INTELLIGENCE
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="live-dot" />
            <span style={{ fontSize: 10, color: '#3d4455', fontFamily: 'IBM Plex Mono' }}>LIVE</span>
          </div>
          <span style={{
            fontSize: 10, padding: '3px 10px', borderRadius: 3,
            border: `1px solid ${phaseColor}40`, color: phaseColor,
            fontFamily: 'IBM Plex Mono', fontWeight: 600, letterSpacing: '0.1em',
          }}>{phaseName}</span>
        </div>
      </header>

      <TickerTape />

      <main style={{ flex: 1, display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: 0 }}>
        <aside style={{
          borderRight: '1px solid rgba(255,255,255,0.06)', background: '#0c1015',
          padding: '16px', display: 'flex', flexDirection: 'column', gap: 20, overflowY: 'auto',
        }}>
          <div>
            <div style={{ fontSize: 9, letterSpacing: '0.12em', color: '#3d4455', marginBottom: 12 }}>OCEANIC NIÑO INDEX (ONI)</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 40, fontWeight: 300, color: phaseColor, fontFamily: 'IBM Plex Mono', lineHeight: 1 }}>
                {summary.currentONI > 0 ? '+' : ''}{summary.currentONI.toFixed(1)}
              </span>
              <span style={{ fontSize: 13, color: '#3d4455' }}>°C</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{
                fontSize: 10, padding: '2px 8px', borderRadius: 3,
                background: `${phaseColor}20`, color: phaseColor, fontWeight: 600, letterSpacing: '0.08em',
              }}>{phaseName}</span>
              <span style={{ fontSize: 10, color: '#3d4455' }}>{trendArrow} {summary.trend}</span>
            </div>
            <div style={{ fontSize: 10, color: '#3d4455', lineHeight: 1.7 }}>
              <div>Consecutive months: <span style={{ color: '#7a8499' }}>{summary.consecutiveMonths}</span></div>
              <div>Threshold: <span style={{ color: '#7a8499' }}>±0.5°C for 5mo</span></div>
              <div>Source: <span style={{ color: '#7a8499' }}>NOAA CPC</span></div>
            </div>
          </div>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.05)' }} />

          <div>
            <div style={{ fontSize: 9, letterSpacing: '0.12em', color: '#3d4455', marginBottom: 12 }}>SEASONAL OUTLOOK — JJA 2025</div>
            <ProbGauge {...summary.phaseProbabilities} />
          </div>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.05)' }} />

          <div>
            <div style={{ fontSize: 9, letterSpacing: '0.12em', color: '#3d4455', marginBottom: 12 }}>SUPPLEMENTAL INDICES</div>
            {[
              { label: 'MEI v2', value: '−0.87', note: 'Multivariate', col: '#3b82f6' },
              { label: 'SOI',    value: '+7.3',  note: 'Apr 2025',     col: '#3b82f6' },
              { label: 'PDO',    value: '−0.41', note: 'Mar 2025',     col: '#6b7280' },
              { label: 'AMO',    value: '+0.12', note: 'Warm phase',   col: '#f59e0b' },
            ].map(idx => (
              <div key={idx.label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.03)',
              }}>
                <div>
                  <div style={{ fontSize: 11, color: '#7a8499' }}>{idx.label}</div>
                  <div style={{ fontSize: 9, color: '#3d4455' }}>{idx.note}</div>
                </div>
                <span style={{ fontSize: 13, color: idx.col, fontWeight: 600 }}>{idx.value}</span>
              </div>
            ))}
          </div>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.05)' }} />

          <div>
            <div style={{ fontSize: 9, letterSpacing: '0.12em', color: '#3d4455', marginBottom: 12 }}>WATCH CALENDAR</div>
            {[
              { date: 'May 15', event: 'NOAA ONI update' },
              { date: 'May 20', event: 'IRI ENSO forecast' },
              { date: 'May 12', event: 'USDA WASDE' },
              { date: 'Jun 5',  event: 'USDA S&D report' },
              { date: 'Jun 10', event: 'Corn progress rpt' },
            ].map((e, i) => (
              <div key={i} style={{
                display: 'flex', gap: 10, alignItems: 'flex-start',
                padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.03)',
              }}>
                <span style={{ fontSize: 10, color: '#f59e0b', minWidth: 44, fontWeight: 600 }}>{e.date}</span>
                <span style={{ fontSize: 10, color: '#7a8499', lineHeight: 1.4 }}>{e.event}</span>
              </div>
            ))}
          </div>
        </aside>

        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '16px 20px', background: '#0f1318' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 9, letterSpacing: '0.12em', color: '#3d4455' }}>
                ONI TIME SERIES · 5-YEAR · NIÑO 3.4 SST ANOMALY (3-MONTH RUNNING MEAN)
              </div>
              <div style={{ display: 'flex', gap: 16, fontSize: 10 }}>
                {[
                  { label: 'El Niño ≥+0.5', color: '#f59e0b' },
                  { label: 'Neutral',        color: '#6b7280' },
                  { label: 'La Niña ≤−0.5', color: '#3b82f6' },
                ].map(l => (
                  <span key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#3d4455' }}>
                    <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: l.color }} />
                    {l.label}
                  </span>
                ))}
              </div>
            </div>
            <ONIChart />
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontSize: 9, letterSpacing: '0.12em', color: '#3d4455' }}>ENSO → COMMODITY SIGNAL MATRIX</div>
              <div style={{ display: 'flex', gap: 2, background: 'rgba(255,255,255,0.04)', borderRadius: 4, padding: 2 }}>
                {(['el-nino', 'neutral', 'la-nina'] as const).map(p => (
                  <button key={p} onClick={() => setActivePhase(p)} style={{
                    padding: '4px 12px', borderRadius: 3, border: 'none', cursor: 'pointer',
                    fontSize: 10, fontFamily: 'IBM Plex Mono', fontWeight: 600, letterSpacing: '0.06em',
                    background: activePhase === p ? `${PHASE_COLORS[p]}25` : 'transparent',
                    color: activePhase === p ? PHASE_COLORS[p] : '#3d4455',
                    transition: 'all 0.15s',
                  }}>
                    {p === 'el-nino' ? 'EL NIÑO' : p === 'la-nina' ? 'LA NIÑA' : 'NEUTRAL'}
                  </button>
                ))}
              </div>
            </div>

            {activePhase !== summary.currentPhase && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 12px',
                borderRadius: 3, background: 'rgba(245,158,11,0.08)',
                border: '1px solid rgba(245,158,11,0.2)', marginBottom: 12,
                fontSize: 10, color: '#f59e0b',
              }}>
                ⚠ SCENARIO MODE — Not current conditions
              </div>
            )}

            <CropMatrix impacts={displayImpacts} />

            <div style={{
              marginTop: 20, padding: '12px 16px',
              background: 'rgba(255,255,255,0.02)', borderRadius: 4,
              borderLeft: '2px solid rgba(255,255,255,0.06)',
              fontSize: 10, color: '#3d4455', lineHeight: 1.8,
            }}>
              <span style={{ color: '#7a8499', fontWeight: 600 }}>METHODOLOGY</span>
              {' '}· ONI threshold ±0.5°C sustained 5 consecutive 3-month seasons.
              Signals derived from NOAA CPC historical composites and IRI seasonal outlooks.
              Conviction dots reflect historical frequency of ENSO-driven anomaly.
              Climate-signal overlay only — not financial advice.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
