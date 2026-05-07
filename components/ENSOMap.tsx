'use client';
import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { ENSOPhase, PHASE_COLORS } from '@/lib/enso';
import { REGIONS, SIGNAL_FILL, SIGNAL_STROKE, RegionFeature } from '@/lib/regions';

interface Props {
  phase: ENSOPhase;
  sectorFilter: 'all' | 'agri' | 'energy';
  onRegionSelect: (region: RegionFeature | null) => void;
}

export function ENSOMap({ phase, sectorFilter, onRegionSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<any>(null);
  const layersRef    = useRef<any[]>([]); // rects + markers together
  const LRef         = useRef<any>(null); // cached leaflet module
  const [sstLoaded, setSstLoaded] = useState(false);
  const [sstError,  setSstError]  = useState(false);
  const [mapReady,  setMapReady]  = useState(false);

  // ── Init map once ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    import('leaflet').then(L => {
      LRef.current = L;

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      const map = L.map(containerRef.current!, {
        center: [15, 10],
        zoom: 2,
        minZoom: 1,
        maxZoom: 6,
        zoomControl: true,
        attributionControl: true,
        worldCopyJump: false,
      });

      // Dark base tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      // Label overlay on top
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 19,
        zIndex: 500,
      }).addTo(map);

      mapRef.current = map;

      // SST image overlay
      try {
        const sst = L.imageOverlay('/api/sst', [[-30, 100], [30, -70]], {
          opacity: 0.55,
          interactive: false,
          crossOrigin: 'anonymous',
          zIndex: 200,
        }).addTo(map);
        sst.on('load',  () => setSstLoaded(true));
        sst.on('error', () => setSstError(true));
      } catch (_) {
        setSstError(true);
      }

      // Force tile repaint after mount
      setTimeout(() => {
        map.invalidateSize();
        setMapReady(true);
      }, 100);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // ── Redraw signal layers when map ready / phase / filter changes ─────────
  useEffect(() => {
    if (!mapReady || !mapRef.current || !LRef.current) return;

    const L   = LRef.current;
    const map = mapRef.current;

    // Remove all previous layers
    layersRef.current.forEach(l => l.remove());
    layersRef.current = [];

    const visible = REGIONS.filter(r =>
      sectorFilter === 'all' || r.sector === sectorFilter || r.sector === 'both'
    );

    visible.forEach(region => {
      const sig    = region.getSignal(phase);
      const fill   = SIGNAL_FILL[sig.direction][sig.magnitude];
      const stroke = SIGNAL_STROKE[sig.direction];
      const isNino = region.id === 'nino34';

      // Rectangle
      const rect = L.rectangle(region.bounds, {
        color:       stroke,
        weight:      sig.magnitude === 'strong' ? 2 : 1.5,
        opacity:     1,
        fillColor:   fill,
        fillOpacity: 1,
        dashArray:   sig.direction === 'neutral' ? '5 5' : undefined,
        interactive: !isNino,
      }).addTo(map);

      if (!isNino) {
        rect.on('click', () => onRegionSelect(region));
        rect.on('mouseover', () => rect.setStyle({ weight: 3 }));
        rect.on('mouseout',  () => rect.setStyle({ weight: sig.magnitude === 'strong' ? 2 : 1.5 }));
      }

      layersRef.current.push(rect);

      // Label marker
      const arrow = sig.direction === 'bullish' ? '▲' : sig.direction === 'bearish' ? '▼' : '—';
      const color = sig.direction === 'bullish' ? '#10b981' : sig.direction === 'bearish' ? '#ef4444' : '#6b7280';
      const phaseColor = PHASE_COLORS[phase];

      const labelHtml = isNino
        ? `<div style="background:rgba(10,12,15,0.88);border:1px solid ${phaseColor}70;border-radius:3px;padding:2px 8px;font-family:'IBM Plex Mono',monospace;font-size:10px;color:${phaseColor};white-space:nowrap;pointer-events:none;letter-spacing:0.08em;">NIÑO 3.4</div>`
        : `<div style="background:rgba(10,12,15,0.88);border:1px solid ${stroke};border-radius:3px;padding:2px 7px;font-family:'IBM Plex Mono',monospace;font-size:10px;color:${color};white-space:nowrap;pointer-events:none;">
             <span style="font-size:9px;color:#7a8499;">${region.commodities.slice(0,3).join(' · ')}</span>
             <span style="margin-left:5px;font-weight:700;">${arrow}</span>
           </div>`;

      const center: [number, number] = isNino ? [0, -145] : region.center;

      const icon = L.divIcon({ className: '', html: labelHtml, iconAnchor: [40, 12] });
      const marker = L.marker(center, { icon, interactive: false, zIndexOffset: 1000 }).addTo(map);
      layersRef.current.push(marker);
    });

  }, [mapReady, phase, sectorFilter, onRegionSelect]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      {!sstLoaded && !sstError && (
        <div style={{
          position: 'absolute', bottom: 28, left: 8, zIndex: 1000,
          background: 'rgba(10,12,15,0.85)', border: '1px solid rgba(255,255,255,0.06)',
          padding: '3px 10px', borderRadius: 3, fontSize: 10, fontFamily: 'IBM Plex Mono', color: '#3d4455',
        }}>
          Loading SST anomaly…
        </div>
      )}
      {sstLoaded && (
        <div style={{
          position: 'absolute', bottom: 28, left: 8, zIndex: 1000,
          background: 'rgba(10,12,15,0.85)', border: '1px solid rgba(16,185,129,0.3)',
          padding: '3px 10px', borderRadius: 3, fontSize: 10, fontFamily: 'IBM Plex Mono', color: '#10b981',
        }}>
          ● SST anomaly · NOAA ERSSTv5
        </div>
      )}
    </div>
  );
}
