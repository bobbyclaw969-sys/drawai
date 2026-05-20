/**
 * Multi-state preference-point portfolio optimizer.
 *
 * Given a user's current point balances and budget, computes the expected
 * value of every (state, species, season) entry over a planning horizon
 * and ranks them by EV-per-dollar. Returns:
 *   - "apply this year" picks (highest EV/$ within budget),
 *   - "build points" picks (high EV but blocked by point gap),
 *   - "skip" picks (low EV / cost too high for the value).
 *
 * Pure math, no LLM. The defensive moat is the data (multi-year odds
 * curves per state-species pair) and the multi-year point-velocity
 * projection — neither replicable without years of regulatory ingestion.
 */
import type { StateSeasonData, SpeciesKey, PointSystem, Difficulty } from "./types";

export interface PointInput {
  /** "state:species" key, e.g. "wy:elk". */
  key: string;
  stateId: string;
  species: SpeciesKey;
  points: number;
}

export interface OptimizerInput {
  /** Map of state:species → current points held. Missing entries treated as 0 pts. */
  points: Record<string, number>;
  /** Hunter's residency state — affects fee selection. */
  residency: string;
  /** Annual application budget in USD. Greedy picks stop when budget hits. */
  budget: number;
  /** Years to plan over (5/10/15 typical). */
  horizonYears: number;
  /** Optional species filter — empty = all species the user has data for. */
  speciesFilter?: SpeciesKey[];
  /** Optional state filter — empty = all states with data. */
  stateFilter?: string[];
  /** Hunter's preference goal — shifts trophy-vs-frequency weighting. */
  goal?: "hunt_often" | "one_trophy" | "balance";
}

export interface OptimizerPick {
  key: string;
  stateId: string;
  stateName: string;
  species: SpeciesKey;
  seasonType: string;
  pointSystem: PointSystem;
  difficulty: Difficulty;
  /** Points the user currently holds for this combo. */
  currentPoints: number;
  /** Annual fee in USD (residency-aware). */
  annualCost: number;
  /** Probability of drawing in year 1 at current points. */
  yearOneOdds: number;
  /** Expected number of years until first draw (capped at horizon+1). */
  expectedYearsToDraw: number;
  /** Probability of drawing at least once over the horizon. */
  cumulativeDrawProb: number;
  /** Hunt value (utility points, scales with difficulty). */
  huntValue: number;
  /** Total expected cost if you apply every year over the horizon. */
  totalExpectedCost: number;
  /** Expected value over horizon (huntValue * cumProb - expectedCost). */
  expectedValue: number;
  /** EV per dollar — primary ranking signal. */
  evPerDollar: number;
  /** Recommendation bucket. */
  bucket: "apply" | "build" | "skip";
  /** Human-readable rationale. */
  rationale: string;
}

export interface OptimizerResult {
  picks: OptimizerPick[];
  /** Picks selected for this year's budget (greedy by EV/$). */
  applyNow: OptimizerPick[];
  /** Long-term build-points picks (high EV but high point gap). */
  buildPoints: OptimizerPick[];
  /** Skipped (low EV or bad fit). */
  skip: OptimizerPick[];
  /** Total annual cost of applyNow picks. */
  annualSpend: number;
  /** Total expected value of applyNow picks over horizon. */
  totalExpectedValue: number;
}

/**
 * Linearly interpolate draw odds at an arbitrary point balance using the
 * record's 0/5/10/15/20 anchor points. Caps at 20 pts (the highest anchor).
 */
export function interpolateOdds(rec: StateSeasonData, points: number): number {
  const pts = Math.max(0, Math.min(points, 20));
  const anchors: [number, number][] = [
    [0, rec.oddsAtZeroPts],
    [5, rec.oddsAt5Pts],
    [10, rec.oddsAt10Pts],
    [15, rec.oddsAt15Pts],
    [20, rec.oddsAt20Pts],
  ];
  for (let i = 0; i < anchors.length - 1; i++) {
    const [x0, y0] = anchors[i];
    const [x1, y1] = anchors[i + 1];
    if (pts >= x0 && pts <= x1) {
      if (x1 === x0) return y0;
      const t = (pts - x0) / (x1 - x0);
      return y0 + (y1 - y0) * t;
    }
  }
  return anchors[anchors.length - 1][1];
}

/**
 * For preference-point states, accumulating one point per year of no-draw
 * makes the odds rise predictably. For pure-lottery and OTC states the
 * "next-year odds" don't shift. This helper returns true if the state
 * has a meaningful point-velocity.
 */
export function hasPointVelocity(system: PointSystem): boolean {
  return system === "preference" || system === "weighted" || system === "bonus";
}

/** Hunt-value weight per difficulty tier — trophy hunts worth multiples of common ones. */
function difficultyToHuntValue(d: Difficulty, goal: OptimizerInput["goal"] = "balance"): number {
  const base: Record<Difficulty, number> = {
    easy: 1,
    moderate: 3,
    hard: 8,
    very_hard: 25,
    nearly_impossible: 100,
  };
  const v = base[d];
  // Goal shifts: trophy hunters weight rare hunts higher; volume hunters discount.
  if (goal === "one_trophy") {
    if (d === "very_hard" || d === "nearly_impossible") return v * 1.5;
    if (d === "easy") return v * 0.5;
  }
  if (goal === "hunt_often") {
    if (d === "easy" || d === "moderate") return v * 1.5;
    if (d === "very_hard" || d === "nearly_impossible") return v * 0.5;
  }
  return v;
}

/**
 * Project the probability of drawing at least once over `horizonYears`,
 * assuming the hunter applies every year and (for pref-point states)
 * accrues one point per missed year.
 *
 * Returns { cumulativeProb, expectedYearsToDraw, yearOneOdds }.
 */
export function projectDrawProb(
  rec: StateSeasonData,
  currentPoints: number,
  horizonYears: number,
): { cumulativeProb: number; expectedYearsToDraw: number; yearOneOdds: number } {
  const velocity = hasPointVelocity(rec.pointSystem) ? 1 : 0;
  let pNoDrawYet = 1;
  let evSum = 0;
  let yearOneOdds = 0;

  for (let year = 1; year <= horizonYears; year++) {
    const ptsThisYear = currentPoints + velocity * (year - 1);
    const pDrawThisYear = interpolateOdds(rec, ptsThisYear);
    if (year === 1) yearOneOdds = pDrawThisYear;
    const pFirstDrawThisYear = pNoDrawYet * pDrawThisYear;
    evSum += year * pFirstDrawThisYear;
    pNoDrawYet *= 1 - pDrawThisYear;
  }
  const cumulativeProb = 1 - pNoDrawYet;
  // If they never draw within horizon, add a "horizon+1" penalty term.
  evSum += (horizonYears + 1) * pNoDrawYet;
  return { cumulativeProb, expectedYearsToDraw: evSum, yearOneOdds };
}

/** Run the optimizer over a complete dataset. */
export function runOptimizer(
  dataset: StateSeasonData[],
  input: OptimizerInput,
): OptimizerResult {
  const horizonYears = Math.max(1, Math.min(input.horizonYears, 30));
  const residencyState = input.residency?.toUpperCase() ?? "";
  const speciesAllowed = new Set(input.speciesFilter ?? []);
  const stateAllowed = new Set((input.stateFilter ?? []).map(s => s.toLowerCase()));

  const picks: OptimizerPick[] = [];

  for (const rec of dataset) {
    if (speciesAllowed.size > 0 && !speciesAllowed.has(rec.species)) continue;
    if (stateAllowed.size > 0 && !stateAllowed.has(rec.stateId.toLowerCase())) continue;

    const isResident = rec.stateId.toUpperCase() === residencyState;
    const annualCost = isResident ? rec.feeResident : rec.feeNonresident;
    if (!annualCost || annualCost <= 0) continue;

    const key = `${rec.stateId}:${rec.species}:${rec.seasonType}`;
    const pointsKey = `${rec.stateId}:${rec.species}`.toLowerCase();
    const currentPoints = input.points[pointsKey] ?? input.points[key] ?? 0;

    const { cumulativeProb, expectedYearsToDraw, yearOneOdds } = projectDrawProb(
      rec,
      currentPoints,
      horizonYears,
    );

    const huntValue = difficultyToHuntValue(rec.difficulty, input.goal);
    // Total expected cost: apply every year, but stop once you draw.
    // Approximated as annualCost × expected-years-to-draw.
    const totalExpectedCost = annualCost * Math.min(expectedYearsToDraw, horizonYears);
    // EV in arbitrary "hunt-value units" — relative scale; we use it for ranking only.
    // We translate to dollars by treating 1 hunt-value unit ≈ $1,000 of utility,
    // calibrated so that a moderate hunt (value=3) at typical cost is around break-even
    // and a trophy hunt (value=25) is clearly positive EV. This is for ranking only —
    // never displayed to the user as a dollar figure.
    const HUNT_VALUE_TO_USD = 1000;
    const expectedValue = huntValue * cumulativeProb * HUNT_VALUE_TO_USD - totalExpectedCost;
    const evPerDollar = totalExpectedCost > 0 ? expectedValue / totalExpectedCost : 0;

    let bucket: "apply" | "build" | "skip";
    let rationale: string;

    if (yearOneOdds >= 0.20 && evPerDollar > 0) {
      bucket = "apply";
      rationale = `${Math.round(yearOneOdds * 100)}% draw odds this year at your current ${currentPoints} pts — apply.`;
    } else if (
      cumulativeProb >= 0.40 &&
      hasPointVelocity(rec.pointSystem) &&
      currentPoints < rec.maxPointsEst
    ) {
      bucket = "build";
      rationale = `Build points: ${Math.round(cumulativeProb * 100)}% draw odds within ${horizonYears} years, expected draw year ${Math.ceil(expectedYearsToDraw)}.`;
    } else if (evPerDollar < -0.5) {
      bucket = "skip";
      rationale = `Too expensive for the value — only ${Math.round(yearOneOdds * 100)}% odds at $${annualCost}/yr.`;
    } else if (cumulativeProb < 0.1) {
      bucket = "skip";
      rationale = `Less than 10% chance of drawing in ${horizonYears} years — skip unless it's a trophy bucket-list state.`;
    } else {
      bucket = "build";
      rationale = `Moderate odds. ${Math.round(cumulativeProb * 100)}% chance over ${horizonYears} yrs.`;
    }

    picks.push({
      key,
      stateId: rec.stateId,
      stateName: rec.stateName,
      species: rec.species,
      seasonType: rec.seasonType,
      pointSystem: rec.pointSystem,
      difficulty: rec.difficulty,
      currentPoints,
      annualCost,
      yearOneOdds,
      expectedYearsToDraw,
      cumulativeDrawProb: cumulativeProb,
      huntValue,
      totalExpectedCost,
      expectedValue,
      evPerDollar,
      bucket,
      rationale,
    });
  }

  picks.sort((a, b) => b.evPerDollar - a.evPerDollar);

  // Greedy budget pack — only "apply" bucket competes for this year's dollars.
  const applyCandidates = picks.filter(p => p.bucket === "apply");
  const applyNow: OptimizerPick[] = [];
  let remaining = input.budget;
  for (const p of applyCandidates) {
    if (p.annualCost <= remaining) {
      applyNow.push(p);
      remaining -= p.annualCost;
    }
  }
  const buildPoints = picks
    .filter(p => p.bucket === "build")
    .sort((a, b) => b.cumulativeDrawProb - a.cumulativeDrawProb);
  const skip = picks.filter(p => p.bucket === "skip");
  const annualSpend = applyNow.reduce((sum, p) => sum + p.annualCost, 0);
  const totalExpectedValue = applyNow.reduce((sum, p) => sum + p.expectedValue, 0);

  return {
    picks,
    applyNow,
    buildPoints,
    skip,
    annualSpend,
    totalExpectedValue,
  };
}
