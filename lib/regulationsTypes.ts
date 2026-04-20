// Schema for /data/regulations/*.json — the source of truth that drives
// the /regulations page. The UI renders these structures verbatim, so the
// annual update is a JSON edit, not a code change.
//
// Conventions:
// - All dates are ISO 'YYYY-MM-DD' strings (no times). The application
//   window may include a 'notes' field for cutoff times.
// - Any field whose value is unknown for a state/species ships as null
//   (or omitted). The renderer must treat null gracefully (— instead of
//   fabricating a date or fee).
// - Money is in USD numbers (decimals OK). The renderer formats.
// - Species 'name' uses display casing ("Elk", "Mule Deer").

export type DrawSystem =
  | 'preference'
  | 'bonus'
  | 'weighted'
  | 'random'
  | 'hybrid'
  | 'none';

export interface DateRange {
  start: string | null;
  end: string | null;
  notes?: string;
}

export interface ApplicationWindow {
  opens: string | null;
  closes: string | null;
  timezone?: string;
  notes?: string;
}

export interface SecondaryDraw {
  closes: string | null;
  notes?: string;
}

export interface FeeSide {
  qualifyingLicense?: number | null;
  habitatStamp?: number | null;
  applicationFee?: number | null;
  preferencePointOnly?: number | null;
  tagIfDrawn?: number | null;
  totalEstimate?: number | null;
  notes?: string;
}

export interface Fees {
  nr: FeeSide;
  resident: FeeSide;
}

export interface PointSystem {
  type: DrawSystem;
  costPerPoint?: { nr: number | null; resident: number | null };
  maxPoints?: number | null;
  expirationYears?: number | null;
  notes?: string;
}

export interface OTC {
  available: boolean;
  seasons?: string[];
  seasonDates?: Record<string, DateRange>;
  validGMUs?: number[];
  excludedGMUs?: number[];
  restrictions?: string;
  onSaleDate?: string | null;
  nrFee?: number | null;
  notes?: string;
}

export type SeasonName =
  | 'archery'
  | 'muzzleloader'
  | 'general'
  | '1stRifle'
  | '2ndRifle'
  | '3rdRifle'
  | '4thRifle'
  | 'lateRifle'
  | 'youth';

export type Seasons = Partial<Record<SeasonName, DateRange>>;

export interface SpeciesRegulations {
  name: string;
  drawSystem: DrawSystem;
  applicationWindow: ApplicationWindow;
  secondaryDraw?: SecondaryDraw;
  resultsDate?: string | null;
  paymentDeadline?: string | null;
  fees: Fees;
  pointSystem: PointSystem;
  otc?: OTC;
  seasons?: Seasons;
}

export interface StateRegulations {
  state: string;
  abbreviation: string;
  officialUrl: string;
  applicationPortal?: string;
  lastUpdated?: string;
  species: SpeciesRegulations[];
}

export const SEASON_LABELS: Record<string, string> = {
  archery: 'Archery',
  muzzleloader: 'Muzzleloader',
  general: 'General',
  '1stRifle': '1st Rifle',
  '2ndRifle': '2nd Rifle',
  '3rdRifle': '3rd Rifle',
  '4thRifle': '4th Rifle',
  lateRifle: 'Late Rifle',
  youth: 'Youth',
};

export const DRAW_SYSTEM_LABELS: Record<DrawSystem, string> = {
  preference: 'Preference Points',
  bonus: 'Bonus Points',
  weighted: 'Weighted Points',
  random: 'Random Lottery',
  hybrid: 'Hybrid (50/50)',
  none: 'No Draw / NR Ineligible',
};
