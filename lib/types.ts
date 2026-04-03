export type SpeciesKey =
  | 'elk'
  | 'mule_deer'
  | 'whitetail'
  | 'pronghorn'
  | 'bighorn_sheep'
  | 'mountain_goat'
  | 'moose'
  | 'black_bear'
  | 'mountain_lion'
  | 'bison';

export type HuntType = 'archery' | 'rifle' | 'muzzleloader' | 'any';

export type Goal =
  | 'hunt_often'
  | 'one_trophy'
  | 'balance';

export type PlanningYears = 5 | 10 | 15;

export type PointSystem =
  | 'preference'
  | 'bonus'
  | 'weighted'
  | 'lottery'
  | 'otc'
  | 'none';

export type Difficulty =
  | 'easy'
  | 'moderate'
  | 'hard'
  | 'very_hard'
  | 'nearly_impossible';

export interface StateSeasonData {
  stateId: string;
  stateName: string;
  species: SpeciesKey;
  seasonType: string;
  appOpenMonth: number;
  appCloseMonth: number;
  appCloseDay: number;
  feeNonresident: number;
  feeResident: number;
  pointSystem: PointSystem;
  maxPointsEst: number;
  nrQuotaPct: number;
  hasOTC: boolean;
  oddsAtZeroPts: number;
  oddsAt5Pts: number;
  oddsAt10Pts: number;
  oddsAt15Pts: number;
  oddsAt20Pts: number;
  notes: string;
  difficulty: Difficulty;
}

export interface StatePoints {
  [stateId: string]: number;
}

export interface HunterProfile {
  species: SpeciesKey[];
  huntType: HuntType;
  residency: string;
  budget: number;
  goal: Goal;
  planningYears: PlanningYears;
  pointsByState: StatePoints;
}
