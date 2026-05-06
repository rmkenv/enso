export type ENSOPhase = 'el-nino' | 'la-nina' | 'neutral';

export interface ONIRecord {
  year: number;
  month: number;
  value: number;
  phase: ENSOPhase;
  label: string; // "Jan 2024"
}

export interface CropImpact {
  crop: string;
  ticker: string;
  region: string;
  signal: 'bullish' | 'bearish' | 'neutral';
  magnitude: 'strong' | 'moderate' | 'weak';
  note: string;
}

export interface ENSOSummary {
  currentONI: number;
  currentPhase: ENSOPhase;
  consecutiveMonths: number;
  trend: 'strengthening' | 'weakening' | 'stable';
  phaseProbabilities: { elNino: number; neutral: number; laNina: number };
}

// Historical ONI data 2020–2025 (representative, from NOAA CPC)
export const HISTORICAL_ONI: ONIRecord[] = [
  // 2020
  { year:2020, month:1,  value: 0.5,  phase:'el-nino',  label:'Jan 2020' },
  { year:2020, month:2,  value: 0.5,  phase:'el-nino',  label:'Feb 2020' },
  { year:2020, month:3,  value: 0.4,  phase:'neutral',  label:'Mar 2020' },
  { year:2020, month:4,  value: 0.3,  phase:'neutral',  label:'Apr 2020' },
  { year:2020, month:5,  value: 0.1,  phase:'neutral',  label:'May 2020' },
  { year:2020, month:6,  value:-0.2,  phase:'neutral',  label:'Jun 2020' },
  { year:2020, month:7,  value:-0.5,  phase:'la-nina',  label:'Jul 2020' },
  { year:2020, month:8,  value:-0.8,  phase:'la-nina',  label:'Aug 2020' },
  { year:2020, month:9,  value:-1.0,  phase:'la-nina',  label:'Sep 2020' },
  { year:2020, month:10, value:-1.2,  phase:'la-nina',  label:'Oct 2020' },
  { year:2020, month:11, value:-1.3,  phase:'la-nina',  label:'Nov 2020' },
  { year:2020, month:12, value:-1.3,  phase:'la-nina',  label:'Dec 2020' },
  // 2021
  { year:2021, month:1,  value:-1.1,  phase:'la-nina',  label:'Jan 2021' },
  { year:2021, month:2,  value:-0.9,  phase:'la-nina',  label:'Feb 2021' },
  { year:2021, month:3,  value:-0.7,  phase:'la-nina',  label:'Mar 2021' },
  { year:2021, month:4,  value:-0.4,  phase:'neutral',  label:'Apr 2021' },
  { year:2021, month:5,  value:-0.2,  phase:'neutral',  label:'May 2021' },
  { year:2021, month:6,  value:-0.1,  phase:'neutral',  label:'Jun 2021' },
  { year:2021, month:7,  value:-0.3,  phase:'neutral',  label:'Jul 2021' },
  { year:2021, month:8,  value:-0.6,  phase:'la-nina',  label:'Aug 2021' },
  { year:2021, month:9,  value:-0.9,  phase:'la-nina',  label:'Sep 2021' },
  { year:2021, month:10, value:-1.0,  phase:'la-nina',  label:'Oct 2021' },
  { year:2021, month:11, value:-1.0,  phase:'la-nina',  label:'Nov 2021' },
  { year:2021, month:12, value:-1.0,  phase:'la-nina',  label:'Dec 2021' },
  // 2022
  { year:2022, month:1,  value:-1.0,  phase:'la-nina',  label:'Jan 2022' },
  { year:2022, month:2,  value:-1.0,  phase:'la-nina',  label:'Feb 2022' },
  { year:2022, month:3,  value:-1.0,  phase:'la-nina',  label:'Mar 2022' },
  { year:2022, month:4,  value:-0.9,  phase:'la-nina',  label:'Apr 2022' },
  { year:2022, month:5,  value:-0.8,  phase:'la-nina',  label:'May 2022' },
  { year:2022, month:6,  value:-0.9,  phase:'la-nina',  label:'Jun 2022' },
  { year:2022, month:7,  value:-1.0,  phase:'la-nina',  label:'Jul 2022' },
  { year:2022, month:8,  value:-1.1,  phase:'la-nina',  label:'Aug 2022' },
  { year:2022, month:9,  value:-1.0,  phase:'la-nina',  label:'Sep 2022' },
  { year:2022, month:10, value:-0.9,  phase:'la-nina',  label:'Oct 2022' },
  { year:2022, month:11, value:-0.7,  phase:'la-nina',  label:'Nov 2022' },
  { year:2022, month:12, value:-0.6,  phase:'la-nina',  label:'Dec 2022' },
  // 2023 — strong El Niño onset
  { year:2023, month:1,  value:-0.3,  phase:'neutral',  label:'Jan 2023' },
  { year:2023, month:2,  value:-0.2,  phase:'neutral',  label:'Feb 2023' },
  { year:2023, month:3,  value: 0.1,  phase:'neutral',  label:'Mar 2023' },
  { year:2023, month:4,  value: 0.4,  phase:'neutral',  label:'Apr 2023' },
  { year:2023, month:5,  value: 0.8,  phase:'el-nino',  label:'May 2023' },
  { year:2023, month:6,  value: 1.1,  phase:'el-nino',  label:'Jun 2023' },
  { year:2023, month:7,  value: 1.5,  phase:'el-nino',  label:'Jul 2023' },
  { year:2023, month:8,  value: 1.8,  phase:'el-nino',  label:'Aug 2023' },
  { year:2023, month:9,  value: 2.0,  phase:'el-nino',  label:'Sep 2023' },
  { year:2023, month:10, value: 2.0,  phase:'el-nino',  label:'Oct 2023' },
  { year:2023, month:11, value: 2.0,  phase:'el-nino',  label:'Nov 2023' },
  { year:2023, month:12, value: 2.0,  phase:'el-nino',  label:'Dec 2023' },
  // 2024 — El Niño decay, La Niña onset
  { year:2024, month:1,  value: 1.9,  phase:'el-nino',  label:'Jan 2024' },
  { year:2024, month:2,  value: 1.5,  phase:'el-nino',  label:'Feb 2024' },
  { year:2024, month:3,  value: 1.0,  phase:'el-nino',  label:'Mar 2024' },
  { year:2024, month:4,  value: 0.5,  phase:'el-nino',  label:'Apr 2024' },
  { year:2024, month:5,  value: 0.2,  phase:'neutral',  label:'May 2024' },
  { year:2024, month:6,  value:-0.1,  phase:'neutral',  label:'Jun 2024' },
  { year:2024, month:7,  value:-0.3,  phase:'neutral',  label:'Jul 2024' },
  { year:2024, month:8,  value:-0.5,  phase:'la-nina',  label:'Aug 2024' },
  { year:2024, month:9,  value:-0.7,  phase:'la-nina',  label:'Sep 2024' },
  { year:2024, month:10, value:-0.9,  phase:'la-nina',  label:'Oct 2024' },
  { year:2024, month:11, value:-1.0,  phase:'la-nina',  label:'Nov 2024' },
  { year:2024, month:12, value:-1.1,  phase:'la-nina',  label:'Dec 2024' },
  // 2025 YTD
  { year:2025, month:1,  value:-1.2,  phase:'la-nina',  label:'Jan 2025' },
  { year:2025, month:2,  value:-1.1,  phase:'la-nina',  label:'Feb 2025' },
  { year:2025, month:3,  value:-0.9,  phase:'la-nina',  label:'Mar 2025' },
  { year:2025, month:4,  value:-0.7,  phase:'la-nina',  label:'Apr 2025' },
];

export function getLatestONI(): ONIRecord {
  return HISTORICAL_ONI[HISTORICAL_ONI.length - 1];
}

export function getENSOSummary(): ENSOSummary {
  const latest = getLatestONI();
  const prev = HISTORICAL_ONI[HISTORICAL_ONI.length - 2];
  const trend: ENSOSummary['trend'] =
    Math.abs(latest.value) > Math.abs(prev.value) + 0.05 ? 'strengthening' :
    Math.abs(latest.value) < Math.abs(prev.value) - 0.05 ? 'weakening' : 'stable';

  // Count consecutive months in same phase
  let count = 0;
  for (let i = HISTORICAL_ONI.length - 1; i >= 0; i--) {
    if (HISTORICAL_ONI[i].phase === latest.phase) count++;
    else break;
  }

  return {
    currentONI: latest.value,
    currentPhase: latest.phase,
    consecutiveMonths: count,
    trend,
    phaseProbabilities: { elNino: 8, neutral: 52, laNina: 40 },
  };
}

// Crop impact matrix based on ENSO phase
export function getCropImpacts(phase: ENSOPhase): CropImpact[] {
  if (phase === 'la-nina') {
    return [
      { crop:'Corn',     ticker:'ZC', region:'US Corn Belt',      signal:'bullish',  magnitude:'moderate', note:'Dryness risk Aug–Sep in IA/IL; reduced yield potential' },
      { crop:'Soybeans', ticker:'ZS', region:'US/Brazil',         signal:'bullish',  magnitude:'moderate', note:'US crop stress; Brazil Cerrado also vulnerable to dryness' },
      { crop:'Wheat',    ticker:'ZW', region:'Argentina',         signal:'bullish',  magnitude:'strong',   note:'Pampas drought raises export supply risk; watch Buenos Aires SMA' },
      { crop:'Cotton',   ticker:'CT', region:'TX / W. Australia', signal:'bullish',  magnitude:'strong',   note:'TX dryland cotton at risk; W. Australia yield historically elevated' },
      { crop:'Sugar',    ticker:'SB', region:'India / SE Asia',   signal:'bearish',  magnitude:'moderate', note:'La Niña typically increases Indian monsoon; bearish cane supply' },
      { crop:'Coffee',   ticker:'KC', region:'Vietnam',           signal:'bearish',  magnitude:'weak',     note:'Robusta-growing regions see excess rainfall; quality risk minor' },
      { crop:'Rice',     ticker:'ZR', region:'SE Asia',           signal:'bearish',  magnitude:'strong',   note:'Enhanced monsoon boosts paddy yields in Thailand, Vietnam, India' },
      { crop:'Palm Oil', ticker:'KO', region:'Malaysia/Indonesia', signal:'neutral',  magnitude:'weak',     note:'Mixed signal; early dryness offset by strong June–Aug rains' },
    ];
  } else if (phase === 'el-nino') {
    return [
      { crop:'Corn',     ticker:'ZC', region:'US Corn Belt',      signal:'bearish',  magnitude:'moderate', note:'Wetter spring improves planting conditions in IA/IL' },
      { crop:'Soybeans', ticker:'ZS', region:'US/Brazil',         signal:'bearish',  magnitude:'weak',     note:'US benign; Brazil excess rain can delay Mato Grosso harvest' },
      { crop:'Wheat',    ticker:'ZW', region:'Argentina',         signal:'bearish',  magnitude:'moderate', note:'Pampas excessive rain; Argentina wheat historically improves' },
      { crop:'Cotton',   ticker:'CT', region:'TX / W. Australia', signal:'bearish',  magnitude:'moderate', note:'TX gets more moisture; W. Australia yields typically lower' },
      { crop:'Sugar',    ticker:'SB', region:'India / SE Asia',   signal:'bullish',  magnitude:'strong',   note:'Weakened monsoon dents Indian cane output; ISO deficit likely' },
      { crop:'Coffee',   ticker:'KC', region:'Vietnam/Brazil',    signal:'bullish',  magnitude:'moderate', note:'Vietnamese Robusta dryness; Arabica regions also stressed' },
      { crop:'Rice',     ticker:'ZR', region:'SE Asia',           signal:'bullish',  magnitude:'strong',   note:'Monsoon disruption reduces paddy yields; Philippine imports rise' },
      { crop:'Palm Oil', ticker:'KO', region:'Malaysia/Indonesia', signal:'bullish',  magnitude:'strong',   note:'El Niño dryness reduces FFB yield; 6–9 month lag to market impact' },
    ];
  } else {
    return [
      { crop:'Corn',     ticker:'ZC', region:'US Corn Belt',      signal:'neutral', magnitude:'weak', note:'Normal weather; fundamental drivers dominate' },
      { crop:'Soybeans', ticker:'ZS', region:'US/Brazil',         signal:'neutral', magnitude:'weak', note:'Watch Brazilian Real and US ending stocks' },
      { crop:'Wheat',    ticker:'ZW', region:'Global',            signal:'neutral', magnitude:'weak', note:'Black Sea supply and EU weather key near-term catalysts' },
      { crop:'Cotton',   ticker:'CT', region:'Global',            signal:'neutral', magnitude:'weak', note:'ENSO signal minimal; watch USDA S&D and mill demand' },
      { crop:'Sugar',    ticker:'SB', region:'Brazil',            signal:'neutral', magnitude:'weak', note:'CS Brazil harvest pace and ethanol parity dominant' },
      { crop:'Coffee',   ticker:'KC', region:'Brazil',            signal:'neutral', magnitude:'weak', note:'Off-year biennial cycle for Arabica; watch July/August frosts' },
      { crop:'Rice',     ticker:'ZR', region:'SE Asia',           signal:'neutral', magnitude:'weak', note:'Normal monsoon expected; watch India export policy' },
      { crop:'Palm Oil', ticker:'KO', region:'Malaysia',          signal:'neutral', magnitude:'weak', note:'Watch India import duty changes and soy oil spread' },
    ];
  }
}

export const PHASE_COLORS = {
  'el-nino': '#f59e0b',
  'la-nina': '#3b82f6',
  'neutral':  '#6b7280',
};

export const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
