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
  { href: "/find",     emoji: "🔍", title: "Find My Hunt",             desc: "AI matches you to specific units" },
  { href: "/chat",     emoji: "🤖", title: "AI Advisor",               desc: "Ask anything about the West" },
  { href: "/apply",    emoji: "🗂️", title: "Application Center",       desc: "Official apply links + pre-fill cards" },
  { href: "/otc",      emoji: "🏷️", title: "OTC Tag Finder",           desc: "Hunt this year, no draw needed" },
  { href: "/odds",     emoji: "📊", title: "Draw Odds Calculator",     desc: "When will you finally draw?" },
  { href: "/deadlines",emoji: "📅", title: "Application Deadlines",    desc: "Never miss an application window" },
  { href: "/tracker",  emoji: "📋", title: "My Applications",          desc: "Track points, draws & licenses" },
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
        background: "linear-gradient(180deg, #070f06 0%, #0a1808 60%, #0c1a0a 100%)",
        padding: "80px 20px 96px",
        textAlign: "center",
      }}>
        {/* Amber glow orb */}
        <div style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 500,
          height: 300,
          background: "radial-gradient(ellipse, rgba(232,150,15,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 1,
        }} />

        <div style={{ position: "relative", zIndex: 2, maxWidth: 700, margin: "0 auto" }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "5px 14px",
            borderRadius: 999,
            background: "rgba(232,150,15,0.1)",
            border: "1px solid rgba(232,150,15,0.25)",
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

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/find" className="btn-primary" style={{ padding: "14px 32px", fontSize: 16 }}>
              Find My Hunt →
            </Link>
            <Link href="/plan" className="btn-ghost" style={{ padding: "14px 24px", fontSize: 15 }}>
              Build Full Plan
            </Link>
          </div>
          <p style={{ fontSize: 12, color: "var(--text-3)", marginTop: 20 }}>
            Free · No credit card · No signup required
          </p>
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

      {/* ── How It Works ───────────────────────────────────────────────── */}
      <section style={{ padding: "72px 20px", maxWidth: 900, margin: "0 auto" }}>
        <p className="section-label" style={{ textAlign: "center" }}>How It Works</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          {[
            { n: "01", title: "Set your goals",     body: "Species, hunt type, budget, and what kind of adventure you're after." },
            { n: "02", title: "Enter your points",  body: "Preference and bonus points you've built in each state, species, and system." },
            { n: "03", title: "Get your strategy",  body: "Year-by-year plan with specific states, fees, deadlines, and draw probabilities." },
          ].map(step => (
            <div key={step.n} className="card" style={{ padding: 24 }}>
              <div style={{ fontSize: "2rem", fontWeight: 900, color: "var(--border-3)", letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 12 }}>
                {step.n}
              </div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8, color: "var(--text)" }}>{step.title}</div>
              <div style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.65 }}>{step.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Species Grid ───────────────────────────────────────────────── */}
      <section style={{ padding: "0 20px 72px", maxWidth: 900, margin: "0 auto" }}>
        <p className="section-label" style={{ textAlign: "center" }}>All Big Game Covered</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 12 }}>
          {FEATURED_SPECIES.map(s => (
            <Link
              key={s}
              href={`/plan?species=${s}`}
              className="card card-hover"
              style={{ padding: "16px 12px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
            >
              <span style={{ fontSize: "1.8rem" }}>{SPECIES_EMOJI[s]}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)" }}>{SPECIES_LABELS[s]}</span>
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
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p className="section-label" style={{ textAlign: "center" }}>Free Tools</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
            {TOOLS.map(tool => (
              <Link
                key={tool.href}
                href={tool.href}
                className="card card-hover"
                style={{ padding: 20, display: "flex", alignItems: "flex-start", gap: 14 }}
              >
                <span style={{ fontSize: "1.5rem", flexShrink: 0, marginTop: 2 }}>{tool.emoji}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>{tool.title}</div>
                  <div style={{ fontSize: 12, color: "var(--text-3)", lineHeight: 1.5 }}>{tool.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── vs GoHunt comparison ───────────────────────────────────────── */}
      <section style={{ padding: "72px 20px", maxWidth: 900, margin: "0 auto" }}>
        <p className="section-label" style={{ textAlign: "center" }}>How Tag Hunter Compares</p>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, minWidth: 420 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "10px 16px", fontSize: 11, color: "var(--text-3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", borderBottom: "1px solid var(--border)" }}>Feature</th>
                <th style={{ textAlign: "center", padding: "10px 16px", fontSize: 13, fontWeight: 800, color: "var(--amber)", borderBottom: "1px solid var(--border)" }}>Tag Hunter</th>
                <th style={{ textAlign: "center", padding: "10px 16px", fontSize: 13, fontWeight: 600, color: "var(--text-3)", borderBottom: "1px solid var(--border)" }}>GoHunt Insider+</th>
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
                ["Price",                               "Free", "$150–300/yr"],
              ].map(([feat, ours, theirs], i) => (
                <tr key={feat} style={{ background: i % 2 === 0 ? "var(--card)" : "transparent" }}>
                  <td style={{ padding: "11px 16px", fontSize: 13, color: "var(--text-2)", borderBottom: "1px solid var(--border)" }}>{feat}</td>
                  <td style={{ textAlign: "center", padding: "11px 16px", fontSize: 13, fontWeight: 700, color: ours === "✗" ? "var(--danger)" : "var(--success)", borderBottom: "1px solid var(--border)" }}>{ours}</td>
                  <td style={{ textAlign: "center", padding: "11px 16px", fontSize: 13, color: theirs === "✓" ? "var(--text-2)" : theirs === "✗" ? "var(--danger)" : "var(--text-3)", borderBottom: "1px solid var(--border)" }}>{theirs}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ fontSize: 11, color: "var(--text-3)", marginTop: 10, paddingLeft: 4 }}>GoHunt is a trademark of its respective owner. Tag Hunter is not affiliated with GoHunt.</p>
        </div>
      </section>

      {/* ── Ecosystem / Partners ───────────────────────────────────────── */}
      <section style={{ padding: "72px 20px", maxWidth: 900, margin: "0 auto" }}>
        <p className="section-label" style={{ textAlign: "center" }}>Works Alongside Your Favorite Tools</p>
        <p style={{ textAlign: "center", fontSize: 14, color: "var(--text-2)", marginBottom: 36, maxWidth: 520, margin: "0 auto 36px" }}>
          Tag Hunter is your planning layer. Pair it with the tools you already trust for mapping, research, and field prep.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          {PARTNERS.map(p => (
            <div
              key={p.name}
              className="card"
              style={{ padding: 24, borderTop: `2px solid ${p.color}` }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: "var(--text)" }}>{p.name}</span>
                <span style={{
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: 999,
                  background: `${p.color}18`,
                  border: `1px solid ${p.color}40`,
                  color: p.color,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}>
                  {p.tag}
                </span>
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
        background: "linear-gradient(180deg, #0a1808 0%, #070f06 100%)",
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
            New states, real draw data from state CSVs, push notifications, and more — join the list and we&apos;ll let you know first.
          </p>
          <WaitlistForm source="homepage-cta" />
          <p style={{ fontSize: 12, color: "var(--text-3)", marginTop: 16 }}>
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
