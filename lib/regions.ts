import { ENSOPhase } from './enso';

export interface RegionFeature {
  id: string;
  name: string;
  bounds: [[number, number], [number, number]]; // [[south, west], [north, east]]
  center: [number, number]; // [lat, lng]
  sector: 'agri' | 'energy' | 'both';
  commodities: string[];
  getSignal: (phase: ENSOPhase) => {
    direction: 'bullish' | 'bearish' | 'neutral';
    magnitude: 'strong' | 'moderate' | 'weak';
    headline: string;
    detail: string;
  };
}

export const REGIONS: RegionFeature[] = [
  // ── AGRICULTURAL REGIONS ──────────────────────────────────────────────────

  {
    id: 'us-corn-belt',
    name: 'US Corn Belt',
    bounds: [[36, -104], [48, -80]],
    center: [42, -92],
    sector: 'agri',
    commodities: ['ZC', 'ZS'],
    getSignal: (phase) => ({
      'el-nino': { direction: 'bearish',  magnitude: 'moderate', headline: 'Wetter spring favors planting',        detail: 'El Niño brings above-normal precip Apr–Jun; reduced drought stress for corn and soybeans' },
      'la-nina': { direction: 'bullish',  magnitude: 'moderate', headline: 'Aug–Sep dryness risk in IA/IL',        detail: 'La Niña dries out the Corn Belt during pollination; yield drag historically 3–8%' },
      'neutral':  { direction: 'neutral',  magnitude: 'weak',     headline: 'Weather-neutral; watch soil moisture', detail: 'No ENSO amplifier; local weather variability dominates' },
    }[phase] as any),
  },

  {
    id: 'argentina-pampas',
    name: 'Argentina Pampas',
    bounds: [[-42, -68], [-28, -56]],
    center: [-35, -62],
    sector: 'agri',
    commodities: ['ZW', 'ZS', 'ZC'],
    getSignal: (phase) => ({
      'el-nino': { direction: 'bearish',  magnitude: 'moderate', headline: 'Excess rain slows wheat harvest',      detail: 'El Niño brings flooding rains to Pampas; quality and harvest logistics impacted' },
      'la-nina': { direction: 'bullish',  magnitude: 'strong',   headline: 'Pampas drought raises export risk',    detail: 'La Niña dries Argentina sharply; wheat and soy exports historically reduced 10–20%' },
      'neutral':  { direction: 'neutral',  magnitude: 'weak',     headline: 'Normal variability',                   detail: 'Watch Buenos Aires province rainfall in Dec–Feb planting window' },
    }[phase] as any),
  },

  {
    id: 'brazil-cerrado',
    name: 'Brazil Cerrado',
    bounds: [[-20, -58], [-5, -44]],
    center: [-12, -50],
    sector: 'agri',
    commodities: ['ZS', 'ZC', 'KC'],
    getSignal: (phase) => ({
      'el-nino': { direction: 'neutral',  magnitude: 'weak',     headline: 'Mixed; watch Mato Grosso harvest lag', detail: 'El Niño can delay Cerrado soy harvest with excess rain in Feb–Mar' },
      'la-nina': { direction: 'bullish',  magnitude: 'moderate', headline: 'Cerrado dryness risk Oct–Jan',         detail: 'La Niña reduces early rains in Mato Grosso planting window; yield risk emerging' },
      'neutral':  { direction: 'neutral',  magnitude: 'weak',     headline: 'Normal monsoon expected',              detail: 'Cerrado monsoon onset timing key; watch Oct–Nov rainfall' },
    }[phase] as any),
  },

  {
    id: 'india-monsoon',
    name: 'India / South Asia',
    bounds: [[8, 68], [30, 90]],
    center: [20, 78],
    sector: 'agri',
    commodities: ['SB', 'ZR'],
    getSignal: (phase) => ({
      'el-nino': { direction: 'bullish',  magnitude: 'strong',   headline: 'Weakened monsoon cuts cane output',   detail: 'El Niño suppresses Indian monsoon Jun–Sep; sugarcane and rice yields historically −8–15%' },
      'la-nina': { direction: 'bearish',  magnitude: 'moderate', headline: 'Enhanced monsoon boosts cane supply', detail: 'La Niña strengthens monsoon; India sugar output elevated, bearish global SB' },
      'neutral':  { direction: 'neutral',  magnitude: 'weak',     headline: 'Normal monsoon variability',          detail: 'IOD and MJO become dominant drivers; watch June onset' },
    }[phase] as any),
  },

  {
    id: 'se-asia',
    name: 'SE Asia (Rice Belt)',
    bounds: [[0, 95], [22, 122]],
    center: [12, 108],
    sector: 'agri',
    commodities: ['ZR', 'KO', 'KC'],
    getSignal: (phase) => ({
      'el-nino': { direction: 'bullish',  magnitude: 'strong',   headline: 'Drought cuts paddy yields',           detail: 'El Niño dries Thailand, Vietnam, Philippines; rice production historically −5–12%; palm oil also impacted' },
      'la-nina': { direction: 'bearish',  magnitude: 'strong',   headline: 'Enhanced monsoon boosts rice yields', detail: 'La Niña enhances SE Asia rainfall; paddy yields elevated in Thailand and Vietnam' },
      'neutral':  { direction: 'neutral',  magnitude: 'weak',     headline: 'Normal monsoon',                      detail: 'Watch Philippine typhoon season and Vietnam Mekong levels' },
    }[phase] as any),
  },

  {
    id: 'west-australia',
    name: 'W. Australia (Wheat)',
    bounds: [[-36, 114], [-22, 126]],
    center: [-30, 120],
    sector: 'agri',
    commodities: ['ZW', 'CT'],
    getSignal: (phase) => ({
      'el-nino': { direction: 'bullish',  magnitude: 'moderate', headline: 'Dryness reduces wheat export supply',  detail: 'El Niño brings drought to WA wheat belt; export volumes cut historically 10–20%' },
      'la-nina': { direction: 'bearish',  magnitude: 'moderate', headline: 'Good rains; WA yield elevated',        detail: 'La Niña delivers above-normal winter rains; WA wheat yields historically strong' },
      'neutral':  { direction: 'neutral',  magnitude: 'weak',     headline: 'Normal growing conditions',           detail: 'IOD influence significant in WA — watch Indian Ocean dipole' },
    }[phase] as any),
  },

  {
    id: 'us-cotton-belt',
    name: 'US Cotton Belt (TX)',
    bounds: [[25, -106], [37, -93]],
    center: [31, -100],
    sector: 'agri',
    commodities: ['CT'],
    getSignal: (phase) => ({
      'el-nino': { direction: 'bearish',  magnitude: 'moderate', headline: 'TX gets more moisture',               detail: 'El Niño improves West Texas dryland cotton conditions; higher abandonment risk reduced' },
      'la-nina': { direction: 'bullish',  magnitude: 'strong',   headline: 'TX dryland cotton at severe risk',    detail: 'La Niña brings exceptional drought to TX; cotton abandonment historically 30–50% in dry years' },
      'neutral':  { direction: 'neutral',  magnitude: 'weak',     headline: 'Watch Lubbock precip forecasts',      detail: 'ENSO-neutral means local weather noise; planting intentions and soil moisture key' },
    }[phase] as any),
  },

  // ── ENERGY REGIONS ────────────────────────────────────────────────────────

  {
    id: 'us-south-central',
    name: 'US South Central (NG)',
    bounds: [[26, -106], [38, -88]],
    center: [32, -97],
    sector: 'energy',
    commodities: ['NG', 'HO'],
    getSignal: (phase) => ({
      'el-nino': { direction: 'bearish',  magnitude: 'strong',   headline: 'Warm winter cuts HDD demand',         detail: 'El Niño warms US South Central Dec–Feb; HDD deficit typically 8–15%; bearish NG winter strip' },
      'la-nina': { direction: 'bullish',  magnitude: 'strong',   headline: 'Cold air outbreaks elevate HDD',      detail: 'La Niña drives cold snaps into TX/OK/LA; HDD surplus 8–12%; bullish Henry Hub winter' },
      'neutral':  { direction: 'neutral',  magnitude: 'weak',     headline: 'Weather-neutral; fundamentals drive', detail: 'Watch storage vs 5yr avg and production growth as primary NG catalysts' },
    }[phase] as any),
  },

  {
    id: 'us-pnw',
    name: 'Pacific Northwest (Hydro)',
    bounds: [[42, -125], [49, -110]],
    center: [46, -120],
    sector: 'energy',
    commodities: ['Power'],
    getSignal: (phase) => ({
      'el-nino': { direction: 'bullish',  magnitude: 'strong',   headline: 'Above-normal snowpack → surplus hydro', detail: 'El Niño increases PNW snowpack; spring runoff depresses spot power; Mid-C prices historically −15–25%' },
      'la-nina': { direction: 'bearish',  magnitude: 'strong',   headline: 'Low SWE → thermal generation fill-in', detail: 'La Niña cuts PNW snowpack 20–35%; hydro deficit requires thermal backup; uplift to regional power prices' },
      'neutral':  { direction: 'neutral',  magnitude: 'weak',     headline: 'Watch Jan–Mar snowpack reports',      detail: 'NRCS snowpack bulletins are the leading signal; watch Feb 1 and Apr 1 SWE reports' },
    }[phase] as any),
  },

  {
    id: 'brazil-hydro',
    name: 'Brazil SE (Hydro)',
    bounds: [[-24, -54], [-14, -40]],
    center: [-20, -47],
    sector: 'energy',
    commodities: ['Power'],
    getSignal: (phase) => ({
      'el-nino': { direction: 'bullish',  magnitude: 'strong',   headline: 'Paraná reservoirs replenished',       detail: 'El Niño increases SE Brazil rainfall Dec–Mar; ONS reservoir levels rise; thermal dispatch reduced' },
      'la-nina': { direction: 'bearish',  magnitude: 'strong',   headline: 'Reservoir stress; rationing risk',    detail: 'La Niña dries SE Brazil; Paraná basin reservoirs can fall below 30% — thermal and rationing risk high' },
      'neutral':  { direction: 'neutral',  magnitude: 'weak',     headline: 'Watch ONS reservoir weekly data',    detail: 'ONS publishes weekly reservoir levels; key threshold is 40% capacity for thermal dispatch trigger' },
    }[phase] as any),
  },

  {
    id: 'ne-asia-lng',
    name: 'NE Asia (LNG)',
    bounds: [[30, 118], [46, 142]],
    center: [37, 130],
    sector: 'energy',
    commodities: ['LNG'],
    getSignal: (phase) => ({
      'el-nino': { direction: 'bearish',  magnitude: 'moderate', headline: 'Warmer winters; JKM demand lower',    detail: 'El Niño warms NE Asia winter; Japan/Korea LNG demand historically −5–8%; JKM spot softens' },
      'la-nina': { direction: 'bullish',  magnitude: 'strong',   headline: 'Siberian cold drives LNG demand',    detail: 'La Niña amplifies Siberian air mass influence; Japan/Korea winter demand elevated; JKM premium widens' },
      'neutral':  { direction: 'neutral',  magnitude: 'weak',     headline: 'Seasonal demand tracks normal',      detail: 'Watch China restocking cycles and Korean nuclear availability as swing factors' },
    }[phase] as any),
  },

  {
    id: 'nino34',
    name: 'Niño 3.4 Region',
    bounds: [[-5, -170], [5, -120]],
    center: [0, -145],
    sector: 'both',
    commodities: [],
    getSignal: (phase) => ({
      'el-nino': { direction: 'bullish',  magnitude: 'strong',   headline: 'Warm SST anomaly — El Niño active',   detail: 'SST anomaly ≥+0.5°C in Niño 3.4 box; teleconnections driving global weather pattern shifts' },
      'la-nina': { direction: 'bearish',  magnitude: 'strong',   headline: 'Cool SST anomaly — La Niña active',  detail: 'SST anomaly ≤−0.5°C in Niño 3.4 box; cold tongue suppresses Walker Circulation' },
      'neutral':  { direction: 'neutral',  magnitude: 'weak',     headline: 'SST anomaly near zero — neutral',    detail: 'ONI within ±0.5°C; no sustained ENSO phase; other climate modes dominant' },
    }[phase] as any),
  },
];

export const SIGNAL_FILL = {
  bullish: { strong: 'rgba(16,185,129,0.35)',  moderate: 'rgba(16,185,129,0.22)',  weak: 'rgba(16,185,129,0.10)' },
  bearish: { strong: 'rgba(239,68,68,0.35)',   moderate: 'rgba(239,68,68,0.22)',   weak: 'rgba(239,68,68,0.10)' },
  neutral: { strong: 'rgba(107,114,128,0.20)', moderate: 'rgba(107,114,128,0.14)', weak: 'rgba(107,114,128,0.08)' },
};

export const SIGNAL_STROKE = {
  bullish: 'rgba(16,185,129,0.7)',
  bearish: 'rgba(239,68,68,0.7)',
  neutral: 'rgba(107,114,128,0.4)',
};
