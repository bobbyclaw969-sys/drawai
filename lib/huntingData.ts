import { StateSeasonData, SpeciesKey } from './types';

/**
 * FEE CONVENTION:
 * `feeNonresident` represents the TOTAL cost a non-resident pays to hunt
 * — application fee + tag fee + license fee + stamps combined.
 * For draw-only species, this is the cost-when-drawn (so hunters can budget
 * for the actual hunt, not just the entry ticket).
 *
 * Exception: Nevada records show the $15 application fee only — Nevada tag
 * costs vary significantly by unit and are listed in each record's notes.
 *
 * All western (non-eastern-whitetail) fees were audited 2026-04-10. Records
 * marked "// VERIFY:" in their notes need manual confirmation against the
 * official state agency before publishing as fully verified.
 */

/** Year this data was last verified against state agency sources. */
export const DATA_YEAR = 2026;

/** Returns true if the data may be stale (current year > DATA_YEAR). */
export function isDataStale(): boolean {
  return new Date().getFullYear() > DATA_YEAR;
}

export const SPECIES_LABELS: Record<SpeciesKey, string> = {
  elk: 'Elk',
  mule_deer: 'Mule Deer',
  whitetail: 'Whitetail Deer',
  pronghorn: 'Pronghorn',
  bighorn_sheep: 'Bighorn Sheep',
  mountain_goat: 'Mountain Goat',
  moose: 'Moose',
  black_bear: 'Black Bear',
  mountain_lion: 'Mountain Lion',
  bison: 'Bison',
};

export const SPECIES_EMOJI: Record<SpeciesKey, string> = {
  elk: '🦌',
  mule_deer: '🦌',
  whitetail: '🦌',
  pronghorn: '🐐',
  bighorn_sheep: '🐏',
  mountain_goat: '🐐',
  moose: '🫎',
  black_bear: '🐻',
  mountain_lion: '🦁',
  bison: '🦬',
};

export const ALL_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
];

export const STATE_NAMES: Record<string, string> = {
  AL:'Alabama', AK:'Alaska', AZ:'Arizona', AR:'Arkansas', CA:'California',
  CO:'Colorado', CT:'Connecticut', DE:'Delaware', FL:'Florida', GA:'Georgia',
  HI:'Hawaii', ID:'Idaho', IL:'Illinois', IN:'Indiana', IA:'Iowa',
  KS:'Kansas', KY:'Kentucky', LA:'Louisiana', ME:'Maine', MD:'Maryland',
  MA:'Massachusetts', MI:'Michigan', MN:'Minnesota', MS:'Mississippi', MO:'Missouri',
  MT:'Montana', NE:'Nebraska', NV:'Nevada', NH:'New Hampshire', NJ:'New Jersey',
  NM:'New Mexico', NY:'New York', NC:'North Carolina', ND:'North Dakota', OH:'Ohio',
  OK:'Oklahoma', OR:'Oregon', PA:'Pennsylvania', RI:'Rhode Island', SC:'South Carolina',
  SD:'South Dakota', TN:'Tennessee', TX:'Texas', UT:'Utah', VT:'Vermont',
  VA:'Virginia', WA:'Washington', WV:'West Virginia', WI:'Wisconsin', WY:'Wyoming',
};

export const huntingData: StateSeasonData[] = [
  // ─── ELK ───────────────────────────────────────────────────────────────────
  {
    stateId: 'co', stateName: 'Colorado', species: 'elk', seasonType: 'archery',
    appOpenMonth: 3, appCloseMonth: 4, appCloseDay: 7,
    feeNonresident: 929, feeResident: 8,
    pointSystem: 'preference', maxPointsEst: 20, nrQuotaPct: 20,
    hasOTC: false, oddsAtZeroPts: 0.50, oddsAt5Pts: 0.80, oddsAt10Pts: 0.99,
    oddsAt15Pts: 0.99, oddsAt20Pts: 0.99,
    notes: '2026 archery application deadline: April 7. NR archery OTC eliminated west of I-25 as of 2025 — now draw-only for most of Colorado. Very limited OTC archery remains in a few eastern GMUs (east of I-25). Total NR cost ~$929 (NR archery elk tag ~$832 + $86 NR small game license + $11 habitat stamp). Verify current unit status at cpw.state.co.us.',
    difficulty: 'moderate',
  },
  {
    stateId: 'co', stateName: 'Colorado', species: 'elk', seasonType: 'rifle',
    appOpenMonth: 4, appCloseMonth: 4, appCloseDay: 1,
    feeNonresident: 845, feeResident: 61,
    pointSystem: 'preference', maxPointsEst: 15, nrQuotaPct: 20,
    hasOTC: true, oddsAtZeroPts: 0.99, oddsAt5Pts: 0.99, oddsAt10Pts: 0.99,
    oddsAt15Pts: 0.99, oddsAt20Pts: 0.99,
    notes: 'OTC RIFLE still available for NR in most general units (2nd and 3rd rifle seasons) — one of the best NR OTC rifle elk deals in the West. Total NR cost ~$935–$977 (tag + license + habitat stamp). Gunnison Basin GMUs 54/55/551 moved to draw-only for 2026. OTC license sold at cpw.state.co.us — buy early, popular units see pressure. Verify unit status at cpw.state.co.us.',
    difficulty: 'easy',
  },
  {
    stateId: 'wy', stateName: 'Wyoming', species: 'elk', seasonType: 'any',
    appOpenMonth: 1, appCloseMonth: 2, appCloseDay: 2,
    feeNonresident: 692, feeResident: 63,
    pointSystem: 'preference', maxPointsEst: 25, nrQuotaPct: 16,
    hasOTC: false, oddsAtZeroPts: 0.15, oddsAt5Pts: 0.45, oddsAt10Pts: 0.75,
    oddsAt15Pts: 0.90, oddsAt20Pts: 0.98,
    notes: 'NR application deadline is February 2 (Jan 31 fell on a Saturday for 2026, rolled to Monday). May 31 is the resident general season deadline — do not confuse. NR elk tag ~$692 (Type 1 general). 75% of tags go to highest-point applicants, 25% random — so even new applicants have a small chance. Complex Type 1/2/9 license structure. Preference points build annually. Some general areas have decent odds at 5-8 pts. Apply via wgfd.wyo.gov.',
    difficulty: 'moderate',
  },
  {
    stateId: 'mt', stateName: 'Montana', species: 'elk', seasonType: 'any',
    appOpenMonth: 3, appCloseMonth: 4, appCloseDay: 1,
    feeNonresident: 1112, feeResident: 10,
    pointSystem: 'none', maxPointsEst: 0, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.45, oddsAt5Pts: 0.45, oddsAt10Pts: 0.45,
    oddsAt15Pts: 0.45, oddsAt20Pts: 0.45,
    notes: 'Total NR cost: ~$1,112 (combo license $1,059 + $53 conservation license). The $20 was the application fee only. NO OTC for non-residents. NR must apply for Big Game Combo or Elk Combo License via lottery draw (apply March 1 – April 1). Alternates list available May 1 – June 1. No preference points — pure lottery. Verify at fwp.mt.gov.',
    difficulty: 'moderate',
  },
  {
    stateId: 'id', stateName: 'Idaho', species: 'elk', seasonType: 'any',
    appOpenMonth: 12, appCloseMonth: 1, appCloseDay: 15,
    feeNonresident: 756, feeResident: 13,
    pointSystem: 'none', maxPointsEst: 0, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.35, oddsAt5Pts: 0.35, oddsAt10Pts: 0.35,
    oddsAt15Pts: 0.35, oddsAt20Pts: 0.35,
    notes: 'Total NR cost: ~$756 (tag $541 + NR hunting license $185 + $30 conservation license). Two application rounds: Dec/Jan for first round, June for leftover tags. OTC ELIMINATED FOR NR IN 2026. Pure random lottery — Idaho does NOT use preference points. No points carry over. Verify at idfg.idaho.gov.',
    difficulty: 'moderate',
  },
  {
    stateId: 'ut', stateName: 'Utah', species: 'elk', seasonType: 'any',
    appOpenMonth: 3, appCloseMonth: 4, appCloseDay: 23,
    feeNonresident: 849, feeResident: 52,
    pointSystem: 'weighted', maxPointsEst: 25, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.05, oddsAt5Pts: 0.18, oddsAt10Pts: 0.40,
    oddsAt15Pts: 0.70, oddsAt20Pts: 0.95,
    notes: 'Limited-entry draw only for non-residents. General season (OTC) is restricted to Utah residents under current SB8 rules. NR quota is ~10% of limited-entry pool via weighted points draw. Apply Mar 19–Apr 23 at wildlife.utah.gov.',
    difficulty: 'hard',
  },
  {
    stateId: 'nv', stateName: 'Nevada', species: 'elk', seasonType: 'any',
    appOpenMonth: 12, appCloseMonth: 2, appCloseDay: 15,
    feeNonresident: 15, feeResident: 10,
    pointSystem: 'bonus', maxPointsEst: 20, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.02, oddsAt5Pts: 0.08, oddsAt10Pts: 0.20,
    oddsAt15Pts: 0.40, oddsAt20Pts: 0.70,
    notes: 'Application fee $15. Tag cost if drawn varies significantly by unit — verify at ndow.org. Bonus points accumulate slowly. Very few NR tags issued. Worth applying for points annually.',
    difficulty: 'very_hard',
  },
  {
    stateId: 'az', stateName: 'Arizona', species: 'elk', seasonType: 'any',
    appOpenMonth: 1, appCloseMonth: 2, appCloseDay: 12,
    feeNonresident: 175, feeResident: 15,
    pointSystem: 'bonus', maxPointsEst: 25, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.01, oddsAt5Pts: 0.05, oddsAt10Pts: 0.15,
    oddsAt15Pts: 0.35, oddsAt20Pts: 0.65,
    notes: 'World-class elk. 10–20 year wait for premium units via draw. EXCEPTION: Arizona does sell non-permit OTC elk tags for specific management/conflict units — available to NR at ~$650, no draw required, but unit-specific and limited. For the standard draw, NR fee ~$175 ($160 hunting license + $15 app fee). Apply for bonus points every year. Apply Jan–Feb at azgfd.com. Verify non-permit tag availability at azgfd.com.',
    difficulty: 'very_hard',
  },
  {
    stateId: 'nm', stateName: 'New Mexico', species: 'elk', seasonType: 'any',
    appOpenMonth: 1, appCloseMonth: 3, appCloseDay: 20,
    feeNonresident: 155, feeResident: 20,
    pointSystem: 'preference', maxPointsEst: 20, nrQuotaPct: 6,
    hasOTC: false, oddsAtZeroPts: 0.02, oddsAt5Pts: 0.10, oddsAt10Pts: 0.30,
    oddsAt15Pts: 0.65, oddsAt20Pts: 0.95,
    notes: 'Very low NR quota (6%). Long wait for quality units. Excellent elk quality worth the wait. NR fee ~$155 (license + app). NOTE: verify current 2026 fees at wildlife.state.nm.us.',
    difficulty: 'hard',
  },
  {
    stateId: 'or', stateName: 'Oregon', species: 'elk', seasonType: 'any',
    appOpenMonth: 12, appCloseMonth: 1, appCloseDay: 15,
    feeNonresident: 669, feeResident: 52,
    pointSystem: 'preference', maxPointsEst: 18, nrQuotaPct: 5,
    hasOTC: false, oddsAtZeroPts: 0.30, oddsAt5Pts: 0.45, oddsAt10Pts: 0.65,
    oddsAt15Pts: 0.85, oddsAt20Pts: 0.95,
    notes: 'NR general elk tags are allocated via draw despite "general" designation. Not reliably OTC for NR. 5% non-resident cap per unit — even general units fill via draw. NR tag ~$669. Best OTC-style units (when available): Sixes, Tioga, Chetco, Trask, Siuslaw, Saddle Mountain. Verify current allocation at dfw.state.or.us.',
    difficulty: 'moderate',
  },
  {
    stateId: 'wa', stateName: 'Washington', species: 'elk', seasonType: 'any',
    appOpenMonth: 12, appCloseMonth: 3, appCloseDay: 31,
    feeNonresident: 686, feeResident: 50,
    pointSystem: 'preference', maxPointsEst: 12, nrQuotaPct: 16,
    hasOTC: false, oddsAtZeroPts: 0.20, oddsAt5Pts: 0.40, oddsAt10Pts: 0.65,
    oddsAt15Pts: 0.85, oddsAt20Pts: 0.99,
    notes: 'NR elk access primarily through special permit draw. General season OTC availability for NR is limited — verify current year allocation at wdfw.wa.gov. NR full package ~$686. Special permit branched bull (east side) requires 8–15 pts via Dec–Mar draw application.',
    difficulty: 'moderate',
  },
  {
    stateId: 'sd', stateName: 'South Dakota', species: 'elk', seasonType: 'any',
    appOpenMonth: 12, appCloseMonth: 2, appCloseDay: 1,
    feeNonresident: 0, feeResident: 10,
    pointSystem: 'none', maxPointsEst: 0, nrQuotaPct: 0,
    hasOTC: false, oddsAtZeroPts: 0, oddsAt5Pts: 0, oddsAt10Pts: 0,
    oddsAt15Pts: 0, oddsAt20Pts: 0,
    notes: 'NON-RESIDENTS INELIGIBLE. South Dakota elk hunting is residents-only — no draw, no OTC, no path for NR. Do not include in NR hunting plans. Verified at gfp.sd.gov.',
    difficulty: 'very_hard',
  },

  // ─── MULE DEER ─────────────────────────────────────────────────────────────
  {
    stateId: 'co', stateName: 'Colorado', species: 'mule_deer', seasonType: 'archery',
    appOpenMonth: 3, appCloseMonth: 4, appCloseDay: 1,
    feeNonresident: 549, feeResident: 8,
    pointSystem: 'preference', maxPointsEst: 25, nrQuotaPct: 20,
    hasOTC: false, oddsAtZeroPts: 0.40, oddsAt5Pts: 0.70, oddsAt10Pts: 0.90,
    oddsAt15Pts: 0.99, oddsAt20Pts: 0.99,
    notes: 'Total NR cost: ~$549 (NR mule deer tag ~$452 + $86 NR small game license + $11 habitat stamp). The $63 was the qualifying license + habitat stamp only — tag fee is added on top when drawn. NR archery OTC eliminated west of I-25 in 2025. Premium units (GMU 2, 10, 201) still require many points. // VERIFY: confirm 2026 tag fees at cpw.state.co.us',
    difficulty: 'moderate',
  },
  {
    stateId: 'wy', stateName: 'Wyoming', species: 'mule_deer', seasonType: 'any',
    appOpenMonth: 1, appCloseMonth: 5, appCloseDay: 31,
    feeNonresident: 386, feeResident: 37,
    pointSystem: 'preference', maxPointsEst: 22, nrQuotaPct: 16,
    hasOTC: false, oddsAtZeroPts: 0.10, oddsAt5Pts: 0.35, oddsAt10Pts: 0.70,
    oddsAt15Pts: 0.92, oddsAt20Pts: 0.99,
    notes: 'Desert and mountain mule deer. NR tag ~$386. Some areas have decent odds at 5-7 points. 75% preference / 25% random draw. Apply Jan 1–May 31 at wgfd.wyo.gov.',
    difficulty: 'moderate',
  },
  {
    stateId: 'ut', stateName: 'Utah', species: 'mule_deer', seasonType: 'any',
    appOpenMonth: 3, appCloseMonth: 4, appCloseDay: 23,
    feeNonresident: 599, feeResident: 40,
    pointSystem: 'weighted', maxPointsEst: 25, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.03, oddsAt5Pts: 0.12, oddsAt10Pts: 0.30,
    oddsAt15Pts: 0.60, oddsAt20Pts: 0.90,
    notes: 'Trophy potential is exceptional but NR quota is tiny. NR tag ~$599. 10–15+ year commitment for best units. Apply Mar 19–Apr 23 at wildlife.utah.gov.',
    difficulty: 'very_hard',
  },
  {
    stateId: 'nv', stateName: 'Nevada', species: 'mule_deer', seasonType: 'any',
    appOpenMonth: 12, appCloseMonth: 2, appCloseDay: 15,
    feeNonresident: 15, feeResident: 10,
    pointSystem: 'bonus', maxPointsEst: 18, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.03, oddsAt5Pts: 0.10, oddsAt10Pts: 0.25,
    oddsAt15Pts: 0.55, oddsAt20Pts: 0.85,
    notes: 'Application fee $15. NR tag if drawn ~$390 (varies by unit) — verify at ndow.org. Some of the best desert mule deer in North America. Low odds but worth applying annually. // VERIFY: confirm tag cost when drawn',
    difficulty: 'hard',
  },
  {
    stateId: 'az', stateName: 'Arizona', species: 'mule_deer', seasonType: 'any',
    appOpenMonth: 1, appCloseMonth: 2, appCloseDay: 12,
    feeNonresident: 175, feeResident: 15,
    pointSystem: 'bonus', maxPointsEst: 20, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.02, oddsAt5Pts: 0.08, oddsAt10Pts: 0.20,
    oddsAt15Pts: 0.45, oddsAt20Pts: 0.80,
    notes: 'Desert mule deer in units 13A, 22 are world-class. Very patient hunters only. NR fee ~$175 ($160 license + $15 app). Apply Jan–Feb at azgfd.com.',
    difficulty: 'very_hard',
  },
  {
    stateId: 'id', stateName: 'Idaho', species: 'mule_deer', seasonType: 'any',
    appOpenMonth: 12, appCloseMonth: 3, appCloseDay: 15,
    feeNonresident: 317, feeResident: 24,
    pointSystem: 'none', maxPointsEst: 0, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.35, oddsAt5Pts: 0.35, oddsAt10Pts: 0.35,
    oddsAt15Pts: 0.35, oddsAt20Pts: 0.35,
    notes: 'Random lottery draw, no preference points system. Not OTC for non-residents. NR deer tag ~$301 + $15.50 license = ~$317 total. Previous $18 figure was application fee only. Pure lottery — points do not help. Verify at idfg.idaho.gov.',
    difficulty: 'moderate',
  },
  {
    stateId: 'mt', stateName: 'Montana', species: 'mule_deer', seasonType: 'any',
    appOpenMonth: 5, appCloseMonth: 6, appCloseDay: 1,
    feeNonresident: 712, feeResident: 10,
    pointSystem: 'none', maxPointsEst: 0, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.45, oddsAt5Pts: 0.45, oddsAt10Pts: 0.45,
    oddsAt15Pts: 0.45, oddsAt20Pts: 0.45,
    notes: 'Total NR cost: ~$712 (NR Deer Combo License $658 + $53 conservation license). The $20 was the application fee only. No OTC for non-residents. Draw only via lottery (apply by June 1). Eastern Montana mule deer are excellent quality. // VERIFY: confirm 2026 NR Deer Combo at fwp.mt.gov',
    difficulty: 'moderate',
  },
  {
    stateId: 'nm', stateName: 'New Mexico', species: 'mule_deer', seasonType: 'any',
    appOpenMonth: 1, appCloseMonth: 3, appCloseDay: 20,
    feeNonresident: 375, feeResident: 15,
    pointSystem: 'preference', maxPointsEst: 18, nrQuotaPct: 6,
    hasOTC: false, oddsAtZeroPts: 0.03, oddsAt5Pts: 0.12, oddsAt10Pts: 0.35,
    oddsAt15Pts: 0.70, oddsAt20Pts: 0.99,
    notes: 'Total NR cost: ~$375 (NR deer license ~$310 + $65 game hunting + habitat fees). The $15 was the application fee only. Trophy quality high. Very low NR quota makes this a long-term play. // VERIFY: confirm 2026 NR deer license at wildlife.state.nm.us',
    difficulty: 'hard',
  },

  // ─── PRONGHORN ─────────────────────────────────────────────────────────────
  {
    stateId: 'wy', stateName: 'Wyoming', species: 'pronghorn', seasonType: 'any',
    appOpenMonth: 1, appCloseMonth: 5, appCloseDay: 31,
    feeNonresident: 285, feeResident: 30,
    pointSystem: 'preference', maxPointsEst: 15, nrQuotaPct: 20,
    hasOTC: false, oddsAtZeroPts: 0.25, oddsAt5Pts: 0.65, oddsAt10Pts: 0.92,
    oddsAt15Pts: 0.99, oddsAt20Pts: 0.99,
    notes: 'Best pronghorn state in the country. NR tag ~$285. Many units draw in 1–3 years. 75% preference / 25% random. Apply Jan 1–May 31 at wgfd.wyo.gov.',
    difficulty: 'moderate',
  },
  {
    stateId: 'co', stateName: 'Colorado', species: 'pronghorn', seasonType: 'any',
    appOpenMonth: 3, appCloseMonth: 4, appCloseDay: 1,
    feeNonresident: 549, feeResident: 8,
    pointSystem: 'preference', maxPointsEst: 12, nrQuotaPct: 20,
    hasOTC: false, oddsAtZeroPts: 0.30, oddsAt5Pts: 0.70, oddsAt10Pts: 0.99,
    oddsAt15Pts: 0.99, oddsAt20Pts: 0.99,
    notes: 'Total NR cost: ~$549 (NR pronghorn tag ~$452 + $86 NR small game license + $11 habitat stamp). The $63 was the qualifying license + habitat stamp only — tag fee is added when drawn. Eastern plains units draw quickly. Great starter pronghorn state. // VERIFY: confirm 2026 tag fees at cpw.state.co.us',
    difficulty: 'moderate',
  },
  {
    stateId: 'mt', stateName: 'Montana', species: 'pronghorn', seasonType: 'any',
    appOpenMonth: 5, appCloseMonth: 6, appCloseDay: 1,
    feeNonresident: 268, feeResident: 10,
    pointSystem: 'none', maxPointsEst: 0, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.40, oddsAt5Pts: 0.40, oddsAt10Pts: 0.40,
    oddsAt15Pts: 0.40, oddsAt20Pts: 0.40,
    notes: 'Total NR cost: ~$268 (NR antelope license $215 + $53 conservation license). The $20 was the application fee only. Random lottery. Eastern Montana units. Good odds overall. // VERIFY: confirm 2026 NR antelope license at fwp.mt.gov',
    difficulty: 'moderate',
  },
  {
    stateId: 'az', stateName: 'Arizona', species: 'pronghorn', seasonType: 'any',
    appOpenMonth: 1, appCloseMonth: 2, appCloseDay: 12,
    feeNonresident: 175, feeResident: 15,
    pointSystem: 'bonus', maxPointsEst: 18, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.03, oddsAt5Pts: 0.10, oddsAt10Pts: 0.30,
    oddsAt15Pts: 0.65, oddsAt20Pts: 0.95,
    notes: 'Trophy pronghorn. Long wait but world-class animals. NR fee ~$175 ($160 license + $15 app). Apply Jan–Feb at azgfd.com.',
    difficulty: 'very_hard',
  },
  {
    stateId: 'nv', stateName: 'Nevada', species: 'pronghorn', seasonType: 'any',
    appOpenMonth: 12, appCloseMonth: 2, appCloseDay: 15,
    feeNonresident: 15, feeResident: 10,
    pointSystem: 'bonus', maxPointsEst: 14, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.05, oddsAt5Pts: 0.18, oddsAt10Pts: 0.45,
    oddsAt15Pts: 0.80, oddsAt20Pts: 0.99,
    notes: 'Application fee $15. NR tag if drawn ~$310 (varies by unit) — verify at ndow.org. Good trophy quality. Worth stacking bonus points annually. // VERIFY: confirm tag cost when drawn',
    difficulty: 'hard',
  },

  // ─── BIGHORN SHEEP ─────────────────────────────────────────────────────────
  {
    stateId: 'co', stateName: 'Colorado', species: 'bighorn_sheep', seasonType: 'any',
    appOpenMonth: 3, appCloseMonth: 4, appCloseDay: 1,
    feeNonresident: 2470, feeResident: 8,
    pointSystem: 'preference', maxPointsEst: 30, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.005, oddsAt5Pts: 0.01, oddsAt10Pts: 0.05,
    oddsAt15Pts: 0.15, oddsAt20Pts: 0.35,
    notes: 'Total NR cost when drawn: ~$2,470 (NR bighorn sheep tag ~$2,373 + $86 NR small game license + $11 habitat stamp). The $63 was the qualifying license + habitat stamp only. 20-30 year average wait. Apply every year without fail. The lifetime bucket-list hunt. // VERIFY: confirm 2026 NR sheep tag at cpw.state.co.us',
    difficulty: 'nearly_impossible',
  },
  {
    stateId: 'wy', stateName: 'Wyoming', species: 'bighorn_sheep', seasonType: 'any',
    appOpenMonth: 1, appCloseMonth: 5, appCloseDay: 31,
    feeNonresident: 2365, feeResident: 150,
    pointSystem: 'preference', maxPointsEst: 28, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.005, oddsAt5Pts: 0.01, oddsAt10Pts: 0.04,
    oddsAt15Pts: 0.12, oddsAt20Pts: 0.30,
    notes: 'Apply every year. Expect 20–25 year wait. NR tag ~$2,365. Pinnacle of western hunting. Apply Jan 1–May 31 at wgfd.wyo.gov.',
    difficulty: 'nearly_impossible',
  },
  {
    stateId: 'mt', stateName: 'Montana', species: 'bighorn_sheep', seasonType: 'any',
    appOpenMonth: 5, appCloseMonth: 6, appCloseDay: 1,
    feeNonresident: 1308, feeResident: 10,
    pointSystem: 'none', maxPointsEst: 0, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.003, oddsAt5Pts: 0.003, oddsAt10Pts: 0.003,
    oddsAt15Pts: 0.003, oddsAt20Pts: 0.003,
    notes: 'Total NR cost when drawn: ~$1,308 (NR bighorn sheep license $1,255 + $53 conservation license). The $20 was the application fee only. Pure lottery. ~300:1 odds or worse. Apply as a lottery ticket — no points accumulate. // VERIFY: confirm 2026 NR sheep license at fwp.mt.gov',
    difficulty: 'nearly_impossible',
  },
  {
    stateId: 'az', stateName: 'Arizona', species: 'bighorn_sheep', seasonType: 'any',
    appOpenMonth: 1, appCloseMonth: 2, appCloseDay: 12,
    feeNonresident: 175, feeResident: 15,
    pointSystem: 'bonus', maxPointsEst: 25, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.003, oddsAt5Pts: 0.01, oddsAt10Pts: 0.04,
    oddsAt15Pts: 0.15, oddsAt20Pts: 0.40,
    notes: 'Desert bighorn. Best trophy quality in North America. 20+ year commitment. NR fee ~$175 ($160 license + $15 app). Apply Jan–Feb at azgfd.com.',
    difficulty: 'nearly_impossible',
  },
  {
    stateId: 'nv', stateName: 'Nevada', species: 'bighorn_sheep', seasonType: 'any',
    appOpenMonth: 12, appCloseMonth: 2, appCloseDay: 15,
    feeNonresident: 15, feeResident: 10,
    pointSystem: 'bonus', maxPointsEst: 22, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.003, oddsAt5Pts: 0.008, oddsAt10Pts: 0.03,
    oddsAt15Pts: 0.12, oddsAt20Pts: 0.35,
    notes: 'Application fee $15. NR sheep tag if drawn ~$1,500 — verify at ndow.org. Apply for bonus points annually. Very long wait but Nevada desert rams are exceptional. // VERIFY: confirm tag cost when drawn',
    difficulty: 'nearly_impossible',
  },
  {
    stateId: 'nm', stateName: 'New Mexico', species: 'bighorn_sheep', seasonType: 'any',
    appOpenMonth: 1, appCloseMonth: 3, appCloseDay: 20,
    feeNonresident: 155, feeResident: 20,
    pointSystem: 'preference', maxPointsEst: 25, nrQuotaPct: 6,
    hasOTC: false, oddsAtZeroPts: 0.003, oddsAt5Pts: 0.008, oddsAt10Pts: 0.025,
    oddsAt15Pts: 0.10, oddsAt20Pts: 0.30,
    notes: 'Very few NR tags. Apply annually for preference points. 20+ years expected. NR fee ~$155. Verify at wildlife.state.nm.us.',
    difficulty: 'nearly_impossible',
  },

  // ─── MOOSE ─────────────────────────────────────────────────────────────────
  {
    stateId: 'wy', stateName: 'Wyoming', species: 'moose', seasonType: 'any',
    appOpenMonth: 1, appCloseMonth: 5, appCloseDay: 31,
    feeNonresident: 2365, feeResident: 150,
    pointSystem: 'preference', maxPointsEst: 25, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.01, oddsAt5Pts: 0.03, oddsAt10Pts: 0.10,
    oddsAt15Pts: 0.30, oddsAt20Pts: 0.65,
    notes: 'Wyoming has excellent Shiras moose. NR tag ~$2,365. Expect 15–20 year wait for top units. Apply Jan 1–May 31 at wgfd.wyo.gov.',
    difficulty: 'nearly_impossible',
  },
  {
    stateId: 'mt', stateName: 'Montana', species: 'moose', seasonType: 'any',
    appOpenMonth: 3, appCloseMonth: 4, appCloseDay: 1,
    feeNonresident: 1308, feeResident: 10,
    pointSystem: 'none', maxPointsEst: 0, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.01, oddsAt5Pts: 0.01, oddsAt10Pts: 0.01,
    oddsAt15Pts: 0.01, oddsAt20Pts: 0.01,
    notes: 'Total NR cost when drawn: ~$1,308 (NR moose license $1,255 + $53 conservation license). The $50 was the application fee only. Pure random lottery. Very few tags. Apply Mar 1–Apr 1 at fwp.mt.gov. Once drawn, you are ineligible for 7 years — once-in-a-lifetime-ish tag. // VERIFY: confirm 2026 NR moose license at fwp.mt.gov',
    difficulty: 'nearly_impossible',
  },
  {
    stateId: 'id', stateName: 'Idaho', species: 'moose', seasonType: 'any',
    appOpenMonth: 4, appCloseMonth: 4, appCloseDay: 30,
    feeNonresident: 2156, feeResident: 13,
    pointSystem: 'none', maxPointsEst: 0, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.01, oddsAt5Pts: 0.01, oddsAt10Pts: 0.01,
    oddsAt15Pts: 0.01, oddsAt20Pts: 0.01,
    notes: 'Total NR cost when drawn: ~$2,156 (NR moose tag ~$2,101 + $55 NR hunting license). The $45 was the application fee only. Pure random lottery — Idaho does NOT use preference points for moose. Apply April 1–30 at idfg.idaho.gov. North Idaho and Selway units have good moose. // VERIFY: confirm 2026 NR moose tag at idfg.idaho.gov',
    difficulty: 'nearly_impossible',
  },
  {
    stateId: 'ut', stateName: 'Utah', species: 'moose', seasonType: 'any',
    appOpenMonth: 2, appCloseMonth: 3, appCloseDay: 1,
    feeNonresident: 1518, feeResident: 10,
    pointSystem: 'weighted', maxPointsEst: 22, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.005, oddsAt5Pts: 0.02, oddsAt10Pts: 0.08,
    oddsAt15Pts: 0.25, oddsAt20Pts: 0.60,
    notes: 'Total NR cost when drawn: ~$1,518 (NR Shiras moose tag ~$1,518 once-in-a-lifetime). The $10 was the application fee only. Shiras moose with good trophy quality. Weighted system helps long-term applicants. // VERIFY: confirm 2026 NR moose tag at wildlife.utah.gov',
    difficulty: 'nearly_impossible',
  },

  // ─── MOUNTAIN GOAT ─────────────────────────────────────────────────────────
  {
    stateId: 'co', stateName: 'Colorado', species: 'mountain_goat', seasonType: 'any',
    appOpenMonth: 3, appCloseMonth: 4, appCloseDay: 1,
    feeNonresident: 2470, feeResident: 8,
    pointSystem: 'preference', maxPointsEst: 30, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.003, oddsAt5Pts: 0.008, oddsAt10Pts: 0.02,
    oddsAt15Pts: 0.08, oddsAt20Pts: 0.25,
    notes: 'Total NR cost when drawn: ~$2,470 (NR mountain goat tag ~$2,373 + $86 NR small game license + $11 habitat stamp). The $63 was the qualifying license + habitat stamp only. The ultimate mountain hunt. 20-30 year wait is realistic. Apply from day one. // VERIFY: confirm 2026 NR goat tag at cpw.state.co.us',
    difficulty: 'nearly_impossible',
  },
  {
    stateId: 'wy', stateName: 'Wyoming', species: 'mountain_goat', seasonType: 'any',
    appOpenMonth: 1, appCloseMonth: 5, appCloseDay: 31,
    feeNonresident: 2365, feeResident: 150,
    pointSystem: 'preference', maxPointsEst: 28, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.003, oddsAt5Pts: 0.008, oddsAt10Pts: 0.025,
    oddsAt15Pts: 0.08, oddsAt20Pts: 0.25,
    notes: 'Apply annually. Wind Rivers and Absaroka Range. NR tag ~$2,365. Exceptionally difficult tag to draw. Apply Jan 1–May 31 at wgfd.wyo.gov.',
    difficulty: 'nearly_impossible',
  },
  {
    stateId: 'mt', stateName: 'Montana', species: 'mountain_goat', seasonType: 'any',
    appOpenMonth: 5, appCloseMonth: 6, appCloseDay: 1,
    feeNonresident: 1308, feeResident: 10,
    pointSystem: 'none', maxPointsEst: 0, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.005, oddsAt5Pts: 0.005, oddsAt10Pts: 0.005,
    oddsAt15Pts: 0.005, oddsAt20Pts: 0.005,
    notes: 'Total NR cost when drawn: ~$1,308 (NR mountain goat license $1,255 + $53 conservation license). The $20 was the application fee only. Pure lottery. Only a handful of NR tags issued annually. // VERIFY: confirm 2026 NR goat license at fwp.mt.gov',
    difficulty: 'nearly_impossible',
  },
  {
    stateId: 'id', stateName: 'Idaho', species: 'mountain_goat', seasonType: 'any',
    appOpenMonth: 4, appCloseMonth: 4, appCloseDay: 30,
    feeNonresident: 2156, feeResident: 13,
    pointSystem: 'none', maxPointsEst: 0, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.004, oddsAt5Pts: 0.004, oddsAt10Pts: 0.004,
    oddsAt15Pts: 0.004, oddsAt20Pts: 0.004,
    notes: 'Total NR cost when drawn: ~$2,156 (NR mountain goat tag ~$2,101 + $55 NR hunting license). The $45 was the application fee only. Pure random lottery — no preference points. Apply April 1–30 at idfg.idaho.gov. Selway-Bitterroot unit is spectacular. // VERIFY: confirm 2026 NR goat tag at idfg.idaho.gov',
    difficulty: 'nearly_impossible',
  },

  // ─── BLACK BEAR ────────────────────────────────────────────────────────────
  {
    stateId: 'mt', stateName: 'Montana', species: 'black_bear', seasonType: 'any',
    appOpenMonth: 5, appCloseMonth: 6, appCloseDay: 1,
    feeNonresident: 408, feeResident: 10,
    pointSystem: 'none', maxPointsEst: 0, nrQuotaPct: 20,
    hasOTC: false, oddsAtZeroPts: 0.50, oddsAt5Pts: 0.50, oddsAt10Pts: 0.50,
    oddsAt15Pts: 0.50, oddsAt20Pts: 0.50,
    notes: 'Total NR cost when drawn: ~$408 (NR black bear license $355 + $53 conservation license). The $20 was the application fee only. No OTC for non-residents. NR bear requires the Big Game Combo or stand-alone NR Bear License via draw. Excellent populations once drawn. // VERIFY: confirm 2026 NR bear license at fwp.mt.gov',
    difficulty: 'moderate',
  },
  {
    stateId: 'id', stateName: 'Idaho', species: 'black_bear', seasonType: 'any',
    appOpenMonth: 1, appCloseMonth: 3, appCloseDay: 31,
    feeNonresident: 186, feeResident: 13,
    pointSystem: 'none', maxPointsEst: 0, nrQuotaPct: 20,
    hasOTC: true, oddsAtZeroPts: 0.99, oddsAt5Pts: 0.99, oddsAt10Pts: 0.99,
    oddsAt15Pts: 0.99, oddsAt20Pts: 0.99,
    notes: 'OTC tag for non-residents. NR bear tag ~$171 + ~$15 NR hunting license = ~$186 total. Spring and fall seasons. One of the best black bear states in the west. Verify at idfg.idaho.gov.',
    difficulty: 'easy',
  },
  {
    stateId: 'or', stateName: 'Oregon', species: 'black_bear', seasonType: 'any',
    appOpenMonth: 12, appCloseMonth: 1, appCloseDay: 15,
    feeNonresident: 155, feeResident: 16,
    pointSystem: 'none', maxPointsEst: 0, nrQuotaPct: 20,
    hasOTC: true, oddsAtZeroPts: 0.99, oddsAt5Pts: 0.99, oddsAt10Pts: 0.99,
    oddsAt15Pts: 0.99, oddsAt20Pts: 0.99,
    notes: 'OTC bear tag for non-residents. NR bear tag ~$139 + ~$16 NR hunting license = ~$155 total. Coastal and Cascade Range populations. Verify at dfw.state.or.us.',
    difficulty: 'easy',
  },
  {
    stateId: 'co', stateName: 'Colorado', species: 'black_bear', seasonType: 'any',
    appOpenMonth: 3, appCloseMonth: 4, appCloseDay: 1,
    feeNonresident: 467, feeResident: 8,
    pointSystem: 'none', maxPointsEst: 0, nrQuotaPct: 20,
    hasOTC: true, oddsAtZeroPts: 0.99, oddsAt5Pts: 0.99, oddsAt10Pts: 0.99,
    oddsAt15Pts: 0.99, oddsAt20Pts: 0.99,
    notes: 'Total NR OTC cost: ~$467 (NR bear tag ~$370 + $86 NR small game license + $11 habitat stamp). The $63 was the qualifying license + habitat stamp only. OTC by unit — some units have quotas that close mid-season. Verify unit-level availability at cpw.state.co.us before purchasing. // VERIFY: confirm 2026 NR bear tag at cpw.state.co.us',
    difficulty: 'easy',
  },

  // ─── WHITETAIL ─────────────────────────────────────────────────────────────
  {
    stateId: 'pa', stateName: 'Pennsylvania', species: 'whitetail', seasonType: 'any',
    appOpenMonth: 1, appCloseMonth: 8, appCloseDay: 31,
    feeNonresident: 27, feeResident: 27,
    pointSystem: 'otc', maxPointsEst: 0, nrQuotaPct: 100,
    hasOTC: true, oddsAtZeroPts: 0.99, oddsAt5Pts: 0.99, oddsAt10Pts: 0.99,
    oddsAt15Pts: 0.99, oddsAt20Pts: 0.99,
    notes: 'OTC license. High deer density. Archery, rifle, and muzzleloader seasons all available.',
    difficulty: 'easy',
  },
  {
    stateId: 'mi', stateName: 'Michigan', species: 'whitetail', seasonType: 'any',
    appOpenMonth: 1, appCloseMonth: 9, appCloseDay: 30,
    feeNonresident: 155, feeResident: 20,
    pointSystem: 'otc', maxPointsEst: 0, nrQuotaPct: 100,
    hasOTC: true, oddsAtZeroPts: 0.99, oddsAt5Pts: 0.99, oddsAt10Pts: 0.99,
    oddsAt15Pts: 0.99, oddsAt20Pts: 0.99,
    notes: 'OTC tag. UP has excellent trophy hunting. NR license expensive but good access.',
    difficulty: 'easy',
  },
  {
    stateId: 'wi', stateName: 'Wisconsin', species: 'whitetail', seasonType: 'any',
    appOpenMonth: 1, appCloseMonth: 9, appCloseDay: 30,
    feeNonresident: 160, feeResident: 24,
    pointSystem: 'otc', maxPointsEst: 0, nrQuotaPct: 100,
    hasOTC: true, oddsAtZeroPts: 0.99, oddsAt5Pts: 0.99, oddsAt10Pts: 0.99,
    oddsAt15Pts: 0.99, oddsAt20Pts: 0.99,
    notes: 'OTC archery and firearm tags. One of the best whitetail states. CWD zones to consider.',
    difficulty: 'easy',
  },
  {
    stateId: 'ky', stateName: 'Kentucky', species: 'whitetail', seasonType: 'any',
    appOpenMonth: 1, appCloseMonth: 9, appCloseDay: 30,
    feeNonresident: 185, feeResident: 30,
    pointSystem: 'otc', maxPointsEst: 0, nrQuotaPct: 100,
    hasOTC: true, oddsAtZeroPts: 0.99, oddsAt5Pts: 0.99, oddsAt10Pts: 0.99,
    oddsAt15Pts: 0.99, oddsAt20Pts: 0.99,
    notes: 'Trophy destination. OTC tag. Western KY has exceptional genetics. Long archery season.',
    difficulty: 'easy',
  },
  {
    stateId: 'mn', stateName: 'Minnesota', species: 'whitetail', seasonType: 'any',
    appOpenMonth: 1, appCloseMonth: 9, appCloseDay: 30,
    feeNonresident: 165, feeResident: 30,
    pointSystem: 'otc', maxPointsEst: 0, nrQuotaPct: 100,
    hasOTC: true, oddsAtZeroPts: 0.99, oddsAt5Pts: 0.99, oddsAt10Pts: 0.99,
    oddsAt15Pts: 0.99, oddsAt20Pts: 0.99,
    notes: 'OTC tag. Agricultural zones have exceptional trophy deer. Long archery season.',
    difficulty: 'easy',
  },

  // ─── CALIFORNIA ────────────────────────────────────────────────────────────
  {
    stateId: 'ca', stateName: 'California', species: 'elk', seasonType: 'any',
    appOpenMonth: 2, appCloseMonth: 3, appCloseDay: 15,
    feeNonresident: 1535, feeResident: 48,
    pointSystem: 'preference', maxPointsEst: 20, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.02, oddsAt5Pts: 0.08, oddsAt10Pts: 0.25,
    oddsAt15Pts: 0.55, oddsAt20Pts: 0.90,
    notes: 'Total NR cost when drawn: ~$1,535 (NR elk tag ~$1,487 + $48 NR hunting license). The $48 was the license/application fee only. Tule elk unique to CA. Roosevelt elk in northwest zones. Very few NR tags. Residents and NR compete equally in most zones. // VERIFY: confirm 2026 NR elk tag at wildlife.ca.gov',
    difficulty: 'hard',
  },
  {
    stateId: 'ca', stateName: 'California', species: 'black_bear', seasonType: 'any',
    appOpenMonth: 7, appCloseMonth: 8, appCloseDay: 31,
    feeNonresident: 298, feeResident: 48,
    pointSystem: 'none', maxPointsEst: 0, nrQuotaPct: 20,
    hasOTC: true, oddsAtZeroPts: 0.99, oddsAt5Pts: 0.99, oddsAt10Pts: 0.99,
    oddsAt15Pts: 0.99, oddsAt20Pts: 0.99,
    notes: 'State-wide quota applies — season closes when quota is reached, sometimes mid-season. Check current quota status at wildlife.ca.gov before purchasing. NR tag ~$282 + $16 NR license = ~$298 total. Sierra Nevada and Coast Ranges hold large populations.',
    difficulty: 'easy',
  },
  {
    stateId: 'ca', stateName: 'California', species: 'mule_deer', seasonType: 'archery',
    appOpenMonth: 6, appCloseMonth: 7, appCloseDay: 10,
    feeNonresident: 348, feeResident: 48,
    pointSystem: 'preference', maxPointsEst: 16, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.05, oddsAt5Pts: 0.20, oddsAt10Pts: 0.55,
    oddsAt15Pts: 0.90, oddsAt20Pts: 0.99,
    notes: 'Total NR cost when drawn: ~$348 (NR deer tag ~$300 + $48 NR hunting license). The $48 was the license/application fee only. Zone A and X zones are most coveted. NR must draw. Premium zones like A-zone require points. // VERIFY: confirm 2026 NR deer tag at wildlife.ca.gov',
    difficulty: 'hard',
  },
  {
    stateId: 'ca', stateName: 'California', species: 'mule_deer', seasonType: 'any',
    appOpenMonth: 6, appCloseMonth: 7, appCloseDay: 10,
    feeNonresident: 348, feeResident: 48,
    pointSystem: 'preference', maxPointsEst: 18, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.03, oddsAt5Pts: 0.12, oddsAt10Pts: 0.35,
    oddsAt15Pts: 0.70, oddsAt20Pts: 0.99,
    notes: 'Total NR cost when drawn: ~$348 (NR deer tag ~$300 + $48 NR hunting license). The $48 was the license/application fee only. General rifle season. Zone X zones highly coveted. A-zone is general with OTC for residents. NR must draw most zones. // VERIFY: confirm 2026 NR deer tag at wildlife.ca.gov',
    difficulty: 'hard',
  },
  {
    stateId: 'ca', stateName: 'California', species: 'bighorn_sheep', seasonType: 'any',
    appOpenMonth: 2, appCloseMonth: 3, appCloseDay: 15,
    feeNonresident: 1548, feeResident: 48,
    pointSystem: 'preference', maxPointsEst: 25, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.003, oddsAt5Pts: 0.008, oddsAt10Pts: 0.025,
    oddsAt15Pts: 0.08, oddsAt20Pts: 0.25,
    notes: 'Total NR cost when drawn: ~$1,548 (NR bighorn sheep tag ~$1,500 + $48 NR hunting license). The $48 was the license/application fee only. Desert bighorn in southern CA, Sierra Nevada bighorn extremely rare. Apply annually for points. 15-25 year commitment. // VERIFY: confirm 2026 NR sheep tag at wildlife.ca.gov',
    difficulty: 'nearly_impossible',
  },
  {
    stateId: 'ca', stateName: 'California', species: 'pronghorn', seasonType: 'any',
    appOpenMonth: 2, appCloseMonth: 3, appCloseDay: 15,
    feeNonresident: 348, feeResident: 48,
    pointSystem: 'preference', maxPointsEst: 15, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.05, oddsAt5Pts: 0.20, oddsAt10Pts: 0.55,
    oddsAt15Pts: 0.90, oddsAt20Pts: 0.99,
    notes: 'Total NR cost when drawn: ~$348 (NR pronghorn tag ~$300 + $48 NR hunting license). The $48 was the license/application fee only. Northeastern CA (Modoc/Lassen counties) pronghorn. Underrated opportunity. Residents have better odds. Scenic high desert hunt. // VERIFY: confirm 2026 NR pronghorn tag at wildlife.ca.gov',
    difficulty: 'hard',
  },

  // ─── NEVADA (expanded) ─────────────────────────────────────────────────────
  {
    stateId: 'nv', stateName: 'Nevada', species: 'elk', seasonType: 'archery',
    appOpenMonth: 12, appCloseMonth: 2, appCloseDay: 15,
    feeNonresident: 15, feeResident: 10,
    pointSystem: 'bonus', maxPointsEst: 18, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.03, oddsAt5Pts: 0.10, oddsAt10Pts: 0.28,
    oddsAt15Pts: 0.55, oddsAt20Pts: 0.85,
    notes: 'Application fee $15. NR archery elk tag if drawn ~$1,200 — verify at ndow.org. Archery elk separate application from rifle. Ruby Mountains and Humboldt units top choices. Bonus points help significantly. // VERIFY: confirm tag cost when drawn',
    difficulty: 'hard',
  },
  {
    stateId: 'nv', stateName: 'Nevada', species: 'moose', seasonType: 'any',
    appOpenMonth: 12, appCloseMonth: 2, appCloseDay: 15,
    feeNonresident: 15, feeResident: 10,
    pointSystem: 'bonus', maxPointsEst: 20, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.005, oddsAt5Pts: 0.015, oddsAt10Pts: 0.05,
    oddsAt15Pts: 0.18, oddsAt20Pts: 0.50,
    notes: 'Application fee $15. NR moose tag if drawn ~$1,500 — verify at ndow.org. Shiras moose in northeastern NV. Very few tags. Apply annually for bonus points. // VERIFY: confirm tag cost when drawn',
    difficulty: 'nearly_impossible',
  },
  {
    stateId: 'nv', stateName: 'Nevada', species: 'mountain_goat', seasonType: 'any',
    appOpenMonth: 12, appCloseMonth: 2, appCloseDay: 15,
    feeNonresident: 15, feeResident: 10,
    pointSystem: 'bonus', maxPointsEst: 22, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.003, oddsAt5Pts: 0.008, oddsAt10Pts: 0.025,
    oddsAt15Pts: 0.10, oddsAt20Pts: 0.30,
    notes: 'Application fee $15. NR mountain goat tag if drawn ~$1,500 — verify at ndow.org. Ruby Mountains mountain goat. Extremely limited tags. Apply every year; bonus points compound over time. // VERIFY: confirm tag cost when drawn',
    difficulty: 'nearly_impossible',
  },

  // ─── OREGON (expanded) ─────────────────────────────────────────────────────
  {
    stateId: 'or', stateName: 'Oregon', species: 'mule_deer', seasonType: 'any',
    appOpenMonth: 12, appCloseMonth: 1, appCloseDay: 15,
    feeNonresident: 348, feeResident: 28,
    pointSystem: 'preference', maxPointsEst: 14, nrQuotaPct: 16,
    hasOTC: false, oddsAtZeroPts: 0.15, oddsAt5Pts: 0.50, oddsAt10Pts: 0.90,
    oddsAt15Pts: 0.99, oddsAt20Pts: 0.99,
    notes: 'High desert mule deer in eastern OR. Steens Mountain and Hart Mountain units are premier. Draw in 3–6 years with points. NR tag ~$348. Verify at dfw.state.or.us.',
    difficulty: 'moderate',
  },
  {
    stateId: 'or', stateName: 'Oregon', species: 'pronghorn', seasonType: 'any',
    appOpenMonth: 12, appCloseMonth: 1, appCloseDay: 15,
    feeNonresident: 298, feeResident: 22,
    pointSystem: 'preference', maxPointsEst: 12, nrQuotaPct: 16,
    hasOTC: false, oddsAtZeroPts: 0.20, oddsAt5Pts: 0.60, oddsAt10Pts: 0.95,
    oddsAt15Pts: 0.99, oddsAt20Pts: 0.99,
    notes: 'Southeastern OR pronghorn. Warner Valley and Beatys Butte units are excellent. Often draws in 2–4 years. NR tag ~$298. Verify at dfw.state.or.us.',
    difficulty: 'moderate',
  },
  {
    stateId: 'or', stateName: 'Oregon', species: 'bighorn_sheep', seasonType: 'any',
    appOpenMonth: 12, appCloseMonth: 1, appCloseDay: 15,
    feeNonresident: 1625, feeResident: 30,
    pointSystem: 'preference', maxPointsEst: 22, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.005, oddsAt5Pts: 0.012, oddsAt10Pts: 0.04,
    oddsAt15Pts: 0.15, oddsAt20Pts: 0.40,
    notes: 'Rocky Mountain bighorn in Wallowa units. Desert bighorn in southeastern OR. 15–20 year wait for top units. NR tag ~$1,625. Verify at dfw.state.or.us.',
    difficulty: 'nearly_impossible',
  },
  {
    stateId: 'or', stateName: 'Oregon', species: 'moose', seasonType: 'any',
    appOpenMonth: 12, appCloseMonth: 1, appCloseDay: 15,
    feeNonresident: 1625, feeResident: 30,
    pointSystem: 'preference', maxPointsEst: 18, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.008, oddsAt5Pts: 0.025, oddsAt10Pts: 0.08,
    oddsAt15Pts: 0.25, oddsAt20Pts: 0.65,
    notes: 'Shiras moose in northeastern OR. Growing herd. Fewer applicants than WY/MT. NR tag ~$1,625. Verify at dfw.state.or.us.',
    difficulty: 'nearly_impossible',
  },

  // ─── WASHINGTON (expanded) ─────────────────────────────────────────────────
  {
    stateId: 'wa', stateName: 'Washington', species: 'mule_deer', seasonType: 'any',
    appOpenMonth: 2, appCloseMonth: 3, appCloseDay: 1,
    feeNonresident: 264, feeResident: 35,
    pointSystem: 'preference', maxPointsEst: 10, nrQuotaPct: 16,
    hasOTC: false, oddsAtZeroPts: 0.20, oddsAt5Pts: 0.65, oddsAt10Pts: 0.99,
    oddsAt15Pts: 0.99, oddsAt20Pts: 0.99,
    notes: 'Eastern WA mule deer. Colockum and Yakima units popular. Draws relatively quickly. Underrated western deer destination. NR tag ~$264. Verify at wdfw.wa.gov.',
    difficulty: 'moderate',
  },
  {
    stateId: 'wa', stateName: 'Washington', species: 'black_bear', seasonType: 'any',
    appOpenMonth: 2, appCloseMonth: 3, appCloseDay: 1,
    feeNonresident: 264, feeResident: 35,
    pointSystem: 'none', maxPointsEst: 0, nrQuotaPct: 20,
    hasOTC: true, oddsAtZeroPts: 0.99, oddsAt5Pts: 0.99, oddsAt10Pts: 0.99,
    oddsAt15Pts: 0.99, oddsAt20Pts: 0.99,
    notes: 'OTC spring and fall bear tags. Good populations in Cascades and Olympic Peninsula. Combo well with elk.',
    difficulty: 'easy',
  },
  {
    stateId: 'wa', stateName: 'Washington', species: 'bighorn_sheep', seasonType: 'any',
    appOpenMonth: 2, appCloseMonth: 3, appCloseDay: 1,
    feeNonresident: 1500, feeResident: 50,
    pointSystem: 'preference', maxPointsEst: 20, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.005, oddsAt5Pts: 0.012, oddsAt10Pts: 0.04,
    oddsAt15Pts: 0.15, oddsAt20Pts: 0.42,
    notes: 'Rocky Mountain bighorn in Yakima Canyon and Tieton units. Very few tags. Apply annually to accumulate points. NR tag ~$1,500. Verify at wdfw.wa.gov.',
    difficulty: 'nearly_impossible',
  },
  {
    stateId: 'wa', stateName: 'Washington', species: 'moose', seasonType: 'any',
    appOpenMonth: 2, appCloseMonth: 3, appCloseDay: 1,
    feeNonresident: 1500, feeResident: 50,
    pointSystem: 'preference', maxPointsEst: 18, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.01, oddsAt5Pts: 0.04, oddsAt10Pts: 0.15,
    oddsAt15Pts: 0.45, oddsAt20Pts: 0.85,
    notes: 'Shiras moose in northeastern WA. Good populations near Colville area. Worth building points annually. NR tag ~$1,500. Verify at wdfw.wa.gov.',
    difficulty: 'nearly_impossible',
  },

  // ─── NEW MEXICO (expanded) ─────────────────────────────────────────────────
  {
    stateId: 'nm', stateName: 'New Mexico', species: 'pronghorn', seasonType: 'any',
    appOpenMonth: 1, appCloseMonth: 3, appCloseDay: 20,
    feeNonresident: 120, feeResident: 20,
    pointSystem: 'preference', maxPointsEst: 14, nrQuotaPct: 6,
    hasOTC: false, oddsAtZeroPts: 0.05, oddsAt5Pts: 0.20, oddsAt10Pts: 0.60,
    oddsAt15Pts: 0.95, oddsAt20Pts: 0.99,
    notes: 'Northeastern NM plains. Low NR quota but pronghorn are plentiful. Worth applying for points. Faster draw than elk or deer. NR fee ~$120. Verify at wildlife.state.nm.us.',
    difficulty: 'hard',
  },
  {
    stateId: 'nm', stateName: 'New Mexico', species: 'black_bear', seasonType: 'any',
    appOpenMonth: 1, appCloseMonth: 3, appCloseDay: 20,
    feeNonresident: 155, feeResident: 15,
    pointSystem: 'none', maxPointsEst: 0, nrQuotaPct: 6,
    hasOTC: false, oddsAtZeroPts: 0.10, oddsAt5Pts: 0.10, oddsAt10Pts: 0.10,
    oddsAt15Pts: 0.10, oddsAt20Pts: 0.10,
    notes: 'Draw-only for non-residents with very limited NR quotas. Not OTC. Apply Jan–Mar at wildlife.state.nm.us. Gila and Lincoln National Forests are the marquee bear units.',
    difficulty: 'hard',
  },
  {
    stateId: 'nm', stateName: 'New Mexico', species: 'mountain_lion', seasonType: 'any',
    appOpenMonth: 1, appCloseMonth: 3, appCloseDay: 20,
    feeNonresident: 155, feeResident: 15,
    pointSystem: 'none', maxPointsEst: 0, nrQuotaPct: 20,
    hasOTC: false, oddsAtZeroPts: 0.40, oddsAt5Pts: 0.40, oddsAt10Pts: 0.40,
    oddsAt15Pts: 0.40, oddsAt20Pts: 0.40,
    notes: 'Unit-quota system — not reliably OTC. Verify current zone quota availability at wildlife.state.nm.us. Hound hunting allowed. Southern NM has excellent lion populations.',
    difficulty: 'moderate',
  },
  {
    stateId: 'nm', stateName: 'New Mexico', species: 'moose', seasonType: 'any',
    appOpenMonth: 1, appCloseMonth: 3, appCloseDay: 20,
    feeNonresident: 155, feeResident: 20,
    pointSystem: 'preference', maxPointsEst: 22, nrQuotaPct: 6,
    hasOTC: false, oddsAtZeroPts: 0.01, oddsAt5Pts: 0.04, oddsAt10Pts: 0.12,
    oddsAt15Pts: 0.35, oddsAt20Pts: 0.75,
    notes: 'Very rare. Valles Caldera and northern NM units. Extremely few NR tags. Apply every year. NR fee ~$155. Verify at wildlife.state.nm.us.',
    difficulty: 'nearly_impossible',
  },

  // ─── BISON ─────────────────────────────────────────────────────────────────
  {
    stateId: 'mt', stateName: 'Montana', species: 'bison', seasonType: 'any',
    appOpenMonth: 5, appCloseMonth: 6, appCloseDay: 1,
    feeNonresident: 803, feeResident: 10,
    pointSystem: 'none', maxPointsEst: 0, nrQuotaPct: 5,
    hasOTC: false, oddsAtZeroPts: 0.002, oddsAt5Pts: 0.002, oddsAt10Pts: 0.002,
    oddsAt15Pts: 0.002, oddsAt20Pts: 0.002,
    notes: 'Total NR cost when drawn: ~$803 (NR bison license $750 + $53 conservation license). The $20 was the application fee only. Extremely rare. Yellowstone border hunt. Apply every year as a lottery ticket. // VERIFY: confirm 2026 NR bison license at fwp.mt.gov',
    difficulty: 'nearly_impossible',
  },
  {
    stateId: 'ut', stateName: 'Utah', species: 'bison', seasonType: 'any',
    appOpenMonth: 3, appCloseMonth: 4, appCloseDay: 23,
    feeNonresident: 2250, feeResident: 500,
    pointSystem: 'weighted', maxPointsEst: 25, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.002, oddsAt5Pts: 0.005, oddsAt10Pts: 0.02,
    oddsAt15Pts: 0.08, oddsAt20Pts: 0.25,
    notes: 'Henry Mountains and Antelope Island herds. Very few tags. Bucket list hunt. NR tag ~$2,250. Apply Mar 19–Apr 23 at wildlife.utah.gov. Verify current fees.',
    difficulty: 'nearly_impossible',
  },
  {
    stateId: 'az', stateName: 'Arizona', species: 'bison', seasonType: 'any',
    appOpenMonth: 1, appCloseMonth: 2, appCloseDay: 12,
    feeNonresident: 175, feeResident: 15,
    pointSystem: 'bonus', maxPointsEst: 20, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.002, oddsAt5Pts: 0.005, oddsAt10Pts: 0.02,
    oddsAt15Pts: 0.08, oddsAt20Pts: 0.30,
    notes: 'House Rock Valley and Raymond herd. Grand Canyon bison. Exceptional rarity. NR fee ~$175 ($160 license + $15 app). Apply Jan–Feb at azgfd.com.',
    difficulty: 'nearly_impossible',
  },

  // ─── WHITETAIL (expanded) ───────────────────────────────────────────────────
  {
    stateId: 'tx', stateName: 'Texas', species: 'whitetail', seasonType: 'any',
    appOpenMonth: 8, appCloseMonth: 8, appCloseDay: 31,
    feeNonresident: 68, feeResident: 25,
    pointSystem: 'otc', maxPointsEst: 0, nrQuotaPct: 100,
    hasOTC: true, oddsAtZeroPts: 0.99, oddsAt5Pts: 0.99, oddsAt10Pts: 0.99,
    oddsAt15Pts: 0.99, oddsAt20Pts: 0.99,
    notes: 'OTC license statewide. Best hunting is on private ranches (guides/outfitters). Rio Grande and Hill Country have exceptional genetics. NR license ~$68. Season opens Nov 1. Verify at tpwd.texas.gov.',
    difficulty: 'easy',
  },
  {
    stateId: 'ks', stateName: 'Kansas', species: 'whitetail', seasonType: 'any',
    appOpenMonth: 5, appCloseMonth: 6, appCloseDay: 15,
    feeNonresident: 442, feeResident: 42,
    pointSystem: 'preference', maxPointsEst: 10, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.08, oddsAt5Pts: 0.45, oddsAt10Pts: 0.92,
    oddsAt15Pts: 0.99, oddsAt20Pts: 0.99,
    notes: 'One of the top whitetail draw states in the country. NR limited to 10% of tags. NR combo license ~$442. Very tight — expect 5-8 years wait for firearm. Archery draws somewhat faster. Apply May–Jun 15 at ksoutdoors.com. Trophy genetics are exceptional.',
    difficulty: 'hard',
  },
  {
    stateId: 'ia', stateName: 'Iowa', species: 'whitetail', seasonType: 'any',
    appOpenMonth: 6, appCloseMonth: 7, appCloseDay: 1,
    feeNonresident: 602, feeResident: 28,
    pointSystem: 'preference', maxPointsEst: 12, nrQuotaPct: 6,
    hasOTC: false, oddsAtZeroPts: 0.02, oddsAt5Pts: 0.15, oddsAt10Pts: 0.55,
    oddsAt15Pts: 0.90, oddsAt20Pts: 0.99,
    notes: 'The most coveted non-resident whitetail tag in the country. Extremely limited NR quota (6%). NR license + tag ~$602. Expect 8–12 year wait. When you draw, it could be a Boone & Crockett buck. Apply Jun–Jul at iowadnr.gov. Start accumulating points immediately.',
    difficulty: 'very_hard',
  },
  {
    stateId: 'oh', stateName: 'Ohio', species: 'whitetail', seasonType: 'any',
    appOpenMonth: 1, appCloseMonth: 8, appCloseDay: 31,
    feeNonresident: 96, feeResident: 19,
    pointSystem: 'otc', maxPointsEst: 0, nrQuotaPct: 100,
    hasOTC: true, oddsAtZeroPts: 0.99, oddsAt5Pts: 0.99, oddsAt10Pts: 0.99,
    oddsAt15Pts: 0.99, oddsAt20Pts: 0.99,
    notes: 'OTC license. Exceptional whitetail genetics in the agricultural region (Holmes, Coshocton, Tuscarawas counties). Long archery season (Oct 1–Feb). NR license ~$96. Access is key — need private land or public land scouting. Verify at ohiodnr.gov.',
    difficulty: 'easy',
  },
  {
    stateId: 'il', stateName: 'Illinois', species: 'whitetail', seasonType: 'any',
    appOpenMonth: 1, appCloseMonth: 8, appCloseDay: 31,
    feeNonresident: 150, feeResident: 24,
    pointSystem: 'otc', maxPointsEst: 0, nrQuotaPct: 100,
    hasOTC: true, oddsAtZeroPts: 0.99, oddsAt5Pts: 0.99, oddsAt10Pts: 0.99,
    oddsAt15Pts: 0.99, oddsAt20Pts: 0.99,
    notes: 'OTC archery license. One of the top trophy whitetail producers in North America. Pike, Adams, Brown counties (western IL) are legendary. NR archery combo ~$150. Long archery season (Oct–Jan). Deer density is very high. Verify at dnr.illinois.gov.',
    difficulty: 'easy',
  },

  // ─── WHITETAIL — SOUTHEAST ─────────────────────────────────────────────────
  {
    stateId: 'ms', stateName: 'Mississippi', species: 'whitetail', seasonType: 'any',
    appOpenMonth: 1, appCloseMonth: 9, appCloseDay: 30,
    feeNonresident: 250, feeResident: 12,
    pointSystem: 'otc', maxPointsEst: 0, nrQuotaPct: 100,
    hasOTC: true, oddsAtZeroPts: 0.99, oddsAt5Pts: 0.99, oddsAt10Pts: 0.99,
    oddsAt15Pts: 0.99, oddsAt20Pts: 0.99,
    notes: 'OTC license. One of the most deer-dense states. Long season. Delta and eastern MS have exceptional genetics. NR license ~$250. Good for spot-and-stalk or stand hunting. Verify at mdwfp.com.',
    difficulty: 'easy',
  },
  {
    stateId: 'ga', stateName: 'Georgia', species: 'whitetail', seasonType: 'any',
    appOpenMonth: 1, appCloseMonth: 9, appCloseDay: 15,
    feeNonresident: 100, feeResident: 19,
    pointSystem: 'otc', maxPointsEst: 0, nrQuotaPct: 100,
    hasOTC: true, oddsAtZeroPts: 0.99, oddsAt5Pts: 0.99, oddsAt10Pts: 0.99,
    oddsAt15Pts: 0.99, oddsAt20Pts: 0.99,
    notes: 'OTC license. Generous bag limits (up to 10 deer/season). Very long season. NR license ~$100. Coastal plains have big-bodied deer. Verify at georgiawildlife.com.',
    difficulty: 'easy',
  },
];

export function getStatesForSpecies(species: SpeciesKey[]): string[] {
  const stateIds = new Set<string>();
  huntingData
    .filter(d => species.includes(d.species))
    .forEach(d => stateIds.add(d.stateId));
  return Array.from(stateIds).sort();
}

export function getDataForState(stateId: string, species: SpeciesKey[]): StateSeasonData[] {
  return huntingData.filter(
    d => d.stateId === stateId && species.includes(d.species)
  );
}

export function formatDeadlines(species: SpeciesKey[]): string {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const upcoming = huntingData
    .filter(d => species.includes(d.species))
    .map(d => {
      const closeYear =
        d.appCloseMonth < currentMonth ? currentYear + 1 : currentYear;
      return {
        stateName: d.stateName,
        species: d.species,
        closeMonth: d.appCloseMonth,
        closeDay: d.appCloseDay,
        closeYear,
        fee: d.feeNonresident,
      };
    })
    .sort((a, b) => {
      const da = new Date(a.closeYear, a.closeMonth - 1, a.closeDay ?? 1);
      const db = new Date(b.closeYear, b.closeMonth - 1, b.closeDay ?? 1);
      return da.getTime() - db.getTime();
    })
    .slice(0, 10);

  return upcoming
    .map(
      d =>
        `${d.stateName} ${SPECIES_LABELS[d.species as SpeciesKey]} — closes ${d.closeMonth}/${d.closeDay}/${d.closeYear} (NR app fee: $${d.fee})`
    )
    .join('\n');
}
