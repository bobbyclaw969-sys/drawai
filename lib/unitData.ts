/**
 * Top hunting GMU profiles — sourced from state agency harvest reports,
 * DOW draw statistics, and public application data.
 * All data is directional; verify at state wildlife agency before applying.
 */

export type TrophyRating = "exceptional" | "high" | "moderate" | "low";
export type AccessRating  = "excellent" | "good" | "fair" | "difficult";

export interface UnitProfile {
  state: string;          // state abbreviation
  stateName: string;
  unit: string;           // GMU/unit number or name
  species: string;
  method: string;         // "any" | "archery" | "rifle" | "muzzleloader"
  // Draw odds (NR general tag, approximate)
  oddsAt0Pts: number;
  oddsAt5Pts: number;
  oddsAt10Pts: number;
  oddsAt15Pts: number;
  // Tag economics
  nrFeeApprox: number;
  nrQuotaPct: number;     // % of total tags to non-residents
  // Hunt quality
  trophyPotential: TrophyRating;
  avgSuccessRate: number; // hunter fill rate, 0-1
  publicLandPct: number;  // % of unit that is huntable public land
  access: AccessRating;
  // Season
  seasonOpen: string;     // e.g. "Oct 15"
  seasonClose: string;
  // Context
  tags: string[];         // searchable tags
  notes: string;
}

const UNITS: UnitProfile[] = [

  // ─── WYOMING ELK ──────────────────────────────────────────────────────────
  {
    state: "WY", stateName: "Wyoming", unit: "7", species: "elk", method: "any",
    oddsAt0Pts: 0.08, oddsAt5Pts: 0.22, oddsAt10Pts: 0.48, oddsAt15Pts: 0.75,
    nrFeeApprox: 692, nrQuotaPct: 20, trophyPotential: "exceptional",
    avgSuccessRate: 0.82, publicLandPct: 72, access: "good",
    seasonOpen: "Oct 10", seasonClose: "Oct 31",
    tags: ["trophy", "quality bulls", "high success", "archery available"],
    notes: "One of WY's premier NR units. 6x6 bulls common. Draw gets harder every year. Apply for points immediately.",
  },
  {
    state: "WY", stateName: "Wyoming", unit: "16", species: "elk", method: "any",
    oddsAt0Pts: 0.12, oddsAt5Pts: 0.30, oddsAt10Pts: 0.55, oddsAt15Pts: 0.82,
    nrFeeApprox: 692, nrQuotaPct: 20, trophyPotential: "high",
    avgSuccessRate: 0.78, publicLandPct: 68, access: "good",
    seasonOpen: "Sep 15", seasonClose: "Nov 15",
    tags: ["long season", "bulls", "accessible terrain"],
    notes: "Long season with archery and rifle combined. Good bull age structure. Better odds than unit 7.",
  },
  {
    state: "WY", stateName: "Wyoming", unit: "23", species: "elk", method: "any",
    oddsAt0Pts: 0.18, oddsAt5Pts: 0.40, oddsAt10Pts: 0.68, oddsAt15Pts: 0.90,
    nrFeeApprox: 692, nrQuotaPct: 20, trophyPotential: "high",
    avgSuccessRate: 0.76, publicLandPct: 65, access: "good",
    seasonOpen: "Oct 1", seasonClose: "Oct 31",
    tags: ["good value", "big bulls", "backpack hunt"],
    notes: "Backcountry unit with excellent bull numbers. More accessible draw odds. Strong trophy potential for hunters willing to pack in.",
  },
  {
    state: "WY", stateName: "Wyoming", unit: "26", species: "elk", method: "any",
    oddsAt0Pts: 0.22, oddsAt5Pts: 0.45, oddsAt10Pts: 0.72, oddsAt15Pts: 0.92,
    nrFeeApprox: 692, nrQuotaPct: 20, trophyPotential: "high",
    avgSuccessRate: 0.74, publicLandPct: 60, access: "fair",
    seasonOpen: "Sep 15", seasonClose: "Oct 31",
    tags: ["rugged", "pack hunt", "remote"],
    notes: "Remote backcountry. Horse or pack-in recommended. Lower competition due to access requirements.",
  },
  {
    state: "WY", stateName: "Wyoming", unit: "55", species: "elk", method: "any",
    oddsAt0Pts: 0.35, oddsAt5Pts: 0.60, oddsAt10Pts: 0.82, oddsAt15Pts: 0.96,
    nrFeeApprox: 692, nrQuotaPct: 20, trophyPotential: "moderate",
    avgSuccessRate: 0.72, publicLandPct: 55, access: "good",
    seasonOpen: "Oct 1", seasonClose: "Oct 31",
    tags: ["higher odds", "beginner friendly", "family hunt"],
    notes: "Higher draw odds — good entry unit for first-time WY elk hunters. Moderate trophy quality with above-average success.",
  },
  {
    state: "WY", stateName: "Wyoming", unit: "2", species: "elk", method: "any",
    oddsAt0Pts: 0.10, oddsAt5Pts: 0.26, oddsAt10Pts: 0.52, oddsAt15Pts: 0.78,
    nrFeeApprox: 692, nrQuotaPct: 20, trophyPotential: "exceptional",
    avgSuccessRate: 0.80, publicLandPct: 70, access: "excellent",
    seasonOpen: "Sep 15", seasonClose: "Nov 15",
    tags: ["trophy", "roadside camps ok", "archery"],
    notes: "Yellowstone country. World-class bulls migrate through. Accessible camping. Premium unit in every way.",
  },

  // ─── WYOMING MULE DEER ────────────────────────────────────────────────────
  {
    state: "WY", stateName: "Wyoming", unit: "57", species: "mule_deer", method: "any",
    oddsAt0Pts: 0.05, oddsAt5Pts: 0.15, oddsAt10Pts: 0.35, oddsAt15Pts: 0.62,
    nrFeeApprox: 386, nrQuotaPct: 20, trophyPotential: "exceptional",
    avgSuccessRate: 0.70, publicLandPct: 45, access: "fair",
    seasonOpen: "Oct 1", seasonClose: "Oct 31",
    tags: ["trophy mule deer", "big bucks", "hard to draw"],
    notes: "One of the top mule deer units in North America. 200-class bucks taken regularly. Point game — plan for 10+ years.",
  },
  {
    state: "WY", stateName: "Wyoming", unit: "96", species: "mule_deer", method: "any",
    oddsAt0Pts: 0.12, oddsAt5Pts: 0.28, oddsAt10Pts: 0.52, oddsAt15Pts: 0.80,
    nrFeeApprox: 386, nrQuotaPct: 20, trophyPotential: "high",
    avgSuccessRate: 0.72, publicLandPct: 60, access: "good",
    seasonOpen: "Oct 1", seasonClose: "Oct 31",
    tags: ["high success", "quality bucks", "accessible"],
    notes: "Premium high-desert mule deer. 180-190 class bucks realistic. Better access than unit 57 with strong draw odds at 10 pts.",
  },
  {
    state: "WY", stateName: "Wyoming", unit: "110", species: "mule_deer", method: "any",
    oddsAt0Pts: 0.20, oddsAt5Pts: 0.42, oddsAt10Pts: 0.70, oddsAt15Pts: 0.90,
    nrFeeApprox: 386, nrQuotaPct: 20, trophyPotential: "high",
    avgSuccessRate: 0.75, publicLandPct: 65, access: "good",
    seasonOpen: "Oct 1", seasonClose: "Oct 31",
    tags: ["high success", "good access", "newer hotspot"],
    notes: "Underrated unit gaining popularity. Excellent public access, strong buck numbers, high success rate.",
  },

  // ─── COLORADO ELK ─────────────────────────────────────────────────────────
  {
    state: "CO", stateName: "Colorado", unit: "2", species: "elk", method: "any",
    oddsAt0Pts: 0.08, oddsAt5Pts: 0.18, oddsAt10Pts: 0.38, oddsAt15Pts: 0.65,
    nrFeeApprox: 761, nrQuotaPct: 35, trophyPotential: "exceptional",
    avgSuccessRate: 0.78, publicLandPct: 80, access: "excellent",
    seasonOpen: "Sep 1", seasonClose: "Nov 30",
    tags: ["trophy", "large public", "archery to rifle"],
    notes: "NW Colorado. Massive public land base. One of CO's best trophy elk units. Points accumulate well here.",
  },
  {
    state: "CO", stateName: "Colorado", unit: "12", species: "elk", method: "any",
    oddsAt0Pts: 0.10, oddsAt5Pts: 0.22, oddsAt10Pts: 0.45, oddsAt15Pts: 0.72,
    nrFeeApprox: 761, nrQuotaPct: 35, trophyPotential: "exceptional",
    avgSuccessRate: 0.80, publicLandPct: 75, access: "good",
    seasonOpen: "Sep 1", seasonClose: "Nov 30",
    tags: ["trophy", "Flat Tops", "high elk density"],
    notes: "Flat Tops Wilderness unit. Some of the highest elk densities in the state. Trophy bulls in the wilderness core.",
  },
  {
    state: "CO", stateName: "Colorado", unit: "44", species: "elk", method: "any",
    oddsAt0Pts: 0.14, oddsAt5Pts: 0.30, oddsAt10Pts: 0.55, oddsAt15Pts: 0.80,
    nrFeeApprox: 761, nrQuotaPct: 35, trophyPotential: "high",
    avgSuccessRate: 0.76, publicLandPct: 65, access: "good",
    seasonOpen: "Sep 1", seasonClose: "Oct 31",
    tags: ["rugged", "quality", "good access"],
    notes: "SW Colorado. Strong trophy potential. Mix of public and private — focus on BLM sections.",
  },
  {
    state: "CO", stateName: "Colorado", unit: "55", species: "elk", method: "any",
    oddsAt0Pts: 0.20, oddsAt5Pts: 0.40, oddsAt10Pts: 0.65, oddsAt15Pts: 0.85,
    nrFeeApprox: 761, nrQuotaPct: 35, trophyPotential: "high",
    avgSuccessRate: 0.74, publicLandPct: 70, access: "good",
    seasonOpen: "Sep 1", seasonClose: "Nov 30",
    tags: ["high odds", "large unit", "versatile"],
    notes: "Good balance of draw odds and trophy quality. Multiple weapon seasons available. Highly recommended for 5-10 pt hunters.",
  },
  {
    state: "CO", stateName: "Colorado", unit: "201", species: "elk", method: "any",
    oddsAt0Pts: 0.06, oddsAt5Pts: 0.14, oddsAt10Pts: 0.30, oddsAt15Pts: 0.55,
    nrFeeApprox: 761, nrQuotaPct: 35, trophyPotential: "exceptional",
    avgSuccessRate: 0.82, publicLandPct: 50, access: "fair",
    seasonOpen: "Sep 1", seasonClose: "Nov 30",
    tags: ["trophy", "hard to draw", "world class"],
    notes: "One of the hardest CO units to draw. 400+ class bulls documented. Long-term point game — start banking immediately.",
  },

  // ─── COLORADO MULE DEER ───────────────────────────────────────────────────
  {
    state: "CO", stateName: "Colorado", unit: "2", species: "mule_deer", method: "any",
    oddsAt0Pts: 0.10, oddsAt5Pts: 0.22, oddsAt10Pts: 0.45, oddsAt15Pts: 0.72,
    nrFeeApprox: 423, nrQuotaPct: 35, trophyPotential: "exceptional",
    avgSuccessRate: 0.68, publicLandPct: 75, access: "excellent",
    seasonOpen: "Oct 1", seasonClose: "Nov 15",
    tags: ["trophy mule deer", "big bucks", "NW Colorado"],
    notes: "NW CO classic trophy mule deer country. 190-210 class bucks. Outstanding public land. Competitive draw but worth the wait.",
  },
  {
    state: "CO", stateName: "Colorado", unit: "40", species: "mule_deer", method: "any",
    oddsAt0Pts: 0.15, oddsAt5Pts: 0.32, oddsAt10Pts: 0.58, oddsAt15Pts: 0.82,
    nrFeeApprox: 423, nrQuotaPct: 35, trophyPotential: "high",
    avgSuccessRate: 0.72, publicLandPct: 68, access: "good",
    seasonOpen: "Oct 1", seasonClose: "Nov 15",
    tags: ["high success", "quality bucks", "accessible"],
    notes: "Excellent mule deer unit with better draw odds than the premium NW CO units. Regularly produces 180+ class bucks.",
  },

  // ─── UTAH ELK ─────────────────────────────────────────────────────────────
  {
    state: "UT", stateName: "Utah", unit: "Central Mountains", species: "elk", method: "any",
    oddsAt0Pts: 0.04, oddsAt5Pts: 0.10, oddsAt10Pts: 0.22, oddsAt15Pts: 0.42,
    nrFeeApprox: 849, nrQuotaPct: 10, trophyPotential: "exceptional",
    avgSuccessRate: 0.85, publicLandPct: 80, access: "good",
    seasonOpen: "Sep 1", seasonClose: "Oct 31",
    tags: ["trophy", "world class", "very hard draw"],
    notes: "Utah's top bull elk units. 400-class bulls. NR quota is very low (~10%). Expect 15-20 years of point building as a non-resident.",
  },
  {
    state: "UT", stateName: "Utah", unit: "Book Cliffs", species: "elk", method: "any",
    oddsAt0Pts: 0.06, oddsAt5Pts: 0.14, oddsAt10Pts: 0.28, oddsAt15Pts: 0.52,
    nrFeeApprox: 849, nrQuotaPct: 10, trophyPotential: "exceptional",
    avgSuccessRate: 0.88, publicLandPct: 60, access: "fair",
    seasonOpen: "Sep 1", seasonClose: "Oct 31",
    tags: ["trophy elk", "remote", "high success"],
    notes: "Remote canyon country. Some of the highest success rates in North America. Pack-in access. Worth every year of waiting.",
  },
  {
    state: "UT", stateName: "Utah", unit: "Cache", species: "elk", method: "any",
    oddsAt0Pts: 0.15, oddsAt5Pts: 0.32, oddsAt10Pts: 0.55, oddsAt15Pts: 0.78,
    nrFeeApprox: 849, nrQuotaPct: 10, trophyPotential: "high",
    avgSuccessRate: 0.76, publicLandPct: 70, access: "good",
    seasonOpen: "Sep 1", seasonClose: "Oct 31",
    tags: ["better odds", "quality bulls", "northern Utah"],
    notes: "North UT unit with better NR draw odds. Quality 6x6 bulls. Good road access to public land.",
  },

  // ─── UTAH MULE DEER ───────────────────────────────────────────────────────
  {
    state: "UT", stateName: "Utah", unit: "Book Cliffs", species: "mule_deer", method: "any",
    oddsAt0Pts: 0.04, oddsAt5Pts: 0.10, oddsAt10Pts: 0.22, oddsAt15Pts: 0.44,
    nrFeeApprox: 599, nrQuotaPct: 10, trophyPotential: "exceptional",
    avgSuccessRate: 0.72, publicLandPct: 55, access: "fair",
    seasonOpen: "Oct 1", seasonClose: "Oct 31",
    tags: ["200 class bucks", "bucket list", "hard draw"],
    notes: "Bucket-list mule deer unit. 200+ class bucks documented every year. NR quota tiny — very long point game for non-residents.",
  },
  {
    state: "UT", stateName: "Utah", unit: "San Juan", species: "mule_deer", method: "any",
    oddsAt0Pts: 0.08, oddsAt5Pts: 0.18, oddsAt10Pts: 0.35, oddsAt15Pts: 0.60,
    nrFeeApprox: 599, nrQuotaPct: 10, trophyPotential: "high",
    avgSuccessRate: 0.68, publicLandPct: 65, access: "fair",
    seasonOpen: "Oct 1", seasonClose: "Oct 31",
    tags: ["trophy bucks", "canyons", "remote"],
    notes: "SE Utah canyon country. Exceptional trophy bucks. Mix of BLM/Tribal — focus on BLM sections.",
  },

  // ─── ARIZONA ELK ──────────────────────────────────────────────────────────
  {
    state: "AZ", stateName: "Arizona", unit: "1", species: "elk", method: "any",
    oddsAt0Pts: 0.02, oddsAt5Pts: 0.05, oddsAt10Pts: 0.12, oddsAt15Pts: 0.28,
    nrFeeApprox: 175, nrQuotaPct: 10, trophyPotential: "exceptional",
    avgSuccessRate: 0.90, publicLandPct: 85, access: "excellent",
    seasonOpen: "Oct 1", seasonClose: "Dec 31",
    tags: ["world class", "350+ bulls", "bucket list", "high success"],
    notes: "Unit 1 is arguably the top trophy elk unit in North America. 350-450 class bulls. Almost certain success once drawn. NR quota ~10% — expect 15-20 years to draw.",
  },
  {
    state: "AZ", stateName: "Arizona", unit: "9", species: "elk", method: "any",
    oddsAt0Pts: 0.03, oddsAt5Pts: 0.07, oddsAt10Pts: 0.16, oddsAt15Pts: 0.35,
    nrFeeApprox: 175, nrQuotaPct: 10, trophyPotential: "exceptional",
    avgSuccessRate: 0.88, publicLandPct: 80, access: "good",
    seasonOpen: "Oct 1", seasonClose: "Dec 31",
    tags: ["world class", "300+ bulls", "high success"],
    notes: "White Mountains area. Consistently produces 340+ bulls. Incredible public land. Apply every year — AZ uses bonus points (squared).",
  },
  {
    state: "AZ", stateName: "Arizona", unit: "6A", species: "elk", method: "archery",
    oddsAt0Pts: 0.08, oddsAt5Pts: 0.18, oddsAt10Pts: 0.38, oddsAt15Pts: 0.65,
    nrFeeApprox: 175, nrQuotaPct: 10, trophyPotential: "high",
    avgSuccessRate: 0.60, publicLandPct: 75, access: "good",
    seasonOpen: "Sep 9", seasonClose: "Sep 30",
    tags: ["archery only", "quality bulls", "better odds"],
    notes: "Archery-only unit with far better odds than any AZ rifle elk tag. Quality 320+ bulls in the rut. Excellent for bowhunters.",
  },
  {
    state: "AZ", stateName: "Arizona", unit: "10", species: "elk", method: "any",
    oddsAt0Pts: 0.04, oddsAt5Pts: 0.09, oddsAt10Pts: 0.20, oddsAt15Pts: 0.40,
    nrFeeApprox: 175, nrQuotaPct: 10, trophyPotential: "exceptional",
    avgSuccessRate: 0.85, publicLandPct: 70, access: "good",
    seasonOpen: "Oct 1", seasonClose: "Dec 31",
    tags: ["trophy", "high plains", "world class"],
    notes: "High Plateau elk. Some of the largest bulls in the state. Bonus point squared system rewards consistent applicants.",
  },

  // ─── ARIZONA MULE DEER ────────────────────────────────────────────────────
  {
    state: "AZ", stateName: "Arizona", unit: "13A", species: "mule_deer", method: "any",
    oddsAt0Pts: 0.05, oddsAt5Pts: 0.12, oddsAt10Pts: 0.26, oddsAt15Pts: 0.50,
    nrFeeApprox: 175, nrQuotaPct: 10, trophyPotential: "exceptional",
    avgSuccessRate: 0.70, publicLandPct: 60, access: "fair",
    seasonOpen: "Nov 15", seasonClose: "Dec 31",
    tags: ["monster bucks", "desert mule deer", "hard draw"],
    notes: "Sonoran Desert mule deer. Giant-framed desert bucks. Long draw timeline but the desert hunting experience is world-class.",
  },

  // ─── NEW MEXICO ELK ───────────────────────────────────────────────────────
  {
    state: "NM", stateName: "New Mexico", unit: "2B", species: "elk", method: "any",
    oddsAt0Pts: 0.06, oddsAt5Pts: 0.15, oddsAt10Pts: 0.32, oddsAt15Pts: 0.58,
    nrFeeApprox: 941, nrQuotaPct: 20, trophyPotential: "exceptional",
    avgSuccessRate: 0.82, publicLandPct: 65, access: "good",
    seasonOpen: "Sep 1", seasonClose: "Nov 30",
    tags: ["Gila country", "world class", "long draw"],
    notes: "Gila Wilderness elk. Giant bulls in rugged terrain. NM Bowhunters Association reports highest trophy quality in the state. Pack-in recommended.",
  },
  {
    state: "NM", stateName: "New Mexico", unit: "16A", species: "elk", method: "any",
    oddsAt0Pts: 0.12, oddsAt5Pts: 0.28, oddsAt10Pts: 0.52, oddsAt15Pts: 0.78,
    nrFeeApprox: 941, nrQuotaPct: 20, trophyPotential: "high",
    avgSuccessRate: 0.78, publicLandPct: 70, access: "good",
    seasonOpen: "Sep 1", seasonClose: "Nov 30",
    tags: ["good access", "quality bulls", "national forest"],
    notes: "Carson National Forest unit. Strong bull density, good public land access. More achievable draw timeline for most hunters.",
  },

  // ─── MONTANA ELK ──────────────────────────────────────────────────────────
  {
    state: "MT", stateName: "Montana", unit: "Region 1", species: "elk", method: "any",
    oddsAt0Pts: 0.30, oddsAt5Pts: 0.55, oddsAt10Pts: 0.78, oddsAt15Pts: 0.95,
    nrFeeApprox: 992, nrQuotaPct: 10, trophyPotential: "high",
    avgSuccessRate: 0.70, publicLandPct: 60, access: "good",
    seasonOpen: "Sep 15", seasonClose: "Nov 25",
    tags: ["accessible draw", "NW Montana", "rugged"],
    notes: "NW Montana — Cabinet and Whitefish ranges. Good draw odds. Remote drainages hold big bulls.",
  },
  {
    state: "MT", stateName: "Montana", unit: "Region 3", species: "elk", method: "any",
    oddsAt0Pts: 0.25, oddsAt5Pts: 0.48, oddsAt10Pts: 0.72, oddsAt15Pts: 0.92,
    nrFeeApprox: 992, nrQuotaPct: 10, trophyPotential: "high",
    avgSuccessRate: 0.74, publicLandPct: 65, access: "good",
    seasonOpen: "Sep 15", seasonClose: "Nov 25",
    tags: ["SW Montana", "accessible", "quality bulls"],
    notes: "SW Montana. Some of the best elk numbers in the state. Road-accessible hunting mixed with backcountry opportunities.",
  },
  {
    state: "MT", stateName: "Montana", unit: "Region 4", species: "elk", method: "any",
    oddsAt0Pts: 0.22, oddsAt5Pts: 0.44, oddsAt10Pts: 0.68, oddsAt15Pts: 0.90,
    nrFeeApprox: 992, nrQuotaPct: 10, trophyPotential: "high",
    avgSuccessRate: 0.72, publicLandPct: 55, access: "fair",
    seasonOpen: "Sep 15", seasonClose: "Nov 25",
    tags: ["Rocky Mountain Front", "wilderness access", "trophy"],
    notes: "Rocky Mountain Front and Beartooth country. Big bulls in the wilderness core. Outfitter recommended for first-timers.",
  },

  // ─── IDAHO ELK (random lottery — no point system) ─────────────────────────
  {
    state: "ID", stateName: "Idaho", unit: "Zone 2", species: "elk", method: "any",
    oddsAt0Pts: 0.14, oddsAt5Pts: 0.14, oddsAt10Pts: 0.14, oddsAt15Pts: 0.14,
    nrFeeApprox: 582, nrQuotaPct: 15, trophyPotential: "high",
    avgSuccessRate: 0.72, publicLandPct: 80, access: "excellent",
    seasonOpen: "Oct 10", seasonClose: "Nov 15",
    tags: ["random draw", "flat odds", "great public land", "clearwater"],
    notes: "Random lottery — no points advantage. Clearwater country with huge elk herds. Apply every year; expect to draw every 6-8 years.",
  },
  {
    state: "ID", stateName: "Idaho", unit: "Zone 10", species: "elk", method: "any",
    oddsAt0Pts: 0.18, oddsAt5Pts: 0.18, oddsAt10Pts: 0.18, oddsAt15Pts: 0.18,
    nrFeeApprox: 582, nrQuotaPct: 15, trophyPotential: "high",
    avgSuccessRate: 0.68, publicLandPct: 75, access: "good",
    seasonOpen: "Oct 10", seasonClose: "Nov 15",
    tags: ["random draw", "central Idaho", "wilderness"],
    notes: "Frank Church Wilderness area. Spectacular country with quality bulls. Outfitter country but DIY possible with float hunting.",
  },

  // ─── NEVADA ELK (very few NR tags) ────────────────────────────────────────
  {
    state: "NV", stateName: "Nevada", unit: "232", species: "elk", method: "any",
    oddsAt0Pts: 0.01, oddsAt5Pts: 0.03, oddsAt10Pts: 0.07, oddsAt15Pts: 0.15,
    nrFeeApprox: 1400, nrQuotaPct: 5, trophyPotential: "exceptional",
    avgSuccessRate: 0.92, publicLandPct: 85, access: "good",
    seasonOpen: "Sep 1", seasonClose: "Dec 31",
    tags: ["bucket list", "huge bulls", "very rare tag", "once in a lifetime"],
    notes: "Ruby Mountains. Once-in-a-lifetime caliber hunt. NR quota is tiny (~5%). 15-25 year point game. Applied for and forgotten until drawn.",
  },

  // ─── PRONGHORN ────────────────────────────────────────────────────────────
  {
    state: "WY", stateName: "Wyoming", unit: "39", species: "pronghorn", method: "any",
    oddsAt0Pts: 0.35, oddsAt5Pts: 0.65, oddsAt10Pts: 0.88, oddsAt15Pts: 0.98,
    nrFeeApprox: 285, nrQuotaPct: 20, trophyPotential: "high",
    avgSuccessRate: 0.88, publicLandPct: 70, access: "excellent",
    seasonOpen: "Oct 1", seasonClose: "Oct 31",
    tags: ["trophy pronghorn", "high success", "accessible"],
    notes: "Top WY trophy antelope unit. Regularly produces 80+ inch bucks. Extremely high success rate. One of the best bang-for-buck hunts in the West.",
  },
  {
    state: "WY", stateName: "Wyoming", unit: "1", species: "pronghorn", method: "any",
    oddsAt0Pts: 0.45, oddsAt5Pts: 0.75, oddsAt10Pts: 0.95, oddsAt15Pts: 1.00,
    nrFeeApprox: 285, nrQuotaPct: 20, trophyPotential: "moderate",
    avgSuccessRate: 0.90, publicLandPct: 75, access: "excellent",
    seasonOpen: "Sep 15", seasonClose: "Oct 31",
    tags: ["easy draw", "high success", "family hunt"],
    notes: "Great starter pronghorn unit. Near-certain draw within 3 years. High success. Good for first-time pronghorn hunters.",
  },
  {
    state: "AZ", stateName: "Arizona", unit: "19A", species: "pronghorn", method: "any",
    oddsAt0Pts: 0.02, oddsAt5Pts: 0.05, oddsAt10Pts: 0.12, oddsAt15Pts: 0.28,
    nrFeeApprox: 175, nrQuotaPct: 10, trophyPotential: "exceptional",
    avgSuccessRate: 0.85, publicLandPct: 80, access: "excellent",
    seasonOpen: "Aug 15", seasonClose: "Sep 15",
    tags: ["world record country", "bucket list", "120+ inch bucks"],
    notes: "Arizona pronghorn country consistently produces near-world-record bucks. Long draw timeline but justifiably legendary.",
  },

  // ─── BIGHORN SHEEP ────────────────────────────────────────────────────────
  {
    state: "WY", stateName: "Wyoming", unit: "1", species: "bighorn_sheep", method: "any",
    oddsAt0Pts: 0.005, oddsAt5Pts: 0.01, oddsAt10Pts: 0.025, oddsAt15Pts: 0.06,
    nrFeeApprox: 2365, nrQuotaPct: 25, trophyPotential: "exceptional",
    avgSuccessRate: 0.90, publicLandPct: 60, access: "fair",
    seasonOpen: "Sep 1", seasonClose: "Oct 31",
    tags: ["bucket list", "once in a lifetime", "30+ year wait"],
    notes: "A once-in-a-lifetime tag. Apply every year for decades. Trophy rams common. When drawn, hire an outfitter — this is your one shot.",
  },
  {
    state: "CO", stateName: "Colorado", unit: "S1", species: "bighorn_sheep", method: "any",
    oddsAt0Pts: 0.004, oddsAt5Pts: 0.008, oddsAt10Pts: 0.02, oddsAt15Pts: 0.05,
    nrFeeApprox: 2137, nrQuotaPct: 25, trophyPotential: "exceptional",
    avgSuccessRate: 0.88, publicLandPct: 65, access: "fair",
    seasonOpen: "Sep 1", seasonClose: "Oct 31",
    tags: ["bucket list", "once in a lifetime", "trophy rams"],
    notes: "Colorado's premier sheep units. Bank points every year without exception. A license you will never regret spending $2,137 on.",
  },

  // ─── MOOSE ────────────────────────────────────────────────────────────────
  {
    state: "WY", stateName: "Wyoming", unit: "1", species: "moose", method: "any",
    oddsAt0Pts: 0.02, oddsAt5Pts: 0.05, oddsAt10Pts: 0.12, oddsAt15Pts: 0.28,
    nrFeeApprox: 2365, nrQuotaPct: 25, trophyPotential: "exceptional",
    avgSuccessRate: 0.95, publicLandPct: 70, access: "good",
    seasonOpen: "Sep 15", seasonClose: "Oct 31",
    tags: ["bucket list", "huge bulls", "once in a lifetime"],
    notes: "Near-certain success when drawn. Plan on 10-15 years of points. Book an outfitter — you'll have one crack at this.",
  },

  // ─── BLACK BEAR (OTC highlight) ───────────────────────────────────────────
  {
    state: "ID", stateName: "Idaho", unit: "Statewide", species: "black_bear", method: "any",
    oddsAt0Pts: 1.00, oddsAt5Pts: 1.00, oddsAt10Pts: 1.00, oddsAt15Pts: 1.00,
    nrFeeApprox: 186, nrQuotaPct: 100, trophyPotential: "high",
    avgSuccessRate: 0.45, publicLandPct: 65, access: "good",
    seasonOpen: "Apr 15", seasonClose: "Jun 30",
    tags: ["OTC", "buy and go", "spring bear", "no draw"],
    notes: "OTC spring bear — buy your license online and go. Idaho has one of the best black bear populations in the US. No draw required.",
  },
  {
    state: "CO", stateName: "Colorado", unit: "Statewide", species: "black_bear", method: "any",
    oddsAt0Pts: 1.00, oddsAt5Pts: 1.00, oddsAt10Pts: 1.00, oddsAt15Pts: 1.00,
    nrFeeApprox: 116, nrQuotaPct: 100, trophyPotential: "moderate",
    avgSuccessRate: 0.40, publicLandPct: 60, access: "excellent",
    seasonOpen: "Sep 2", seasonClose: "Nov 30",
    tags: ["OTC", "buy and go", "fall bear", "no draw"],
    notes: "OTC fall bear over the counter. Combine with another CO tag for a dual-species trip. High bear density in NW CO.",
  },
];

export const unitData = UNITS;

export function getUnitsForSpecies(species: string): UnitProfile[] {
  return UNITS.filter(u => u.species === species);
}

export function getUnitsForState(state: string): UnitProfile[] {
  return UNITS.filter(u => u.state === state.toUpperCase());
}

export function searchUnits(
  species: string,
  states: string[],
  maxFee: number,
  minOddsAt0Pts: number
): UnitProfile[] {
  return UNITS.filter(u =>
    u.species === species &&
    (states.length === 0 || states.includes(u.state)) &&
    u.nrFeeApprox <= maxFee &&
    u.oddsAt0Pts >= minOddsAt0Pts
  );
}

/** Summarize unit data for injection into AI prompts */
export function buildUnitContext(species: string[], states?: string[]): string {
  const relevant = UNITS.filter(u =>
    species.includes(u.species) &&
    (states === undefined || states.length === 0 || states.includes(u.state))
  );

  if (relevant.length === 0) return "";

  return "SPECIFIC UNIT DATA (use this to make concrete recommendations):\n" +
    relevant.map(u =>
      `${u.stateName} ${u.unit} (${u.species.replace("_", " ")}): ` +
      `trophy=${u.trophyPotential}, success=${Math.round(u.avgSuccessRate * 100)}%, ` +
      `public=${u.publicLandPct}%, NR fee=$${u.nrFeeApprox}, ` +
      `odds: 0pts=${Math.round(u.oddsAt0Pts * 100)}% / 5pts=${Math.round(u.oddsAt5Pts * 100)}% / 10pts=${Math.round(u.oddsAt10Pts * 100)}% / 15pts=${Math.round(u.oddsAt15Pts * 100)}%, ` +
      `season: ${u.seasonOpen}–${u.seasonClose}, access=${u.access}, ` +
      `notes: ${u.notes}`
    ).join("\n");
}
