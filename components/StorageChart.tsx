'use client';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { STORAGE_SCENARIOS } from '@/lib/energy';
import { ENSOPhase } from '@/lib/enso';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#151b22', border: '1px solid rgba(255,255,255,0.1)',
      padding: '8px 12px', fontSize: 11, fontFamily: 'IBM Plex Mono',
    }}>
      <div style={{ color: '#7a8499', marginBottom: 6 }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ color: p.color, marginBottom: 2 }}>
          {p.name}: <span style={{ color: '#e8eaf0' }}>{p.value?.toLocaleString()} Bcf</span>
        </div>
      ))}
    </div>
  );
};

interface Props { activePhase: ENSOPhase; }

export function StorageChart({ activePhase }: Props) {
  const data = STORAGE_SCENARIOS.labels.map((label, i) => ({
    label,
    'El Niño':   STORAGE_SCENARIOS.elNino[i],
    'Neutral':   STORAGE_SCENARIOS.neutral[i],
    'La Niña':   STORAGE_SCENARIOS.laNina[i],
    '5yr Avg':   STORAGE_SCENARIOS.fiveYrAvg[i],
  }));

  const activeKey = activePhase === 'el-nino' ? 'El Niño' :
                    activePhase === 'la-nina'  ? 'La Niña' : 'Neutral';

  const lines = [
    { key: 'El Niño', color: '#f59e0b', dash: undefined },
    { key: 'Neutral', color: '#6b7280', dash: undefined },
    { key: 'La Niña', color: '#3b82f6', dash: undefined },
    { key: '5yr Avg', color: 'rgba(255,255,255,0.2)', dash: '4 4' },
  ];

  return (
    <div style={{ width: '100%', height: 180 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -8 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} strokeDasharray="0" />
          <XAxis
            dataKey="label"
            tick={{ fill: '#3d4455', fontSize: 10, fontFamily: 'IBM Plex Mono' }}
            axisLine={false} tickLine={false}
          />
          <YAxis
            domain={[600, 4000]}
            tick={{ fill: '#3d4455', fontSize: 10, fontFamily: 'IBM Plex Mono' }}
            axisLine={false} tickLine={false}
            tickFormatter={v => `${(v/1000).toFixed(1)}T`}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={3500} stroke="rgba(239,68,68,0.3)" strokeDasharray="3 3" label={{ value:'Max cap', fill:'#3d4455', fontSize:9 }} />
          <ReferenceLine y={1000} stroke="rgba(239,68,68,0.3)" strokeDasharray="3 3" label={{ value:'Low', fill:'#3d4455', fontSize:9 }} />
          {lines.map(l => (
            <Line
              key={l.key}
              type="monotone"
              dataKey={l.key}
              stroke={l.color}
              strokeWidth={l.key === activeKey ? 2 : 1}
              strokeDasharray={l.dash}
              dot={false}
              opacity={l.key === activeKey || l.key === '5yr Avg' ? 1 : 0.25}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
