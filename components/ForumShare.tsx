"use client";
import { useState } from "react";
import { HunterProfile, SpeciesKey } from "@/lib/types";
import { SPECIES_LABELS, STATE_NAMES } from "@/lib/huntingData";

interface Props {
  profile: HunterProfile;
  strategy: string;
}

function buildForumPost(profile: HunterProfile, strategy: string): string {
  const species = profile.species.map(s => SPECIES_LABELS[s as SpeciesKey]).join(", ");
  const state = STATE_NAMES[profile.residency] ?? profile.residency;
  const points = Object.entries(profile.pointsByState)
    .filter(([, pts]) => pts > 0)
    .map(([st, pts]) => `${st.toUpperCase()}: ${pts}`)
    .join(", ");

  // Pull the "This Season" section out of the strategy
  const thisSeasonMatch = strategy.match(/## This Season.*?\n([\s\S]*?)(?=\n## |\n---|\n#|$)/i);
  const thisSeason = thisSeasonMatch
    ? thisSeasonMatch[1].trim().slice(0, 600)
    : strategy.slice(0, 600);

  return `Hey all — ran my situation through Tag Hunter (free AI hunt planner) and wanted to share my strategy and get some feedback from folks who've hunted these states.

**My setup:**
- Residency: ${state}
- Targeting: ${species}
- Method: ${profile.huntType === "any" ? "Any" : profile.huntType.charAt(0).toUpperCase() + profile.huntType.slice(1)}
- Budget: $${profile.budget.toLocaleString()}/year
- Points: ${points || "starting from scratch"}
- Planning horizon: ${profile.planningYears} years

**What the AI recommended for this season:**
${thisSeason}

Anyone hunted these units recently? Curious what the actual conditions/competition look like on the ground. Happy to share the full plan link if useful.

Built with Tag Hunter — free at taghunter.app (no signup, generates a shareable link)`;
}

export default function ForumShare({ profile, strategy }: Props) {
  const [copied, setCopied] = useState<"post" | "link" | null>(null);

  const post = buildForumPost(profile, strategy);
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const copy = async (type: "post" | "link") => {
    const text = type === "post" ? post : shareUrl;
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2500);
  };

  return (
    <div
      className="rounded-xl p-5 mt-5"
      style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
    >
      <h3 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-2)" }}>
        Share on Forums
      </h3>
      <p className="text-xs mb-4" style={{ color: "var(--text-3)" }}>
        Drop this on Rokslide, r/elk, r/bowhunting, or ArcheryTalk to get feedback from hunters who know these units.
      </p>

      <div
        className="rounded-lg p-4 mb-4 text-xs font-mono whitespace-pre-wrap leading-relaxed"
        style={{ backgroundColor: "var(--bg-elevated)", border: "1px solid var(--border)", color: "var(--text-2)", maxHeight: "200px", overflowY: "auto" }}
      >
        {post}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => copy("post")}
          className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-all"
          style={{
            backgroundColor: copied === "post" ? "var(--success-bg)" : "var(--amber)",
            border: copied === "post" ? "1px solid var(--success-border)" : "none",
            color: copied === "post" ? "var(--success)" : "var(--text-inv)",
          }}
        >
          {copied === "post" ? "✓ Copied!" : "Copy Forum Post"}
        </button>
        <button
          onClick={() => copy("link")}
          className="px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
          style={{
            backgroundColor: copied === "link" ? "var(--success-bg)" : "var(--card)",
            border: copied === "link" ? "1px solid var(--success-border)" : "1px solid var(--border)",
            color: copied === "link" ? "var(--success)" : "var(--text-2)",
          }}
        >
          {copied === "link" ? "✓ Copied!" : "Copy Link Only"}
        </button>
      </div>

      <p className="text-xs mt-3" style={{ color: "var(--text-3)" }}>
        Suggested communities: r/elk · r/bowhunting · r/hunting · Rokslide · ArcheryTalk · r/muledeerhunting
      </p>
    </div>
  );
}
