import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const revalidate = 3600; // cache 1 hour

export async function GET() {
  try {
    // NOAA CPC ONI ASCII endpoint
    const res = await fetch('https://www.cpc.ncep.noaa.gov/data/indices/oni.ascii.txt', {
      headers: { 'User-Agent': 'ENSO-Trader-Dashboard/1.0' },
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error(`NOAA fetch failed: ${res.status}`);

    const text = await res.text();
    const lines = text.trim().split('\n').filter(l => l.trim() && !l.startsWith('SEAS'));

    type ParsedRecord = { year: number; month: number; value: number; phase: string; label: string };
    const records: ParsedRecord[] = [];
    const monthMap: Record<string,number> = {
      DJF:1, JFM:2, FMA:3, MAM:4, AMJ:5, MJJ:6,
      JJA:7, JAS:8, ASO:9, SON:10, OND:11, NDJ:12
    };

    for (const line of lines) {
      const parts = line.trim().split(/\s+/);
      if (parts.length < 4) continue;
      const seas = parts[0];
      const year = parseInt(parts[1]);
      const anom = parseFloat(parts[3]);
      if (isNaN(year) || isNaN(anom) || !monthMap[seas]) continue;

      const month = monthMap[seas];
      const phase = anom >= 0.5 ? 'el-nino' : anom <= -0.5 ? 'la-nina' : 'neutral';
      const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      records.push({ year, month, value: anom, phase, label: `${monthNames[month-1]} ${year}` });
    }

    return NextResponse.json({ records, source: 'NOAA CPC', fetchedAt: new Date().toISOString() });
  } catch (err) {
    // Fallback: return 200 with error flag so client uses static data
    return NextResponse.json({ error: String(err), records: [] }, { status: 200 });
  }
}
