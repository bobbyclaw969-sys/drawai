// Per-tag detail overlay for OTC entries — keyed by `${stateId}-${species}`.
// Mirrors the dedup key used by /otc and the species grouping on /states/[stateId].
// Only populate when there's tag-specific structure worth surfacing beyond the
// generic huntingData row.

export interface OTCFeePart {
  label: string;
  amount: number;
}

export interface OTCFeeBreakdown {
  total: number;
  parts: OTCFeePart[];
}

export interface OTCSeasonDate {
  name: string;
  dates: string;
}

export interface OTCOfficialLink {
  href: string;
  label: string;
}

export interface OTCDetails {
  validGmus?: number[];
  validGmusNote?: string;
  seasonDates?: OTCSeasonDate[];
  feeBreakdown?: OTCFeeBreakdown;
  buyInfo?: string;
  officialUrl?: OTCOfficialLink;
}

const CO_ELK_OTC_GMUS = [
  3, 4, 5, 11, 12, 13, 14,
  21, 22, 23, 24, 25, 26, 27, 28,
  30, 31, 32, 33, 34, 35, 36, 37,
  41, 42, 43, 44, 45, 47,
  52, 53,
  62, 63, 64, 65,
  70, 71, 72, 73,
  77, 78, 79, 80, 81, 82,
  131, 211, 231, 301, 441, 471, 511, 521, 581, 591, 711,
];

export const otcDetails: Record<string, OTCDetails> = {
  'co-elk': {
    validGmus: CO_ELK_OTC_GMUS,
    validGmusNote:
      'GMUs 54, 55, 551 are no longer OTC (moved to draw for 2026). GMUs 11, 12, 13, 23, 24, 131, 211, 231 returned to OTC for 2026. Always confirm against the 2026 CPW Big Game Brochure (page ~40) before buying.',
    seasonDates: [
      { name: '2nd Rifle', dates: 'Oct 17–25, 2026' },
      { name: '3rd Rifle', dates: 'Oct 31–Nov 8, 2026' },
    ],
    feeBreakdown: {
      total: 963,
      parts: [
        { label: 'Elk license', amount: 845 },
        { label: 'Qualifying license', amount: 105 },
        { label: 'Habitat stamp', amount: 13 },
      ],
    },
    buyInfo:
      'OTC tags go on sale early August 2026. Bull only — antler point restriction applies in most units.',
    officialUrl: {
      href: 'https://cpw.state.co.us/hunting/big-game/over-counter-license',
      label: 'CPW Over-the-Counter Licenses ↗',
    },
  },
};

export function getOTCDetails(stateId: string, species: string): OTCDetails | undefined {
  return otcDetails[`${stateId}-${species}`];
}
