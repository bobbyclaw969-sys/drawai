import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { rateLimit, getClientIp } from "@/lib/rateLimit";
import { buildUnitContext } from "@/lib/unitData";
import { SPECIES_LABELS, STATE_NAMES } from "@/lib/huntingData";
import { logEvent } from "@/lib/analytics";

export const maxDuration = 60;

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are Tag Hunter's Hunt Finder — the most specific and honest big game hunt recommendation engine in the American West. You have unit-level knowledge of every major hunting unit across WY, CO, MT, UT, AZ, NM, ID, NV, OR, and WA.

Given a hunter's profile, return their TOP 5 best-matched hunts, ranked by overall fit.

FORMAT EACH RECOMMENDATION EXACTLY LIKE THIS — no exceptions:

### #[N] [STATE] [SPECIES] — Unit [UNIT] ★[1-5]

**Match:** [X]/10 | **Draw odds at [X] pts:** ~[X]% | **NR Tag:** ~$[X] | **Apply by:** [Month]

**Why it fits:** 2-3 sentences specific to THIS hunter's points, budget, trophy goal, and method preference.

**Honest assessment:** 1-2 sentences of straight talk — success rate, terrain difficulty, hunter pressure, what the animals look like.

**Draw timeline:** At [X] points (+1/yr), your 50% draw probability is approximately year [N]. [If OTC: Available now — no draw needed.]

**Apply at:** [State wildlife agency name — e.g., Wyoming Game and Fish Department]

---

RULES (non-negotiable):
- Name SPECIFIC unit numbers (Unit 7, GMU 44, etc.) — never just say "the state"
- Rank OTC hunts #1 if the hunter can go this year and their budget allows
- Sheep/goat/moose → only recommend if hunter explicitly wants trophy once-in-lifetime; frame as 15-25 year commitment
- Budget check: flag if a recommendation exceeds stated annual budget
- NR quota reality check: if NR quota is under 10%, state it plainly
- If a unit has significant private land (>50%), warn about access
- Be honest — a 2% draw chance at 0 points is a 2% draw chance, not "competitive odds"
- For random lottery states (Idaho, some Montana units): state that points don't help and odds are flat
- End with a brief "## Points to Bank Right Now" section: list 2-3 states to immediately start banking points even if not recommending a short-term draw there`;

export interface FindProfile {
  species: string[];
  huntType: string;
  residency: string;
  states: string[];           // states willing to hunt
  pointsByState: Record<string, number>;
  budget: number;
  trophyPriority: "otc_or_easy" | "quality" | "trophy" | "bucket_list";
  frequency: "every_year" | "every_2_3" | "once";
  planningYears: number;
}

function buildFindMessage(p: FindProfile): string {
  const speciesNames = p.species.map(s => SPECIES_LABELS[s as keyof typeof SPECIES_LABELS] ?? s).join(", ");
  const stateNames = p.states.map(s => STATE_NAMES[s.toUpperCase()] ?? s).join(", ");

  const trophyText = {
    otc_or_easy: "Wants to hunt THIS YEAR if possible — OTC preferred, easy draws acceptable. Will take any quality tag.",
    quality:     "Wants quality bulls/bucks, not necessarily the hardest-to-draw units. Balance of trophy and frequency.",
    trophy:      "Will wait several years for above-average trophy quality. Not chasing world-records but wants a real trophy hunt.",
    bucket_list: "Willing to wait 10-20+ years for a world-class, bucket-list tag. Quality over everything.",
  }[p.trophyPriority];

  const freqText = {
    every_year:  "Wants to hunt every single year — maximize annual opportunities",
    every_2_3:   "Happy to hunt every 2-3 years if the quality is right",
    once:        "Willing to wait as long as it takes for one exceptional hunt",
  }[p.frequency];

  const pts = Object.entries(p.pointsByState)
    .filter(([, v]) => v > 0)
    .map(([s, v]) => `  ${STATE_NAMES[s.toUpperCase()] ?? s}: ${v} pts`)
    .join("\n") || "  No points in any state yet";

  const unitCtx = buildUnitContext(p.species, p.states.length > 0 ? p.states.map(s => s.toUpperCase()) : undefined);

  return `Hunter Profile for Hunt Finder:
- Species wanted: ${speciesNames}
- Hunt method: ${p.huntType === "any" ? "Any / All methods" : p.huntType}
- Home state: ${STATE_NAMES[p.residency.toUpperCase()] ?? p.residency}
- States willing to travel: ${stateNames || "Any western state"}
- Annual budget (all fees): $${p.budget.toLocaleString()}
- Trophy priority: ${trophyText}
- Frequency goal: ${freqText}
- Planning horizon: ${p.planningYears} years

Current points:
${pts}

Today's date: ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}

${unitCtx}

Find this hunter's 5 best-matched hunts. Rank #1 = best overall fit for their specific situation.`;
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rl = await rateLimit(`find:${ip}`, 20, 60 * 60_000);
    if (!rl.allowed) {
      return new Response("Too many requests. Please wait a moment.", {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) },
      });
    }

    const body = await req.json() as { profile?: FindProfile };
    const profile = body.profile;

    if (!profile || !Array.isArray(profile.species) || profile.species.length === 0) {
      return new Response("Invalid request", { status: 400 });
    }
    if (typeof profile.budget !== "number" || profile.budget < 0 || profile.budget > 100_000) {
      return new Response("Invalid budget", { status: 400 });
    }

    void logEvent("find", ip, { species: profile.species, states: profile.states });

    const stream = await client.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 3500,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildFindMessage(profile) }],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err) {
    console.error("Find API error:", err);
    return new Response("Failed to find hunts. Please try again.", { status: 500 });
  }
}
