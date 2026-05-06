import { ENSOPhase } from './enso';

export interface EnergySignal {
  commodity: string;
  ticker: string;
  hub: string;
  signal: 'bullish' | 'bearish' | 'neutral';
  magnitude: 'strong' | 'moderate' | 'weak';
  driver: 'demand' | 'supply' | 'both';
  note: string;
  lag: string; // typical lag from ENSO signal to price impact
}

export interface RegionalDemandImpact {
  region: string;
  fuel: string;
  season: string;
  direction: 'higher' | 'lower' | 'neutral';
  hddCdd: string; // HDD/CDD anomaly typical
  note: string;
}

export interface PowerSystemImpact {
  region: string;
  metric: string;
  direction: 'up' | 'down' | 'neutral';
  magnitude: number; // % typical deviation
  note: string;
}

export function getEnergySignals(phase: ENSOPhase): EnergySignal[] {
  if (phase === 'la-nina') {
    return [
      { commodity:'Natural Gas', ticker:'NG',   hub:'Henry Hub',      signal:'bullish',  magnitude:'strong',   driver:'demand', lag:'1–3 months', note:'Colder-than-normal winters in US South/Central; elevated HDD demand Dec–Feb' },
      { commodity:'Heating Oil', ticker:'HO',   hub:'NY Harbor',      signal:'bullish',  magnitude:'moderate', driver:'demand', lag:'1–2 months', note:'Northeast cold snaps lift distillate demand; watch PADD 1 inventories' },
      { commodity:'Power (PJM)', ticker:'—',    hub:'PJM West Hub',   signal:'bullish',  magnitude:'moderate', driver:'demand', lag:'0–1 months', note:'Higher heating load in Mid-Atlantic/Midwest; gas burn for power elevated' },
      { commodity:'Crude Oil',   ticker:'CL',   hub:'WTI Cushing',    signal:'bullish',  magnitude:'weak',     driver:'demand', lag:'2–4 months', note:'Marginal heating demand uplift; primary driver is US winter severity' },
      { commodity:'LNG',         ticker:'—',    hub:'Asia spot',      signal:'bullish',  magnitude:'strong',   driver:'both',   lag:'1–3 months', note:'La Niña cools Pacific NW Asia; Japan/Korea LNG demand elevated' },
      { commodity:'Coal',        ticker:'MTF',  hub:'API2 Rotterdam', signal:'bullish',  magnitude:'moderate', driver:'demand', lag:'1–2 months', note:'European winter heating; coal-to-gas switching reduced at high gas prices' },
      { commodity:'Hydro Power', ticker:'—',    hub:'PNW / Brazil',   signal:'bearish',  magnitude:'strong',   driver:'supply', lag:'3–6 months', note:'US PNW snowpack deficit; Brazil reservoirs stressed — thermal backup rises' },
      { commodity:'Renewables',  ticker:'—',    hub:'ERCOT / CAISO',  signal:'neutral',  magnitude:'weak',     driver:'supply', lag:'0–2 months', note:'Mixed wind signal; ERCOT wind slightly reduced; solar not materially impacted' },
    ];
  } else if (phase === 'el-nino') {
    return [
      { commodity:'Natural Gas', ticker:'NG',   hub:'Henry Hub',      signal:'bearish',  magnitude:'strong',   driver:'demand', lag:'1–3 months', note:'Warmer US winters compress heating demand; Dec–Feb HDD deficit 5–15%' },
      { commodity:'Heating Oil', ticker:'HO',   hub:'NY Harbor',      signal:'bearish',  magnitude:'moderate', driver:'demand', lag:'1–2 months', note:'Northeast milder winters reduce distillate draw; PADD 1 stocks build' },
      { commodity:'Power (PJM)', ticker:'—',    hub:'PJM West Hub',   signal:'bearish',  magnitude:'moderate', driver:'demand', lag:'0–1 months', note:'Reduced winter heating load; summer cooling demand also elevated in Southwest' },
      { commodity:'Crude Oil',   ticker:'CL',   hub:'WTI Cushing',    signal:'bearish',  magnitude:'weak',     driver:'demand', lag:'2–4 months', note:'Mild winter reduces heating demand; partially offset by stronger summer AC load' },
      { commodity:'LNG',         ticker:'—',    hub:'Asia spot',      signal:'bearish',  magnitude:'moderate', driver:'demand', lag:'1–3 months', note:'Warmer Pacific; Japan/Korea NE Asia heating demand below normal' },
      { commodity:'Coal',        ticker:'MTF',  hub:'API2 Rotterdam', signal:'bearish',  magnitude:'moderate', driver:'demand', lag:'1–2 months', note:'Milder European winter; demand pressure reduced; gas/coal switching eases' },
      { commodity:'Hydro Power', ticker:'—',    hub:'PNW / Brazil',   signal:'bullish',  magnitude:'strong',   driver:'supply', lag:'3–6 months', note:'PNW snowpack above normal; Brazil Paraná basin reservoirs full — displaces thermal' },
      { commodity:'Renewables',  ticker:'—',    hub:'ERCOT / CAISO',  signal:'neutral',  magnitude:'weak',     driver:'supply', lag:'0–2 months', note:'El Niño winter storminess benefits wind in southern US; California solar unchanged' },
    ];
  } else {
    return [
      { commodity:'Natural Gas', ticker:'NG',   hub:'Henry Hub',      signal:'neutral',  magnitude:'weak',     driver:'demand', lag:'—', note:'Weather-neutral; watch storage vs. 5yr avg and production growth trajectory' },
      { commodity:'Heating Oil', ticker:'HO',   hub:'NY Harbor',      signal:'neutral',  magnitude:'weak',     driver:'demand', lag:'—', note:'ENSO signal minimal; track crude spread and PADD 1 refinery runs' },
      { commodity:'Power (PJM)', ticker:'—',    hub:'PJM West Hub',   signal:'neutral',  magnitude:'weak',     driver:'demand', lag:'—', note:'Neutral ENSO = weather-normal load; generation mix and capacity margins drive spreads' },
      { commodity:'Crude Oil',   ticker:'CL',   hub:'WTI Cushing',    signal:'neutral',  magnitude:'weak',     driver:'both',   lag:'—', note:'ENSO effect negligible; macro demand and OPEC+ production policy dominate' },
      { commodity:'LNG',         ticker:'—',    hub:'Asia spot',      signal:'neutral',  magnitude:'weak',     driver:'demand', lag:'—', note:'Seasonal demand follows normal pattern; watch China restocking cycles' },
      { commodity:'Coal',        ticker:'MTF',  hub:'API2 Rotterdam', signal:'neutral',  magnitude:'weak',     driver:'demand', lag:'—', note:'Gas/coal switching driven by TTF-coal spread; ENSO not a factor' },
      { commodity:'Hydro Power', ticker:'—',    hub:'PNW / Brazil',   signal:'neutral',  magnitude:'weak',     driver:'supply', lag:'—', note:'Normal precipitation expected; monitor snowpack in Jan–Mar for leading signal' },
      { commodity:'Renewables',  ticker:'—',    hub:'ERCOT / CAISO',  signal:'neutral',  magnitude:'weak',     driver:'supply', lag:'—', note:'Standard seasonal variability; no ENSO amplifier' },
    ];
  }
}

export function getRegionalDemandImpacts(phase: ENSOPhase): RegionalDemandImpact[] {
  if (phase === 'la-nina') {
    return [
      { region:'US South Central', fuel:'Nat Gas',    season:'Winter', direction:'higher', hddCdd:'+8–12% HDD', note:'Primary La Niña signature — cold air outbreaks into TX/OK/LA' },
      { region:'US Pacific NW',    fuel:'Hydro/Power', season:'Annual', direction:'lower',  hddCdd:'−15–25% SWE', note:'Below-normal snowpack reduces hydro; thermal generation fill-in' },
      { region:'Brazil (SE)',      fuel:'Power',       season:'Dec–Mar', direction:'lower',  hddCdd:'−10–20% res', note:'Paraná basin reservoir deficit; rationing risk in dry years' },
      { region:'NE Asia (JPN/KOR)',fuel:'LNG',         season:'Winter', direction:'higher', hddCdd:'+5–10% HDD', note:'La Niña cools Siberian air masses affecting Japan/Korea demand' },
      { region:'Australia (E)',    fuel:'Coal/Gas',    season:'Summer', direction:'higher', hddCdd:'+5–8% CDD',  note:'East Australian heatwaves more frequent; AC load spikes' },
      { region:'SE Asia',          fuel:'Power',       season:'Wet',    direction:'lower',  hddCdd:'Above avg rain', note:'Enhanced monsoon; hydro benefits, reduced fuel-fired generation' },
    ];
  } else if (phase === 'el-nino') {
    return [
      { region:'US South Central', fuel:'Nat Gas',    season:'Winter', direction:'lower',  hddCdd:'−8–15% HDD', note:'Warmer-than-normal winters reduce gas heating demand materially' },
      { region:'US Pacific NW',    fuel:'Hydro/Power', season:'Annual', direction:'higher', hddCdd:'+15–30% SWE', note:'Above-normal snowpack; surplus hydro depresses spot power prices' },
      { region:'Brazil (SE)',      fuel:'Power',       season:'Dec–Mar', direction:'higher', hddCdd:'+15–25% res', note:'Paraná basin reservoirs replenished; reduced thermal dispatch' },
      { region:'NE Asia (JPN/KOR)',fuel:'LNG',         season:'Winter', direction:'lower',  hddCdd:'−5–8% HDD',  note:'Warmer Pacific SSTs moderate winter LNG demand in Japan/Korea' },
      { region:'Australia (E)',    fuel:'Coal/Gas',    season:'Wet',    direction:'lower',  hddCdd:'Above avg rain', note:'El Niño dryness actually limits Queensland coal export supply' },
      { region:'SE Asia',          fuel:'Power',       season:'Dry',    direction:'higher', hddCdd:'Below avg rain', note:'Drought reduces hydro; diesel/coal/gas backup generation rises' },
    ];
  } else {
    return [
      { region:'US South Central', fuel:'Nat Gas',    season:'Winter', direction:'neutral', hddCdd:'Normal ±3%',  note:'No ENSO amplifier; weather noise dominant' },
      { region:'US Pacific NW',    fuel:'Hydro/Power', season:'Annual', direction:'neutral', hddCdd:'Normal ±5%',  note:'Normal snowpack variability; watch Feb–Mar snowpack reports' },
      { region:'Brazil (SE)',      fuel:'Power',       season:'Dec–Mar', direction:'neutral', hddCdd:'Normal ±5%',  note:'Reservoir levels depend on pre-season rainfall' },
      { region:'NE Asia (JPN/KOR)',fuel:'LNG',         season:'Winter', direction:'neutral', hddCdd:'Normal ±3%',  note:'Temperature-driven demand with no ENSO amplifier' },
      { region:'Australia (E)',    fuel:'Coal/Gas',    season:'Annual', direction:'neutral', hddCdd:'Normal',      note:'Standard variability; no ENSO signal' },
      { region:'SE Asia',          fuel:'Power',       season:'Annual', direction:'neutral', hddCdd:'Normal monsoon', note:'Normal monsoon expected' },
    ];
  }
}

// HDD deviation data for the ONI vs HDD anomaly chart (historical composites)
export const HDD_COMPOSITE = [
  // { oni, hddAnom (% vs normal for US South Central Dec-Feb) }
  { oni: -1.8, hddAnom: 14 },
  { oni: -1.4, hddAnom: 11 },
  { oni: -1.0, hddAnom:  9 },
  { oni: -0.7, hddAnom:  6 },
  { oni: -0.4, hddAnom:  2 },
  { oni:  0.0, hddAnom:  0 },
  { oni:  0.4, hddAnom: -3 },
  { oni:  0.8, hddAnom: -7 },
  { oni:  1.2, hddAnom:-10 },
  { oni:  1.6, hddAnom:-13 },
  { oni:  2.0, hddAnom:-15 },
  { oni:  2.4, hddAnom:-17 },
];

// Gas storage trajectory scenarios
export const STORAGE_SCENARIOS = {
  labels: ['Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar'],
  elNino:  [1850, 2100, 2400, 2700, 2950, 3150, 3500, 3650, 3200, 2600, 2000, 1600],
  neutral: [1800, 2000, 2250, 2550, 2800, 2950, 3300, 3400, 2900, 2200, 1650, 1250],
  laNina:  [1750, 1900, 2100, 2400, 2650, 2800, 3100, 3200, 2600, 1800, 1200, 850],
  fiveYrAvg:[1820, 2020, 2280, 2580, 2840, 2990, 3320, 3420, 2930, 2270, 1710, 1340],
};
