import { StateSeasonData, SpeciesKey } from './types';

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
    appOpenMonth: 3, appCloseMonth: 4, appCloseDay: 1,
    feeNonresident: 63, feeResident: 8,
    pointSystem: 'preference', maxPointsEst: 20, nrQuotaPct: 20,
    hasOTC: true, oddsAtZeroPts: 0.85, oddsAt5Pts: 0.95, oddsAt10Pts: 0.99,
    oddsAt15Pts: 0.99, oddsAt20Pts: 0.99,
    notes: 'Many units are OTC archery for non-residents. Habitat stamp ($10) required. Premium units need points.',
    difficulty: 'easy',
  },
  {
    stateId: 'wy', stateName: 'Wyoming', species: 'elk', seasonType: 'any',
    appOpenMonth: 1, appCloseMonth: 5, appCloseDay: 31,
    feeNonresident: 15, feeResident: 15,
    pointSystem: 'preference', maxPointsEst: 25, nrQuotaPct: 16,
    hasOTC: false, oddsAtZeroPts: 0.15, oddsAt5Pts: 0.45, oddsAt10Pts: 0.75,
    oddsAt15Pts: 0.90, oddsAt20Pts: 0.98,
    notes: 'Complex system with Type 1/2/9 licenses. Preference points build slowly. Some general areas available.',
    difficulty: 'moderate',
  },
  {
    stateId: 'mt', stateName: 'Montana', species: 'elk', seasonType: 'any',
    appOpenMonth: 5, appCloseMonth: 6, appCloseDay: 1,
    feeNonresident: 20, feeResident: 10,
    pointSystem: 'none', maxPointsEst: 0, nrQuotaPct: 10,
    hasOTC: true, oddsAtZeroPts: 0.60, oddsAt5Pts: 0.60, oddsAt10Pts: 0.60,
    oddsAt15Pts: 0.60, oddsAt20Pts: 0.60,
    notes: 'General OTC archery tag available for most areas. Limited draw units by lottery (no points).',
    difficulty: 'moderate',
  },
  {
    stateId: 'id', stateName: 'Idaho', species: 'elk', seasonType: 'any',
    appOpenMonth: 12, appCloseMonth: 3, appCloseDay: 15,
    feeNonresident: 18, feeResident: 13,
    pointSystem: 'preference', maxPointsEst: 15, nrQuotaPct: 10,
    hasOTC: true, oddsAtZeroPts: 0.70, oddsAt5Pts: 0.90, oddsAt10Pts: 0.99,
    oddsAt15Pts: 0.99, oddsAt20Pts: 0.99,
    notes: 'Many OTC archery zones. Draw zones require preference points. Good general season hunting.',
    difficulty: 'easy',
  },
  {
    stateId: 'ut', stateName: 'Utah', species: 'elk', seasonType: 'any',
    appOpenMonth: 2, appCloseMonth: 3, appCloseDay: 1,
    feeNonresident: 10, feeResident: 10,
    pointSystem: 'weighted', maxPointsEst: 25, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.05, oddsAt5Pts: 0.15, oddsAt10Pts: 0.35,
    oddsAt15Pts: 0.60, oddsAt20Pts: 0.85,
    notes: 'Weighted preference points (square root formula). Very few NR tags. Premium units extremely competitive.',
    difficulty: 'hard',
  },
  {
    stateId: 'nv', stateName: 'Nevada', species: 'elk', seasonType: 'any',
    appOpenMonth: 12, appCloseMonth: 2, appCloseDay: 15,
    feeNonresident: 10, feeResident: 10,
    pointSystem: 'bonus', maxPointsEst: 20, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.02, oddsAt5Pts: 0.08, oddsAt10Pts: 0.20,
    oddsAt15Pts: 0.40, oddsAt20Pts: 0.70,
    notes: 'Bonus points accumulate slowly. Very few NR tags issued. Worth applying for points annually.',
    difficulty: 'very_hard',
  },
  {
    stateId: 'az', stateName: 'Arizona', species: 'elk', seasonType: 'any',
    appOpenMonth: 1, appCloseMonth: 2, appCloseDay: 12,
    feeNonresident: 13, feeResident: 13,
    pointSystem: 'bonus', maxPointsEst: 25, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.01, oddsAt5Pts: 0.05, oddsAt10Pts: 0.15,
    oddsAt15Pts: 0.35, oddsAt20Pts: 0.65,
    notes: 'World-class elk. 10-20 year wait for premium units. Apply for points every year even if not hunting soon.',
    difficulty: 'very_hard',
  },
  {
    stateId: 'nm', stateName: 'New Mexico', species: 'elk', seasonType: 'any',
    appOpenMonth: 1, appCloseMonth: 3, appCloseDay: 20,
    feeNonresident: 15, feeResident: 15,
    pointSystem: 'preference', maxPointsEst: 20, nrQuotaPct: 6,
    hasOTC: false, oddsAtZeroPts: 0.02, oddsAt5Pts: 0.10, oddsAt10Pts: 0.30,
    oddsAt15Pts: 0.65, oddsAt20Pts: 0.95,
    notes: 'Very low NR quota (6%). Long wait for quality units. Excellent elk quality worth the wait.',
    difficulty: 'hard',
  },
  {
    stateId: 'or', stateName: 'Oregon', species: 'elk', seasonType: 'any',
    appOpenMonth: 12, appCloseMonth: 1, appCloseDay: 15,
    feeNonresident: 9, feeResident: 9,
    pointSystem: 'preference', maxPointsEst: 18, nrQuotaPct: 16,
    hasOTC: false, oddsAtZeroPts: 0.10, oddsAt5Pts: 0.40, oddsAt10Pts: 0.80,
    oddsAt15Pts: 0.98, oddsAt20Pts: 0.99,
    notes: 'Good odds with 5+ points in many units. Roosevelt and Rocky Mountain elk available.',
    difficulty: 'moderate',
  },
  {
    stateId: 'wa', stateName: 'Washington', species: 'elk', seasonType: 'any',
    appOpenMonth: 2, appCloseMonth: 3, appCloseDay: 1,
    feeNonresident: 13, feeResident: 8,
    pointSystem: 'preference', maxPointsEst: 12, nrQuotaPct: 16,
    hasOTC: true, oddsAtZeroPts: 0.20, oddsAt5Pts: 0.60, oddsAt10Pts: 0.95,
    oddsAt15Pts: 0.99, oddsAt20Pts: 0.99,
    notes: 'Some OTC archery options. Roosevelt elk on coast, Rocky Mountain inland. Good for residents.',
    difficulty: 'moderate',
  },
  {
    stateId: 'sd', stateName: 'South Dakota', species: 'elk', seasonType: 'any',
    appOpenMonth: 12, appCloseMonth: 2, appCloseDay: 1,
    feeNonresident: 20, feeResident: 10,
    pointSystem: 'none', maxPointsEst: 0, nrQuotaPct: 20,
    hasOTC: false, oddsAtZeroPts: 0.25, oddsAt5Pts: 0.25, oddsAt10Pts: 0.25,
    oddsAt15Pts: 0.25, oddsAt20Pts: 0.25,
    notes: 'Pure random lottery. Black Hills elk herd. Growing opportunity, underrated destination.',
    difficulty: 'moderate',
  },

  // ─── MULE DEER ─────────────────────────────────────────────────────────────
  {
    stateId: 'co', stateName: 'Colorado', species: 'mule_deer', seasonType: 'archery',
    appOpenMonth: 3, appCloseMonth: 4, appCloseDay: 1,
    feeNonresident: 63, feeResident: 8,
    pointSystem: 'preference', maxPointsEst: 25, nrQuotaPct: 20,
    hasOTC: true, oddsAtZeroPts: 0.80, oddsAt5Pts: 0.90, oddsAt10Pts: 0.98,
    oddsAt15Pts: 0.99, oddsAt20Pts: 0.99,
    notes: 'OTC archery available in many units. Premium units (GMU 2, 10, 201) require many points.',
    difficulty: 'easy',
  },
  {
    stateId: 'wy', stateName: 'Wyoming', species: 'mule_deer', seasonType: 'any',
    appOpenMonth: 1, appCloseMonth: 5, appCloseDay: 31,
    feeNonresident: 15, feeResident: 15,
    pointSystem: 'preference', maxPointsEst: 22, nrQuotaPct: 16,
    hasOTC: false, oddsAtZeroPts: 0.10, oddsAt5Pts: 0.35, oddsAt10Pts: 0.70,
    oddsAt15Pts: 0.92, oddsAt20Pts: 0.99,
    notes: 'Desert and mountain mule deer. Some areas have decent odds at 5-7 points.',
    difficulty: 'moderate',
  },
  {
    stateId: 'ut', stateName: 'Utah', species: 'mule_deer', seasonType: 'any',
    appOpenMonth: 2, appCloseMonth: 3, appCloseDay: 1,
    feeNonresident: 10, feeResident: 10,
    pointSystem: 'weighted', maxPointsEst: 25, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.03, oddsAt5Pts: 0.12, oddsAt10Pts: 0.30,
    oddsAt15Pts: 0.60, oddsAt20Pts: 0.90,
    notes: 'Trophy potential is exceptional but NR quota is tiny. 10-15+ year commitment for best units.',
    difficulty: 'very_hard',
  },
  {
    stateId: 'nv', stateName: 'Nevada', species: 'mule_deer', seasonType: 'any',
    appOpenMonth: 12, appCloseMonth: 2, appCloseDay: 15,
    feeNonresident: 10, feeResident: 10,
    pointSystem: 'bonus', maxPointsEst: 18, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.03, oddsAt5Pts: 0.10, oddsAt10Pts: 0.25,
    oddsAt15Pts: 0.55, oddsAt20Pts: 0.85,
    notes: 'Some of the best desert mule deer in North America. Low odds but worth applying annually.',
    difficulty: 'hard',
  },
  {
    stateId: 'az', stateName: 'Arizona', species: 'mule_deer', seasonType: 'any',
    appOpenMonth: 1, appCloseMonth: 2, appCloseDay: 12,
    feeNonresident: 13, feeResident: 13,
    pointSystem: 'bonus', maxPointsEst: 20, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.02, oddsAt5Pts: 0.08, oddsAt10Pts: 0.20,
    oddsAt15Pts: 0.45, oddsAt20Pts: 0.80,
    notes: 'Desert mule deer in units 13A, 22 are world-class. Very patient hunters only.',
    difficulty: 'very_hard',
  },
  {
    stateId: 'id', stateName: 'Idaho', species: 'mule_deer', seasonType: 'any',
    appOpenMonth: 12, appCloseMonth: 3, appCloseDay: 15,
    feeNonresident: 18, feeResident: 13,
    pointSystem: 'preference', maxPointsEst: 12, nrQuotaPct: 10,
    hasOTC: true, oddsAtZeroPts: 0.60, oddsAt5Pts: 0.85, oddsAt10Pts: 0.99,
    oddsAt15Pts: 0.99, oddsAt20Pts: 0.99,
    notes: 'Good general season options. Some OTC zones. Less pressure than CO/UT.',
    difficulty: 'easy',
  },
  {
    stateId: 'mt', stateName: 'Montana', species: 'mule_deer', seasonType: 'any',
    appOpenMonth: 5, appCloseMonth: 6, appCloseDay: 1,
    feeNonresident: 20, feeResident: 10,
    pointSystem: 'none', maxPointsEst: 0, nrQuotaPct: 10,
    hasOTC: true, oddsAtZeroPts: 0.50, oddsAt5Pts: 0.50, oddsAt10Pts: 0.50,
    oddsAt15Pts: 0.50, oddsAt20Pts: 0.50,
    notes: 'General OTC B license. Eastern Montana has excellent mule deer with lower pressure.',
    difficulty: 'easy',
  },
  {
    stateId: 'nm', stateName: 'New Mexico', species: 'mule_deer', seasonType: 'any',
    appOpenMonth: 1, appCloseMonth: 3, appCloseDay: 20,
    feeNonresident: 15, feeResident: 15,
    pointSystem: 'preference', maxPointsEst: 18, nrQuotaPct: 6,
    hasOTC: false, oddsAtZeroPts: 0.03, oddsAt5Pts: 0.12, oddsAt10Pts: 0.35,
    oddsAt15Pts: 0.70, oddsAt20Pts: 0.99,
    notes: 'Trophy quality high. Very low NR quota makes this a long-term play.',
    difficulty: 'hard',
  },

  // ─── PRONGHORN ─────────────────────────────────────────────────────────────
  {
    stateId: 'wy', stateName: 'Wyoming', species: 'pronghorn', seasonType: 'any',
    appOpenMonth: 1, appCloseMonth: 5, appCloseDay: 31,
    feeNonresident: 15, feeResident: 15,
    pointSystem: 'preference', maxPointsEst: 15, nrQuotaPct: 20,
    hasOTC: false, oddsAtZeroPts: 0.25, oddsAt5Pts: 0.65, oddsAt10Pts: 0.92,
    oddsAt15Pts: 0.99, oddsAt20Pts: 0.99,
    notes: 'Best pronghorn state in the country. Many units draw in 1-3 years. Excellent hunting.',
    difficulty: 'moderate',
  },
  {
    stateId: 'co', stateName: 'Colorado', species: 'pronghorn', seasonType: 'any',
    appOpenMonth: 3, appCloseMonth: 4, appCloseDay: 1,
    feeNonresident: 63, feeResident: 8,
    pointSystem: 'preference', maxPointsEst: 12, nrQuotaPct: 20,
    hasOTC: false, oddsAtZeroPts: 0.30, oddsAt5Pts: 0.70, oddsAt10Pts: 0.99,
    oddsAt15Pts: 0.99, oddsAt20Pts: 0.99,
    notes: 'Eastern plains units draw quickly. Great starter pronghorn state.',
    difficulty: 'moderate',
  },
  {
    stateId: 'mt', stateName: 'Montana', species: 'pronghorn', seasonType: 'any',
    appOpenMonth: 5, appCloseMonth: 6, appCloseDay: 1,
    feeNonresident: 20, feeResident: 10,
    pointSystem: 'none', maxPointsEst: 0, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.40, oddsAt5Pts: 0.40, oddsAt10Pts: 0.40,
    oddsAt15Pts: 0.40, oddsAt20Pts: 0.40,
    notes: 'Random lottery. Eastern Montana units. Good odds overall.',
    difficulty: 'moderate',
  },
  {
    stateId: 'az', stateName: 'Arizona', species: 'pronghorn', seasonType: 'any',
    appOpenMonth: 1, appCloseMonth: 2, appCloseDay: 12,
    feeNonresident: 13, feeResident: 13,
    pointSystem: 'bonus', maxPointsEst: 18, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.03, oddsAt5Pts: 0.10, oddsAt10Pts: 0.30,
    oddsAt15Pts: 0.65, oddsAt20Pts: 0.95,
    notes: 'Trophy pronghorn. Long wait but world-class animals in Unitah area.',
    difficulty: 'very_hard',
  },
  {
    stateId: 'nv', stateName: 'Nevada', species: 'pronghorn', seasonType: 'any',
    appOpenMonth: 12, appCloseMonth: 2, appCloseDay: 15,
    feeNonresident: 10, feeResident: 10,
    pointSystem: 'bonus', maxPointsEst: 14, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.05, oddsAt5Pts: 0.18, oddsAt10Pts: 0.45,
    oddsAt15Pts: 0.80, oddsAt20Pts: 0.99,
    notes: 'Good trophy quality. Worth stacking bonus points annually.',
    difficulty: 'hard',
  },

  // ─── BIGHORN SHEEP ─────────────────────────────────────────────────────────
  {
    stateId: 'co', stateName: 'Colorado', species: 'bighorn_sheep', seasonType: 'any',
    appOpenMonth: 3, appCloseMonth: 4, appCloseDay: 1,
    feeNonresident: 63, feeResident: 8,
    pointSystem: 'preference', maxPointsEst: 30, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.005, oddsAt5Pts: 0.01, oddsAt10Pts: 0.05,
    oddsAt15Pts: 0.15, oddsAt20Pts: 0.35,
    notes: '20-30 year average wait. Apply every year without fail. The lifetime bucket-list hunt.',
    difficulty: 'nearly_impossible',
  },
  {
    stateId: 'wy', stateName: 'Wyoming', species: 'bighorn_sheep', seasonType: 'any',
    appOpenMonth: 1, appCloseMonth: 5, appCloseDay: 31,
    feeNonresident: 15, feeResident: 15,
    pointSystem: 'preference', maxPointsEst: 28, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.005, oddsAt5Pts: 0.01, oddsAt10Pts: 0.04,
    oddsAt15Pts: 0.12, oddsAt20Pts: 0.30,
    notes: 'Apply every year. Expect 20-25 year wait. Pinnacle of western hunting.',
    difficulty: 'nearly_impossible',
  },
  {
    stateId: 'mt', stateName: 'Montana', species: 'bighorn_sheep', seasonType: 'any',
    appOpenMonth: 5, appCloseMonth: 6, appCloseDay: 1,
    feeNonresident: 20, feeResident: 10,
    pointSystem: 'none', maxPointsEst: 0, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.003, oddsAt5Pts: 0.003, oddsAt10Pts: 0.003,
    oddsAt15Pts: 0.003, oddsAt20Pts: 0.003,
    notes: 'Pure lottery. ~300:1 odds or worse. Apply as a lottery ticket — no points accumulate.',
    difficulty: 'nearly_impossible',
  },
  {
    stateId: 'az', stateName: 'Arizona', species: 'bighorn_sheep', seasonType: 'any',
    appOpenMonth: 1, appCloseMonth: 2, appCloseDay: 12,
    feeNonresident: 13, feeResident: 13,
    pointSystem: 'bonus', maxPointsEst: 25, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.003, oddsAt5Pts: 0.01, oddsAt10Pts: 0.04,
    oddsAt15Pts: 0.15, oddsAt20Pts: 0.40,
    notes: 'Desert bighorn. Best trophy quality in North America. 20+ year commitment.',
    difficulty: 'nearly_impossible',
  },
  {
    stateId: 'nv', stateName: 'Nevada', species: 'bighorn_sheep', seasonType: 'any',
    appOpenMonth: 12, appCloseMonth: 2, appCloseDay: 15,
    feeNonresident: 10, feeResident: 10,
    pointSystem: 'bonus', maxPointsEst: 22, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.003, oddsAt5Pts: 0.008, oddsAt10Pts: 0.03,
    oddsAt15Pts: 0.12, oddsAt20Pts: 0.35,
    notes: 'Apply for bonus points annually. Very long wait but Nevada desert rams are exceptional.',
    difficulty: 'nearly_impossible',
  },
  {
    stateId: 'nm', stateName: 'New Mexico', species: 'bighorn_sheep', seasonType: 'any',
    appOpenMonth: 1, appCloseMonth: 3, appCloseDay: 20,
    feeNonresident: 15, feeResident: 15,
    pointSystem: 'preference', maxPointsEst: 25, nrQuotaPct: 6,
    hasOTC: false, oddsAtZeroPts: 0.003, oddsAt5Pts: 0.008, oddsAt10Pts: 0.025,
    oddsAt15Pts: 0.10, oddsAt20Pts: 0.30,
    notes: 'Very few NR tags. Apply annually for preference points. 20+ years expected.',
    difficulty: 'nearly_impossible',
  },

  // ─── MOOSE ─────────────────────────────────────────────────────────────────
  {
    stateId: 'wy', stateName: 'Wyoming', species: 'moose', seasonType: 'any',
    appOpenMonth: 1, appCloseMonth: 5, appCloseDay: 31,
    feeNonresident: 15, feeResident: 15,
    pointSystem: 'preference', maxPointsEst: 25, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.01, oddsAt5Pts: 0.03, oddsAt10Pts: 0.10,
    oddsAt15Pts: 0.30, oddsAt20Pts: 0.65,
    notes: 'Wyoming has excellent Shiras moose. Expect 15-20 year wait for top units.',
    difficulty: 'nearly_impossible',
  },
  {
    stateId: 'mt', stateName: 'Montana', species: 'moose', seasonType: 'any',
    appOpenMonth: 5, appCloseMonth: 6, appCloseDay: 1,
    feeNonresident: 20, feeResident: 10,
    pointSystem: 'none', maxPointsEst: 0, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.01, oddsAt5Pts: 0.01, oddsAt10Pts: 0.01,
    oddsAt15Pts: 0.01, oddsAt20Pts: 0.01,
    notes: 'Pure random lottery. Very few tags. Apply every year — no point accumulation.',
    difficulty: 'nearly_impossible',
  },
  {
    stateId: 'id', stateName: 'Idaho', species: 'moose', seasonType: 'any',
    appOpenMonth: 12, appCloseMonth: 3, appCloseDay: 15,
    feeNonresident: 18, feeResident: 13,
    pointSystem: 'preference', maxPointsEst: 20, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.01, oddsAt5Pts: 0.04, oddsAt10Pts: 0.15,
    oddsAt15Pts: 0.40, oddsAt20Pts: 0.80,
    notes: 'North Idaho and Selway units have good moose. Long wait but fewer applicants than WY.',
    difficulty: 'nearly_impossible',
  },
  {
    stateId: 'ut', stateName: 'Utah', species: 'moose', seasonType: 'any',
    appOpenMonth: 2, appCloseMonth: 3, appCloseDay: 1,
    feeNonresident: 10, feeResident: 10,
    pointSystem: 'weighted', maxPointsEst: 22, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.005, oddsAt5Pts: 0.02, oddsAt10Pts: 0.08,
    oddsAt15Pts: 0.25, oddsAt20Pts: 0.60,
    notes: 'Shiras moose with good trophy quality. Weighted system helps long-term applicants.',
    difficulty: 'nearly_impossible',
  },

  // ─── MOUNTAIN GOAT ─────────────────────────────────────────────────────────
  {
    stateId: 'co', stateName: 'Colorado', species: 'mountain_goat', seasonType: 'any',
    appOpenMonth: 3, appCloseMonth: 4, appCloseDay: 1,
    feeNonresident: 63, feeResident: 8,
    pointSystem: 'preference', maxPointsEst: 30, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.003, oddsAt5Pts: 0.008, oddsAt10Pts: 0.02,
    oddsAt15Pts: 0.08, oddsAt20Pts: 0.25,
    notes: 'The ultimate mountain hunt. 20-30 year wait is realistic. Apply from day one.',
    difficulty: 'nearly_impossible',
  },
  {
    stateId: 'wy', stateName: 'Wyoming', species: 'mountain_goat', seasonType: 'any',
    appOpenMonth: 1, appCloseMonth: 5, appCloseDay: 31,
    feeNonresident: 15, feeResident: 15,
    pointSystem: 'preference', maxPointsEst: 28, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.003, oddsAt5Pts: 0.008, oddsAt10Pts: 0.025,
    oddsAt15Pts: 0.08, oddsAt20Pts: 0.25,
    notes: 'Apply annually. Wind Rivers and Absaroka Range. Exceptionally difficult tag to draw.',
    difficulty: 'nearly_impossible',
  },
  {
    stateId: 'mt', stateName: 'Montana', species: 'mountain_goat', seasonType: 'any',
    appOpenMonth: 5, appCloseMonth: 6, appCloseDay: 1,
    feeNonresident: 20, feeResident: 10,
    pointSystem: 'none', maxPointsEst: 0, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.005, oddsAt5Pts: 0.005, oddsAt10Pts: 0.005,
    oddsAt15Pts: 0.005, oddsAt20Pts: 0.005,
    notes: 'Pure lottery. Only a handful of NR tags issued annually.',
    difficulty: 'nearly_impossible',
  },
  {
    stateId: 'id', stateName: 'Idaho', species: 'mountain_goat', seasonType: 'any',
    appOpenMonth: 12, appCloseMonth: 3, appCloseDay: 15,
    feeNonresident: 18, feeResident: 13,
    pointSystem: 'preference', maxPointsEst: 22, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.004, oddsAt5Pts: 0.01, oddsAt10Pts: 0.04,
    oddsAt15Pts: 0.15, oddsAt20Pts: 0.50,
    notes: 'Apply annually. Selway-Bitterroot unit is spectacular.',
    difficulty: 'nearly_impossible',
  },

  // ─── BLACK BEAR ────────────────────────────────────────────────────────────
  {
    stateId: 'mt', stateName: 'Montana', species: 'black_bear', seasonType: 'any',
    appOpenMonth: 5, appCloseMonth: 6, appCloseDay: 1,
    feeNonresident: 20, feeResident: 10,
    pointSystem: 'none', maxPointsEst: 0, nrQuotaPct: 20,
    hasOTC: true, oddsAtZeroPts: 0.99, oddsAt5Pts: 0.99, oddsAt10Pts: 0.99,
    oddsAt15Pts: 0.99, oddsAt20Pts: 0.99,
    notes: 'OTC spring and fall bear. Excellent hunting, good populations. Easiest western bear state.',
    difficulty: 'easy',
  },
  {
    stateId: 'id', stateName: 'Idaho', species: 'black_bear', seasonType: 'any',
    appOpenMonth: 1, appCloseMonth: 3, appCloseDay: 31,
    feeNonresident: 18, feeResident: 13,
    pointSystem: 'none', maxPointsEst: 0, nrQuotaPct: 20,
    hasOTC: true, oddsAtZeroPts: 0.99, oddsAt5Pts: 0.99, oddsAt10Pts: 0.99,
    oddsAt15Pts: 0.99, oddsAt20Pts: 0.99,
    notes: 'OTC tag, spring and fall seasons. One of the best black bear states in the west.',
    difficulty: 'easy',
  },
  {
    stateId: 'or', stateName: 'Oregon', species: 'black_bear', seasonType: 'any',
    appOpenMonth: 12, appCloseMonth: 1, appCloseDay: 15,
    feeNonresident: 9, feeResident: 9,
    pointSystem: 'none', maxPointsEst: 0, nrQuotaPct: 20,
    hasOTC: true, oddsAtZeroPts: 0.99, oddsAt5Pts: 0.99, oddsAt10Pts: 0.99,
    oddsAt15Pts: 0.99, oddsAt20Pts: 0.99,
    notes: 'OTC bear tag. Coastal and Cascade Range populations. Good hunting.',
    difficulty: 'easy',
  },
  {
    stateId: 'co', stateName: 'Colorado', species: 'black_bear', seasonType: 'any',
    appOpenMonth: 3, appCloseMonth: 4, appCloseDay: 1,
    feeNonresident: 63, feeResident: 8,
    pointSystem: 'none', maxPointsEst: 0, nrQuotaPct: 20,
    hasOTC: true, oddsAtZeroPts: 0.99, oddsAt5Pts: 0.99, oddsAt10Pts: 0.99,
    oddsAt15Pts: 0.99, oddsAt20Pts: 0.99,
    notes: 'OTC bear license. One of the largest black bear populations in the US. Good combo hunt with elk/deer.',
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

  // ─── BISON ─────────────────────────────────────────────────────────────────
  {
    stateId: 'mt', stateName: 'Montana', species: 'bison', seasonType: 'any',
    appOpenMonth: 5, appCloseMonth: 6, appCloseDay: 1,
    feeNonresident: 20, feeResident: 10,
    pointSystem: 'none', maxPointsEst: 0, nrQuotaPct: 5,
    hasOTC: false, oddsAtZeroPts: 0.002, oddsAt5Pts: 0.002, oddsAt10Pts: 0.002,
    oddsAt15Pts: 0.002, oddsAt20Pts: 0.002,
    notes: 'Extremely rare. Yellowstone border hunt. Apply every year as a lottery ticket.',
    difficulty: 'nearly_impossible',
  },
  {
    stateId: 'ut', stateName: 'Utah', species: 'bison', seasonType: 'any',
    appOpenMonth: 2, appCloseMonth: 3, appCloseDay: 1,
    feeNonresident: 10, feeResident: 10,
    pointSystem: 'weighted', maxPointsEst: 25, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.002, oddsAt5Pts: 0.005, oddsAt10Pts: 0.02,
    oddsAt15Pts: 0.08, oddsAt20Pts: 0.25,
    notes: 'Henry Mountains and Antelope Island herds. Very few tags. Bucket list hunt.',
    difficulty: 'nearly_impossible',
  },
  {
    stateId: 'az', stateName: 'Arizona', species: 'bison', seasonType: 'any',
    appOpenMonth: 1, appCloseMonth: 2, appCloseDay: 12,
    feeNonresident: 13, feeResident: 13,
    pointSystem: 'bonus', maxPointsEst: 20, nrQuotaPct: 10,
    hasOTC: false, oddsAtZeroPts: 0.002, oddsAt5Pts: 0.005, oddsAt10Pts: 0.02,
    oddsAt15Pts: 0.08, oddsAt20Pts: 0.30,
    notes: 'House Rock Valley and Raymond herd. Grand Canyon bison. Exceptional rarity.',
    difficulty: 'nearly_impossible',
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
