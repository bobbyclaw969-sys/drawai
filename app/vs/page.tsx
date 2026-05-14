import type { Metadata } from "next";
import Link from "next/link";
import AppNav from "@/components/AppNav";

// ── Design tokens (match /app/page.tsx) ───────────────────────────────────
const SOIL = "#0F0D0A";
const BARK = "#1A1712";
const FENCE = "#2E2A24";
const AMBER = "#D4852A";
const BONE = "#E8DFC8";
const DUST = "#7A6E5F";

// ── Metadata ──────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Tag Hunter vs. TINE, GoHUNT, Eastmans, DHG — Honest Comparison",
  description:
    "How Tag Hunter stacks up against TINE Hunt, GoHUNT INSIDER, Eastmans MRS, and Data Hunt Guide. AI-personalized draw strategy, free during open beta. Honest credit where competitors win.",
  alternates: { canonical: "https://taghunter.us/vs" },
  openGraph: {
    title: "Tag Hunter vs. TINE, GoHUNT, Eastmans, DHG",
    description:
      "AI-personalized western draw strategy, free during open beta. Honest comparison against TINE Hunt, GoHUNT INSIDER, Eastmans MRS, and Data Hunt Guide.",
    url: "https://taghunter.us/vs",
    siteName: "Tag Hunter",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tag Hunter vs. TINE, GoHUNT, Eastmans, DHG",
    description:
      "AI-personalized western draw strategy, free during open beta. Honest comparison vs. the rest of the category.",
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────
type CellValue =
  | { kind: "yes"; note?: string }
  | { kind: "no"; note?: string }
  | { kind: "partial"; note?: string }
  | { kind: "text"; value: string }
  | { kind: "unknown"; note?: string };

const yes = (note?: string): CellValue => ({ kind: "yes", note });
const no = (note?: string): CellValue => ({ kind: "no", note });
const partial = (note?: string): CellValue => ({ kind: "partial", note });
const text = (value: string): CellValue => ({ kind: "text", value });
const tbd = (note = "TBD"): CellValue => ({ kind: "unknown", note });

// ── Competitor columns ────────────────────────────────────────────────────
const COMPETITORS = [
  {
    key: "taghunter",
    name: "Tag Hunter",
    blurb: "Free in open beta · AI-first · live today",
    highlight: true,
  },
  {
    key: "tine",
    name: "TINE Hunt",
    blurb: "Pre-launch · Kickstarter",
    highlight: false,
  },
  {
    key: "gohunt",
    name: "GoHUNT INSIDER",
    blurb: "Incumbent · ~$149/yr",
    highlight: false,
  },
  {
    key: "eastmans",
    name: "Eastmans MRS",
    blurb: "Old-school · ~$50/yr",
    highlight: false,
  },
  {
    key: "dhg",
    name: "Data Hunt Guide",
    blurb: "In-field intel · ~$99/yr",
    highlight: false,
  },
] as const;

type CompetitorKey = (typeof COMPETITORS)[number]["key"];

// ── Feature matrix ────────────────────────────────────────────────────────
// Honest: credit competitors where they win. Unknowns are marked TBD.
const MATRIX: { feature: string; cells: Record<CompetitorKey, CellValue> }[] = [
  {
    feature: "Price",
    cells: {
      taghunter: text("Free — currently in open beta"),
      tine: tbd("Pre-launch via Kickstarter"),
      gohunt: text("~$149/yr (verify on site)"),
      eastmans: text("~$50/yr (verify on site)"),
      dhg: text("~$99/yr (verify on site)"),
    },
  },
  {
    feature: "Available today",
    cells: {
      taghunter: yes("Live in open beta — use it now"),
      tine: no("Pre-launch Kickstarter — not yet shipped"),
      gohunt: yes("Available now"),
      eastmans: yes("Available now"),
      dhg: yes("Available now"),
    },
  },
  {
    feature: "Shipped today",
    cells: {
      taghunter: yes("Live, used daily"),
      tine: no("Kickstarter funded, not yet shipped"),
      gohunt: yes("Mature product, well-funded"),
      eastmans: yes("Long-running members area"),
      dhg: yes("Available now, public-land focus"),
    },
  },
  {
    feature: "AI-personalized strategy",
    cells: {
      taghunter: yes("Multi-year plan in ~3 min"),
      tine: partial("'AI Western Hunt Planner' marketed — TBD what ships"),
      gohunt: no("Filter 2.0 is rules-based, not LLM-personalized"),
      eastmans: no("Editorial research database"),
      dhg: no("ML for sighting heat maps, not planning"),
    },
  },
  {
    feature: "States covered",
    cells: {
      taghunter: text("25+ states"),
      tine: text("12+ western states (claimed)"),
      gohunt: text("All western states"),
      eastmans: text("All western states"),
      dhg: text("Varies by data pack"),
    },
  },
  {
    feature: "Species covered",
    cells: {
      taghunter: text("9 big game species"),
      tine: text("8 species (claimed)"),
      gohunt: text("All western big game"),
      eastmans: text("All western big game"),
      dhg: text("Elk, deer, turkey, pronghorn"),
    },
  },
  {
    feature: "Multi-year point planning",
    cells: {
      taghunter: yes("Year-by-year build to a target tag"),
      tine: tbd(),
      gohunt: yes("Point tracker + Filter 2.0 projections"),
      eastmans: partial("Manual via research data"),
      dhg: no("Not the product's job"),
    },
  },
  {
    feature: "Draw odds calculator",
    cells: {
      taghunter: yes("Unit-level, public agency data"),
      tine: tbd(),
      gohunt: yes("Most polished UX in category"),
      eastmans: yes("Tabular research data"),
      dhg: no(),
    },
  },
  {
    feature: "Application deadlines & reminders",
    cells: {
      taghunter: yes("Tracked across 25+ states"),
      tine: tbd(),
      gohunt: yes("Calendar + alerts"),
      eastmans: partial("Magazine + manual lookup"),
      dhg: no(),
    },
  },
  {
    feature: "In-field intel / sighting heat maps",
    cells: {
      taghunter: no("Application-layer specialist — not our lane"),
      tine: tbd(),
      gohunt: partial("Unit profiles + onX integration"),
      eastmans: partial("Editorial unit write-ups"),
      dhg: yes("Core product — ML heat maps by unit"),
    },
  },
  {
    feature: "Hunt journal / point tracker",
    cells: {
      taghunter: yes("Built-in tracker + logbook"),
      tine: tbd(),
      gohunt: yes("Journal + point tracking"),
      eastmans: partial(),
      dhg: no(),
    },
  },
  {
    feature: "Founder accessibility",
    cells: {
      taghunter: yes("Email the team — 24h fixes on data bugs"),
      tine: partial("Active on Kickstarter updates"),
      gohunt: partial("Editorial layer + support team"),
      eastmans: no("Magazine-tier brand, no direct line"),
      dhg: partial("Small operation, reachable"),
    },
  },
  {
    feature: "Open about data sources",
    cells: {
      taghunter: yes("Public state agency data, cited"),
      tine: tbd(),
      gohunt: partial("Proprietary aggregation"),
      eastmans: partial("Manual editorial sourcing"),
      dhg: partial("Scraped public sightings"),
    },
  },
];

// ── Cell renderer ─────────────────────────────────────────────────────────
function Cell({ value, isHighlight }: { value: CellValue; isHighlight: boolean }) {
  const bg = isHighlight ? "rgba(212, 133, 42, 0.06)" : "transparent";
  const baseStyle = {
    padding: "16px 14px",
    borderBottom: `1px solid ${FENCE}`,
    background: bg,
    verticalAlign: "top" as const,
    fontFamily: "var(--font-dm-mono), monospace",
    fontSize: 13,
    lineHeight: 1.5,
  };

  if (value.kind === "yes") {
    return (
      <td style={baseStyle}>
        <div style={{ color: AMBER, fontSize: 18, lineHeight: 1 }}>✦</div>
        {value.note && (
          <div style={{ color: DUST, fontSize: 11, marginTop: 6 }}>{value.note}</div>
        )}
      </td>
    );
  }
  if (value.kind === "no") {
    return (
      <td style={baseStyle}>
        <div style={{ color: DUST, fontSize: 16, lineHeight: 1 }}>—</div>
        {value.note && (
          <div style={{ color: DUST, fontSize: 11, marginTop: 6 }}>{value.note}</div>
        )}
      </td>
    );
  }
  if (value.kind === "partial") {
    return (
      <td style={baseStyle}>
        <div style={{ color: "#a89880", fontSize: 14, lineHeight: 1 }}>◐</div>
        {value.note && (
          <div style={{ color: DUST, fontSize: 11, marginTop: 6 }}>{value.note}</div>
        )}
      </td>
    );
  }
  if (value.kind === "unknown") {
    return (
      <td style={baseStyle}>
        <div style={{ color: DUST, fontSize: 12, fontStyle: "italic" }}>{value.note}</div>
      </td>
    );
  }
  return (
    <td style={baseStyle}>
      <div style={{ color: BONE, fontSize: 13 }}>{value.value}</div>
    </td>
  );
}

// ── Honest credit blocks ──────────────────────────────────────────────────
const HONEST_CREDIT = [
  {
    name: "GoHUNT INSIDER",
    line:
      "The most polished filter UX in the category. If you want a mature, well-funded product with editorial unit profiles, they earned that spot. We're AI-personalized, open about our data sources, and free during open beta.",
  },
  {
    name: "Eastmans MRS",
    line:
      "Magazine-tier brand and a decades-deep research database. If you're brand-loyal to print-era hunting media, that's real. We're newer, faster, and free during open beta.",
  },
  {
    name: "TINE Hunt",
    line:
      "Smart team chasing the same problem from the application angle. We respect what they're building. The honest difference today: we shipped. They're still pre-launch via Kickstarter.",
  },
  {
    name: "Data Hunt Guide",
    line:
      "Different category — ML-generated sighting heat maps for in-field intel. Their product is not our product. Most serious hunters will want both: plan the draw with us, scout the unit with them.",
  },
  {
    name: "State agency websites",
    line:
      "Free, official, and the source of truth. We're synthesis on top of their data. Always verify against your state agency before paying fees.",
  },
];

// ── Where we lose ─────────────────────────────────────────────────────────
const WHERE_WE_LOSE = [
  "No in-field intel. We don't do sighting heat maps, glassing points, or scouting layers. Use onX or DHG for that.",
  "Younger product. We don't have GoHUNT's decade of editorial unit profiles or Eastmans' archive.",
  "No mobile app yet. We're a web app. Mobile is on the roadmap, not shipped.",
  "AI can be wrong. We label outputs as a starting point, not gospel. Always verify against the state agency before applying.",
];

// ── Page ──────────────────────────────────────────────────────────────────
export default function VsPage() {
  return (
    <div style={{ background: SOIL, color: BONE, minHeight: "100vh" }}>
      <AppNav />
      <div id="main-content" />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "80px 24px 56px",
          maxWidth: 1200,
          margin: "0 auto",
          fontFamily: "var(--font-dm-mono), monospace",
        }}
      >
        <div
          style={{
            color: AMBER,
            fontSize: 12,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: 20,
          }}
        >
          The Honest Comparison
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display), serif",
            fontWeight: 900,
            color: BONE,
            lineHeight: 1.0,
            letterSpacing: "-0.02em",
            fontSize: "clamp(40px, 6vw, 64px)",
            margin: 0,
          }}
        >
          Tag Hunter vs.<br />
          everyone else.
        </h1>
        <p
          style={{
            color: DUST,
            fontSize: 17,
            lineHeight: 1.7,
            maxWidth: 680,
            marginTop: 24,
          }}
        >
          Five tools, one decision. Below is the matrix — with honest credit to
          competitors where they win. We&apos;re not the right answer for every
          hunter. We are the right answer if you want a free, AI-personalized
          multi-year draw strategy that shipped today, not a Kickstarter promise.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 28 }}>
          <Link
            href="/plan"
            style={{
              background: AMBER,
              color: SOIL,
              fontFamily: "var(--font-dm-mono), monospace",
              fontWeight: 500,
              fontSize: 14,
              height: 48,
              padding: "0 24px",
              display: "inline-flex",
              alignItems: "center",
              borderRadius: 0,
              textDecoration: "none",
            }}
          >
            Build My Free Plan →
          </Link>
          <a
            href="#matrix"
            style={{
              color: AMBER,
              fontFamily: "var(--font-dm-mono), monospace",
              fontSize: 14,
              textDecoration: "none",
              height: 48,
              padding: "0 16px",
              display: "inline-flex",
              alignItems: "center",
              borderBottom: `1px solid ${FENCE}`,
            }}
          >
            Jump to the matrix ↓
          </a>
        </div>

        <p
          style={{
            color: DUST,
            fontSize: 11,
            marginTop: 32,
            maxWidth: 680,
            lineHeight: 1.6,
          }}
        >
          Pricing on competitor products is approximate at time of writing.
          Confirm current pricing on the vendor&apos;s site before deciding.
          We are not affiliated with TINE Hunt, GoHUNT, Eastmans, or Data Hunt Guide.
        </p>
      </section>

      {/* ── MATRIX ───────────────────────────────────────────────────── */}
      <section
        id="matrix"
        style={{
          padding: "32px 16px 80px",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            background: BARK,
            border: `1px solid ${FENCE}`,
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: 880,
              fontFamily: "var(--font-dm-mono), monospace",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    padding: "20px 16px",
                    fontSize: 11,
                    color: DUST,
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    fontWeight: 500,
                    borderBottom: `1px solid ${FENCE}`,
                    minWidth: 200,
                    position: "sticky",
                    left: 0,
                    background: BARK,
                    zIndex: 1,
                  }}
                >
                  Feature
                </th>
                {COMPETITORS.map((c) => (
                  <th
                    key={c.key}
                    style={{
                      textAlign: "left",
                      padding: "20px 14px",
                      fontSize: 11,
                      color: c.highlight ? AMBER : DUST,
                      textTransform: "uppercase",
                      letterSpacing: "0.12em",
                      fontWeight: 500,
                      borderBottom: `1px solid ${FENCE}`,
                      minWidth: 150,
                      background: c.highlight ? "rgba(212, 133, 42, 0.08)" : "transparent",
                    }}
                  >
                    <div style={{ color: c.highlight ? AMBER : BONE, fontSize: 13 }}>
                      {c.name}
                    </div>
                    <div
                      style={{
                        color: DUST,
                        fontSize: 10,
                        letterSpacing: "0.05em",
                        textTransform: "none",
                        marginTop: 4,
                        fontWeight: 400,
                      }}
                    >
                      {c.blurb}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MATRIX.map((row, i) => (
                <tr
                  key={row.feature}
                  style={{
                    background: i % 2 === 0 ? BARK : "rgba(26, 23, 18, 0.55)",
                  }}
                >
                  <td
                    style={{
                      padding: "16px 16px",
                      fontSize: 13,
                      color: BONE,
                      borderBottom: `1px solid ${FENCE}`,
                      fontWeight: 500,
                      position: "sticky",
                      left: 0,
                      background: i % 2 === 0 ? BARK : "rgba(26, 23, 18, 0.95)",
                      zIndex: 1,
                    }}
                  >
                    {row.feature}
                  </td>
                  {COMPETITORS.map((c) => (
                    <Cell
                      key={c.key}
                      value={row.cells[c.key]}
                      isHighlight={c.highlight}
                    />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          style={{
            marginTop: 16,
            fontFamily: "var(--font-dm-mono), monospace",
            color: DUST,
            fontSize: 11,
            lineHeight: 1.6,
            display: "flex",
            flexWrap: "wrap",
            gap: 18,
          }}
        >
          <span><span style={{ color: AMBER }}>✦</span> = full support</span>
          <span><span style={{ color: "#a89880" }}>◐</span> = partial / depends</span>
          <span><span style={{ color: DUST }}>—</span> = not offered</span>
          <span style={{ fontStyle: "italic" }}>TBD = unverified / pre-launch</span>
        </div>
      </section>

      {/* ── HONEST CREDIT ────────────────────────────────────────────── */}
      <section
        style={{
          padding: "80px 24px",
          maxWidth: 1000,
          margin: "0 auto",
          fontFamily: "var(--font-dm-mono), monospace",
        }}
      >
        <div
          style={{
            color: AMBER,
            fontSize: 12,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          Honest Credit
        </div>
        <h2
          style={{
            fontFamily: "var(--font-display), serif",
            fontWeight: 700,
            color: BONE,
            fontSize: "clamp(28px, 4vw, 40px)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          Where the others win.
        </h2>
        <p style={{ color: DUST, fontSize: 15, marginTop: 14, maxWidth: 640, lineHeight: 1.7 }}>
          Marketing pages that pretend the competition is bad insult your
          intelligence. Here&apos;s what they do well — straight, with no spin.
        </p>

        <div style={{ display: "grid", gap: 16, marginTop: 36 }}>
          {HONEST_CREDIT.map((c) => (
            <div
              key={c.name}
              style={{
                background: BARK,
                border: `1px solid ${FENCE}`,
                borderLeft: `4px solid ${AMBER}`,
                padding: 24,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display), serif",
                  fontWeight: 700,
                  color: BONE,
                  fontSize: 18,
                  marginBottom: 8,
                  letterSpacing: "-0.01em",
                }}
              >
                {c.name}
              </div>
              <p
                style={{
                  color: "rgba(232, 223, 200, 0.85)",
                  fontSize: 14,
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {c.line}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHERE WE LOSE ────────────────────────────────────────────── */}
      <section
        style={{
          padding: "80px 24px",
          maxWidth: 1000,
          margin: "0 auto",
          fontFamily: "var(--font-dm-mono), monospace",
        }}
      >
        <div
          style={{
            color: AMBER,
            fontSize: 12,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          Where We Lose
        </div>
        <h2
          style={{
            fontFamily: "var(--font-display), serif",
            fontWeight: 700,
            color: BONE,
            fontSize: "clamp(28px, 4vw, 40px)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          We&apos;re not the right tool for everyone.
        </h2>
        <p style={{ color: DUST, fontSize: 15, marginTop: 14, maxWidth: 640, lineHeight: 1.7 }}>
          Trust matters more than puffery. Here&apos;s what we don&apos;t do —
          so you can decide before you waste an afternoon.
        </p>

        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: "32px 0 0",
            display: "grid",
            gap: 12,
          }}
        >
          {WHERE_WE_LOSE.map((line, i) => (
            <li
              key={i}
              style={{
                background: "rgba(26, 23, 18, 0.5)",
                border: `1px solid ${FENCE}`,
                padding: "18px 22px",
                color: BONE,
                fontSize: 14,
                lineHeight: 1.7,
              }}
            >
              <span style={{ color: AMBER, marginRight: 10 }}>•</span>
              {line}
            </li>
          ))}
        </ul>
      </section>

      {/* ── WHERE WE WIN ─────────────────────────────────────────────── */}
      <section
        style={{
          padding: "80px 24px",
          maxWidth: 1000,
          margin: "0 auto",
          fontFamily: "var(--font-dm-mono), monospace",
        }}
      >
        <div
          style={{
            color: AMBER,
            fontSize: 12,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          Where We Win
        </div>
        <h2
          style={{
            fontFamily: "var(--font-display), serif",
            fontWeight: 700,
            color: BONE,
            fontSize: "clamp(28px, 4vw, 40px)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          Free. AI-personalized. Shipped today.
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 16,
            marginTop: 36,
          }}
        >
          {[
            {
              h: "Free during open beta",
              b: "Every other planning product in this matrix is a recurring subscription. We're free while we're in open beta — the whole AI plan, no paywall, no credit card, no gated tiers.",
            },
            {
              h: "AI-personalized, not rules-based",
              b: "Filter 2.0 is great if you already know what you're filtering for. Our AI asks five questions and writes a multi-year plan around your specific points, budget, and goals.",
            },
            {
              h: "Shipped, not pitched",
              b: "TINE is pre-launch. We're live. You can have a plan in 3 minutes before you finish reading this page.",
            },
            {
              h: "Open about our sources",
              b: "We cite the state agency data behind every recommendation. If we're wrong, you can check. If you find a bug, we fix it in 24 hours.",
            },
            {
              h: "Founder reachable",
              b: "Email team@f21.ai. A real person reads it. No ticket queue, no editorial layer between you and the people who built the tool.",
            },
            {
              h: "Application-layer specialist",
              b: "We don't try to be onX. We don't try to be DHG. We do one thing — multi-year draw strategy across 25+ states — and we do it well.",
            },
          ].map((card) => (
            <div
              key={card.h}
              style={{
                background: BARK,
                border: `1px solid ${FENCE}`,
                padding: 24,
              }}
            >
              <div
                style={{
                  color: AMBER,
                  fontSize: 11,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                ◎
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display), serif",
                  fontWeight: 700,
                  color: BONE,
                  fontSize: 18,
                  marginBottom: 10,
                  letterSpacing: "-0.01em",
                  lineHeight: 1.2,
                }}
              >
                {card.h}
              </div>
              <p
                style={{
                  color: DUST,
                  fontSize: 13,
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {card.b}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────── */}
      <section
        style={{
          padding: "100px 24px",
          background: "linear-gradient(180deg, #1A1712 0%, #221A0F 100%)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            maxWidth: 720,
            margin: "0 auto",
            fontFamily: "var(--font-dm-mono), monospace",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display), serif",
              fontWeight: 700,
              color: BONE,
              fontSize: "clamp(28px, 4vw, 38px)",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            Stop comparing. Start drawing.
          </h2>
          <p
            style={{
              color: DUST,
              fontSize: 15,
              marginTop: 14,
              lineHeight: 1.7,
            }}
          >
            Three minutes from now you can have a multi-year strategy in your
            hand. Free, no signup, no credit card.
          </p>
          <div
            style={{
              marginTop: 32,
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 12,
            }}
          >
            <Link
              href="/plan"
              style={{
                background: AMBER,
                color: SOIL,
                fontWeight: 500,
                fontSize: 15,
                height: 52,
                padding: "0 28px",
                display: "inline-flex",
                alignItems: "center",
                borderRadius: 0,
                textDecoration: "none",
              }}
            >
              Build My Free Plan →
            </Link>
            <Link
              href="/about"
              style={{
                color: AMBER,
                fontSize: 14,
                textDecoration: "none",
                height: 52,
                padding: "0 20px",
                display: "inline-flex",
                alignItems: "center",
                border: `1px solid ${FENCE}`,
              }}
            >
              How we built this
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer
        style={{
          background: SOIL,
          borderTop: `1px solid ${FENCE}`,
          padding: "40px 24px",
          fontFamily: "var(--font-dm-mono), monospace",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: 12,
            color: DUST,
          }}
        >
          <div>
            <span style={{ color: AMBER, fontFamily: "var(--font-display), serif", fontWeight: 700 }}>
              ◎ TAG HUNTER
            </span>
            <span style={{ marginLeft: 12 }}>Free western draw strategy.</span>
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <Link href="/about" style={{ color: DUST }}>About</Link>
            <Link href="/faq" style={{ color: DUST }}>FAQ</Link>
            <Link href="/feedback" style={{ color: DUST }}>Feedback</Link>
            <Link href="/terms" style={{ color: DUST }}>Terms</Link>
            <Link href="/privacy" style={{ color: DUST }}>Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
