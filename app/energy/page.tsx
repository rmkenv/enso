'use client';
import { useState } from 'react';
import { getENSOSummary, PHASE_COLORS, HISTORICAL_ONI } from '@/lib/enso';
import { getEnergySignals, getRegionalDemandImpacts } from '@/lib/energy';
import { TickerTape } from '@/components/TickerTape';
import { ONIChart } from '@/components/ONIChart';
import { ProbGauge } from '@/components/ProbGauge';
import { EnergyMatrix } from '@/components/EnergyMatrix';
import { StorageChart } from '@/components/StorageChart';
import { RegionalDemandGrid } from '@/components/RegionalDemandGrid';

export default function EnergyPage() {
  const summary = getENSOSummary();
  const [activePhase, setActivePhase] = useState(summary.currentPhase);

  const signals = getEnergySignals(activePhase);
  const regionalImpacts = getRegionalDemandImpacts(activePhase);
  const phaseColor = PHASE_COLORS[summary.currentPhase];
  const phaseName = summary.currentPhase === 'el-nino' ? 'EL NIÑO' :
                    summary.currentPhase === 'la-nina' ? 'LA NIÑA' : 'NEUTRAL';
  const trendArrow = summary.trend === 'strengthening' ? '↓' :
                     summary.trend === 'weakening' ? '↑' : '→';

  // Degree day stats from latest ONI
  const oni = summary.currentONI;
  const hddImpact = oni < 0
    ? `+${Math.round(Math.abs(oni) * 7)}% above normal (US S. Central)`
    : oni > 0
    ? `${Math.round(oni * 8)}% below normal (US S. Central)`
    : 'Near-normal HDD expected';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TickerTape />

      <main style={{ flex: 1, display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: 0 }}>

        {/* Left sidebar */}
        <aside style={{
          borderRight: '1px solid rgba(255,255,255,0.06)',
          background: '#0c1015',
          padding: '16px',
          display: 'flex', flexDirection: 'column', gap: 20,
          overflowY: 'auto',
        }}>

          {/* ONI reading */}
          <div>
            <div style={{ fontSize: 9, letterSpacing: '0.12em', color: '#3d4455', marginBottom: 12 }}>
              CLIMATE DRIVER — ONI
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 40, fontWeight: 300, color: phaseColor, fontFamily: 'IBM Plex Mono', lineHeight: 1 }}>
                {oni > 0 ? '+' : ''}{oni.toFixed(1)}
              </span>
              <span style={{ fontSize: 13, color: '#3d4455' }}>°C</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{
                fontSize: 10, padding: '2px 8px', borderRadius: 3,
                background: `${phaseColor}20`, color: phaseColor,
                fontWeight: 600, letterSpacing: '0.08em',
              }}>{phaseName}</span>
              <span style={{ fontSize: 10, color: '#3d4455' }}>{trendArrow} {summary.trend}</span>
            </div>
          </div>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.05)' }} />

          {/* Energy-specific derived metrics */}
          <div>
            <div style={{ fontSize: 9, letterSpacing: '0.12em', color: '#3d4455', marginBottom: 12 }}>
              DERIVED ENERGY METRICS
            </div>
            {[
              {
                label: 'HDD Anomaly',
                value: hddImpact,
                col: oni < -0.5 ? '#10b981' : oni > 0.5 ? '#ef4444' : '#6b7280',
              },
              {
                label: 'NG Storage Bias',
                value: oni < -0.5 ? 'Draw risk elevated' : oni > 0.5 ? 'Build risk elevated' : 'Neutral trajectory',
                col: oni < -0.5 ? '#10b981' : oni > 0.5 ? '#ef4444' : '#6b7280',
              },
              {
                label: 'LNG Asia Demand',
                value: oni < -0.5 ? 'Above seasonal avg' : oni > 0.5 ? 'Below seasonal avg' : 'Near normal',
                col: oni < -0.5 ? '#10b981' : oni > 0.5 ? '#ef4444' : '#6b7280',
              },
              {
                label: 'Hydro Risk (PNW)',
                value: oni < -0.5 ? 'Elevated — low SWE' : oni > 0.5 ? 'Low — high SWE' : 'Normal snowpack',
                col: oni < -0.5 ? '#ef4444' : oni > 0.5 ? '#10b981' : '#6b7280',
              },
            ].map(m => (
              <div key={m.label} style={{
                padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.03)',
              }}>
                <div style={{ fontSize: 9, color: '#3d4455', marginBottom: 3, letterSpacing: '0.05em' }}>{m.label}</div>
                <div style={{ fontSize: 11, color: m.col, fontWeight: 500, lineHeight: 1.4 }}>{m.value}</div>
              </div>
            ))}
          </div>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.05)' }} />

          {/* Seasonal forecast */}
          <div>
            <div style={{ fontSize: 9, letterSpacing: '0.12em', color: '#3d4455', marginBottom: 12 }}>
              ENSO PHASE OUTLOOK
            </div>
            <ProbGauge {...summary.phaseProbabilities} />
          </div>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.05)' }} />

          {/* Energy calendar */}
          <div>
            <div style={{ fontSize: 9, letterSpacing: '0.12em', color: '#3d4455', marginBottom: 12 }}>
              ENERGY WATCH CALENDAR
            </div>
            {[
              { date: 'May 07', event: 'EIA Nat Gas storage', type: 'eia' },
              { date: 'May 08', event: 'EIA STEO release',    type: 'eia' },
              { date: 'May 14', event: 'EIA crude inventory', type: 'eia' },
              { date: 'May 15', event: 'NOAA ONI update',     type: 'noaa' },
              { date: 'May 20', event: 'IRI ENSO forecast',   type: 'noaa' },
              { date: 'Jun 1',  event: 'NOAA Summer outlook', type: 'noaa' },
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

          <div style={{ height: 1, background: 'rgba(255,255,255,0.05)' }} />

          {/* Key spreads to watch */}
          <div>
            <div style={{ fontSize: 9, letterSpacing: '0.12em', color: '#3d4455', marginBottom: 12 }}>
              SPREADS TO WATCH
            </div>
            {[
              { spread: 'NG Nov/Mar',     note: 'Winter strip',  col: phaseColor },
              { spread: 'HO/NG crack',    note: 'Heat vs gas',   col: phaseColor },
              { spread: 'JKM vs TTF',     note: 'LNG arb',       col: '#7a8499'  },
              { spread: 'PNW vs CAISO',   note: 'Hydro spill',   col: '#7a8499'  },
            ].map((s, i) => (
              <div key={i} style={{
                padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.03)',
              }}>
                <div style={{ fontSize: 11, color: s.col, fontWeight: 600, marginBottom: 2 }}>{s.spread}</div>
                <div style={{ fontSize: 9, color: '#3d4455' }}>{s.note}</div>
              </div>
            ))}
          </div>
        </aside>

        {/* Right content */}
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* ONI chart + storage chart side by side */}
          <div style={{
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            padding: '14px 20px',
            background: '#0f1318',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {/* ONI chart */}
              <div>
                <div style={{ fontSize: 9, letterSpacing: '0.12em', color: '#3d4455', marginBottom: 10 }}>
                  ONI · 5-YEAR HISTORY
                </div>
                <ONIChart />
              </div>

              {/* Storage - header + legend now self-contained in StorageChart */}
              <div>
                <StorageChart activePhase={activePhase} />
              </div>
            </div>
          </div>

          {/* Phase toggle + signal matrix */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px 20px' }}>

            {/* Phase toggle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontSize: 9, letterSpacing: '0.12em', color: '#3d4455' }}>
                ENSO → ENERGY SIGNAL MATRIX
              </div>
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
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '5px 12px', borderRadius: 3,
                background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
                marginBottom: 12, fontSize: 10, color: '#f59e0b',
              }}>
                ⚠ SCENARIO MODE — Not current conditions
              </div>
            )}

            <EnergyMatrix signals={signals} />

            {/* Regional demand section */}
            <div style={{ marginTop: 24, marginBottom: 12 }}>
              <div style={{ fontSize: 9, letterSpacing: '0.12em', color: '#3d4455', marginBottom: 12 }}>
                REGIONAL DEMAND IMPACTS
              </div>
              <RegionalDemandGrid impacts={regionalImpacts} />
            </div>

            {/* Methodology */}
            <div style={{
              marginTop: 16, padding: '12px 16px',
              background: 'rgba(255,255,255,0.02)', borderRadius: 4,
              borderLeft: '2px solid rgba(255,255,255,0.06)',
              fontSize: 10, color: '#3d4455', lineHeight: 1.8,
            }}>
              <span style={{ color: '#7a8499', fontWeight: 600 }}>METHODOLOGY</span>
              {' '}· HDD/CDD anomalies derived from NOAA CPC ENSO composites 1950–present.
              Storage scenarios are illustrative trajectories based on historical phase analogs.
              Signals reflect demand and supply channel effects with typical lag ranges noted.
              Not financial advice — cross-reference with EIA STEO, physical storage reports, and fundamental models.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
