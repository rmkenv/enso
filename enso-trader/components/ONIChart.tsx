'use client';
import {
  ComposedChart, Bar, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine,
  ResponsiveContainer, Cell,
} from 'recharts';
import { HISTORICAL_ONI, PHASE_COLORS } from '@/lib/enso';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const v = payload[0]?.value;
  const phase = v >= 0.5 ? 'El Niño' : v <= -0.5 ? 'La Niña' : 'Neutral';
  const col = v >= 0.5 ? '#f59e0b' : v <= -0.5 ? '#3b82f6' : '#6b7280';
  return (
    <div style={{
      background: '#151b22',
      border: '1px solid rgba(255,255,255,0.1)',
      padding: '8px 12px',
      fontSize: 11,
      fontFamily: 'IBM Plex Mono, monospace',
    }}>
      <div style={{ color: '#7a8499', marginBottom: 4 }}>{label}</div>
      <div style={{ color: col, fontSize: 16, fontWeight: 600 }}>{v?.toFixed(1)}°C</div>
      <div style={{ color: col, fontSize: 10, marginTop: 2 }}>{phase}</div>
    </div>
  );
};

export function ONIChart() {
  // Only show last 5 years for clarity
  const data = HISTORICAL_ONI.slice(-60).map(r => ({
    label: r.month === 1 ? `${r.year}` : r.month === 7 ? `Jul ${r.year}` : '',
    fullLabel: r.label,
    value: r.value,
    phase: r.phase,
  }));

  return (
    <div style={{ width: '100%', height: 200 }}>
      <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -10 }}>
          <CartesianGrid
            strokeDasharray="0"
            stroke="rgba(255,255,255,0.04)"
            vertical={false}
          />
          <XAxis
            dataKey="fullLabel"
            tickFormatter={(v, i) => {
              // show year labels only
              if (v.includes('Jan')) return v.split(' ')[1];
              return '';
            }}
            tick={{ fill: '#3d4455', fontSize: 10, fontFamily: 'IBM Plex Mono' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[-2.5, 2.5]}
            tick={{ fill: '#3d4455', fontSize: 10, fontFamily: 'IBM Plex Mono' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => `${v > 0 ? '+' : ''}${v}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <ReferenceLine y={0.5}  stroke="#f59e0b" strokeDasharray="3 3" strokeOpacity={0.4} />
          <ReferenceLine y={-0.5} stroke="#3b82f6" strokeDasharray="3 3" strokeOpacity={0.4} />
          <ReferenceLine y={0}    stroke="rgba(255,255,255,0.08)" />
          <Bar dataKey="value" maxBarSize={10} radius={[1,1,0,0]}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={PHASE_COLORS[entry.phase]}
                opacity={0.85}
              />
            ))}
          </Bar>
          <Line
            type="monotone"
            dataKey="value"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth={1}
            dot={false}
            legendType="none"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
