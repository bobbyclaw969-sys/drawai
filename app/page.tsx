"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PlanTimeline from "@/components/PlanTimeline";
import WaitlistForm from "@/components/WaitlistForm";

// ── Constants ──────────────────────────────────────────────────────────────
const SOIL = "#0F0D0A";
const BARK = "#1A1712";
const FENCE = "#2E2A24";
const AMBER = "#D4852A";
const GLOW = "#F0A040";
const BONE = "#E8DFC8";
const DUST = "#7A6E5F";

const NAV_LINKS = [
  { href: "/find", label: "Find My Hunt" },
  { href: "/chat", label: "AI Advisor" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/plan", label: "Build Plan" },
];

// ── Species SVGs (clean recognizable silhouettes at 64x64) ────────────────
const SpeciesSVG = ({ species, size = 36 }: { species: string; size?: number }) => {
  const props = {
    viewBox: "0 0 64 64",
    width: size,
    height: size,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (species) {
    case "elk":
      return (
        <svg {...props}>
          {/* Massive antlers */}
          <path d="M22 16 L14 6 M14 6 L8 8 M14 6 L10 12 M14 6 L18 10" />
          <path d="M42 16 L50 6 M50 6 L56 8 M50 6 L54 12 M50 6 L46 10" />
          {/* Head */}
          <path d="M22 18 Q22 14 32 14 Q42 14 42 18 L42 28 Q42 32 38 32 L26 32 Q22 32 22 28 Z" />
          {/* Snout */}
          <path d="M28 32 L28 38 Q28 42 32 42 Q36 42 36 38 L36 32" />
          {/* Eye */}
          <circle cx="27" cy="22" r="1" fill="currentColor" />
          <circle cx="37" cy="22" r="1" fill="currentColor" />
        </svg>
      );
    case "mule_deer":
      return (
        <svg {...props}>
          {/* Forked antlers */}
          <path d="M22 18 L18 8 M18 8 L14 4 M18 8 L22 10" />
          <path d="M42 18 L46 8 M46 8 L50 4 M46 8 L42 10" />
          {/* Head — narrower */}
          <path d="M24 20 Q24 16 32 16 Q40 16 40 20 L40 30 Q40 34 36 34 L28 34 Q24 34 24 30 Z" />
          {/* Snout */}
          <path d="M28 34 L28 42 Q28 46 32 46 Q36 46 36 42 L36 34" />
          {/* Big mule ears */}
          <ellipse cx="20" cy="20" rx="3" ry="6" />
          <ellipse cx="44" cy="20" rx="3" ry="6" />
          <circle cx="28" cy="24" r="1" fill="currentColor" />
          <circle cx="36" cy="24" r="1" fill="currentColor" />
        </svg>
      );
    case "whitetail":
      return (
        <svg {...props}>
          {/* Whitetail antlers — curved up */}
          <path d="M22 16 Q18 8 14 6" />
          <path d="M22 16 Q22 10 24 8" />
          <path d="M42 16 Q46 8 50 6" />
          <path d="M42 16 Q42 10 40 8" />
          {/* Head */}
          <path d="M24 18 Q24 14 32 14 Q40 14 40 18 L40 30 Q40 34 36 34 L28 34 Q24 34 24 30 Z" />
          {/* Snout */}
          <path d="M28 34 L28 42 Q28 46 32 46 Q36 46 36 42 L36 34" />
          <circle cx="28" cy="22" r="1" fill="currentColor" />
          <circle cx="36" cy="22" r="1" fill="currentColor" />
        </svg>
      );
    case "pronghorn":
      return (
        <svg {...props}>
          {/* Pronghorn distinctive curved horns with prong */}
          <path d="M22 16 Q20 6 24 4" />
          <path d="M22 12 L18 10" />
          <path d="M42 16 Q44 6 40 4" />
          <path d="M42 12 L46 10" />
          {/* Head */}
          <path d="M24 18 Q24 14 32 14 Q40 14 40 18 L40 28 Q40 32 36 32 L28 32 Q24 32 24 28 Z" />
          {/* Snout */}
          <path d="M28 32 L28 40 Q28 44 32 44 Q36 44 36 40 L36 32" />
          <circle cx="28" cy="22" r="1" fill="currentColor" />
          <circle cx="36" cy="22" r="1" fill="currentColor" />
        </svg>
      );
    case "bighorn_sheep":
      return (
        <svg {...props}>
          {/* Massive curling horns */}
          <path d="M22 18 Q10 18 8 26 Q8 34 18 32" />
          <path d="M42 18 Q54 18 56 26 Q56 34 46 32" />
          {/* Head */}
          <path d="M22 20 Q22 16 32 16 Q42 16 42 20 L42 30 Q42 34 38 34 L26 34 Q22 34 22 30 Z" />
          {/* Snout */}
          <path d="M28 34 L28 42 Q28 46 32 46 Q36 46 36 42 L36 34" />
          <circle cx="27" cy="24" r="1" fill="currentColor" />
          <circle cx="37" cy="24" r="1" fill="currentColor" />
        </svg>
      );
    case "mountain_goat":
      return (
        <svg {...props}>
          {/* Short straight back-curved horns */}
          <path d="M24 16 Q22 8 26 4" />
          <path d="M40 16 Q42 8 38 4" />
          {/* Head with beard */}
          <path d="M24 18 Q24 14 32 14 Q40 14 40 18 L40 30 Q40 34 36 34 L28 34 Q24 34 24 30 Z" />
          {/* Snout + beard */}
          <path d="M28 34 L28 42 Q28 46 32 46 Q36 46 36 42 L36 34" />
          <path d="M30 46 L29 52 M34 46 L35 52" />
          <circle cx="28" cy="22" r="1" fill="currentColor" />
          <circle cx="36" cy="22" r="1" fill="currentColor" />
        </svg>
      );
    case "moose":
      return (
        <svg {...props}>
          {/* Wide palmate antlers */}
          <path d="M20 14 L8 8 M20 14 L8 14 M20 14 L10 20 M20 14 L14 6" />
          <path d="M44 14 L56 8 M44 14 L56 14 M44 14 L54 20 M44 14 L50 6" />
          {/* Long moose head */}
          <path d="M22 18 Q22 14 32 14 Q42 14 42 18 L42 28 Q42 32 38 32 L26 32 Q22 32 22 28 Z" />
          {/* Long snout (moose signature) */}
          <path d="M26 32 L26 46 Q26 52 32 52 Q38 52 38 46 L38 32" />
          {/* Dewlap */}
          <path d="M30 50 Q32 56 34 50" />
          <circle cx="27" cy="22" r="1" fill="currentColor" />
          <circle cx="37" cy="22" r="1" fill="currentColor" />
        </svg>
      );
    case "black_bear":
      return (
        <svg {...props}>
          {/* Round bear ears */}
          <circle cx="18" cy="14" r="5" />
          <circle cx="46" cy="14" r="5" />
          {/* Round head */}
          <path d="M14 22 Q14 14 32 14 Q50 14 50 22 L50 38 Q50 46 32 46 Q14 46 14 38 Z" />
          {/* Snout */}
          <ellipse cx="32" cy="38" rx="6" ry="4" />
          <circle cx="32" cy="36" r="1" fill="currentColor" />
          {/* Eyes */}
          <circle cx="24" cy="26" r="1.5" fill="currentColor" />
          <circle cx="40" cy="26" r="1.5" fill="currentColor" />
        </svg>
      );
    case "bison":
      return (
        <svg {...props}>
          {/* Massive shoulder hump */}
          <path d="M10 28 Q10 16 22 14 Q34 12 34 22" />
          {/* Curved horns */}
          <path d="M22 22 Q16 18 18 14" />
          <path d="M42 22 Q48 18 46 14" />
          {/* Head */}
          <path d="M22 24 Q22 18 32 18 Q42 18 42 24 L42 36 Q42 42 36 42 L28 42 Q22 42 22 36 Z" />
          {/* Snout */}
          <path d="M28 42 L28 50 Q28 54 32 54 Q36 54 36 50 L36 42" />
          {/* Beard */}
          <path d="M30 54 L29 60 M34 54 L35 60" />
          <circle cx="28" cy="28" r="1" fill="currentColor" />
          <circle cx="36" cy="28" r="1" fill="currentColor" />
        </svg>
      );
    default:
      return null;
  }
};

const SPECIES_GRID = [
  { slug: "elk", name: "Elk" },
  { slug: "mule_deer", name: "Mule Deer" },
  { slug: "whitetail", name: "Whitetail" },
  { slug: "pronghorn", name: "Pronghorn" },
  { slug: "bighorn_sheep", name: "Bighorn Sheep" },
  { slug: "mountain_goat", name: "Mountain Goat" },
  { slug: "moose", name: "Moose" },
  { slug: "black_bear", name: "Black Bear" },
  { slug: "bison", name: "Bison" },
];

// ── CSS Tool Icons ─────────────────────────────────────────────────────────
const ToolIcon = ({ kind }: { kind: string }) => {
  const base = { width: 24, height: 24, color: AMBER };
  switch (kind) {
    case "crosshair":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={base}>
          <circle cx="12" cy="12" r="9" />
          <line x1="12" y1="2" x2="12" y2="22" />
          <line x1="2" y1="12" x2="22" y2="12" />
        </svg>
      );
    case "chat":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={base}>
          <path d="M21 12a8 8 0 0 1-8 8H7l-4 3v-4a8 8 0 0 1 16-7z" />
        </svg>
      );
    case "grid":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={base}>
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
      );
    case "tag":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={base}>
          <path d="M3 12V3h9l9 9-9 9z" />
          <circle cx="7" cy="7" r="1" fill="currentColor" />
        </svg>
      );
    case "bars":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={base}>
          <line x1="6" y1="20" x2="6" y2="14" />
          <line x1="12" y1="20" x2="12" y2="9" />
          <line x1="18" y1="20" x2="18" y2="4" />
        </svg>
      );
    case "clock":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={base}>
          <circle cx="12" cy="12" r="9" />
          <line x1="12" y1="12" x2="12" y2="6" />
        </svg>
      );
    case "list":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={base}>
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
      );
  }
  return null;
};

const TOOLS = [
  { icon: "crosshair", title: "Find My Hunt", desc: "AI matches you to specific units in seconds.", href: "/find" },
  { icon: "chat", title: "AI Advisor", desc: "Ask anything about western hunting in plain English.", href: "/chat" },
  { icon: "grid", title: "Application Center", desc: "Step-by-step guides for every state portal.", href: "/dashboard" },
  { icon: "tag", title: "OTC Tag Finder", desc: "Hunt this year — no draw needed.", href: "/otc" },
  { icon: "bars", title: "Draw Odds Calculator", desc: "When will you finally draw that tag?", href: "/odds" },
  { icon: "clock", title: "Application Deadlines", desc: "Never miss another window.", href: "/dashboard?tab=deadlines" },
  { icon: "list", title: "My Applications", desc: "Track points, draws, and licenses.", href: "/dashboard?tab=tracker" },
];

const TESTIMONIALS = [
  {
    species: "elk",
    quote: "Burned my 8 Colorado elk points in Year 9 just like the plan said. Drew Unit 54. Best hunt of my life.",
    name: "Jake T.",
    tag: "Non-resident · Colorado Elk",
  },
  {
    species: "pronghorn",
    quote: "Built a 5-state antelope/deer portfolio for under $1,100/year. Never would have figured that out on my own.",
    name: "Maria S.",
    tag: "Texas resident · Multi-state",
  },
  {
    species: "mule_deer",
    quote: "Found an OTC Idaho elk hunt for $650 I can do this fall while my Colorado points keep building.",
    name: "Chris W.",
    tag: "First-time western hunter",
  },
];

const COMPARISON = [
  ["AI-powered personalized strategy", true, false],
  ["Natural language hunt search", true, false],
  ["AI chat advisor (ask anything)", true, false],
  ["Unit-level draw odds data", true, true],
  ["Application deadline tracker", true, true],
  ["Points & license tracker", true, true],
  ["Hunt logbook", true, "Limited"],
  ["Data sources", "State CSVs + AI", "State CSVs"],
];

const PARTNERS = [
  { name: "onX Hunt", role: "Mapping Layer" },
  { name: "GoHunt", role: "Unit Research" },
  { name: "SpartanForge", role: "Field Prep" },
];

// ── Animation variants ────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0 },
};

const heroStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

// ── Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.body.classList.add("editorial");
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.body.classList.remove("editorial");
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div style={{ background: SOIL, color: BONE, fontFamily: "var(--font-dm-mono), monospace", position: "relative" }}>
      <div id="main-content" />

      {/* ── NAV ────────────────────────────────────────────────────────── */}
      <nav
        role="navigation"
        aria-label="Main"
        className="sticky top-0 z-50"
        style={{
          background: SOIL,
          borderBottom: "none",
          boxShadow: scrolled ? "0 2px 24px rgba(0,0,0,0.5)" : "none",
          transition: "box-shadow 0.2s",
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12 py-4">
          <Link href="/" className="flex items-center gap-2" style={{ color: AMBER, fontFamily: "var(--font-display), serif", fontWeight: 700, fontSize: 22, letterSpacing: "-0.01em" }}>
            ◎ TAG HUNTER
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className="uppercase transition-colors hover:text-amber-brand"
                style={{ color: BONE, fontFamily: "var(--font-dm-mono), monospace", fontSize: 13, letterSpacing: "0.1em" }}
                onMouseEnter={e => (e.currentTarget.style.color = AMBER)}
                onMouseLeave={e => (e.currentTarget.style.color = BONE)}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/plan"
              style={{
                background: AMBER,
                color: SOIL,
                fontFamily: "var(--font-dm-mono), monospace",
                fontWeight: 500,
                fontSize: 13,
                height: 44,
                padding: "0 24px",
                display: "inline-flex",
                alignItems: "center",
                borderRadius: 0,
              }}
            >
              Build Free Plan →
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden"
            onClick={() => setNavOpen(v => !v)}
            aria-label="Toggle menu"
            aria-expanded={navOpen}
            style={{ color: BONE, background: "none", border: "none", fontSize: 24, cursor: "pointer" }}
          >
            {navOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile overlay */}
        {navOpen && (
          <div
            role="menu"
            className="md:hidden flex flex-col gap-4 px-6 pb-6"
            style={{ background: SOIL }}
          >
            {NAV_LINKS.map(l => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setNavOpen(false)}
                className="uppercase"
                style={{ color: BONE, fontFamily: "var(--font-dm-mono), monospace", fontSize: 14, letterSpacing: "0.1em", padding: "8px 0" }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/plan"
              onClick={() => setNavOpen(false)}
              style={{
                background: AMBER,
                color: SOIL,
                fontFamily: "var(--font-dm-mono), monospace",
                fontWeight: 500,
                fontSize: 13,
                height: 44,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 8,
              }}
            >
              Build Free Plan →
            </Link>
          </div>
        )}
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section className="relative" style={{ height: "100vh", minHeight: 640, overflow: "hidden" }}>
        {/* Layered hero background — always works, no external dependencies */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ background: SOIL }}>
          {/* Deep forest gradient base */}
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at 70% 30%, #2a1f12 0%, #1a1410 30%, #0F0D0A 70%)",
            }}
          />

          {/* Topographic line pattern (mountain ridges) */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1440 900"
            preserveAspectRatio="xMidYMid slice"
            style={{ opacity: 0.55 }}
          >
            <defs>
              <linearGradient id="topoFade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D4852A" stopOpacity="0.22" />
                <stop offset="60%" stopColor="#D4852A" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#D4852A" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Distant ridge */}
            <path d="M0,520 L80,480 L180,510 L280,450 L380,490 L480,440 L580,470 L680,420 L780,460 L880,430 L980,470 L1080,440 L1180,480 L1280,450 L1380,470 L1440,460 L1440,900 L0,900 Z" fill="#1a1410" />
            <path d="M0,520 L80,480 L180,510 L280,450 L380,490 L480,440 L580,470 L680,420 L780,460 L880,430 L980,470 L1080,440 L1180,480 L1280,450 L1380,470 L1440,460" fill="none" stroke="#D4852A" strokeWidth="1.5" strokeOpacity="0.4" />

            {/* Mid ridge */}
            <path d="M0,620 L100,580 L220,610 L340,550 L460,590 L580,540 L700,580 L820,520 L940,560 L1060,530 L1180,570 L1300,540 L1440,560 L1440,900 L0,900 Z" fill="#0f0c08" />
            <path d="M0,620 L100,580 L220,610 L340,550 L460,590 L580,540 L700,580 L820,520 L940,560 L1060,530 L1180,570 L1300,540 L1440,560" fill="none" stroke="#D4852A" strokeWidth="1.5" strokeOpacity="0.5" />

            {/* Front ridge — darkest */}
            <path d="M0,750 L120,700 L240,730 L360,680 L480,720 L600,670 L720,710 L840,660 L960,700 L1080,650 L1200,690 L1320,650 L1440,680 L1440,900 L0,900 Z" fill="#070605" />
            <path d="M0,750 L120,700 L240,730 L360,680 L480,720 L600,670 L720,710 L840,660 L960,700 L1080,650 L1200,690 L1320,650 L1440,680" fill="none" stroke="#D4852A" strokeWidth="1.5" strokeOpacity="0.35" />

            {/* Sky topo lines */}
            <g stroke="#D4852A" strokeOpacity="0.08" fill="none" strokeWidth="1">
              <path d="M0,200 Q360,180 720,210 T1440,190" />
              <path d="M0,250 Q360,230 720,260 T1440,240" />
              <path d="M0,300 Q360,280 720,310 T1440,290" />
              <path d="M0,350 Q360,330 720,360 T1440,340" />
              <path d="M0,400 Q360,380 720,410 T1440,390" />
            </g>
          </svg>

          {/* Amber sun glow orb — top right */}
          <div
            className="absolute"
            style={{
              top: "8%",
              right: "12%",
              width: 480,
              height: 480,
              background: "radial-gradient(circle, rgba(240, 160, 64, 0.25) 0%, rgba(212, 133, 42, 0.1) 35%, transparent 70%)",
              filter: "blur(40px)",
              animation: "ctaPulse 8s ease-in-out infinite",
            }}
          />

          {/* Vignette */}
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at center, transparent 40%, rgba(15,13,10,0.85) 100%)",
            }}
          />

          {/* Bottom fade to soil */}
          <div
            className="absolute inset-x-0 bottom-0"
            style={{
              height: "40%",
              background: "linear-gradient(180deg, transparent 0%, rgba(15,13,10,0.95) 100%)",
            }}
          />
        </div>

        {/* Hero content */}
        <div className="relative h-full flex items-end pb-16 md:pb-24">
          <motion.div
            variants={heroStagger}
            initial="hidden"
            animate="show"
            className="max-w-5xl w-full px-8 md:px-16"
          >
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{
                fontFamily: "var(--font-dm-mono), monospace",
                color: AMBER,
                fontSize: 12,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: 24,
              }}
            >
              Free · No Signup · Built for Hunters
            </motion.div>

            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{
                fontFamily: "var(--font-display), serif",
                fontWeight: 900,
                color: BONE,
                lineHeight: 0.95,
                letterSpacing: "-0.02em",
                fontSize: "clamp(52px, 8vw, 88px)",
                margin: 0,
              }}
            >
              Stop guessing.<br />
              Start drawing.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{
                fontFamily: "var(--font-dm-mono), monospace",
                color: DUST,
                fontSize: 18,
                lineHeight: 1.6,
                maxWidth: 500,
                marginTop: 24,
              }}
            >
              AI-powered draw strategy for every western big game species. Build your personalized 10-year hunt plan in 3 minutes — free.
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-wrap gap-4 items-center"
              style={{ marginTop: 32 }}
            >
              <Link
                href="/plan"
                className="cta-pulse"
                style={{
                  background: AMBER,
                  color: SOIL,
                  fontFamily: "var(--font-dm-mono), monospace",
                  fontWeight: 500,
                  fontSize: 16,
                  height: 56,
                  padding: "0 32px",
                  display: "inline-flex",
                  alignItems: "center",
                  borderRadius: 0,
                }}
                onMouseEnter={e => (e.currentTarget.style.background = GLOW)}
                onMouseLeave={e => (e.currentTarget.style.background = AMBER)}
              >
                Build My Free Hunt Plan →
              </Link>
              <a
                href="#sample-plan"
                style={{
                  color: AMBER,
                  fontFamily: "var(--font-dm-mono), monospace",
                  fontSize: 14,
                  textDecoration: "none",
                  borderBottom: "1px solid transparent",
                }}
                onMouseEnter={e => (e.currentTarget.style.borderBottomColor = AMBER)}
                onMouseLeave={e => (e.currentTarget.style.borderBottomColor = "transparent")}
              >
                See a sample plan ↓
              </a>
            </motion.div>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-wrap gap-3"
              style={{ marginTop: 24 }}
            >
              {["25+ States", "9 Species", "Always Free", "AI-Personalized"].map(p => (
                <span
                  key={p}
                  style={{
                    border: `1px solid ${FENCE}`,
                    background: "rgba(26, 23, 18, 0.5)",
                    backdropFilter: "blur(4px)",
                    color: BONE,
                    fontFamily: "var(--font-dm-mono), monospace",
                    fontSize: 12,
                    padding: "6px 14px",
                  }}
                >
                  {p}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 3: From the Field ──────────────────────────────────── */}
      <section style={{ padding: "120px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p style={{ fontFamily: "var(--font-dm-mono), monospace", color: AMBER, fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>
            Hunter Stories
          </p>
          <h2 style={{ fontFamily: "var(--font-display), serif", fontWeight: 700, color: BONE, fontSize: 42, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
            From the Field
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              style={{
                background: BARK,
                borderLeft: `4px solid ${AMBER}`,
                padding: 28,
                position: "relative",
              }}
            >
              <div style={{ position: "absolute", top: 16, right: 16, color: AMBER, opacity: 0.6 }}>
                <SpeciesSVG species={t.species} />
              </div>
              <p
                style={{
                  fontFamily: "var(--font-dm-mono), monospace",
                  fontSize: 15,
                  fontStyle: "italic",
                  color: "rgba(232, 223, 200, 0.9)",
                  lineHeight: 1.6,
                  marginBottom: 20,
                  paddingRight: 30,
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>
              <div style={{ fontFamily: "var(--font-dm-mono), monospace", color: AMBER, fontSize: 13, fontWeight: 500, marginTop: 16 }}>
                {t.name}
              </div>
              <div style={{ fontFamily: "var(--font-dm-mono), monospace", color: DUST, fontSize: 12, marginTop: 4 }}>
                {t.tag}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── SECTION 4: How It Works ────────────────────────────────────── */}
      <section style={{ padding: "120px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          style={{
            fontFamily: "var(--font-display), serif",
            fontWeight: 700,
            color: BONE,
            fontSize: 42,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: 80,
          }}
        >
          How It Works
        </motion.h2>

        <div className="relative">
          {/* Dashed connector — desktop only */}
          <div
            className="hidden md:block absolute left-0 right-0"
            style={{
              top: 60,
              borderTop: `2px dashed ${AMBER}`,
              opacity: 0.4,
              left: "16%",
              right: "16%",
            }}
          />

          <div className="grid md:grid-cols-3 gap-12 md:gap-8 relative">
            {[
              { n: "1", title: "Set Your Goals", body: "Species, hunt type, resident status, and budget." },
              { n: "2", title: "Enter Your Points", body: "Preference and bonus points per state, per species." },
              { n: "3", title: "Get Your Strategy", body: "Year-by-year plan with states, fees, and draw odds." },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative text-center md:text-left"
                style={{ minHeight: 200 }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-display), serif",
                    fontWeight: 900,
                    fontSize: 120,
                    color: AMBER,
                    opacity: 0.15,
                    position: "absolute",
                    top: -30,
                    left: 0,
                    lineHeight: 1,
                    pointerEvents: "none",
                    zIndex: 0,
                  }}
                >
                  {step.n}
                </div>
                <div style={{ position: "relative", zIndex: 1, paddingTop: 60 }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-display), serif",
                      fontWeight: 700,
                      fontSize: 28,
                      color: BONE,
                      marginBottom: 12,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-dm-mono), monospace",
                      fontSize: 15,
                      color: DUST,
                      lineHeight: 1.6,
                    }}
                  >
                    {step.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: Sample Plan Timeline ────────────────────────────── */}
      <section id="sample-plan" style={{ padding: "120px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p style={{ fontFamily: "var(--font-dm-mono), monospace", color: AMBER, fontSize: 12, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>
            Sample Plan Output
          </p>
          <h2 style={{ fontFamily: "var(--font-display), serif", fontWeight: 700, color: BONE, fontSize: 42, lineHeight: 1.1, letterSpacing: "-0.02em" }}>
            See It In Action
          </h2>
          <p style={{ fontFamily: "var(--font-dm-mono), monospace", color: DUST, fontSize: 16, marginTop: 8 }}>
            Colorado Elk · 8 Preference Points
          </p>
        </motion.div>

        <PlanTimeline />

        <div className="mt-16 text-center">
          <Link
            href="/plan"
            style={{
              display: "inline-block",
              padding: "16px 32px",
              border: `2px solid ${AMBER}`,
              color: AMBER,
              fontFamily: "var(--font-dm-mono), monospace",
              fontWeight: 500,
              fontSize: 14,
              background: "transparent",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = AMBER;
              e.currentTarget.style.color = SOIL;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = AMBER;
            }}
          >
            Build Your Plan →
          </Link>
        </div>
      </section>

      {/* ── SECTION 6: Species Grid ────────────────────────────────────── */}
      <section style={{ padding: "120px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          style={{
            fontFamily: "var(--font-display), serif",
            fontWeight: 700,
            color: BONE,
            fontSize: 42,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: 60,
          }}
        >
          All Big Game Covered
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {SPECIES_GRID.map((s, i) => (
            <motion.div
              key={s.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Link
                href={`/plan?species=${s.slug}`}
                className="block group"
                style={{
                  background: BARK,
                  border: `1px solid ${FENCE}`,
                  padding: 24,
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = AMBER;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = FENCE;
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{ color: AMBER }}>
                  <SpeciesSVG species={s.slug} />
                </div>
                <span style={{ fontFamily: "var(--font-dm-mono), monospace", fontWeight: 500, color: BONE, fontSize: 14 }}>
                  {s.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── SECTION 7: Free Tools ──────────────────────────────────────── */}
      <section style={{ padding: "120px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          style={{
            fontFamily: "var(--font-display), serif",
            fontWeight: 700,
            color: BONE,
            fontSize: 42,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: 60,
          }}
        >
          Your Full Hunting Toolkit
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-4">
          {TOOLS.map((tool, i) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: (i % 2) * 0.1 }}
            >
              <Link
                href={tool.href}
                className="block group"
                style={{
                  background: BARK,
                  border: `1px solid ${FENCE}`,
                  padding: 28,
                  display: "block",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = AMBER)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = FENCE)}
              >
                <ToolIcon kind={tool.icon} />
                <div
                  style={{
                    fontFamily: "var(--font-dm-mono), monospace",
                    fontWeight: 500,
                    color: BONE,
                    fontSize: 15,
                    marginTop: 16,
                  }}
                >
                  {tool.title}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-dm-mono), monospace",
                    color: DUST,
                    fontSize: 13,
                    marginTop: 6,
                    lineHeight: 1.5,
                  }}
                >
                  {tool.desc}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-dm-mono), monospace",
                    color: AMBER,
                    fontSize: 13,
                    marginTop: 16,
                  }}
                >
                  Explore →
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── SECTION 8: Comparison Table ────────────────────────────────── */}
      <section style={{ padding: "120px 24px", maxWidth: 1100, margin: "0 auto" }}>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          style={{
            fontFamily: "var(--font-display), serif",
            fontWeight: 700,
            color: BONE,
            fontSize: 42,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            marginBottom: 48,
          }}
        >
          Why Hunters Choose Tag Hunter
        </motion.h2>

        <div style={{ background: BARK, border: `1px solid ${FENCE}`, overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "20px 24px", fontFamily: "var(--font-dm-mono), monospace", fontSize: 12, color: DUST, textTransform: "uppercase", letterSpacing: "0.15em", borderBottom: `1px solid ${FENCE}`, fontWeight: 500 }}>
                  Feature
                </th>
                <th style={{ textAlign: "center", padding: "20px 24px", fontFamily: "var(--font-dm-mono), monospace", fontSize: 12, color: AMBER, textTransform: "uppercase", letterSpacing: "0.15em", borderBottom: `1px solid ${FENCE}`, fontWeight: 500 }}>
                  Tag Hunter
                </th>
                <th style={{ textAlign: "center", padding: "20px 24px", fontFamily: "var(--font-dm-mono), monospace", fontSize: 12, color: DUST, textTransform: "uppercase", letterSpacing: "0.15em", borderBottom: `1px solid ${FENCE}`, fontWeight: 500 }}>
                  Paid Service
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row, i) => {
                const [feat, ours, theirs] = row;
                const renderCell = (val: string | boolean) => {
                  if (val === true) return <span style={{ color: AMBER, fontSize: 18 }}>✦</span>;
                  if (val === false) return <span style={{ color: DUST }}>✗</span>;
                  return <span style={{ color: BONE, fontSize: 13 }}>{val as string}</span>;
                };
                return (
                  <tr key={feat as string} style={{ background: i % 2 === 0 ? BARK : "rgba(26, 23, 18, 0.6)" }}>
                    <td style={{ padding: "16px 24px", fontFamily: "var(--font-dm-mono), monospace", fontSize: 14, color: BONE, borderBottom: `1px solid ${FENCE}` }}>
                      {feat as string}
                    </td>
                    <td style={{ textAlign: "center", padding: "16px 24px", borderBottom: `1px solid ${FENCE}` }}>
                      {renderCell(ours)}
                    </td>
                    <td style={{ textAlign: "center", padding: "16px 24px", borderBottom: `1px solid ${FENCE}` }}>
                      {renderCell(theirs)}
                    </td>
                  </tr>
                );
              })}
              {/* Price row */}
              <tr style={{ background: BARK }}>
                <td style={{ padding: "24px", fontFamily: "var(--font-dm-mono), monospace", fontSize: 14, color: BONE, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Price
                </td>
                <td style={{ textAlign: "center", padding: "24px", fontFamily: "var(--font-display), serif", fontSize: 28, color: AMBER, fontWeight: 700 }}>
                  Free
                </td>
                <td style={{ textAlign: "center", padding: "24px", fontFamily: "var(--font-dm-mono), monospace", fontSize: 13, color: DUST }}>
                  $150–300/yr
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── SECTION 9: Ecosystem ───────────────────────────────────────── */}
      <section style={{ padding: "100px 24px", maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-dm-mono), monospace", color: DUST, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 32 }}>
          Works Alongside Your Favorite Tools
        </p>
        <div className="flex flex-wrap items-start justify-center gap-12 md:gap-20">
          {PARTNERS.map(p => (
            <div key={p.name} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-display), serif", fontSize: 22, color: BONE, opacity: 0.6, fontWeight: 700 }}>
                {p.name}
              </div>
              <div style={{ fontFamily: "var(--font-dm-mono), monospace", color: DUST, fontSize: 12, marginTop: 4 }}>
                {p.role}
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontFamily: "var(--font-dm-mono), monospace", color: DUST, fontSize: 11, marginTop: 32 }}>
          Not affiliated with or officially endorsed by any listed company.
        </p>
      </section>

      {/* ── SECTION 10: Email Capture ──────────────────────────────────── */}
      <section
        style={{
          padding: "120px 24px",
          background: "linear-gradient(180deg, #1A1712 0%, #221A0F 100%)",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--font-display), serif",
              fontWeight: 700,
              color: BONE,
              fontSize: 38,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
            }}
          >
            Stay Ahead of Every Draw Window
          </h2>
          <p
            style={{
              fontFamily: "var(--font-dm-mono), monospace",
              color: DUST,
              fontSize: 16,
              marginTop: 12,
              lineHeight: 1.6,
            }}
          >
            Draw odds from state CSVs, deadline push notifications, and more.
          </p>
          <div style={{ marginTop: 32 }}>
            <WaitlistForm source="homepage-redesign" />
          </div>
          <p style={{ fontFamily: "var(--font-dm-mono), monospace", color: DUST, fontSize: 12, marginTop: 12 }}>
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────── */}
      <footer style={{ background: SOIL, borderTop: `1px solid ${FENCE}`, padding: "48px 24px" }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 items-start">
          <div>
            <div style={{ fontFamily: "var(--font-display), serif", color: AMBER, fontSize: 18, fontWeight: 700 }}>
              ◎ TAG HUNTER
            </div>
            <p style={{ fontFamily: "var(--font-dm-mono), monospace", color: DUST, fontSize: 13, marginTop: 8 }}>
              Free western draw strategy. Built by hunters.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 md:justify-center" style={{ fontFamily: "var(--font-dm-mono), monospace", color: DUST, fontSize: 13 }}>
            <Link href="/about" style={{ color: DUST }}>About</Link>
            <span>·</span>
            <Link href="/faq" style={{ color: DUST }}>FAQ</Link>
            <span>·</span>
            <Link href="/feedback" style={{ color: DUST }}>Feedback</Link>
            <span>·</span>
            <Link href="/terms" style={{ color: DUST }}>Terms</Link>
            <span>·</span>
            <Link href="/privacy" style={{ color: DUST }}>Privacy</Link>
          </div>

          <div className="md:text-right" style={{ fontFamily: "var(--font-dm-mono), monospace", color: DUST, fontSize: 13 }}>
            Built by{" "}
            <a
              href="https://f21.ai"
              style={{ color: DUST, transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = AMBER)}
              onMouseLeave={e => (e.currentTarget.style.color = DUST)}
            >
              Factor21
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
