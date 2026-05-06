import { NextResponse } from 'next/server';

export const runtime = 'edge';

// EIA series IDs
// NW_EPC0_SAX_NUS_BCF — US total working gas in storage (weekly)
// NW_EPC0_SAX_NUS_BCF_5YR — EIA 5-year average (if available via v2 API)

interface EIAPoint {
  period: string;   // "2025-04-25"
  value: number;    // Bcf
}

interface StorageResponse {
  actual: EIAPoint[];
  fiveYrAvg: EIAPoint[];
  fiveYrHigh: EIAPoint[];
  fiveYrLow: EIAPoint[];
  lastUpdated: string;
  source: string;
  error?: string;
}

async function fetchEIASeries(apiKey: string, seriesId: string, startDate: string): Promise<EIAPoint[]> {
  const url = new URL('https://api.eia.gov/v2/natural-gas/stor/wkly/data/');
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('frequency', 'weekly');
  url.searchParams.set('data[0]', 'value');
  url.searchParams.set('facets[series][]', seriesId);
  url.searchParams.set('start', startDate);
  url.searchParams.set('sort[0][column]', 'period');
  url.searchParams.set('sort[0][direction]', 'asc');
  url.searchParams.set('length', '104'); // ~2 years of weekly data

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`EIA API ${res.status}: ${await res.text()}`);

  const json = await res.json();
  const rows = json?.response?.data ?? [];

  return rows
    .filter((r: any) => r.value !== null && r.value !== undefined)
    .map((r: any) => ({
      period: r.period,
      value: Number(r.value),
    }));
}

export async function GET() {
  const apiKey = process.env.EIA_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      error: 'EIA_API_KEY not configured',
      actual: [],
      fiveYrAvg: [],
      fiveYrHigh: [],
      fiveYrLow: [],
      lastUpdated: new Date().toISOString(),
      source: 'EIA',
    } as StorageResponse, { status: 200 });
  }

  try {
    // Start date: ~2 years back for context
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 2);
    const startStr = startDate.toISOString().split('T')[0];

    // Fetch actual weekly storage (US total)
    const [actual, fiveYrAvg, fiveYrHigh, fiveYrLow] = await Promise.all([
      fetchEIASeries(apiKey, 'NW_EPC0_SAX_NUS_BCF',        startStr),
      fetchEIASeries(apiKey, 'NW_EPC0_SAX_NUS_BCF_5YA',    startStr),
      fetchEIASeries(apiKey, 'NW_EPC0_SAX_NUS_BCF_5YH',    startStr),
      fetchEIASeries(apiKey, 'NW_EPC0_SAX_NUS_BCF_5YL',    startStr),
    ]);

    return NextResponse.json({
      actual,
      fiveYrAvg,
      fiveYrHigh,
      fiveYrLow,
      lastUpdated: new Date().toISOString(),
      source: 'EIA Natural Gas Weekly Storage Report',
    } as StorageResponse, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });
  } catch (err) {
    return NextResponse.json({
      error: String(err),
      actual: [],
      fiveYrAvg: [],
      fiveYrHigh: [],
      fiveYrLow: [],
      lastUpdated: new Date().toISOString(),
      source: 'EIA',
    } as StorageResponse, { status: 200 }); // 200 so client can show fallback
  }
}
