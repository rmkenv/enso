'use client';
import { useEffect, useRef, useState } from 'react';
import type { Map as LeafletMap, Rectangle, ImageOverlay } from 'leaflet';
import { ENSOPhase, PHASE_COLORS } from '@/lib/enso';
import { REGIONS, SIGNAL_FILL, SIGNAL_STROKE, RegionFeature } from '@/lib/regions';

interface Props {
  phase: ENSOPhase;
  sectorFilter: 'all' | 'agri' | 'energy';
  onRegionSelect: (region: RegionFeature | null) => void;
}

export function ENSOMap({ phase, sectorFilter, onRegionSelect }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<LeafletMap | null>(null);
  const rectsRef     = useRef<Rectangle[]>([]);
  const sstRef       = useRef<ImageOverlay | null>(null);
  const [sstLoaded, setSstLoaded] = useState(false);
  const [sstError,  setSstError]  = useState(false);

  // Init map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Leaflet must be imported client-side only
    import('leaflet').then(L => {
      // Fix default marker icon paths broken by webpack
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      const map = L.map(containerRef.current!, {
        center: [10, -30],
        zoom: 2,
        minZoom: 1,
        maxZoom: 6,
        zoomControl: true,
        attributionControl: true,
        worldCopyJump: true,
      });

      // Dark base tiles — CartoDB Dark Matter, free, no key
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap © CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

      // Country labels on top (separate tile layer so they render above our overlays)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png', {
        attribution: '',
        subdomains: 'abcd',
        maxZoom: 19,
        pane: 'shadowPane', // render above overlays
      }).addTo(map);

      mapRef.current = map;

      // SST image overlay — NOAA ERDDAP via our proxy
      // Bounds: [30S, 100E] to [30N, 290E] — but Leaflet uses [-180,180] lng
      // 290E = -70 (360-290), so bounds are [[−30, 100], [30, −70]] — we use [100, 290] directly with worldCopyJump
      const sstOverlay = L.imageOverlay('/api/sst', [[-30, 100], [30, -70]], {
        opacity: 0.55,
        interactive: false,
        crossOrigin: 'anonymous',
        zIndex: 200,
      }).addTo(map);

      sstOverlay.on('load',  () => setSstLoaded(true));
      sstOverlay.on('error', () => setSstError(true));
      sstRef.current = sstOverlay;
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Redraw rectangles when phase or filter changes
  useEffect(() => {
    if (!mapRef.current) return;

    import('leaflet').then(L => {
      const map = mapRef.current!;

      // Remove old rectangles
      rectsRef.current.forEach(r => r.remove());
      rectsRef.current = [];

      const visible = REGIONS.filter(r =>
        sectorFilter === 'all' ||
        r.sector === sectorFilter ||
        r.sector === 'both'
      );

      visible.forEach(region => {
        const sig = region.getSignal(phase);
        const fill   = SIGNAL_FILL[sig.direction][sig.magnitude];
        const stroke = SIGNAL_STROKE[sig.direction];

        const rect = L.rectangle(region.bounds, {
          color:       stroke,
          weight:      sig.magnitude === 'strong' ? 1.5 : 1,
          opacity:     0.9,
          fillColor:   fill,
          fillOpacity: 1,
          dashArray:   sig.direction === 'neutral' ? '4 4' : undefined,
          interactive: region.id !== 'nino34', // Niño 3.4 box is display-only
        });

        if (region.id !== 'nino34') {
          rect.on('click', () => onRegionSelect(region));
          rect.on('mouseover', () => {
            rect.setStyle({ weight: 2, fillOpacity: 1 });
          });
          rect.on('mouseout', () => {
            rect.setStyle({ weight: sig.magnitude === 'strong' ? 1.5 : 1, fillOpacity: 1 });
          });
        }

        // Label marker (div icon)
        if (region.id !== 'nino34') {
          const commodityStr = region.commodities.slice(0, 3).join(' · ');
          const arrow = sig.direction === 'bullish' ? '▲' : sig.direction === 'bearish' ? '▼' : '—';
          const color = sig.direction === 'bullish' ? '#10b981' : sig.direction === 'bearish' ? '#ef4444' : '#6b7280';

          const icon = L.divIcon({
            className: '',
            html: `
              <div style="
                background: rgba(10,12,15,0.82);
                border: 1px solid ${stroke};
                border-radius: 3px;
                padding: 3px 7px;
                font-family: 'IBM Plex Mono', monospace;
                font-size: 10px;
                color: ${color};
                white-space: nowrap;
                pointer-events: none;
                backdrop-filter: blur(4px);
              ">
                <span style="font-size:9px; opacity:0.7; color:#7a8499">${commodityStr}</span>
                <span style="margin-left:5px; font-weight:600;">${arrow}</span>
              </div>`,
            iconAnchor: [40, 12],
          });

          const marker = L.marker(region.center, { icon, interactive: false });
          marker.addTo(map);
          // Store marker on rect for cleanup (hack: attach to rect)
          (rect as any)._labelMarker = marker;
        } else {
          // Special Niño 3.4 label
          const phaseColor = PHASE_COLORS[phase];
          const icon = L.divIcon({
            className: '',
            html: `<div style="
              background: rgba(10,12,15,0.85);
              border: 1px solid ${phaseColor}80;
              border-radius: 3px;
              padding: 3px 10px;
              font-family: 'IBM Plex Mono', monospace;
              font-size: 10px;
              color: ${phaseColor};
              white-space: nowrap;
              pointer-events: none;
              letter-spacing: 0.08em;
            ">NIÑO 3.4</div>`,
            iconAnchor: [36, 10],
          });
          L.marker([0, -145], { icon, interactive: false }).addTo(map);
        }

        rect.addTo(map);
        rectsRef.current.push(rect);
      });
    });
  }, [phase, sectorFilter, onRegionSelect]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      {/* SST overlay status */}
      {!sstLoaded && !sstError && (
        <div style={{
          position: 'absolute', bottom: 28, left: 8, zIndex: 1000,
          background: 'rgba(10,12,15,0.85)', border: '1px solid rgba(255,255,255,0.06)',
          padding: '3px 10px', borderRadius: 3, fontSize: 10,
          fontFamily: 'IBM Plex Mono', color: '#3d4455',
        }}>
          Loading SST anomaly…
        </div>
      )}
      {sstLoaded && (
        <div style={{
          position: 'absolute', bottom: 28, left: 8, zIndex: 1000,
          background: 'rgba(10,12,15,0.85)', border: '1px solid rgba(16,185,129,0.3)',
          padding: '3px 10px', borderRadius: 3, fontSize: 10,
          fontFamily: 'IBM Plex Mono', color: '#10b981',
        }}>
          ● SST anomaly · NOAA ERSSTv5
        </div>
      )}
    </div>
  );
}
