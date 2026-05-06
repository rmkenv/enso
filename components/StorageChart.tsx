'use client';
import { useEffect, useState } from 'react';
import {
  ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { STORAGE_SCENARIOS } from '@/lib/energy';
import { ENSOPhase } from '@/lib/enso';

interface EIAPoint { period: string; value: number; }

interface StorageData {
  actual: EIAPoint[];
  fiveYrAvg: EIAPoint[];
  fiveYrHigh: EIAPoint[];
  fiveYrLow: EIAPoint[];
  lastUpdated: string;
  source: string;
  error?: string;
}

function fmtDate(period: string) {
  const d = new Date(period + 'T12:00:00Z');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#151b22', border: '1px solid rgba(255,255,255,0.12)',
      padding: '10px 14px', fontSize: 11, fontFamily: 'IBM Plex Mono', minWidth: 180,
    }}>
      <div style={{ color: '#7a8499', marginBottom: 8, fontSize: 10 }}>{label}</div>
      {payload
        .filter((p: any) => p.value != null)
        .sort((a: any, b: any) => (b.value ?? 0) - (a.value ?? 0))
        .map((p: any) => (
          <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 3 }}>
            <span style={{ color: p.color ?? p.stroke ?? '#7a8499' }}>{p.name}</span>
            <span style={{ color: '#e8eaf0', fontWeight: 600 }}>{p.value?.toLocaleString()} Bcf</span>
          </div>
        ))}
    </div>
  );
};

interface Props { activePhase: ENSOPhase; }
type ViewMode = 'live' | 'scenarios';

export function StorageChart({ activePhase }: Props) {
  const [data, setData] = useState<StorageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('live');

  useEffect(() => {
    fetch('/api/storage')
      .then(r => r.json())
      .then((d: StorageData) => {
        setData(d);
        setViewMode(d.actual?.length > 0 && !d.error ? 'live' : 'scenarios');
      })
      .catch(() => setViewMode('scenarios'))
      .finally(() => setLoading(false));
  }, []);

  const hasLiveData = data && data.actual?.length > 0 && !data.error;

  const liveChartData = (() => {
    if (!hasLiveData) return [];
    const avgMap  = new Map(data.fiveYrAvg.map(p  => [p.period, p.value]));
    const highMap = new Map(data.fiveYrHigh.map(p => [p.period, p.value]));
    const lowMap  = new Map(data.fiveYrLow.map(p  => [p.period, p.value]));
    return data.actual.map(p => ({
      label:       fmtDate(p.period),
      'Actual':    p.value,
      '5yr Avg':   avgMap.get(p.period)  ?? null,
      'Band High': highMap.get(p.period) ?? null,
      'Band Low':  lowMap.get(p.period)  ?? null,
    }));
  })();

  const scenarioData = STORAGE_SCENARIOS.labels.map((label, i) => ({
    label,
    'El Niño': STORAGE_SCENARIOS.elNino[i],
    'Neutral': STORAGE_SCENARIOS.neutral[i],
    'La Niña': STORAGE_SCENARIOS.laNina[i],
    '5yr Avg': STORAGE_SCENARIOS.fiveYrAvg[i],
  }));

  const activeKey = activePhase === 'el-nino' ? 'El Niño' :
                    activePhase === 'la-nina'  ? 'La Niña' : 'Neutral';

  const latestActual = data?.actual?.at(-1)?.value;
  const latestAvg    = data?.fiveYrAvg?.at(-1)?.value;
  const vsAvg = (latestActual && latestAvg) ? Math.round(latestActual - latestAvg) : null;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: '0.12em', color: '#3d4455', display: 'flex', alignItems: 'center', gap: 8 }}>
            US NAT GAS STORAGE (BCF)
            {loading  && <span style={{ color: '#3d4455' }}>fetching...</span>}
            {!loading && hasLiveData  && <span style={{ color: '#10b981' }}>● EIA LIVE</span>}
            {!loading && !hasLiveData && <span style={{ color: '#f59e0b' }}>⚠ SCENARIOS ONLY — add EIA_API_KEY</span>}
          </div>
          {hasLiveData && vsAvg !== null && (
            <div style={{ fontSize: 10, marginTop: 4, fontFamily: 'IBM Plex Mono' }}>
              <span style={{ color: '#7a8499' }}>Latest: </span>
              <span style={{ color: '#e8eaf0', fontWeight: 600 }}>{latestActual?.toLocaleString()} Bcf</span>
              <span style={{ color: vsAvg >= 0 ? '#10b981' : '#ef4444', marginLeft: 8 }}>
                {vsAvg >= 0 ? '+' : ''}{vsAvg} vs 5yr avg
              </span>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 2, background: 'rgba(255,255,255,0.04)', borderRadius: 4, padding: 2 }}>
          {(['live', 'scenarios'] as ViewMode[]).map(v => (
            <button key={v} onClick={() => setViewMode(v)} style={{
              padding: '3px 10px', borderRadius: 3, border: 'none', cursor: 'pointer',
              fontSize: 9, fontFamily: 'IBM Plex Mono', fontWeight: 600, letterSpacing: '0.06em',
              background: viewMode === v ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: viewMode === v ? '#e8eaf0' : '#3d4455',
              opacity: v === 'live' && !hasLiveData ? 0.35 : 1,
            }}>
              {v === 'live' ? 'LIVE' : 'ENSO SIM'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ width: '100%', height: 180 }}>
        <ResponsiveContainer>
          {viewMode === 'live' && hasLiveData ? (
            <ComposedChart data={liveChartData} margin={{ top: 4, right: 8, bottom: 0, left: -8 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: '#3d4455', fontSize: 9, fontFamily: 'IBM Plex Mono' }} axisLine={false} tickLine={false} interval={7} />
              <YAxis tick={{ fill: '#3d4455', fontSize: 9, fontFamily: 'IBM Plex Mono' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(1)}T`} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.06)' }} />
              <ReferenceLine y={3500} stroke="rgba(239,68,68,0.25)" strokeDasharray="3 3" />
              <ReferenceLine y={1000} stroke="rgba(239,68,68,0.25)" strokeDasharray="3 3" />
              <Area type="monotone" dataKey="Band High" stroke="none" fill="rgba(255,255,255,0.05)" name="5yr High" dot={false} legendType="none" />
              <Area type="monotone" dataKey="Band Low"  stroke="none" fill="#0f1318" name="5yr Low" dot={false} legendType="none" />
              <Line type="monotone" dataKey="5yr Avg" stroke="rgba(255,255,255,0.2)" strokeWidth={1} strokeDasharray="4 4" dot={false} name="5yr Avg" />
              <Line type="monotone" dataKey="Actual"  stroke="#10b981" strokeWidth={2} dot={false} name="Actual" connectNulls />
            </ComposedChart>
          ) : (
            <ComposedChart data={scenarioData} margin={{ top: 4, right: 8, bottom: 0, left: -8 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: '#3d4455', fontSize: 9, fontFamily: 'IBM Plex Mono' }} axisLine={false} tickLine={false} />
              <YAxis domain={[600, 4000]} tick={{ fill: '#3d4455', fontSize: 9, fontFamily: 'IBM Plex Mono' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(1)}T`} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.06)' }} />
              <ReferenceLine y={3500} stroke="rgba(239,68,68,0.25)" strokeDasharray="3 3" />
              <ReferenceLine y={1000} stroke="rgba(239,68,68,0.25)" strokeDasharray="3 3" />
              {[
                { key: 'El Niño', color: '#f59e0b' },
                { key: 'Neutral', color: '#6b7280' },
                { key: 'La Niña', color: '#3b82f6' },
                { key: '5yr Avg', color: 'rgba(255,255,255,0.2)', dash: '4 4' },
              ].map(l => (
                <Line key={l.key} type="monotone" dataKey={l.key} stroke={l.color}
                  strokeWidth={l.key === activeKey ? 2 : 1} strokeDasharray={l.dash}
                  dot={false} opacity={l.key === activeKey || l.key === '5yr Avg' ? 1 : 0.2} name={l.key} />
              ))}
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>

      <div style={{ display: 'flex', gap: 14, marginTop: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        {viewMode === 'live' && hasLiveData ? (
          <>
            {[
              { label: 'Actual',  color: '#10b981' },
              { label: '5yr Avg', color: 'rgba(255,255,255,0.2)' },
              { label: '5yr Range', color: 'rgba(255,255,255,0.08)', height: 8 },
            ].map(l => (
              <span key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#3d4455' }}>
                <span style={{ display: 'inline-block', width: 20, height: (l as any).height ?? 2, background: l.color, borderRadius: 2 }} />
                {l.label}
              </span>
            ))}
            <span style={{ fontSize: 9, color: '#3d4455', marginLeft: 'auto' }}>
              EIA Natural Gas Weekly · {data?.lastUpdated ? new Date(data.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
            </span>
          </>
        ) : (
          <>
            {[
              { label: 'El Niño', color: '#f59e0b' },
              { label: 'Neutral', color: '#6b7280' },
              { label: 'La Niña', color: '#3b82f6' },
              { label: '5yr Avg', color: 'rgba(255,255,255,0.2)' },
            ].map(l => (
              <span key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: '#3d4455' }}>
                <span style={{ display: 'inline-block', width: 20, height: 2, background: l.color, borderRadius: 1 }} />
                {l.label}
              </span>
            ))}
            <span style={{ fontSize: 9, color: '#3d4455', marginLeft: 'auto' }}>ENSO historical analogs</span>
          </>
        )}
      </div>
    </div>
  );
}
