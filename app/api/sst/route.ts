import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  try {
    // NOAA ERDDAP: ERSSTv5 monthly SST anomaly
    // Returns PNG image for the Pacific basin covering the Niño regions
    // Dataset: noaaErsstv5 | variable: ssta (SST anomaly vs 1981-2010 climatology)
    // Bounding box: 30°S–30°N, 100°E–290°E (covers full tropical Pacific)
    const erddapUrl = [
      'https://coastwatch.pfeg.noaa.gov/erddap/griddap/noaaErsstv5.png',
      '?ssta',
      '[(last)]',           // most recent time step
      '[(30):(-30)]',       // latitude: 30N to 30S
      '[(100):(290)]',      // longitude: 100E to 290E (wraps Pacific)
      '&.draw=surface',
      '&.vars=longitude|latitude|ssta',
      '&.colorBar=RdYlBu|D|Linear|-3|3|',  // blue=cold, red=warm, ±3°C range
      '&.bgColor=0x1a1a2e',
      '&.size=800|300',
    ].join('');

    const res = await fetch(erddapUrl, {
      headers: { 'User-Agent': 'ENSODesk/1.0' },
    });

    if (!res.ok) throw new Error(`ERDDAP ${res.status}`);

    const buf = await res.arrayBuffer();
    return new NextResponse(buf, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=172800', // cache 24h — monthly data
      },
    });
  } catch (err) {
    // Return a 1x1 transparent PNG on error — map handles missing overlay gracefully
    const transparentPng = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    return new NextResponse(Buffer.from(transparentPng, 'base64'), {
      headers: { 'Content-Type': 'image/png', 'X-SST-Error': String(err) },
    });
  }
}
