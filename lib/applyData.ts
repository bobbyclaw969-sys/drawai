// State application portal data for the Application Center
// Official URLs, draw result dates, required fields, and tips

export interface StateApplyGuide {
  stateId: string;
  stateName: string;
  portalUrl: string;
  portalLabel: string;
  drawResultMonth: number;  // approx month results are announced
  drawResultNote: string;
  requiredFields: string[];
  specialRequirements: string[];
  proTips: string[];
  species: string[];        // species you can apply for here
  acceptsNonresident: boolean;
  nrNotes?: string;
}

export const STATE_APPLY_GUIDES: StateApplyGuide[] = [
  {
    stateId: "co",
    stateName: "Colorado",
    portalUrl: "https://cpw.state.co.us/buyapply",
    portalLabel: "CPW License Portal",
    drawResultMonth: 6,
    drawResultNote: "Results typically released in June via email and online",
    requiredFields: [
      "Full legal name",
      "Date of birth",
      "Social Security # (last 4 digits) or CO License #",
      "Mailing address",
      "Email address",
      "Credit card for application fee",
    ],
    specialRequirements: [
      "Must purchase a Colorado Habitat Stamp ($10.28 NR) before applying",
      "Hunter education certificate required if born after Jan 1, 1949",
      "You can apply for up to 4 species in the same window",
    ],
    proTips: [
      "Apply for elk, mule deer, pronghorn AND antelope in the same session — one login",
      "Select up to 3 unit choices (1st, 2nd, 3rd) — odds improve slightly with all 3 filled",
      "Buy the habitat stamp FIRST — the system requires it before you can apply",
      "Draw results come to your CPW account email — check spam",
    ],
    species: ["elk", "mule_deer", "pronghorn", "bighorn_sheep", "mountain_goat", "moose", "black_bear"],
    acceptsNonresident: true,
    nrNotes: "NR quota is 20% for most elk units. Some units have 0% NR quota — check before applying.",
  },
  {
    stateId: "wy",
    stateName: "Wyoming",
    portalUrl: "https://wgfd.wyo.gov/Applications-and-Permits",
    portalLabel: "WGFD License Center",
    drawResultMonth: 6,
    drawResultNote: "Results posted in June — check your WGFD online account",
    requiredFields: [
      "Full legal name",
      "Date of birth",
      "Social Security #",
      "Mailing address",
      "Phone number",
      "Credit card",
    ],
    specialRequirements: [
      "Must purchase a Wyoming base hunting license ($15 NR) before applying for tags",
      "Hunter education required (reciprocal cert accepted)",
      "Wyoming uses a Type system — you apply for specific Type 1, 2, or 9 licenses",
    ],
    proTips: [
      "Buy the base license first — it's separate from the draw application",
      "Type 1 elk are the premium limited quota licenses — apply for these specifically",
      "Type 6 licenses are often available as leftover after the draw",
      "Points do NOT guarantee a draw — WY uses preference points with a weighted formula",
      "Application window is long (Jan–May) — don't wait until the last week",
    ],
    species: ["elk", "mule_deer", "pronghorn", "bighorn_sheep", "moose", "bison"],
    acceptsNonresident: true,
    nrNotes: "NR quota is roughly 16% for elk. Some trophy units are essentially NR-impossible.",
  },
  {
    stateId: "mt",
    stateName: "Montana",
    portalUrl: "https://fwp.mt.gov/licensing/hunting",
    portalLabel: "MT FWP License Portal",
    drawResultMonth: 6,
    drawResultNote: "Results posted in June — check your FWP account",
    requiredFields: [
      "Full legal name",
      "Date of birth",
      "Montana customer number (if returning) or SS#",
      "Mailing address",
      "Email",
      "Credit card",
    ],
    specialRequirements: [
      "Conservation License required first ($8 residents / $10 NR) — purchase before applying",
      "Montana uses a bonus point system — no guarantee of draw",
      "General season elk hunting is OTC — draw only for specific limited permits",
    ],
    proTips: [
      "General season archery and rifle elk tags are OTC — no draw needed for most areas",
      "Only apply in the draw for specific permit areas (B licenses) — general tags don't require it",
      "Conservation license is cheap — get it every year to build bonus points",
      "MT draw odds are generally better than CO/WY/UT for quality units",
    ],
    species: ["elk", "mule_deer", "pronghorn", "bighorn_sheep", "mountain_goat", "moose", "black_bear"],
    acceptsNonresident: true,
    nrNotes: "NR quota is ~10-12%. General season OTC available for NR.",
  },
  {
    stateId: "id",
    stateName: "Idaho",
    portalUrl: "https://fishandgame.idaho.gov/licenses",
    portalLabel: "IDFG License Portal",
    drawResultMonth: 3,
    drawResultNote: "Results typically announced in March/April",
    requiredFields: [
      "Full legal name",
      "Date of birth",
      "IDFG customer ID or SS#",
      "Mailing address",
      "Phone",
      "Credit card",
    ],
    specialRequirements: [
      "Idaho hunting license required before applying",
      "Hunter education certificate required",
      "Many zones are OTC archery — check if your target unit needs a draw tag",
    ],
    proTips: [
      "Huge amounts of OTC archery elk hunting available — often better value than the draw",
      "Controlled hunt (draw) tags required for the best trophy units",
      "Application window is December through January — don't miss it",
      "Idaho preference points are transferable to next year automatically",
    ],
    species: ["elk", "mule_deer", "bighorn_sheep", "mountain_goat", "moose", "black_bear"],
    acceptsNonresident: true,
    nrNotes: "NR quota roughly 10%. Many OTC archery zones open to NR.",
  },
  {
    stateId: "ut",
    stateName: "Utah",
    portalUrl: "https://wildlife.utah.gov/licenses-permits",
    portalLabel: "UDWR License Portal",
    drawResultMonth: 6,
    drawResultNote: "Results typically announced in June",
    requiredFields: [
      "Full legal name",
      "Date of birth",
      "Utah customer number or SS last 4",
      "Address",
      "Email",
      "Credit card",
    ],
    specialRequirements: [
      "Utah hunting license not required to apply — purchase tag separately if drawn",
      "Weighted preference point system — points increase odds but don't guarantee",
      "Hunter education required for first-time buyers born after Dec 31, 1965",
    ],
    proTips: [
      "Apply early — Utah's portal can slow during the final days",
      "Check 'Any Weapon' vs specific weapon type — odds differ significantly",
      "Utah has some of the hardest draw odds for premium units (10-15+ pts needed)",
      "Ask for your second and third choices — improves your overall chances",
      "Once Per Lifetime (OPL) tags for bison and mountain goat — apply every year",
    ],
    species: ["elk", "mule_deer", "pronghorn", "bighorn_sheep", "mountain_goat", "moose", "bison", "black_bear"],
    acceptsNonresident: true,
    nrNotes: "Strict 10% NR quota enforced by Utah law. Very competitive.",
  },
  {
    stateId: "nv",
    stateName: "Nevada",
    portalUrl: "https://www.huntnevada.com",
    portalLabel: "NDOW Hunt Nevada Portal",
    drawResultMonth: 7,
    drawResultNote: "Results announced in July — check your Hunt Nevada account",
    requiredFields: [
      "Full legal name",
      "Date of birth",
      "Nevada customer ID or SS last 4",
      "Address",
      "Phone",
      "Credit card",
    ],
    specialRequirements: [
      "No Nevada hunting license required to apply for bonus points",
      "Separate application for bonus points vs. actual tag application",
      "Tags require Nevada hunting license — purchase only if drawn",
    ],
    proTips: [
      "Apply for bonus points every single year even if you don't expect to draw",
      "Nevada elk is extremely difficult — 15-20+ pts for best units",
      "Mule deer and pronghorn have much better odds than elk",
      "Consider Nevada a 10-15 year build play",
    ],
    species: ["elk", "mule_deer", "pronghorn", "bighorn_sheep", "mountain_goat", "moose"],
    acceptsNonresident: true,
    nrNotes: "Roughly 10% NR quota. Nevada is one of the hardest western draws.",
  },
  {
    stateId: "az",
    stateName: "Arizona",
    portalUrl: "https://www.azgfd.com/hunting/draw",
    portalLabel: "AZGFD Draw Application Portal",
    drawResultMonth: 6,
    drawResultNote: "Results typically announced in June — AZGFD emails registered hunters",
    requiredFields: [
      "Full legal name",
      "Date of birth",
      "Arizona customer number or SS last 4",
      "Address",
      "Email",
      "Credit card",
    ],
    specialRequirements: [
      "Arizona hunting license ($160 NR Combo) required before applying",
      "Bonus point application ($13) can be submitted without a license",
      "Arizona uses a pure bonus point system — more points = more entries in the draw",
    ],
    proTips: [
      "You can apply for a bonus point only (no tag) to start building points at low cost",
      "Some units have draw odds even at 0 points — check the draw odds report first",
      "Arizona has some of the best trophy elk hunting in the world — worth the long wait",
      "Application window is January–February — one of the earliest",
      "All NR applicants are pooled in a separate draw from residents for some species",
    ],
    species: ["elk", "mule_deer", "pronghorn", "bighorn_sheep", "mountain_goat", "black_bear"],
    acceptsNonresident: true,
    nrNotes: "10% NR quota for elk. World-class trophy potential makes it worth the wait.",
  },
  {
    stateId: "nm",
    stateName: "New Mexico",
    portalUrl: "https://www.wildlife.state.nm.us/hunting",
    portalLabel: "NMDGF License Portal",
    drawResultMonth: 6,
    drawResultNote: "Results typically in June",
    requiredFields: [
      "Full legal name",
      "Date of birth",
      "NM customer ID or SS last 4",
      "Mailing address",
      "Phone",
      "Credit card",
    ],
    specialRequirements: [
      "New Mexico hunting license required to apply",
      "NM uses a pure preference point system",
      "Hunter education certificate required",
    ],
    proTips: [
      "NM elk has one of the lowest NR quotas (6%) — be patient",
      "Unit 16A and Gila units are world-class trophy elk areas",
      "Build points every year — even without hunting",
      "Antlerless tags often have much better odds for those who just want to hunt",
    ],
    species: ["elk", "mule_deer", "pronghorn", "bighorn_sheep", "black_bear"],
    acceptsNonresident: true,
    nrNotes: "6% NR quota is one of the lowest in the West. Long wait for premium units.",
  },
  {
    stateId: "or",
    stateName: "Oregon",
    portalUrl: "https://odfw.huntfishoregon.com",
    portalLabel: "ODFW HuntFishOR Portal",
    drawResultMonth: 3,
    drawResultNote: "Draw results announced in March",
    requiredFields: [
      "Full legal name",
      "Date of birth",
      "ODFW customer ID",
      "Address",
      "Email",
      "Credit card",
    ],
    specialRequirements: [
      "Oregon hunting license required before applying",
      "Hunter education certification required",
      "Oregon preference point system",
    ],
    proTips: [
      "Oregon has a relatively short application window (December–January)",
      "Some units have solid odds at 3-5 preference points",
      "Cascade elk hunting can be quality — check the limited entry unit odds report",
      "Results come early (March) — great state to start the season",
    ],
    species: ["elk", "mule_deer", "pronghorn", "bighorn_sheep", "black_bear"],
    acceptsNonresident: true,
    nrNotes: "Roughly 16% NR quota. Reasonable odds at moderate point levels.",
  },
  {
    stateId: "wa",
    stateName: "Washington",
    portalUrl: "https://fishhunt.dfw.wa.gov",
    portalLabel: "WDFW FishHunt Portal",
    drawResultMonth: 5,
    drawResultNote: "Results typically in April–May",
    requiredFields: [
      "Full legal name",
      "Date of birth",
      "WDFW customer ID",
      "Address",
      "Credit card",
    ],
    specialRequirements: [
      "Washington hunting license required before applying",
      "Hunter education certification required",
    ],
    proTips: [
      "Application window is December through February/March",
      "Washington has limited NR quota — competition is high for available tags",
      "Many units have decent odds for antlerless elk",
      "Consider WA as a supplemental state alongside WY/CO/MT",
    ],
    species: ["elk", "mule_deer", "bighorn_sheep", "mountain_goat", "black_bear"],
    acceptsNonresident: true,
    nrNotes: "Roughly 16% NR quota. Limited tag numbers make it competitive.",
  },
];

export function getGuideForState(stateId: string): StateApplyGuide | undefined {
  return STATE_APPLY_GUIDES.find(g => g.stateId === stateId);
}

export function getGuidesForSpecies(species: string): StateApplyGuide[] {
  return STATE_APPLY_GUIDES.filter(g => g.species.includes(species));
}

export const DRAW_RESULT_MONTHS = [
  "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
