'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { getENSOSummary, PHASE_COLORS } from '@/lib/enso';

export function SharedNav() {
  const pathname = usePathname();
  const summary = getENSOSummary();
  const phaseColor = PHASE_COLORS[summary.currentPhase];
  const phaseName = summary.currentPhase === 'el-nino' ? 'EL NIÑO' :
                    summary.currentPhase === 'la-nina' ? 'LA NIÑA' : 'NEUTRAL';

  const tabs = [
    { href: '/',       label: 'AGRI',   sub: 'Commodities' },
    { href: '/energy', label: 'ENERGY', sub: 'Power & Fuels' },
  ];

  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 20px',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      background: '#0c1015',
      position: 'sticky', top: 0, zIndex: 50,
      height: 44,
    }}>
      {/* Left: logo + tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingRight: 20, borderRight: '1px solid rgba(255,255,255,0.06)' }}>
          <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="10" stroke={phaseColor} strokeWidth="1.5" opacity="0.6"/>
            <path d="M3 11 Q11 2 19 11 Q11 20 3 11Z" fill={phaseColor} opacity="0.3"/>
            <circle cx="11" cy="11" r="3" fill={phaseColor}/>
          </svg>
          <span style={{
            fontFamily: 'IBM Plex Mono', fontWeight: 600, fontSize: 12,
            letterSpacing: '0.15em', color: '#e8eaf0',
          }}>
            ENSO<span style={{ color: phaseColor }}>DESK</span>
          </span>
        </div>

        {/* Dashboard tabs */}
        <nav style={{ display: 'flex', height: '100%', marginLeft: 4 }}>
          {tabs.map(tab => {
            const active = pathname === tab.href;
            return (
              <Link key={tab.href} href={tab.href} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '0 16px', height: '100%',
                borderBottom: active ? `2px solid ${phaseColor}` : '2px solid transparent',
                textDecoration: 'none',
                transition: 'all 0.15s',
              }}>
                <span style={{
                  fontFamily: 'IBM Plex Mono', fontSize: 11, fontWeight: 600,
                  letterSpacing: '0.1em',
                  color: active ? phaseColor : '#3d4455',
                }}>{tab.label}</span>
                <span style={{
                  fontFamily: 'IBM Plex Mono', fontSize: 9,
                  color: active ? `${phaseColor}80` : '#2a2f3a',
                  letterSpacing: '0.05em',
                }}>{tab.sub}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Right: status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="live-dot" />
          <span style={{ fontSize: 10, color: '#3d4455', fontFamily: 'IBM Plex Mono' }}>NOAA CPC</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: '#3d4455', fontFamily: 'IBM Plex Mono' }}>ONI</span>
          <span style={{ fontSize: 13, color: phaseColor, fontFamily: 'IBM Plex Mono', fontWeight: 600 }}>
            {summary.currentONI > 0 ? '+' : ''}{summary.currentONI.toFixed(1)}°C
          </span>
        </div>
        <span style={{
          fontSize: 10, padding: '2px 8px', borderRadius: 3,
          border: `1px solid ${phaseColor}40`, color: phaseColor,
          fontFamily: 'IBM Plex Mono', fontWeight: 600, letterSpacing: '0.1em',
        }}>{phaseName}</span>
      </div>
    </header>
  );
}
