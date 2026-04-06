"use client";
import Link from "next/link";
import { SPECIES_EMOJI, SPECIES_LABELS } from "@/lib/huntingData";
import { SpeciesKey } from "@/lib/types";
import AppNav from "@/components/AppNav";
import WaitlistForm from "@/components/WaitlistForm";

const FEATURED_SPECIES: SpeciesKey[] = [
  "elk", "mule_deer", "whitetail", "pronghorn",
  "bighorn_sheep", "mountain_goat", "moose", "black_bear", "bison",
];

const TOOLS = [
  { href: "/find",      emoji: "🔍", title: "Find My Hunt",         desc: "AI matches you to specific units" },
  { href: "/chat",      emoji: "🤖", title: "AI Advisor",           desc: "Ask anything about the West" },
  { href: "/dashboard", emoji: "🗂️", title: "Application Center",   desc: "Official apply links + pre-fill cards" },
  { href: "/otc",       emoji: "🏷️", title: "OTC Tag Finder",       desc: "Hunt this year, no draw needed" },
  { href: "/odds",      emoji: "📊", title: "Draw Odds Calculator", desc: "When will you finally draw?" },
  { href: "/dashboard?tab=deadlines", emoji: "📅", title: "Application Deadlines", desc: "Never miss an application window" },
  { href: "/dashboard?tab=tracker",   emoji: "📋", title: "My Applications",       desc: "Track points, draws & licenses" },
];

const SOCIAL_PROOF = [
  {
    quote: "Burned my 8 Colorado elk points in Year 9 just like the plan said. Drew Unit 54. Best hunt of my life.",
    name: "Jake T.",
    detail: "Non-resident · Colorado Elk",
    emoji: "🦌",
  },
  {
    quote: "Built a 5-state antelope/deer portfolio for under $1,100/year. Never would have figured that out on my own.",
    name: "Maria S.",
    detail: "Texas resident · Multi-state",
    emoji: "🦌",
  },
  {
    quote: "Found an OTC Idaho elk hunt for $650 I can do this fall while my Colorado points keep building.",
    name: "Chris W.",
    detail: "First-time western hunter",
    emoji: "🏔️",
  },
];

const PARTNERS = [
  {
    name: "onX Hunt",
    desc: "Chip-in mapping, land ownership overlays, and offline topo maps for every unit Tag Hunter recommends.",
    tag: "Mapping Layer",
    color: "#f59e0b",
  },
  {
    name: "GoHunt",
    desc: "Deep odds data and unit research to validate the strategy Tag Hunter builds for your points level.",
    tag: "Unit Research",
    color: "#4ade80",
  },
  {
    name: "SpartanForge",
    desc: "Ballistics and trajectory data to back-country ready your rifle for the tag you're about to draw.",
    tag: "Field Prep",
    color: "#60a5fa",
  },
];

export default function Home() {
  return (
    <div className="page">
      <AppNav />

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="topo-bg" style={{
        background: "linear-gradient(180deg, #060d05 0%, #091507 60%, #0b1809 100%)",
        padding: "80px 20px 0",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Amber glow orb */}
        <div style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 320,
          background: "radial-gradient(ellipse, rgba(210,130,10,0.1) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 1,
        }} />

        <div style={{ position: "relative", zIndex: 2, maxWidth: 700, margin: "0 auto", paddingBottom: 80 }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "5px 14px",
            borderRadius: 999,
            background: "rgba(210,130,10,0.1)",
            border: "1px solid rgba(210,130,10,0.25)",
            fontSize: 12,
            fontWeight: 600,
            color: "var(--amber)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: 28,
          }}>
            🌄 Free · No Signup · Built for Hunters
          </div>

          <h1 style={{
            fontSize: "clamp(2.4rem, 6vw, 4rem)",
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: "-0.04em",
            marginBottom: 20,
            color: "var(--text)",
          }}>
            Stop guessing.<br />
            <span className="gradient-text">Start hunting.</span>
          </h1>

          <p style={{
            fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
            color: "var(--text-2)",
            lineHeight: 1.7,
            maxWidth: 560,
            margin: "0 auto 36px",
          }}>
            AI-powered draw strategy for every western big game species.
            Build your personalized 10-year hunt plan in 3 minutes — free.
          </p>

          <Link href="/plan" className="btn-primary" style={{ padding: "16px 40px", fontSize: 17 }}>
            Build My Free Hunt Plan →
          </Link>
          <p style={{ fontSize: 12, color: "var(--text-3)", marginTop: 16 }}>
            No credit card · No signup required · Takes 3 minutes
          </p>
        </div>

        {/* Mountain silhouette */}
        <div style={{ position: "relative", zIndex: 2, lineHeight: 0 }}>
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" style={{ width: "100%", height: 100, display: "block" }}>
            <path d="M0,120 L0,85 L60,75 L130,90 L220,40 L310,70 L420,15 L520,55 L610,30 L700,65 L800,20 L900,58 L1000,35 L1100,68 L1200,45 L1310,72 L1380,55 L1440,65 L1440,120 Z" fill="#0b1809" opacity="0.95"/>
            <path d="M0,120 L0,95 L80,88 L180,100 L280,65 L380,85 L480,50 L580,75 L680,48 L780,78 L880,52 L980,74 L1080,60 L1180,80 L1280,62 L1380,82 L1440,75 L1440,120 Z" fill="#0d1c0b" opacity="0.7"/>
          </svg>
        </div>
      </section>

      {/* ── Stats strip ────────────────────────────────────────────────── */}
      <section style={{
        background: "var(--card)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        padding: "20px",
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", justifyContent: "center", gap: "48px", flexWrap: "wrap" }}>
          {[
            { value: "25+", label: "States Covered" },
            { value: "9",   label: "Big Game Species" },
            { value: "Free", label: "Always & Forever" },
            { value: "AI",  label: "Personalized Plans" },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--amber)", letterSpacing: "-0.03em", lineHeight: 1 }}>
                {s.value}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 600 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Social Proof ───────────────────────────────────────────────── */}
      <section style={{ padding: "72px 20px 0", maxWidth: 900, margin: "0 auto" }}>
        <p className="section-label" style={{ textAlign: "center" }}>Real Hunter Scenarios</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          {SOCIAL_PROOF.map(s => (
            <div key={s.name} className="card" style={{ padding: 24 }}>
              <div style={{ fontSize: "1.6rem", marginBottom: 14 }}>{s.emoji}</div>
              <p style={{ fontSize: 14, color: "var(--text)", lineHeight: 1.7, marginBottom: 14, fontStyle: "italic" }}>
                &ldquo;{s.quote}&rdquo;
              </p>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--amber)" }}>{s.name}</div>
                <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>{s.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────────────────── */}
      <section style={{ padding: "72px 20px 0", maxWidth: 900, margin: "0 auto" }}>
        <p className="section-label" style={{ textAlign: "center" }}>How It Works</p>

        {/* Horizontal stepper */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", gap: 0, marginBottom: 32, overflowX: "auto" }}>
          {[
            { n: "1", title: "Set your goals",    body: "Species, hunt type, budget, and state residency." },
            { n: "2", title: "Enter your points", body: "Preference and bonus points you've built per state." },
            { n: "3", title: "Get your strategy", body: "Year-by-year plan with states, fees, and draw odds." },
          ].map((step, i) => (
            <div key={step.n} style={{ display: "flex", alignItems: "flex-start", minWidth: 0 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", maxWidth: 220, padding: "0 12px" }}>
                <div style={{
                  width: 48, height: 48, borderRadius: "50%",
                  background: "var(--amber)", color: "var(--text-inv)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 900, fontSize: 18, flexShrink: 0,
                  marginBottom: 14, boxShadow: "0 0 0 4px var(--amber-glow)",
                }}>
                  {step.n}
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6, color: "var(--text)", textAlign: "center" }}>{step.title}</div>
                <div style={{ fontSize: 12, color: "var(--text-3)", lineHeight: 1.6, textAlign: "center" }}>{step.body}</div>
              </div>
              {i < 2 && (
                <div style={{ width: 60, height: 2, background: "linear-gradient(90deg, var(--amber), var(--border))", marginTop: 23, flexShrink: 0 }} />
              )}
            </div>
          ))}
        </div>

        {/* Sample plan mockup */}
        <div className="card" style={{ padding: 0, overflow: "hidden", border: "1px solid var(--border-2)" }}>
          <div style={{ padding: "12px 20px", borderBottom: "1px solid var(--border)", background: "var(--bg-elevated)", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f87171" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#4ade80" }} />
            </div>
            <span style={{ fontSize: 12, color: "var(--text-3)", flex: 1, textAlign: "center" }}>Sample Output — Colorado Elk, 8 Points</span>
          </div>
          <div style={{ padding: "20px 24px" }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: "var(--amber)", marginBottom: 10, paddingBottom: 8, borderBottom: "1px solid var(--border)" }}>
              Year-by-Year Strategy
            </div>
            {[
              { year: "2026", action: "Apply CO Unit 37 (9% NR odds at 8 pts) + ID OTC archery elk $696 fallback", type: "apply" },
              { year: "2027", action: "If CO draws: HUNT. If not: bank 9th point — Unit 37 odds hit ~18% at 9 pts", type: "bank" },
              { year: "2028", action: "9 pts Colorado + apply MT Unit 482 (bull elk, ~5% NR odds, builds parallel)", type: "apply" },
              { year: "2029–30", action: "10 pts in CO crosses threshold for Unit 54 access. This is your trophy draw window.", type: "trophy" },
            ].map((row, i) => (
              <div key={i} style={{ display: "flex", gap: 14, padding: "10px 0", borderBottom: i < 3 ? "1px solid var(--border)" : "none", alignItems: "flex-start" }}>
                <div style={{ fontWeight: 800, fontSize: 13, color: "var(--amber)", minWidth: 52, flexShrink: 0 }}>{row.year}</div>
                <div style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.6 }}>{row.action}</div>
                <div style={{ flexShrink: 0 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 999,
                    background: row.type === "trophy" ? "rgba(232,150,15,0.12)" : row.type === "bank" ? "rgba(96,165,250,0.1)" : "rgba(61,168,106,0.1)",
                    border: `1px solid ${row.type === "trophy" ? "rgba(232,150,15,0.3)" : row.type === "bank" ? "rgba(96,165,250,0.25)" : "rgba(61,168,106,0.25)"}`,
                    color: row.type === "trophy" ? "var(--amber)" : row.type === "bank" ? "#60a5fa" : "var(--success)",
                    letterSpacing: "0.04em", textTransform: "uppercase",
                  }}>
                    {row.type === "trophy" ? "Trophy" : row.type === "bank" ? "Bank" : "Apply"}
                  </span>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 14, display: "flex", justifyContent: "center" }}>
              <Link href="/plan" className="btn-primary" style={{ fontSize: 13, padding: "10px 24px" }}>
                Build Your Plan →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Species Grid ───────────────────────────────────────────────── */}
      <section style={{ padding: "72px 20px 0", maxWidth: 900, margin: "0 auto" }}>
        <p className="section-label" style={{ textAlign: "center" }}>All Big Game Covered</p>
        <div className="species-carousel">
          {FEATURED_SPECIES.map(s => (
            <Link
              key={s}
              href={`/plan?species=${s}`}
              className="card card-hover species-card"
            >
              <span style={{ fontSize: "1.5rem" }}>{SPECIES_EMOJI[s]}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-2)", textAlign: "center" }}>{SPECIES_LABELS[s]}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Free Tools ─────────────────────────────────────────────────── */}
      <section style={{
        padding: "72px 20px",
        background: "var(--bg-elevated)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        marginTop: 72,
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p className="section-label" style={{ textAlign: "center" }}>Free Tools</p>
          <div className="tools-carousel">
            {TOOLS.map(tool => (
              <Link
                key={tool.href}
                href={tool.href}
                className="card card-hover tool-card"
              >
                <span style={{ fontSize: "1.4rem", flexShrink: 0, marginTop: 2 }}>{tool.emoji}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>{tool.title}</div>
                  <div style={{ fontSize: 12, color: "var(--text-3)", lineHeight: 1.5 }}>{tool.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison table ───────────────────────────────────────────── */}
      <section style={{ padding: "72px 20px", maxWidth: 900, margin: "0 auto" }}>
        <p className="section-label" style={{ textAlign: "center" }}>How Tag Hunter Compares</p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, minWidth: 420 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "10px 16px", fontSize: 11, color: "var(--text-3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", borderBottom: "1px solid var(--border)" }}>Feature</th>
                <th style={{ textAlign: "center", padding: "10px 16px", fontSize: 13, fontWeight: 800, color: "var(--amber)", borderBottom: "1px solid var(--border)" }}>Tag Hunter</th>
                <th style={{ textAlign: "center", padding: "10px 16px", fontSize: 13, fontWeight: 600, color: "var(--text-3)", borderBottom: "1px solid var(--border)" }}>Typical Paid Service</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["AI-powered personalized strategy",   "✓", "✗"],
                ["Natural language hunt search",        "✓", "✗"],
                ["AI chat advisor (ask anything)",      "✓", "✗"],
                ["Unit-level draw odds data",           "✓", "✓"],
                ["Application deadline tracker",        "✓", "✓"],
                ["Points & license tracker",            "✓", "✓"],
                ["Hunt logbook",                        "✓", "Limited"],
                ["Data sources",                        "State CSVs + AI", "State CSVs"],
                ["Price",                               "Free", "$150–300/yr"],
              ].map(([feat, ours, theirs], i) => (
                <tr key={feat} style={{ background: i % 2 === 0 ? "var(--card)" : "transparent" }}>
                  <td style={{ padding: "11px 16px", fontSize: 13, color: "var(--text-2)", borderBottom: "1px solid var(--border)" }}>{feat}</td>
                  <td style={{ textAlign: "center", padding: "11px 16px", fontSize: 13, fontWeight: 700, color: ours === "✗" ? "var(--danger)" : ours === "✓" ? "var(--success)" : "var(--amber)", borderBottom: "1px solid var(--border)" }}>{ours}</td>
                  <td style={{ textAlign: "center", padding: "11px 16px", fontSize: 13, color: theirs === "✓" ? "var(--text-2)" : theirs === "✗" ? "var(--danger)" : "var(--text-3)", borderBottom: "1px solid var(--border)" }}>{theirs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Ecosystem / Partners ───────────────────────────────────────── */}
      <section style={{ padding: "0 20px 72px", maxWidth: 900, margin: "0 auto" }}>
        <p className="section-label" style={{ textAlign: "center" }}>Works Alongside Your Favorite Tools</p>
        <p style={{ textAlign: "center", fontSize: 14, color: "var(--text-2)", marginBottom: 36, maxWidth: 520, margin: "0 auto 36px" }}>
          Tag Hunter is your planning layer. Pair it with the tools you already trust for mapping, research, and field prep.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          {PARTNERS.map(p => (
            <div key={p.name} className="card" style={{ padding: 24, borderTop: `2px solid ${p.color}` }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: "var(--text)" }}>{p.name}</span>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: `${p.color}18`, border: `1px solid ${p.color}40`, color: p.color, letterSpacing: "0.05em", textTransform: "uppercase" }}>{p.tag}</span>
              </div>
              <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.65 }}>{p.desc}</p>
            </div>
          ))}
        </div>
        <p style={{ textAlign: "center", fontSize: 12, color: "var(--text-3)", marginTop: 20 }}>
          Not affiliated with or officially endorsed by any listed company.
        </p>
      </section>

      {/* ── Waitlist CTA ───────────────────────────────────────────────── */}
      <section className="topo-bg" style={{
        background: "linear-gradient(180deg, #091507 0%, #060d05 100%)",
        padding: "80px 20px",
        textAlign: "center",
        borderTop: "1px solid var(--border)",
      }}>
        <div style={{ position: "relative", zIndex: 2, maxWidth: 560, margin: "0 auto" }}>
          <p style={{ fontSize: 13, color: "var(--amber)", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 12 }}>
            Stay in the loop
          </p>
          <h2 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 12 }}>
            Get notified when new features drop
          </h2>
          <p style={{ fontSize: 14, color: "var(--text-2)", marginBottom: 28, lineHeight: 1.6 }}>
            Real draw odds from state CSVs, deadline push notifications, and more. Join the list.
          </p>
          <WaitlistForm source="homepage-cta" />

          {/* Why Free */}
          <div style={{
            marginTop: 32,
            padding: "18px 22px",
            borderRadius: 12,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            textAlign: "left",
          }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>
              Why is Tag Hunter free?
            </p>
            <p style={{ fontSize: 13, color: "var(--text-3)", lineHeight: 1.7 }}>
              We believe every hunter deserves the same information consultants charge $500 for. Tag Hunter is built by hunters who got tired of the information gap. Free forever.
            </p>
          </div>

          <p style={{ fontSize: 12, color: "var(--text-3)", marginTop: 20 }}>
            Or start now →{" "}
            <Link href="/plan" style={{ color: "var(--amber)" }}>Build your free hunt plan</Link>
          </p>
        </div>
      </section>

      <footer style={{
        textAlign: "center",
        padding: "24px 20px",
        fontSize: 12,
        color: "var(--text-3)",
        borderTop: "1px solid var(--border)",
        display: "flex",
        flexWrap: "wrap",
        gap: "8px 20px",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <span>Tag Hunter is free. Built by <a href="https://f21.ai" style={{ color: "var(--amber)" }}>Factor21</a>.</span>
        <span>Not affiliated with any state agency.</span>
        <Link href="/terms" style={{ color: "var(--text-3)" }}>Terms</Link>
        <Link href="/privacy" style={{ color: "var(--text-3)" }}>Privacy</Link>
      </footer>
    </div>
  );
}
