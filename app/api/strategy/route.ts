import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { HunterProfile, SpeciesKey } from "@/lib/types";
import { huntingData, SPECIES_LABELS, STATE_NAMES, formatDeadlines } from "@/lib/huntingData";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are DrawAI, the most knowledgeable hunting tag strategy advisor in the United States. You have encyclopedic knowledge of every western state's draw system — preference points, bonus points, weighted lotteries, OTC options, non-resident quotas, application deadlines, and realistic draw timelines.

Your job is to build a personalized, honest multi-year hunting strategy based on the hunter's profile.

RULES:
- Be specific and actionable. Name exact states, deadlines, and fees.
- Be honest about odds. If something is nearly impossible, say so plainly and frame it as a long-term goal.
- Always prioritize OTC options as "hunt now" opportunities while building points elsewhere in parallel.
- For sheep, goat, moose, and bison — always frame as 10-20+ year plans. Manage expectations clearly.
- Never recommend spending more than the hunter's stated annual budget on total application fees.
- Account for non-resident quotas — a state with 5% NR quota is much harder than the raw draw odds suggest.
- Flag "preference point only" applications (apply for points, not a tag this year) — these are often overlooked but critical for long-term strategy.
- When the hunter selects multiple species, build a cohesive strategy that maximizes total hunting days per year.
- Format your response using markdown with clear section headers.
- Keep it practical. A hunter should be able to read this and know exactly what to do this week.
- Include specific dollar amounts so hunters can budget.
- Be direct and honest like a seasoned hunting buddy — not corporate, not vague.

STRUCTURE YOUR RESPONSE EXACTLY LIKE THIS:
## This Season's Action Plan
(What to apply for RIGHT NOW — specific states, fees, deadlines, odds)

## Your [X]-Year Roadmap
(Year-by-year breakdown — when to burn points, when to build, when OTC hunts open up)

## Odds & Realistic Expectations
(Honest probability framing for each target species/state)

## States to Start Building Points In
(Any states they should apply to just for points, even if they won't draw for years)

## Pro Tips
(State-specific rules, traps to avoid, money-saving moves)`;

function buildUserMessage(profile: HunterProfile): string {
  const speciesNames = profile.species.map(s => SPECIES_LABELS[s]).join(", ");
  const residencyName = STATE_NAMES[profile.residency] ?? profile.residency;

  const goalText = {
    hunt_often: "Hunt as often as possible — will take any quality tag available",
    one_trophy: "One trophy hunt — willing to wait many years for a premium unit",
    balance: "Balance — wants decent hunts now while building toward something special",
  }[profile.goal];

  // Build points summary
  const pointEntries = Object.entries(profile.pointsByState)
    .filter(([, pts]) => pts > 0)
    .map(([state, pts]) => `  ${STATE_NAMES[state.toUpperCase()] ?? state}: ${pts} pts`)
    .join("\n");

  const zeroPointStates = Object.entries(profile.pointsByState)
    .filter(([, pts]) => pts === 0)
    .map(([state]) => STATE_NAMES[state.toUpperCase()] ?? state)
    .join(", ");

  // Pull relevant state data for context
  const relevantData = huntingData
    .filter(d => profile.species.includes(d.species as SpeciesKey))
    .map(d => {
      const userPts = profile.pointsByState[d.stateId] ?? 0;
      const approxOdds = userPts >= 20 ? d.oddsAt20Pts
        : userPts >= 15 ? d.oddsAt15Pts
        : userPts >= 10 ? d.oddsAt10Pts
        : userPts >= 5 ? d.oddsAt5Pts
        : d.oddsAtZeroPts;
      return `  ${d.stateName} ${SPECIES_LABELS[d.species as SpeciesKey]}: ${d.pointSystem} system, ${d.hasOTC ? "OTC available" : "draw only"}, NR fee $${d.feeNonresident}, ~${Math.round(approxOdds * 100)}% odds at ${userPts} pts, ${d.notes}`;
    })
    .join("\n");

  const upcomingDeadlines = formatDeadlines(profile.species as SpeciesKey[]);

  return `Hunter Profile:
- Residency: ${residencyName}
- Target species: ${speciesNames}
- Hunt method: ${profile.huntType === "any" ? "Any / All methods" : profile.huntType}
- Annual application budget: $${profile.budget.toLocaleString()}
- Goal: ${goalText}
- Planning horizon: ${profile.planningYears} years
- Today's date: ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}

Points accumulated (states where they have points):
${pointEntries || "  None entered — treat as 0 points in all states"}

States entered with 0 points: ${zeroPointStates || "none"}

Relevant state data for context:
${relevantData}

Upcoming application deadlines (next several months):
${upcomingDeadlines}

Build this hunter's complete strategy. Be specific, honest, and actionable. Make it feel like advice from a friend who's been hunting the west for 20 years.`;
}

export async function POST(req: NextRequest) {
  try {
    const { profile } = await req.json() as { profile: HunterProfile };

    if (!profile || !profile.species?.length) {
      return new Response("Invalid profile", { status: 400 });
    }

    const stream = await client.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 2500,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildUserMessage(profile) }],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
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
    console.error("Strategy API error:", err);
    return new Response("Failed to generate strategy. Please try again.", { status: 500 });
  }
}
